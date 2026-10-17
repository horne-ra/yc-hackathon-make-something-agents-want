# Upstream filesystem PR draft

Draft only; no pull request has been opened. Diff base: `modelcontextprotocol/servers@bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c`.

## PR title

Clarify recursive tree size and excludePatterns guidance in filesystem tool metadata

## PR body

# PR Description — #1077

---

## Summary

Clarify when to exclude dependency and Git directories from filesystem listings so MCP clients can avoid unnecessarily large recursive responses. Related to [issue #1077](https://github.com/modelcontextprotocol/servers/issues/1077), which reports tree responses too large for prompts, and builds on the existing excludePatterns support introduced in [PR #623](https://github.com/modelcontextprotocol/servers/pull/623). This changes three model-visible descriptions; it does not implement the depth parameter requested by #1077 or claim to close that issue.

---

## What Changed

- **Tool guidance**: directory_tree explains that it returns the entire recursive tree and recommends excluding node_modules/.git or using list_directory for a top-level view.
- **Parameter guidance**: directory_tree.excludePatterns and search_files.excludePatterns share concrete exclusion examples. Names, input types, defaults, requiredness and handlers remain unchanged.
- **Behavioral benchmark**: scored passes rose **4/9 → 9/9** on preregistered synthetic project tasks with Claude Sonnet 5.5, all 14 tools visible and a read-only execution allowlist. Overview rose 0/3 → 3/3, test lookup 1/3 → 3/3, and package.json control held 3/3. The baseline test-lookup group disagreed across trials; the candidate group's token counts also varied. All trials are retained. **Provisional: 3 trials per condition.** This is a demonstration, not a statistical claim.
- **Real-repository size measurement**: after npm ci on [Commander.js v13.1.0, commit e6f56c888c96d1339c2b974fee7e6ba4f2e3d218](https://github.com/tj/commander.js/tree/e6f56c888c96d1339c2b974fee7e6ba4f2e3d218), directory_tree returned **1,037,509 full-response tokens** with no exclusions versus **19,443** with ["node_modules", ".git"] (**9,985 → 219 file entries**). These count both content and structuredContent in the complete serialized MCP response, so repeated tree content is included. This separate measurement uses countTokens only: no model selected arguments, consumed the result, or performed tasks on Commander. It illustrates available response-size control; it does not extend the benchmark pass-rate claim to a real repository.
- **Static-token cost**: the frozen three-description candidate increases the full visible tool-definition cost **3,143 → 3,315 tokens (+172)**. Result size and static cost are separate measurements.
- **Tests**: the exact diff applies to the pinned base, compiles, and reproduces the frozen candidate tools/list exactly, including all unchanged metadata. The AX Lint merge passes typecheck and all 66 tests. The full upstream unit suite was not rerun for this draft.

---

## Files Modified

| Area | File | Change |
| ---- | ---- | ------ |
| Filesystem tool metadata | `src/filesystem/server.ts` | Add recursive-size guidance and two excludePatterns descriptions; three description changes only |

---

## Exact diff

The following is the frozen candidate's original diff with portable paths; description wording is unchanged. Revalidate applicability against upstream HEAD before opening the PR. Evidence is in [filesystem-results.md](filesystem-results.md); no new behavioral benchmark was run for this draft.

```diff
diff --git a/src/filesystem/server.ts b/src/filesystem/server.ts
--- a/src/filesystem/server.ts
+++ b/src/filesystem/server.ts
@@ -110,7 +110,7 @@
 
 const DirectoryTreeArgsSchema = z.object({
   path: z.string(),
-  excludePatterns: z.array(z.string()).optional().default([]),
+  excludePatterns: z.array(z.string()).optional().default([]).describe("Names or glob patterns to skip, e.g. node_modules, .git, dist. Strongly recommended on code projects."),
 });
 
 const MoveFileArgsSchema = z.object({
@@ -121,7 +121,7 @@
 const SearchFilesArgsSchema = z.object({
   path: z.string(),
   pattern: z.string(),
-  excludePatterns: z.array(z.string()).optional().default([]),
+  excludePatterns: z.array(z.string()).optional().default([]).describe("Names or glob patterns to skip, e.g. node_modules, .git, dist. Strongly recommended on code projects."),
 });
 
 const GetFileInfoArgsSchema = z.object({
@@ -604,7 +604,8 @@
         "Get a recursive tree view of files and directories as a JSON structure. " +
         "Each entry includes 'name', 'type' (file/directory), and 'children' for directories. " +
         "Files have no children array, while directories always have a children array (which may be empty). " +
-        "The output is formatted with 2-space indentation for readability. Only works within allowed directories.",
+        "The output is formatted with 2-space indentation for readability. Only works within allowed directories." +
+        " Returns the entire recursive tree; on code projects it can be extremely large (hundreds of thousands of tokens when node_modules or .git are included). Use excludePatterns such as [\"node_modules\", \".git\"], or list_directory for a top-level view.",
       inputSchema: jsonSchema2020(DirectoryTreeArgsSchema.shape),
       outputSchema: jsonSchema2020({ content: z.string() }),
       annotations: { readOnlyHint: true, openWorldHint: false },
```
