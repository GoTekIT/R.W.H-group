(() => {
  'use strict';
  const menu = document.querySelector('.menu');
  const navigation = document.querySelector('.menuBox');
  const main = document.querySelector('#main');
  const footer = document.querySelector('#gFooter');
  const contact = document.querySelector('#contact-modal');
  let menuOpen = false, returnFocus = menu;
  const messages = {
    sendMessage: 'Send message', sendingMessage: 'Sending…',
    contactSent: 'Thank you! Your enquiry has been sent to R.W.H group.',
    contactInvalid: 'Please check your name, email and questions.',
    contactError: 'Your enquiry could not be sent. Your details are still here; please try again.',
    contactRateLimited: 'Please wait a few minutes before trying again.',
    contactUnavailable: 'The contact form is being set up. Please try again later.',
    contactLocal: 'Please open the published website to send an enquiry.',
    openMenu: 'Open menu', closeMenu: 'Close menu'
  };
  window.RWHI18n ||= { t: key => messages[key] || key, message(element, key) { element.textContent = messages[key] || key; } };
  function toggleMenu(open, focus = true) {
    menuOpen = open;
    menu.classList.toggle('active', open);
    navigation.classList.toggle('moveout', open);
    document.body.classList.toggle('menu-open', open);
    document.querySelector('#gHeader').classList.toggle('show01', open);
    navigation.inert = !open;
    main.inert = footer.inert = open;
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', window.RWHI18n.t(open ? 'closeMenu' : 'openMenu'));
    if (focus) (open ? navigation.querySelector('a') : menu).focus({ preventScroll:true });
  }
  menu.addEventListener('click', event => { event.stopPropagation(); toggleMenu(!menuOpen); });
  document.querySelector('.meunRBox').addEventListener('click', event => {
    if (!menu.contains(event.target)) toggleMenu(!menuOpen);
  });
  document.addEventListener('keydown', event => {
    if (!menuOpen || contact.open) return;
    if (event.key === 'Escape') { event.preventDefault(); toggleMenu(false); }
    if (event.key === 'Tab') {
      const items = [...navigation.querySelectorAll('a, button, summary'), ...document.querySelectorAll('[data-language]'), menu]
        .filter(item => !item.closest('details:not([open])') || item.matches('summary'))
        .filter(item => !item.getClientRects || item.getClientRects().length);
      const index = items.indexOf(document.activeElement);
      event.preventDefault();
      items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length].focus();
    }
  });
  for (const trigger of document.querySelectorAll('[data-contact-open]')) {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      returnFocus = trigger.closest('.menuBox') ? menu : trigger;
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
  contact.addEventListener('close', () => returnFocus.focus({ preventScroll:true }));
  function scrollState() { document.body.classList.toggle('page-scrolled', window.scrollY > 300); }
  window.addEventListener('scroll', scrollState, { passive:true });
  scrollState();

  const images = [...document.querySelectorAll('.gallery-image')];
  const viewer = document.querySelector('.image-viewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  const photo = viewer.querySelector('.viewer-stage img');
  const caption = viewer.querySelector('.viewer-caption');
  const close = viewer.querySelector('.viewer-close');
  let current = 0;
  function show(index) {
    current = (index + images.length) % images.length;
    const link = images[current];
    photo.src = link.href;
    photo.alt = link.dataset.caption;
    caption.textContent = `${link.dataset.caption} / ${String(images.length).padStart(2, '0')}`;
  }
  images.forEach((link, index) => link.addEventListener('click', event => {
    event.preventDefault();
    show(index);
    viewer.showModal();
  }));
  close.addEventListener('click', () => viewer.close());
  viewer.querySelector('.viewer-prev').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.viewer-next').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  viewer.addEventListener('close', () => images[current].focus({ preventScroll: true }));
})();
