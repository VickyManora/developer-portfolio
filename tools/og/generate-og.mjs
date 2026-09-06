#!/usr/bin/env node
/**
 * Renders the Open Graph card to a PNG using headless Chrome.
 *
 * Run manually (`node tools/og/generate-og.mjs`) rather than during the build:
 * the result is a static asset that only changes when the identity changes, and
 * a build should not depend on a browser being installed.
 *
 * The card is composed from the site's own design tokens and the system-core
 * lattice motif. No stock imagery, no client logos, no invented branding.
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9400 + Math.floor(Math.random() * 400);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new', '--hide-scrollbars', '--no-first-run',
  `--remote-debugging-port=${PORT}`, '--window-size=1200,630',
  `--user-data-dir=/tmp/og-profile-${Date.now()}`, '--allow-file-access-from-files',
  'about:blank',
], { stdio: 'ignore' });

async function cdp() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/json/version`);
      if (r.ok) return (await r.json()).webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  throw new Error('Chrome did not expose CDP');
}

const ws = new WebSocket(await cdp());
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let id = 0;
const waiters = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && waiters.has(m.id)) { waiters.get(m.id)(m); waiters.delete(m.id); }
};
const send = (method, params = {}, sessionId) =>
  new Promise((res) => {
    const mid = ++id;
    waiters.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params, ...(sessionId ? { sessionId } : {}) }));
  });

const { result: target } = await send('Target.createTarget', { url: 'about:blank' });
const { result: attached } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
const s = attached.sessionId;

await send('Page.enable', {}, s);
await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false }, s);
await send('Page.navigate', { url: pathToFileURL(join(here, 'og-template.html')).href }, s);
await sleep(2500);

const { result: shot } = await send('Page.captureScreenshot', { format: 'png' }, s);
const out = join(root, 'public/og/og-default.png');
writeFileSync(out, Buffer.from(shot.data, 'base64'));
console.log('og: wrote', out);

ws.close();
chrome.kill('SIGKILL');
process.exit(0);
