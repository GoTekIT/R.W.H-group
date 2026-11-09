(() => {
  'use strict';
  // Japanese messages for contact-form.js on /ja/. The page does not load site-language.js
  // (vi/en), so this provides the same t()/message() interface with Japanese text only.
  const messages = {
    sendMessage: '送信する', sendingMessage: '送信中…',
    contactSent: 'お問い合わせありがとうございます。担当者よりご連絡いたします。',
    contactError: '送信できませんでした。入力内容はそのまま残っています。時間をおいて再度お試しいただくか、メールでご連絡ください。',
    contactInvalid: 'お名前、メールアドレス、電話番号、ご相談内容をご確認ください。',
    contactRateLimited: '送信回数が多すぎます。数分おいてから再度お試しください。',
    contactUnavailable: '現在フォームをご利用いただけません。メールまたはお電話でご連絡ください。',
    contactLocal: '公開中のウェブサイトから送信してください。',
    phoneInvalid: '電話番号を正しくご入力ください(数字7〜15桁)。'
  };
  const t = key => messages[key] ?? key;
  window.RWHI18n = { t, message(element, key) { element.dataset.i18n = key; element.textContent = t(key); }, get language() { return 'ja'; } };

  // Japanese input methods often produce full-width digits and symbols (０９０－１２３４, ｔａｒｏ＠…),
  // which the browser and /api/contact reject. Convert them once typing is committed, then
  // re-fire input so contact-form.js re-checks the phone number.
  const form = document.querySelector('#contact-form');
  const dashes = /[\u2010-\u2015\u2212\u30fc\uff70]/g; // hyphens, dashes, minus, katakana long vowel mark
  function normalize(field) {
    if (!field || (field.name !== 'email' && field.name !== 'phone')) return;
    let value = field.value.normalize('NFKC');
    if (field.name === 'phone') value = value.replace(dashes, '-');
    if (value === field.value) return;
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }
  form.addEventListener('input', event => { if (!event.isComposing) normalize(event.target); });
  form.addEventListener('compositionend', event => normalize(event.target));
  form.addEventListener('change', event => normalize(event.target));
})();
