const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '../dist/project-panel.js'), 'utf8');

function page({reduced = false, embedded = false, nativeLocation = false} = {}) {
  const timers = new Map(); let next = 0, active, blocked = false;
  function element() {
    const events = {}, classes = new Set();
    return {attributes:{}, dataset:{}, open:false, classList:{
      add(...values) { values.forEach(value => classes.add(value)); },
      remove(...values) { values.forEach(value => classes.delete(value)); },
      toggle(value, on) { if (on) classes.add(value); else classes.delete(value); },
      contains(value) { return classes.has(value); }
    }, addEventListener(type, callback) { (events[type] ||= []).push(callback); },
    emit(type, event = {}) { (events[type] || []).forEach(callback => callback(event)); },
    dispatchEvent(event) { this.emit(event.type, event); },
    setAttribute(name, value) { this.attributes[name] = value; },
    getAttribute(name) { return this.attributes[name] ?? (name === 'src' ? this.src : null); },
    removeAttribute(name) { delete this.attributes[name]; if (name === 'src') delete this.src; },
    focus() { active = this; }, closest() { return blocked ? {} : null; }
    };
  }
  const panel = element(), frame = element(), close = element(), title = element(), loading = element(), error = element(), retry = element(), link = element(), office = element(), contactLink = element(), menu = element();
  link.href = 'https://rwh.example/projects/the-hera-resort/index.html';
  link.dataset.projectTitle = 'THE HERA RESORT';
  office.href = 'https://rwh.example/office';
  contactLink.attributes.href = '#contact-modal';
  contactLink.href = 'https://rwh.example/projects/the-hera-resort/index.html?panel=1#contact-modal';
  const navigations = [];
  frame.contentWindow = nativeLocation ? {location:{replace:url => navigations.push(url)}} : {};
  frame.contentDocument = {querySelector: selector => selector === '.project-photos' ? {} : {textContent:'THE HERA RESORT'}};
  panel.querySelector = selector => ({iframe:frame, '[data-panel-close]':close, '#project-panel-title':title, '[data-panel-loading]':loading, '[data-panel-error]':error, '[data-panel-retry]':retry})[selector];
  panel.showModal = () => {panel.open = true; close.focus();};
  panel.close = () => {panel.open = false; panel.emit('close');};
  const doc = element(); doc.documentElement = element();
  const nestedDialog = element(), observers = []; let nestedOpen = false;
  doc.querySelector = selector => ({'#project-panel':embedded ? null : panel, '.menu':menu, 'dialog[open]':nestedOpen ? nestedDialog : null})[selector] || null;
  doc.querySelectorAll = selector => selector === '[data-project-open], [data-office-open]' ? [link, office] : selector === 'dialog' ? [nestedDialog] : selector === 'a[href]' ? [office,contactLink] : selector === 'dialog[open]' && nestedOpen ? [nestedDialog] : [];
  const win = element();
  win.location = new URL(embedded ? 'https://rwh.example/projects/the-hera-resort/index.html?panel=1&lang=en' : 'https://rwh.example/');
  const messages = [];
  win.parent = embedded ? {postMessage:(message, target) => messages.push({message,target})} : win;
  win.matchMedia = () => ({matches:reduced});
  win.RWHI18n = {language:'vi', t:(key, values) => values?.title || key, message(element, key) {element.textContent = key; element.dataset.i18n = key;}, setLanguage(value) {this.language = value;}};
  vm.runInNewContext(source, {window:win, document:doc, URL, URLSearchParams, Event,
    MutationObserver:class {constructor(callback) {observers.push(callback);} observe() {}},
    requestAnimationFrame:callback => callback(), setTimeout:(callback, delay) => {const id = ++next; timers.set(id,{callback,delay}); return id;}, clearTimeout:id => timers.delete(id)});
  function click(overrides = {}) {
    const event = {button:0, preventDefault() {this.defaultPrevented = true;}, ...overrides};
    link.emit('click', event); return event;
  }
  function finish() {for (const [id, timer] of [...timers]) {timers.delete(id); timer.callback();}}
  return {panel,frame,close,title,loading,error,retry,link,office,contactLink,menu,doc,win,click,finish,timers,messages,navigations,blockTrigger:() => {blocked = true;}, active:() => active,
    setNestedOpen(value) {nestedOpen = value; observers.forEach(callback => callback());}};
}

test('Details opens a full modal at the same landing URL and loads only the selected project', () => {
  const p = page();
  let opened = 0;
  p.doc.addEventListener('rwh:project-open', () => { assert.equal(p.panel.open, true); opened++; });
  assert.equal(p.frame.src, undefined);
  assert.equal(p.click().defaultPrevented, true);
  assert.equal(p.close.attributes['aria-label'], 'closeProject');
  assert.equal(p.panel.open, true);
  assert.equal(opened, 1);
  assert.equal(p.panel.classList.contains('is-visible'), true);
  assert.equal(p.win.location.href, 'https://rwh.example/');
  assert.equal(p.frame.src, 'https://rwh.example/projects/the-hera-resort/index.html?panel=1&lang=vi');

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

test('Escape respects reduced motion and restores focus when the trigger is no longer focusable', () => {
  const p = page({reduced:true});
  p.click(); p.blockTrigger();
  let prevented = false;
  p.panel.emit('cancel', {preventDefault() {prevented = true;}});
  assert.equal(prevented, true);
  assert.equal([...p.timers.values()][0].delay, 0);
  p.finish();
  assert.equal(p.active(), p.menu);
});

test('failed content retries inside the landing; only the actual same-origin frame can close or change language', () => {
  const p = page(); p.click();
  p.frame.contentDocument.querySelector = () => null;
  p.frame.emit('load');
  assert.equal(p.panel.classList.contains('is-error'), true);
  p.retry.emit('click');
  assert.equal(p.panel.classList.contains('is-error'), false);
  assert.equal(p.win.location.href, 'https://rwh.example/');
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


test('Office opens in the same landing panel with Office loading and title semantics', () => {
  const p = page();
  let prevented = false;
  p.office.emit('click', {button:0, preventDefault() {prevented = true;}});
  assert.equal(prevented, true);
  assert.equal(p.panel.open, true);
  assert.equal(p.frame.src, 'https://rwh.example/office?panel=1&lang=vi');
  assert.equal(p.win.location.href, 'https://rwh.example/');
  assert.equal(p.loading.textContent, 'loadingOffice');
  assert.equal(p.error.textContent, 'officeLoadError');
  assert.equal(p.panel.classList.contains('is-office'), true);
  p.frame.contentDocument.querySelector = selector => selector === '.office-main' ? {} : {textContent:'Văn phòng'};
  p.frame.emit('load');
  assert.equal(p.panel.classList.contains('is-loaded'), true);
  assert.equal(p.frame.title, 'viewOffice');
  assert.equal(p.close.attributes['aria-label'], 'closeOffice');
  p.close.emit('click'); p.finish();
  assert.equal(p.active(), p.office);
});

test('only trusted same-origin Office/project navigation can replace embedded content', () => {
  const p = page(); p.click();
  const initial = p.frame.src;
  p.win.emit('message', {origin:p.win.location.origin,source:p.frame.contentWindow,data:{type:'rwh:page-open',href:'https://other.example/office'}});
  assert.equal(p.frame.src, initial);
  p.win.emit('message', {origin:p.win.location.origin,source:{},data:{type:'rwh:page-open',href:'https://rwh.example/office'}});
  assert.equal(p.frame.src, initial);
  p.win.emit('message', {origin:p.win.location.origin,source:p.frame.contentWindow,data:{type:'rwh:page-open',href:'https://rwh.example/office'}});
  assert.equal(p.frame.src, 'https://rwh.example/office?panel=1&lang=vi');
});


test('native iframe navigation always replaces the entry, including its first load and cleanup', () => {
  const p = page({nativeLocation:true}); p.click();
  assert.equal(p.frame.src, undefined);
  assert.equal(p.navigations[0], 'https://rwh.example/projects/the-hera-resort/index.html?panel=1&lang=vi');
  assert.equal(p.frame.dataset.panelSrc, p.navigations[0]);
  p.close.emit('click'); p.finish();
  assert.equal(p.navigations.at(-1), 'about:blank');
  assert.equal(p.frame.dataset.panelSrc, undefined);
});

test('embedded Contact anchors stay local while Office navigation is sent to the landing', () => {
  const p = page({embedded:true});
  let contactPrevented = false, officePrevented = false;
  p.contactLink.emit('click', {button:0, preventDefault() {contactPrevented = true;}});
  assert.equal(contactPrevented, false);
  assert.equal(p.messages.filter(item => item.message.type === 'rwh:page-open').length, 0);
  p.office.emit('click', {button:0, preventDefault() {officePrevented = true;}});
  assert.equal(officePrevented, true);
  assert.equal(p.messages.find(item => item.message.type === 'rwh:page-open').message.href, p.office.href);
});
