import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const outDir = join(__dirname, 'images');

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let path = req.url.split('?')[0];
      if (path === '/') path = '/index.html';
      const filePath = join(root, path.replace(/^\//, '').replace(/\.\./g, ''));
      if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(readFileSync(filePath));
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

const shots = [
  { name: '01-hero', type: 'section', selector: '.hero', viewport: { width: 1440, height: 900 } },
  { name: '02-coaching', type: 'section', selector: '#programs', viewport: { width: 1440, height: 900 } },
  { name: '03-community', type: 'section', selector: '#community', viewport: { width: 1440, height: 900 } },
  { name: '04-client-hub', type: 'section', selector: '#clients', viewport: { width: 1440, height: 900 } },
  { name: '05-full-page', type: 'full', viewport: { width: 1440, height: 900 } },
  { name: '06-hero-mobile', type: 'section', selector: '.hero', viewport: { width: 390, height: 844 } },
  { name: '07-coaching-mobile', type: 'section', selector: '#programs', viewport: { width: 390, height: 844 } },
];

mkdirSync(outDir, { recursive: true });

const { server, baseUrl } = await startServer();
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

// Allow fonts and images to settle
await page.goto(`${baseUrl}/index.html`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

for (const shot of shots) {
  await page.setViewportSize(shot.viewport);
  await page.goto(`${baseUrl}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const file = join(outDir, `${shot.name}.png`);

  if (shot.type === 'full') {
    await page.screenshot({ path: file, fullPage: true });
  } else {
    const el = page.locator(shot.selector).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await el.screenshot({ path: file });
  }

  console.log(`Saved ${file}`);
}

await browser.close();
server.close();
console.log('Done.');
