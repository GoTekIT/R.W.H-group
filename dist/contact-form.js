(() => {
  'use strict';

  function bindContactForm({ form, note, i18n, fetchRequest = globalThis.fetch,
    makeId = () => globalThis.crypto.randomUUID(), protocol = globalThis.location?.protocol }) {
    const submit = form.querySelector('[type="submit"]');
    const fields = ['name', 'email', 'questions'].map(name => form.elements.namedItem(name));
    const website = form.elements.namedItem('website');
    let sending = false;
    let attempt;

    async function send(event) {
      event.preventDefault();
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
  } else {
    bindContactForm({
      form: document.querySelector('#contact-form'),
      note: document.querySelector('#contact-note'), i18n: window.RWHI18n
    });
  }
})();
