const { test } = require('node:test');
const assert = require('node:assert/strict');
const { emphasisParts, bindPartnerMotion } = require('../dist/office-page.js');
const content = require('../OFFICE_CONTENT.json');

function target(extra = {}) {
  const listeners = {};
  return { ...extra, addEventListener(name, fn) { (listeners[name] ||= []).push(fn); },
    emit(name, event = {}) { for (const fn of listeners[name] || []) fn(event); } };
}
function fixture(reduced = false) {
  let intersection, resize;
  const toggle = target({ hidden: true, attributes: {}, setAttribute(k, v) { this.attributes[k] = v; } });
  const rows = [1200, 900].map(width => {
    const group = { width, getBoundingClientRect() { return { width: this.width }; } };
    const copy = { hidden: true };
    const track = { animations: [], animate(frames, options) {
      const animation = { frames, options, currentTime: 0, playState: 'running',
        play() { this.playState = 'running'; }, pause() { this.playState = 'paused'; },
        cancel() { this.playState = 'idle'; } };
      this.animations.push(animation); return animation;
    } };
    return target({ group, copy, track, classList: { add() {}, remove() {} }, contains: node => node === group,
      querySelector: selector => ({ '.office-partner-track': track, '.office-partner-group': group, '.office-partner-copy': copy })[selector] });
  });
  const section = { querySelector: () => toggle, querySelectorAll: () => rows };
  const doc = target({ hidden: false });
  const media = target({ matches: reduced });
  let pauseLabel;
  const binding = bindPartnerMotion({ section, doc, media,
    IntersectionObserverClass: class { constructor(fn) { intersection = fn; } observe() {} },
    ResizeObserverClass: class { constructor(fn) { resize = fn; } observe() {} },
    setPauseLabel: value => { pauseLabel = value; } });
  return { rows, doc, media, toggle, binding, get pauseLabel() { return pauseLabel; },
    visible(value) { intersection(rows.map(target => ({ target, isIntersecting: value }))); },
    resize() { resize(); } };
}

test('partners move left in seamless linear loops only while visible', () => {
  const f = fixture();
  assert.ok(f.binding.states.every(s => s.animation.playState === 'paused'));
  f.visible(true);
  f.binding.states.forEach((state, index) => {
    assert.equal(state.animation.playState, 'running');
    assert.equal(state.animation.frames[1].transform, `translate3d(-${f.rows[index].group.width}px,0,0)`);
    assert.equal(state.animation.options.duration, state.distance / 64 * 1000);
    assert.equal(state.animation.options.iterations, Infinity);
    assert.equal(state.animation.options.easing, 'linear');
    assert.equal(state.copy.hidden, false);
  });
  f.visible(false);
  assert.ok(f.binding.states.every(s => s.animation.playState === 'paused'));
  f.visible(true); f.doc.hidden = true; f.doc.emit('visibilitychange');
  assert.ok(f.binding.states.every(s => s.animation.playState === 'paused'));
  f.doc.hidden = false; f.doc.emit('visibilitychange');
  assert.ok(f.binding.states.every(s => s.animation.playState === 'running'));
});

test('manual pause survives pointer and keyboard changes; resume keeps those safeguards', () => {
  const f = fixture(); f.visible(true);
  const first = f.binding.states[0];
  f.rows[0].emit('pointerenter', { pointerType: 'mouse' });
  assert.equal(first.animation.playState, 'paused');
  assert.equal(f.binding.states[1].animation.playState, 'running');
  f.toggle.emit('click');
  assert.equal(f.toggle.attributes['aria-pressed'], 'true');
  assert.equal(f.pauseLabel, true);
  f.rows[0].emit('pointerleave');
  assert.ok(f.binding.states.every(s => s.animation.playState === 'paused'));
  f.rows[0].emit('focusin'); f.toggle.emit('click');
  assert.equal(first.animation.playState, 'paused');
  assert.equal(f.pauseLabel, false);
  f.rows[0].emit('focusout', { relatedTarget: null });
  assert.equal(first.animation.playState, 'running');
  f.rows[0].emit('pointerdown', { pointerType: 'touch' });
  assert.equal(first.animation.playState, 'paused');
  f.rows[0].emit('pointercancel');
  assert.equal(first.animation.playState, 'running');
});

test('reduced motion cancels loops and restores complete static rows', () => {
  const f = fixture(); f.visible(true);
  const previous = f.binding.states.map(s => s.animation);
  f.media.matches = true; f.media.emit('change');
  assert.ok(previous.every(animation => animation.playState === 'idle'));
  assert.ok(f.binding.states.every(s => s.animation === null && s.copy.hidden));
  assert.equal(f.toggle.hidden, true);
  f.media.matches = false; f.media.emit('change');
  assert.ok(f.binding.states.every(s => s.animation.playState === 'running' && !s.copy.hidden));
  assert.equal(f.toggle.hidden, false);
  const initial = fixture(true);
  assert.ok(initial.binding.states.every(s => s.animation === null && s.copy.hidden));
});

test('resizing preserves loop phase and constant speed', () => {
  const f = fixture(); f.visible(true);
  const state = f.binding.states[0];
  state.animation.currentTime = state.animation.options.duration * 0.4;
  const old = state.animation;
  f.rows[0].group.width = 600; f.resize();
  assert.equal(old.playState, 'idle');
  assert.equal(state.animation.currentTime / state.animation.options.duration, 0.4);
  assert.equal(state.animation.options.duration, 600 / 64 * 1000);
});

test('emphasis preserves all text and each translated important phrase', () => {
  for (const language of ['vi', 'en']) {
    for (const [key, phrases] of Object.entries(content.emphasis[language])) {
      const parts = emphasisParts(content.copy[language][key], phrases);
      assert.equal(parts.map(part => part.text).join(''), content.copy[language][key]);
      for (const phrase of phrases) assert.ok(parts.some(part => part.strong && part.text === phrase), `${language} ${phrase}`);
    }
  }
  assert.equal(emphasisParts('<script>safe text</script>', ['safe'])[0].text, '<script>');
});
