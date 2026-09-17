# Skill evals

The test set for the project skills in `skills/`. It is not a skill — no agent loads it — and agents doing ordinary work in this repo should not read it, because it contains the expected answers.

It exists to answer one question with evidence: **does a skill make an agent's work better than the same agent without it?** Every eval runs twice, once with the skills available and once without, and both runs are graded against the same fixed expectations.

## What is here

| File | Purpose |
|---|---|
| `evals.json` | Nine realistic owner requests, each with graded expectations, plus `ground_truth_notes` — the facts a grader checks against |
| `setup-iteration.mjs` | Creates the run directories for an iteration |
| `grade-helpers.mjs` | Deterministic checks a grader runs first: terminology, SEO field lengths, prices and times mentioned, token leakage |
| `grader-instructions.md` | What a grading agent reads |

| Eval | Skill | Task |
|---|---|---|
| 1 | `v2badminton-next` | Add a district page for Quận 7 |
| 2 | `v2badminton-next` | Local pricing table is empty — is Sanity data lost? |
| 3 | `seo` | Rename a money-page URL |
| 4 | `seo` | Add JSON-LD and five-star ratings to the coach page |
| 5 | `sanity-cms` | Published a price, the page still shows the old one |
| 6 | `sanity-cms` | Add an "event" document type with its own pages |
| 7 | `noi-dung-vi` | Write a beginner article on the clear |
| 8 | `noi-dung-vi` | Write five FAQs for the working-adults page |
| 9 | `analytics-report` | Did anyone click the court maps last month? |

## Running an iteration

Outputs go to `.claude/skill-evals/`, which is gitignored. Runs contain full agent output and live business data, so they are never committed — only this definition set is.

1. **Re-capture `ground_truth_notes` first.** They are a dated snapshot of Sanity and the code. Grading against stale truth fails good runs and passes bad ones.
2. `node skills/_evals/setup-iteration.mjs <N> [runs-per-configuration]`
3. For each eval, run the prompt as a fresh agent twice, saving to `outputs/` in the run directory:
   - **with_skill** — the relevant `skills/<name>/SKILL.md` available;
   - **without_skill** — told not to read `skills/`, `.claude/skills/`, `.codex/`, `skills/_evals/` or any agent memory files.

   Isolation matters more than it looks. In iteration 1 the baseline scored *higher* than the skills, because repo docs, an old skill copy and the owner's agent memory leaked the same knowledge in.
4. Grade each run with a separate agent following `grader-instructions.md`.
5. Aggregate with skill-creator's `aggregate_benchmark.py`, and review with its `generate_review.py`.

Never send non-GET requests to production or mutate Sanity during a run or while grading.

## Results so far

| Iteration | Evals | With skills | Without | What it taught |
|---|---|---|---|---|
| 1 | 1–8 | 93.8% | 96.4% | The skills lost. Isolation was leaky, and four statements in the skills were wrong. Both fixed |
| 2 | 1–8 | **93.9%** | **85.6%** | Each fix turned into a measured win on the eval it was written for; E7 content was 9/10 vs 5/10 |
| — | 9 | not run | not run | Added 2026-09-17 after `analytics-report` was corrected against live GA4. No baseline yet |

## Known weaknesses

- **Evals 2, 4 and 6 do not discriminate**: both configurations pass them. They catch regressions but say nothing about whether a skill helps. Sharpen or retire them.
- **E8 exposes a skill failure prose did not fix.** The with_skill run read the "do not pick between contradicting sources" rule and still picked. It needs a mechanical check, not more wording.
- One run per configuration in iteration 2, so a one-expectation difference on a single eval is within noise. Read the pattern across evals, not one score.
