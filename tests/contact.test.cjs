const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createContactHandler } = require('../lib/contact');
const { bindContactForm } = require('../dist/contact-form');

const values = { name: 'Nguyễn Linh', email: 'visitor@example.com', questions: 'Tư vấn Onsen\nDiện tích 2.000 m²', website: '', requestId: 'b339236a-0491-4d50-a2a5-73004cd25449' };
const env = { RESEND_API_KEY: 'test-secret', RESEND_FROM_EMAIL: 'contact@example.com' };
function setup(options = {}) {
  const calls = [];
  const handler = createContactHandler({ env, logger: { error() {} },
    fetchRequest: async (...args) => { calls.push(args); return { ok: true, status: 200, json: async () => ({ id: 'email-id' }) }; }, ...options });
  async function request(body = values, overrides = {}) {
    const req = { method: 'POST', headers: { host: 'rwh.example.com', origin: 'https://rwh.example.com', 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.1' }, body, ...overrides };
    const res = { headers: {}, setHeader(key, value) { this.headers[key] = value; }, end(value) { this.body = JSON.parse(value); } };
    await handler(req, res);
    return res;
  }
  return { request, calls };
}

test('sends all three fields to the owner with visitor Reply-To and fixed sender', async () => {
  const { request, calls } = setup();
  const result = await request({ ...values, to: 'attacker@example.com', from: 'attacker@example.com' });
  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.body, { ok: true });
  const [url, options] = calls[0];
  assert.equal(url, 'https://api.resend.com/emails');
  const email = JSON.parse(options.body);
  assert.deepEqual(email.to, ['linh.rwh@gmail.com']);
  assert.equal(email.from, 'R.W.H Group <contact@example.com>');
  assert.equal(email.reply_to, values.email);
  assert.ok(email.text.includes(values.name) && email.text.includes(values.questions));
  assert.equal(email.html, undefined);
  assert.equal(options.headers.Authorization, 'Bearer test-secret');
  assert.equal(result.headers['Cache-Control'], 'no-store');
  assert.ok(!JSON.stringify(result.body).includes('test-secret'));
});

test('unchanged retries reuse provider idempotency; edited content has a new key', async () => {
  const { request, calls } = setup();
  await request(); await request(); await request({ ...values, questions: 'Một câu hỏi khác' });
  const keys = calls.map(([, options]) => options.headers['Idempotency-Key']);
  assert.equal(keys[0], keys[1]);
  assert.notEqual(keys[0], keys[2]);
});

test('rejects invalid, oversized and honeypot input before calling Resend', async () => {
  const { request, calls } = setup();
  for (const body of [null, [], {}, { ...values, name: '  ' }, { ...values, name: 'Linh\r\nBcc: other@example.com' },
    { ...values, email: 'invalid' }, { ...values, email: 'a@example.com\r\n' }, { ...values, questions: '' },
    { ...values, questions: 'a'.repeat(4001) }, { ...values, website: 'https://spam.example' }, { ...values, requestId: '../invalid' }, '{bad json']) {
    assert.equal((await request(body)).statusCode, 400);
  }
  assert.equal((await request({ ...values, questions: 'a'.repeat(24001) })).statusCode, 413);
  assert.equal(calls.length, 0);
});

test('rejects cross-origin, missing-origin, unsupported methods and content types', async () => {
  const { request, calls } = setup();
  assert.equal((await request(values, { headers: { host: 'rwh.example.com', origin: 'https://evil.example' } })).statusCode, 403);
  assert.equal((await request(values, { headers: { host: 'rwh.example.com' } })).statusCode, 403);
  assert.equal((await request(values, { method: 'GET' })).statusCode, 405);
  assert.equal((await request(values, { headers: { host: 'rwh.example.com', origin: 'https://rwh.example.com', 'content-type': 'text/plain' } })).statusCode, 415);
  assert.equal(calls.length, 0);
});

test('missing configuration and provider failures never report success or expose details', async () => {
  const missing = setup({ env: {} });
  assert.deepEqual((await missing.request()).body, { ok: false, code: 'CONTACT_NOT_CONFIGURED' });
  assert.equal(missing.calls.length, 0);
  for (const fetchRequest of [
    async () => ({ ok: false, status: 403, json: async () => ({ message: 'secret provider detail' }) }),
    async () => ({ ok: true, status: 200, json: async () => ({}) }),
    async () => { throw new Error('secret network detail'); }
  ]) {
    const result = await setup({ fetchRequest }).request();
    assert.equal(result.statusCode, 502);
    assert.deepEqual(result.body, { ok: false, code: 'SEND_FAILED' });
  }
});

test('instance guard limits new attempts, permits retries and expires', async () => {
  let time = 0;
  const { request, calls } = setup({ now: () => time });
  for (let i = 0; i < 5; i++) assert.equal((await request({ ...values, questions: `Question ${i}` })).statusCode, 200);
  assert.equal((await request({ ...values, questions: 'Question 5' })).statusCode, 429);
  assert.equal((await request({ ...values, questions: 'Question 0' })).statusCode, 200);
  time = 600001;
  assert.equal((await request({ ...values, questions: 'Question 5' })).statusCode, 200);
  assert.equal(calls.length, 7);
});

function formPage(fetchRequest, protocol = 'https:') {
  const fields = Object.fromEntries(Object.entries(values).filter(([name]) => name !== 'requestId').map(([name, value]) => [name, { name, value, readOnly: false }]));
  const submit = { disabled: false, dataset: {} }, note = { dataset: {} };
  let resets = 0, ids = 0;
  const form = {
    elements: { namedItem: name => fields[name] }, querySelector: () => submit,
    reportValidity: () => true, setAttribute() {}, removeAttribute() {}, addEventListener() {},
    reset() { resets++; Object.values(fields).forEach(field => { field.value = ''; }); }
  };
  const controller = bindContactForm({ form, note, protocol, fetchRequest, makeId: () => `request-id-${++ids}-abcdef`,
    i18n: { message(element, key) { element.dataset.i18n = key; } } });
  return { send: () => controller.send({ preventDefault() {} }), fields, note, submit, resets: () => resets };
}

test('form prevents double submission, locks inputs and clears only after accepted success', async () => {
  let complete, calls = 0;
  const p = formPage(() => { calls++; return new Promise(resolve => { complete = resolve; }); });
  const pending = p.send();
  assert.equal(p.submit.disabled, true);
  assert.equal(p.fields.questions.readOnly, true);
  assert.equal(p.note.dataset.i18n, 'sendingMessage');
  await p.send();
  assert.equal(calls, 1);
  assert.equal(p.resets(), 0);
  complete({ ok: true, json: async () => ({ ok: true }) });
  await pending;
  assert.equal(p.note.dataset.i18n, 'contactSent');
  assert.equal(p.resets(), 1);
  assert.equal(p.submit.disabled, false);
  assert.equal(p.fields.questions.readOnly, false);
});

test('form preserves data and the same retry ID after a lost response', async () => {
  const payloads = [];
  const p = formPage(async (_, options) => { payloads.push(JSON.parse(options.body)); throw new Error('connection lost'); });
  await p.send(); await p.send();
  assert.equal(p.fields.questions.value, values.questions);
  assert.equal(p.resets(), 0);
  assert.equal(p.note.dataset.i18n, 'contactError');
  assert.equal(payloads[0].requestId, payloads[1].requestId);
  p.fields.questions.value = 'New content';
  await p.send();
  assert.notEqual(payloads[1].requestId, payloads[2].requestId);
});

test('form shows configuration/validation/rate errors and rejects a false success', async () => {
  for (const [result, ok, expected] of [
    [{ code: 'CONTACT_NOT_CONFIGURED' }, false, 'contactUnavailable'],
    [{ code: 'INVALID_INPUT' }, false, 'contactInvalid'],
    [{ code: 'RATE_LIMITED' }, false, 'contactRateLimited'],
    [{ ok: false }, true, 'contactError']
  ]) {
    const p = formPage(async () => ({ ok, json: async () => result }));
    await p.send();
    assert.equal(p.note.dataset.i18n, expected);
    assert.equal(p.resets(), 0);
    assert.equal(p.fields.email.value, values.email);
  }
});

test('local file preview does not send or claim success', async () => {
  let calls = 0;
  const p = formPage(async () => { calls++; }, 'file:');
  await p.send();
  assert.equal(calls, 0);
  assert.equal(p.note.dataset.i18n, 'contactLocal');
  assert.equal(p.fields.name.value, values.name);
});
