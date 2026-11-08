const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { createContactHandler } = require('../lib/contact');
const config = require('../SITE_CONFIG.json');
const projects = require('../PROJECT_SOURCES.json').projects;
const dist = path.join(__dirname, '..', 'dist');
const read = file => fs.readFileSync(path.join(dist, file), 'utf8');
const page = read('ja/index.html');
const seo = page.match(/<!-- SEO START -->.*?<!-- SEO END -->/s)[0];

test('the Japanese page links only to existing files, by paths that work at /ja and /ja/', () => {
  assert.match(page, /<html lang="ja">/);
  const links = [...page.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]);
  for (const link of links.filter(link => link.startsWith('../'))) {
    const [file, version] = link.slice(3).split('?v=');
    if (file === '' || file === 'ja/') continue;
    assert.ok(fs.existsSync(path.join(dist, file)), link);
    if (version) assert.equal(version, crypto.createHash('sha256').update(fs.readFileSync(path.join(dist, file))).digest('hex').slice(0, 10), link);
  }
  // ./ links would resolve against / when the page is opened as /ja without the trailing slash.
  assert.deepEqual(links.filter(link => link.startsWith('./') || link.startsWith('/')), []);
  assert.doesNotMatch(page.replace(seo, ''), /rwhgroup\.site|rwh-ruby/);
});

test('the Japanese page and the home page point at each other with hreflang', () => {
  const alternates = [['vi', `${config.origin}/`], ['ja', `${config.origin}/ja/`], ['x-default', `${config.origin}/`]];
  for (const html of [read('index.html'), page]) {
    for (const [lang, href] of alternates) assert.ok(html.includes(`<link rel="alternate" hreflang="${lang}" href="${href}">`), lang);
  }
  for (const file of ['office/index.html', ...projects.map(p => `projects/${p.slug}/index.html`)]) {
    assert.doesNotMatch(read(file), /<link rel="alternate" hreflang=/, file);
  }
  assert.ok(page.includes(`<title>${config.ja.title}</title>`));
  assert.ok(seo.includes('<meta property="og:locale" content="ja_JP">'));
  const graph = JSON.parse(seo.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  const webpage = graph.find(node => node['@type'] === 'WebPage');
  assert.equal(webpage.inLanguage, 'ja');
  const company = graph.find(node => node['@id'] === webpage.about['@id']);
  assert.equal(company.name, config.ja.organization.name);
  assert.equal(company.address.addressCountry, 'JP');
  assert.ok(read('sitemap.xml').includes(`<loc>${config.origin}/ja/</loc>`));
});

test('the Japanese form sends the same fields as the home page form', () => {
  const home = read('index.html');
  const field = (html, name) => html.match(new RegExp(`<(?:input|textarea)[^>]*\\bname="${name}"[^>]*>`))[0];
  const attributes = tag => Object.fromEntries([...tag.matchAll(/\s(type|maxlength|required|inputmode|autocomplete|tabindex)(?:="([^"]*)")?/g)].map(m => [m[1], m[2] ?? true]));
  for (const name of ['name', 'email', 'phone', 'questions', 'website']) {
    assert.deepEqual(attributes(field(page, name)), attributes(field(home, name)), name);
  }
  assert.match(page, /<form id="contact-form"[^>]*action="\/api\/contact" method="post"/);
  assert.match(page, /<input type="checkbox" name="privacyConsent" required>/);
  assert.match(page, /id="contact-note" role="status" aria-live="polite"/);
  // ja-contact.js must run first: it provides window.RWHI18n and normalizes input before contact-form.js checks it.
  const scripts = [...page.matchAll(/<script src="\.\.\/([\w-]+\.js)[^"]*" defer><\/script>/g)].map(m => m[1]);
  assert.deepEqual(scripts, ['ja-contact.js', 'contact-form.js']);
});

function jaContext(form, extra = {}) {
  const elements = { '#contact-form': form, ...extra.elements };
  const context = vm.createContext({ window: {}, document: { querySelector: selector => elements[selector] ?? null },
    Event: class { constructor(type, init) { this.type = type; Object.assign(this, init); } }, ...extra.globals });
  vm.runInContext(read('ja-contact.js'), context);
  return context;
}

function listenerForm() {
  const listeners = {};
  return { listeners, addEventListener(type, listener) { listeners[type] = listener; } };
}

test('ja-contact.js has Japanese text for every message contact-form.js shows', () => {
  const source = read('contact-form.js');
  const keys = new Set([...source.matchAll(/'(contact[A-Z]\w*|sendMessage|sendingMessage|phoneInvalid)'/g)].map(m => m[1]));
  assert.ok(keys.size >= 9, [...keys].join());
  const { RWHI18n } = jaContext(listenerForm()).window;
  for (const key of keys) assert.match(RWHI18n.t(key), /[぀-ヿ一-鿿]/, key);
  const element = { dataset: {} };
  RWHI18n.message(element, 'contactSent');
  assert.equal(element.dataset.i18n, 'contactSent');
  assert.equal(element.textContent, RWHI18n.t('contactSent'));
});

test('full-width digits and symbols from a Japanese input method are converted once committed', () => {
  const form = listenerForm();
  jaContext(form);
  const field = (name, value) => ({ name, value, events: [], dispatchEvent(event) { this.events.push(event.type); } });
  const phone = field('phone', '０３－１２３４ー５６７８');
  form.listeners.input({ target: phone, isComposing: true });
  assert.equal(phone.value, '０３－１２３４ー５６７８');
  form.listeners.compositionend({ target: phone });
  assert.equal(phone.value, '03-1234-5678');
  assert.deepEqual(phone.events, ['input']);
  const email = field('email', 'ｔａｒｏ＠ｅｘａｍｐｌｅ．ｃｏ．ｊｐ');
  form.listeners.change({ target: email });
  assert.equal(email.value, 'taro@example.co.jp');
  const name = field('name', '山田　太郎');
  form.listeners.input({ target: name, isComposing: false });
  assert.equal(name.value, '山田　太郎');
  const plain = field('phone', '+81 90 1234 5678');
  form.listeners.input({ target: plain, isComposing: false });
  assert.deepEqual(plain.events, []);
});

test('on /ja/ contact-form.js binds the inline form, and /api/contact accepts what it sends', async () => {
  const values = { name: '山田 太郎', email: 'taro@example.co.jp', phone: '03-1234-5678', questions: 'BIMモデリングのご相談\n数量:3棟', website: '' };
  const fields = Object.fromEntries(Object.entries(values).map(([name, value]) => [name, { name, value, readOnly: false, setCustomValidity() {}, addEventListener() {} }]));
  const submit = { disabled: false, dataset: {} }, note = { dataset: {} };
  const form = { ...listenerForm(), elements: { namedItem: name => fields[name] }, querySelector: () => submit,
    reportValidity: () => true, setAttribute() {}, removeAttribute() {}, reset() {} };
  const emails = [];
  const handler = createContactHandler({ env: { RESEND_API_KEY: 'test-secret', RESEND_FROM_EMAIL: 'contact@example.com' }, logger: { error() {} },
    fetchRequest: async (url, options) => { emails.push(JSON.parse(options.body)); return { ok: true, status: 200, json: async () => ({ id: 'email-id' }) }; } });
  // The browser side posts to the real handler, as on Vercel.
  const fetch = async (url, options) => {
    const req = { method: options.method, headers: { host: 'www.rwhgroup.site', origin: 'https://www.rwhgroup.site', 'content-type': options.headers['Content-Type'] }, body: options.body };
    const res = { headers: {}, setHeader(key, value) { this.headers[key] = value; }, end(value) { this.body = value; } };
    await handler(req, res);
    return { ok: res.statusCode === 200, json: async () => JSON.parse(res.body) };
  };
  const context = jaContext(form, { elements: { '#contact-note': note },
    globals: { fetch, crypto: crypto.webcrypto, location: { protocol: 'https:' }, AbortSignal } });
  vm.runInContext(read('contact-form.js'), context);
  await form.listeners.submit({ preventDefault() {} });
  assert.equal(note.dataset.i18n, 'contactSent');
  assert.equal(note.textContent, context.window.RWHI18n.t('contactSent'));
  assert.equal(submit.textContent, '送信する');
  assert.equal(emails.length, 1);
  assert.deepEqual(emails[0].to, ['linh.rwh@gmail.com']);
  assert.equal(emails[0].reply_to, values.email);
  assert.ok(emails[0].text.includes(values.name) && emails[0].text.includes(values.questions) && emails[0].text.includes(values.phone));
});

test('every Vietnamese page links to /ja/ from the language switch, leaving the project panel frame', () => {
  for (const file of ['index.html', 'office/index.html', ...projects.map(p => `projects/${p.slug}/index.html`)]) {
    const switcher = read(file).match(/<div class="language-switch" role="group".*?<\/div>/s)[0];
    assert.match(switcher, /<a href="\/ja\/" target="_top" lang="ja" hreflang="ja" aria-label="日本語ページ">JA<\/a>/, file);
  }
  assert.match(read('site-language.css'), /\.language-switch :is\(button,a\) \{[^}]*text-decoration:none/);
});
