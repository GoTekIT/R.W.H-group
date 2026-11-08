'use strict';
// Minimal Chrome DevTools Protocol client: launch headless Chrome, open one page, evaluate,
// type, screenshot, and collect failed network responses. Node 22 (global WebSocket, fetch).
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function launch(port = 9333) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-'));
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
  let targets;
  for (let i = 0; i < 50; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); break; } catch { await sleep(200); }
  }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id); pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    } else if (msg.method) listeners.forEach(fn => fn(msg));
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const n = ++id; pending.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params }));
  });
  const failures = [];
  const console_ = [];
  listeners.push(msg => {
    if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400) {
      failures.push(`${msg.params.response.status} ${msg.params.response.url}`);
    }
    if (msg.method === 'Network.loadingFailed' && !msg.params.canceled) failures.push(`failed ${msg.params.errorText} ${msg.params.requestId}`);
    if (msg.method === 'Runtime.exceptionThrown') console_.push('exception: ' + msg.params.exceptionDetails.exception?.description);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') console_.push('console.error: ' + msg.params.args.map(a => a.value ?? a.description).join(' '));
  });
  await send('Page.enable'); await send('Network.enable'); await send('Runtime.enable');

  const api = {
    send, failures, console: console_,
    async viewport(width, height = 900, mobile = false) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
    },
    async goto(url) {
      failures.length = 0; console_.length = 0;
      const loaded = new Promise(resolve => listeners.push(function once(msg) {
        if (msg.method === 'Page.loadEventFired') { listeners.splice(listeners.indexOf(once), 1); resolve(); }
      }));
      await send('Page.navigate', { url });
      await loaded; await sleep(600);
    },
    async eval(expression) {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || 'eval failed');
      return result.result.value;
    },
    async focus(selector) { await api.eval(`document.querySelector(${JSON.stringify(selector)}).focus()`); },
    async type(selector, text) { await api.focus(selector); await send('Input.insertText', { text }); },
    async click(selector) {
      // Scroll without the page's smooth scrolling, then click only once the element is the one
      // under the pointer (intro animations and overlays would otherwise swallow the click).
      const where = `(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.scrollIntoView({block:'center', behavior:'instant'}); const r = el.getBoundingClientRect(); const x = r.x + r.width / 2, y = r.y + r.height / 2; const top = document.elementFromPoint(x, y); return {x, y, hit: top === el || el.contains(top) || (el.labels && [...el.labels].some(l => l.contains(top))), top: top ? top.outerHTML.slice(0, 80) : null}; })()`;
      let box;
      for (let i = 0; i < 40; i++) { box = await api.eval(where); if (box.hit) break; await sleep(100); }
      if (!box.hit) throw new Error(`click ${selector}: covered by ${box.top}`);
      for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: 'left', clickCount: 1 });
    },
    async waitFor(expression, timeout = 8000) {
      const end = Date.now() + timeout;
      while (Date.now() < end) { if (await api.eval(expression)) return true; await sleep(100); }
      return false;
    },
    async screenshot(file, fullPage = false) {
      let clip;
      if (fullPage) {
        const { contentSize } = await send('Page.getLayoutMetrics');
        clip = { x: 0, y: 0, width: contentSize.width, height: contentSize.height, scale: 1 };
      }
      const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: fullPage, ...(clip ? { clip } : {}) });
      fs.writeFileSync(file, Buffer.from(data, 'base64'));
    },
    async close() { ws.close(); chrome.kill(); }
  };
  return api;
}

module.exports = { launch, sleep };
