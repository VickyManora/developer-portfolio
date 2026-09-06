#!/usr/bin/env node
/**
 * Emits sitemap.xml and appends the Sitemap directive to robots.txt.
 *
 * Both are skipped while the domain is still a placeholder: publishing a
 * sitemap of URLs on a domain that may not be ours is worse than publishing
 * none. Set `siteUrlIsPlaceholder: false` in the production environment once
 * the domain is confirmed and this starts emitting automatically.
 */
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envFile = readFileSync(join(root, 'src/environments/environment.production.ts'), 'utf8');

const siteUrl = envFile.match(/siteUrl:\s*'([^']+)'/)?.[1];
const isPlaceholder = /siteUrlIsPlaceholder:\s*true/.test(envFile);

const outDir = join(root, 'dist/portfolio/browser');
if (!existsSync(outDir)) {
  console.log('sitemap: no build output, skipping');
  process.exit(0);
}

if (isPlaceholder || !siteUrl) {
  console.log('sitemap: domain is a placeholder — skipping sitemap and robots Sitemap directive');
  process.exit(0);
}

const projects = readFileSync(join(root, 'src/app/content/projects.data.ts'), 'utf8');
const deepSlugs = [...projects.matchAll(/slug:\s*'([^']+)',\s*\n\s*tier:\s*'deep'/g)].map(
  (m) => m[1],
);

const paths = ['/', ...deepSlugs.map((slug) => `/work/${slug}`)];
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path) =>
      `  <url>\n    <loc>${siteUrl}${path === '/' ? '' : path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(outDir, 'sitemap.xml'), xml);
appendFileSync(join(outDir, 'robots.txt'), `\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`sitemap: ${paths.length} URLs written`);
