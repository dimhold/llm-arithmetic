# Transcript — 2026-08-12

Models: claude-haiku-4-5, claude-opus-5. Seed 20260812. Tools and MCP disabled.

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

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 38115.03
```

Parsed: 38115.03 · error: 0.0007% · reasoning tokens: 11835

### claude-opus-5

```
ANSWER: 38115.31
```

Parsed: 38115.31 · error: 0.0000% · reasoning tokens: 2563

## cash-1

**Question**

```
A company starts with $900,000 in cash. It spends a fixed $40,000 every month. Revenue is $18,000 in month 1 and grows 5.0% every month after that (month 2 revenue = month 1 revenue x 1.05, and so on). Cash after 60 months = starting cash + all revenue collected - all spend. What is it?
```

**Expected** (computed in code): 4864506.921884278

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: $4,864,308
```

Parsed: 4864308 · error: 0.0041% · reasoning tokens: 1547

### claude-opus-5

```
ANSWER: 4864506.92
```

Parsed: 4864506.92 · error: 0.0000% · reasoning tokens: 1395

## ltv-2

**Question**

```
ARPU is $240/month, gross margin is 78%, monthly customer churn is 2.4%. Using LTV = ARPU x gross margin / monthly churn, what is LTV?
```

**Expected** (computed in code): 7800.000000000001

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 7800
```

Parsed: 7800 · error: 0.0000% · reasoning tokens: 187

### claude-opus-5

```
ANSWER: 7800
```

Parsed: 7800 · error: 0.0000% · reasoning tokens: 27

## two-phase-3

**Question**

```
A SaaS starts at $26,000 MRR. Each month, in this exact order: MRR grows, then churn is applied to the grown figure. Growth is 9.0% for months 1 through 6, and 3.0% from month 7 onwards. Churn is 4.0% every month. What is MRR after 60 months?
```

**Expected** (computed in code): 18578.74834305274

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 18586
```

Parsed: 18586 · error: 0.0390% · reasoning tokens: 11085

### claude-opus-5

```
ANSWER: 18578.75
```

Parsed: 18578.75 · error: 0.0000% · reasoning tokens: 3811

## runway-4

**Question**

```
A company has $300,000 in cash and no revenue. Monthly burn is $60,000 in months 1, 2 and 3, then increases by $10,000 every 3 months (so it steps up in month 4, again in month 7, and so on). In which month number does the cash balance first go below zero?
```

**Expected** (computed in code): 5

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 5
```

Parsed: 5 · error: 0.0000% · reasoning tokens: 469

### claude-opus-5

```
ANSWER: 5
```

Parsed: 5 · error: 0.0000% · reasoning tokens: 112

## mrr-5

**Question**

```
A SaaS starts at $12,000 MRR. Each month, in this exact order: MRR first grows by 4.0%, then 3.5% of the resulting MRR churns away. What is MRR after 60 months?
```

**Expected** (computed in code): 14887.453040647115

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 14888.57
```

Parsed: 14888.57 · error: 0.0075% · reasoning tokens: 4581

### claude-opus-5

```
ANSWER: 14887.45
```

Parsed: 14887.45 · error: 0.0000% · reasoning tokens: 1217

## cash-6

**Question**

```
A company starts with $420,000 in cash. It spends a fixed $40,000 every month. Revenue is $18,000 in month 1 and grows 11.0% every month after that (month 2 revenue = month 1 revenue x 1.11, and so on). Cash after 36 months = starting cash + all revenue collected - all spend. What is it?
```

**Expected** (computed in code): 5822959.304807226

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 5817183.87
```

Parsed: 5817183.87 · error: 0.0992% · reasoning tokens: 4697

### claude-opus-5

```
ANSWER: 5822959
```

Parsed: 5822959 · error: 0.0000% · reasoning tokens: 1263

## ltv-7

**Question**

```
ARPU is $49/month, gross margin is 91%, monthly customer churn is 1.9%. Using LTV = ARPU x gross margin / monthly churn, what is LTV?
```

**Expected** (computed in code): 2346.842105263158

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: $2347.37
```

Parsed: 2347.37 · error: 0.0225% · reasoning tokens: 343

### claude-opus-5

```
ANSWER: 2346.84
```

Parsed: 2346.84 · error: 0.0001% · reasoning tokens: 156

## two-phase-8

**Question**

```
A SaaS starts at $9,000 MRR. Each month, in this exact order: MRR grows, then churn is applied to the grown figure. Growth is 9.0% for months 1 through 6, and 3.0% from month 7 onwards. Churn is 1.5% every month. What is MRR after 36 months?
```

**Expected** (computed in code): 21262.901931922686

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 21353
```

Parsed: 21353 · error: 0.4237% · reasoning tokens: 11961

### claude-opus-5

```
ANSWER: 21262.90
```

Parsed: 21262.9 · error: 0.0000% · reasoning tokens: 4839

## runway-9

**Question**

```
A company has $750,000 in cash and no revenue. Monthly burn is $60,000 in months 1, 2 and 3, then increases by $10,000 every 3 months (so it steps up in month 4, again in month 7, and so on). In which month number does the cash balance first go below zero?
```

**Expected** (computed in code): 11

### claude-haiku-4-5 (answered by claude-haiku-4-5-20251001)

```
ANSWER: 11
```

Parsed: 11 · error: 0.0000% · reasoning tokens: 535

### claude-opus-5

```
ANSWER: 11
```

Parsed: 11 · error: 0.0000% · reasoning tokens: 155
