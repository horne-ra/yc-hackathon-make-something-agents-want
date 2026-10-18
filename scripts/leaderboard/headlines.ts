/** Descriptive statistics from saved public metadata only; no network access. */
export function headlineNumbers(servers:any[],correlation:any){
 const counted=servers.filter(s=>typeof s.static_tool_tokens==='number').sort((a,b)=>a.static_tool_tokens-b.static_tool_tokens);
 const n=counted.length,middle=Math.floor(n/2);
 const highGrades=servers.filter(s=>s.grade==='A'||s.grade==='A+');
 return{
  label:'Static heuristics, not measured behavior',catalog_entries_screened:servers.length,
  complete_anonymous_tool_snapshots:servers.filter(s=>s.static_screen_status==='complete').length,
  available_token_counts:n,unavailable_token_counts:servers.filter(s=>s.token_status==='countTokens_failed').length,
  median_static_tool_tokens:n?(n%2?counted[middle].static_tool_tokens:(counted[middle-1].static_tool_tokens+counted[middle].static_tool_tokens)/2):null,
  p90_static_tool_tokens:n?counted[Math.ceil(n*.9)-1].static_tool_tokens:null,
  percentile_method:'Median averages the two middle observations for even n; p90 uses nearest rank ceil(0.9*n). Only available provider counts; one observation per catalog entry, without endpoint deduplication.',
  a_or_a_plus:{catalog_entries:highGrades.length,complete_live_audits:highGrades.filter(s=>s.static_screen_status==='complete').length,with_context_cost_flag:highGrades.filter(s=>(s.risk_flag_count??0)>0).length},
  largest:counted.slice(-10).reverse().map(s=>({name:s.name,slug:s.slug,static_tool_tokens:s.static_tool_tokens})),
  correlations:{all_name_matched:correlation.all_name_matched,identical_definition_only:correlation.identical_definition_only},
 };
}
export function headlineLines(h:ReturnType<typeof headlineNumbers>){
 const number=(n:number|null)=>n===null?'unavailable':n.toLocaleString('en-US');
 const all=h.correlations.all_name_matched,identical=h.correlations.identical_definition_only;
 return['## Headline numbers — static heuristics','',
  `Screened **${number(h.catalog_entries_screened)} public catalog entries**; **${number(h.complete_anonymous_tool_snapshots)}** yielded complete anonymous tool-definition snapshots. Among **${number(h.available_token_counts)}** available provider counts, median static tool-definition cost is **${number(h.median_static_tool_tokens)} tokens** and the 90th percentile is **${number(h.p90_static_tool_tokens)} tokens**. ${h.unavailable_token_counts} counts are unavailable. These describe static definitions, not runtime responses or measured behavior.`, '',
  `**${number(h.a_or_a_plus.with_context_cost_flag)} A or A+ entries** carry at least one context-cost heuristic flag, among ${number(h.a_or_a_plus.complete_live_audits)} A/A+ entries with a complete live audit (${number(h.a_or_a_plus.catalog_entries)} A/A+ entries in the public census). Unscreenable entries have unknown flags, not zero.`, '',
  `Static Spearman correlation of per-tool documentation score with context-cost flag count: **${all.spearman_documentation_score_vs_risk_count?.toFixed(3)??'undefined'}** (${all.tools} name-matched tools, ${all.servers} servers); **${identical.spearman_documentation_score_vs_risk_count?.toFixed(3)??'undefined'}** (${identical.tools} identical-definition tools, ${identical.servers} servers). No behavioral, causal, or significance claim.`, '',
  'Ten largest available static tool-definition costs (catalog entries; unavailable counts cannot be ranked):','',
  '| Server | Static tool-definition tokens |','|---|---:|',
  ...h.largest.map(s=>`| [${s.name.replaceAll('|','\\|')}](https://manufact.com/mcp-catalog/${encodeURIComponent(s.slug)}) | ${number(s.static_tool_tokens)} |`),'',
  'Median uses the middle observation(s); p90 uses nearest rank. Statistics include available counts only and retain distinct catalog entries that may share an endpoint. [Exact headline data and method](../scripts/leaderboard/headline-numbers.json).',''];
}
