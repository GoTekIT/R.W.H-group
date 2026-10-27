# Mobile Office reference correction

Compared the live mother Office DOM at 390px and the supplied screenshot. Restored mobile single-column leadership → portrait → map order. Centered signature, Customer’s Dream and Japan/Viet Nam service blocks; removed custom dividers and stacked service items. Kept existing R.W.H typography/colors and VI/EN switch. Restored source English biography/philosophy wording, with Vietnamese translation and no added facts.

Browser checked at 390px and 320px: document scroll width equals viewport width. VI and EN switch works; centered sections visually checked in mobile.png. 74 tests passed (large unchanged sparse gallery asset audit excluded). Existing single-page Office/contact navigation was already shipped in PR23; all 10 production runtime files matched that commit before this change.
