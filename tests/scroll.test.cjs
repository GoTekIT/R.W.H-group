const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const projects = require('../PROJECT_SOURCES.json').projects;
const projectCount = projects.length;

// Run the actual page controller with a deterministic clock and minimal DOM.
function page(initialProject = 1) {
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
      listeners, children, attributes: {}, style: {}, dataset: {}, open: false,
      clientHeight: 800, offsetHeight: 350, scrollHeight: 800, scrollTop: 0,
      classList: {
        contains: name => classes.has(name), add: name => classes.add(name), remove: name => classes.delete(name),
        toggle(name, on) { if (on) classes.add(name); else classes.delete(name); }
      },
      setAttribute(name, value) { this.attributes[name] = value; }, focus() { doc.activeElement = this; }, matches() { return false; }, closest() { return null; },
      contains(target) { return target === this || [...children.values()].some(child => child.contains(target)); }, querySelectorAll() { return []; },
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
  doc.activeElement = doc.body;
  doc.hidden = false;
  doc.readyState = 'complete';
  const sections = Array.from({ length: projectCount + 1 }, element);
  sections.slice(0, projectCount).forEach(section => section.classList.add('mainImg'));
  const track = doc.querySelector('#fullpage');
  track.querySelectorAll = () => sections;
  doc.children.set('#gFooter', sections[projectCount]);
  const context = {
    document: doc,
    window: {
      location: { search: `?project=${initialProject}` },
      matchMedia: () => ({ matches: false, addEventListener() {} }), addEventListener() {}
    },
    setTimeout: timeout, clearTimeout: id => timers.delete(id), requestAnimationFrame: callback => timeout(callback, 16),
    setInterval: () => ++nextId, clearInterval() {}
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../dist/app.js'), 'utf8'), context);
  advance(1800); // The reference's opening reveal completes before its six-second interval starts.
  const index = () => sections.findIndex(section => section.attributes['aria-hidden'] === 'false');
  function wheel(deltaY = 100) {
    doc.emit('wheel', { target: sections[index()], deltaY, deltaX: 0, deltaMode: 0, preventDefault() {} });
  }
  function key(key) { doc.emit('keydown', { key, target: doc.body, preventDefault() {} }); }
  function jump(destination) {
    key('Home'); advance(1050);
    for (let i=0;i<destination;i++) { key('ArrowDown'); if (i < destination - 1) advance(1050); }
  }
  return { advance, wheel, jump, key, index, doc };

}

test('returning from DETAIL starts at that project and keeps autoplay', () => {
  const p = page(6);
  assert.equal(p.index(), 5);
  p.advance(6000);
  assert.equal(p.index(), 6);
});

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

test('Home cancels a pending wheel step and returns to the first photograph', () => {
  const p = page();
  p.jump(2); p.advance(6000); p.advance(200); p.wheel(); p.key('Home'); p.advance(1500);
  assert.equal(p.index(), 0);
});

test('the original click menu opens and background autoplay continues', () => {
  const p = page();
  const menu = p.doc.querySelector('.menu'), nav = p.doc.querySelector('.menuBox');
  menu.emit('click', { stopPropagation() {} });
  assert.equal(nav.inert, false);
  assert.equal(p.doc.querySelector('#main').inert, true);
  p.advance(6000);
  assert.equal(p.index(), 1);
  p.key('Escape');
  assert.equal(nav.inert, true);
  assert.equal(p.doc.querySelector('#main').inert, false);
  assert.equal(p.doc.activeElement, menu);
});

test('SCROLL advances one project and End reaches the footer', () => {
  const p = page();
  p.doc.querySelector('.scroll-jump').emit('click', { preventDefault() {} });
  assert.equal(p.index(), 1);
  p.key('End');
  assert.equal(p.index(), projectCount);
  p.advance(30000);
  assert.equal(p.index(), projectCount);
});

test('an open Contact form does not consume page navigation', () => {
  const p = page();
  p.doc.querySelector('#contact-modal').open = true;
  p.wheel(); p.key('End');
  assert.equal(p.index(), 0);
});

test('Details pauses the current project and resumes a full interval after closing', () => {
  const p = page(4), panel = p.doc.querySelector('#project-panel');
  p.advance(5900);
  panel.open = true; p.doc.emit('rwh:project-open');
  p.wheel(); p.key('End');
  p.advance(30000);
  assert.equal(p.index(), 3);
  panel.open = false; panel.emit('close');
  p.advance(5999); assert.equal(p.index(), 3);
  p.advance(1); assert.equal(p.index(), 4);
});

test('Details cancels a wheel step queued before the panel opened', () => {
  const p = page(), panel = p.doc.querySelector('#project-panel');
  p.advance(6000); p.advance(200); p.wheel();
  panel.open = true; p.doc.emit('rwh:project-open');
  p.advance(30000); assert.equal(p.index(), 1);
  panel.open = false; panel.emit('close');
  p.advance(5999); assert.equal(p.index(), 1);
  p.advance(1); assert.equal(p.index(), 2);
});

test('an open Details panel blocks stale autoplay and visibility-change scheduling', () => {
  const p = page(), panel = p.doc.querySelector('#project-panel');
  panel.open = true;
  p.advance(6000); assert.equal(p.index(), 0);
  p.doc.emit('visibilitychange'); p.advance(12000); assert.equal(p.index(), 0);
  panel.open = false; panel.emit('close');
  p.advance(6000); assert.equal(p.index(), 1);
});

test('the project gallery opens at the first project and autoplay ends at the footer', () => {
  const p = page();
  assert.equal(p.index(), 0);
  p.advance(5999);
  assert.equal(p.index(), 0);
  p.advance(1);
  assert.equal(p.index(), 1);
  p.advance((projectCount - 1) * 6000);
  assert.equal(p.index(), projectCount);
  p.advance(30000);
  assert.equal(p.index(), projectCount);
});

test('the final project remains reachable before the footer and the counter includes it', () => {
  const p = page(projectCount);
  assert.equal(p.index(), projectCount - 1);
  p.wheel(); assert.equal(p.index(), projectCount);
  p.advance(1200); p.wheel(-100); assert.equal(p.index(), projectCount - 1);
  const html = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
  const sections = [...html.matchAll(/class="section sec\d+ mainImg" id="project-(\d+)"/g)];
  assert.deepEqual(sections.map(match => Number(match[1])), projects.map(project => project.number));
  const counter = html.match(/<div class="arrBox"[\s\S]*?<\/div>/)[0];
  assert.deepEqual([...counter.matchAll(/<span>(\d+)<\/span>/g)].map(match => Number(match[1])),
    [...projects.map(project => project.number), projectCount]);
  assert.ok(html.indexOf(`id="project-${projectCount}"`) < html.indexOf('fp-auto-height'));
});

test('video library keeps background autoplay but owns wheel and keyboard input', () => {
  for (const selector of ['#video-library']) {
    const p = page();
    const modal = p.doc.querySelector(selector); modal.open = true;
    p.wheel(); p.key('ArrowDown'); assert.equal(p.index(), 0);
    p.advance(6000); assert.equal(p.index(), 1);
    p.wheel(); p.key('End'); assert.equal(p.index(), 1);
    modal.open = false; p.advance(1200); p.key('ArrowDown'); assert.equal(p.index(), 2);
  }
});
