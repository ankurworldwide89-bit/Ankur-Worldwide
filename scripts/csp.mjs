// Hash-based Content-Security-Policy for static pages.
//
// Next.js puts a few small inline <script> blocks in every page. A strict CSP blocks inline
// scripts unless the header lists the exact SHA-256 hash of each one. This script reads the
// built pages, hashes their inline scripts and writes csp-hashes.json, which next.config.ts
// turns into one CSP header per page.
//
//   node scripts/csp.mjs           write csp-hashes.json from the current build
//   node scripts/csp.mjs --check   fail if the current build no longer matches csp-hashes.json
//
// `npm run build` runs: build → write → build (now with headers) → check.
import { createHash } from "node:crypto";
import { existsSync, globSync, readFileSync, writeFileSync } from "node:fs";

const OUT = "csp-hashes.json";
const FALLBACK = "/:path*"; // 404 and error pages, served for any unknown address
const INLINE = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;

// Built pages as [file, page name]. A local build keeps them in .next/server/app/<name>.html.
// Vercel's build keeps them in .next/server/route-cache/APP_PAGE/<id>/$/<name>.html, and its
// 404 and 500 pages in .next/output/static.
const list = (cwd, pattern = "**/*.html") =>
  globSync(pattern, { cwd }).map((f) => [`${cwd}/${f}`.replaceAll("\\", "/"), f.replaceAll("\\", "/")]);
const pages = [
  ...list(".next/server/app"),
  ...list(".next/server/route-cache/APP_PAGE").map(([file, f]) => [file, f.replace(/^[^/]+\/\$\//, "")]),
  ...list(".next/output/static", "*.html"),
];

const routes = {};
for (const [file, f] of pages) {
  const name = f.replace(/\.html$/, "");
  const route = /^(_|404$|500$)/.test(name) ? FALLBACK : name === "index" ? "/" : `/${name}`;
  const hashes = new Set(routes[route]);
  for (const [, attrs, body] of readFileSync(file, "utf8").matchAll(INLINE)) {
    if (/type="application\/(ld\+)?json"/.test(attrs)) continue; // data, not code: CSP does not apply
    hashes.add(`'sha256-${createHash("sha256").update(body).digest("base64")}'`);
  }
  routes[route] = [...hashes].sort();
}
if (!routes["/"]) {
  console.error(`Home page not found among ${pages.length} built pages. Run "next build" first.`);
  console.error(pages.map(([file]) => file).slice(0, 40).join("\n"));
  process.exit(1);
}

const json = JSON.stringify(routes, null, 2) + "\n";
if (process.argv.includes("--check")) {
  if (!existsSync(OUT) || readFileSync(OUT, "utf8") !== json) {
    console.error("CSP hashes do not match the built pages. The site would block its own scripts. Build failed.");
    process.exit(1);
  }
  console.log(`CSP hashes verified for ${Object.keys(routes).length} routes.`);
} else {
  writeFileSync(OUT, json);
  console.log(`Wrote ${OUT} for ${Object.keys(routes).length} routes.`);
}
