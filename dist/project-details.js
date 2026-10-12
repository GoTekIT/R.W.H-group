window.RWHDetails = {
  create({ onOpenChange, onInteractionChange }) {
    const shell = document.querySelector('.details-shell');
    const panel = document.querySelector('#project-details');
    const handle = document.querySelector('.details-handle');
    const backdrop = document.querySelector('.details-backdrop');
    const title = document.querySelector('#details-title');
    const film = document.querySelector('.details-film');
    const data = window.RWH_PROJECTS;
    const i18n = window.RWHI18n;
    let index = 0;
    let opened = false;
    let pendingIndex = null;
    let drag = null;
    let suppressClickUntil = 0;

    function renderFilm() {
      film.replaceChildren();
      const project = i18n.project(data[index]);
      if (!project?.video) {
        film.hidden = true;
        document.querySelector('.details-film-section').hidden = true;
        return;
      }
      film.hidden = false;
      document.querySelector('.details-film-section').hidden = false;
      const play = document.createElement('button');
      play.type = 'button';
      play.className = 'details-film-play';
      play.setAttribute('aria-label', i18n.t('playFilm', { name: project.name }));
      const poster = document.createElement('img');
      poster.src = project.cover;
      poster.alt = i18n.t('filmPreview', { name: project.name });
      const icon = document.createElement('span');
      icon.className = 'details-play-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '▶';
      const label = document.createElement('span');
      label.className = 'details-film-label';
      label.textContent = i18n.t('watchFilm');
      play.append(poster, icon, label);
      play.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        const url = new URL(project.video);
        url.searchParams.set('autoplay', '1');
        iframe.src = url.href;
        iframe.title = i18n.t('filmTitle', { name: project.name });
        iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        film.replaceChildren(iframe);
      });
      film.append(play);
    }

    function translateDetails() {
      if (!data[index]) return;
      const project = i18n.project(data[index]);
      title.textContent = project.name;
      document.querySelector('.details-number').textContent = `${String(index + 1).padStart(2, '0')} / ${String(data.length).padStart(2, '0')}`;
      document.querySelector('.details-subtitle').textContent = [project.year, project.type].filter(Boolean).join(' / ');
      document.querySelector('.details-description').textContent = project.description;
      for (const key of ['location', 'year', 'siteArea', 'client']) {
        const value = document.querySelector(`[data-detail="${key}"]`);
        value.textContent = project[key] ?? '';
        value.parentElement.hidden = !project[key];
      }
      const photo = document.querySelector('.details-photo');
      photo.alt = i18n.t('architecturePhoto', { name: project.name });
      document.querySelector('.details-photo-credit').textContent = project.photographer
        ? i18n.t('photography', { name: project.photographer })
        : i18n.t('imageSource', { name: project.imageSource });
      document.querySelector('.details-film-credit').textContent = project.videographer ? i18n.t('filmCredit', { name: project.videographer }) : i18n.t('projectFilm');
      document.querySelector('.details-source').href = project.source;
      const filmLink = document.querySelector('.details-film-link');
      if (project.video) filmLink.href = project.video;
      else filmLink.removeAttribute('href');
      handle.setAttribute('aria-label', i18n.t(opened ? 'closeDetails' : 'openDetails', { name: project.name }));
      handle.querySelector('.details-handle-label').textContent = i18n.t(opened ? 'close' : 'detail');
      const play = film.querySelector('button');
      if (play) {
        play.setAttribute('aria-label', i18n.t('playFilm', { name: project.name }));
        play.querySelector('img').alt = i18n.t('filmPreview', { name: project.name });
        play.querySelector('.details-film-label').textContent = i18n.t('watchFilm');
      }
      const iframe = film.querySelector('iframe');
      if (iframe) iframe.title = i18n.t('filmTitle', { name: project.name });
    }
    document.addEventListener('rwh:languagechange', translateDetails);

    function update(nextIndex) {
      // Keep the selected project and its film stable while the background advances.
      if (opened || drag) { pendingIndex = nextIndex; return; }
      pendingIndex = null;
      index = nextIndex;
      const project = data[index];
      handle.hidden = !project;
      shell.setAttribute('aria-hidden', String(!project));
      if (!project) return;
      translateDetails();
      document.querySelector('.details-photo').src = project.photo;
      renderFilm();
      panel.scrollTop = 0;
    }

    function setOpen(value, focus = true) {
      if (!data[index]) return;
      opened = value;
      shell.classList.toggle('is-open', opened);
      if (opened) { shell.setAttribute('role', 'dialog'); shell.setAttribute('aria-modal', 'true'); }
      else { shell.removeAttribute('role'); shell.removeAttribute('aria-modal'); }
      document.body.classList.toggle('details-open', opened);
      panel.inert = !opened;
      panel.setAttribute('aria-hidden', String(!opened));
      handle.setAttribute('aria-expanded', String(opened));
      handle.setAttribute('aria-label', i18n.t(opened ? 'closeDetails' : 'openDetails', { name: data[index].name }));
      handle.querySelector('.details-handle-label').textContent = i18n.t(opened ? 'close' : 'detail');
      if (!opened) {
        renderFilm(); // Removing the iframe stops playback immediately.
        if (pendingIndex !== null) update(pendingIndex);
      }
      onOpenChange(opened);
      if (focus) (opened ? title : handle.hidden ? document.querySelector('.menu') : handle).focus({ preventScroll: true });
    }

    handle.addEventListener('click', event => {
      if (performance.now() < suppressClickUntil) { event.preventDefault(); return; }
      setOpen(!opened);
    });
    backdrop.addEventListener('click', () => setOpen(false));

    // The same edge handle supports clicking, a horizontal pull and touch dragging.
    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      drag = { id: event.pointerId, startX: event.clientX, width: shell.offsetWidth, initialOpen: opened, progress: opened ? 1 : 0, moved: false };
      handle.setPointerCapture(event.pointerId);
      onInteractionChange(true);
    });
    handle.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.startX;
      if (Math.abs(dx) < 5 && !drag.moved) return;
      drag.moved = true;
      drag.progress = Math.max(0, Math.min(1, (drag.initialOpen ? 1 : 0) + dx / drag.width));
      shell.classList.add('is-dragging');
      document.body.classList.add('details-dragging');
      shell.style.transform = `translate3d(${(drag.progress - 1) * drag.width}px,0,0)`;
      backdrop.style.opacity = drag.progress;
    });
    function finishDrag(event) {
      if (!drag || event.pointerId !== drag.id) return;
      const finished = drag;
      drag = null;
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      shell.classList.remove('is-dragging');
      document.body.classList.remove('details-dragging');
      shell.style.removeProperty('transform');
      backdrop.style.removeProperty('opacity');
      if (finished.moved) {
        suppressClickUntil = performance.now() + 500;
        const dx = event.clientX - finished.startX;
        const target = event.type === 'pointercancel' ? finished.initialOpen : Math.abs(dx) > 60 ? dx > 0 : finished.progress >= .5;
        setOpen(target);
      }
      onInteractionChange(false);
      if (!opened && pendingIndex !== null) update(pendingIndex);
    }
    handle.addEventListener('pointerup', finishDrag);
    handle.addEventListener('pointercancel', finishDrag);

    document.addEventListener('keydown', event => {
      if (!opened) return;
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...panel.querySelectorAll('button,a[href],iframe'), handle].filter(element => element.offsetParent !== null);
      const first = focusable[0], last = focusable.at(-1);
      if (document.activeElement === title) {
        event.preventDefault(); (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });

    update(0);
    return { update, open: () => setOpen(true), close: () => setOpen(false), get isOpen() { return opened; }, get isInteracting() { return drag !== null; } };
  }
};
