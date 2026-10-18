#!/usr/bin/env python3
"""Scan every reachable commit/tree; never emit matched bytes or credential values.
Run with: python3 scripts/leaderboard/secret-scan.py
"""
import argparse
import datetime as dt
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ENV_FILES = [ROOT/'.env']
REPOS = [ROOT]
KEY_NAMES = {'AXLINT_API_TOKEN', 'MANUFACT_MCP_TOKEN', 'BL_API_KEY', 'ANTHROPIC_API_KEY'}

def git(repo, *args):
    return subprocess.check_output(['git', '-C', str(repo), *args], stderr=subprocess.DEVNULL)


def load_values():
    secrets = {}
    for path in ENV_FILES:
        if not path.is_file():
            continue
        for line in path.read_text().splitlines():
            match = re.match(r'\s*(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$', line)
            if not match:
                continue
            name, value = match.groups()
            if not (name in KEY_NAMES or re.search(r'(?:API_KEY|TOKEN|SECRET|PASSWORD)$', name)):
                continue
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            if len(value) >= 8:
                secrets.setdefault(name, set()).add(value.encode())
    return secrets

PATTERNS = {
    'PATTERN_ANTHROPIC_API_KEY': re.compile(rb'\bsk-ant-[A-Za-z0-9_-]{20,}'),
    'PATTERN_OPENAI_API_KEY': re.compile(rb'\bsk-(?:proj-)?[A-Za-z0-9_-]{30,}'),
    'PATTERN_GITHUB_TOKEN': re.compile(rb'\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})'),
    'PATTERN_AWS_ACCESS_KEY': re.compile(rb'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b'),
    'PATTERN_PRIVATE_KEY': re.compile(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
    'PATTERN_BEARER_TOKEN': re.compile(rb'(?i)\bBearer[ \t]+[A-Za-z0-9_~+./-]{20,}={0,2}'),
    'PATTERN_JWT': re.compile(rb'\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}'),
    'PATTERN_LITERAL_SECRET_ASSIGNMENT': re.compile(rb'''(?:AXLINT_API_TOKEN|MANUFACT_MCP_TOKEN|BL_API_KEY|ANTHROPIC_API_KEY|MCP_USE_API_KEY)["']?\s*[:=]\s*["']([A-Za-z0-9_.-]{16,})["']'''),
}


def scan_repo(repo, secrets):
    commits = git(repo, 'rev-list', '--all').decode().splitlines()
    blob_paths = {}
    hits = []
    pattern = re.compile(rb'(?i)(?:example|placeholder|dummy|your[-_]|test[-_]|offline|redacted)')
    def names(data):
        found = {name for name, values in secrets.items() if any(value in data for value in values)}
        for name, regex in PATTERNS.items():
            if any(not pattern.search(m.group()) for m in regex.finditer(data)):
                found.add(name)
        return sorted(found)
    for commit in commits:
        for name in names(git(repo, 'cat-file', 'commit', commit)):
            hits.append({'file': '(commit metadata)', 'commit': commit, 'variable': name})
        tree = git(repo, 'ls-tree', '-r', '-z', commit)
        for item in tree.split(b'\0'):
            if not item:
                continue
            meta, path = item.split(b'\t', 1)
            _, kind, oid = meta.split()
            if kind == b'blob':
                blob_paths.setdefault(oid, {}).setdefault(path.decode(errors='replace'), commit)
    proc = subprocess.Popen(['git', '-C', str(repo), 'cat-file', '--batch'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    for oid, paths in blob_paths.items():
        proc.stdin.write(oid + b'\n'); proc.stdin.flush()
        header = proc.stdout.readline().split()
        size = int(header[2]); data = proc.stdout.read(size); proc.stdout.read(1)
        found = names(data)
        for path, commit in paths.items():
            for name in found:
                hits.append({'file': path, 'commit': commit, 'variable': name})
    proc.stdin.close(); proc.wait()
    return {'repository': str(repo), 'commits_scanned': len(commits), 'unique_blobs_scanned': len(blob_paths), 'shallow': git(repo, 'rev-parse', '--is-shallow-repository').decode().strip() == 'true', 'hits': sorted(hits, key=lambda h:(h['file'], h['commit'], h['variable']))}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', action='append', type=Path, help='Repository or full-history mirror; repeat for multiple repos.')
    parser.add_argument('--env', action='append', type=Path, help='Additional local .env whose actual values are compared without printing.')
    args = parser.parse_args()
    if args.env: ENV_FILES.extend(args.env)
    repos = args.repo or REPOS
    secrets = load_values()
    report = {'scanned_at': dt.datetime.now(dt.timezone.utc).isoformat(), 'scope': 'All reachable commits and blobs in all fetched branches/tags. Each matching blob/path is reported at one reachable commit. Includes deleted historical files and commit metadata. Unreachable server-side or garbage-collected objects are not accessible.', 'exact_env_variables_compared': sorted(secrets), 'requested_env_variables_absent': sorted(KEY_NAMES - secrets.keys()), 'repositories': [scan_repo(repo, secrets) for repo in repos]}
    out = ROOT/'private/security/history-secret-scan.json'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=2)+'\n')
    # Only file, commit and variable name are ever printed for hits.
    for repo in report['repositories']:
        print(json.dumps({'repository': repo['repository'], 'commits_scanned': repo['commits_scanned'], 'unique_blobs_scanned': repo['unique_blobs_scanned'], 'hits': len(repo['hits'])}))
        for hit in repo['hits']:
            print(json.dumps(hit))

if __name__ == '__main__':
    main()
