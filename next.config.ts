import { existsSync, readFileSync } from "node:fs";
import type { NextConfig } from "next";

// Written by scripts/csp.mjs during `npm run build`: { route: [hashes of that page's inline scripts] }.
const cspHashes: Record<string, string[]> = existsSync("csp-hashes.json")
  ? JSON.parse(readFileSync("csp-hashes.json", "utf8"))
  : {};

const TURNSTILE = "https://challenges.cloudflare.com";

const csp = (hashes: string[]) =>
  [
    "default-src 'self'",
    `script-src 'self' ${TURNSTILE} ${hashes.join(" ")}`.trim(),
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    `frame-src ${TURNSTILE}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

// Keep in step with `locales` in lib/i18n.ts (English excluded).
const otherLocales = "ar|es|fr|de|ru|pt|zh";

const config: NextConfig = {
  poweredByHeader: false,
  // Lets app/global-not-found.tsx be a static 404 page with its own <html> (the layout lives under [lang]).
  experimental: { globalNotFound: true },
  // The build ID is embedded in inline scripts. It must be identical in both passes of
  // `npm run build`, or the CSP hashes from pass one would not match pass two.
  generateBuildId: () => process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    // The dev server needs eval and inline scripts for hot reload, so CSP is production-only.
    if (process.env.NODE_ENV !== "production") return [{ source: "/:path*", headers: securityHeaders }];
    const { "/:path*": fallback = [], ...pages } = cspHashes;
    return [
      // Everything, including 404s. Later entries override the CSP for their exact page.
      { source: "/:path*", headers: [...securityHeaders, { key: "Content-Security-Policy", value: csp(fallback) }] },
      // English pages are built as /en/... but visited without the prefix (see rewrites below).
      ...Object.entries(pages).map(([route, hashes]) => ({
        source: route === "/en" ? "/" : route.startsWith("/en/") ? route.slice(3) : route,
        headers: [{ key: "Content-Security-Policy", value: csp(hashes) }],
      })),
    ];
  },
  // English is the main language and has no prefix: /about shows the page built as /en/about.
  // Any path that does not start with another language code (or a system path) is treated as English.
  async rewrites() {
    return [
      { source: "/", destination: "/en" },
      { source: `/:path((?!(?:${otherLocales})(?:/|$)|en(?:/|$)|api/|_next/|_vercel/).+)`, destination: "/en/:path" },
    ];
  },
  // The prefixed English address would duplicate every page, so it redirects to the plain one.
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default config;
