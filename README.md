# R.W.H Group landing page

A static architecture landing page based on https://apollo-aa.jp/, customized with the R.W.H Group wordmark and a #666666 gray brand palette.

Review: https://rwh-group-review.nhitran-35221021047.chatgpt.site

[Landing page brief](BRIEF.md)

## Deploy to Vercel

Import **GoTekIT/R.W.H-group** at https://vercel.com/new with the repository root (`./`) as Root Directory. The root `vercel.json` sets **Other**, skips dependency installation/building and publishes `dist/`. Use `main` as the production branch. The Contact endpoint runs as a Vercel Function and requires server-side `RESEND_API_KEY` and `RESEND_FROM_EMAIL` environment variables.

See [hướng dẫn deploy Vercel](DEPLOY_VERCEL.md) for import settings, deployment checks and domain setup. The server sends enquiries through Resend to `linh.rwh@gmail.com`. Configure the verified sender and API key in Vercel, redeploy and verify an actual received email before handover.

## Run locally

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173/. No package installation or build step is required. This static preview does not run `/api/contact`; use a Vercel deployment for email submission. Opening the page as a local file also cannot send email.

## Edit

- `dist/index.html`: project names, descriptions, images, menu and footer.
- `dist/styles.css`: reference layout, responsive gallery overrides and R.W.H brand tokens (#666666 primary, #858585 light, #525252 dark, white text).
- `dist/app.js`: vertical slide transitions, 6-second autoplay, one-page wheel gestures, paced manual transitions, swipe and keyboard navigation, draggable progress rail and menu focus handling.
- `dist/contact-form.js`: asynchronous form submission, pending/success/error states, retry idempotency and preservation of unsent values.
- `api/contact.js` and `lib/contact.js`: Vercel Node endpoint, Resend integration, fixed owner recipient, input/origin validation and best-effort instance rate limiting. Credentials stay server-side.
- `dist/i18n.js`: Vietnamese and English interface copy, document language, translated accessibility labels and saved language preference.
- `dist/projects.js`: ten R.W.H Group projects, bilingual descriptions, verified project facts, images and official source links. Videos are optional and currently absent.
- `PROJECT_SOURCES.json`: the official project pages and image URLs used for the review selection, retrieved on 2026-10-08.
- `dist/project-details.js`: the left-hand drawer, click/pull handle, focus handling and video playback.
- `dist/assets`: locally stored architecture photographs, reference assets and Roboto fonts. The header and footer use a large white text wordmark, spelled exactly **R.W.H Group**, with no square frame or colored background. The same spelling appears in Details, Profile, metadata and copyright. `rwh-group-logo.png` is retained as an unused source asset; the supplied PDF and its cover remain unchanged.

After editing CSS or JavaScript, run `python3 refresh-assets.py` before publishing. It refreshes content-based asset URLs so browsers load the latest behavior. Run `node --test tests/*.test.cjs` to check the email endpoint and form using a mocked provider, plus wheel gestures, transition handoff, autoplay and explicit jumps with a deterministic clock. No test sends a real email.

The supplied healthcare introduction and six capabilities are in Profile, rather than separate opening slides. Five consulting areas—Wellness Resort, Onsen Luxury Villa, Onsen & Spa, premium senior care and international hospitals—are supported by Japanese expertise and technology as the sixth capability. The existing Vietnamese and English positioning remains available in Profile and metadata.

The VI / EN control at the top right switches the entire landing page between Vietnamese (default) and English. The language control appears only on the main page; Details, Profile and Contact follow the selected language without additional switches. Interface labels, footer, ten project descriptions and facts, profile introduction, form labels, status messages, page metadata and accessibility text change immediately. Names, original photo credits and the bilingual PDF remain unchanged. The choice is stored in `localStorage` when available; switching still works when storage is unavailable. Switching does not restart gallery autoplay, discard form values, reset an open drawer's selected project or recreate a playing film.

The landing page follows the Apollo gallery composition. It opens immediately on the first full-screen project photograph, followed by nine more projects and a compact footer. There are no introductory slides before the gallery. The wordmark sits at 100px / 90px on desktop, with a 30px project title at the lower left, two small metadata lines and a 270px DETAIL progress rule. A 70px dark right rail contains a two-line hamburger, the 01–10 counter and a vertical SCROLL cue. Mobile uses a 45px rail and smaller offsets. Project photographs retain their original colors.

The ten project images and mobile image variants are retained as review placeholders from the supplied RWH website. DETAIL opens the existing two-thirds glass drawer for the visible project; the extra edge handle appears after opening the drawer. Contact, Design Order and Profile open modals on this page. The short charcoal footer rises below the last project image and uses three columns for the wordmark/tagline, useful links and company-profile preview. It retains white Facebook, Instagram, Zalo and phone icons, plus Hotline: 0982-132-489 linking to +84982132489. Official social links are pending. The owner email linh.rwh@gmail.com is only the server-side form recipient. Books, news, recruitment and unrelated websites are excluded.

Profile in the menu and “HỒ SƠ NĂNG LỰC” in the footer open a glass modal with the supplied company profile cover, the supplied positioning on Japanese architecture, operations and medical expertise, a paragraph about practical models combining space, technology, medicine and operations, and “Xem hồ sơ” / “Tải PDF” buttons. The complete bilingual 2025 PDF loads only when a button is clicked. The optimized copy in `dist/assets/rwh-company-profile-2025.pdf` is 10.35 MiB (displayed as 10.4 MB), down from 71.35 MiB. All 135 pages, searchable text and page dimensions are preserved; only embedded images and streams are compressed. This version exceeds the proposed 3 MB target to retain readable images and diagrams. The original PDF remains untouched in Downloads. The cover thumbnail is loaded lazily. Both modals support X, Escape, backdrop dismissal, keyboard focus containment and focus restoration, with gallery autoplay continuing behind them.

`prepare-profile.py` reproduces the optimized PDF with Python, Pillow and pypdf:

```sh
python3 prepare-profile.py '/path/to/original.pdf' dist/assets/rwh-company-profile-2025.pdf --dpi 110 --quality 45
```

The script verifies that the number of pages, searchable text on every page and page dimensions exactly match the source before reporting completion.

Contact in the menu and footer opens a responsive glass modal with exactly three fields: Name, Email and Questions. The form validates required fields, sends JSON to `/api/contact` and reports pending, accepted, validation and failure states in the selected language. It prevents double submission, keeps unsent values after failures and reuses the same idempotency key for unchanged retries. It clears the fields only after the API confirms Resend accepted the enquiry; it does not persist visitor data. Close with the X button, Escape or a click outside the modal. Native dialog behavior keeps keyboard focus inside the form and returns focus on close. Gallery autoplay continues behind the modal. The customer supplied linh.rwh@gmail.com as the contact email on 2026-10-12. The user selected Resend for delivery. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in Vercel; the sender must belong to a verified domain. The authenticated sender is fixed server-side and the visitor email is used only as Reply-To. Without configuration the API returns a clear unavailable state. Actual delivery to the owner still requires a configured deployment and receipt verification.

The ten project slides now use images from www.rwh-group.com: Le Chien Hakone, Aegis Hospital, Binh Minh Resort, Vietnam Trade Union Hotel (Kim Boi), Royal Golf Club (Zone 6 Yen Thang), Capital One, Ikigai Onsen Village, Lac Thuy Station, Neo Onsen and Mikazuki Resort. This is a representative selection for review. Each project has a local desktop image, a mobile image and an additional Details image; all were visually checked against the corresponding official project gallery. The images include architectural renderings. Titles, Vietnamese/English descriptions, locations and source links match those projects. Facts distinguish project year and site area from completion date and floor area. No Apollo project names, engineering data, photographer credits or unrelated Vimeo films remain in the project content.

Click DETAIL, click the project title, or pull the handle right to open the project's description, facts and additional image. Pull left, click CLOSE, click the background or press Escape to close it. Projects with no verified video hide the entire film section. If an official video is added later, films load only after clicking WATCH FILM, and closing the drawer removes the player to stop playback. OPEN FILM provides a direct player link.

The drawer opens to two thirds of the viewport width. Its panel retains a 72%-opaque #666666 tint, an 18px background blur and a soft glass gradient. Its close/drag handle uses the existing glass treatment. The gallery uses the frameless hamburger and text navigation shown in the Apollo reference.

A frameless two-line hamburger opens the reference-style dark menu on the right. Its centered text and PDF preview use two columns on desktop; the panel takes half the viewport. On mobile it fills the viewport with one column. It contains only Contact, Profile, Design Order and the pending Instagram label. Mouse hover previews it without moving focus; leaving closes the preview after 250 ms. Click, touch, keyboard activation and Escape retain their existing behavior, and autoplay continues behind it.

Keyboard: Arrow Up/Down or Page Up/Down changes project; Home returns to the first project; End opens the footer; Escape closes the menu or project drawer. Background motion and 6-second autoplay continue while the menu or DETAIL is open and while dragging the handle. An open DETAIL retains the selected project's description and film; after it closes, the handle follows the project currently on screen. Autoplay pauses while the browser tab is hidden. Reduced-motion preferences disable autoplay and motion effects.

The always-visible reference counter shows the current project out of ten, with SCROLL at the bottom for a direct footer jump. The optional fast scrubber appears when hovering the right rail or focusing it by keyboard. It supports all ten projects and the footer. Manual transitions take 900 ms with a 300 ms settling period. Wheel momentum advances one project per gesture; one fresh gesture during a transition is queued. Autoplay advances every six seconds from the first project and stops at the footer. Native footer scrolling, swipe, Arrow/Page keys, Home/End, hidden-tab pausing and reduced-motion preferences remain supported.

The progress rail fades out after 2.2 seconds without viewer activity. Pointer movement, wheel input, touch and keyboard activity reveal it again. Hovering, dragging or keyboard focus inside the rail keeps it visible. Automatic project changes do not reveal the rail and continue as before.
