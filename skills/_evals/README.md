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
| 3 (2026-09-18) | 8, 9 | **16/16** | **12/16** | E8 9/9 vs 7/9, E9 7/7 vs 5/7. See below |

**Iteration 3** re-ran only the two evals that had something to prove.

- **E8 — the contradiction rule now works.** In iteration 2 the with_skill run read "do not pick between contradicting sources" and picked anyway (7/9, the same as without). This time `noi-dung-vi` runs `scripts/check-facts.mjs` as its own workflow step. The run used it, cited the documents on each side of each conflict, and put `[CẦN HLV XÁC NHẬN]` where the sources disagree. The without_skill run found the same conflicts but settled the 1-on-1 court question itself and wrote the result as fact. Its merged answer happens to match the owner's ruling, which it could not see — see the memory leak below.
- **E9 — first measurement of `analytics-report`.** Both runs found the map clicks through GA4's outbound `click` and matched all four courts, so that part does not discriminate. The difference was reporting discipline. The without_skill run did not name the property, turned 8 of 90 users into a rate, and drew a trend from single digits — all of which the skill forbids.

## Known weaknesses

- **Evals 2, 4 and 6 do not discriminate**: both configurations pass them. They catch regressions but say nothing about whether a skill helps. Sharpen or retire them.
- **E9 expectations 3, 4 and 7 do not discriminate yet.** Both configurations found the outbound-click method. Expectation 7 (a dead GA4 token) only tests anything on a day the token is dead.
- **Agent memory leaks into both configurations.** Runs spawned from Claude Code in this repository get the owner's memory index in context. That index summarises business rulings, such as who books the 1-on-1 court. The grader traced the without_skill E8 answer to either chance or that index. Run evals from a session without project memory, or read a without_skill "correct" business fact as possibly leaked.
- **E8 does not check the 120-minute ruling.** Both iteration-3 runs listed the 90- and 60-minute custom slots in schedule FAQs. The owner ruled that public copy reports only the standard session; add an expectation for it once the FAQs are fixed.
- One run per configuration, so a one-expectation difference on a single eval is within noise. Read the pattern across evals, not one score.
