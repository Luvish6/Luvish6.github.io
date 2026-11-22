import assert from "node:assert/strict";
import { openAsBlob } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { aggregateCsv, hillstromColumns, syntheticCsv } from "./csv.mjs";
import { analyze, sampleRatio } from "./stats.mjs";

const [mode, path] = process.argv.slice(2);
if (mode === "--trial" || mode === "--hillstrom") {
  const file = await openAsBlob(path);
  const start = performance.now();
  const counts = await aggregateCsv(file.stream(), mode === "--hillstrom" ? hillstromColumns : undefined);
  const result = analyze(counts.control, counts.treatment, .05);
  const srm = sampleRatio(counts.control.assigned, counts.treatment.assigned, .5);
  const milliseconds = performance.now() - start;
  console.log(JSON.stringify({ counts, result, srm, milliseconds, maxRssMiB: process.resourceUsage().maxRSS / 1024 }));
} else {
  const folder = await mkdtemp(join(tmpdir(), "ab-csv-"));
  const entry = fileURLToPath(import.meta.url);
  try {
    for (const rows of [10000, 100000, 1000000]) {
      const file = join(folder, "synthetic.csv");
      const fixture = syntheticCsv(rows);
      await pipeline(fixture.stream(), createWriteStream(file));
      const trials = Array.from({ length: 5 }, () => {
        const child = spawnSync(process.execPath, [entry, "--trial", file], { encoding: "utf8" });
        if (child.status !== 0) throw new Error(child.stderr || String(child.error));
        const result = JSON.parse(child.stdout);
        assert.equal(result.counts.records, rows);
        return result;
      });
      const times = trials.map(trial => trial.milliseconds).sort((a, b) => a - b);
      const memory = trials.map(trial => trial.maxRssMiB).sort((a, b) => a - b);
      console.log(JSON.stringify({
        rows, bytes: fixture.size, medianMs: times[2], rangeMs: [times[0], times.at(-1)],
        medianPeakRssMiB: memory[2], rangePeakRssMiB: [memory[0], memory.at(-1)],
        control: trials[0].counts.control, treatment: trials[0].counts.treatment
      }));
    }
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
}
