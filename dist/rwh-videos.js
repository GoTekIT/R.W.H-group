(() => {
  'use strict';
  function bindVideos(doc, observe = callback => new IntersectionObserver(callback, {threshold:[0,.35,.6,1]})) {
    const library = doc.querySelector('#video-library');
    const fullscreenVideos = new Set();
    function start(video) { return video.play().catch(() => {}); }
    const videos = [...doc.querySelectorAll('[data-inline-video]')];
    // Choose the lightweight rendition before playback; do not swap while playing.
    const mobile = doc.defaultView?.matchMedia?.('(max-width: 767px), (pointer: coarse)')?.matches;
    if (mobile) videos.forEach(video => {
      if (video.dataset.mobileSrc) video.src = video.dataset.mobileSrc;
    });
    // Start with sound. If autoplay is blocked, keep native Play available;
    // never silently retry muted or reset the viewer's later volume choice.
    videos.forEach(video => { video.defaultMuted = false; video.muted = false; video.volume = 1; });
    videos.forEach(video => {
      video.addEventListener('webkitbeginfullscreen', () => fullscreenVideos.add(video));
      video.addEventListener('webkitendfullscreen', () => fullscreenVideos.delete(video));

    });
    const embeds = [...doc.querySelectorAll('[data-video-embed]')];
    const media = [...videos, ...embeds];
    const ratios = new Map();
    const reduced = doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)');
    const inScope = item => library?.open ? library.contains(item) : !library?.contains(item);
    let returnFocus, active;
    function playFromUserGesture(scope = null) {
      if (reduced?.matches || doc.hidden) return;
      const candidates = videos.filter(video => (!scope || scope.contains(video)) && inScope(video));
      const target = candidates.find(video => !video.ended) || candidates[0];
      if (target) {
        ratios.set(target, Math.max(ratios.get(target) || 0, .6));
        active = target;
        videos.forEach(video => { if (video !== target) video.pause(); });
        start(target);
      }
    }
    function chooseVideo() {
      if (doc.hidden) { videos.forEach(video => video.pause()); active = undefined; return; }
      if (videos.some(video => fullscreenVideos.has(video) || video.webkitDisplayingFullscreen || doc.fullscreenElement === video)) return;
      if (reduced?.matches) return;
      const candidates = videos.filter(video => inScope(video) && (ratios.get(video) || 0) >= .35);
      const best = candidates.reduce((first, next) => !first || ratios.get(next) > ratios.get(first) ? next : first, undefined);
      // Do not restart a film the viewer paused while it remains in view.
      if (best === active) return;
      videos.forEach(video => { if (video !== best) video.pause(); });
      active = best;
      if (best) start(best);
    }
    function updateEmbed(frame) {
      const ratio = ratios.get(frame) || 0;
      if (!ratio || !inScope(frame)) { frame.removeAttribute('src'); return; }
      const source = new URL(frame.dataset.videoEmbed);
      source.searchParams.set('autoplay', !doc.hidden && !reduced?.matches && ratio >= .35 ? '1' : '0');
      source.searchParams.set('mute', '1');
      if (frame.getAttribute('src') !== source.href) frame.src = source.href;
    }
    videos.forEach(video => video.addEventListener('play', () => {
      if (video.paused) return;
      active = video;
      videos.forEach(other => { if (other !== video) other.pause(); });
    }));
    const visibility = observe(entries => {
      entries.forEach(({target, isIntersecting, intersectionRatio}) => {
        ratios.set(target, isIntersecting ? intersectionRatio ?? 1 : 0);
        if (target.tagName === 'VIDEO') {
          if (!isIntersecting && !fullscreenVideos.has(target) && !target.webkitDisplayingFullscreen && doc.fullscreenElement !== target) { target.pause(); if (active === target) active = undefined; }
        } else updateEmbed(target);
      });
      chooseVideo();
    });
    media.forEach(item => visibility.observe(item));
    doc.addEventListener('visibilitychange', () => { chooseVideo(); embeds.forEach(updateEmbed); });
    reduced?.addEventListener('change', () => {
      if (reduced.matches) { videos.forEach(video => video.pause()); active = undefined; }
      else chooseVideo();
      embeds.forEach(updateEmbed);
    });
    if (library && typeof library.showModal === 'function') {
      doc.querySelectorAll('[data-videos-open]').forEach(link => link.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        returnFocus = link.closest('.menuBox') ? doc.querySelector('.menu') : link;
        videos.forEach(video => video.pause()); active = undefined;
        doc.dispatchEvent(new CustomEvent('rwh:close-menu'));
        library.querySelectorAll('[data-poster]').forEach(video => { video.poster = video.dataset.poster; });
        library.showModal();
        playFromUserGesture(library);
        media.filter(item => library.contains(item)).forEach(item => {
          ratios.set(item, 0); visibility.unobserve(item); visibility.observe(item);
        });
      }));
      library.querySelector('[data-videos-close]').addEventListener('click', () => library.close());
      library.addEventListener('close', () => {
        media.filter(item => library.contains(item)).forEach(item => {
          ratios.set(item, 0);
          if (item.tagName === 'VIDEO') item.pause(); else item.removeAttribute('src');
        });
        active = undefined;
        chooseVideo();
        (returnFocus?.closest('[inert]') ? doc.querySelector('.menu') : returnFocus)?.focus({preventScroll:true});
      });
    }
    // A project/menu click is a user gesture on mobile; use it to start audible playback.
    doc.addEventListener('rwh:project-open', () => playFromUserGesture());
  }
  if (typeof module === 'object' && module.exports) module.exports = {bindVideos};
  else bindVideos(document);
})();
