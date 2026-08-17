# Transcript — 2026-08-16

Models: claude-opus-5, claude-sonnet-5, claude-haiku-4-5, claude-fable-5. Seed 20260812. Tools and MCP disabled.

Command (prompt over stdin):

```
claude -p --output-format json --model <model> --tools "" --strict-mcp-config --mcp-config no-mcp.json
```

Expected values are computed in `run.ts`, never by a model.

## mrr-0

**Question**

```
A SaaS starts at $8,000 MRR. Each month, in this exact order: MRR first grows by 7.0%, then 2.4% of the resulting MRR churns away. What is MRR after 36 months?
```

**Expected** (computed in code): 38115.30678167854

### claude-opus-5

```
ANSWER: 38115.31
```

Parsed: 38115.31 · error: 0.0000% · reasoning tokens: 936

### claude-sonnet-5

```
ANSWER: 38115.31
```

Parsed: 38115.31 · error: 0.0000% · reasoning tokens: 5896

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: $38,115
```

Parsed: 38115 · error: 0.0008% · reasoning tokens: 7710

### claude-fable-5

```
ANSWER: 38115.34
```

Parsed: 38115.34 · error: 0.0001% · reasoning tokens: 1430

## cash-1

**Question**

```
A company starts with $900,000 in cash. It spends a fixed $40,000 every month. Revenue is $18,000 in month 1 and grows 5.0% every month after that (month 2 revenue = month 1 revenue x 1.05, and so on). Cash after 60 months = starting cash + all revenue collected - all spend. What is it?
```

**Expected** (computed in code): 4864506.921884278

### claude-opus-5

```
ANSWER: 4864506.92
```

Parsed: 4864506.92 · error: 0.0000% · reasoning tokens: 1018

### claude-sonnet-5

```
ANSWER: 4864506.96
```

Parsed: 4864506.96 · error: 0.0000% · reasoning tokens: 3281

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 4864544.82
```

Parsed: 4864544.82 · error: 0.0008% · reasoning tokens: 3873

### claude-fable-5

```
ANSWER: 4864506.92
```

Parsed: 4864506.92 · error: 0.0000% · reasoning tokens: 1182

## ltv-2

**Question**

```
ARPU is $240/month, gross margin is 78%, monthly customer churn is 2.4%. Using LTV = ARPU x gross margin / monthly churn, what is LTV?
```

**Expected** (computed in code): 7800.000000000001

### claude-opus-5

```
ANSWER: 7800
```

Parsed: 7800 · error: 0.0000% · reasoning tokens: 27

### claude-sonnet-5

```
ANSWER: 7800
```

Parsed: 7800 · error: 0.0000% · reasoning tokens: 0

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 7800
```

Parsed: 7800 · error: 0.0000% · reasoning tokens: 161

### claude-fable-5

```
ANSWER: 7800
```

Parsed: 7800 · error: 0.0000% · reasoning tokens: 33

## two-phase-3

**Question**

```
A SaaS starts at $26,000 MRR. Each month, in this exact order: MRR grows, then churn is applied to the grown figure. Growth is 9.0% for months 1 through 6, and 3.0% from month 7 onwards. Churn is 4.0% every month. What is MRR after 60 months?
```

**Expected** (computed in code): 18578.74834305274

### claude-opus-5

```
ANSWER: 18578.75
```

Parsed: 18578.75 · error: 0.0000% · reasoning tokens: 1665

### claude-sonnet-5

```
ANSWER: 18578.73
```

Parsed: 18578.73 · error: 0.0001% · reasoning tokens: 10793

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 18553
```

Parsed: 18553 · error: 0.1386% · reasoning tokens: 13085

### claude-fable-5

```
ANSWER: 18578.75
```

Parsed: 18578.75 · error: 0.0000% · reasoning tokens: 1148

## runway-4

**Question**

```
A company has $300,000 in cash and no revenue. Monthly burn is $60,000 in months 1, 2 and 3, then increases by $10,000 every 3 months (so it steps up in month 4, again in month 7, and so on). In which month number does the cash balance first go below zero?
```

**Expected** (computed in code): 5

### claude-opus-5

```
ANSWER: 5
```

Parsed: 5 · error: 0.0000% · reasoning tokens: 90

### claude-sonnet-5

```
ANSWER: 5
```

Parsed: 5 · error: 0.0000% · reasoning tokens: 133

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 5
```

Parsed: 5 · error: 0.0000% · reasoning tokens: 355

### claude-fable-5

```
ANSWER: 5
```

Parsed: 5 · error: 0.0000% · reasoning tokens: 104

## mrr-5

**Question**

```
A SaaS starts at $12,000 MRR. Each month, in this exact order: MRR first grows by 4.0%, then 3.5% of the resulting MRR churns away. What is MRR after 60 months?
```

**Expected** (computed in code): 14887.453040647115

### claude-opus-5

```
ANSWER: 14887.45
```

Parsed: 14887.45 · error: 0.0000% · reasoning tokens: 338

### claude-sonnet-5

```
ANSWER: 14887.45
```

Parsed: 14887.45 · error: 0.0000% · reasoning tokens: 1403

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 14887.54
```

Parsed: 14887.54 · error: 0.0006% · reasoning tokens: 10160

### claude-fable-5

```
ANSWER: 14887.46
```

Parsed: 14887.46 · error: 0.0000% · reasoning tokens: 488

## cash-6

**Question**

```
A company starts with $420,000 in cash. It spends a fixed $40,000 every month. Revenue is $18,000 in month 1 and grows 11.0% every month after that (month 2 revenue = month 1 revenue x 1.11, and so on). Cash after 36 months = starting cash + all revenue collected - all spend. What is it?
```

**Expected** (computed in code): 5822959.304807226

### claude-opus-5

```
ANSWER: 5822959
```

Parsed: 5822959 · error: 0.0000% · reasoning tokens: 1440

### claude-sonnet-5

```
ANSWER: 5822959.31
```

Parsed: 5822959.31 · error: 0.0000% · reasoning tokens: 5427

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 5831410
```

Parsed: 5831410 · error: 0.1451% · reasoning tokens: 7051

### claude-fable-5

```
ANSWER: 5822959
```

Parsed: 5822959 · error: 0.0000% · reasoning tokens: 1585

## ltv-7

**Question**

```
ARPU is $49/month, gross margin is 91%, monthly customer churn is 1.9%. Using LTV = ARPU x gross margin / monthly churn, what is LTV?
```

**Expected** (computed in code): 2346.842105263158

### claude-opus-5

```
ANSWER: 2346.84
```

Parsed: 2346.84 · error: 0.0001% · reasoning tokens: 45

### claude-sonnet-5

```
ANSWER: 2347.37
```

Parsed: 2347.37 · error: 0.0225% · reasoning tokens: 33

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 2346.32
```

Parsed: 2346.32 · error: 0.0222% · reasoning tokens: 421

### claude-fable-5

```
ANSWER: 2346.84
```

Parsed: 2346.84 · error: 0.0001% · reasoning tokens: 42

## two-phase-8

**Question**

```
A SaaS starts at $9,000 MRR. Each month, in this exact order: MRR grows, then churn is applied to the grown figure. Growth is 9.0% for months 1 through 6, and 3.0% from month 7 onwards. Churn is 1.5% every month. What is MRR after 36 months?
```

**Expected** (computed in code): 21262.901931922686

### claude-opus-5

```
ANSWER: 21262.9
```

Parsed: 21262.9 · error: 0.0000% · reasoning tokens: 2055

### claude-sonnet-5

```
ANSWER: 21262.91
```

Parsed: 21262.91 · error: 0.0000% · reasoning tokens: 7349

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 21271
```

Parsed: 21271 · error: 0.0381% · reasoning tokens: 14239

### claude-fable-5

```
ANSWER: 21263
```

Parsed: 21263 · error: 0.0005% · reasoning tokens: 2161

## runway-9

**Question**

```
A company has $750,000 in cash and no revenue. Monthly burn is $60,000 in months 1, 2 and 3, then increases by $10,000 every 3 months (so it steps up in month 4, again in month 7, and so on). In which month number does the cash balance first go below zero?
```

**Expected** (computed in code): 11

### claude-opus-5

```
ANSWER: 11
```

Parsed: 11 · error: 0.0000% · reasoning tokens: 157

### claude-sonnet-5

```
ANSWER: 11
```

Parsed: 11 · error: 0.0000% · reasoning tokens: 205

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 11
```

Parsed: 11 · error: 0.0000% · reasoning tokens: 972

### claude-fable-5

```
ANSWER: 11
```

Parsed: 11 · error: 0.0000% · reasoning tokens: 101
