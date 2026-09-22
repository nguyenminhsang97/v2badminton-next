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

   Isolation matters more than it looks. In iteration 1 the baseline scored *higher* than the skills, because repo docs, an old skill copy and the owner's agent memory leaked the same knowledge in. See "Known weaknesses" for what still leaks.

   Mechanics that cost iteration 4 two of its eight outputs, and how to avoid them:
   - A Claude Code subagent with `isolation: "worktree"` **cannot write outside its worktree**, and its worktree is **deleted when it finishes** unless tracked files changed — files under the gitignored `.claude/` go with it. Have every run return `response.md`, `user_notes.md` and `metrics.json` in its final message between `=====FILE: <name>=====` markers, and save them from there. Code-writing runs keep their worktree; copy `git diff` and the new files into `outputs/files/`.
   - Eight Opus runs plus graders hit the plan's usage limit twice. Run in batches of about four; an interrupted agent resumes from its transcript with a message, it does not need restarting.
   - Concurrent runs **share the Browser pane**, so they can see each other's dev-server tabs. Run evals that start a dev server one at a time, or tell each run its own port and tab.
4. Grade each run with a separate agent following `grader-instructions.md`. Graders need no worktree: they write `grading.json` into the run directory.
5. Aggregate with skill-creator's `aggregate_benchmark.py`, and review with its `generate_review.py`.

Never send non-GET requests to production or mutate Sanity during a run or while grading.

## Results so far

| Iteration | Evals | With skills | Without | What it taught |
|---|---|---|---|---|
| 1 | 1–8 | 93.8% | 96.4% | The skills lost. Isolation was leaky, and four statements in the skills were wrong. Both fixed |
| 2 | 1–8 | **93.9%** | **85.6%** | Each fix turned into a measured win on the eval it was written for; E7 content was 9/10 vs 5/10 |
| 3 (2026-09-18) | 8, 9 | **16/16** | **12/16** | E8 9/9 vs 7/9, E9 7/7 vs 5/7. See below |
| 4 (2026-09-22) | 4, 6, 8, 9 | **31/33** (93.9%) | **30/33** (90.9%) | Sharpening worked on E9 only. E4 and E6 still tie; E8 went to the baseline by one. See below |

**Iteration 3** re-ran only the two evals that had something to prove.

- **E8 — the contradiction rule now works.** In iteration 2 the with_skill run read "do not pick between contradicting sources" and picked anyway (7/9, the same as without). This time `noi-dung-vi` runs `scripts/check-facts.mjs` as its own workflow step. The run used it, cited the documents on each side of each conflict, and put `[CẦN HLV XÁC NHẬN]` where the sources disagree. The without_skill run found the same conflicts but settled the 1-on-1 court question itself and wrote the result as fact. Its merged answer happens to match the owner's ruling, which it could not see — see the memory leak below.
- **E9 — first measurement of `analytics-report`.** Both runs found the map clicks through GA4's outbound `click` and matched all four courts, so that part does not discriminate. The difference was reporting discipline. The without_skill run did not name the property, turned 8 of 90 users into a rate, and drew a trend from single digits — all of which the skill forbids.

**Iteration 4** re-ran the four evals sharpened after iteration 3, against ground truth re-captured the same day.

| Eval | With | Without | What decided it |
|---|---|---|---|
| E4 coach stars | 7/7 | 7/7 | Still ties. The rule is in the repo twice — docs and the `seoRegression` test — so the environment teaches it. The one unscored difference favoured the **baseline**: it saw that the five real coach drafts lack a photo and a required field, while the with_skill run told the owner he could publish them "in 5 minutes" |
| E6 event type | 8/9 | 8/9 | Both failed the new expectation 9 and passed the other eight with the same design. The unscored difference favoured the **skill**: that run read Google's Event guidelines and emits `SportsEvent` only for events the public can join; the baseline emits it for internal tournaments too |
| E8 working-adults FAQs | 9/10 | 10/10 | Both had every fact right and both noticed the Khang Sport 11:30 block had vanished from Sanity. with_skill failed answer-first on one FAQ |
| E9 map clicks | 7/7 | 5/7 | Same numbers, re-verified by the grader. The baseline turned 10 of 94 visitors into a ratio, drew an August-vs-September trend, and named the property only in its notes — the reporting discipline `analytics-report` exists for, as in iteration 3 |

Read honestly: over four evals the skills are one expectation ahead, all of it on E9. That is not "the skills stopped helping" so much as "the repository caught up". Since iteration 3, `docs/tasks-in-progress.md` records the owner's rulings, test files encode the rating rule, and every run — with or without skills — gets the memory index and the skill descriptions in context (below). Knowledge that reaches every agent is good for the project; it just leaves these evals less to measure.

## What changed after iteration 3 (2026-09-22)

Each decision below comes from the grader's own `eval_feedback` on the runs, not from a guess about why a score tied.

- **E2 is now a regression check, not a measurement.** The grader traced the without_skill run to AGENTS.md (env at the repo root) plus one experiment: query Sanity with and without the token and tabulate. Knowledge the environment hands over, and that a single command reproduces, cannot measure a skill. Its `purpose` field says so; keep it running, don't read a tie as a verdict.
- **E4 now asks for something a repo doc doesn't answer.** The owner in the prompt has 30 five-star Facebook reviews and wants stars. Both earlier runs declined by citing a rule already written in `docs/`; declining now takes Google's actual eligibility rules, and expectation 7 asks what to do instead of "no".
- **E6 asks for one reason the code cannot show**: why the fetch helper keeps `perspective: "published"` with `useCdn: false`, or that a query embedding the type must purge that query's tags. Both earlier runs reproduced the file list from `court.ts` and `post.ts`; neither had to know why.
- **E8 expectation 9 was stale and is rewritten.** It sampled contradictions that the owner resolved on 2026-09-22, so it could no longer fail. It now asks for the cross-check itself (`check-facts.mjs`) and its result. New expectation 10 covers the 120-minute ruling, which `noi-dung-vi` now states: `schedule_block` still holds the 90- and 60-minute custom slots, so the temptation is still in the data.
- **E9 expectation 7 (dead GA4 token) is conditional now**, in `conditional_expectations`. While the token is healthy it passed vacuously and inflated the rate; graders record it as not applicable instead. Expectation 1 now requires the property **id**, which is the only part that separated the two runs, and `analytics-report` now tells the writer to quote it. Expectation 6 says outright that ratios and hedged trends fail. New expectation 8 covers the mistake neither run made but a naive report would: summing per-court user counts (6+5+3+2) into a total that de-duplicates to 8.

## What changed after iteration 4 (2026-09-22)

Only wording that was wrong; nothing tuned toward the configuration that won.

- **E4 is now a regression check** like E2. Sharpened once, it still ties, for a reason no prompt change fixes: the rule is encoded in the repo.
- **E8 expectation 10 said "does not publish the 90- or 60-minute custom slots"**, which read as "never mention those classes". The owner's ruling and `noi-dung-vi` forbid stating their **durations**; their times may be stated. The with_skill run followed the skill and was nearly failed for it. Reworded to the ruling.
- **E9 expectation 7 quoted example counts (6+5+3+2 → 8)** from an older window. It now states the rule without numbers that go stale.

Candidates, not added — each rests on a single run and would be written after seeing which configuration won it:
- E4: treats an unfinished draft as publishable as-is (the with_skill miss above).
- E6: emits Event structured data for an event the public cannot join (the baseline miss above).
- E9 expectation 4 no longer discriminates: T8 in `docs/tasks-in-progress.md` names the `share.google` link as Phúc Lộc's, so any run can find it.

## Known weaknesses

- **Isolation leaks, and `isolation: "worktree"` does not fix it.** Iteration 3's recipe said a worktree at another path keeps the memory out. It does not: Claude Code puts subagent worktrees under `.claude/worktrees/`, and all eight iteration-4 runs reported the owner's `MEMORY.md` index in their context. Channels measured in iteration 4:
  - the memory index, which summarises business rulings (who books the 1-on-1 court, the 120-minute session);
  - the list of skill names and one-line descriptions, injected into without_skill runs too;
  - `docs/tasks-in-progress.md`, which now records the rulings and even names eval paths;
  - the shared Browser pane between concurrent runs.

  Untested next step: run each configuration as a fresh top-level Claude Code session in a **separate clone outside this directory** (a plain `git clone`, not a worktree under `.claude/`), and confirm from its first reply whether a memory index is present. Until then, read a without_skill run's correct business fact as possibly leaked.
- **E3, E5 and E7 have never been re-measured** since iteration 2.
- One run per configuration, so a one-expectation difference on a single eval is within noise. Read the pattern across evals, not one score.
