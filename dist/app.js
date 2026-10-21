(() => {
  'use strict';
  const track = document.querySelector('#fullpage');
  const sections = [...track.querySelectorAll(':scope > .section')];
  const projects = sections.filter(section => section.classList.contains('mainImg'));
  const footerIndex = sections.length - 1;
  const footer = document.querySelector('#gFooter');
  const main = document.querySelector('#main');
  const header = document.querySelector('#gHeader');
  const menu = document.querySelector('.menu');
  const navigation = document.querySelector('.menuBox');
  const rail = document.querySelector('.meunRBox');
  const counter = document.querySelector('.arrBox');
  const counterTrack = document.querySelector('.moveBlock');
  const scrollCue = document.querySelector('#main .sroll');
  const pageTop = document.querySelector('.pagetop');
  const contact = document.querySelector('#contact-modal');
  const projectPanel = document.querySelector('#project-panel');
  const videoLibrary = document.querySelector('#video-library');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const textAnimations = new Map();
  let current = 0, timer, unlock, cleanup, locked = false, ready = false, menuOpen = false;
  let wheelSum = 0, wheelTimer, wheelGestureUsed = false, pendingWheelStep = 0;
  let touchY = null, touchX = null, touchScrollTop = 0, returnFocus = menu;

  // The contact form uses these status messages independently of project copy.
  const messages = {
    sendMessage: 'Send message', sendingMessage: 'Sending…',
    contactSent: 'Thank you! Your enquiry has been sent to R.W.H Group.',
    contactInvalid: 'Please check your name, email and questions.',
    contactError: 'Your enquiry could not be sent. Your details are still here; please try again.',
    contactRateLimited: 'Please wait a few minutes before trying again.',
    contactUnavailable: 'The contact form is being set up. Please try again later.',
    contactLocal: 'Please open the published website to send an enquiry.',
    openMenu: 'Open menu', closeMenu: 'Close menu', projectCounter: 'Project {number} of {total}'
  };
  window.RWHI18n ||= { t: key => messages[key] || key, message(element, key) { element.textContent = messages[key] || key; } };

  function accessibleSections() {
    sections.forEach((section, index) => {
      section.inert = index !== current;
      section.setAttribute('aria-hidden', String(index !== current));
    });
  }
  function schedule() {
    clearTimeout(timer);
    if (ready && !reduced.matches && !document.hidden && !projectPanel?.open && current < footerIndex) {
      timer = setTimeout(() => goTo(current + 1, false, true), 6000);
    }
  }
  function offset() {
    return current < footerIndex ? current * main.clientHeight
      : footerIndex * main.clientHeight - Math.max(0, main.clientHeight - footer.offsetHeight);
  }
  function updatePosition() {
    const index = Math.min(current, projects.length - 1);
    counterTrack.style.transform = `translateY(${-index * 19}px)`;
    counter.setAttribute('aria-label', window.RWHI18n.t('projectCounter').replace('{number}', index + 1).replace('{total}', projects.length));
    pageTop.style.display = current === footerIndex ? 'block' : 'none';
    scrollCue.style.display = ready && current !== footerIndex ? 'block' : 'none';
  }
  // Progressive reveal adapted from Shuffle Letters 1.0 by Martin Angelov (MIT).
  // Keep its original two-character window and 20fps timing, including partial line wrapping.
  function shuffle(section) {
    if (!section || reduced.matches) return;
    for (const element of section.querySelectorAll('.shuffle')) {
      clearTimeout(textAnimations.get(element));
      const text = element.dataset.text || element.textContent;
      element.dataset.text = text;
      const characters = [...text];
      const letters = characters.map((character, index) => character === ' ' ? -1 : index).filter(index => index !== -1);
      let start = -2;
      function frame() {
        if (document.hidden || start > letters.length) {
          element.textContent = text; textAnimations.delete(element); return;
        }
        const next = characters.slice();
        for (let i = Math.max(start, 0); i < letters.length; i++) {
          const index = letters[i], character = characters[index];
          if (i >= start + 2) { next[index] = ''; continue; }
          const pool = /[a-z]/.test(character) ? 'abcdefghijklmnopqrstuvwxyz0123456789'
            : /[A-Z]/.test(character) ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            : ',.?/\\(^)![]{}*&^%$#';
          next[index] = pool[Math.floor(Math.random() * pool.length)];
        }
        element.textContent = next.join(''); start++;
        textAnimations.set(element, setTimeout(frame, 50));
      }
      frame();
    }
  }
  function goTo(index, immediate = false, automatic = false) {
    if (immediate) pendingWheelStep = 0;
    const destination = Math.max(0, Math.min(footerIndex, index));
    if (!ready || projectPanel?.open || (!automatic && (menuOpen || contact.open || videoLibrary?.open)) || (locked && !immediate) || destination === current) return;
    current = destination;
    clearTimeout(timer); clearTimeout(unlock); clearTimeout(cleanup);
    wheelSum = 0; pendingWheelStep = 0; locked = true;
    // Apollo keeps the outgoing photograph moving until the full one-second transition finishes.
    sections[current].classList.add('show');
    track.style.transform = `translate3d(0,-${offset()}px,0)`;
    document.body.classList.toggle('at-footer', current === footerIndex);
    accessibleSections(); updatePosition();
    setTimeout(() => shuffle(projects[current]), reduced.matches ? 0 : 300);
    cleanup = setTimeout(() => {
      if (current !== footerIndex) sections.forEach((section, i) => section.classList.toggle('show', i === current));
    }, reduced.matches ? 0 : 1000);
    unlock = setTimeout(() => {
      locked = false;
      const step = pendingWheelStep; pendingWheelStep = 0;
      if (step && !document.hidden) goTo(current + step);
    }, reduced.matches ? 0 : 1050);
    schedule();
  }
  function toggleMenu(open, focus = true) {
    menuOpen = open;
    document.body.classList.toggle('menu-open', open);
    menu.classList.toggle('active', open);
    header.classList.toggle('show01', open);
    navigation.classList.toggle('moveout', open);
    navigation.inert = !open;
    main.inert = open;
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', window.RWHI18n.t(open ? 'closeMenu' : 'openMenu'));
    if (focus) (open ? navigation.querySelector('a') : menu).focus({ preventScroll: true });
  }
  menu.addEventListener('click', event => { event.stopPropagation(); toggleMenu(!menuOpen); });
  document.addEventListener('rwh:close-menu', () => { if (menuOpen) toggleMenu(false, false); });
  rail.addEventListener('click', event => { if (!menu.contains(event.target)) toggleMenu(!menuOpen); });
  for (const logo of document.querySelectorAll('.hLogo, [data-menu-home]')) {
    logo.addEventListener('click', event => { event.preventDefault(); if (menuOpen) toggleMenu(false, false); goTo(0, true); });
  }
  document.querySelector('.scroll-jump').addEventListener('click', event => { event.preventDefault(); goTo(current + 1); });
  document.querySelector('.pagetop a').addEventListener('click', event => { event.preventDefault(); goTo(0, true); });

  for (const trigger of document.querySelectorAll('[data-contact-open]')) {
    trigger.addEventListener('click', event => {
      event.preventDefault(); returnFocus = trigger.closest('.menuBox') ? menu : trigger;
      if (menuOpen) toggleMenu(false, false);
      contact.showModal();
    });
  }
  contact.querySelector('[data-modal-close]').addEventListener('click', () => contact.close());
  contact.addEventListener('click', event => {
    if (event.target !== contact) return;
    const r = contact.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) contact.close();
  });
  contact.addEventListener('close', () => (returnFocus.closest('[inert]') ? menu : returnFocus).focus({ preventScroll: true }));

  function activeScrollable(target) { return current === footerIndex && footer.contains(target) ? footer : null; }
  function resetWheelGesture() { wheelTimer = undefined; wheelSum = 0; wheelGestureUsed = false; }
  document.addEventListener('wheel', event => {
    if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX) || menuOpen || contact.open || projectPanel?.open || videoLibrary?.open || !ready) return;
    clearTimeout(wheelTimer); wheelTimer = setTimeout(resetWheelGesture, 280);
    const scrollable = !locked && activeScrollable(event.target);
    if (scrollable && ((event.deltaY < 0 && scrollable.scrollTop > 1) ||
      (event.deltaY > 0 && scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight - 1))) {
      wheelGestureUsed = true; wheelSum = 0; return;
    }
    event.preventDefault();
    if (wheelGestureUsed) return;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? main.clientHeight : 1);
    if (wheelSum && Math.sign(delta) !== Math.sign(wheelSum)) wheelSum = 0;
    wheelSum += delta;
    if (Math.abs(wheelSum) >= 70) {
      wheelGestureUsed = true;
      if (locked) pendingWheelStep = Math.sign(wheelSum);
      else goTo(current + Math.sign(wheelSum));
    }
  }, { passive: false });
  document.addEventListener('touchstart', event => {
    touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
    touchX = touchY === null ? null : event.touches[0].clientX;
    touchScrollTop = activeScrollable(event.target)?.scrollTop || 0;
  }, { passive: true });
  document.addEventListener('touchend', event => {
    if (touchY === null) return;
    const distance = touchY - event.changedTouches[0].clientY, horizontal = touchX - event.changedTouches[0].clientX;
    touchY = null;
    if (Math.abs(horizontal) > Math.abs(distance) || menuOpen || contact.open || projectPanel?.open || videoLibrary?.open || Math.abs(distance) <= 45) return;
    const scrollable = activeScrollable(event.target);
    if (scrollable && (Math.abs(scrollable.scrollTop - touchScrollTop) > 1 ||
      (distance < 0 && scrollable.scrollTop > 1) ||
      (distance > 0 && scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight - 1))) return;
    goTo(current + Math.sign(distance));
  }, { passive: true });
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || contact.open || projectPanel?.open || videoLibrary?.open) return;
    if (menuOpen) {
      if (event.key === 'Escape') { event.preventDefault(); toggleMenu(false); }
      if (event.key === 'Tab') {
        const items = [...navigation.querySelectorAll('a, button, summary'), ...document.querySelectorAll('[data-language]'), menu]
          .filter(item => !item.closest('details:not([open])') || item.matches('summary'))
          .filter(item => !item.getClientRects || item.getClientRects().length);
        const active = items.indexOf(document.activeElement);
        event.preventDefault(); items[(active + (event.shiftKey ? -1 : 1) + items.length) % items.length].focus();
      }
      return;
    }
    if (event.target.matches('input,textarea,select') || (event.target.matches('button,a') && event.key === ' ')) return;
    if (!['ArrowDown','PageDown',' ','ArrowUp','PageUp','Home','End'].includes(event.key)) return;
    const scrollable = activeScrollable(event.target);
    const down = ['ArrowDown','PageDown',' '].includes(event.key);
    if (scrollable && ((down && scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight - 1) || (!down && scrollable.scrollTop > 1 && event.key !== 'Home' && event.key !== 'End'))) return;
    event.preventDefault(); if (event.repeat) return;
    if (event.key === 'Home') goTo(0, true);
    else if (event.key === 'End') goTo(footerIndex, true);
    else goTo(current + (['ArrowUp','PageUp'].includes(event.key) ? -1 : 1));
  });
  window.addEventListener('resize', () => { track.style.transform = `translate3d(0,-${offset()}px,0)`; });
  document.addEventListener('rwh:languagechange', () => {
    for (const [element, timeout] of textAnimations) {
      clearTimeout(timeout);
      element.textContent = element.dataset.text || element.textContent;
    }
    textAnimations.clear();
    updatePosition();
    if (ready) track.style.transform = `translate3d(0,-${offset()}px,0)`;
  });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', schedule);
  document.addEventListener('rwh:project-open', () => {
    clearTimeout(timer);
    clearTimeout(wheelTimer);
    resetWheelGesture();
    pendingWheelStep = 0;
    touchY = touchX = null;
  });
  // Resume with a complete viewing interval only after the closing slide finishes.
  projectPanel?.addEventListener('close', schedule);

  function start() {
    const cover = document.querySelector('.cover');
    cover.querySelector('img').style.opacity = 0;
    document.body.classList.add('hideCover');
    const reveal = () => {
      ready = true;
      header.classList.add('show'); header.querySelector('h1').classList.add('show');
      cover.style.opacity = 0; cover.style.pointerEvents = 'none';
      menu.querySelectorAll('span').forEach((span, i) => setTimeout(() => span.classList.add('show'), reduced.matches ? 0 : i * 100));
      const requested = Number((window.location?.search || '').match(/[?&]project=(\d+)/)?.[1] || 1) - 1;
      current = Math.max(0, Math.min(projects.length - 1, requested));
      // A detail page returns directly to its project without replaying earlier slides.
      track.style.transition = 'none';
      track.style.transform = `translate3d(0,-${offset()}px,0)`;
      requestAnimationFrame(() => requestAnimationFrame(() => { track.style.transition = ''; }));
      projects[current].classList.add('show'); accessibleSections(); shuffle(projects[current]); updatePosition(); schedule();
      setTimeout(() => { header.classList.add('noTrans'); header.style.zIndex = 11; cover.hidden = true; }, reduced.matches ? 0 : 800);
      setTimeout(() => counter.classList.add('show'), reduced.matches ? 0 : 500);
      setTimeout(() => { if (current < footerIndex) scrollCue.style.display = 'block'; }, reduced.matches ? 0 : 1000);
    };
    if (reduced.matches) reveal();
    else {
      setTimeout(() => header.classList.add('show'), 800);
      setTimeout(reveal, 1800);
    }
  }
  updatePosition(); accessibleSections();
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
