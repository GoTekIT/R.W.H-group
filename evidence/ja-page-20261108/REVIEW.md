# Japanese page (/ja/) — review, 2026-11-08

Branch `ja-page`, five commits on `main` at 8ee85ed:

1. **Re-render pages from current sources.** No source change. On `main`, `python3 render-projects.py` already changes 13 pages (project pages gain the SEO block, office and project pages pick up the video names from 9e078ea), and `tests/seo.test.cjs` fails for `projects/the-hera-resort`. After this commit all tests pass.
2. **Point canonical, sitemap and robots at www.rwhgroup.site.** `SITE_CONFIG.json` `origin` only; `rwhgroup.site` redirects (308) to `www.rwhgroup.site`. The diff of the generated files changes nothing but the address.
3. **Add the Japanese page at /ja/ with its contact form.** Page, four assets, `ja-contact.js`, the `#contact-modal` guard in `contact-form.js`, the `ja` entry in `SITE_CONFIG.json`, `seo.py`, the hash refresh in `render-projects.py`, `tests/ja.test.cjs`.
4. **Link the Japanese page from the language switch.** JA after VI / EN on every page.
5. **README and this folder.**

## 1. Automated tests

`node --test tests/*.test.cjs`: **87/87 pass** (`tests.txt`; 80 before, 6 new in `tests/ja.test.cjs` for the page and form, 1 for the switch). Removing the dialog guard, the full-width conversion or the `ja` config entry makes the new tests fail, as intended. `python3 render-projects.py` run twice gives identical output.

## 2. Browser checks

Headless Chrome against `e2e/server.cjs`, which serves `dist/` like Vercel (a folder serves its `index.html` with or without the slash) and routes `POST /api/contact` to `lib/contact.js` with the real validation, origin check, honeypot, idempotency and rate limit. Only the Resend call is replaced by a recorder, so **no email was sent**. `browser.txt`: **36/36 pass**, three consecutive runs.

- `/ja/` and `/ja`: no failed request, no script error, all 15 images decode, both PDFs and the flyer open, all 11 project links open, Vietnamese links go to `/`, no sideways scroll at 390 px and 1280 px.
- Japanese form, success: one email to `linh.rwh@gmail.com` only, Reply-To the visitor, Japanese name and text intact in the email body, form cleared, 「お問い合わせありがとうございます。担当者よりご連絡いたします。」 shown (`ja-form-sent.png`).
- Full-width input `ｈａｎａｋｏ＠ｅｘａｍｐｌｅ．ｊｐ` / `０９０ー１２３４ー５６７８` arrives as `hanako@example.jp` / `090-1234-5678`.
- Blocked without the consent box; short phone blocked with the Japanese message; nothing sent in either case.
- Resend failure: Japanese error, text kept (`ja-form-error.png`). Missing Resend settings: Japanese "unavailable" line. Honeypot filled: rejected. Sixth new message in 10 minutes: Japanese rate-limit line, five emails recorded.
- Home page form (Vietnamese) still sends as before.
- JA link visible on `/`, a project page and `/office`; clicking it opens `/ja/`; inside the home page's project panel it opens `/ja/` in the whole window.

Re-run from the repository root: `node evidence/ja-page-20261108/e2e/server.cjs . 4175 &` then `node evidence/ja-page-20261108/e2e/run.cjs`.

## 3. Not verified here

- **Real delivery through Resend.** Needs `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in Vercel. `HANDOVER.md` states that no real email had been confirmed received at handover, so please send one test from the home page form and one from `/ja/` on the preview and check the inbox, spam folder and Reply-To. The Japanese form uses the same handler, recipient and email format as the home page form.
- Safari and iOS. Checked in Chrome only.
- A real Japanese input method. The conversion was tested with typed full-width text and with composition events in unit tests.

## 4. Screenshots

`ja-desktop-top.png`, `ja-desktop-works.png`, `ja-mobile-top.png`, `ja-mobile-contact.png`, `ja-form-sent.png`, `ja-form-error.png`, `home-desktop-switch.png`, `home-mobile-320-switch.png` (the switch at 320 px does not reach the logo).
