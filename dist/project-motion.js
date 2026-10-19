(() => {
  'use strict';
  function bindDetailMotion(doc, view) {
    const reduced = view.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches || typeof view.IntersectionObserver !== 'function') return;
    const targets = [...doc.querySelectorAll('.project-photos .photo, .project-overview, #main .sec02 .h2Ttl, #main .sec02 .listUl > li')];
    const observer = new view.IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pending');
      observer.unobserve(entry.target);
    }), {rootMargin:'0px 0px -48px 0px', threshold:0});
    targets.forEach(target => {
      // Leave the first viewport and restored/anchor scroll positions visible immediately.
      if (target.getBoundingClientRect().top < view.innerHeight - 48) return;
      target.classList.add('rwh-reveal', 'is-pending');
      observer.observe(target);
    });
    reduced.addEventListener('change', () => {
      if (!reduced.matches) return;
      targets.forEach(target => target.classList.remove('is-pending'));
      observer.disconnect();
    });
  }
  if (typeof module === 'object' && module.exports) module.exports = {bindDetailMotion};
  else bindDetailMotion(document, window);
})();
