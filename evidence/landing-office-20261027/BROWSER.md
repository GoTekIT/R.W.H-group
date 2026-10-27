# One-page Office/project/Contact flow acceptance

## Requested behavior and latest clarification

Office opens like project details inside the landing, keeping its URL. Contact opens above Office, project details or the landing, returning to its prior context. The visible return arrow is limited to Office/Contact; project details and image viewing retain X.

## Native browser checks

The preview at `http://127.0.0.1:4188/index.html?project=4` used the current modified files. To preserve the sparse checkout, the preview serves omitted, unchanged project photos read-only from Git; no source media was changed.

- Office opens in `#project-panel` with the landing URL unchanged. Its control is an arrow with label `Quay lại`; the X icon is hidden.
- Office → Contact → browser Back closes only Contact. A second Back closes Office and preserves landing `project-4` and the original URL.
- Project details display X with label `Đóng chi tiết dự án`; its back-arrow icon is hidden.
- Project → Contact → browser Back leaves the project open. A second Back closes the project and preserves landing `project-4` and URL.
- Contact's UI arrow closes only Contact. In the project check, the underlying footer top remained exactly 465.21875px before/after return.
- Root Contact from the landing menu opens without a content panel. Back closes Contact and returns to `project-4` at the same URL.
- Contact contains one return action and no menu control. Nested Contact hides the outer content close control, then restores Office arrow/project X on close.
- No live form submission was made. Form API and delivery handling are unchanged; closing a dialog does not reset its form.

Actual parent/frame geometry was inspected at 390px and 1280px. Native screenshots are 596px-wide viewport captures after resetting temporary emulation; emulated screenshots with incorrect native capture mapping were discarded. These are browser checks, not physical-device acceptance. Reduced motion was emulated while testing so timed landing autoplay would not obscure return-position assertions; ordinary autoplay pause/resume is covered by deterministic tests.

## Validation

- 74 applicable tests passed, including nested history, UI-close history cleanup, queued layer opening, first-load iframe history replacement, Office content loading, project X/Office arrow labels, local Contact anchors, trusted-frame navigation and Contact autoplay pause/resume.
- The unchanged original gallery byte audit is excluded from this sparse checkout. Office asset hashes passed; original media remains unchanged in Git.
- Renderer is idempotent for landing, Office and project outputs; syntax and diff checks passed.
- One detector pass covers modified controls/panel code. Existing neutral colors, inherited responsive font roles and the incumbent font family are intentional.

A browser test exposed that assigning iframe.src on first open could leave an extra blank Back step. All real iframe navigation, including first load and cleanup, now uses location.replace; a regression test and fresh native browser replay confirm top-layer Back behavior.
