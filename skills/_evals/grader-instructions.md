# Grader instructions — v2badminton project skills

You grade finished evaluation runs. You do not redo the task.

Paths below are relative to the repository root.

## Inputs

- Process to follow: `agents/grader.md` in the skill-creator skill (Anthropic's `skill-creator`). Read it first.
- Expectations and ground truth: `skills/_evals/evals.json`. Use the `expectations` of the eval you are given, **verbatim and in order**, and the top-level `ground_truth_notes`. Read `ground_truth_notes.READ_FIRST` before trusting any entry.
- Run directories: `.claude/skill-evals/iteration-<N>/eval-<id>-<name>/<config>/run-<K>/`. Each has `outputs/` (response.md, user_notes.md, metrics.json, deliverables) and usually `timing.json`.
- There is no transcript. Treat `outputs/user_notes.md` and `outputs/metrics.json` as the process record, and verify claims against the deliverables and the repository.

## Tools you should use

- Deterministic checks — run for every run directory before judging:

  ```bash
  node skills/_evals/grade-helpers.mjs "<run dir 1>" "<run dir 2>" …
  ```

  It prints the terminology-checker result per output file, SEO/FAQ field values with lengths and word counts, every price and clock time mentioned, and whether the real Sanity token leaked (boolean only).
- To verify a code claim, read the proposed files under `outputs/files/` and, where needed, the current repository files. Grep proposed files case-insensitively (`clubEvent` vs `event`).
- To verify business facts, compare with `ground_truth_notes`. Only if a claim is not covered there, you may run a **read-only** authenticated Sanity MCP query (project `w58s0f53`, dataset `production`).
- For analytics evals (E9), numbers change daily: re-fetch them with the GA4 MCP for the same window the run used. Never grade against a count written in `ground_truth_notes`.

## Hard rules

- Do not modify anything in the repository except writing `grading.json` into the run directories you were given.
- No Sanity mutations, no non-GET HTTP requests.
- Never print a token, secret or credential value — report presence as a boolean.
- Do not read other iterations' grading files; grade on evidence.

## Judging

- PASS needs specific evidence of genuine completion. No partial credit. When uncertain, FAIL.
- Apply the same standard to with_skill and without_skill runs; judge the output, not the configuration.
- Terminology: `check-terms` warnings on English words used in their ordinary sense inside commentary (response.md quoting other pages, JSON `_type: "block"`) are not technique-term violations. Warnings inside reader-visible article/FAQ text are.
- "Does not state a contested claim as fact" (E8): contested claims are the ones marked CONTRADICTION in `ground_truth_notes."published FAQ policies"`. Where the owner has since ruled (`"owner rulings 2026-09-17"`), a run that states the ruled answer is not stating a contested claim.
- Isolation breaches — grade the output normally and record the breach in `user_notes_summary.needs_review`:
  - a without_skill run that reads `skills/` or `.claude/skills/`;
  - any run that reads Claude Code memory files, `.codex/`, or `skills/_evals/`.

## Output — one `grading.json` per run directory

Write `<run dir>/grading.json` with exactly these top-level fields (the viewer and aggregator read these names):

```json
{
  "expectations": [{ "text": "<verbatim expectation>", "passed": true, "evidence": "<specific quote or finding>" }],
  "summary": { "passed": 0, "failed": 0, "total": 0, "pass_rate": 0.0 },
  "execution_metrics": { "tool_calls": {}, "total_tool_calls": 0, "total_steps": 0, "errors_encountered": 0 },
  "timing": { "executor_duration_seconds": 0.0, "total_duration_seconds": 0.0, "note": "" },
  "claims": [{ "claim": "", "type": "factual|process|quality", "verified": true, "evidence": "" }],
  "user_notes_summary": { "uncertainties": [], "needs_review": [], "workarounds": [] },
  "eval_feedback": { "suggestions": [{ "assertion": "", "reason": "" }], "overall": "" }
}
```

- `execution_metrics`: copy from `outputs/metrics.json`.
- `timing`: copy `total_duration_seconds` from the run's `timing.json`; if it has `"incomplete": true`, copy its note too. If there is no `timing.json`, use 0 and say so in the note.
- `pass_rate` rounded to 2 decimals.
- On Windows, write the JSON with a file-writing tool, not a shell heredoc — heredocs corrupt backslashes and quotes there.

## Final reply

Reply with one line per run: `<config>/run-<K>: <passed>/<total>` plus the numbers of failed expectations, then one short paragraph on patterns that differ between with_skill and without_skill for this eval. Nothing else.
