// Adds the files GitHub Pages needs to the static export in ./out.
import { copyFileSync, existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const home = `${base}/sv/`;

const page = (title) => `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<title>${title}</title>
<script>location.replace("${home}");</script>
<noscript><meta http-equiv="refresh" content="0; url=${home}"></noscript>
</head>
<body><a href="${home}">Ubis AID</a></body>
</html>
`;

// Root has no page (all routes live under /sv and /en): send visitors to Swedish.
writeFileSync("out/index.html", page("Ubis AID"));
// Unknown URLs: fall back to the home page instead of GitHub's generic 404.
if (!existsSync("out/404.html")) writeFileSync("out/404.html", page("Sidan finns inte"));
// Next writes per-segment prefetch files as nested folders
// (__next.$d$locale/amnen/__PAGE__.txt) but the client router requests them as
// one flat file name (__next.$d$locale.amnen.__PAGE__.txt). Static hosts have no
// rewrites, so write a flat copy next to each folder.
let flattened = 0;
function flatten(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      const walk = (d, prefix) => {
        for (const n of readdirSync(d)) {
          const f = path.join(d, n);
          if (statSync(f).isDirectory()) walk(f, `${prefix}.${n}`);
          else {
            copyFileSync(f, path.join(dir, `${prefix}.${n}`));
            flattened++;
          }
        }
      };
      walk(full, name);
    } else flatten(full);
  }
}
flatten("out");
console.log(`flattened ${flattened} prefetch segment files`);

// Folders starting with "_" (like _next) are dropped by Jekyll unless disabled.
writeFileSync("out/.nojekyll", "");
console.log("added index.html, 404.html and .nojekyll");
