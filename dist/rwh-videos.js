(() => {
  'use strict';
  function bindVideos(doc, observe = callback => new IntersectionObserver(callback)) {
    const library = doc.querySelector('#video-library');
    const videos = [...doc.querySelectorAll('[data-inline-video]')];
    const embeds = [...doc.querySelectorAll('[data-video-embed]')];
    let returnFocus;
    // The actual player is already in the page; native controls start playback in place.
    videos.forEach(video => video.addEventListener('play', () => {
      videos.forEach(other => { if (other !== video) other.pause(); });
    }));
    const visibility = observe(entries => entries.forEach(({target, isIntersecting}) => {
      if (target.tagName === 'VIDEO') {
        if (!isIntersecting) target.pause();
      } else if (isIntersecting) {
        if (!target.getAttribute('src')) target.src = target.dataset.videoEmbed;
      } else {
        // Removing an offscreen embed also stops its audio, without a provider SDK.
        target.removeAttribute('src');
      }
    }));
    [...videos, ...embeds].forEach(media => visibility.observe(media));
    if (library && typeof library.showModal === 'function') {
      doc.querySelectorAll('[data-videos-open]').forEach(link => link.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        returnFocus = link.closest('.menuBox') ? doc.querySelector('.menu') : link;
        videos.forEach(video => video.pause());
        doc.dispatchEvent(new CustomEvent('rwh:close-menu'));
        library.showModal();
        library.querySelectorAll('[data-video-embed]').forEach(frame => {
          visibility.unobserve(frame);
          visibility.observe(frame);
        });
      }));
      library.querySelector('[data-videos-close]').addEventListener('click', () => library.close());
      library.addEventListener('close', () => {
        library.querySelectorAll('video').forEach(video => video.pause());
        library.querySelectorAll('[data-video-embed]').forEach(frame => frame.removeAttribute('src'));
        (returnFocus?.closest('[inert]') ? doc.querySelector('.menu') : returnFocus)?.focus({preventScroll:true});
      });
    }
  }
  if (typeof module === 'object' && module.exports) module.exports = {bindVideos};
  else bindVideos(document);
})();
