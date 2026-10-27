(() => {
  'use strict';

  // Each overlay adds a same-URL entry; Back closes only the active layer.
  function createLayerHistory(win) {
    if (!win.history?.pushState) return { open() {}, close() {} };
    const marker = 'rwhLandingLayer';
    const session = `${Date.now()}-${Math.random()}`;
    let layers = [], next = 0, pendingBack = false, enabled = true;
    function settle() {
      if (!enabled || pendingBack) return;
      const last = layers[layers.length - 1];
      if (last && !last.active) {
        if (last.pushed && win.history.state?.[marker] === last.id) {
          pendingBack = true; win.history.back(); return;
        }
        layers.pop(); settle(); return;
      }
      for (const layer of layers) {
        if (!layer.active || layer.pushed) continue;
        try {
          win.history.pushState({ ...win.history.state, [marker]:layer.id }, '', win.location.href);
          layer.pushed = true;
        } catch { enabled = false; break; }
      }
    }
    win.addEventListener('popstate', event => {
      pendingBack = false;
      const queued = layers.filter(layer => !layer.pushed);
      layers = layers.filter(layer => layer.pushed);
      const removed = [];
      while (layers.length && layers[layers.length - 1].id !== event.state?.[marker]) removed.push(layers.pop());
      layers.push(...queued);
      for (const layer of removed) {
        if (layer.active) { layer.active = false; layer.onBack(); }
      }
      settle();
    });
    return {
      open(key, onBack) {
        if (!enabled || layers.some(layer => layer.key === key && layer.active)) return;
        layers.push({ key, id:`${session}:${++next}`, onBack, active:true, pushed:false });
        settle();
      },
      close(key) {
        const layer = [...layers].reverse().find(item => item.key === key && item.active);
        if (layer) { layer.active = false; settle(); }
      }
    };
  }
  if (typeof module === 'object' && module.exports) { module.exports = { createLayerHistory }; return; }

  const panel = document.querySelector('#project-panel');
  const origin = window.location.origin;
  const targetOrigin = window.location.protocol === 'file:' ? '*' : origin;
  const plainClick = event => !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  function pageKind(url) {
    if (url.origin !== origin) return null;
    if (/\/office(?:\/(?:index\.html)?)?$/.test(url.pathname)) return 'office';
    return /\/projects\/[^/]+\/index\.html$/.test(url.pathname) ? 'project' : null;
  }

  // Office and project documents share the landing's content panel.
  if (!panel) {
    const params = new URLSearchParams(window.location.search);
    if (window.parent === window || params.get('panel') !== '1') return;
    document.documentElement.classList.add('project-embedded');
    const language = params.get('lang');
    if (language === 'vi' || language === 'en') window.RWHI18n.setLanguage(language);
    const home = new URL('../../index.html', window.location.href);
    document.querySelectorAll('a[href]').forEach(link => {
      if ((link.getAttribute('href') || '').startsWith('#') || link.closest('#contact-modal')) return;
      const destination = new URL(link.href);
      if (destination.origin !== origin) return;
      if (destination.pathname === home.pathname || destination.pathname === '/') {
        link.addEventListener('click', event => {
          if (!plainClick(event)) return;
          event.preventDefault();
          window.parent.postMessage({type:'rwh:project-close'}, targetOrigin);
        });
      } else if (pageKind(destination)) {
        link.addEventListener('click', event => {
          if (!plainClick(event)) return;
          event.preventDefault();
          window.parent.postMessage({type:'rwh:page-open', href:destination.href}, targetOrigin);
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
    window.addEventListener('message', event => {
      if (event.origin !== origin || event.source !== window.parent || event.data?.type !== 'rwh:dialog-back') return;
      const dialogs = [...document.querySelectorAll('dialog[open]')];
      dialogs[dialogs.length - 1]?.close();
    });
    function reportDialogState() {
      window.parent.postMessage({type:'rwh:project-dialog', open:!!document.querySelector('dialog[open]')}, targetOrigin);
    }
    const dialogs = new MutationObserver(reportDialogState);
    document.querySelectorAll('dialog').forEach(dialog => dialogs.observe(dialog, {attributes:true, attributeFilter:['open']}));
    reportDialogState();
    return;
  }
  if (typeof panel.showModal !== 'function') return;

  const frame = panel.querySelector('iframe');
  const closeButton = panel.querySelector('[data-panel-close]');
  const title = panel.querySelector('#project-panel-title');
  const loading = panel.querySelector('[data-panel-loading]');
  const error = panel.querySelector('[data-panel-error]');
  const retry = panel.querySelector('[data-panel-retry]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const history = createLayerHistory(window);
  const contact = document.querySelector('#contact-modal');
  let trigger, closeTimer, closing = false, destination, kind = 'project';

  function finishClose() { if (panel.open) panel.close(); }
  function close() {
    if (!panel.open || closing) return;
    closing = true;
    panel.classList.remove('is-visible');
    closeTimer = setTimeout(finishClose, reduced.matches ? 0 : 750);
  }
  function updateLabels() {
    const returnKey = kind === 'office' ? 'closeOffice' : 'closeProject';
    closeButton.dataset.i18nAriaLabel = returnKey;
    closeButton.setAttribute('aria-label', window.RWHI18n.t(returnKey));
    if (kind === 'office') title.textContent = window.RWHI18n.t('office');
    frame.title = kind === 'office' ? window.RWHI18n.t('viewOffice') : window.RWHI18n.t('viewDetail', {title:title.textContent});
    window.RWHI18n.message(loading, kind === 'office' ? 'loadingOffice' : 'loadingProject');
    window.RWHI18n.message(error, kind === 'office' ? 'officeLoadError' : 'projectLoadError');
  }
  function loadPage(url) {
    kind = pageKind(url);
    destination = new URL(url.href);
    destination.searchParams.set('panel', '1');
    destination.searchParams.set('lang', window.RWHI18n.language);
    closeButton.hidden = closeButton.disabled = false;
    panel.classList.remove('is-loaded', 'is-error');
    panel.classList.toggle('is-office', kind === 'office');
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
    updateLabels();
    frame.dataset.panelSrc = destination.href;
    if (frame.contentWindow?.location) frame.contentWindow.location.replace(destination.href);
    else frame.src = destination.href;
  }
  document.querySelectorAll('[data-project-open], [data-office-open]').forEach(link => link.addEventListener('click', event => {
    if (!plainClick(event) || panel.open) return;
    const url = new URL(link.href);
    if (!pageKind(url)) return;
    event.preventDefault();
    trigger = link;
    if (contact?.open) contact.close();
    document.dispatchEvent(new Event('rwh:close-menu'));
    title.textContent = link.dataset.projectTitle || window.RWHI18n.t('office');
    closing = false;
    panel.classList.remove('is-visible');
    panel.showModal();
    history.open('content', close);
    document.dispatchEvent(new Event('rwh:project-open'));
    loadPage(url);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (panel.open && !closing) panel.classList.add('is-visible');
    }));
  }));
  frame.addEventListener('load', () => {
    if (!panel.open || closing) return;
    let content;
    try { content = frame.contentDocument?.querySelector(kind === 'office' ? '.office-main' : '.project-photos'); } catch { /* Keep retry available when a document cannot load. */ }
    if (!content) { panel.classList.add('is-error'); return; }
    title.textContent = frame.contentDocument.querySelector(kind === 'office' ? '.office-title' : '.comTopLinkBox h2').textContent;
    updateLabels();
    frame.tabIndex = 0;
    frame.removeAttribute('aria-hidden');
    panel.classList.remove('is-error');
    panel.classList.add('is-loaded');
  });
  retry.addEventListener('click', () => { if (panel.open && destination && !closing) loadPage(destination); });
  closeButton.addEventListener('click', close);
  panel.addEventListener('cancel', event => { event.preventDefault(); close(); });
  panel.addEventListener('close', () => {
    clearTimeout(closeTimer);
    closing = false;
    history.close('embedded-dialog'); history.close('content');
    closeButton.hidden = closeButton.disabled = false;
    panel.classList.remove('is-visible', 'is-loaded', 'is-error', 'is-office');
    if (frame.contentWindow?.location) frame.contentWindow.location.replace('about:blank');
    frame.removeAttribute('src');
    delete frame.dataset.panelSrc;
    const focus = trigger && !trigger.closest('[inert]') ? trigger : document.querySelector('.menu');
    focus.focus({preventScroll:true});
  });
  document.addEventListener('rwh:languagechange', () => { if (panel.open) updateLabels(); });
  if (contact) {
    const contactHistory = new MutationObserver(() => {
      if (contact.open) history.open('contact', () => contact.close());
      else history.close('contact');
    });
    contactHistory.observe(contact, {attributes:true, attributeFilter:['open']});
    contact.addEventListener('close', () => history.close('contact'));
  }
  window.addEventListener('message', event => {
    if (!panel.open || closing || event.origin !== origin || event.source !== frame.contentWindow) return;
    if (event.data?.type === 'rwh:project-close') close();
    if (event.data?.type === 'rwh:page-open' && typeof event.data.href === 'string') {
      let url; try { url = new URL(event.data.href); } catch { return; }
      if (!pageKind(url)) return;
      history.close('embedded-dialog');
      loadPage(url);
    }
    if (event.data?.type === 'rwh:project-dialog' && typeof event.data.open === 'boolean') {
      closeButton.hidden = closeButton.disabled = event.data.open;
      if (event.data.open) history.open('embedded-dialog', () => frame.contentWindow.postMessage({type:'rwh:dialog-back'}, targetOrigin));
      else history.close('embedded-dialog');
    }
    if (event.data?.type === 'rwh:project-language' && ['vi','en'].includes(event.data.language) && event.data.language !== window.RWHI18n.language) window.RWHI18n.setLanguage(event.data.language);
  });
})();
