const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');
const content = require('../OFFICE_CONTENT.json');
const media = require('../OFFICE_MEDIA.json');
const html = fs.readFileSync(path.join(root, 'dist/office/index.html'), 'utf8');

test('Office preserves the complete parent page content sequence and all five source images', () => {
  const sections = ['office-intro', 'office-founder', 'office-philosophy', 'office-dream', 'office-partners'];
  let previous = -1;
  for (const name of sections) {
    const position = html.indexOf(`class="${name}"`);
    assert.ok(position > previous, `${name} must exist in source order`);
    previous = position;
  }
  assert.deepEqual(content.careerYears, ['1979–1985', '1985–2024', '2005', '2016', '2024']);
  for (const year of content.careerYears) assert.ok(html.includes(`<dt>${year}</dt>`));
  assert.equal(Object.keys(media).length, 5);
  for (const item of Object.values(media)) {
    const bytes = fs.readFileSync(path.join(root, 'dist', item.src));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), item.sha256);
    assert.ok(html.includes(item.still || item.src));
    if (item.still) {
      const still = fs.readFileSync(path.join(root, 'dist', item.still));
      assert.equal(crypto.createHash('sha256').update(still).digest('hex'), item.stillSha256);
    }
  }
  for (const url of Object.values(content.links)) assert.ok(html.includes(url));
});

test('Office has complete Vietnamese and English copy and no Japanese page prose', () => {
  assert.deepEqual(Object.keys(content.copy.vi).sort(), Object.keys(content.copy.en).sort());
  for (const values of Object.values(content.copy)) {
    for (const value of Object.values(values)) assert.ok(value.trim());
  }
  const main = html.match(/<main\b[\s\S]*?<\/main>/)[0];
  assert.doesNotMatch(main, /[\u3040-\u30ff\u3400-\u9fff]/);
  assert.ok(html.includes('office-copy.js'));
  assert.equal((html.match(/class="office-partner-strip" tabindex="0" role="region"/g) || []).length, 2);
  assert.equal(media['partners-01'].displayWidth, 3057);
  assert.equal(media['partners-02'].displayWidth, 2453);
});
