#!/usr/bin/env python3
"""Offline coverage, metadata-dispatch, rate, and publication-boundary checks."""
import datetime as dt
import importlib.util
import json
import subprocess
import urllib.parse
from collections import Counter,defaultdict
from pathlib import Path
ROOT=Path(__file__).resolve().parent
REPO=ROOT.parents[1]


def load(path):
    return json.loads(path.read_text())


def main():
    dataset=load(ROOT/'servers.json');servers=dataset['servers'];source=load(REPO/'private/manufact/source/leaderboard-snapshot.json')
    private_slugs={f.stem for f in(REPO/'private/manufact/catalog').glob('*.json')}
    expected={s['slug']for s in source['result']['items']}-private_slugs
    actual={s['slug']for s in servers}
    assert len(actual)==len(servers) and actual==expected,'Public server census mismatch'
    assert not(private_slugs&actual),'Private server published in dataset'
    private_endpoints={load(f)['url'].rstrip('/')for f in(REPO/'private/manufact/catalog').glob('*.json')}
    assert not any(s['mcp_url'].rstrip('/')in private_endpoints for s in servers),'Private endpoint alias published'
    views=load(ROOT/'views.json')['views'];assert len(views)==26,'Category/community view missing'
    assert {x['slug']for x in views['all:community_true']}==expected,'Show more/community coverage incomplete'
    public_files=list((ROOT/'catalog').glob('*.json'))+list((ROOT/'screen').glob('*.json'))
    assert not any(f.stem in private_slugs for f in public_files),'Private entry in public evidence'
    subprocess.run(['git','-C',str(REPO),'check-ignore','-q','private/manufact/'],check=True)
    tracked=subprocess.check_output(['git','-C',str(REPO),'ls-files','private/']).decode()
    assert not tracked,'Private directory contains tracked files'
    methods=Counter();host_times=defaultdict(list);statuses=Counter();toolsets=0;tokens=Counter();metadata_requests=0
    for server in servers:
        statuses[server['static_screen_status']]+=1
        path=ROOT/'screen'/(server['slug']+'.json')
        if not path.exists():
            continue
        screen=load(path);live=screen['live'];analysis=screen.get('analysis')or{}
        for request in live.get('requests',[]):
            metadata_requests+=1
            assert request['method']in['GET','POST'],'Non-metadata HTTP request'
            for method in request.get('rpc_method','').split(','):
                if not method:continue
                methods[method]+=1
                assert method in['initialize','notifications/initialized','tools/list'],'Target RPC outside metadata boundary'
            if live.get('endpoint'):
                host=urllib.parse.urlsplit(live['endpoint']).netloc
                host_times[host].append(dt.datetime.fromisoformat(request['at'].replace('Z','+00:00')).timestamp())
        if 'tools'in live:
            toolsets+=1
            flattened=[tool for page in live['pages']for tool in page['tools']]
            assert live['tools']==flattened,'Full tools/list pagination not preserved'
            if analysis.get('static_tool_tokens')is not None:
                assert isinstance(analysis['static_tool_tokens'],int)and analysis['static_tool_tokens']>=0,'Invalid static token count'
            tokens[analysis.get('token_status','unavailable')]+=1
    intervals=[b-a for times in host_times.values()for a,b in zip(sorted(times),sorted(times)[1:])]
    # Timestamps have millisecond precision; allow 1 ms rounding tolerance.
    violations=[value for value in intervals if value<0.999]
    assert not violations,'Per-host request spacing below one second'
    # Exact configured values are compared entirely in memory. Never emit values.
    spec=importlib.util.spec_from_file_location('secret_scan',ROOT/'secret-scan.py');scanner=importlib.util.module_from_spec(spec);spec.loader.exec_module(scanner)
    values=scanner.load_values();secret_hits=[];pattern_hits=[]
    candidates=[REPO/'docs/leaderboard-scan.md']+[p for p in ROOT.rglob('*')if p.is_file()and p.suffix not in['.pyc','.tmp']]
    for path in candidates:
        data=path.read_bytes()
        for variable,alternatives in values.items():
            if any(value in data for value in alternatives):secret_hits.append({'file':str(path.relative_to(REPO)),'commit':'WORKTREE','variable':variable})
        for variable,pattern in scanner.PATTERNS.items():
            for match in pattern.finditer(data):
                if not __import__('re').search(rb'(?i)(?:example|placeholder|dummy|your[-_]|test[-_]|offline|redacted)',match.group()):
                    pattern_hits.append({'file':str(path.relative_to(REPO)),'commit':'WORKTREE','variable':variable});break
    for hit in secret_hits+pattern_hits:print(json.dumps(hit))
    assert not secret_hits,'Configured credential appears in public files'
    assert not pattern_hits,'Possible generic secret needs review before publication'
    report={'checked_at':dt.datetime.now(dt.timezone.utc).isoformat(),'collection_status':dataset['collection_status'],'public_server_census_complete':True,'public_server_count':len(servers),'detail_pages_collected':sum(s['detail_status']=='collected'for s in servers),'screen_statuses':dict(statuses),'tools_list_snapshots':toolsets,'metadata_http_requests':metadata_requests,'rpc_methods':dict(methods),'minimum_observed_public_host_interval_seconds':min(intervals)if intervals else None,'per_host_rate_violations':0,'full_tools_list_pages_verified':True,'public_configured_secret_matches':len(secret_hits),'public_generic_secret_pattern_matches':len(pattern_hits),'private_directory_ignored_and_untracked':True,'token_counts':dict(tokens)}
    (ROOT/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report))

if __name__=='__main__':main()
