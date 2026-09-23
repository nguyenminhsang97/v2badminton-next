#!/usr/bin/env node
// Fails when a project skill cites a file that no longer exists, or when the
// adapters that expose the skills to agents point at nothing.
//
//   node scripts/check-skill-paths.mjs
//
// Why: skills cite concrete paths, and those go stale silently when code moves.
// The predecessor .codex/skills had 25 of 26 paths pointing at a layout that no
// longer existed, and nobody knew until it misled an agent.
//
// What counts as a path: a `backtick` span in skills/*/SKILL.md that either
// starts with a repo root (apps/, packages/, docs/, skills/, scripts/, tickets/,
// .github/, .codex/, .claude/skills/) or ends in a source extension. Short
// forms such as `lib/locations.ts` are resolved against the app source roots;
// bare file names such as `QuickAnswer.tsx` must exist somewhere in the repo.
//
// Not checked: routes (`/gia-hoc-cau-long-tphcm/`), URLs, commands, files that
// only exist on the owner's machine (`~/…`, `.mcp.json`, and `.claude/…` other than
// `.claude/skills/`), and placeholders — write hypothetical paths with
// <angle-brackets> or *, e.g. `apps/web/src/app/<slug>/page.tsx`.
//
// Exit codes follow skills/noi-dung-vi/scripts/check-terms.mjs: 0 clean, 1 errors.
// Warnings (CẢNH BÁO) never fail the run.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(ROOT, "skills");

const REPO_ROOTS = ["apps/", "packages/", "docs/", "skills/", "scripts/", "tickets/", ".github/", ".codex/", ".claude/skills/"];
const SOURCE_EXT = /\.(?:ts|tsx|mjs|cjs|js|jsx|json|md|css|toml|ya?ml)$/;
const NOT_A_PATH = /[<>*{}$\s…=|]|^https?:|^\/|^\.\.?\//;
// Gitignored or outside the repo: present on the owner's machine, never in CI.
const LOCAL_ONLY = /^~|^\.claude\/(?!skills\/)|^\.env|^\.mcp\.json/;
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "dist", ".vercel", ".claude"]);

// Names a skill cites on purpose even though no such file is in the repo.
const NOT_REPO_FILES = new Map([
  ["gtag.js", "Google's analytics script, loaded from Google"],
  ["middleware.ts", "named only to say this repo uses proxy.ts instead"],
]);

// Paths a skill documents ahead of the code, because the pull request that adds
// them is still open — the skill marks those passages with the same "PR #N".
// Reported as warnings until the path exists; after that, the entry is reported
// as obsolete so it and the skill's notes get removed instead of rotting.
// Entry shape: ["apps/web/src/some/new/file.ts", "PR #N"].
const PENDING = new Map([]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const path = join(dir, name);
    out.push(relative(ROOT, path).replace(/\\/g, "/"));
    if (statSync(path).isDirectory()) walk(path, out);
  }
  return out;
}

let repoPaths;
function repo() {
  repoPaths ??= walk(ROOT);
  return repoPaths;
}

function stripLocation(span) {
  // `QuickAnswer.tsx:22`, `schema.ts:298-317`, `ci.yml#L10`
  return span.replace(/(?::\d+(?:-\d+)?|#L\d+(?:-L?\d+)?)$/, "");
}

function candidate(span) {
  if (NOT_A_PATH.test(span) || LOCAL_ONLY.test(span) || NOT_REPO_FILES.has(span)) return null;
  const path = stripLocation(span).replace(/\/$/, "");
  if (!path) return null;
  if (REPO_ROOTS.some((root) => `${path}/`.startsWith(root))) return { path, kind: "rooted" };
  if (!SOURCE_EXT.test(path)) return null;
  return { path, kind: "partial" };
}

function resolves({ path, kind }) {
  if (kind === "rooted") return existsSync(join(ROOT, path));
  // Short forms (`lib/locations.ts`, `schemaTypes/index.ts`) and bare names
  // (`QuickAnswer.tsx`) must match the end of some real path.
  return repo().some((entry) => entry === path || entry.endsWith(`/${path}`));
}

const errors = [];
const warnings = [];
const at = (file, line) => `${relative(ROOT, file).replace(/\\/g, "/")}:${line}:`;
const report = (file, line, message) => errors.push(`${at(file, line)} LỖI ${message}`);
const warn = (file, line, message) => warnings.push(`${at(file, line)} CẢNH BÁO ${message}`);

// 1. Every path a skill cites exists.
const skillNames = readdirSync(SKILLS_DIR).filter(
  (name) => !name.startsWith("_") && existsSync(join(SKILLS_DIR, name, "SKILL.md")),
);
let checked = 0;
for (const name of skillNames) {
  const file = join(SKILLS_DIR, name, "SKILL.md");
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  let inFence = false;
  lines.forEach((text, index) => {
    if (/^\s*```/.test(text)) inFence = !inFence;
    if (inFence) return;
    for (const match of text.matchAll(/`([^`\n]+)`/g)) {
      const found = candidate(match[1].trim());
      if (!found) continue;
      checked++;
      const pending = PENDING.get(found.path);
      if (resolves(found)) {
        // "đã có trên nhánh này", not "đã merge": this also fires on the pending
        // PR's own branch, where the path exists but nothing has merged yet.
        if (pending) warn(file, index + 1, `"${found.path}" đã có trên nhánh này — gỡ mục ${pending} khỏi PENDING trong scripts/check-skill-paths.mjs và gỡ các ghi chú (grep -rn "${pending}" skills/), trong chính ${pending} hoặc ngay sau khi nó merge`);
      } else if (pending) {
        warn(file, index + 1, `"${found.path}" chưa có trên nhánh này — chờ ${pending}`);
      } else {
        report(file, index + 1, `"${match[1]}" không tồn tại trong repo`);
      }
    }
  });
}

// 2. Each skill is exposed to Claude Code and Codex, and every adapter points at a real skill.
const pointerDir = join(ROOT, ".claude", "skills");
const pointers = existsSync(pointerDir) ? readdirSync(pointerDir) : [];
for (const name of skillNames) {
  if (!pointers.includes(name)) report(join(SKILLS_DIR, name, "SKILL.md"), 1, `skill "${name}" thiếu file trỏ đường .claude/skills/${name}/SKILL.md`);
}
for (const name of pointers) {
  const file = join(pointerDir, name, "SKILL.md");
  if (!existsSync(file)) continue;
  const target = `skills/${name}/SKILL.md`;
  if (!readFileSync(file, "utf8").includes(target)) report(file, 1, `file trỏ đường không nhắc tới ${target}`);
  if (!skillNames.includes(name)) report(file, 1, `trỏ tới skill "${name}" không tồn tại trong skills/`);
}

const codexConfig = join(ROOT, ".codex", "config.toml");
if (existsSync(codexConfig)) {
  const text = readFileSync(codexConfig, "utf8");
  const registered = new Set();
  text.split(/\r?\n/).forEach((line, index) => {
    const match = line.match(/^\s*path\s*=\s*"[^"]*[\\/]skills[\\/]+([^"\\/]+)[\\/]*"/);
    if (!match) return;
    registered.add(match[1]);
    if (!skillNames.includes(match[1])) report(codexConfig, index + 1, `đăng ký skill "${match[1]}" không tồn tại trong skills/`);
  });
  for (const name of skillNames) {
    if (!registered.has(name)) report(codexConfig, 1, `skill "${name}" chưa được đăng ký cho Codex`);
  }
}

for (const line of [...errors, ...warnings]) console.log(line);
console.log(`Kết quả: ${errors.length} lỗi, ${warnings.length} cảnh báo (${skillNames.length} skill, ${checked} đường dẫn đã kiểm).`);
process.exit(errors.length > 0 ? 1 : 0);
