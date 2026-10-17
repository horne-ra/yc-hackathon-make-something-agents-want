# One-time historical sandbox cleanup

October 17, 2026. The user explicitly authorized a one-time exception for completed/failed own test runs, including runs younger than two hours, after exported-file hash verification. Production retention code and its two-hour safeguards were not changed.

The command has a fixed allowlist of these historical UUIDs and is not called by production. An export-and-plan pass preceded execution. The S8 milestone was exported first. Immediately before each deletion, every available context/progress/result file was exported byte-for-byte, read back locally, and SHA-256 compared against a fresh remote read; sandbox labels and every process state were checked again. Only terminal runs with no queued/running/unknown processes were deleted. Historical stale progress markers were not mistaken for a live process when the final result and process were terminal.

| Deleted sandbox | Verified exported files |
| --- | --- |
| `axlint-run-470aab7c-82b1-4391-99ba-1862c49d4951` | context.json, progress.json, result.json |
| `axlint-run-d0119595-a705-4229-89ee-29b93d71d6db` | context.json, progress.json, result.json |
| `axlint-run-49279710-1dfa-4e6f-ad80-77992da8d99e` | context.json, progress.json, result.json |
| `axlint-run-5ce8aaba-bb3a-4410-9d49-03bd849f5f69` | context.json, progress.json, result.json |
| `axlint-run-f8cd9acc-efd8-4ae2-a138-54a040d03831` | progress.json, result.json |
| `axlint-run-f94f13bf-e7fb-41a7-a893-6b1206c60c4a` | progress.json, result.json |
| `axlint-run-e0aaa3be-cf54-4d77-9b2e-17fe41aed395` | progress.json, result.json |
| `axlint-run-78daa3da-4a36-41d2-a2e6-2d9d1df41247` | progress.json, result.json |
| `axlint-run-a1d95084-fb39-4bda-a970-97a230f0cd50` | progress.json, result.json |

**Deleted: 9. Settled occupancy: 1 deployed sandbox, 9 free slots of 10.** All 22 available files from deleted runs are saved, plus the milestone’s three files. Five old sandboxes never had context.json; those absent files remain explicitly recorded as missing. No existing available result file was omitted. Raw files and exact SHA-256 values are in [the execution manifest](../scripts/results/one-time-cleanup-2026-10-17T23-12-29.761Z/manifest.json). The earlier plan and its own byte-exact exports are also preserved under scripts/results/one-time-cleanup-2026-10-17T23-12-00.672Z/.

Kept `axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d`, the labeled shared runner. It preserves the original Improved S8 milestone and all six newer isolated runs, including the newest completed run ending `84c04a5a-2994-4018-b2c0-8b28098b36e9`. No spike sandbox was present; none was touched.

After cleanup, the deployed get_verification_result returned the original S8 milestone and both proposer checks as complete, each with 24 schema-valid trials. The newest completed run is still available live. All nine deletions had settled at the independent capacity read; no DELETING resources remained. Evidence: [post-cleanup check](../scripts/results/one-time-cleanup-2026-10-17T23-12-29.761Z/post-cleanup-check.json).

```text
PASS live milestone and both sequential proposer results retained; newest completed run is readable
PASS settled capacity: 1 occupied, 9 free slots
PASS Trackr unchanged at trackr-demo-001@ad88596baf761ec9b44abd019d3e8a90f84ceb96
PASS baseline tools hash: sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5
pnpm typecheck: PASS
```

The two previously pending proposer verifications already completed sequentially in the preceding authorized follow-up: full source/top three Improved 9/12 → 12/12, 115,194 → 13,272 returned tokens; tools-only/all findings Regressed 9/12 → 6/12, 115,194 → 59,010. They were checked through the live server again after cleanup, rather than repeated or replaced. All failures remain in the committed reports.

The user’s note that Trackr was patched describes the earlier S8 state. The authorized Part B reset had already completed before this request; this cleanup made no Trackr or Railway changes. Current baseline identity was independently verified above.

The user also confirmed that the new-format run widget renders correctly in the Claude app with Improved 9/12 → 12/12 and 24 trials. This closes C’s final human rendering check.
