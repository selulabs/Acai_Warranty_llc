import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';

const paths = ['/', '/auto-warranty', '/home-warranty', '/protection-plans', '/how-it-works', '/about', '/contact', '/privacy-policy', '/terms-and-conditions'];
const htmlFor = (path) => readFileSync(`dist/${path === '/' ? 'index' : path.slice(1)}.html`, 'utf8');
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');

for (const path of paths) {
  test(`${path} contains crawlable HTML, correct canonical and complete social metadata`, () => {
    const html = htmlFor(path);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
    assert.match(html, /<main[^>]*>[\s\S]*<h1/);
    assert.match(html, /<div id="root"><div/);
    assert.ok(html.includes(`rel="canonical" href="https://acaiwarranty.com${path}"`));
    assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
    assert.equal((html.match(/<title[\s>]/g) ?? []).length, 1);
    for (const tag of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'twitter:title', 'twitter:description', 'twitter:image']) {
      assert.ok(html.includes(`="${tag}"`), `${tag} missing`);
    }
    const data = JSON.parse(html.match(/<script[^>]*id="structured-data"[^>]*>(.*?)<\/script>/s)[1]);
    assert.ok(data['@graph'].some((item) => item['@type'] === 'Organization'));
    assert.ok(data['@graph'].some((item) => item['@type'] === 'WebSite'));
    assert.equal(data['@graph'].some((item) => item['@type'] === 'BreadcrumbList'), path !== '/');
    assert.doesNotMatch(JSON.stringify(data), /LocalBusiness|aggregateRating|reviewRating|PostalAddress|areaServed/);
    for (const faq of data['@graph'].filter((item) => item['@type'] === 'FAQPage')) {
      for (const question of faq.mainEntity) {
        assert.ok(html.includes(question.name.replaceAll('&', '&amp;').replaceAll("'", '&#x27;')));
        assert.ok(html.includes(question.acceptedAnswer.text.replaceAll('&', '&amp;').replaceAll("'", '&#x27;')));
      }
    }
    assert.ok(sitemap.includes(`<loc>https://acaiwarranty.com${path}</loc>`));
    assert.doesNotMatch(html, /<!--seo-head-->|<!--app-html-->|Draft for review|NEEDS INPUT FROM OWNER/);
  });
}

test('404 is a noindex document and routing has no blanket SPA fallback', () => {
  const html = htmlFor('/404');
  assert.match(html, /noindex, follow/);
  assert.doesNotMatch(html, /rel="canonical"/);
  assert.match(html, /This page could not be found/);
  assert.doesNotMatch(sitemap, /<loc>[^<]*(?:\/404|thank-you|\?)/);
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  assert.equal(config.rewrites, undefined);
  assert.equal(config.cleanUrls, true);
  assert.ok(config.redirects.some((redirect) => redirect.permanent && redirect.destination.startsWith('https://acaiwarranty.com/')));
  assert.ok(config.headers.some((rule) => rule.headers.some((header) => header.key === 'Content-Security-Policy')));
});

test('sitemap contains nine canonical URLs and valid source-change dates only', () => {
  assert.equal((sitemap.match(/<loc>/g) ?? []).length, paths.length);
  assert.equal((sitemap.match(/<lastmod>/g) ?? []).length, paths.length);
  for (const [, date] of sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g)) {
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(!Number.isNaN(Date.parse(date)));
  }
  assert.match(readFileSync('dist/robots.txt', 'utf8'), /Sitemap: https:\/\/acaiwarranty\.com\/sitemap\.xml/);
});

test('PNG assets have the required dimensions and manifest icons exist', () => {
  for (const [name, width, height] of [['og-image', 1200, 630], ['favicon-16', 16, 16], ['favicon-32', 32, 32],
    ['apple-touch-icon', 180, 180], ['icon-192', 192, 192], ['icon-512', 512, 512]]) {
    const png = readFileSync(`dist/${name}.png`);
    assert.equal(png.readUInt32BE(16), width);
    assert.equal(png.readUInt32BE(20), height);
  }
  const manifest = JSON.parse(readFileSync('dist/site.webmanifest', 'utf8'));
  assert.equal(manifest.icons.length, 2);
});

test('responsive images and mobile-only homepage hero survive prerendering', () => {
  const home = htmlFor('/');
  const mobilePhoto = readFileSync('src/data/images.ts', 'utf8').match(/heroAutoMobile:\s*'([^']+)'/)[1];
  assert.ok(home.includes(new URL(mobilePhoto).pathname));
  assert.match(home, /<source media="\(max-width: 767px\)"/);
  assert.match(home, /srcSet="[^"]*400w[^"]*2000w"/);
  assert.match(home, /fetchPriority="high"/);
  assert.match(home, /loading="lazy"/);
});

test('server-only secrets are not bundled into browser JavaScript', () => {
  const bundle = readdirSync('dist/assets').filter((file) => file.endsWith('.js')).map((file) => readFileSync(`dist/assets/${file}`, 'utf8')).join('\n');
  for (const secret of ['SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY', 'QUOTE_FROM_EMAIL', 'QUOTE_TO_EMAIL']) assert.ok(!bundle.includes(secret));
});
