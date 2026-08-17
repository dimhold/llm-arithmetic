/**
 * Can Anthropic's models do SaaS arithmetic with no calculator?
 *
 * Same tasks, same prompt, same isolation, across the models you pass. Tools are disabled
 * (`--tools ""`) AND MCP servers are disabled (`--strict-mcp-config` with an
 * empty config), so a model cannot shell out or query anything — it either does
 * the arithmetic itself or it doesn't.
 *
 *   npx tsx run.ts [--n 10] [--concurrency 2]
 *                  [--models claude-opus-5,claude-sonnet-5,claude-haiku-4-5,claude-fable-5]
 *
 * Deliberately NOT measured: wall-clock time. It would measure the network, not
 * the model. Reasoning-token counts are recorded instead — they do not depend on
 * the connection.
 *
 * Outputs: results.json (raw, per call) and transcript.md (every prompt, every
 * full reply), both regenerated from scratch on each run.
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

function arg(name: string, fallback: string): string {
  const argv = process.argv.slice(2);
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1]! : fallback;
}

const N = Number(arg("n", "10"));
const CONCURRENCY = Number(arg("concurrency", "2"));
const MODELS = arg("models", "claude-opus-5,claude-sonnet-5,claude-haiku-4-5,claude-fable-5").split(",").map((m) => m.trim()).filter(Boolean);
const RUN_DATE = arg("date", new Date().toISOString().slice(0, 10)); // date only, no time

/** Deterministic PRNG: the same seed always yields the same task set. */
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

const SEED = 20260812;
/** Relative error below which two answers differ only by display rounding. */
const EXACT = 1e-6;
const rnd = lcg(SEED);
const pick = <T,>(xs: T[]): T => xs[Math.floor(rnd() * xs.length)]!;
const round = (x: number, d: number) => Number(x.toFixed(d));

type Kind = "mrr" | "cash" | "ltv" | "two-phase" | "runway";

interface Task {
  id: string;
  kind: Kind;
  months: number | null;
  question: string;
  want: number;
}

function makeTasks(n: number): Task[] {
  const tasks: Task[] = [];
  const horizons = [12, 36, 60];

  for (let i = 0; i < n; i++) {
    const kind = (["mrr", "cash", "ltv", "two-phase", "runway"] as const)[i % 5]!;
    const months = pick(horizons);

    if (kind === "mrr") {
      const mrr0 = pick([8000, 12000, 21500, 34000]);
      const growth = round(pick([0.04, 0.07, 0.09, 0.12]), 4);
      const churn = round(pick([0.012, 0.024, 0.035, 0.05]), 4);
      tasks.push({
        id: `mrr-${i}`,
        kind,
        months,
        want: mrr0 * Math.pow((1 + growth) * (1 - churn), months),
        question:
          `A SaaS starts at $${mrr0.toLocaleString("en-US")} MRR. Each month, in this exact order: ` +
          `MRR first grows by ${(growth * 100).toFixed(1)}%, then ${(churn * 100).toFixed(1)}% of the resulting MRR churns away. ` +
          `What is MRR after ${months} months?`,
      });
      continue;
    }

    if (kind === "cash") {
      const cash0 = pick([180000, 250000, 420000, 900000]);
      const burn = pick([28000, 40000, 65000]);
      const rev0 = pick([9000, 18000, 31000]);
      const growth = round(pick([0.05, 0.08, 0.11]), 4);
      tasks.push({
        id: `cash-${i}`,
        kind,
        months,
        want: cash0 + rev0 * ((Math.pow(1 + growth, months) - 1) / growth) - burn * months,
        question:
          `A company starts with $${cash0.toLocaleString("en-US")} in cash. It spends a fixed $${burn.toLocaleString("en-US")} every month. ` +
          `Revenue is $${rev0.toLocaleString("en-US")} in month 1 and grows ${(growth * 100).toFixed(1)}% every month after that ` +
          `(month 2 revenue = month 1 revenue x ${(1 + growth).toFixed(2)}, and so on). ` +
          `Cash after ${months} months = starting cash + all revenue collected - all spend. What is it?`,
      });
      continue;
    }

    if (kind === "ltv") {
      const arpu = pick([49, 85, 129, 240]);
      const margin = round(pick([0.72, 0.78, 0.84, 0.91]), 4);
      const churn = round(pick([0.012, 0.019, 0.024, 0.035]), 4);
      tasks.push({
        id: `ltv-${i}`,
        kind,
        months: null,
        want: (arpu * margin) / churn,
        question:
          `ARPU is $${arpu}/month, gross margin is ${(margin * 100).toFixed(0)}%, monthly customer churn is ${(churn * 100).toFixed(1)}%. ` +
          `Using LTV = ARPU x gross margin / monthly churn, what is LTV?`,
      });
      continue;
    }

    // Growth rate changes mid-timeline: the shortcut is two powers, not one.
    if (kind === "two-phase") {
      const mrr0 = pick([9000, 14000, 26000]);
      const fast = round(pick([0.09, 0.12, 0.15]), 4);
      const slow = round(pick([0.02, 0.03, 0.04]), 4);
      const churn = round(pick([0.015, 0.025, 0.04]), 4);
      const switchAt = 6;
      let mrr = mrr0;
      for (let m = 1; m <= months; m++) mrr = mrr * (1 + (m <= switchAt ? fast : slow)) * (1 - churn);
      tasks.push({
        id: `two-phase-${i}`,
        kind,
        months,
        want: mrr,
        question:
          `A SaaS starts at $${mrr0.toLocaleString("en-US")} MRR. Each month, in this exact order: MRR grows, then churn is applied to the grown figure. ` +
          `Growth is ${(fast * 100).toFixed(1)}% for months 1 through ${switchAt}, and ${(slow * 100).toFixed(1)}% from month ${switchAt + 1} onwards. ` +
          `Churn is ${(churn * 100).toFixed(1)}% every month. What is MRR after ${months} months?`,
      });
      continue;
    }

    // Answer is a month number, not an amount.
    const cash0 = pick([300000, 480000, 750000]);
    const burn0 = pick([32000, 45000, 60000]);
    const step = pick([4000, 7000, 10000]);
    let cash = cash0;
    let burn = burn0;
    let m = 0;
    while (m < 600) {
      m++;
      if (m > 1 && (m - 1) % 3 === 0) burn += step;
      cash -= burn;
      if (cash < 0) break;
    }
    tasks.push({
      id: `runway-${i}`,
      kind: "runway",
      months: null,
      want: m,
      question:
        `A company has $${cash0.toLocaleString("en-US")} in cash and no revenue. Monthly burn is $${burn0.toLocaleString("en-US")} in months 1, 2 and 3, ` +
        `then increases by $${step.toLocaleString("en-US")} every 3 months (so it steps up in month 4, again in month 7, and so on). ` +
        `In which month number does the cash balance first go below zero?`,
    });
  }
  return tasks;
}

const PROMPT_PREFIX =
  "Answer the question below. Do not show any working, do not explain. " +
  "Reply with exactly one line in the form:\nANSWER: <number>";

function cliArgs(model: string): string[] {
  return [
    "-p",
    "--output-format",
    "json",
    "--model",
    model,
    "--tools",
    '""',
    "--strict-mcp-config",
    "--mcp-config",
    join(HERE, "no-mcp.json"),
  ];
}

interface Envelope {
  result?: unknown;
  model?: unknown;
  is_error?: boolean;
  api_error_status?: unknown;
  modelUsage?: Record<string, unknown>;
  usage?: { output_tokens?: number; output_tokens_details?: { thinking_tokens?: number } };
}

interface CallResult {
  raw: string;
  answeredBy: string;
  thinkingTokens: number;
  outputTokens: number;
}

/** The model that answered, taken from modelUsage. Absent = the call never reached it. */
function verifyModel(env: Envelope, requested: string): string {
  const keys = env.modelUsage && typeof env.modelUsage === "object" ? Object.keys(env.modelUsage) : [];
  const match = keys.find((k) => k.includes(requested));
  if (match) return match;
  if (keys.length) throw new Error(`requested ${requested} but modelUsage shows only [${keys.join(", ")}]`);
  return typeof env.model === "string" && env.model ? env.model : requested;
}

function callOnce(model: string, prompt: string): Promise<CallResult> {
  return new Promise((resolve, reject) => {
    const child = spawn("claude", cliArgs(model), { shell: true, windowsHide: true });
    let out = "";
    let err = "";
    child.stdout.on("data", (d: Buffer) => (out += d.toString("utf8")));
    child.stderr.on("data", (d: Buffer) => (err += d.toString("utf8")));
    child.on("error", reject);
    child.on("close", () => {
      let env: Envelope;
      try {
        env = JSON.parse(out) as Envelope;
      } catch {
        return reject(new Error(`non-JSON output: ${(out || err).slice(0, 300)}`));
      }
      if (env.is_error) {
        const status = Number(env.api_error_status);
        const e = new Error(`${status || ""} ${String(env.result).slice(0, 200)}`.trim()) as Error & { retryable?: boolean };
        e.retryable = status === 429 || status >= 500;
        return reject(e);
      }
      try {
        resolve({
          raw: String(env.result ?? ""),
          answeredBy: verifyModel(env, model),
          thinkingTokens: env.usage?.output_tokens_details?.thinking_tokens ?? 0,
          outputTokens: env.usage?.output_tokens ?? 0,
        });
      } catch (e) {
        reject(e as Error);
      }
    });
    child.stdin.write(prompt, "utf8");
    child.stdin.end();
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Environment failures (rate limits, transient 5xx) are retried so they never
 *  get mistaken for a model getting the answer wrong. */
async function call(model: string, prompt: string, attempts = 5): Promise<CallResult> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await callOnce(model, prompt);
    } catch (e) {
      last = e;
      if (!(e as { retryable?: boolean }).retryable) throw e;
      await sleep(5000 * Math.pow(2, i));
    }
  }
  throw last;
}

/** Last "ANSWER: <number>" wins; tolerates $, commas, trailing prose. */
function parseAnswer(raw: string): number | null {
  const matches = [...raw.matchAll(/ANSWER:\s*\$?\s*(-?[\d,]+(?:\.\d+)?)/gi)];
  const last = matches.at(-1);
  if (!last) return null;
  const n = Number(last[1]!.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

interface Row {
  id: string;
  kind: Kind;
  months: number | null;
  model: string;
  answeredBy: string;
  want: number;
  got: number | null;
  relError: number | null;
  thinkingTokens: number;
  outputTokens: number;
  raw: string;
  error?: string;
}

async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      for (;;) {
        const i = next++;
        if (i >= items.length) return;
        results[i] = await fn(items[i]!);
      }
    })
  );
  return results;
}

const tasks = makeTasks(N);
const jobs = MODELS.flatMap((model) => tasks.map((task) => ({ model, task })));
console.log(`${tasks.length} tasks x ${MODELS.length} models = ${jobs.length} calls`);
console.log(`models: ${MODELS.join(", ")}\ntools: disabled, mcp: disabled, seed: ${SEED}, date: ${RUN_DATE}\n`);

let done = 0;
const rows = await pool(jobs, CONCURRENCY, async ({ model, task }): Promise<Row> => {
  const base = { id: task.id, kind: task.kind, months: task.months, model, want: task.want };
  try {
    const r = await call(model, `${PROMPT_PREFIX}\n\n${task.question}`);
    const got = parseAnswer(r.raw);
    const relError = got === null ? null : Math.abs(got - task.want) / Math.abs(task.want);
    done++;
    console.log(
      `[${done}/${jobs.length}] ${model} ${task.id}: want ${task.want.toFixed(2)} got ${got ?? "unparsed"}` +
        (relError === null ? "" : ` (${(relError * 100).toFixed(3)}%)`)
    );
    return { ...base, answeredBy: r.answeredBy, got, relError, thinkingTokens: r.thinkingTokens, outputTokens: r.outputTokens, raw: r.raw };
  } catch (e) {
    done++;
    console.log(`[${done}/${jobs.length}] ${model} ${task.id}: FAILED ${String(e).slice(0, 140)}`);
    return { ...base, answeredBy: model, got: null, relError: null, thinkingTokens: 0, outputTokens: 0, raw: "", error: String(e).slice(0, 300) };
  }
});

function summarize(subset: Row[]) {
  const scored = subset.filter((r) => r.relError !== null) as (Row & { relError: number })[];
  const errs = scored.map((r) => r.relError).sort((a, b) => a - b);
  const within = (p: number) => scored.filter((r) => r.relError <= p).length;
  const thinking = subset.map((r) => r.thinkingTokens).sort((a, b) => a - b);
  return {
    n: subset.length,
    answered: scored.length,
    // "exact" means the answer differs only by display rounding (1e-6 relative).
    // A looser threshold would paint a $199 miss on a $4.8M forecast as correct.
    exact: within(EXACT),
    within1pct: within(0.01),
    within5pct: within(0.05),
    median: errs.length ? errs[Math.floor(errs.length / 2)]! : NaN,
    worst: errs.at(-1) ?? NaN,
    medianThinking: thinking.length ? thinking[Math.floor(thinking.length / 2)]! : 0,
  };
}

const pct = (x: number) => (Number.isFinite(x) ? (x * 100).toFixed(2) + "%" : "n/a");
console.log("\n=== summary ===");
for (const model of MODELS) {
  const s = summarize(rows.filter((r) => r.model === model));
  console.log(
    `${model.padEnd(20)} answered ${s.answered}/${s.n}  exact ${s.exact}  <=1% ${s.within1pct}  <=5% ${s.within5pct}  ` +
      `median ${pct(s.median)}  worst ${pct(s.worst)}  median reasoning tokens ${s.medianThinking}`
  );
}

const OUT = join(HERE, "results.json");
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify({ date: RUN_DATE, seed: SEED, models: MODELS, prompt: PROMPT_PREFIX, cliArgs: cliArgs("<model>"), tasks, rows }, null, 2) + "\n",
  "utf8"
);

const transcript = [
  `# Transcript — ${RUN_DATE}`,
  "",
  `Models: ${MODELS.join(", ")}. Seed ${SEED}. Tools and MCP disabled.`,
  "",
  "Command (prompt over stdin):",
  "",
  "```",
  `claude ${cliArgs("<model>").join(" ").replace(join(HERE, "no-mcp.json"), "no-mcp.json")}`,
  "```",
  "",
  "Expected values are computed in `run.ts`, never by a model.",
  "",
  ...tasks.flatMap((task) => [
    `## ${task.id}`,
    "",
    "**Question**",
    "",
    "```",
    task.question,
    "```",
    "",
    `**Expected** (computed in code): ${task.want}`,
    "",
    ...MODELS.flatMap((model) => {
      const r = rows.find((x) => x.id === task.id && x.model === model);
      if (!r) return [];
      return [
        `### ${model}${r.answeredBy !== model ? ` (answered by ${r.answeredBy})` : ""}`,
        "",
        "```",
        (r.raw || r.error || "(no reply)").trim(),
        "```",
        "",
        `Parsed: ${r.got ?? "unparsed"} · error: ${r.relError === null ? "n/a" : (r.relError * 100).toFixed(4) + "%"} · reasoning tokens: ${r.thinkingTokens}`,
        "",
      ];
    }),
  ]),
].join("\n");
writeFileSync(join(HERE, "transcript.md"), transcript, "utf8");

console.log(`\nresults    -> ${OUT}`);
console.log(`transcript -> ${join(HERE, "transcript.md")}`);
