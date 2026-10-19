# RWH — Apollo landing-page reference copy

The active landing page now uses the Apollo homepage's original photographs, project text, navigation, publication card, related links and footer. On 2026-10-19 the user explicitly selected “use Apollo images and content; only change the name to RWH”. This replaces the previous interpretation that retained RWH project photographs and healthcare copy.

The HTML and styles are prepared from the public homepage snapshot in `reference/`. The original 10 projects appear in the same order, with separate desktop/mobile photographs: ETERNITY, STEALTH, TIMELESS, INFINITY, ORTHO, DIAMAS HAYAMA, MOMENT, NOBLE, ESPRIT and ELEMENT. The public assets are stored locally, unchanged; `APOLLO_REFERENCE.json` records their source URLs, byte sizes and SHA-256 hashes. The RWH wordmark replaces the original site wordmark, and visible brand text uses RWH. The reference's Google Fonts stylesheet is retained for matching font metrics.

The original layout classes and responsive rules are used directly, including the 70px/45px side rail, hamburger, animated counter, full-screen images, DETAIL line, full navigation groups and book card. The new native controller reproduces the opening reveal, six-second autoplay, one-second transitions, photo drift, shuffled metadata, slide counter, SCROLL link and back-to-top control. It avoids the source site's WordPress runtime and old jQuery dependencies. Keyboard, swipe, per-gesture wheel navigation, reduced-motion support and hidden-tab pausing are retained. Autoplay ends at the footer.

This is a copy of the **landing page**, not a mirror of the entire Apollo website. Project DETAIL links and informational menu links retain their original Apollo destinations. The home/logo links stay on this landing page. Contact and Design Order open the owner's existing three-field form rather than an Apollo enquiry form. No enquiry is submitted to Apollo by this page.

## Files

- `dist/index.html`: reference homepage markup, localized image paths and retained Contact modal.
- `dist/styles.css`: original reference common/index styles, local font fallbacks, native controller sizing and Contact styles.
- `dist/app.js`: gallery, opening animation, menu, keyboard/touch/wheel controls and Contact modal binding.
- `dist/assets/apollo-reference/`: 20 project photographs plus the original loading, social, publication, shadow and page-top assets.
- `dist/assets/rwh-reference-wordmark.svg`: replacement brand wordmark.
- `reference/`: public source snapshot used to prepare the copy; not deployed as page markup.
- `APOLLO_REFERENCE.json`: provenance and checksums for the fetched assets.
- `api/contact.js`, `dist/contact-form.js`: existing owner enquiry delivery and browser form handling.

The previous RWH project data, bilingual healthcare copy, drawer script, optimized PDF and older assets remain in the repository for recovery, but are not loaded by the current landing page. `PROJECT_SOURCES.json` describes that prior RWH project set.

## Preview and verification

Serve the static `dist` directory with a local HTTP server. There is no framework build or package installation step.

```sh
python3 -m http.server 4174 --bind 127.0.0.1 --directory dist
node --check dist/app.js
node --test tests/*.test.cjs
python3 refresh-assets.py
```

`tests/scroll.test.cjs` executes the active controller with a deterministic clock. It checks paced gestures, queued input, menu/autoplay behavior, SCROLL, Home/End, Contact navigation containment and stopping at the footer. Contact tests cover the existing API and form retry/error behavior without sending real email.

## Vercel

GitHub repository: `GoTekIT/R.W.H-group`. Production deploys automatically from `main`; live URL: https://rwh-ruby.vercel.app/. See `DEPLOY_VERCEL.md` for author identity and setup details.

The Contact recipient remains `linh.rwh@gmail.com`. Delivery uses Resend and requires `RESEND_API_KEY` and a verified `RESEND_FROM_EMAIL` in Vercel. The frontend cannot claim success without an accepted API response. No actual receipt verification has been performed in this layout task.
