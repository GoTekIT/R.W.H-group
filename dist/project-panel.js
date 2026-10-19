(() => {
  'use strict';
  const panel = document.querySelector('#project-panel');
  const origin = window.location.origin;
  const targetOrigin = window.location.protocol === 'file:' ? '*' : origin;
  const plainClick = event => !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

  // Reuse the complete project gallery inside the panel without changing the landing URL.
  // Direct project links remain available for sharing and opening in another tab.
  if (!panel) {
    const params = new URLSearchParams(window.location.search);
    if (window.parent === window || params.get('panel') !== '1') return;
    document.documentElement.classList.add('project-embedded');
    const language = params.get('lang');
    if (language === 'vi' || language === 'en') window.RWHI18n.setLanguage(language);
    const home = new URL('../../index.html', window.location.href);
    document.querySelectorAll('a[href]').forEach(link => {
      const destination = new URL(link.href);
      if (destination.origin !== origin) return;
      if (destination.pathname === home.pathname) {
        link.addEventListener('click', event => {
          if (!plainClick(event)) return;
          event.preventDefault();
          window.parent.postMessage({type:'rwh:project-close'}, targetOrigin);
        });
      } else if (/\/projects\/[^/]+\/index\.html$/.test(destination.pathname)) {
        link.addEventListener('click', event => {
          if (!plainClick(event)) return;
          destination.searchParams.set('panel', '1');
          destination.searchParams.set('lang', window.RWHI18n.language);
          link.href = destination.href;
        });
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || event.defaultPrevented || document.querySelector('dialog[open]')) return;
      event.preventDefault();
      window.parent.postMessage({type:'rwh:project-close'}, targetOrigin);
    });
    document.addEventListener('rwh:languagechange', () => {
      window.parent.postMessage({type:'rwh:project-language', language:window.RWHI18n.language}, targetOrigin);
    });
    return;
  }
  if (typeof panel.showModal !== 'function') return;

  const frame = panel.querySelector('iframe');
  const closeButton = panel.querySelector('[data-panel-close]');
  const title = panel.querySelector('#project-panel-title');
  const fallback = panel.querySelector('[data-panel-fallback]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let trigger, closeTimer, closing = false;

  function finishClose() {
    if (!panel.open) return;
    panel.close();
  }
  function close() {
    if (!panel.open || closing) return;
    closing = true;
    panel.classList.remove('is-visible');
    closeTimer = setTimeout(finishClose, reduced.matches ? 0 : 750);
  }
  document.querySelectorAll('[data-project-open]').forEach(link => link.addEventListener('click', event => {
    if (!plainClick(event) || panel.open) return;
    event.preventDefault();
    trigger = link;
    const destination = new URL(link.href);
    destination.searchParams.set('panel', '1');
    destination.searchParams.set('lang', window.RWHI18n.language);
    title.textContent = link.dataset.projectTitle;
    frame.title = window.RWHI18n.t('viewDetail', {title:link.dataset.projectTitle});
    fallback.href = link.href;
    closing = false;
    panel.classList.remove('is-loaded', 'is-error', 'is-visible');
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
    panel.showModal();
    frame.src = destination.href;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (panel.open && !closing) panel.classList.add('is-visible');
    }));
  }));
  frame.addEventListener('load', () => {
    if (!panel.open || closing) return;
    let content;
    try { content = frame.contentDocument?.querySelector('.project-photos'); } catch { /* Show the direct-link fallback if the document failed to load. */ }
    if (!content) { panel.classList.add('is-error'); return; }
    title.textContent = frame.contentDocument.querySelector('.comTopLinkBox h2').textContent;
    frame.title = window.RWHI18n.t('viewDetail', {title:title.textContent});
    frame.tabIndex = 0;
    frame.removeAttribute('aria-hidden');
    panel.classList.remove('is-error');
    panel.classList.add('is-loaded');
  });
  closeButton.addEventListener('click', close);
  panel.addEventListener('cancel', event => { event.preventDefault(); close(); });
  panel.addEventListener('close', () => {
    clearTimeout(closeTimer);
    closing = false;
    panel.classList.remove('is-visible', 'is-loaded', 'is-error');
    frame.removeAttribute('src');
    const focus = trigger && !trigger.closest('[inert]') ? trigger : document.querySelector('.menu');
    focus.focus({preventScroll:true});
  });
  document.addEventListener('rwh:languagechange', () => {
    if (panel.open) frame.title = window.RWHI18n.t('viewDetail', {title:title.textContent});
  });
  window.addEventListener('message', event => {
    if (!panel.open || event.origin !== origin || event.source !== frame.contentWindow) return;
    if (event.data?.type === 'rwh:project-close') close();
    if (event.data?.type === 'rwh:project-language' && ['vi','en'].includes(event.data.language) && event.data.language !== window.RWHI18n.language) {
      window.RWHI18n.setLanguage(event.data.language);
    }
  });
})();
