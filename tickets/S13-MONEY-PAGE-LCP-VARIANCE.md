## Context
During launch perf validation, `/hoc-cau-long-cho-nguoi-moi/` hit about `1.83s` LCP while the other three money pages clustered around `2.95s` to `3.20s` on the same commit range. Because all four pages share the same broad template and shipped without critical regressions, the remaining spread looks more like route-level data/cache variance than a structural rendering issue.

## Related Commits
- `accc769` `perf server render pricing cards`
- `3ed861f` `A1 degraded-route CLS fix`
- `e0606cf` `fix homepage smoke blockers`

## Hypothesis
Per-route Sanity fetch timing, ISR cache warmness, or route-level data differences are creating uneven first-hit behavior across otherwise similar money pages. The `nguoi-moi` route demonstrates that the current template can already achieve the target range when warm.

## Success Criteria
- We can explain why the four money pages do not cluster more tightly on first-run LCP.
- Route-level cache behavior is documented and reproducible.
- If needed, a follow-up fix reduces the slow-route cluster closer to the `nguoi-moi` profile without sacrificing content freshness.

## Investigation Paths
- Compare data payload size and Sanity response timing for all four money pages.
- Review `revalidate` behavior and confirm the pages warm consistently after deploy.
- Test whether a post-deploy warm-up request materially reduces the spread.
- Check whether one or more routes request richer Sanity content than the others.

## Notes
This ticket is intentionally narrow. Money pages already cleared the practical ship gate, so the goal is explanation and selective smoothing, not emergency optimization.

## Data point added 2026-09-04 (from the `S12` post-28-day review)

Not a re-ranking — one measurement recorded so the next person does not have to
re-derive it. Decoded HTML on production, same fetch method for all four:

| Route | Decoded HTML | LCP at launch (this ticket) |
|---|---|---|
| `/hoc-cau-long-cho-nguoi-moi/` | **102.2 KiB** | **1.83 s** (the fast outlier) |
| `/lop-cau-long-cho-nguoi-di-lam/` | 90.1 KiB | ~2.95–3.20 s |
| `/lop-cau-long-cuoi-tuan/` | 82.1 KiB | ~2.95–3.20 s |
| `/lop-cau-long-tre-em/` | 76.9 KiB | ~2.95–3.20 s |

**The fastest route carries the largest HTML.** So document weight does not explain
the spread, and the "richer Sanity content on the slow routes" line in
*Investigation Paths* is contradicted by the byte counts — it points the other way.
That leaves per-route fetch timing and ISR cache warmness as the live hypotheses.

Worth noting the launch LCP figures are lab numbers and the HTML sizes are from
today, so this is suggestive, not conclusive — but it is enough to stop anyone
spending a day on the payload-size theory first.
