const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const dist = path.join(__dirname, '../dist');

function page(saved = null, blockedStorage = false) {
  const store = new Map(saved ? [['rwh-language', saved]] : []);
  function element(dataset = {}, attributes = {}) {
    const listeners = {};
    return { dataset, attributes, textContent: '', classList: { contains: name => name === 'shuffle' && dataset.shuffle },
      getAttribute(name) { return this.attributes[name] ?? null; },
      hasAttribute(name) { return name in this.attributes; },
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, fn) { listeners[name] = fn; },
      click() { listeners.click(); }
    };
  }
  const metadata = element({ i18n: 'project.the-hera-resort.metadata', shuffle: true });
  const note = element({ i18n: 'contactNote' });
  const description = element({}, { 'data-i18n-content': 'project.the-hera-resort.description' });
  const image = element({ projectTitle: 'THE HERA RESORT', photoNumber: '2' }, { 'data-photo-number': '2' });
  const menu = element({}, { 'aria-expanded': 'true' });
  const buttons = ['vi', 'en'].map(language => element({language}));
  const doc = { documentElement: {}, dispatchEvent() {}, querySelector: () => menu,
    querySelectorAll(selector) {
      return ({ '[data-i18n]': [metadata, note], '[data-i18n-content]': [description], '[data-i18n-aria-label]': [],
        '[data-project-title]': [image], '[data-language]': buttons })[selector] || [];
    }
  };
  const context = { document: doc, window: { localStorage: {
    getItem(key) { if (blockedStorage) throw new Error('Storage unavailable'); return store.get(key); },
    setItem(key, value) { if (blockedStorage) throw new Error('Storage unavailable'); store.set(key, value); }
  } }, CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } } };
  vm.runInNewContext(fs.readFileSync(path.join(dist, 'project-copy.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(path.join(dist, 'site-language.js'), 'utf8'), context);
  return { ...context, metadata, note, description, image, menu, buttons, store, api: context.window.RWHI18n };
}

test('restores English project copy, accessible labels and selected language on a new page', () => {
  const p = page('en');
  assert.equal(p.document.documentElement.lang, 'en');
  assert.match(p.metadata.textContent, /Quy Nhon, Vietnam/);
  assert.equal(p.metadata.dataset.text, p.metadata.textContent);
  assert.match(p.description.getAttribute('content'), /connects the hills/);
  assert.equal(p.menu.getAttribute('aria-label'), 'Close menu');
  assert.equal(p.image.getAttribute('aria-label'), 'Enlarge photo 2 of THE HERA RESORT');
  assert.equal(p.buttons[1].getAttribute('aria-pressed'), 'true');
});

test('switches languages and retains the current form status instead of resetting it', () => {
  const p = page();
  p.api.message(p.note, 'contactError');
  p.buttons[1].click();
  assert.equal(p.store.get('rwh-language'), 'en');
  assert.equal(p.note.textContent, 'Your enquiry could not be sent. Your details are still here; please try again.');
  p.buttons[0].click();
  assert.equal(p.document.documentElement.lang, 'vi');
  assert.equal(p.store.get('rwh-language'), 'vi');
  assert.match(p.note.textContent, /Chưa gửi được liên hệ/);
  assert.match(p.metadata.textContent, /Quy Nhơn, Việt Nam/);
});

test('language switching remains usable when browser storage is blocked', () => {
  const p = page(null, true);
  assert.equal(p.document.documentElement.lang, 'vi');
  assert.doesNotThrow(() => p.buttons[1].click());
  assert.equal(p.document.documentElement.lang, 'en');
});

test('all rendered translation keys exist in both languages', () => {
  const p = page();
  const files = [path.join(dist, 'index.html'), path.join(dist, 'office/index.html'), ...fs.readdirSync(path.join(dist, 'projects')).map(name => path.join(dist, 'projects', name, 'index.html'))];
  const keys = new Set(files.flatMap(file => [...fs.readFileSync(file, 'utf8').matchAll(/data-i18n(?:-aria-label|-content)?="([^"]+)"/g)].map(match => match[1])));
  for (const language of ['vi', 'en']) {
    p.api.setLanguage(language);
    for (const key of keys) assert.notEqual(p.api.t(key), key, `${language}: ${key}`);
  }
});
