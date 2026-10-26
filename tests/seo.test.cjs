const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const projects = require('../PROJECT_SOURCES.json').projects;
const origin = require('../SITE_CONFIG.json').origin;
test('all twelve public pages have unique canonical URLs and valid structured data', () => {
  const urls = new Set();
  for (const file of ['index.html', ...projects.map(p => `projects/${p.slug}/index.html`)]) {
    const html = fs.readFileSync(path.join(root, 'dist', file), 'utf8');
    const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)">/g)];
    assert.equal(canonical.length, 1, file);
    assert.equal(canonical[0][1], `${origin}/${file === 'index.html' ? '' : file}`);
    urls.add(canonical[0][1]);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(graph['@graph'].find(n => n['@type'] === 'WebPage').url, canonical[0][1]);
    assert.ok(html.includes('property="og:image"'));
    assert.ok(!/<a\s+(?![^>]*\bhref=)[^>]*>/g.test(html), file);
  }
  assert.equal(urls.size, 12);
  const sitemap = fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8');
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, 12);
  for (const url of urls) assert.ok(sitemap.includes(`<loc>${url}</loc>`));
  assert.ok(fs.readFileSync(path.join(root, 'dist/robots.txt'), 'utf8').includes(`${origin}/sitemap.xml`));
});
