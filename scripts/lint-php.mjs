// Syntax-checks every PHP file in the WordPress theme with `php -l`.
// Skips with a warning when PHP isn't installed, so the check never blocks a
// machine without PHP; CI always has it.

import { execFileSync, spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = "wpTheme";

/** Every .php file under `dir`, recursively. */
function phpFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return phpFiles(path);
    return e.name.endsWith(".php") ? [path] : [];
  });
}

if (spawnSync("php", ["-v"]).status !== 0) {
  console.warn("lint:php skipped: PHP is not installed.");
  process.exit(0);
}

let failed = 0;
for (const file of phpFiles(ROOT)) {
  try {
    execFileSync("php", ["-l", file], { stdio: "pipe" });
  } catch (e) {
    failed++;
    process.stderr.write(e.stdout?.toString() || e.message);
  }
}
if (failed) process.exit(1);
console.log("lint:php: all PHP files OK");
