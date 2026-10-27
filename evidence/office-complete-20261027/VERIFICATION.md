# Complete Office verification — 2026-10-27

- User source and layout: https://www.rwh-group.com/office.
- All parent-page sections retained: leadership, six team locations, portrait, map, founder introduction, qualification and five career milestones, design philosophy, signature, Customer Dream, Japan/Vietnam services, and both partner strips.
- Five original body media files preserved with hashes in OFFICE_MEDIA.json. Partner GIFs contain black transition frames; complete PNG panoramas reconstruct all distinct content revealed across the GIF timelines (3057×112 and 2453×135), without redrawing logos. Each row scrolls natively at desktop and mobile widths. Extraction times/crops and hashes are recorded in OFFICE_MEDIA.json.
- Main body copy, headings, page title and image descriptions switch between Vietnamese and English. Japanese duplicate prose translated; original map/logo artwork retained.
- Source qualification gives February 7 without a year; translations do not invent one.
- Full suite before final panorama correction: 56/56 passed. Final impacted Office/language suite after correction: 7/7 passed, including panorama dimensions, source/derived hashes, section order and translations.
- Local link audit: 13 public pages, zero missing targets. Shared Office footer remains identical to homepage after relative-path normalization. Repeated render is byte-identical.
- Browser desktop 1280 px and mobile 390 px: no document horizontal overflow; five images loaded. Each mobile logo scroller has a 286 px viewport over its complete source panorama.
- Browser VI/EN changes page title, headings, body and alt text. Main page prose contains no Japanese characters.
- Detector warnings concern requested inherited Roboto and documentation ramp/neutral-color advisories, plus repeated dash separators. Existing identity deliberately preserved.
- Real email delivery remains outside scope.

- Full GIF timeline audit revealed additional brands after the initial frame; final panoramas now include those later partners. OFFICE_MEDIA.json records all source times/crops.
- Final browser recapture of the partner change encountered CDP dispatch timeouts. Top/biography/content renders remain valid; final logo coverage is independently checked from complete PNG assets, CSS and scoped tests.
- To release disk space, this agent-created checkout now uses sparse checkout for unchanged project image assets. Originals remain in Git; no portfolio data/media changes are staged.
