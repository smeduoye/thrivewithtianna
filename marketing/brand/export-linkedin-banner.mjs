#!/usr/bin/env node
/** Render linkedin-banner.html to thrive-linkedin-banner.png (1584×396). */
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const brandDir = dirname(fileURLToPath(import.meta.url));
const htmlUrl = pathToFileURL(join(brandDir, 'linkedin-banner.html')).href;
const outPath = join(brandDir, 'thrive-linkedin-banner.png');

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1584, height: 396 },
  deviceScaleFactor: 2,
});
await page.goto(htmlUrl, { waitUntil: 'networkidle' });
await page.screenshot({ path: outPath, type: 'png' });
await browser.close();

console.log(`Wrote ${outPath}`);
