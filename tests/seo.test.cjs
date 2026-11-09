const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const projects = require('../PROJECT_SOURCES.json').projects;
const origin = require('../SITE_CONFIG.json').origin;
test('all public pages, including Office and Japanese, have unique canonical URLs and valid structured data', () => {
  const urls = new Set();
  const files = ['index.html', 'office/index.html', 'ja/index.html', ...projects.map(p => `projects/${p.slug}/index.html`)];
  const paths = { 'index.html': '', 'office/index.html': 'office', 'ja/index.html': 'ja/' };
  for (const file of files) {
    const html = fs.readFileSync(path.join(root, 'dist', file), 'utf8');
    const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)">/g)];
    assert.equal(canonical.length, 1, file);
    assert.equal(canonical[0][1], `${origin}/${paths[file] ?? file}`);
    urls.add(canonical[0][1]);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(graph['@graph'].find(n => n['@type'] === 'WebPage').url, canonical[0][1]);
    assert.ok(html.includes('property="og:image"'));
    assert.ok(!/<a\s+(?![^>]*\bhref=)[^>]*>/g.test(html), file);
  }
  assert.equal(urls.size, files.length);
  const sitemap = fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8');
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, files.length);
  for (const url of urls) assert.ok(sitemap.includes(`<loc>${url}</loc>`));
  assert.ok(fs.readFileSync(path.join(root, 'dist/robots.txt'), 'utf8').includes(`${origin}/sitemap.xml`));
});

test('desktop gallery assets match the audited original bytes', () => {
  const audit = require('../ORIGINAL_MEDIA_AUDIT.json');
  const crypto = require('node:crypto');
  assert.equal(audit.length, projects.reduce((n,p) => n + p.images.length, 0));
  for (const item of audit) {
    const bytes = fs.readFileSync(path.join(root,'dist',item.path));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.sha256,item.path);
  }
  for (const p of projects) {
    const html = fs.readFileSync(path.join(root,'dist/projects',p.slug,'index.html'),'utf8');
    for (const photo of p.images) {
      assert.ok(html.includes(`src="../../${photo.originalSrc}"`));
      assert.ok(html.includes(`srcset="../../${photo.mobileSrc}"`));
    }
  }
});
