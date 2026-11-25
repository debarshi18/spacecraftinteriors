// Works around a Next.js static-export bug on Windows (runs automatically after `npm run build`).
//
// Next writes each page's prefetch file as `__next.<segment path with "/" → ".">.txt`, but on
// Windows the segment path uses "\" so it ends up nested instead, e.g.
//   out/about/__next.about/__PAGE__.txt      (written)
//   out/about/__next.about.__PAGE__.txt      (what the browser requests → 404 + console error)
// This moves every nested file to its flat name. On Linux/macOS builds there is nothing to do.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
let moved = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) flatten(dir, full);
    else walk(full);
  }
}

function flatten(parent, segmentDir) {
  const files = fs.readdirSync(segmentDir, { recursive: true, withFileTypes: true }).filter((e) => e.isFile());
  for (const f of files) {
    const src = path.join(f.parentPath, f.name);
    const rel = path.relative(segmentDir, src).split(path.sep).join(".");
    fs.renameSync(src, path.join(parent, `${path.basename(segmentDir)}.${rel}`));
    moved++;
  }
  fs.rmSync(segmentDir, { recursive: true });
}

if (fs.existsSync(OUT)) walk(OUT);
console.log(moved ? `fix-export-segments: flattened ${moved} prefetch file(s)` : "fix-export-segments: nothing to fix");
