#!/usr/bin/env node
/**
 * Vercel serves `404.html` with a real 404 status for any path that matches no
 * static file. Angular's prerender emits `index.csr.html` (the client-render
 * shell) but no 404 page, so we copy one.
 *
 * The result: an unknown URL returns HTTP 404 (not a soft 404), the Angular app
 * boots client-side, and the `**` route renders NotFound with noindex.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'dist/portfolio/browser');
const shell = join(outDir, 'index.csr.html');

if (!existsSync(shell)) {
  console.log('404: no CSR shell found, skipping');
  process.exit(0);
}

// The CSR shell carries the homepage <title> and an empty <app-root>, so an
// invalid URL would show the homepage title and a blank body until Angular
// boots. Both are corrected statically here; Angular replaces the body content
// with the NotFound route once it hydrates.
let html = readFileSync(shell, 'utf8');

html = html.replace(
  /<title>[^<]*<\/title>/,
  '<title>Page not found — Vicky Manora</title>',
);

html = html.replace(
  '<app-root></app-root>',
  `<app-root><div style="max-width:720px;margin:0 auto;padding:22vh 24px 0;font-family:system-ui,sans-serif;color:#EDEFF3">
  <p style="font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.12em;color:#7A828F;margin:0 0 12px">ERROR 404</p>
  <h1 style="font-size:2rem;line-height:1.2;letter-spacing:-.02em;margin:0 0 12px">Page not found</h1>
  <p style="color:#9AA1AE;line-height:1.7;margin:0 0 20px">That address does not exist on this site.</p>
  <a href="/" style="color:#4D8DFF">Return to the homepage</a>
</div></app-root>`,
);

writeFileSync(join(outDir, '404.html'), html);
console.log('404: 404.html written with static title and fallback content');
