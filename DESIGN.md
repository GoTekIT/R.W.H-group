---
name: R.W.H Group
description: The incumbent architecture portfolio and its complete Office content page.
colors:
  paper: "#fff"
  charcoal: "#292929"
  ink: "#333"
  heading-ink: "#111"
  strong-copy: "#222"
  utility-muted: "#555"
  caption-muted: "#666"
  current-shortcut: "#757575"
  marker: "#888"
  reversed-muted: "#ccc"
  divider: "#ddd"
  black: "#000"
  field: "#f0f0f0"
typography:
  portfolio-title:
    fontFamily: "Roboto, sans-serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "2px"
  office-title:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 300
    lineHeight: 1.45
    letterSpacing: ".015em"
  office-company:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: "38px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: ".035em"
  office-company-suffix:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: "25px"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: ".035em"
  office-section:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: ".015em"
  office-subsection:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: ".015em"
  office-body:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.95
    letterSpacing: ".015em"
  office-caption:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.7
  office-shortcut:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: ".08em"
  menu-primary:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "2.4px"
  utility:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: ".04em"
rounded:
  square: "0"
spacing:
  office-paragraph: "16px"
  office-inset: "7.2%"
  office-mobile-inset: "20px"
  office-intro-gap: "32px"
  office-editorial-section: "72px"
  office-mobile-section: "44px"
components:
  contact-submit:
    backgroundColor: "{colors.black}"
    textColor: "{colors.paper}"
    rounded: "{rounded.square}"
    padding: "19px 10px 21px"
    width: "361px"
  contact-submit-hover:
    backgroundColor: "{colors.ink}"
  contact-input:
    backgroundColor: "{colors.field}"
    rounded: "{rounded.square}"
    padding: "4px 8px 5px"
    height: "30px"
  office-rail:
    backgroundColor: "{colors.charcoal}"
    width: "70px"
    height: "100dvh"
---

# Design System: R.W.H Group

## Overview

**Creative North Star: "The R.W.H Portfolio"**

This documents the built R.W.H identity: large architectural photography, the existing wordmark, restrained sans-serif text, white reading surfaces and charcoal navigation/footer surfaces. Its hierarchy comes from image scale, whitespace and light typography. Preserve that incumbent world when adding screens.

Office is a separate `/office` extension presenting the complete parent R.W.H Office content and image relationships within the current R.W.H shell. Leadership, teams, the founder portrait and map lead into biography, philosophy, signature, Customer Dream, Japan/Vietnam services and two partner-logo strips. Vietnamese and English are whole-page language states. The parent page supplies content and original artwork; the incumbent Roboto typography, neutral palette, shared menu and footer remain the visual authority.

**Key Characteristics:**

- Photography leads the portfolio; Office combines complete source content, original imagery and open editorial spacing.
- Neutral surfaces and thin functional strokes.
- Quiet uppercase navigation and a persistent right-edge menu control.
- Shared wordmark, language controls, navigation, footer and dialogs.

Built evidence: `PRODUCT.md`, `office.py`, `OFFICE_MEDIA.json`, `dist/office.css`, `dist/office-page.js`, `dist/rwh-menu.css`, `dist/rwh-footer.css`, `dist/styles.css`, `dist/project-gallery.css`, `dist/contact-page.css` and `dist/site-language.css`. Office typography and partner motion were inspected at actual desktop (1280px) and mobile (390px) DOM widths; screenshots are in `evidence/office-type-motion-20261027/*.png`, with runtime observations and acceptance limits in `evidence/office-type-motion-20261027/BROWSER.md`. The finish review in that folder records a ship disposition with no material fixes.

## Colors

The interface is neutral so project imagery and the original Office artwork carry the color.

### Primary

- **Black:** the contact submit action and the dark wordmark on the Office reading surface.
- **Heading Ink:** Office headings, career years and active language emphasis on white.

### Neutral

- **Paper:** Office and contact reading surfaces; reversed text on dark surfaces.
- **Charcoal:** shared footer, Office rail and Office's open menu surface. Other inherited menu instances use a translucent near-black surface.
- **Ink:** Office body copy, links, selection fill, keyboard focus and submit hover.
- **Strong Copy:** Office shortcuts and inherited contact text.
- **Utility Muted:** inactive language controls on paper.
- **Caption Muted:** map caption.
- **Current Shortcut:** the current Office shortcut.
- **Marker:** short shortcut strokes and the static-fallback scrollbar thumb.
- **Reversed Muted:** the vertical rail label and inactive language controls while the menu is open.
- **Divider:** the fine rule above partners.
- **Field:** flat contact input fill and the static-fallback partner scrollbar track.

These are the source's existing context-specific neutral grays, not additional brand accents. A detector may count the distinct gray values as a large palette; their separate text, surface, rule and interaction roles are intentional. Colors embedded in the original map and logos belong to those preserved images.

**The Image Color Rule.** Keep interface colors neutral; do not introduce a new decorative accent for Office.

## Typography

Roboto is locally supplied in light, regular, medium and bold weights (300/400/500/700). The Office-only 700 weight uses self-hosted Latin/Vietnamese Google Fonts subsets, licensed in `dist/assets/roboto-OFL.txt`. Office explicitly uses the Roboto/Arial/sans-serif stack. The contact form declares Noto Sans JP/sans-serif for labels and fields; that inherited declaration remains local to the form. The parent Office page's condensed fonts and burgundy text are not adopted.

- **Portfolio title:** the frontmatter role applies over imagery; mobile reduces it to (24px).
- **Office title:** light uppercase text in the header's second grid column. It becomes (24px) at tablet widths and (24px) on mobile.
- **Office company:** the R.W.H display heading uses the company role, with Group on a separate line using the suffix role. Mobile displays R.W.H (28px) and Group (18px) on one baseline.
- **Office section:** biography, philosophy, Customer Dream and partner headings use the bold (700) section role; mobile reduces them to (23px). Section headings balance their line wrapping.
- **Office subsection:** leadership roles, biography labels and Japan/Vietnam service titles use the bold (700) subsection role with balanced wrapping. The team link separately retains (18px), weight (300) and line height (1.5).
- **Office body:** biography, career chronology, philosophy and service copy use 16px/1.65 on desktop and 16px/1.75 on mobile; tablet retains the 14px body role. Leadership names use weight (500) and line height (1.8). Values, service-company names, career years and inline strong phrases use weight (500); strong phrases identify people, qualifications and philosophy without bolding entire paragraphs. Editorial paragraphs use pretty wrapping; introductory personal names and emphasized service-company names stay together, with the founder link also kept together on mobile where practical.
- **Office caption:** map attribution uses the caption role. The rail label uses (13px), weight (300), line height (1) and tracking (.08em), reducing to (11px) on mobile.
- **Office shortcut:** uppercase utility navigation uses the shortcut role; tablet uses (11px), mobile (10px) and tracking (.05em).
- **Menu primary:** uppercase and spaced. Secondary menu links use (14px), project sublinks (11px); mobile primary text uses `clamp(17px, 5vw, 21px)` with tracking (.025em).
- **Utility:** small language controls use the utility role.
- **Footer invitation:** light (24px), line height (1.65); mobile reduces to (18px), line height (1.6).

The implemented type ramp has multiple purpose-specific and responsive sizes. Font-size-count advisories should be assessed against these roles, not resolved by flattening the hierarchy or replacing the incumbent font. The main prose is (16px) on desktop/mobile and (14px) on tablet; the earlier short-statement (13px), line height (2.55) treatment is superseded.

**The Incumbent Type Rule.** Apply the current R.W.H Roboto hierarchy to Office prose; preserve lettering that is already part of original image artwork.

## Layout

The landing portfolio uses full-viewport project imagery with text near the lower left. Project detail pages use large media, a compact dark identity band and a two-column overview that stacks on mobile. These established surfaces retain their own composition.

Office reserves a right rail (desktop width from frontmatter; mobile width 44px). The remaining canvas uses the Office inset tokens. Desktop header begins (72px) from the top: wordmark in the left half, title in the second column, shortcuts at the upper right. Its current inner minimum height is (154px), overriding the earlier header declaration.

The introduction uses three columns in the ratio (.9fr / 1fr / 1.35fr), with the intro gap token: leadership and teams, the original founder portrait, then the original office map. The portrait starts (84px) below its column top. On desktop (≥1001px), the editorial region is centered at 100% width with a 900px maximum and a 110px top margin. This follows the latest supplied reference with substantial side margins, 16px prose, and bold headings; it supersedes the earlier full-grid stretch. Tablet retains its centered 76ch reading cap and mobile retains its phone layout. It holds the biography and dated career rows, philosophy and signature, then the centered Customer Dream heading. The full introduction and mission share one paragraph; qualification and its date share one paragraph with separately translated spans. Career rows use (100px / remaining width) columns, a (24px) gap and (8px) bottom spacing on desktop; the last row has no bottom margin. Editorial sections are separated by (56px) on desktop. The signature is right aligned at width (180px), maximum (45%). Japan and Vietnam services sit in equal columns with a (48px) gap. Each article uses three grid rows (`auto 1fr auto`) to align its title, company name and service list across the two columns. Company text has a maximum width of (34ch) and (20px) bottom spacing; each service occupies its own list item with a (4px) list gap.

The two partner-logo rows follow below a fine rule, with top margin (88px), top padding (48px) and row gap (28px). Each row contains one complete existing panorama followed by an identical, accessibly hidden copy. The track moves left through the measured width of one complete group, including its trailing space (64px), so the duplicate starts seamlessly. Desktop image heights are (112px) and (135px), with automatic widths and unrestricted maximum widths. Animated rows clip overflow, remove the fallback bottom padding and use a short edge fade (18px). No visible pause/resume action is rendered, as explicitly requested.

At widths (768–1000px), the header starts at (80px), shortcuts move below the title, introduction uses two columns (1fr / 1.1fr), and the map spans a new row at width `min(76%, 540px)`. Editorial width becomes (90%) with top margin (80px); the later service refinement keeps its column gap at (48px).

At widths (≤767px), Office uses a 44px rail and 20px horizontal insets. The header begins at 24px, uses an 18px grid gap and 28px bottom space; the wordmark is 128px wide and the title 24px. Language buttons are 40px wide with 44px minimum height. The introduction is a two-column grid (1.15fr/.85fr): company name across the top, founder and board at left, portrait at right, then a two-column team list and a full-width map. Each team entry has a 44px minimum height. The portrait retains its full bounds, capped at 180px; the map is capped at 460px. Below 360px the portrait stays beside the founder in an 88px column and the board spans the next row, keeping the image associated with the founder. Compact leadership roles use 15px (14px below 360px), names 14px (founder link 13px below 360px), while prose and services use 16px/1.75. Editorial top margin is 40px, section gap 44px; career rows stack with 4px internal gap and 20px bottom spacing. Signature width is 140px, capped at 50%. Service groups become left aligned, separated by fine rules, with 28px between articles and 12px below company text. Partners follow after 44px with 28px top padding; logo heights are 72px/86px, trailing group space 32px and row gap 16px. Main bottom space is 72px. All factual copy, image bounds, menu/footer content and marquee controls are retained.

The VI/EN control switches the entire page's prose, headings, metadata and accessible image text. It does not create parallel prose columns. Original wording embedded in map, signature and partner artwork remains intact.

The shared menu opens from the right: half the viewport on wide screens, (62%) at widths (768–1099px), full width on mobile. Its links and company-profile preview stay in two columns, including mobile. The shared footer uses a (1.15fr / 1fr) grid with a fluid gap and stacks below (768px).

## Elevation & Depth

Office, the shared menu/footer and the current full-screen contact panel are flat. Whitespace, dark/light surface changes, fine divider strokes and overlays provide hierarchy. The current contact panel explicitly removes the older modal's shadow, blur and rounded shell; do not extract those superseded declarations as its current style. Video and image viewing surfaces use dark full-screen backgrounds.

## Shapes

Reading surfaces, menu/profile imagery, form fields and the submit action have square corners. Fine horizontal rules, short dash markers and outlined chevrons supply detail. Circular video-close controls are a functional exception, not a card-radius vocabulary. The Office wordmark is black on white; shared dark surfaces retain the existing light wordmark. Original Office media keep their full bounds and aspect ratios.

## Components

- **Menu control:** two thin light strokes, transforming into a close mark. Office gives it a (44px) square target inside the rail. The rail label is vertical, centered and noninteractive. Opening the menu hides the Office title, shortcuts and rail label.
- **Shared navigation:** uppercase hierarchy, expandable project list, company-profile preview and lower utility/social links. Keep the original link/profile arrangement. Desktop links receive a thin underline on hover; focused links and the project summary receive a visible (1px) outline. Mobile menu links have minimum (44px) targets and wrap within their column.
- **Language controls:** transparent small text buttons; the selected state uses stronger text contrast, and hover/focus reveals an underline. Office uses dark text on paper and light text while the menu is open. Changing VI/EN replaces the active whole-page text state.
- **Office editorial content:** unboxed sections with a consistent body role, bold section headings and subheadings and selective strong phrases. Meaningful introduction and qualification/date paragraphs precede the dated definition-list chronology. Years remain medium-weight Heading Ink on mobile as well as desktop. Japan/Vietnam service articles use aligned three-row grids and semantic lists, with one service per list item, within the selected language. The signature remains right aligned.
- **Office source media:** `OFFICE_MEDIA.json` retains five original images: founder portrait, office map, founder signature and two partner GIFs. The portrait, map and signature display their originals. Partner GIF timelines contain brands beyond any initial single frame. Their displayed static PNG panoramas reconstruct all distinct scrolling content losslessly from overlapping frames using `ffmpeg crop+hstack`: `partners-01-complete.png` (3057 × 112px), sampled at (5, 10, 15, 20, 26s), and `partners-02-complete.png` (2453 × 135px), sampled at (5, 10, 15, 20s). Metadata records sampling times, appended right-edge crop widths and source/display hashes; original GIFs remain intact. Remove duplicate overlap while preserving every logo and embedded lettering, without recoloring or rescaling.
- **Partner motion rows:** the two complete existing panorama sequences run as independent seamless leftward loops through the Web Animations API at (64px/s), using linear easing and infinite iterations. Loop duration is the measured complete group width divided by that speed, and resize preserves progress. Each row is a keyboard-focusable region with a (1px) Ink outline and offset (6px); duplicate images have empty alternative text and their duplicate group is hidden from assistive technology. Motion pauses while the row is offscreen, the document is hidden, or its row has mouse hover, keyboard focus or touch contact. The user removed the visible pause/resume line; automatic loops continue without that control. With reduced motion or no animation API, both complete rows remain static and independently horizontally scrollable, duplicate groups stay hidden, and native scrollbars with (12px) bottom padding are available. Reduced-motion changes are handled live.
- **Footer:** existing wordmark, invitation/contact link, service statement and hotline; a fine top rule separates the lower social/copyright row. Social links move from opacity (.8) to (1) on hover/focus. Preserve its content hierarchy and shared markup.
- **Contact fields and submit:** the existing full-screen white contact surface uses flat gray fields and a black rectangular submit action. Inputs use a thin gray focus outline with offset (3px); touch layouts (≤1000px) raise inputs to minimum (44px) and text to (16px). Submit hover uses Ink; disabled submit uses opacity (.6) and a progress cursor.

Menu sliding uses (0.5s ease-in-out), language underlines (0.28s ease), and footer social opacity (0.2s). Existing reduced-motion rules suppress transitions/animations; partner motion specifically falls back to the complete static scrolling rows described above. Office links use a (1px) outline with offset (4px), dark on paper and white on the dark menu/footer.

## Do's and Don'ts

### Do:

- **Do** preserve the incumbent R.W.H wordmark, Roboto hierarchy, neutral palette, photography, menu and footer.
- **Do** retain the full Office content sequence and its original portrait, map, signature and partner artwork.
- **Do** switch the complete page prose between Vietnamese and English with the shared language control.
- **Do** keep both partner panoramas complete, loop them left seamlessly without a visible pause/resume line, and provide complete static horizontal rows for reduced motion or an unavailable animation API.
- **Do** retain clear keyboard focus, wrapping labels and the existing mobile touch targets.

### Don't:

- **Don't** redesign the portfolio or replace its shared navigation/footer to match the Office composition.
- **Don't** restore the superseded short Apollo-style statement or simultaneous Vietnamese/English prose columns.
- **Don't** adopt the parent page's burgundy palette or condensed type for the current interface.
- **Don't** turn Office prose into cards, crop partner logos or recolor original image artwork.
- **Don't** treat overridden glass-modal CSS as the current contact design.
