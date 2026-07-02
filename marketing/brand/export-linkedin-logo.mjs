#!/usr/bin/env node
/** Render linkedin-logo.html to thrive-logo-square.png (1024×1024). */
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const brandDir = dirname(fileURLToPath(import.meta.url));
const htmlUrl = pathToFileURL(join(brandDir, 'linkedin-logo.html')).href;
const outPath = join(brandDir, 'thrive-logo-square.png');

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1024, height: 1024 },
  deviceScaleFactor: 2,
});
await page.goto(htmlUrl, { waitUntil: 'networkidle' });
await page.screenshot({ path: outPath, type: 'png' });
await browser.close();

console.log(`Wrote ${outPath}`);
