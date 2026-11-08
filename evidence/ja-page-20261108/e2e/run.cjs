'use strict';
// End-to-end checks in headless Chrome against server.cjs (real /api/contact, recorded Resend).
// From the repository root, with Google Chrome installed (macOS path in cdp.cjs) and Node 22:
//   node evidence/ja-page-20261108/e2e/server.cjs . 4175 &
//   node evidence/ja-page-20261108/e2e/run.cjs
// Screenshots go to the system temp folder. No email is sent: Resend is replaced by a recorder.
const { launch, sleep } = require('./cdp.cjs');
const base = 'http://127.0.0.1:4175';
const shots = require('node:fs').mkdtempSync(require('node:path').join(require('node:os').tmpdir(), 'ja-e2e-'));
const results = [];
function check(name, ok, detail = '') { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`); }
const mode = async m => (await fetch(`${base}/__mode?set=${m}`)).text();
const sent = async () => (await fetch(`${base}/__sent`)).json();
const note = b => b.eval(`(() => { const n = document.querySelector('#contact-note'); return {key: n.dataset.i18n || '', text: n.textContent}; })()`);

async function fillJa(b, { name = '山田 太郎', email = 'taro@example.co.jp', phone = '03-1234-5678', questions = 'BIMモデリングのご相談です。\n意匠・構造の2モデル、数量は3棟です。', consent = true } = {}) {
  await b.eval(`document.querySelector('#contact-form').reset()`);
  if (name) await b.type('#contact-name', name);
  if (email) await b.type('#contact-email', email);
  if (phone) await b.type('#contact-phone', phone);
  if (questions) await b.type('#contact-questions', questions);
  if (consent) await b.click('#contact-form input[name="privacyConsent"]');
}

(async () => {
  const b = await launch(9334);

  // 1. Page loads at /ja/ and /ja without broken files or script errors.
  for (const url of ['/ja/', '/ja']) {
    await b.viewport(1280, 900);
    await b.goto(base + url);
    check(`${url} loads with no failed requests`, b.failures.length === 0, b.failures.join(', '));
    check(`${url} has no script errors`, b.console.length === 0, b.console.join(' | '));
    const imgs = await b.eval(`(async () => { const imgs = [...document.images]; imgs.forEach(i => i.loading = 'eager'); await Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); return imgs.map(i => [i.currentSrc.split('/').pop(), i.naturalWidth]); })()`);
    const broken = imgs.filter(([, w]) => !w);
    check(`${url} all ${imgs.length} images decode`, imgs.length >= 15 && broken.length === 0, broken.map(([s]) => s).join(', '));
  }
  const pdfs = await b.eval(`[...document.querySelectorAll('a[href*=".pdf"], a[href*="flyer"]')].map(a => a.href)`);
  for (const href of [...new Set(pdfs)]) {
    const res = await fetch(href);
    check(`file link opens: ${href.replace(base, '')}`, res.ok, String(res.status));
  }
  const projectLinks = await b.eval(`[...document.querySelectorAll('a[href*="/projects/"]')].map(a => a.href)`);
  let projectOk = 0;
  for (const href of projectLinks) if ((await fetch(href)).ok) projectOk++;
  check(`project links open (${projectLinks.length})`, projectLinks.length >= 11 && projectOk === projectLinks.length);
  const viLinks = await b.eval(`[...document.querySelectorAll('a[lang="vi"]')].map(a => a.href)`);
  check('Vietnamese links go to the home page', viLinks.length >= 2 && viLinks.every(h => h === base + '/'), viLinks.join(' '));

  // 2. Japanese form: success path.
  await mode('ok');
  await b.goto(base + '/ja/');
  check('form starts with the Japanese ready line', (await note(b)).text.startsWith('内容を確認のうえ'));
  await fillJa(b);
  await b.screenshot(shots + '/ja-form-filled.png');
  await b.click('#contact-form button[type="submit"]');
  await b.waitFor(`document.querySelector('#contact-note').dataset.i18n === 'contactSent'`);
  let n = await note(b);
  check('send succeeds and says so in Japanese', n.key === 'contactSent' && n.text === 'お問い合わせありがとうございます。担当者よりご連絡いたします。', n.text);
  let mails = await sent();
  const mail = mails[0]?.body || {};
  check('one email handed to Resend', mails.length === 1, String(mails.length));
  check('email goes to linh.rwh@gmail.com only', JSON.stringify(mail.to) === '["linh.rwh@gmail.com"]', JSON.stringify(mail.to));
  check('Reply-To is the visitor', mail.reply_to === 'taro@example.co.jp');
  check('email text keeps the Japanese intact', /山田 太郎/.test(mail.text) && /意匠・構造の2モデル、数量は3棟です。/.test(mail.text) && /03-1234-5678/.test(mail.text), JSON.stringify(mail.text));
  check('form is cleared after success', (await b.eval(`document.querySelector('#contact-name').value`)) === '');
  check('button back to 送信する', (await b.eval(`document.querySelector('#contact-form button[type="submit"]').textContent`)) === '送信する');
  await b.screenshot(shots + '/ja-form-sent.png');

  // 3. Full-width input from a Japanese IME is converted before sending.
  await mode('ok');
  await fillJa(b, { email: 'ｈａｎａｋｏ＠ｅｘａｍｐｌｅ．ｊｐ', phone: '０９０ー１２３４ー５６７８' });
  check('full-width phone converted in the field', (await b.eval(`document.querySelector('#contact-phone').value`)) === '090-1234-5678', await b.eval(`document.querySelector('#contact-phone').value`));
  await b.click('#contact-form button[type="submit"]');
  await b.waitFor(`document.querySelector('#contact-note').dataset.i18n === 'contactSent'`);
  mails = await sent();
  check('full-width email and phone arrive half-width', mails[0]?.body.reply_to === 'hanako@example.jp' && /090-1234-5678/.test(mails[0]?.body.text), JSON.stringify(mails[0]?.body.reply_to));

  // 4. Consent unticked: the browser blocks the send.
  await mode('ok');
  await fillJa(b, { consent: false });
  await b.click('#contact-form button[type="submit"]');
  await sleep(800);
  check('no send without consent', (await sent()).length === 0 && (await b.eval(`document.querySelector('#contact-form input[name="privacyConsent"]').matches(':invalid')`)));

  // 5. Invalid phone: Japanese validation message, nothing sent.
  await fillJa(b, { phone: '12' });
  await b.click('#contact-form button[type="submit"]');
  await sleep(800);
  const phoneMsg = await b.eval(`document.querySelector('#contact-phone').validationMessage`);
  check('short phone blocked with the Japanese message', (await sent()).length === 0 && phoneMsg === '電話番号を正しくご入力ください(数字7〜15桁)。', phoneMsg);

  // 6. Provider failure: Japanese error, text kept, nothing claimed.
  await mode('fail');
  await fillJa(b);
  await b.click('#contact-form button[type="submit"]');
  await b.waitFor(`document.querySelector('#contact-note').dataset.i18n === 'contactError'`);
  n = await note(b);
  check('Resend failure shows the Japanese error and keeps the text', n.key === 'contactError' && (await b.eval(`document.querySelector('#contact-questions').value`)).includes('BIMモデリング'), n.text);
  await b.screenshot(shots + '/ja-form-error.png');

  // 7. Mail not configured (no Resend key on the server).
  await mode('unconfigured');
  await fillJa(b);
  await b.click('#contact-form button[type="submit"]');
  await b.waitFor(`document.querySelector('#contact-note').dataset.i18n === 'contactUnavailable'`);
  n = await note(b);
  check('missing Resend settings show the Japanese "unavailable" line', n.key === 'contactUnavailable' && (await sent()).length === 0, n.text);

  // 8. Honeypot filled (a bot): rejected, nothing sent.
  await mode('ok');
  await fillJa(b);
  await b.eval(`document.querySelector('#contact-website').value = 'https://spam.example'`);
  await b.click('#contact-form button[type="submit"]');
  await b.waitFor(`document.querySelector('#contact-note').dataset.i18n === 'contactInvalid'`);
  check('honeypot filled: rejected, nothing sent', (await note(b)).key === 'contactInvalid' && (await sent()).length === 0);

  // 9. Rate limit: the sixth different message within 10 minutes is refused.
  await mode('ok');
  let last;
  for (let i = 1; i <= 6; i++) {
    await fillJa(b, { questions: `テスト ${i}` });
    await b.click('#contact-form button[type="submit"]');
    await b.waitFor(`['contactSent','contactRateLimited'].includes(document.querySelector('#contact-note').dataset.i18n) && !document.querySelector('#contact-form').hasAttribute('aria-busy')`);
    last = await note(b);
  }
  check('sixth message is rate limited, in Japanese', last.key === 'contactRateLimited' && (await sent()).length === 5, last.text);

  // 10. The Vietnamese form still works (regression).
  await mode('ok');
  await b.goto(base + '/');
  check('home loads with no failed requests or errors', b.failures.length === 0 && b.console.length === 0, b.failures.concat(b.console).join(' | '));
  await b.eval(`document.querySelector('[data-contact-open]').click()`);
  await sleep(800);
  await b.type('#contact-name', 'Nguyễn Thử');
  await b.type('#contact-email', 'thu@example.com');
  await b.type('#contact-phone', '0901234567');
  await b.type('#contact-questions', 'Kiểm tra form tiếng Việt');
  await b.click('#contact-modal input[name="privacyConsent"]');
  await b.click('#contact-modal button[type="submit"]');
  await b.waitFor(`document.querySelector('#contact-note').dataset.i18n === 'contactSent'`);
  mails = await sent();
  check('Vietnamese form sends as before', (await note(b)).key === 'contactSent' && mails.length === 1 && /Kiểm tra form tiếng Việt/.test(mails[0].body.text));

  // 11. JA in the language switch, on the home page, a project page and the office page.
  for (const url of ['/', '/projects/hakuba-hotel/index.html', '/office']) {
    await b.goto(base + url);
    const ja = await b.eval(`(() => { const a = document.querySelector('.language-switch:not(.contact-language) a[hreflang="ja"]'); if (!a) return null; const r = a.getBoundingClientRect(); const s = getComputedStyle(a); return {href: a.href, w: r.width, h: r.height, visible: r.width > 0 && s.visibility !== 'hidden' && s.display !== 'none', deco: s.textDecorationLine}; })()`);
    check(`JA link visible on ${url}`, ja && ja.visible && ja.href === base + '/ja/' && ja.deco === 'none', JSON.stringify(ja));
  }
  await b.goto(base + '/');
  await b.click('.language-switch:not(.contact-language) a[hreflang="ja"]');
  await b.waitFor(`location.pathname === '/ja/' && document.readyState === 'complete'`);
  check('clicking JA opens /ja/', (await b.eval('location.pathname')) === '/ja/');

  // 12. Inside the home page's project panel (iframe), JA opens /ja/ in the whole window.
  await b.goto(base + '/');
  await b.eval(`document.querySelector('[data-project-open]').click()`);
  const framed = await b.waitFor(`(() => { const f = document.querySelector('.project-panel iframe, dialog iframe'); return f && f.contentDocument && f.contentDocument.querySelector('.language-switch a[hreflang="ja"]'); })()`, 10000);
  if (framed) {
    await b.eval(`document.querySelector('.project-panel iframe, dialog iframe').contentDocument.querySelector('.language-switch a[hreflang="ja"]').click()`);
    await b.waitFor(`location.pathname === '/ja/'`, 8000);
  }
  check('JA inside the project panel opens /ja/ in the top window', framed && (await b.eval('location.pathname')) === '/ja/', framed ? '' : 'panel did not open');

  // 13. Screenshots: phone and desktop.
  for (const [w, h, label] of [[390, 844, 'phone'], [1280, 900, 'desktop']]) {
    await b.viewport(w, h, w < 500);
    await b.goto(base + '/ja/');
    await b.eval(`(async () => { const imgs = [...document.images]; imgs.forEach(i => i.loading = 'eager'); await Promise.all(imgs.map(i => i.complete && i.naturalWidth ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); await document.fonts.ready; })()`);
    await sleep(500);
    await b.screenshot(`${shots}/ja-${label}-top.png`);
    await b.screenshot(`${shots}/ja-${label}-full.png`, true);
    const overflow = await b.eval(`document.documentElement.scrollWidth - document.documentElement.clientWidth`);
    check(`/ja/ has no sideways scroll at ${w}px`, overflow <= 0, String(overflow));
    await b.goto(base + '/');
    await sleep(1200);
    await b.screenshot(`${shots}/home-${label}-switch.png`);
  }
  await b.viewport(320, 640, true);
  await b.goto(base + '/');
  await sleep(1200);
  await b.screenshot(`${shots}/home-320-switch.png`);

  await b.close();
  const failed = results.filter(r => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
})().catch(error => { console.error(error); process.exit(2); });
