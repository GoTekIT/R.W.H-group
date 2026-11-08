'use strict';
// Local stand-in for Vercel: serves <repo>/dist and routes POST /api/contact to the repo's own
// handler (lib/contact.js). Resend is replaced by a recorder, so no email leaves this machine.
// Usage: node server.cjs <repo> <port>
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const repo = path.resolve(process.argv[2]);
const port = Number(process.argv[3] || 4174);
const dist = path.join(repo, 'dist');
const { createContactHandler } = require(path.join(repo, 'lib/contact.js'));

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain',
  '.json': 'application/json', '.mp4': 'video/mp4', '.gif': 'image/gif' };

let mode = 'ok';          // ok | fail | unconfigured
let sent = [];            // what Resend would have received
let handler = make();

function make() {
  const env = mode === 'unconfigured' ? {} : { RESEND_API_KEY: 'local-test-key', RESEND_FROM_EMAIL: 'website@example.com' };
  return createContactHandler({ env, logger: { error() {} }, fetchRequest: async (url, options) => {
    sent.push({ url, headers: options.headers, body: JSON.parse(options.body) });
    if (mode === 'fail') return { ok: false, status: 500, json: async () => ({ message: 'provider down' }) };
    return { ok: true, status: 200, json: async () => ({ id: 'local-' + sent.length }) };
  } });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://local');
  if (url.pathname === '/__sent') {
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(sent));
  }
  if (url.pathname === '/__mode') {
    mode = url.searchParams.get('set') || 'ok'; sent = []; handler = make();
    return res.end(mode);
  }
  if (url.pathname === '/api/contact') return handler(req, res);
  let file = path.join(dist, decodeURIComponent(url.pathname));
  if (!file.startsWith(dist)) { res.statusCode = 403; return res.end(); }
  // Like Vercel: a folder serves its index.html, with or without the trailing slash.
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.statusCode = 404; return res.end('not found'); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1', () => console.log(`ready http://127.0.0.1:${port}/`));
