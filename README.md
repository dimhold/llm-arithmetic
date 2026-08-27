![10 SaaS sums, no tools, four models](docs/hero.png)

# Can Anthropic's models do SaaS arithmetic without a calculator?

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22128841.svg)](https://doi.org/10.5281/zenodo.22128841)

Run date: 2026-08-16 (v2, four models). v1 on 2026-08-12 ran only the two ends,
opus and haiku; this version adds sonnet and fable and repeats all four in one
sitting. Headline numbers reproduced (opus 10/10, haiku 3/10). See `RESULTS.md`.

Ten pieces of arithmetic a founder actually asks for — MRR after N months, ending
cash, LTV, a growth rate that changes mid-timeline, runway with stepped burn —
given to **claude-opus-5**, **claude-sonnet-5**, **claude-haiku-4-5** and
**claude-fable-5** under identical conditions, with every tool taken away so each
model has to do the maths itself.

## Method

- **Isolation.** Built-in tools are disabled with `--tools ""` *and* MCP servers
  are disabled with `--strict-mcp-config --mcp-config no-mcp.json`. Both are
  needed: `--tools ""` alone still leaves MCP servers reachable, and a connected
  MCP that can run SQL would quietly do the arithmetic. Isolation was verified,
  not assumed — asked to read a local file containing a random string, the model
  answers that it has no Read tool.
- **Same everything.** Both models get the same ten questions, the same prompt
  ("Do not show any working... reply with exactly one line: `ANSWER: <number>`"),
  the same isolation.
- **Self-contained questions.** Each question states its own rule, e.g. "in this
  exact order: MRR first grows by 7.0%, then 2.4% of the resulting MRR churns
  away". A wrong answer is therefore an arithmetic error, not a disagreement
  about how to model a business.
- **Ground truth** is computed in `run.ts`, never by a model.
- **Deterministic task set.** Tasks are generated from seed `20260812`, so the
  same command reproduces the same ten questions.
- **The answering model is verified** against `modelUsage` in the CLI response
  rather than assumed from `--model`; a call that never reached the requested
  model fails loudly instead of being scored.
- **Rate limits are retried** with backoff and never counted as wrong answers.

## Not measured, on purpose

**Wall-clock time.** It measures the network as much as the model, and this run
was made on a slow connection. Reasoning-token counts are reported instead — they
come from the API response and do not depend on the link.

## Metric

Relative error `|answer − expected| / |expected|`, reported as: exact, within 1%,
within 5%, median and worst. **Exact** means the answer differs from the computed
value by no more than display rounding (relative error ≤ 1e-6) — a looser bar
would score a $199 miss on a $4.8M forecast as correct.

## Reproduce

```bash
npx tsx run.ts --n 10 --concurrency 2 --models "claude-opus-5,claude-sonnet-5,claude-haiku-4-5,claude-fable-5"
```

`results.json` holds every call; `transcript.md` holds every question and every
full reply.

## Scope

Ten problems, four models, one sitting, single-shot answers. Enough to compare four
models on the same tasks; not enough to state failure rates for either.

## Prior work

Checked 2026-08-27. The field is occupied end to end. This repo is a spot
check inside it, not a claim of novelty.

- [GSM8K](https://arxiv.org/abs/2110.14168) (2021) made multi-step arithmetic
  word problems the standard LLM measure and every model card since reports it.
- [FinQA](https://arxiv.org/abs/2109.00122) (2021) and
  [BizBench](https://arxiv.org/abs/2311.06602) (2023) cover numerical
  reasoning over financial and business material at dataset scale.
- [How well do Large Language Models perform in Arithmetic tasks?](https://arxiv.org/abs/2304.02015)
  (2023) measures raw arithmetic with no tools across model families.
- [wesm/llm-arithmetic-benchmark](https://github.com/wesm/llm-arithmetic-benchmark)
  (December 2025) runs tool-free arithmetic aggregation over CSV rows on
  current models, the same no calculator condition this repo uses.

Nothing here is first. What this repo keeps is the framing and the hygiene:
10 questions a founder actually types, a seeded generator so the task set
replays exactly and an isolation that also cuts MCP and is verified rather
than assumed. The answering model is checked against the API response instead
of the flag that requested it. It answers "can I trust this model with my own
runway maths" rather than ranking models on a leaderboard.
