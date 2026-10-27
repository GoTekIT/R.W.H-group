const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createLayerHistory } = require('../dist/project-panel.js');

function page() {
  const entries = [{ state:{ existing:'kept' }, url:'https://rwh.example/index.html' }];
  let index = 0, pop, pending = false;
  const history = {
    get state() { return entries[index].state; },
    pushState(state, unused, url) { entries.splice(index + 1); entries.push({ state, url }); index++; },
    back() { if (index) { index--; pending = true; } }
  };
  const api = createLayerHistory({ history, location:{ href:entries[0].url }, addEventListener(type, fn) { if (type === 'popstate') pop = fn; } });
  function flush() { while (pending) { pending = false; pop({ state:history.state }); } }
  return { api, history, entries, flush, get index() { return index; } };
}

test('browser Back closes Contact first, then content, without changing the landing URL', () => {
  const p = page(), closed = [];
  p.api.open('content', () => closed.push('content'));
  p.api.open('contact', () => closed.push('contact'));
  assert.equal(p.index, 2);
  assert.ok(p.entries.every(entry => entry.url === 'https://rwh.example/index.html'));
  assert.equal(p.history.state.existing, 'kept');
  p.history.back(); p.flush();
  assert.deepEqual(closed, ['contact']);
  assert.equal(p.index, 1);
  p.history.back(); p.flush();
  assert.deepEqual(closed, ['contact', 'content']);
  assert.equal(p.index, 0);
});

test('UI close removes its history entry without closing the layer underneath', () => {
  const p = page(), closed = [];
  p.api.open('content', () => closed.push('content'));
  p.api.open('contact', () => closed.push('contact'));
  p.api.close('contact'); p.flush();
  assert.deepEqual(closed, []);
  assert.equal(p.index, 1);
  p.api.close('content'); p.flush();
  assert.equal(p.index, 0);
  assert.deepEqual(closed, []);
});

test('opening content while Contact finishes closing does not lose the new layer', () => {
  const p = page(), closed = [];
  p.api.open('contact', () => closed.push('contact'));
  p.api.close('contact');
  p.api.open('content', () => closed.push('content'));
  p.flush();
  assert.equal(p.index, 1);
  assert.deepEqual(closed, []);
  p.history.back(); p.flush();
  assert.deepEqual(closed, ['content']);
});

test('inactive lower entries are retired after the remaining top layer closes', () => {
  const p = page();
  p.api.open('content', () => {});
  p.api.open('contact', () => {});
  p.api.close('content');
  p.api.close('contact'); p.flush();
  assert.equal(p.index, 0);
});

test('duplicate open reports do not add duplicate entries', () => {
  const p = page();
  p.api.open('content', () => {}); p.api.open('content', () => {});
  assert.equal(p.index, 1);
  p.api.close('content'); p.flush();
  assert.equal(p.index, 0);
});
