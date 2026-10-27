# Office mobile refinement

disposition: ship

The existing neutral Roboto UI, all factual copy, original media and shared menu/footer content remain intact. This change is scoped to Office CSS below 768px; generated HTML changes only its CSS cache key.

- Header spacing is compact, the rail is 44px and content insets are 20px. Language controls have 44px minimum touch height.
- Leadership and founder portrait share a grid. Below 360px the portrait stays beside the founder while the board spans the next row, preserving the visual association.
- Team locations form two columns with 44px targets. The map keeps its full image bounds.
- Prose is 16px/1.75. Services use left alignment and fine separators; chronology remains stacked and key information remains emphasized.
- Complete partner artwork and its existing pause/reduced-motion logic are preserved. Phone logo heights are 72px/86px; observed transforms changed after resume and manual pause worked.

## Verification

14 VI/EN viewport states inspected:320,390,430,767,768,844(landscape height 390),1280px. No document horizontal overflow or clipped prose/headings/team entries. See responsive-checks.json and screenshots. These are browser viewport checks, not physical-device acceptance.

12 Office/language/motion regression tests passed. Renderer preserved 11 projects. Diff check passed. One detector pass returned inherited Roboto, existing punctuation and documented responsive size advisories; the pinned identity and responsive type roles are intentional.

Desktop and tablet rules retain their prior values. The prior 390px founder section began at 1696px; after the refinement it starts near 1051px, with a wider 306px reading region and 16px prose.
