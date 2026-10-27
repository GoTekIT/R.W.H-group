# Independent reference layout and typography review

Date: 2026-10-27

Disposition: **SHIP** for the requested Office presentation refinement. No material layout, typography, content-preservation, or mobile-overflow issue found in the reviewed evidence.

## Review scope and evidence

- Supplied reference: `codex-clipboard-9693a722-cbef-4b61-8bff-58fd05169958.png` in the task's clipboard directory.
- Rendered states: `1440-en-body.png`, `1440-vi-body.png`, `390-vi-body.png`, and `services-partners.png` in this folder.
- Runtime measurements: `responsive.json`, covering Vietnamese and English at 320, 390, 1000, 1440, and 1920px.
- Source: `office.py`, `OFFICE_CONTENT.json`, `dist/office.css`, and `dist/office-page.js`.
- Existing test and mechanical evidence: `tests.txt` and `detector.json`. These were inspected, not rerun by this reviewer.

## Findings

1. **Reference fidelity and reading order:** The rendered desktop biography is a centered, bounded block rather than a full-width text field. The 900px maximum at 1440 and 1920px preserves substantial margins, matching the supplied reference's principal composition. The founder title, introduction, biography/qualification, career chronology, and philosophy remain visually ordered. Roboto and neutral ink respect the user's explicit incumbent-identity constraint.

2. **Grouping and rhythm:** The introduction now reads as one connected paragraph. Qualification and date share one paragraph and one desktop line where space permits. Career dates occupy a stable 100px column with a 24px gap and compact 8px row spacing on desktop. The larger 56px section interval clearly separates biography from philosophy without adding decorative containers. These relationships are visible in both desktop language screenshots.

3. **Typography and requested bold titles:** Founder, philosophy, Customer's Dream/Ước mơ của khách hàng, partner, biography, and country headings have a clear bold hierarchy. The CSS uses real self-hosted Roboto 700 for section/subsection headings; measured section-heading weights are 700 in every recorded language/viewport state. The rendered Customer's Dream and Partners headings are visibly bold in `services-partners.png`. The 16px/1.65 desktop prose is appropriate for the widened but bounded block and is closer to the reference's reading density than the superseded 14px full-grid treatment.

4. **Structure and content preservation:** Source rendering retains leadership, teams, portrait, map, founder introduction, qualification/date, all five dated career entries, two philosophy paragraphs, qualities, creative-work line, signature, both countries' three service items, and both complete partner panoramas. Separate language keys remain attached to the joined qualification/date spans. The inspected test receipt reports 12 passed, 0 failed, including translation-key completeness, text-preserving emphasis, full content sequence/images, and partner-motion behavior.

5. **Requested removal:** The partner heading markup contains only the title, with no visible pause/resume control or label. `responsive.json` reports `hasPause: false` in all ten states, and the services/partners screenshot confirms that the former line is absent. Partner motion still has source-level hover, keyboard-focus, touch, hidden-page, offscreen, and reduced-motion handling.

6. **Adaptation and extremes:** The 390px screenshot keeps readable 16px prose, stacks date above description, and retains useful spacing without crowding. All ten recorded VI/EN states report `overflow: false` and an empty clipped-content list, including the narrower 320px case. The existing mobile single-column services and compact leadership composition are preserved in source. DOM order for the editorial content remains the same as visual reading order; this refinement adds no focus-order changes or new overlays. Zoom was not independently exercised in this focused review, so the supplied viewport evidence is not a separate zoom-acceptance claim.

## Mechanical findings disposition

The existing detector receipt contains no layout defect. Its Roboto warnings conflict with the user's explicit requirement to preserve the incumbent font. The font-size advisories concern intentional incumbent/responsive roles described in `DESIGN.md`, and its punctuation advisory concerns preserved page copy. None warrants altering this narrowly scoped presentation change.

## Acceptance boundary

This review approves the inspected local implementation and evidence. Deployment, live runtime parity, and authenticated/shared-page behavior remain outside this independent visual review.
