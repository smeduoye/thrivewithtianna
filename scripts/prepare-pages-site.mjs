#!/usr/bin/env node
/**
 * Copy the public marketing site into an output folder and append ?v=<content-hash>
 * to local CSS/JS references so browsers fetch fresh assets after each deploy.
 *
 * Usage: node scripts/prepare-pages-site.mjs [outputDir]
 */

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = process.argv[2] ? join(process.cwd(), process.argv[2]) : join(root, '_site');

const STATIC_FILES = [
  'index.html',
  'main.js',
  'styles.css',
  'business-plan.html',
  'business-plan.css',
  'business-plan.js',
  'CNAME',
];

/** HTML file → local assets to cache-bust (href/src, same directory). */
const HTML_ASSETS = {
  'index.html': ['styles.css', 'main.js'],
  'business-plan.html': ['styles.css', 'business-plan.css', 'business-plan.js'],
};

function hashFile(path) {
  const digest = createHash('sha256').update(readFileSync(path)).digest('hex');
  return digest.slice(0, 8);
}

function applyCacheBust(html, assetName, hash) {
  const escaped = assetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`((?:href|src)=["'])(${escaped})(\\?v=[^"']*)?(["'])`, 'gi');
  return html.replace(re, `$1$2?v=${hash}$4`);
}

mkdirSync(outDir, { recursive: true });

for (const file of STATIC_FILES) {
  const src = join(root, file);
  if (!existsSync(src)) {
    console.warn(`skip missing: ${file}`);
    continue;
  }
  cpSync(src, join(outDir, file));
}

for (const [htmlFile, assets] of Object.entries(HTML_ASSETS)) {
  const htmlPath = join(outDir, htmlFile);
  if (!existsSync(htmlPath)) continue;

  let html = readFileSync(htmlPath, 'utf8');
  for (const asset of assets) {
    const assetPath = join(outDir, asset);
    if (!existsSync(assetPath)) continue;
    html = applyCacheBust(html, asset, hashFile(assetPath));
  }
  writeFileSync(htmlPath, html);
}

console.log(`Prepared GitHub Pages site in ${outDir}`);
