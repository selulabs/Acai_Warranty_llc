import { build } from 'vite';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

process.env.NODE_ENV = 'production';
const serverDir = resolve('.prerender');
try {
  await build();
  await build({ build: { ssr: 'src/entry-server.tsx', outDir: serverDir, emptyOutDir: true } });
  const { pages, render, siteUrl, contentDates } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')));
  const template = await readFile('dist/index.html', 'utf8');
  const entries = [];
  for (const page of [...pages, { path: '/404', noindex: true }]) {
    const { html, head } = render(page.path);
    const output = template.replace('<!--seo-head-->', head).replace('<!--app-html-->', html);
    await writeFile(`dist/${page.path === '/' ? 'index' : page.path.slice(1)}.html`, output);
    if (!page.noindex) {
      const date = contentDates[page.path];
      if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)))) throw new Error(`Invalid content date: ${page.path}`);
      entries.push(`  <url><loc>${siteUrl}${page.path}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`);
    }
  }
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`);
  console.log(`Prerendered ${pages.length} pages and a 404 document; generated sitemap.`);
} finally {
  await rm(serverDir, { recursive: true, force: true });
}
