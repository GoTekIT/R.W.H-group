# Desktop Office text width

disposition: ship

The supplied screenshot asks for a long, horizontal biography/philosophy composition while keeping Vietnamese/English and the incumbent identity. The prior76ch reading cap made the1440px desktop editorial region only about513px wide. A desktop-only rule (min-width:1001px) now makes it span the full content grid:1173px at1440px and1036px at1280px.

All page copy, translated emphasis, font sizes, colors, images, menu/footer and partner behavior remain unchanged. Tablet and mobile styles remain unchanged;390px mobile still has306px prose width and16px body type.

Validation:7 content/language tests passed; renderer and diff checks passed. Browser inspected both VI/EN at390,1000,1280,1440 and1920px. No horizontal document overflow in any case. Desktop VI/EN screenshots show wide text and career descriptions aligned beside the year column. The Vietnamese content represents the supplied English/Japanese source through the existing selected-language switch. No duplicate Japanese prose is introduced.

The layout detector found no issues. This is a narrow CSS refinement; no new dependency or custom test is needed.
