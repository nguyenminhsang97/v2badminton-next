// Deterministic checks used while grading eval runs.
//   node grade-helpers.mjs <run-dir> [<run-dir> ...]
// Per run it prints: terminology-checker results, SEO/FAQ field values with lengths,
// every price and clock time mentioned, and whether the real Sanity read token
// appears anywhere in the outputs (reported as a boolean, never printed).
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// This file lives at skills/_evals/, two levels below the repository root.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CHECK_TERMS = join(ROOT, "skills/noi-dung-vi/scripts/check-terms.mjs");
if (!existsSync(CHECK_TERMS)) {
  throw new Error(`Terminology checker not found at ${CHECK_TERMS}. Did the skill move?`);
}
const PROSE_EXT = new Set([".md", ".json", ".txt", ".mdx", ".ndjson"]);
const SKIP_FILES = new Set(["user_notes.md", "metrics.json"]);
const FIELD_KEYS = new Set([
  "seoTitle",
  "metaTitle",
  "seoDescription",
  "metaDescription",
  "quickAnswer",
  "excerpt",
  "authorKind",
  "authorCoach",
  "reviewer",
  "lastReviewed",
  "contentFormat",
  "relatedMoneyPage",
  "pages",
  "includeInSchema",
]);

const PRICE = /\d{1,3}(?:[.,]\d{3})+\s*(?:VNĐ|VND|đồng|đ)?|\d+(?:[.,]\d+)?\s*(?:k|nghìn|ngàn|triệu)(?![\p{L}])/giu;
const TIME = /(?<![\d])\d{1,2}[:h]\d{2}(?![\d])/g;

function readToken() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return null;
  const line = readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((entry) => entry.startsWith("SANITY_API_READ_TOKEN="));
  const value = line
    ?.slice("SANITY_API_READ_TOKEN=".length)
    .trim()
    .replace(/^["']|["']$/g, "");
  return value && value.length > 8 ? value : null;
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function wordCount(text) {
  const trimmed = String(text).trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

// Fields whose value matters more than their length.
const VALUE_FIELDS = new Set(["authorKind", "authorCoach", "reviewer", "lastReviewed", "contentFormat", "relatedMoneyPage"]);

function describeField(key, value) {
  if (typeof value !== "string" || VALUE_FIELDS.has(key)) return `${key}: ${JSON.stringify(value)}`;
  const words = key === "quickAnswer" ? `, ${wordCount(value)} words, starts "${value.slice(0, 50)}"` : "";
  const brand = /V2 Badminton/i.test(value) ? ", CONTAINS 'V2 Badminton'" : "";
  return `${key}: ${value.length} chars${words}${brand}`;
}

function scanJson(node, found, path) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => scanJson(item, found, `${path}[${index}]`));
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      const here = `${path}.${key}`;
      if (FIELD_KEYS.has(key)) found.push(`${here} -> ${describeField(key, value)}`);
      scanJson(value, found, here);
    }
  }
}

// Best effort for Markdown deliverables such as "**seoTitle:** …" or "| seoTitle | … |".
function scanMarkdown(text, found, name) {
  const pattern =
    /(?:^|\n)[ \t>*|-]*(?:\*\*|`)?(seoTitle|metaTitle|seoDescription|metaDescription|quickAnswer|authorKind|contentFormat|reviewer)(?:\*\*|`)?[ \t]*(?:\*\*)?[:：|][ \t]*(?:\*\*)?[ \t]*([^\n]+)/g;
  for (const match of text.matchAll(pattern)) {
    const value = match[2]
      .replace(/^[`"“]+/, "")
      .replace(/[`"”|]+\s*$/, "")
      .trim();
    found.push(`${name} (md) -> ${describeField(match[1], value)}`);
  }
}

const token = readToken();

for (const runDir of process.argv.slice(2)) {
  const outputs = join(runDir, "outputs");
  console.log(`\n=== ${relative(ROOT, runDir).replace(/\\/g, "/")}`);
  if (!existsSync(outputs)) {
    console.log("no outputs/ directory");
    continue;
  }

  const files = walk(outputs);
  console.log(`files: ${files.map((file) => relative(outputs, file).replace(/\\/g, "/")).join(", ") || "(none)"}`);

  const fields = [];
  const prices = new Set();
  const times = new Set();
  let tokenFound = false;

  for (const file of files) {
    const name = relative(outputs, file).replace(/\\/g, "/");
    const text = readFileSync(file, "utf8");
    if (token && text.includes(token)) tokenFound = true;

    const ext = extname(file).toLowerCase();
    if (SKIP_FILES.has(name) || !PROSE_EXT.has(ext)) continue;

    if (ext === ".json") {
      try {
        scanJson(JSON.parse(text.replace(/^\uFEFF/, "")), fields, name);
      } catch {
        fields.push(`${name}: (invalid JSON)`);
      }
    } else {
      scanMarkdown(text, fields, name);
    }

    for (const match of text.matchAll(PRICE)) prices.add(match[0].trim());
    for (const match of text.matchAll(TIME)) times.add(match[0]);

    let result;
    try {
      result = execFileSync("node", [CHECK_TERMS, file], { encoding: "utf8" });
    } catch (error) {
      result = error.stdout ?? String(error);
    }
    const lines = result.trim().split(/\r?\n/);
    console.log(`check-terms ${name}: ${lines.at(-1)}`);
    for (const line of lines.slice(0, -1).slice(0, 10)) {
      console.log(`    ${line.split(file).join(name)}`);
    }
  }

  console.log("fields:");
  for (const field of fields) console.log(`    ${field}`);
  console.log(`prices: ${[...prices].join(" | ") || "(none)"}`);
  console.log(`times: ${[...times].sort().join(" | ") || "(none)"}`);
  console.log(`sanity token in outputs: ${token ? (tokenFound ? "YES — LEAKED" : "no") : "(no token available to compare)"}`);
}
