const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '../dist/project-panel.js'), 'utf8');

function page({reduced = false, embedded = false} = {}) {
  const timers = new Map(); let next = 0, active, blocked = false;
  function element() {
    const events = {}, classes = new Set();
    return {attributes:{}, dataset:{}, open:false, classList:{
      add(...values) { values.forEach(value => classes.add(value)); },
      remove(...values) { values.forEach(value => classes.delete(value)); },
      contains(value) { return classes.has(value); }
    }, addEventListener(type, callback) { (events[type] ||= []).push(callback); },
    emit(type, event = {}) { (events[type] || []).forEach(callback => callback(event)); },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; if (name === 'src') delete this.src; },
    focus() { active = this; }, closest() { return blocked ? {} : null; }
    };
  }
  const panel = element(), frame = element(), close = element(), title = element(), fallback = element(), link = element(), menu = element();
  link.href = 'https://rwh.example/projects/the-hera-resort/index.html';
  link.dataset.projectTitle = 'THE HERA RESORT';
  frame.contentWindow = {};
  frame.contentDocument = {querySelector: selector => selector === '.project-photos' ? {} : {textContent:'THE HERA RESORT'}};
  panel.querySelector = selector => ({iframe:frame, '[data-panel-close]':close, '#project-panel-title':title, '[data-panel-fallback]':fallback})[selector];
  panel.showModal = () => {panel.open = true; close.focus();};
  panel.close = () => {panel.open = false; panel.emit('close');};
  const doc = element(); doc.documentElement = element();
  const nestedDialog = element(), observers = []; let nestedOpen = false;
  doc.querySelector = selector => ({'#project-panel':embedded ? null : panel, '.menu':menu, 'dialog[open]':nestedOpen ? nestedDialog : null})[selector] || null;
  doc.querySelectorAll = selector => selector === '[data-project-open]' ? [link] : selector === 'dialog' ? [nestedDialog] : [];
  const win = element();
  win.location = new URL(embedded ? 'https://rwh.example/projects/the-hera-resort/index.html?panel=1&lang=en' : 'https://rwh.example/');
  const messages = [];
  win.parent = embedded ? {postMessage:(message, target) => messages.push({message,target})} : win;
  win.matchMedia = () => ({matches:reduced});
  win.RWHI18n = {language:'vi', t:(key, values) => values.title, setLanguage(value) {this.language = value;}};
  vm.runInNewContext(source, {window:win, document:doc, URL, URLSearchParams,
    MutationObserver:class {constructor(callback) {observers.push(callback);} observe() {}},
    requestAnimationFrame:callback => callback(), setTimeout:(callback, delay) => {const id = ++next; timers.set(id,{callback,delay}); return id;}, clearTimeout:id => timers.delete(id)});
  function click(overrides = {}) {
    const event = {button:0, preventDefault() {this.defaultPrevented = true;}, ...overrides};
    link.emit('click', event); return event;
  }
  function finish() {for (const [id, timer] of [...timers]) {timers.delete(id); timer.callback();}}
  return {panel,frame,close,title,fallback,link,menu,doc,win,click,finish,timers,messages,blockTrigger:() => {blocked = true;}, active:() => active,
    setNestedOpen(value) {nestedOpen = value; observers.forEach(callback => callback());}};
}

test('Details opens a full modal at the same landing URL and loads only the selected project', () => {
  const p = page();
  assert.equal(p.frame.src, undefined);
  assert.equal(p.click().defaultPrevented, true);
  assert.equal(p.panel.open, true);
  assert.equal(p.panel.classList.contains('is-visible'), true);
  assert.equal(p.win.location.href, 'https://rwh.example/');
  assert.equal(p.frame.src, 'https://rwh.example/projects/the-hera-resort/index.html?panel=1&lang=vi');
  assert.equal(p.fallback.href, p.link.href);
  assert.equal(p.active(), p.close);
  p.frame.emit('load');
  assert.equal(p.panel.classList.contains('is-loaded'), true);
  assert.equal(p.frame.tabIndex, 0);
});

test('modified clicks retain the real project link; close animates and releases the frame', () => {
  const p = page();
  assert.equal(p.click({ctrlKey:true}).defaultPrevented, undefined);
  assert.equal(p.panel.open, false);
  p.click(); p.close.emit('click');
  assert.equal(p.panel.open, true);
  assert.equal(p.panel.classList.contains('is-visible'), false);
  p.finish();
  assert.equal(p.panel.open, false);
  assert.equal(p.frame.src, undefined);
  assert.equal(p.active(), p.link);
  p.frame.emit('load');
  assert.equal(p.panel.classList.contains('is-loaded'), false);
});

test('Escape respects reduced motion and restores focus when autoplay made the trigger inert', () => {
  const p = page({reduced:true});
  p.click(); p.blockTrigger();
  let prevented = false;
  p.panel.emit('cancel', {preventDefault() {prevented = true;}});
  assert.equal(prevented, true);
  assert.equal([...p.timers.values()][0].delay, 0);
  p.finish();
  assert.equal(p.active(), p.menu);
});

test('failed content has a direct-link fallback; only the actual same-origin frame can close or change language', () => {
  const p = page(); p.click();
  p.frame.contentDocument.querySelector = () => null;
  p.frame.emit('load');
  assert.equal(p.panel.classList.contains('is-error'), true);
  const close = {type:'rwh:project-close'};
  p.win.emit('message', {source:p.frame.contentWindow, origin:'https://another.example', data:close});
  p.win.emit('message', {source:{}, origin:p.win.location.origin, data:close});
  assert.equal(p.panel.classList.contains('is-visible'), true);
  p.win.emit('message', {source:p.frame.contentWindow, origin:p.win.location.origin, data:{type:'rwh:project-language', language:'en'}});
  assert.equal(p.win.RWHI18n.language, 'en');
  p.win.emit('message', {source:p.frame.contentWindow, origin:p.win.location.origin, data:close});
  p.finish(); assert.equal(p.panel.open, false);
});

test('embedded Escape closes the panel, while a nested image/contact dialog keeps Escape', () => {
  const p = page({embedded:true});
  assert.equal(p.doc.documentElement.classList.contains('project-embedded'), true);
  assert.equal(p.win.RWHI18n.language, 'en');
  p.doc.emit('keydown', {key:'Escape', preventDefault() {}});
  assert.equal(p.messages.filter(item => item.message.type === 'rwh:project-close').length, 1);
  const original = p.doc.querySelector;
  p.doc.querySelector = selector => selector === 'dialog[open]' ? {} : original(selector);
  p.doc.emit('keydown', {key:'Escape', preventDefault() {}});
  assert.equal(p.messages.filter(item => item.message.type === 'rwh:project-close').length, 1);
});

test('embedded native dialog opening and closing reports the active close-control layer', () => {
  const p = page({embedded:true});
  p.setNestedOpen(true); p.setNestedOpen(false);
  assert.deepEqual(p.messages.filter(item => item.message.type === 'rwh:project-dialog').map(item => item.message.open), [false,true,false]);
});

test('only the trusted frame can hide the outer close button, and it is restored on dismissal', () => {
  const p = page(); p.click();
  const update = (origin, source, open) => p.win.emit('message', {origin,source,data:{type:'rwh:project-dialog',open}});
  update('https://another.example', p.frame.contentWindow, true);
  update(p.win.location.origin, {}, true);
  update(p.win.location.origin, p.frame.contentWindow, 'true');
  assert.equal(p.close.hidden, false);
  update(p.win.location.origin, p.frame.contentWindow, true);
  assert.equal(p.close.hidden, true); assert.equal(p.close.disabled, true);
  update(p.win.location.origin, p.frame.contentWindow, false);
  assert.equal(p.close.hidden, false); assert.equal(p.close.disabled, false);
  update(p.win.location.origin, p.frame.contentWindow, true);
  p.panel.close();
  assert.equal(p.close.hidden, false); assert.equal(p.close.disabled, false);
});
