#!/usr/bin/env python3
"""Public HTML collector. No API endpoints, credentials, or block evasion.

Usage: python3 scripts/leaderboard/scrape.py [--resume]
Every response is hashed; public Next.js page props are preserved as evidence.
The HTML contains the entire leaderboard. Filtering it covers every category,
community toggle, and Show more page without extra requests to forbidden APIs.
"""
import argparse
import datetime as dt
import hashlib
import html as html_module
import json
import re
import subprocess
import tempfile
import time
import urllib.parse
import urllib.robotparser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASE = 'https://manufact.com'
PRIVATE = ROOT.parents[1]/'private/manufact'
SNAPSHOT = PRIVATE/'source/leaderboard-snapshot.json'
UA = 'AX Lint hackathon research'


def stamp():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + '.tmp')
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    tmp.replace(path)


def flight(html):
    chunks = []
    for raw in re.findall(r'self\.__next_f\.push\((\[1,.*?\])\)</script>', html, re.S):
        chunks.append(json.loads(raw)[1])
    stream = ''.join(chunks).encode('utf-8')
    records = {}
    at = 0
    while at < len(stream):
        match = re.search(rb'([0-9a-f]+):', stream[at:])
        if not match:
            break
        key = match[1].decode()
        start = at + match.end()
        if stream[start:start + 1] == b'T':
            end = stream.index(b',', start)
            size = int(stream[start + 1:end], 16)
            records[key] = stream[end + 1:end + 1 + size].decode('utf-8')
            at = end + 1 + size
        else:
            end = stream.find(b'\n', start)
            if end < 0:
                end = len(stream)
            raw = stream[start:end].decode('utf-8')
            try:
                records[key] = json.loads(raw)
            except (ValueError, TypeError):
                pass
            at = end + 1
    def resolve(value, depth=0):
        if depth > 100:
            raise ValueError('Cyclic flight reference')
        if isinstance(value, str) and value.startswith('$$'):
            return value[1:]
        if isinstance(value, str) and re.fullmatch(r'\$[0-9a-f]+', value):
            return resolve(records.get(value[1:], value), depth + 1) if value[1:] in records else value
        if isinstance(value, dict):
            return {k: resolve(v, depth + 1) for k, v in value.items() if v != '$undefined'}
        if isinstance(value, list):
            return [resolve(v, depth + 1) for v in value]
        return value
    return stream.decode('utf-8'), resolve


def prop(html, name):
    stream, resolve = flight(html)
    marker = json.dumps(name) + ':'
    at = stream.index(marker) + len(marker)
    value, _ = json.JSONDecoder().raw_decode(stream[at:].lstrip())
    return resolve(value)


def evidence(html, url):
    return {'source_url': url, 'fetched_at': stamp(), 'html_sha256': hashlib.sha256(html.encode()).hexdigest(), 'flight_parser_version': 2}


def faq_tools(faq):
    for question in faq:
        if 'What tools does' not in question.get('name', ''):
            continue
        text = question.get('acceptedAnswer', {}).get('text', '')
        match = re.search(r'(?:including |these MCP tools: )(.+)', text)
        if not match:
            continue
        names = [part.strip() for part in re.split(r',|\s+and\s+', match[1].removesuffix('.'))]
        names = [name for name in names if name]
        count = re.search(r'lists (\d+) MCP tools', text)
        total = int(count[1]) if count else len(names)
        return {'count':total,'names':names,'names_complete':len(names)==total,'descriptions_shown':False,'source':'published FAQ (same names as visible imported tool chips)'}
    return {'count':None,'names':[],'names_complete':False,'descriptions_shown':False,'source':None}


def detail(html, url):
    initial = prop(html, 'initial')
    faq = []
    for raw in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S):
        try:
            doc = json.loads(raw)
            for obj in doc.get('@graph', []):
                if obj.get('@type') == 'FAQPage':
                    faq += obj.get('mainEntity', [])
        except ValueError:
            continue
    # FAQ text is the page's published text, never an inferred requirement.
    initial['_published_faq'] = faq
    initial['_published_tools'] = faq_tools(faq)
    markup = re.sub(r'<!--.*?-->', '', html, flags=re.S)
    visible = re.search(r'Tools \((\d+)\)</div><div[^>]*>(.*?)</div>', markup, re.S)
    if visible:
        names = [html_module.unescape(re.sub(r'<[^>]+>', '', value)) for value in re.findall(r'<code[^>]*>(.*?)</code>', visible[2], re.S)]
        initial['_published_tools'] = {'count':int(visible[1]),'names':names,'names_complete':len(names)==int(visible[1]),'descriptions_shown':False,'source':'visible imported tool chips'}
    initial['_provenance'] = evidence(html, url)
    # Embedded icons are irrelevant to metadata audit and can be megabytes.
    initial.pop('icon', None)
    initial.pop('iconVariants', None)
    return initial


class Blocked(RuntimeError):
    pass


class Fetcher:
    def __init__(self):
        self.last = 0
        self.robot = None
        self.requests = 0

    def get(self, url, robots=False):
        parsed = urllib.parse.urlsplit(url)
        if parsed.scheme != 'https' or parsed.netloc != 'manufact.com':
            raise ValueError('Collector only fetches https://manufact.com')
        if self.robot and not self.robot.can_fetch(UA, url):
            raise Blocked('robots.txt disallows ' + parsed.path)
        time.sleep(max(0, self.last + 1.05 - time.monotonic()))
        self.last = time.monotonic()
        with tempfile.TemporaryDirectory(prefix='axlint-scrape-') as directory:
            body, headers = Path(directory)/'body', Path(directory)/'headers'
            result = subprocess.run(['curl', '--silent', '--show-error', '--compressed', '--max-time', '15', '--max-redirs', '0', '-A', UA, '-D', str(headers), '-o', str(body), '-w', '%{http_code}', url], capture_output=True, text=True)
            self.requests += 1
            if result.returncode:
                raise RuntimeError('network_failure: curl exit ' + str(result.returncode))
            code = int(result.stdout)
            text = body.read_text(errors='replace')
            if code in (401, 403, 429) or re.search(r'<title>\s*(Just a moment|Access denied|Attention Required)', text, re.I):
                raise Blocked('Site blocks scraping: HTTP ' + str(code))
            if code != 200:
                raise RuntimeError('http_' + str(code))
            if robots:
                self.robot = urllib.robotparser.RobotFileParser()
                self.robot.parse(text.splitlines())
                (ROOT/'robots.txt').write_text(text)
            return text


def is_manufact(row):
    # mcp-use hosting alone is not publisher evidence.
    name = row.get('name', '').lower()
    website = ((row.get('protocolMetadata') or {}).get('server') or {}).get('websiteUrl', '')
    host = urllib.parse.urlsplit(website).hostname or ''
    faq = row.get('_published_faq', [])
    developers = ' '.join(q.get('acceptedAnswer', {}).get('text', '') for q in faq if q.get('name', '').startswith('Who develops'))
    return (bool(re.search(r'\bmanufact\b', name)) or ('mcp-use' in name and '.mcp-use.com' not in name) or host in {'manufact.com', 'mcp-use.com', 'docs.mcp-use.com'} or bool(re.search(r'developed by (?:Manufact|mcp-use)', developers, re.I)))


CATEGORIES = ['developer-tools','data-analytics','productivity','sales-and-marketing','marketing-seo','financial-services','communication','search-research','design-creative','automation-workflows','customer-support','commerce-shopping']


def category_of(row):
    for category in row.get('categories', []):
        category = 'sales-and-marketing' if category == 'sales-crm' else category
        if category in CATEGORIES:
            return category
    return None


def grade(score):
    return None if score is None else 'A+' if score >= 95 else 'A' if score >= 85 else 'B' if score >= 70 else 'C'


def ranks(items):
    views = {}
    for community in [False, True]:
        for category in ['all'] + CATEGORIES:
            members = [x for x in items if (community or x.get('curated')) and (category == 'all' or category_of(x) == category)]
            views[f'{category}:community_{str(community).lower()}'] = [{'slug':x['slug'],'rank':i+1,'show_more_page':i//100+1} for i,x in enumerate(members)]
    return views


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--resume', action='store_true')
    args = parser.parse_args()
    subprocess.run(['git', '-C', str(ROOT.parents[1]), 'check-ignore', '-q', 'private/manufact/'], check=True)
    fetch = Fetcher()
    started = stamp()
    manifest = {'started_at': started, 'status': 'running', 'user_agent': UA, 'minimum_request_interval_seconds': 1.05, 'requests_this_run': 0}
    try:
        fetch.get(BASE + '/robots.txt', robots=True)
        if args.resume and SNAPSHOT.exists():
            snapshot = json.loads(SNAPSHOT.read_text())
        else:
            html = fetch.get(BASE + '/mcp-catalog/leaderboard')
            snapshot = {'result': prop(html, 'initialResult'), 'provenance': evidence(html, BASE + '/mcp-catalog/leaderboard')}
            save(SNAPSHOT, snapshot)
        items = snapshot['result']['items']
        if len(items) != snapshot['result']['total'] or len({x['slug'] for x in items}) != len(items):
            raise ValueError('Incomplete or duplicate leaderboard dataset')
        views = ranks(items)
        save(PRIVATE/'source/views.json', {'source': snapshot['provenance'], 'page_size': 100, 'explanation': 'Full server-rendered initialResult; ordered slug lists cover every Show more page. Slice each list into pages of 100.', 'views': views})
        # Prioritize official-looking entries; hosting alone never proves ownership.
        def priority(x):
            url = urllib.parse.urlsplit(x['url'])
            return (0 if ('manufact' in (x['name']+' '+x['slug']).lower() or 'mcp-use' in x['name'].lower()) else 1, -(x.get('score') or -1), x['slug'])
        errors = []
        done = 0
        for row in sorted(items, key=priority):
            path = ROOT/'catalog'/(row['slug']+'.json')
            private_path = PRIVATE/'catalog'/(row['slug']+'.json')
            if args.resume and (path.exists() or private_path.exists()):
                done += 1
                continue
            url = BASE + '/mcp-catalog/' + urllib.parse.quote(row['slug'], safe='-')
            try:
                data = detail(fetch.get(url), url)
                if data.get('slug') != row['slug']:
                    raise ValueError('Detail slug differs from requested page')
                save(private_path if is_manufact(data) else path, data)
            except Blocked:
                raise
            except Exception as exc:
                errors.append({'slug': row['slug'], 'error': str(exc), 'at': stamp()})
                save(ROOT/'scrape-errors.json', errors)
            done += 1
            if done % 25 == 0 or done < 4:
                print(json.dumps({'completed': done, 'total': len(items), 'errors': len(errors), 'at': stamp()}), flush=True)
                manifest.update(completed=done, total=len(items), errors=errors, requests_this_run=fetch.requests, updated_at=stamp())
                save(ROOT/'scrape-progress.json', manifest)
        manifest.update(status='complete' if not errors else 'complete_with_errors', completed=done, total=len(items), errors=errors)
    except KeyboardInterrupt:
        manifest.update(status='interrupted', error='Collector interrupted; resume reuses saved pages.')
    except Blocked as exc:
        manifest.update(status='blocked_stop', error=str(exc))
        print(json.dumps({'STOP': str(exc)}), flush=True)
    finally:
        manifest.update(requests_this_run=fetch.requests, finished_at=stamp())
        save(ROOT/'scrape-progress.json', manifest)


if __name__ == '__main__':
    main()
