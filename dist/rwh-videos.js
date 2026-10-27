(() => {
  'use strict';
  function bindVideos(doc, observe = callback => new IntersectionObserver(callback, {threshold:[0,.35,.6,1]})) {
    const library = doc.querySelector('#video-library');
    const fullscreenVideos = new Set();
    function start(video) { return video.play().catch(() => {}); }
    const videos = [...doc.querySelectorAll('[data-inline-video]')];
    // Desktop retains the original CDN bytes. Only small screens use the mobile rendition.
    const mobile = doc.defaultView?.matchMedia?.('(max-width: 767px)')?.matches;
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
    const vimeoStates = new Map();
    let sdkLoading;
    function vimeoSDK() {
      const win = doc.defaultView;
      if (win?.Vimeo?.Player) return Promise.resolve(win.Vimeo);
      if (!doc.createElement) return Promise.resolve(null);
      if (!sdkLoading) sdkLoading = new Promise((resolve, reject) => {
        const script = doc.createElement('script');
        const controller = doc.querySelector('script[src*="rwh-videos.js"]');
        script.src = new URL('vimeo-player.js', controller.src).href;
        script.onload = () => resolve(win.Vimeo);
        script.onerror = () => reject(new Error('Vimeo player could not load'));
        doc.head.append(script);
      });
      return sdkLoading;
    }
    function releaseVimeo(frame) {
      const state = vimeoStates.get(frame);
      if (state) {
        state.released = true;
        state.player?.destroy().catch(() => {});
        vimeoStates.delete(frame);
      }
      frame.removeAttribute('src');
    }
    function updateVimeo(frame, autoplay) {
      let state = vimeoStates.get(frame);
      if (!state) {
        const url = new URL(frame.dataset.videoEmbed);
        // Let the SDK request audible playback. Vimeo URL autoplay can silently
        // fall back to muted playback when a browser rejects sound.
        url.searchParams.set('autoplay', '0');
        url.searchParams.set('muted', '0');
        url.searchParams.set('playsinline', '1');
        frame.src = url.href;
        state = {wanted: autoplay, released: false};
        vimeoStates.set(frame, state);
        state.ready = vimeoSDK().then(async api => {
          if (!api || state.released) return;
          const player = state.player = new api.Player(frame);
          player.on('fullscreenchange', event => { state.fullscreen = event.fullscreen; });
          player.on('play', async () => {
            if (!state.soundChecked) {
              state.soundChecked = true;
              if (await player.getMuted()) {
                await player.pause();
                await player.setMuted(false);
                await player.setVolume(1);
              }
            }
            videos.forEach(video => video.pause());
            vimeoStates.forEach(other => {
              if (other !== state) other.player?.pause().catch(() => {});
            });
          });
          await player.ready();
          if (state.released) return;
          await player.setMuted(false);
          await player.setVolume(1);
          if (state.wanted) await player.play();
        }).catch(() => {}); // Keep Vimeo's own Play control if autoplay is blocked.
      } else if (state.fullscreen && !doc.hidden) {
        return; // Rotation/fullscreen can temporarily change intersection geometry.
      } else if (state.wanted !== autoplay) {
        state.wanted = autoplay;
        state.ready.then(() => {
          if (!state.player || state.released) return;
          return (state.wanted ? state.player.play() : state.player.pause()).catch(() => {});
        });
      }
    }

    const ratios = new Map();
    const reduced = doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)');
    const inScope = item => library?.open ? library.contains(item) : !library?.contains(item);
    function bestVimeo(scope = null) {
      return embeds.filter(frame => new URL(frame.dataset.videoEmbed).hostname === 'player.vimeo.com'
        && (!scope || scope.contains(frame)) && inScope(frame) && (ratios.get(frame) || 0) >= .35)
        .reduce((best, frame) => !best || ratios.get(frame) > ratios.get(best) ? frame : best, null);
    }
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
      } else {
        const frame = bestVimeo(scope);
        if (frame) {
          updateEmbed(frame);
          vimeoStates.get(frame)?.player?.play().catch(() => {});
        }
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
      const source = new URL(frame.dataset.videoEmbed);
      const autoplay = !doc.hidden && !reduced?.matches && ratio >= .35 && inScope(frame);
      if (source.hostname === 'player.vimeo.com') {
        if ((!ratio || !inScope(frame)) && !vimeoStates.has(frame)) return;
        updateVimeo(frame, autoplay && frame === bestVimeo());
        return;
      }
      if (!ratio || !inScope(frame)) { frame.removeAttribute('src'); return; }
      source.searchParams.set('autoplay', autoplay ? '1' : '0');
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
        }
      });
      embeds.forEach(updateEmbed);
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
          if (item.tagName === 'VIDEO') item.pause(); else releaseVimeo(item);
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
