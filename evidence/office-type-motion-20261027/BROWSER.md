# Office typography and partner motion acceptance — 2026-10-27

The incumbent Roboto family, neutral palette, shared menu and footer are retained. All Office source media and partner panoramas are unchanged.

## Browser checks

- Actual 1280px desktop and 390px mobile DOM widths inspected in the Codex in-app browser. No document horizontal overflow at 390px.
- VI/EN switch retains `<strong>` phrases and separately rendered service lines. Both selected-language states captured on mobile.
- Visible partner tracks changed transforms over consecutive observations. Both move left at 64px/s with a duplicate group, using group width including spacing as their loop distance.
- Manual pause changed the translated control to `Tiếp tục chuyển động` / `Resume animation`. Transform values remained unchanged across subsequent observations. Resume restores automatic motion.
- Emulated `prefers-reduced-motion: reduce` removed animation classes and duplicate groups, hid the pause button, restored `overflow-x:auto`, and reset transforms to `none`. Emulated media restored afterward.
- Offscreen/hidden-page, pointer/touch/focus and resize behavior is covered by meaningful motion regression tests.

## Evidence capture

Mobile screenshots are direct CUA tab captures at390px. Desktop screenshots are region captures through CUA's documented CDP capability at1280px because native screenshot bounds lagged viewport emulation. Device metrics and media overrides were cleared afterward. No screenshot was edited or composited.

## Validation

- `python3 render-projects.py`: successful,11 existing projects preserved.
- Office/content/language/motion tests:12 passed.
- Broader applicable suite:60 passed using `node --test --test-skip-pattern='desktop gallery assets' tests/*.test.cjs`.
- One unrelated original gallery byte audit cannot read images excluded from this sparse checkout. Those source images remain unchanged in Git; the Office media/hash audit passed.
- Syntax and `git diff --check`: passed.
- One detector run: existing Roboto, inherited responsive type sizes and established em-dash labels. These are intentional incumbent UI/content and are not changed by this refinement.
