// Creates/refreshes iteration directories and eval_metadata.json from evals.json.
// Idempotent: never touches outputs/, grading.json or timing.json.
//   node skills/_evals/setup-iteration.mjs <iteration-number> [runs-per-configuration]
//   node skills/_evals/setup-iteration.mjs 3 1
//
// Run outputs are written to .claude/skill-evals/iteration-<N>/, which is gitignored.
// They hold full transcripts and live data, so they must never be committed.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const workspace = join(root, ".claude", "skill-evals");

const iteration = process.argv[2];
if (!iteration) {
  console.error("usage: node skills/_evals/setup-iteration.mjs <iteration-number> [runs-per-configuration]");
  process.exit(1);
}
const runs = Number.parseInt(process.argv[3] ?? "1", 10);
const { evals } = JSON.parse(readFileSync(join(here, "evals.json"), "utf8"));

for (const evalCase of evals) {
  const evalDir = join(workspace, `iteration-${iteration}`, `eval-${evalCase.id}-${evalCase.name}`);
  const metadata = {
    eval_id: evalCase.id,
    eval_name: `${evalCase.id}. ${evalCase.name} (${evalCase.primary_skill})`,
    prompt: evalCase.prompt,
    assertions: evalCase.expectations,
  };
  const body = `${JSON.stringify(metadata, null, 2)}\n`;

  mkdirSync(evalDir, { recursive: true });
  writeFileSync(join(evalDir, "eval_metadata.json"), body);

  for (const config of ["with_skill", "without_skill"]) {
    for (let run = 1; run <= runs; run++) {
      const runDir = join(evalDir, config, `run-${run}`);
      mkdirSync(join(runDir, "outputs"), { recursive: true });
      // The viewer only looks in run-N/ or its parent, not the eval directory.
      writeFileSync(join(runDir, "eval_metadata.json"), body);
    }
  }

  console.log(`eval-${evalCase.id}-${evalCase.name}: ${evalCase.expectations.length} expectations, ${runs} run(s) per configuration`);
}
console.log(`\nWorkspace: ${join(workspace, `iteration-${iteration}`)}`);
