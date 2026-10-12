(() => {
  'use strict';
  const track = document.querySelector('#fullpage');
  const sections = [...track.querySelectorAll(':scope > .section')];
  const projects = sections.filter(section => section.classList.contains('mainImg'));
  const projectStart = sections.indexOf(projects[0]);
  const footerIndex = sections.length - 1;
  const footer = document.querySelector('#gFooter');
  const menu = document.querySelector('.menu');
  const navigation = document.querySelector('.menuBox');
  const menuBackdrop = document.querySelector('.menu-backdrop');
  const detailsHandle = document.querySelector('.details-handle');
  const controls = document.querySelector('.project-controls');
  const languageControl = document.querySelector('.language-control');
  const scrollControl = document.querySelector('.scroll-control');
  const scrollRange = document.querySelector('.scroll-range');
  const scrollPosition = document.querySelector('.scroll-position');
  const scrollJump = document.querySelector('.scroll-jump');
  const i18n = window.RWHI18n;
  const textAnimations = new Map();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer;
  let unlock;
  let locked = false;
  let touchY = null;
  let touchX = null;
  let touchScrollTop = 0;
  let wheelSum = 0;
  let wheelTimer;
  let wheelGestureUsed = false;
  let pendingWheelStep = 0;
  let scrollDragging = false;
  let scrollIdleTimer;
  let scrollHovered = false;
  let scrollKeyboardFocus = false;
  let menuOpen = false;
  let menuOpenedByHover = false;
  let menuCloseTimer;
  const main = document.querySelector('#main');
  const header = document.querySelector('#gHeader');
  const contact = document.querySelector('#contact-modal');
  const profile = document.querySelector('#profile-modal');
  const modals = [contact, profile];
  const modalOpen = () => modals.some(dialog => dialog.open);
  const details = window.RWHDetails.create({
    onOpenChange(open) {
      if (open && menuOpen) toggleMenu(false);
      main.inert = open || menuOpen;
      header.inert = open || menuOpen;
      controls.inert = open;
      scrollControl.inert = open || menuOpen;
      languageControl.hidden = open;
    },
    onInteractionChange(active) { controls.inert = active || details.isOpen; }
  });

  for (const [index, section] of projects.entries()) {
    const trigger = section.querySelector('.txtBox a');
    trigger.href = `#project-${index + 1}`;
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.addEventListener('click', event => { event.preventDefault(); details.open(); });
  }

  function translateProjects() {
    for (const animation of textAnimations.values()) clearInterval(animation);
    textAnimations.clear();
    for (const [index, section] of projects.entries()) {
      const project = i18n.project(window.RWH_PROJECTS[index]);
      section.querySelector('.txtBox a').setAttribute('aria-label', i18n.t('viewDetails', { name: project.name }));
      section.querySelector('h2 span').textContent = project.name;
      const lines = [[project.year, project.type].filter(Boolean).join(' '), project.summary];
      section.querySelectorAll('.shuffle').forEach((element, line) => {
        element.dataset.text = lines[line];
        element.textContent = lines[line];
      });
    }
    menu.setAttribute('aria-label', i18n.t(menuOpen ? 'closeMenu' : 'openMenu'));
    updateScrollControl();
    if (current === footerIndex) track.style.transform = `translate3d(0, -${offset()}px, 0)`;
  }
  document.addEventListener('rwh:languagechange', translateProjects);
  translateProjects();

  // Only the active section is reachable by keyboard or assistive technology.
  function accessibleSections() {
    sections.forEach((section, index) => {
      section.inert = index !== current;
      section.setAttribute('aria-hidden', String(index !== current));
    });
  }

  function schedule() {
    clearTimeout(timer);
    if (!reduced.matches && !document.hidden && !scrollDragging && current < footerIndex) {
      const delay = current === 0 ? 12000 : current < projectStart ? 30000 : 6000;
      timer = setTimeout(() => goTo(current + 1, false, true), delay);
    }
  }

  function updateScrollControl() {
    const isFooter = current === footerIndex;
    const name = current < projectStart ? i18n.t(current === 0 ? 'brandSection' : 'strengthsSection') : window.RWH_PROJECTS[current - projectStart]?.name;
    scrollRange.value = current;
    scrollRange.max = footerIndex;
    scrollRange.setAttribute('aria-valuetext', isFooter ? i18n.t('scrollFooter') : i18n.t('scrollProject', { number: current + 1, total: footerIndex, name }));
    scrollPosition.textContent = isFooter ? i18n.t('footerPosition') : `${String(current + 1).padStart(2, '0')} / ${footerIndex}`;
    scrollJump.disabled = isFooter;
    scrollJump.title = i18n.t('skipFooter');
  }

  function offset() {
    const height = document.querySelector('#main').clientHeight;
    return current < footerIndex
      ? current * height
      : footerIndex * height - Math.max(0, height - footer.offsetHeight);
  }

  function goTo(index, immediate = false, automatic = false) {
    // An explicit rail/Home/End jump replaces any wheel request still waiting.
    if (immediate) pendingWheelStep = 0;
    const destination = Math.max(0, Math.min(sections.length - 1, index));
    if ((!automatic && (menuOpen || details.isOpen || details.isInteracting || modalOpen())) || (locked && !immediate) || destination === current) return;
    current = destination;
    clearTimeout(timer);
    clearTimeout(unlock);
    wheelSum = 0;
    pendingWheelStep = 0;
    locked = true;
    track.classList.toggle('manual-scroll', !automatic);
    track.style.transform = `translate3d(0, -${offset()}px, 0)`;
    sections.forEach((section, i) => section.classList.toggle('show', i === current));
    const isFooter = current === footerIndex;
    document.body.classList.toggle('at-footer', isFooter);
    document.body.classList.toggle('at-intro', current < projectStart);
    accessibleSections();
    details.update(current - projectStart);
    updateScrollControl();
    shuffleText(projects[current - projectStart]);
    unlock = setTimeout(() => {
      locked = false;
      const step = pendingWheelStep;
      pendingWheelStep = 0;
      if (step && !document.hidden) goTo(current + step);
    }, reduced.matches ? 0 : automatic ? 1050 : 1200);
    schedule();
  }

  function shuffleText(section) {
    if (!section || reduced.matches) return;
    for (const element of section.querySelectorAll('.shuffle')) {
      clearInterval(textAnimations.get(element));
      const text = element.dataset.text || element.textContent;
      element.dataset.text = text;
      let frame = 0;
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const animation = setInterval(() => {
        frame++;
        const revealed = Math.ceil((frame / 18) * text.length);
        element.textContent = [...text].map((character, i) => i < revealed || character === ' ' ? character : alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
        if (frame >= 18 || document.hidden) { element.textContent = text; clearInterval(animation); textAnimations.delete(element); }
      }, 26);
      textAnimations.set(element, animation);
    }
  }

  function toggleMenu(open, { focus = true, hover = false } = {}) {
    clearTimeout(menuCloseTimer);
    if (open && details.isOpen) details.close();
    menuOpen = open;
    menuOpenedByHover = open && hover;
    document.body.classList.toggle('menu-open', open);
    menu.classList.toggle('active', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', i18n.t(open ? 'closeMenu' : 'openMenu'));
    navigation.classList.toggle('moveout', open);
    navigation.inert = !open;
    main.inert = open || details.isOpen;
    header.inert = open || details.isOpen;
    scrollControl.inert = open || details.isOpen;
    if (focus) {
      if (open) navigation.querySelector('a').focus({ preventScroll: true });
      else menu.focus({ preventScroll: true });
    }
  }

  menu.addEventListener('click', () => toggleMenu(!menuOpen));
  menuBackdrop.addEventListener('click', () => toggleMenu(false));
  const menuHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  for (const surface of [menu, navigation]) {
    surface.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse' || !menuHover.matches || details.isOpen || modalOpen()) return;
      clearTimeout(menuCloseTimer);
      if (!menuOpen) toggleMenu(true, { focus: false, hover: true });
    });
    surface.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse' || !menuOpenedByHover) return;
      if (menu.contains(event.relatedTarget) || navigation.contains(event.relatedTarget)) return;
      menuCloseTimer = setTimeout(() => {
        if (menuOpenedByHover) toggleMenu(false, { focus: false });
      }, 250);
    });
  }
  function bindModal(dialog, selector) {
    let returnFocus = menu;
    for (const trigger of document.querySelectorAll(selector)) {
      trigger.addEventListener('click', event => {
        event.preventDefault();
        returnFocus = trigger.closest('#navigation') ? menu : trigger;
        if (menuOpen) toggleMenu(false);
        dialog.showModal();
      });
    }
    dialog.querySelector('[data-modal-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const focusable = [...dialog.querySelectorAll('button,input,textarea,a[href]')].filter(element => !element.disabled && element.offsetParent !== null);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      const target = returnFocus.closest('[inert]') ? menu : returnFocus;
      target.focus({ preventScroll: true });
    });
  }
  bindModal(contact, '[data-contact-open]');
  bindModal(profile, '[data-profile-open]');
  for (const logo of document.querySelectorAll('.hLogo')) {
    logo.addEventListener('click', event => { event.preventDefault(); if (menuOpen) toggleMenu(false); goTo(0, true); });
  }
  for (const button of document.querySelectorAll('[data-section-next]')) {
    button.addEventListener('click', () => {
      // Move focus out of the section that becomes inert.
      main.focus({ preventScroll: true });
      goTo(Number(button.dataset.sectionNext), true);
    });
  }

  const strengthHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  for (const card of document.querySelectorAll('.strength-card')) {
    const summary = card.querySelector('summary');
    let hovering = false;
    card.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse' || !strengthHover.matches) return;
      hovering = true;
      card.open = true;
    });
    card.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse' || !hovering) return;
      hovering = false;
      card.open = false;
    });
    summary.addEventListener('click', event => {
      // Mouse previews follow the pointer; touch and keyboard keep native disclosure.
      if (hovering) event.preventDefault();
    });
    summary.addEventListener('focus', () => {
      if (summary.matches(':focus-visible')) card.open = true;
    });
    card.addEventListener('focusout', event => {
      if (!hovering && !card.contains(event.relatedTarget)) card.open = false;
    });
    strengthHover.addEventListener('change', () => {
      hovering = false;
      card.open = false;
    });
  }

  scrollRange.addEventListener('input', () => goTo(Number(scrollRange.value), true));
  scrollRange.addEventListener('pointerdown', () => { scrollDragging = true; clearTimeout(timer); });
  function endScrollDrag() {
    if (!scrollDragging) return;
    scrollDragging = false;
    revealScrollControl();
    schedule();
  }
  document.addEventListener('pointerup', endScrollDrag);
  document.addEventListener('pointercancel', endScrollDrag);
  scrollRange.addEventListener('keydown', event => {
    const moves = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1, PageUp: -1, PageDown: 1 };
    if (Object.hasOwn(moves, event.key) || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      event.stopPropagation();
      if (event.repeat) return;
      const jump = event.key === 'Home' || event.key === 'End';
      goTo(event.key === 'Home' ? 0 : event.key === 'End' ? footerIndex : current + moves[event.key], jump);
    }
  });
  scrollJump.addEventListener('click', () => goTo(footerIndex, true));

  // Only viewer activity reveals the rail; automatic slides leave it hidden.
  function revealScrollControl() {
    scrollControl.classList.remove('is-idle');
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = setTimeout(() => {
      if (scrollDragging || scrollHovered || (scrollKeyboardFocus && scrollControl.contains(document.activeElement))) return;
      scrollControl.classList.add('is-idle');
    }, 2200);
  }
  document.addEventListener('pointermove', revealScrollControl, { passive: true });
  document.addEventListener('pointerdown', () => {
    scrollKeyboardFocus = false;
    revealScrollControl();
  }, { passive: true, capture: true });
  document.addEventListener('wheel', revealScrollControl, { passive: true });
  document.addEventListener('touchstart', revealScrollControl, { passive: true });
  document.addEventListener('touchmove', revealScrollControl, { passive: true });
  document.addEventListener('keydown', () => {
    scrollKeyboardFocus = true;
    revealScrollControl();
  }, { capture: true });
  document.addEventListener('focusin', revealScrollControl);
  scrollControl.addEventListener('focusout', revealScrollControl);
  scrollControl.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    scrollHovered = true;
    revealScrollControl();
  });
  scrollControl.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse') return;
    scrollHovered = false;
    revealScrollControl();
  });
  revealScrollControl();

  // A gesture consumes one page. Momentum must settle before another gesture.
  // Remember one fresh request during a transition instead of discarding it.
  function resetWheelGesture() {
    wheelTimer = undefined;
    wheelSum = 0;
    wheelGestureUsed = false;
  }

  function activeScrollable(target) {
    const candidate = current === footerIndex ? footer : current < projectStart ? sections[current] : null;
    const description = target.closest('.strength-card[open] p');
    if (candidate?.contains(description) && description.scrollHeight > description.clientHeight + 1) return description;
    return candidate?.contains(target) ? candidate : null;
  }

  document.addEventListener('wheel', event => {
    if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX) || menuOpen || details.isOpen || details.isInteracting || modalOpen()) return;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(resetWheelGesture, 280);
    const scrollable = !locked && activeScrollable(event.target);
    if (scrollable) {
      const atTop = scrollable.scrollTop <= 1;
      const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;
      if ((event.deltaY < 0 && !atTop) || (event.deltaY > 0 && !atBottom)) {
        // Reaching the end of long text with momentum doesn't skip its page.
        wheelGestureUsed = true;
        wheelSum = 0;
        schedule();
        return;
      }
    }
    event.preventDefault();
    if (wheelGestureUsed) return;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? main.clientHeight : 1);
    if (wheelSum && Math.sign(delta) !== Math.sign(wheelSum)) {
      wheelSum = 0;
    }
    wheelSum += delta;
    if (Math.abs(wheelSum) >= 70) {
      wheelGestureUsed = true;
      const step = Math.sign(wheelSum);
      if (locked) pendingWheelStep = step;
      else goTo(current + step);
    }
  }, { passive: false });

  document.addEventListener('touchstart', event => {
    touchY = event.touches.length === 1 && !event.target.closest('.scroll-control') ? event.touches[0].clientY : null;
    touchX = touchY === null ? null : event.touches[0].clientX;
    touchScrollTop = activeScrollable(event.target)?.scrollTop || 0;
  }, { passive: true });
  document.addEventListener('touchend', event => {
    if (touchY === null) return;
    const distance = touchY - event.changedTouches[0].clientY;
    const horizontal = touchX - event.changedTouches[0].clientX;
    touchY = null;
    if (Math.abs(horizontal) > Math.abs(distance) || menuOpen || details.isOpen || details.isInteracting || modalOpen() || event.target.closest('.details-shell')) return;
    if (Math.abs(distance) > 45) {
      const scrollable = activeScrollable(event.target);
      if (scrollable && (Math.abs(scrollable.scrollTop - touchScrollTop) > 1 || (distance < 0 && scrollable.scrollTop > 1) || (distance > 0 && scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight - 1))) {
        schedule();
        return;
      }
      goTo(current + Math.sign(distance));
    }
  }, { passive: true });

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || details.isOpen || details.isInteracting || modalOpen()) return;
    if (menuOpen) {
      if (event.key === 'Escape') { event.preventDefault(); toggleMenu(false); }
      if (event.key === 'Tab') {
        menuOpenedByHover = false;
        clearTimeout(menuCloseTimer);
        const focusable = [...navigation.querySelectorAll('a'), menu, ...languageControl.querySelectorAll('button')];
        if (!detailsHandle.hidden) focusable.push(detailsHandle);
        const active = focusable.indexOf(document.activeElement);
        const next = (active + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
        event.preventDefault();
        focusable[next].focus();
      }
      return;
    }
    if (event.target.matches('input,textarea,select') || (event.target.matches('button,a,summary') && event.key === ' ')) return;
    if (['ArrowDown', 'PageDown', ' ', 'ArrowUp', 'PageUp', 'Home', 'End'].includes(event.key)) {
      const scrollable = activeScrollable(event.target);
      const down = ['ArrowDown', 'PageDown', ' '].includes(event.key);
      const up = ['ArrowUp', 'PageUp'].includes(event.key);
      if (scrollable && ((down && scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight - 1) || (up && scrollable.scrollTop > 1))) {
        schedule();
        return;
      }
      if (event.repeat) { event.preventDefault(); return; }
      event.preventDefault();
      if (event.key === 'Home') goTo(0, true);
      else if (event.key === 'End') goTo(footerIndex, true);
      else goTo(current + (['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 1));
    }
  });

  window.addEventListener('resize', () => { track.style.transform = `translate3d(0, -${offset()}px, 0)`; });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', schedule);
  details.update(current - projectStart);
  accessibleSections();
  schedule();
})();
