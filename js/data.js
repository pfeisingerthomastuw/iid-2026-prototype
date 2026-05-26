/* ═══════════════════════════════════════════════════════════════
   MOCK DATA — edit here to update any screen's content
═══════════════════════════════════════════════════════════════ */
const DATA = {
  appName:  'CHEN',
  gpsLabel: 'GPS ACTIVE',

  home: {
    heatstressRisk: 75,       // percent shown in ring
    healthStatus:   'Stable', // label on health card
  },

  symptoms: [
    { label: 'Dizziness /\nNausea',   icon: '🩺' },
    { label: 'Muscle\nCramps',        icon: '💪' },
    { label: 'Confusion /\nHeadache', icon: '⚙️' },
    { label: 'Extreme\nFatigue',      icon: '🔋' },
  ],

  // Health detail sheet — shown when tapping ⓘ on the health card
  healthDetail: [
    { label: 'Heart Rate',       value: '100 BPM', guideline: '60–100 bpm', color: 'red',  ekg: true  },
    { label: 'Body Temperature', value: '36.8 °C', guideline: '35 °C – 37 °C', color: 'teal', ekg: false },
  ],

  // Bottom nav tabs — order determines display order
  navTabs: [
    { id: 'alarm',    label: 'Alarm',     alarm: true  },
    { id: 'map',      label: 'Map',       alarm: false },
    { id: 'firstaid', label: 'First Aid', alarm: false },
  ],
};
