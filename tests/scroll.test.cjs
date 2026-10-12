const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

// Run the actual page controller with a deterministic clock and minimal DOM.
function page() {
  let now = 0, nextId = 0;
  const timers = new Map();
  const timeout = (callback, delay) => {
    const id = ++nextId;
    timers.set(id, { at: now + delay, callback });
    return id;
  };
  function advance(ms) {
    const end = now + ms;
    while (true) {
      const entry = [...timers].filter(([, task]) => task.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!entry) break;
      const [id, task] = entry;
      timers.delete(id);
      now = task.at;
      task.callback();
    }
    now = end;
  }
  function element() {
    const listeners = new Map(), classes = new Set(), children = new Map();
    return {
      listeners, children, style: {}, dataset: {}, open: false,
      clientHeight: 800, offsetHeight: 350, scrollHeight: 800, scrollTop: 0,
      classList: {
        contains: name => classes.has(name), add: name => classes.add(name), remove: name => classes.delete(name),
        toggle(name, on) { if (on) classes.add(name); else classes.delete(name); }
      },
      setAttribute() {}, focus() {}, matches() { return false; }, closest() { return null; },
      contains(target) { return target === this; }, querySelectorAll() { return []; },
      querySelector(selector) { if (!children.has(selector)) children.set(selector, element()); return children.get(selector); },
      addEventListener(name, callback) {
        if (!listeners.has(name)) listeners.set(name, []);
        listeners.get(name).push(callback);
      },
      emit(name, event = {}) { for (const callback of listeners.get(name) || []) callback(event); }
    };
  }
  const doc = element();
  doc.body = element();
  doc.hidden = false;
  const sections = Array.from({ length: 13 }, element);
  sections.slice(2, 12).forEach(section => section.classList.add('mainImg'));
  const track = doc.querySelector('#fullpage');
  track.querySelectorAll = () => sections;
  doc.children.set('#gFooter', sections[12]);
  const details = { isOpen: false, isInteracting: false, update() {}, open() {}, close() {} };
  const context = {
    document: doc,
    window: {
      RWHI18n: { project: value => value, t: key => key, message() {} },
      RWH_PROJECTS: Array.from({ length: 10 }, (_, i) => ({ name: `Project ${i + 1}`, year: '2025', summary: '' })),
      RWHDetails: { create: () => details },
      matchMedia: () => ({ matches: false, addEventListener() {} }), addEventListener() {}
    },
    setTimeout: timeout, clearTimeout: id => timers.delete(id),
    setInterval: () => ++nextId, clearInterval() {}
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../dist/app.js'), 'utf8'), context);
  const range = doc.querySelector('.scroll-range');
  function wheel(deltaY = 100) {
    doc.emit('wheel', { target: sections[Number(range.value)], deltaY, deltaX: 0, deltaMode: 0, preventDefault() {} });
  }
  function jump(index) { range.value = index; range.emit('input'); }
  return { advance, wheel, jump, index: () => Number(range.value), doc, details };
}

test('wheel momentum advances one page until the gesture settles', () => {
  const p = page();
  p.jump(2); p.advance(1200);
  p.wheel();
  assert.equal(p.index(), 3);
  for (let i = 0; i < 15; i++) { p.advance(100); p.wheel(); }
  assert.equal(p.index(), 3);
  p.advance(300); p.wheel();
  assert.equal(p.index(), 4);
});

test('a fresh wheel gesture during a manual transition is honored after it settles', () => {
  const p = page();
  p.jump(2); p.advance(1200); p.wheel();
  p.advance(400); p.wheel();
  assert.equal(p.index(), 3);
  p.advance(800);
  assert.equal(p.index(), 4);
  p.advance(1500);
  assert.equal(p.index(), 4);
});

test('wheel input during autoplay is honored without interrupting its transition', () => {
  const p = page();
  p.jump(2); p.advance(6000);
  assert.equal(p.index(), 3);
  p.advance(200); p.wheel();
  assert.equal(p.index(), 3);
  p.advance(850);
  assert.equal(p.index(), 4);
  p.advance(6000);
  assert.equal(p.index(), 5);
});

test('scrolling up during a transition returns to the previous page', () => {
  const p = page();
  p.jump(2); p.advance(6000); p.advance(200); p.wheel(-100); p.advance(850);
  assert.equal(p.index(), 2);
});

test('an explicit rail jump cancels a pending wheel step', () => {
  const p = page();
  p.jump(2); p.advance(6000); p.advance(200); p.wheel(); p.jump(8); p.advance(1500);
  assert.equal(p.index(), 8);
});

test('open Details retains its project while the background autoplay continues', () => {
  const p = page();
  p.jump(2); p.advance(6000); p.advance(200); p.wheel();
  p.details.isOpen = true;
  p.advance(850);
  assert.equal(p.index(), 3);
  p.advance(4950);
  assert.equal(p.index(), 4);
});
