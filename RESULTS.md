# Results — 2026-08-16 (v2, four models)

Ten arithmetic problems, four Anthropic models, no tools, no MCP, single-shot
answers. Expected values computed in code, never by a model.

v1 (2026-08-12) ran only the two ends of the range, claude-opus-5 and
claude-haiku-4-5. This run adds claude-sonnet-5 and claude-fable-5 and repeats
all four in one sitting, so "same questions, same prompt, same isolation, only
the model changed" still holds across the whole table. The v1 headline numbers
reproduced: opus 10/10, haiku 3/10.

**Note on claude-fable-5:** it is the model that ran this session. That does not
affect the score, because the ground truth is computed in `run.ts` and the model
never grades itself; it only submits an answer that the script checks.

| | opus-5 | sonnet-5 | haiku-4-5 | fable-5 |
|---|---|---|---|---|
| answered | 10 / 10 | 10 / 10 | 10 / 10 | 10 / 10 |
| exact | **10 / 10** | 9 / 10 | **3 / 10** | 9 / 10 |
| within 1% | 10 / 10 | 10 / 10 | 10 / 10 | 10 / 10 |
| worst error | 0.00% | 0.02% | **0.145%** | 0.00% |
| reasoning tokens (total) | 7,771 | 34,520 | **58,027** | 8,274 |
| reasoning tokens (median) | **936** | 3,281 | 7,051 | 1,148 |

"Exact" means the answer differs from the computed value by no more than display
rounding (relative error ≤ 1e-6).

## Per task

| task | expected | opus-5 | sonnet-5 | haiku-4-5 | fable-5 |
|---|---|---|---|---|---|
| `mrr-0` growth then churn, 36 mo | 38,115.31 | 38,115.31 | 38,115.31 | 38,115 (0.001%) | 38,115.34 |
| `cash-1` revenue vs fixed burn, 60 mo | 4,864,506.92 | 4,864,506.92 | 4,864,506.96 | 4,864,544.82 (0.001%) | 4,864,506.92 |
| `ltv-2` one division | 7,800.00 | 7,800 | 7,800 | 7,800 | 7,800 |
| `two-phase-3` growth switches at m6, 60 mo | 18,578.75 | 18,578.75 | 18,578.73 | 18,553 (0.139%) | 18,578.75 |
| `runway-4` stepped burn, month number | 5 | 5 | 5 | 5 | 5 |
| `mrr-5` growth then churn, 12 mo | 14,887.45 | 14,887.45 | 14,887.45 | 14,887.54 (0.001%) | 14,887.46 |
| `cash-6` revenue vs fixed burn, 60 mo | 5,822,959.30 | 5,822,959 | 5,822,959.31 | 5,831,410 (0.145%) | 5,822,959 |
| `ltv-7` one division | 2,346.84 | 2,346.84 | 2,347.37 (0.022%) | 2,346.32 (0.022%) | 2,346.84 |
| `two-phase-8` growth switches at m6, 60 mo | 21,262.90 | 21,262.90 | 21,262.91 | 21,271 (0.038%) | 21,263 |
| `runway-9` stepped burn, month number | 11 | 11 | 11 | 11 | 11 |

## What the numbers say

**Nobody refuses and nobody collapses.** All four answered every question and
every answer landed within 0.145% of the truth, which is already at odds with
the shorthand that language models cannot do arithmetic.

**"To the cent" is where they separate.** Exact matches: opus 10, sonnet 9,
fable 9, haiku 3. The difference is drift, not failure. haiku was never wildly
wrong, it was slightly wrong seven times out of ten. On `cash-6` that slight
wrongness is **$8,451 off** a five-year cash forecast, and nothing in the answer
signals it happened. The number simply looks right.

**More thinking did not buy accuracy, it went the other way.** haiku spent the
most reasoning of any model, 58,027 tokens, roughly 7.5x opus's 7,771, and
finished last at 3/10. opus was both the most accurate and the cheapest to
think. fable landed 9/10 on 8,274 tokens; sonnet landed the same 9/10 but spent
34,520 getting there.

**Difficulty concentrates where the rule changes.** The growth-switches-at-
month-6 problems and the long cash forecasts produced haiku's largest errors.
Straight compounding and single divisions were handled cleanly by all four.

## Scope

Ten problems, four models, one sitting, single-shot answers. This compares four
models on identical tasks. It does not establish a failure rate for any of them,
and says nothing about behaviour with tools enabled, which is how anyone would
actually run these in production. It measures the model alone, on purpose.
