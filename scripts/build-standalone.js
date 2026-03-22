#!/usr/bin/env node
/**
 * build-standalone.js
 * Builds the Vite app and packages it into a single standalone HTML file
 * with both ES/EN datasets embedded inline.
 *
 * Usage: node scripts/build-standalone.js
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");
const OUT = join(ROOT, "empleo-ia.html");

// 1. Run Vite build
console.log("Building with Vite...");
execSync("npm run build", { cwd: ROOT, stdio: "inherit" });

// 2. Read built files
const html = readFileSync(join(DIST, "index.html"), "utf-8");

const assets = readdirSync(join(DIST, "assets"));
const cssFile = assets.find((f) => f.endsWith(".css"));
const jsFile = assets.find((f) => f.endsWith(".js"));

if (!cssFile || !jsFile) {
  console.error("Could not find CSS or JS in dist/assets/");
  process.exit(1);
}

const css = readFileSync(join(DIST, "assets", cssFile), "utf-8");
const js = readFileSync(join(DIST, "assets", jsFile), "utf-8");

// 3. Read both JSON datasets
const dataEs = readFileSync(
  join(DIST, "data", "spain_502_v10_final.json"),
  "utf-8"
);
const dataEn = readFileSync(
  join(DIST, "data", "spain_502_v10_final_en.json"),
  "utf-8"
);

// 4. Build the standalone HTML
// - Inline CSS replacing the <link> tag
// - Embed JSON datasets as <script type="application/json">
// - Add a fetch shim that intercepts data file requests
// - Inline JS replacing the <script type="module"> tag

let output = html;

// Replace CSS link with inline style
output = output.replace(
  /<link rel="stylesheet"[^>]*>/,
  `<style>${css}</style>`
);

// Remove module preload links if any
output = output.replace(/<link rel="modulepreload"[^>]*>/g, "");

// Insert embedded data and fetch shim before the closing </head>
const dataBlock = `
<script id="data-es" type="application/json">${dataEs.trim()}</script>
<script id="data-en" type="application/json">${dataEn.trim()}</script>
<script>
// Fix routing: set URL to "/" so BrowserRouter matches the main route
if (window.location.pathname !== '/') {
  window.history.replaceState(null, '', '/');
}
// Shim: intercept fetch for data files and return embedded JSON
(function() {
  const _fetch = window.fetch;
  window.fetch = function(url, opts) {
    const u = typeof url === 'string' ? url : url.toString();
    if (u.includes('v10_final_en.json') || u.includes('FINAL_v7_en.json')) {
      const text = document.getElementById('data-en').textContent;
      return Promise.resolve(new Response(text, { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    if (u.includes('v10_final.json') || u.includes('FINAL_v7.json')) {
      const text = document.getElementById('data-es').textContent;
      return Promise.resolve(new Response(text, { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    return _fetch.call(this, url, opts);
  };
})();
</script>
`;

output = output.replace("</head>", dataBlock + "</head>");

// Replace JS module script with inline script (non-module since it's bundled)
output = output.replace(
  /<script type="module"[^>]*><\/script>/,
  ""
);
output = output.replace(
  /<script type="module" crossorigin src="[^"]*"><\/script>/,
  ""
);

// Add inline JS before closing body (type="module" to match Vite's output format)
// Use function replacement to avoid $& / $' / $` interpretation in the JS source
output = output.replace("</body>", () => `<script type="module">${js}</script>\n</body>`);

// Remove favicon reference (won't work standalone)
output = output.replace(/<link rel="icon"[^>]*>/, "");

// 5. Write output
writeFileSync(OUT, output, "utf-8");

const sizeMB = (Buffer.byteLength(output) / 1024 / 1024).toFixed(2);
console.log(`\n✓ Standalone HTML written to: ${OUT}`);
console.log(`  Size: ${sizeMB} MB`);
console.log(`  Embedded: ES dataset + EN dataset + CSS + JS`);
