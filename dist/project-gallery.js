(() => {
  'use strict';
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
