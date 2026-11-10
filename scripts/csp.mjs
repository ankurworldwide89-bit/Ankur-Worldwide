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

const APP = ".next/server/app";
const OUT = "csp-hashes.json";
const FALLBACK = "/:path*"; // 404 and error pages, served for any unknown address
const INLINE = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;

const routes = {};
for (const file of globSync("**/*.html", { cwd: APP })) {
  const name = file.replaceAll("\\", "/").replace(/\.html$/, "");
  const route = name.startsWith("_") ? FALLBACK : name === "index" ? "/" : `/${name}`;
  const hashes = new Set(routes[route]);
  for (const [, attrs, body] of readFileSync(`${APP}/${file}`, "utf8").matchAll(INLINE)) {
    if (/type="application\/(ld\+)?json"/.test(attrs)) continue; // data, not code: CSP does not apply
    hashes.add(`'sha256-${createHash("sha256").update(body).digest("base64")}'`);
  }
  routes[route] = [...hashes].sort();
}
if (!routes["/"]) throw new Error(`No built pages found in ${APP}. Run "next build" first.`);

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
