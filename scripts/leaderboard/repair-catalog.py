#!/usr/bin/env python3
"""Offline normalization of earlier page extractions; no network requests.
Preserve source hashes/timestamps and mark the parser correction explicitly.
"""
import importlib.util
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
REPO=ROOT.parents[1]
spec=importlib.util.spec_from_file_location('scrape',ROOT/'scrape.py');scrape=importlib.util.module_from_spec(spec);spec.loader.exec_module(scrape)


def decode_old(value):
    if isinstance(value,str)and value.startswith('$$'):return value[1:]
    if isinstance(value,dict):return{k:decode_old(v)for k,v in value.items()if v!='$undefined'}
    if isinstance(value,list):return[None if v=='$undefined'else decode_old(v)for v in value]
    return value


def main():
    private=REPO/'private/manufact/catalog'
    files=list((ROOT/'catalog').glob('*.json'))+list(private.glob('*.json'))
    changed=0;inventory=[]
    for path in files:
        data=json.loads(path.read_text())
        if data.get('_provenance',{}).get('flight_parser_version',1)<2:
            data=decode_old(data)
            data.setdefault('_provenance',{})['flight_parser_version']=2
            data['_provenance']['offline_parser_correction']='Decoded escaped leading dollar literals and omitted Flight undefined properties; original HTML hash/timestamp retained.'
            changed+=1
        if '_published_tools'not in data:data['_published_tools']=scrape.faq_tools(data.get('_published_faq',[]))
        own=scrape.is_manufact(data)
        target=(private if own else ROOT/'catalog')/path.name
        scrape.save(target,data)
        if target!=path:path.unlink()
        if own:
            inventory.append({'slug':data['slug'],'name':data['name'],'catalog_score':(data.get('quality')or{}).get('score'),'website':((data.get('protocolMetadata')or{}).get('server')or{}).get('websiteUrl'),'publisher_faq':[q for q in data.get('_published_faq',[])if q.get('name','').startswith('Who develops')],'ownership_evidence_not_independently_verified':True})
            screen=ROOT/'screen'/path.name
            if screen.exists():
                destination=REPO/'private/manufact/other-screens'/path.name
                destination.parent.mkdir(parents=True,exist_ok=True)
                screen.rename(destination)
            history=ROOT/'attempt-history'/path.name
            if history.exists():
                destination=REPO/'private/manufact/attempt-history'/path.name
                destination.parent.mkdir(parents=True,exist_ok=True)
                history.rename(destination)
    scrape.save(REPO/'private/manufact/publisher-inventory.json',{'at':scrape.stamp(),'entries':inventory,'method':'Official names, server website URLs, or explicit catalog developer FAQ. Hosting on run.mcp-use.com and SDK/framework usage alone do not prove authorship. Many entries lack publisher fields.'})
    print(json.dumps({'catalog_files_checked':len(files),'older_parser_extractions_corrected':changed,'private_publisher_entries':len(inventory)}))

if __name__=='__main__':main()
