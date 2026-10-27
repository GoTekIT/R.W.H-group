# Office verification — 2026-10-27

- Base: GitHub main 7e7a11783915e11bdb133ade32a0a23315aa4177.
- New standalone /office page; no twelfth project slide.
- Full existing suite: 53/53 passed. Final language/SEO/original-media subset: 6/6 passed.
- All 13 public pages have valid local src/href targets and the local Office menu destination.
- Office navigation and footer match the homepage shared markup after relative-path normalization and current-page marking.
- Repeated rendering preserved every generated HTML page and sitemap.
- Detector findings: none.
- Browser: 1280 px desktop has two columns starting at x=87 and x=605, y=260; white main background; scrollWidth=1280.
- Browser: 390 px mobile has one 286 px column; scrollWidth=390. Full content and footer captured.
- Browser: VI/EN updates heading, chrome and description; Contact opens; menu opens and Escape restores it; direct project menu navigates to /office/ in the same tab.
- Independent visual finish review: PASS; see REVIEW.md.
- Real email sending was not exercised.
