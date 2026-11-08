(() => {
  'use strict';

  function bindContactForm({ form, note, i18n, fetchRequest = globalThis.fetch,
    makeId = () => globalThis.crypto.randomUUID(), protocol = globalThis.location?.protocol }) {
    const submit = form.querySelector('[type="submit"]');
    const fields = ['name', 'email', 'phone', 'questions'].map(name => form.elements.namedItem(name));
    const website = form.elements.namedItem('website');
    const phone = form.elements.namedItem('phone');
    function checkPhone() {
      const value = phone.value.trim();
      const digits = value.replace(/\D/g, '').length;
      const valid = /^\+?[0-9() .-]+$/.test(value) && digits >= 7 && digits <= 15 && value.length <= 32;
      phone.setCustomValidity(!value || valid ? '' : i18n.t('phoneInvalid'));
    }
    phone.addEventListener('input', checkPhone);
    form.ownerDocument?.addEventListener('rwh:languagechange', checkPhone);
    let sending = false;
    let attempt;

    async function send(event) {
      event.preventDefault();
      checkPhone();
      if (sending || !form.reportValidity()) return;
      if (protocol === 'file:') {
        i18n.message(note, 'contactLocal');
        return;
      }
      const payload = Object.fromEntries(fields.map(field => [field.name, field.value.trim()]));
      payload.website = website.value;
      if (fields.some(field => !payload[field.name])) {
        i18n.message(note, 'contactInvalid');
        return;
      }
      sending = true;
      submit.disabled = true;
      fields.forEach(field => { field.readOnly = true; });
      form.setAttribute('aria-busy', 'true');
      i18n.message(submit, 'sendingMessage');
      i18n.message(note, 'sendingMessage');
      try {
        const signature = JSON.stringify(payload);
        // A retry of unchanged content keeps its key if the first response was lost.
        if (attempt?.signature !== signature) attempt = { signature, id: makeId() };
        const response = await fetchRequest('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({ ...payload, requestId: attempt.id })
        });
        const result = await response.json();
        if (response.ok && result.ok === true) {
          form.reset();
          attempt = undefined;
          i18n.message(note, 'contactSent');
        } else {
          const errors = {
            INVALID_INPUT: 'contactInvalid', RATE_LIMITED: 'contactRateLimited',
            CONTACT_NOT_CONFIGURED: 'contactUnavailable'
          };
          i18n.message(note, errors[result.code] || 'contactError');
        }
      } catch {
        i18n.message(note, 'contactError');
      } finally {
        sending = false;
        submit.disabled = false;
        fields.forEach(field => { field.readOnly = false; });
        form.removeAttribute('aria-busy');
        i18n.message(submit, 'sendMessage');
      }
    }
    form.addEventListener('submit', send);
    return { send };
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { bindContactForm };
  } else if (!document.querySelector('#contact-modal')) {
    // The Japanese page (/ja/) shows the form inline, without the shared contact dialog.
    bindContactForm({
      form: document.querySelector('#contact-form'),
      note: document.querySelector('#contact-note'), i18n: window.RWHI18n
    });
  } else {
    const panel = document.querySelector('#contact-modal');
    panel.querySelectorAll('[data-contact-design], [data-contact-section]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault(); panel.querySelector('#contact-name').focus();
    }));
    const rail = panel.querySelector('.contact-rail');
    const topButton = document.createElement('button');
    topButton.type = 'button'; topButton.dataset.contactTop = '';
    topButton.className = 'contact-back-top';
    topButton.setAttribute('aria-label', 'Lên đầu / Back to top');
    topButton.dataset.i18nAriaLabel = 'backToTop';
    topButton.setAttribute('aria-label', window.RWHI18n.t('backToTop'));
    topButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V3M5 10l7-7 7 7"/></svg>';
    rail.append(topButton);
    topButton.addEventListener('click', event => {
      event.stopPropagation(); panel.scrollTo({top:0, behavior:'smooth'});
    });
    panel.querySelector('#contact-footer .hLogo')?.addEventListener('click', event => { event.preventDefault(); panel.close(); });
    panel.querySelector('[data-contact-home]')?.addEventListener('click', event => {
      event.preventDefault(); panel.close();
    });
    panel.querySelector('[data-contact-open]')?.addEventListener('click', event => {
      event.preventDefault(); panel.scrollTo({ top: 0, behavior: 'smooth' });
    });
    panel.querySelector('[data-videos-open]')?.addEventListener('click', () => panel.close());
    bindContactForm({
      form: document.querySelector('#contact-form'),
      note: document.querySelector('#contact-note'), i18n: window.RWHI18n
    });
  }
})();
