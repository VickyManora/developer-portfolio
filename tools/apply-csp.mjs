#!/usr/bin/env node
/**
 * Injects an enforced Content-Security-Policy into every prerendered page.
 *
 * WHY A META TAG AND NOT ONLY A HEADER
 * ------------------------------------
 * Angular's `withEventReplay()` emits two executable inline scripts per page:
 * the event-dispatch contract and a small bootstrap call. Their content depends
 * on the build and on which events a page registers, so their hashes cannot be
 * written by hand into a static `vercel.json` — that file is read from the repo
 * at deploy time, before this output exists.
 *
 * Computing the hashes here, from the bytes actually shipped, means the policy
 * can never drift from the code. `frame-ancestors` cannot be set via meta, so
 * it stays in the response header alongside the other security headers.
 *
 * The alternative — dropping event replay to get a clean `script-src 'self'` —
 * was rejected: it removes a real capability (interactions before hydration are
 * otherwise silently lost) to avoid work, rather than to gain security.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'dist/portfolio/browser');

function htmlFiles(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...htmlFiles(full));
    else if (entry.endsWith('.html')) found.push(full);
  }
  return found;
}

/**
 * Angular's critical-CSS inlining emits the async-stylesheet pattern:
 *
 *   <link rel="stylesheet" href="…" media="print" onload="this.media='all'">
 *
 * An inline event handler cannot be covered by a script-src hash — it needs
 * `'unsafe-hashes'`, which is a broader allowance than this deserves. Dropping
 * the inlining instead cost 600ms of mobile LCP, because the stylesheet then
 * blocks first paint on a slow connection.
 *
 * So the handler is rewritten into an equivalent inline SCRIPT, which a hash
 * covers exactly. Behaviour is identical: the sheet is fetched non-blocking as
 * `print`, then promoted to `all` once it has loaded (or immediately, if it
 * already had).
 */
function rewriteAsyncStylesheets(html) {
  return html.replace(
    /<link([^>]*?)\smedia="print"\sonload="this\.media='all'"([^>]*)>/g,
    (_m, before, after) =>
      `<link${before} media="print"${after}>` +
      `<script>(function(){var l=document.currentScript.previousElementSibling;` +
      `function s(){l.media='all'}` +
      `if(l.sheet){s()}else{l.addEventListener('load',s)}})()</script>`,
  );
}

const files = htmlFiles(outDir);
if (files.length === 0) {
  console.log('csp: no HTML output, skipping');
  process.exit(0);
}

// --- Rewrite inline handlers BEFORE hashing, so the new scripts are covered --
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const rewritten = rewriteAsyncStylesheets(html);
  if (rewritten !== html) writeFileSync(file, rewritten);
}

// --- Collect hashes of every EXECUTABLE inline script across all pages -------
// A <script> with a non-JavaScript `type` (application/json, ld+json) is data,
// not code, and is not subject to script-src.
const scriptTag = /<script([^>]*)>([\s\S]*?)<\/script>/g;
const hashes = new Set();

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const [, attrs, body] of html.matchAll(scriptTag)) {
    if (/\ssrc=/.test(attrs)) continue;
    const type = /type\s*=\s*"([^"]*)"/.exec(attrs)?.[1];
    if (type && !/^(text|application)\/javascript$/i.test(type) && type !== 'module') continue;
    if (body.length === 0) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
}

const scriptSrc = ["'self'", ...[...hashes].sort()].join(' ');

const policy = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  // Angular inlines component styles as <style> blocks and writes a handful of
  // style="" attributes from template bindings. Hashing those is impractical
  // and style-src is a far lower-risk directive than script-src.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}">`;

let patched = 0;
for (const file of files) {
  let html = readFileSync(file, 'utf8');
  html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/g, '');
  // Immediately after <head> so the policy is in force before anything below it.
  html = html.replace(/<head>/i, `<head>${meta}`);
  writeFileSync(file, html);
  patched++;
}

console.log(`csp: ${hashes.size} inline script hash(es), applied to ${patched} page(s)`);
for (const h of hashes) console.log(`     ${h}`);
