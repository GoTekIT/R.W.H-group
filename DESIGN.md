---
name: R.W.H Group
description: The incumbent architecture portfolio and its scoped Office reading page.
colors:
  paper: "#fff"
  charcoal: "#292929"
  ink: "#333"
  heading-ink: "#111"
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
  office-body:
    fontFamily: "Roboto, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 2.55
    letterSpacing: ".035em"
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
  office-paragraph: "22px"
  office-inset: "7.2%"
  office-mobile-inset: "28px"
  office-mobile-columns: "48px"
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

Office is a separate `/office` extension using the user-selected Apollo MESSAGE composition. Its open bilingual reading layout is specific to that page; it does not replace the portfolio, shared menu or footer.

**Key Characteristics:**

- Photography leads the portfolio; Office leads with text and whitespace.
- Monochrome surfaces and thin functional strokes.
- Quiet uppercase navigation and a persistent right-edge menu control.
- Shared wordmark, language controls, navigation, footer and dialogs.

Built evidence: `office.py`, `dist/office.css`, `dist/rwh-menu.css`, `dist/rwh-footer.css`, `dist/styles.css`, `dist/project-gallery.css`, `dist/contact-page.css` and `dist/site-language.css`; Office screenshots in `evidence/office-20261027/`. This is an extraction of the current build, not a new identity proposal.

## Colors

The interface is neutral so project imagery carries the color.

### Primary

- **Black:** the contact submit action and the dark wordmark on the Office reading surface.
- **Heading Ink:** Office heading and active language emphasis on white.

### Neutral

- **Paper:** Office and contact reading surfaces; reversed text on dark surfaces.
- **Charcoal:** shared footer, Office rail and Office's open menu surface. Other inherited menu instances use a translucent near-black surface.
- **Ink:** Office body copy and the submit hover state.
- **Field:** flat contact input fill. Secondary copy and hairlines use the source's context-specific gray/white opacity values.

**The Image Color Rule.** Keep interface colors neutral; do not introduce a new decorative accent for Office.

## Typography

Roboto is locally supplied in light, regular and medium weights (300/400/500). Office explicitly uses the Roboto/Arial/sans-serif stack. The contact form declares Noto Sans JP/sans-serif for labels and fields; that declaration is retained rather than treated as an additional brand font.

- **Portfolio title:** the frontmatter role applies over imagery; mobile reduces it to (24px).
- **Office title:** light, uppercase and aligned with the second reading column. It becomes (24px) at tablet widths and (25px) on mobile.
- **Office body:** the frontmatter role applies on desktop, with a paragraph gap from the spacing tokens. Mobile uses (14px), line height (2.15) and tracking (.015em).
- **Menu primary:** uppercase and spaced. Secondary menu links use (14px), project sublinks (11px); mobile primary text uses `clamp(17px, 5vw, 21px)` with tracking (.025em).
- **Utility:** small language controls. Office shortcuts use (12px), line height (1.6), tracking (.08em), reducing to (10px) on mobile.
- **Footer invitation:** light (24px), line height (1.65); mobile reduces to (18px), line height (1.6).

## Layout

The landing portfolio uses full-viewport project imagery with text near the lower left. Project detail pages use large media, a compact dark identity band and a two-column overview that stacks on mobile. Do not apply Office's reading grid to these established surfaces.

Office reserves a right rail (desktop width from frontmatter; mobile width 48px). The remaining canvas uses the Office inset tokens. Desktop header begins (72px) from the top: wordmark in the left half, title on the second column axis, shortcuts at the upper right. The header's inner minimum height is (188px); body copy begins below it. Two equal `minmax(0,1fr)` columns hold Vietnamese first, English second. Each column's text is limited to `min(70ch, calc(100% - 55px))`. Both languages remain present regardless of the shared language control.

At widths (768–1000px), the header starts at (80px), shortcuts move below the title and copy reserves (30px) at each column's right edge. At widths (≤767px), the header and prose stack: wordmark, title, shortcuts, Vietnamese article, then English article. The mobile column gap uses the spacing token; header top inset is (66px), header bottom space (48px), and main bottom space (80px), versus (128px) on desktop.

The shared menu opens from the right: half the viewport on wide screens, (62%) at widths (768–1099px), full width on mobile. Its links and company-profile preview stay in two columns, including mobile. The shared footer uses a (1.15fr / 1fr) grid with a fluid gap and stacks below (768px).

## Elevation & Depth

Office, the shared menu/footer and the current full-screen contact panel are flat. Whitespace, dark/light surface changes, fine divider strokes and overlays provide hierarchy. The current contact panel explicitly removes the older modal's shadow, blur and rounded shell; do not extract those superseded declarations as its current style. Video and image viewing surfaces use dark full-screen backgrounds.

## Shapes

Reading surfaces, menu/profile imagery, form fields and the submit action have square corners. Fine horizontal rules, short dash markers and outlined chevrons supply detail. Circular video-close controls are a functional exception, not a card-radius vocabulary. The Office wordmark is black on white; shared dark surfaces retain the existing light wordmark.

## Components

- **Menu control:** two thin light strokes, transforming into a close mark. Office gives it a (44px) square target inside the rail. The rail label is vertical, centered and noninteractive. Opening the menu hides the Office title, shortcuts and rail label.
- **Shared navigation:** uppercase hierarchy, expandable project list, company-profile preview and lower utility/social links. Keep the original link/profile arrangement. Desktop links receive a thin underline on hover; focused links and the project summary receive a visible (1px) outline. Mobile menu links have minimum (44px) targets and wrap within their column.
- **Language controls:** transparent small text buttons; the selected state uses stronger text contrast, and hover/focus reveals an underline. Office uses dark text on paper and light text while the menu is open.
- **Office reading block:** two unboxed articles with independent paragraph flow. No card fill, image or shadow is added around the prose. Maintain Vietnamese/English ordering when stacking.
- **Footer:** existing wordmark, invitation/contact link, service statement and hotline; a fine top rule separates the lower social/copyright row. Social links move from opacity (.8) to (1) on hover/focus. Preserve its content hierarchy and shared markup.
- **Contact fields and submit:** the existing full-screen white contact surface uses flat gray fields and a black rectangular submit action. Inputs use a thin gray focus outline with offset (3px); touch layouts (≤1000px) raise inputs to minimum (44px) and text to (16px). Submit hover uses Ink; disabled submit uses opacity (.6) and a progress cursor.

Menu sliding uses (0.5s ease-in-out), language underlines (0.28s ease), and footer social opacity (0.2s). Existing reduced-motion rules suppress transitions/animations. Office links use an offset (1px) outline, dark on paper and white on the dark menu/footer.

## Do's and Don'ts

### Do:

- **Do** preserve the incumbent R.W.H wordmark, type, photography, menu and footer.
- **Do** scope the Apollo MESSAGE reading composition to `/office`.
- **Do** keep Vietnamese and English side by side on desktop and stacked in that order on mobile.
- **Do** retain clear keyboard focus, wrapping labels and the existing mobile touch targets.

### Don't:

- **Don't** redesign the portfolio or replace its shared navigation/footer to match the Office grid.
- **Don't** turn Office prose into cards, add a hero illustration or introduce decorative accent colors.
- **Don't** treat overridden glass-modal CSS as the current contact design.
- **Don't** use the language switch to hide either Office prose column.
