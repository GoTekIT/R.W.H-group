'use strict';

const { createHash } = require('node:crypto');
const RECIPIENT = 'linh.rwh@gmail.com';
const MAX_BYTES = 24000;
const RATE_WINDOW = 10 * 60 * 1000;

function isEmail(value) {
  return typeof value === 'string' && value.length <= 254 &&
    /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(value) && !/[\x00-\x1f\x7f]/.test(value);
}

function reply(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const size = Number(req.headers['content-length']);
  if (size > MAX_BYTES) throw new Error('TOO_LARGE');
  let body = req.body;
  if (body === undefined) {
    const chunks = [];
    let bytes = 0;
    for await (const chunk of req) {
      bytes += Buffer.byteLength(chunk);
      if (bytes > MAX_BYTES) throw new Error('TOO_LARGE');
      chunks.push(Buffer.from(chunk));
    }
    body = Buffer.concat(chunks).toString('utf8');
  }
  if (Buffer.isBuffer(body)) body = body.toString('utf8');
  if (Buffer.byteLength(typeof body === 'string' ? body : JSON.stringify(body)) > MAX_BYTES) {
    throw new Error('TOO_LARGE');
  }
  return typeof body === 'string' ? JSON.parse(body) : body;
}

function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const limits = { name: 120, email: 254, questions: 4000 };
  const values = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof body[key] !== 'string' || body[key].length > limit) return null;
    if (key !== 'questions' && /[\x00-\x1f\x7f]/.test(body[key])) return null;
    values[key] = body[key].trim();
    if (!values[key]) return null;
  }
  if (/[\x00-\x1f\x7f]/.test(values.name) || !isEmail(values.email)) return null;
  if (body.website !== undefined && body.website !== '') return null;
  if (typeof body.requestId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(body.requestId)) return null;
  return values;
}

function sameOrigin(req) {
  try {
    const origin = new URL(req.headers.origin);
    return ['http:', 'https:'].includes(origin.protocol) &&
      origin.host.toLowerCase() === String(req.headers.host).toLowerCase();
  } catch { return false; }
}

function createContactHandler({ env = process.env, fetchRequest = globalThis.fetch,
  now = Date.now, logger = console } = {}) {
  // This guard is per warm instance; it is not a distributed rate limiter.
  const attempts = new Map();
  function allow(ip, key) {
    const time = now();
    for (const [address, entry] of attempts) if (entry.until <= time) attempts.delete(address);
    let entry = attempts.get(ip);
    if (!entry) {
      if (attempts.size >= 1000) attempts.delete(attempts.keys().next().value);
      entry = { until: time + RATE_WINDOW, keys: new Set() };
      attempts.set(ip, entry);
    }
    if (entry.keys.has(key)) return true;
    if (entry.keys.size >= 5) return false;
    entry.keys.add(key);
    return true;
  }

  return async function contact(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return reply(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
    }
    if (!sameOrigin(req)) return reply(res, 403, { ok: false, code: 'FORBIDDEN' });
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {
      return reply(res, 415, { ok: false, code: 'INVALID_INPUT' });
    }
    let body;
    try { body = await readBody(req); }
    catch (error) {
      return reply(res, error.message === 'TOO_LARGE' ? 413 : 400, { ok: false, code: 'INVALID_INPUT' });
    }
    const values = validate(body);
    if (!values) return reply(res, 400, { ok: false, code: 'INVALID_INPUT' });
    const apiKey = (env.RESEND_API_KEY || '').trim();
    const sender = (env.RESEND_FROM_EMAIL || '').trim();
    if (!apiKey || !isEmail(sender)) {
      return reply(res, 503, { ok: false, code: 'CONTACT_NOT_CONFIGURED' });
    }
    const key = createHash('sha256').update(JSON.stringify({
      requestId: body.requestId, ...values, sender, recipient: RECIPIENT
    })).digest('hex');
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    if (!allow(ip, key)) {
      res.setHeader('Retry-After', '600');
      return reply(res, 429, { ok: false, code: 'RATE_LIMITED' });
    }
    try {
      const response = await fetchRequest('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(8000),
        headers: {
          Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json',
          'Idempotency-Key': `rwh-contact/${key}`
        },
        body: JSON.stringify({
          from: `R.W.H Group <${sender}>`, to: [RECIPIENT], reply_to: values.email,
          subject: 'R.W.H Group — Yêu cầu liên hệ mới',
          text: `Yêu cầu liên hệ từ landing page R.W.H Group\n\nName: ${values.name}\nEmail: ${values.email}\n\nQuestions:\n${values.questions}`
        })
      });
      const result = await response.json();
      if (!response.ok || typeof result.id !== 'string' || !result.id) {
        logger.error('Contact email request failed', { status: response.status });
        return reply(res, 502, { ok: false, code: 'SEND_FAILED' });
      }
      return reply(res, 200, { ok: true });
    } catch {
      logger.error('Contact email request failed');
      return reply(res, 502, { ok: false, code: 'SEND_FAILED' });
    }
  };
}

module.exports = { createContactHandler };
