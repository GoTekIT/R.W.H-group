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
    fontWeight: 300
    lineHeight: 1.45
    letterSpacing: ".015em"
  office-subsection:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 300
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
  office-mobile-inset: "28px"
  office-intro-gap: "32px"
  office-editorial-section: "72px"
  office-mobile-section: "52px"
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

Built evidence: `PRODUCT.md`, `office.py`, `OFFICE_MEDIA.json`, `dist/office.css`, `dist/rwh-menu.css`, `dist/rwh-footer.css`, `dist/styles.css`, `dist/project-gallery.css`, `dist/contact-page.css` and `dist/site-language.css`. This is a source extraction of the current build; browser acceptance is recorded separately.

## Colors

The interface is neutral so project imagery and the original Office artwork carry the color.

### Primary

- **Black:** the contact submit action and the dark wordmark on the Office reading surface.
- **Heading Ink:** Office headings and active language emphasis on white.

### Neutral

- **Paper:** Office and contact reading surfaces; reversed text on dark surfaces.
- **Charcoal:** shared footer, Office rail and Office's open menu surface. Other inherited menu instances use a translucent near-black surface.
- **Ink:** Office body copy, links, selection fill, keyboard focus and submit hover.
- **Strong Copy:** Office shortcuts and inherited contact text.
- **Utility Muted:** inactive language controls on paper.
- **Caption Muted:** map caption, mobile career years and the partner scrolling hint.
- **Current Shortcut:** the current Office shortcut.
- **Marker:** short shortcut strokes and the native partner scrollbar thumb.
- **Reversed Muted:** the vertical rail label and inactive language controls while the menu is open.
- **Divider:** the fine rule above partners.
- **Field:** flat contact input fill and the native partner scrollbar track.

These are the source's existing context-specific neutral grays, not additional brand accents. A detector may count the distinct gray values as a large palette; their separate text, surface, rule and interaction roles are intentional. Colors embedded in the original map and logos belong to those preserved images.

**The Image Color Rule.** Keep interface colors neutral; do not introduce a new decorative accent for Office.

## Typography

Roboto is locally supplied in light, regular and medium weights (300/400/500). Office explicitly uses the Roboto/Arial/sans-serif stack. The contact form declares Noto Sans JP/sans-serif for labels and fields; that inherited declaration remains local to the form. The parent Office page's condensed fonts and burgundy text are not adopted.

- **Portfolio title:** the frontmatter role applies over imagery; mobile reduces it to (24px).
- **Office title:** light uppercase text in the header's second grid column. It becomes (24px) at tablet widths and (25px) on mobile.
- **Office company:** the R.W.H display heading uses the company role, with Group on a separate line using the suffix role. Mobile reduces R.W.H to (34px), while Group remains (25px).
- **Office section:** biography, philosophy, Customer Dream and partner headings use the section role; mobile reduces them to (23px).
- **Office subsection:** leadership roles and Japan/Vietnam service titles use the subsection role. The team link also uses (18px), weight (300) and line height (1.5).
- **Office body:** biography, career chronology, philosophy and service copy use the body role on desktop and mobile. Leadership text and founder links use line height (1.8). Values and service-company names use weight (500).
- **Office caption:** map attribution uses the caption role. The partner hint uses (12px) with the body line height on desktop and mobile. The rail label uses (13px), weight (300), line height (1) and tracking (.08em), reducing to (11px) on mobile.
- **Office shortcut:** uppercase utility navigation uses the shortcut role; tablet uses (11px), mobile (10px) and tracking (.05em).
- **Menu primary:** uppercase and spaced. Secondary menu links use (14px), project sublinks (11px); mobile primary text uses `clamp(17px, 5vw, 21px)` with tracking (.025em).
- **Utility:** small language controls use the utility role.
- **Footer invitation:** light (24px), line height (1.65); mobile reduces to (18px), line height (1.6).

The implemented type ramp has multiple purpose-specific and responsive sizes. Font-size-count advisories should be assessed against these roles, not resolved by flattening the hierarchy or replacing the incumbent font. The main prose remains a consistent (14px); the earlier short-statement (13px), line height (2.55) treatment is superseded.

**The Incumbent Type Rule.** Apply the current R.W.H Roboto hierarchy to Office prose; preserve lettering that is already part of original image artwork.

## Layout

The landing portfolio uses full-viewport project imagery with text near the lower left. Project detail pages use large media, a compact dark identity band and a two-column overview that stacks on mobile. These established surfaces retain their own composition.

Office reserves a right rail (desktop width from frontmatter; mobile width 48px). The remaining canvas uses the Office inset tokens. Desktop header begins (72px) from the top: wordmark in the left half, title in the second column, shortcuts at the upper right. Its current inner minimum height is (154px), overriding the earlier header declaration.

The introduction uses three columns in the ratio (.9fr / 1fr / 1.35fr), with the intro gap token: leadership and teams, the original founder portrait, then the original office map. The portrait starts (84px) below its column top. A centered editorial region follows at width (76%), maximum (900px), with top margin (110px). It holds the biography and dated career rows, philosophy and signature, then the centered Customer Dream heading. Career rows use (105px / remaining width) columns and a (16px) gap. The signature is right aligned at width (180px), maximum (45%). Japan and Vietnam services sit in equal columns with a (48px) gap; service paragraphs are limited to (33ch).

The two partner-logo rows follow below a fine rule, with top margin (88px), padding (48px) and row gap (28px). Each row independently provides native horizontal scrolling on desktop and mobile, constrained to the available content width. The complete static panoramas render at native size (3057 × 112px) and (2453 × 135px); image width is automatic, maximum image width is unrestricted, and heights remain (112px) and (135px). Each row has (12px) bottom padding and its own native scrollbar. The scrolling hint stays visible at all widths.

At widths (768–1000px), the header starts at (80px), shortcuts move below the title, introduction uses two columns (1fr / 1.1fr), and the map spans a new row at width `min(76%, 540px)`. Editorial width becomes (90%) with top margin (80px), and service gap becomes (28px).

At widths (≤767px), header and main content stack. The header uses a (66px) top inset, (30px) grid gap and (48px) bottom space. Main horizontal inset is (28px), bottom space (80px), versus (128px) on desktop. Leadership, portrait and map stack with a (36px) gap; portrait width is `min(100%, 320px)`. Editorial width becomes (100%) with top margin (64px), section gap (52px), and career rows stack. Signature width becomes (150px), maximum (60%). Services become one column with a (36px) gap. Partner rows retain independent horizontal scrolling and native panorama heights, with no fixed minimum row width; their gap becomes (20px). The visible hint explains swiping through the complete logo content.

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
- **Office editorial content:** unboxed sections with a consistent body role, spacious section breaks, a dated definition-list chronology and a right-aligned signature. Japan/Vietnam columns distinguish service locations within the selected language.
- **Office source media:** `OFFICE_MEDIA.json` retains five original images: founder portrait, office map, founder signature and two partner GIFs. The portrait, map and signature display their originals. Partner GIF timelines contain brands beyond any initial single frame. Their displayed static PNG panoramas reconstruct all distinct scrolling content losslessly from overlapping frames using `ffmpeg crop+hstack`: `partners-01-complete.png` (3057 × 112px), sampled at (5, 10, 15, 20, 26s), and `partners-02-complete.png` (2453 × 135px), sampled at (5, 10, 15, 20s). Metadata records sampling times, appended right-edge crop widths and source/display hashes; original GIFs remain intact. Remove duplicate overlap while preserving every logo and embedded lettering, without recoloring or rescaling.
- **Partner scrolling rows:** each complete static panorama has its own native horizontal scrolling region on desktop and mobile. Each row is keyboard focusable with a (1px) Ink outline and offset (6px). A visible hint accompanies both rows. The logo content stays at native height without marquee animation or black GIF transitions.
- **Footer:** existing wordmark, invitation/contact link, service statement and hotline; a fine top rule separates the lower social/copyright row. Social links move from opacity (.8) to (1) on hover/focus. Preserve its content hierarchy and shared markup.
- **Contact fields and submit:** the existing full-screen white contact surface uses flat gray fields and a black rectangular submit action. Inputs use a thin gray focus outline with offset (3px); touch layouts (≤1000px) raise inputs to minimum (44px) and text to (16px). Submit hover uses Ink; disabled submit uses opacity (.6) and a progress cursor.

Menu sliding uses (0.5s ease-in-out), language underlines (0.28s ease), and footer social opacity (0.2s). Existing reduced-motion rules suppress transitions/animations. Office links use a (1px) outline with offset (4px), dark on paper and white on the dark menu/footer.

## Do's and Don'ts

### Do:

- **Do** preserve the incumbent R.W.H wordmark, Roboto hierarchy, neutral palette, photography, menu and footer.
- **Do** retain the full Office content sequence and its original portrait, map, signature and partner artwork.
- **Do** switch the complete page prose between Vietnamese and English with the shared language control.
- **Do** keep partner panoramas complete, static and at native height, with independent horizontal scrolling for each row on desktop and mobile.
- **Do** retain clear keyboard focus, wrapping labels and the existing mobile touch targets.

### Don't:

- **Don't** redesign the portfolio or replace its shared navigation/footer to match the Office composition.
- **Don't** restore the superseded short Apollo-style statement or simultaneous Vietnamese/English prose columns.
- **Don't** adopt the parent page's burgundy palette or condensed type for the current interface.
- **Don't** turn Office prose into cards, crop partner logos or recolor original image artwork.
- **Don't** treat overridden glass-modal CSS as the current contact design.
