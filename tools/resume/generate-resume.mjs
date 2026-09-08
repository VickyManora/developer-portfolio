#!/usr/bin/env node
/**
 * Renders the web résumé to PDF via headless Chrome.
 *
 * WHY GENERATE RATHER THAN REDACT
 * -------------------------------
 * The source PDF stores its text as subsetted-font glyph codes inside
 * FlateDecode streams — the digits of the phone number appear nowhere as
 * characters. Editing that safely needs PDF tooling this machine does not have,
 * and a botched edit on a document handed to recruiters is worse than none.
 *
 * So the web copy is rendered from the audited Phase 0 content instead. It is
 * real selectable text (ATS-parseable, not an image), it carries no phone
 * number, and every fact in it traces to the source résumé.
 *
 * Run manually: `node tools/resume/generate-resume.mjs`
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9800 + Math.floor(Math.random() * 400);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new', '--no-first-run', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=/tmp/resume-profile-${Date.now()}`, '--allow-file-access-from-files',
  'about:blank',
], { stdio: 'ignore' });

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/json/version`);
      if (r.ok) return (await r.json()).webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  throw new Error('Chrome did not expose CDP');
}

const ws = new WebSocket(await wsUrl());
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
await send('Page.navigate', { url: pathToFileURL(join(here, 'resume-template.html')).href }, s);
await sleep(2500);

const { result: pdf } = await send('Page.printToPDF', {
  printBackground: true,
  preferCSSPageSize: true,
  // Margins come from @page in the stylesheet.
  marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
}, s);

const out = join(root, 'public/Vicky-Manora-Senior-Full-Stack-Engineer.pdf');
writeFileSync(out, Buffer.from(pdf.data, 'base64'));
console.log('resume:', out);

ws.close();
chrome.kill('SIGKILL');
process.exit(0);
