/* ═══════════════════════════════════════════════════════════════
   SVG ICON LIBRARY — add new icons here as needed
   Each function takes a color string and returns an SVG string.
═══════════════════════════════════════════════════════════════ */
const ICON = {
  person: (c) => `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="${c}" stroke-width="2" stroke-linecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>`,

  personLarge: (c) => `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"
    stroke="${c}" stroke-width="2" stroke-linecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>`,

  group: (c) => `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="${c}" stroke-width="2" stroke-linecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>`,

  star: (c) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="${c}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>`,

  warning: (c) => `<svg width="28" height="28" viewBox="0 0 24 24" fill="${c}">
    <path d="M12 2 2 12l10 10 10-10L12 2zm0 3.83L18.17 12 12 18.17 5.83 12 12 5.83z"/>
    <rect x="11" y="9" width="2" height="4" fill="${c}"/>
    <rect x="11" y="15" width="2" height="2" fill="${c}"/>
  </svg>`,

  info: (c) => `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="${c}" stroke-width="2" stroke-linecap="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8"  x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>`,

  menu: (c) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="${c}" stroke-width="2" stroke-linecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>`,

  check: (c) => `<svg width="44" height="44" viewBox="0 0 24 24" fill="none"
    stroke="${c}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`,

  checkSmall: (c) => `<svg width="10" height="10" viewBox="0 0 24 24" fill="none"
    stroke="${c}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`,

  sun: () => `<svg width="52" height="52" viewBox="0 0 24 24" fill="none"
    stroke="#F59E0B" stroke-width="2" stroke-linecap="round">
    <circle cx="12" cy="12" r="4" fill="#FCD34D" stroke="#F59E0B"/>
    <line x1="12" y1="2"    x2="12" y2="4.5"/>
    <line x1="12" y1="19.5" x2="12" y2="22"/>
    <line x1="2"  y1="12"   x2="4.5" y2="12"/>
    <line x1="19.5" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="4.93" x2="6.7" y2="6.7"/>
    <line x1="17.3" y1="17.3" x2="19.07" y2="19.07"/>
    <line x1="19.07" y1="4.93" x2="17.3" y2="6.7"/>
    <line x1="6.7" y1="17.3" x2="4.93" y2="19.07"/>
  </svg>`,

  drop: (c) => `<svg width="13" height="13" viewBox="0 0 24 24"
    fill="${c}" stroke="${c}" stroke-width="1.5" stroke-linecap="round">
    <path d="M12 2C6 10 4 14 4 16a8 8 0 0 0 16 0c0-2-2-6-8-14z"/>
  </svg>`,

  wind: (c) => `<svg width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2"/>
    <path d="M12.59 19.41A2 2 0 1 0 14 16H2"/>
    <path d="M6 12h8a2 2 0 1 1-2 2"/>
  </svg>`,

  uvRay: (c) => `<svg width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2"  x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="2"  y1="12" x2="5"  y2="12"/>
    <line x1="19" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="4.93" x2="6.7" y2="6.7"/>
    <line x1="17.3" y1="17.3" x2="19.07" y2="19.07"/>
    <line x1="19.07" y1="4.93" x2="17.3" y2="6.7"/>
    <line x1="6.7" y1="17.3" x2="4.93" y2="19.07"/>
  </svg>`,

  medkit: (c) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="11" x2="12" y2="17"/>
    <line x1="9"  y1="14" x2="15" y2="14"/>
  </svg>`,

  heart: (c) => `<svg width="16" height="16" viewBox="0 0 24 24" fill="${c}" stroke="${c}" stroke-width="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`,

  thermometer: (c) => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
  </svg>`,
};
