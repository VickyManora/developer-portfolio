#!/usr/bin/env node
/**
 * Renders the site icon to every raster form a browser asks for.
 *
 * Run manually (`node tools/icons/generate-icons.mjs`) rather than during the
 * build, for the same reason as the OG card: the output is a static asset that
 * changes only when the identity changes, and a build should not depend on a
 * browser being installed.
 *
 * Source of truth is tools/icons/icon.svg, drawn from the site's own tokens —
 * the #0d1017 ground and the accent gradient. No stock imagery, no third-party
 * marks.
 *
 * Emits:
 *   public/favicon.svg          crisp at any size, preferred by modern browsers
 *   public/favicon.ico          16/32/48 PNG-in-ICO, for older browsers
 *   public/apple-touch-icon.png 180x180, iOS home screen
 */
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const publicDir = join(root, 'public');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9500 + Math.floor(Math.random() * 400);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const svg = readFileSync(join(here, 'icon.svg'), 'utf8');

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--hide-scrollbars',
    '--no-first-run',
    `--remote-debugging-port=${PORT}`,
    '--force-device-scale-factor=1',
    `--user-data-dir=/tmp/icon-profile-${Date.now()}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

async function cdp() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/json/version`);
      if (r.ok) return (await r.json()).webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error('Chrome did not expose CDP');
}

const ws = new WebSocket(await cdp());
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});
let id = 0;
const waiters = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && waiters.has(m.id)) {
    waiters.get(m.id)(m);
    waiters.delete(m.id);
  }
};
const send = (method, params = {}, sessionId) =>
  new Promise((res) => {
    const mid = ++id;
    waiters.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params, ...(sessionId ? { sessionId } : {}) }));
  });

const { result: t } = await send('Target.createTarget', { url: 'about:blank' });
const { result: att } = await send('Target.attachToTarget', {
  targetId: t.targetId,
  flatten: true,
});
const s = att.sessionId;
await send('Page.enable', {}, s);

/** Renders the SVG at an exact pixel size, on a transparent ground so the
 *  tile's rounded corners stay round. */
async function render(size, { squareCorners = false } = {}) {
  // iOS masks apple-touch-icon into its own squircle, so that one is rendered
  // full-bleed: transparent corners under the mask can composite to white.
  const art = squareCorners ? svg.replace('rx="14"', 'rx="0"') : svg;
  const page = `<!doctype html><meta charset="utf-8">
    <style>html,body{margin:0;padding:0;background:transparent}
    svg{display:block;width:${size}px;height:${size}px}</style>${art}`;
  await send(
    'Page.navigate',
    { url: 'data:text/html;charset=utf-8,' + encodeURIComponent(page) },
    s,
  );
  await sleep(400);
  await send(
    'Emulation.setDeviceMetricsOverride',
    { width: size, height: size, deviceScaleFactor: 1, mobile: false },
    s,
  );
  await send(
    'Emulation.setDefaultBackgroundColorOverride',
    { color: { r: 0, g: 0, b: 0, a: 0 } },
    s,
  );
  await sleep(200);
  const { result: shot } = await send(
    'Page.captureScreenshot',
    { format: 'png', captureBeyondViewport: false },
    s,
  );
  return Buffer.from(shot.data, 'base64');
}

/** Packs PNGs into an ICO. Every browser that still reads .ico accepts
 *  PNG-compressed entries, so there is no need to emit raw BMP bitmaps. */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = header.length + dir.length;
  entries.forEach(({ size, png }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o); // 0 means 256
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2); // palette count
    dir.writeUInt8(0, o + 3); // reserved
    dir.writeUInt16LE(1, o + 4); // colour planes
    dir.writeUInt16LE(32, o + 6); // bits per pixel
    dir.writeUInt32LE(png.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += png.length;
  });
  return Buffer.concat([header, dir, ...entries.map((e) => e.png)]);
}

const icoSizes = [16, 32, 48];
const entries = [];
for (const size of icoSizes) entries.push({ size, png: await render(size) });
writeFileSync(join(publicDir, 'favicon.ico'), buildIco(entries));

writeFileSync(join(publicDir, 'apple-touch-icon.png'), await render(180, { squareCorners: true }));
copyFileSync(join(here, 'icon.svg'), join(publicDir, 'favicon.svg'));

console.log(
  'icons: favicon.ico (' + icoSizes.join('/') + '), apple-touch-icon.png (180), favicon.svg',
);

ws.close();
chrome.kill();
process.exit(0);
