(() => {
  'use strict';
  function bindVideos(doc) {
    const library = doc.querySelector('#video-library');
    const player = doc.querySelector('#video-player');
    if (!player || typeof player.showModal !== 'function') return;
    const mount = player.querySelector('[data-video-mount]');
    let playerTrigger, libraryTrigger;
    function release() {
      const media = mount.querySelector('video, iframe');
      if (!media) return;
      if (media.tagName === 'VIDEO') { media.pause(); media.removeAttribute('src'); media.load(); }
      media.remove();
    }
    doc.querySelectorAll('[data-video-stage]').forEach(stage => stage.querySelector('button').addEventListener('click', event => {
      release();
      playerTrigger = event.currentTarget;
      const isFile = stage.dataset.videoKind === 'mp4';
      const media = doc.createElement(isFile ? 'video' : 'iframe');
      if (isFile) {
        media.controls = true; media.playsInline = true; media.preload = 'none';
        media.poster = stage.dataset.videoPoster;
      } else {
        media.title = stage.dataset.videoTitle;
        media.allow = 'autoplay; fullscreen; picture-in-picture';
        media.allowFullscreen = true;
        media.referrerPolicy = 'strict-origin-when-cross-origin';
      }
      media.src = stage.dataset.videoSrc;
      player.setAttribute('aria-label', stage.dataset.videoTitle);
      mount.append(media);
      player.showModal();
      if (isFile) media.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
    }));
    player.querySelector('[data-video-close]').addEventListener('click', () => player.close());
    player.addEventListener('close', () => { release(); playerTrigger?.focus({preventScroll:true}); });
    if (library) {
      doc.querySelectorAll('[data-videos-open]').forEach(link => link.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof library.showModal !== 'function') return;
        event.preventDefault();
        libraryTrigger = link.closest('.menuBox') ? doc.querySelector('.menu') : link;
        doc.dispatchEvent(new CustomEvent('rwh:close-menu'));
        library.showModal();
      }));
      library.querySelector('[data-videos-close]').addEventListener('click', () => library.close());
      library.addEventListener('close', () => {
        if (player.open) player.close();
        (libraryTrigger?.closest('[inert]') ? doc.querySelector('.menu') : libraryTrigger)?.focus({preventScroll:true});
      });
    }
    return {release};
  }
  if (typeof module === 'object' && module.exports) module.exports = {bindVideos};
  else bindVideos(document);
})();
