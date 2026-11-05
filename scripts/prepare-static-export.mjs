// Prepares a CI checkout for `STATIC_EXPORT=1 next build` (GitHub Pages preview).
// Removes server-only features that static hosting cannot run, and swaps the
// form server actions for browser-only validation. Never run this in your
// working copy – it deletes files. CI runs it on a throwaway checkout.
import { cpSync, rmSync } from "node:fs";

if (!process.env.CI) {
  console.error("prepare-static-export: refusing to run outside CI (it deletes files).");
  process.exit(1);
}

for (const path of ["src/proxy.ts", "src/app/api", "src/app/[locale]/[...rest]"]) {
  rmSync(path, { recursive: true, force: true });
  console.log(`removed ${path}`);
}
cpSync("src/lib/forms/actions.static.ts", "src/lib/forms/actions.ts");
console.log("swapped form actions for browser-only validation");
