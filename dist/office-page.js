(() => {
  'use strict';

  function emphasisParts(value, phrases = []) {
    const parts = [];
    let remaining = value;
    while (remaining) {
      const matches = phrases.map(phrase => ({ phrase, index: remaining.indexOf(phrase) }))
        .filter(match => match.phrase && match.index >= 0)
        .sort((a, b) => a.index - b.index || b.phrase.length - a.phrase.length);
      const next = matches[0];
      if (!next) { parts.push({ text: remaining, strong: false }); break; }
      if (next.index) parts.push({ text: remaining.slice(0, next.index), strong: false });
      parts.push({ text: next.phrase, strong: true });
      remaining = remaining.slice(next.index + next.phrase.length);
    }
    return parts;
  }

  function bindPartnerMotion({ section, doc, media, IntersectionObserverClass,
    ResizeObserverClass, setPauseLabel }) {
    const toggle = section.querySelector('[data-partners-toggle]');
    const states = [...section.querySelectorAll('[data-partner-row]')].map(row => ({
      row, track: row.querySelector('.office-partner-track'),
      group: row.querySelector('.office-partner-group'),
      copy: row.querySelector('.office-partner-copy'), visible: !IntersectionObserverClass,
      hovered: false, focused: false, touching: false, animation: null, distance: 0
    }));
    if (!states.length || states.some(state => typeof state.track.animate !== 'function')) return;
    let manuallyPaused = false;

    function layout(state) {
      if (media.matches) return;
      const distance = state.group.getBoundingClientRect().width;
      if (!distance || distance === state.distance && state.animation) return;
      const progress = state.animation ? (Number(state.animation.currentTime) || 0) / (state.distance / 64 * 1000) : 0;
      state.animation?.cancel();
      state.copy.hidden = false;
      state.row.classList.add('is-animated');
      state.distance = distance;
      state.animation = state.track.animate([
        { transform: 'translate3d(0,0,0)' },
        { transform: `translate3d(-${distance}px,0,0)` }
      ], { duration: distance / 64 * 1000, iterations: Infinity, easing: 'linear' });
      state.animation.pause();
      state.animation.currentTime = progress * distance / 64 * 1000;
    }
    function sync() {
      for (const state of states) {
        if (media.matches) {
          state.animation?.cancel(); state.animation = null; state.distance = 0;
          state.copy.hidden = true;
          state.row.classList.remove('is-animated');
          continue;
        }
        layout(state);
        const run = state.visible && !doc.hidden && !manuallyPaused && !state.hovered && !state.focused && !state.touching;
        if (run) state.animation?.play(); else state.animation?.pause();
      }
      toggle.hidden = media.matches;
      toggle.setAttribute('aria-pressed', String(manuallyPaused));
      setPauseLabel(manuallyPaused);
    }
    for (const state of states) {
      state.row.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { state.hovered = true; sync(); } });
      state.row.addEventListener('pointerleave', () => { state.hovered = false; state.touching = false; sync(); });
      state.row.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') { state.touching = true; sync(); } });
      for (const event of ['pointerup', 'pointercancel']) state.row.addEventListener(event, () => { state.touching = false; sync(); });
      state.row.addEventListener('focusin', () => { state.focused = true; sync(); });
      state.row.addEventListener('focusout', event => { if (!state.row.contains(event.relatedTarget)) { state.focused = false; sync(); } });
    }
    const observer = IntersectionObserverClass && new IntersectionObserverClass(entries => {
      for (const entry of entries) {
        const state = states.find(item => item.row === entry.target);
        if (state) state.visible = entry.isIntersecting;
      }
      sync();
    }, { threshold: 0 });
    states.forEach(state => observer?.observe(state.row));
    const resize = ResizeObserverClass && new ResizeObserverClass(() => { states.forEach(layout); sync(); });
    states.forEach(state => resize?.observe(state.group));
    toggle.addEventListener('click', () => { manuallyPaused = !manuallyPaused; sync(); });
    doc.addEventListener('visibilitychange', sync);
    media.addEventListener('change', sync);
    sync();
    return { states, sync };
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { emphasisParts, bindPartnerMotion };
    return;
  }
  function translateOffice() {
    const language = window.RWHI18n.language;
    document.querySelectorAll('[data-office-rich]').forEach(element => {
      const key = element.dataset.officeRich;
      const value = window.RWHI18n.t(key);
      const phrases = window.RWHOfficeEmphasis?.[language]?.[key] || [];
      const fragment = document.createDocumentFragment();
      for (const part of emphasisParts(value, phrases)) {
        const node = part.strong ? document.createElement('strong') : document.createTextNode(part.text);
        if (part.strong) node.textContent = part.text;
        fragment.append(node);
      }
      element.replaceChildren(fragment);
    });
    document.querySelectorAll('[data-office-service]').forEach(element => {
      element.textContent = window.RWHI18n.t(element.dataset.officeService).split(' · ')[Number(element.dataset.serviceIndex)] || '';
    });
  }
  document.addEventListener('rwh:languagechange', translateOffice);
  translateOffice();
  const section = document.querySelector('.office-partners');
  if (section) bindPartnerMotion({
    section, doc: document, media: window.matchMedia('(prefers-reduced-motion: reduce)'),
    IntersectionObserverClass: window.IntersectionObserver,
    ResizeObserverClass: window.ResizeObserver,
    setPauseLabel(paused) {
      window.RWHI18n.message(section.querySelector('[data-partners-toggle]'), `officeContent.${paused ? 'partnerPlay' : 'partnerPause'}`);
    }
  });
})();
