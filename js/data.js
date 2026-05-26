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

  weather: {
    location:   'Vienna, AT',
    condition:  'Clear Sky',
    icon:       'sun',        // sun | cloud | rain | storm
    temp:       34,           // °C
    feelsLike:  38,           // °C
    humidity:   45,           // %
    uvIndex:    8,
    uvLabel:    'Very High',
    windSpeed:  12,           // km/h
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
    { id: 'help',     label: 'Help',      alarm: false },
    { id: 'firstaid', label: 'First Aid', alarm: false },
  ],

  // People in need shown on the help map
  peopleInNeed: [
    { coords: [48.2089, 16.3732], name: 'Max M.',   status: 'critical' },
    { coords: [48.2015, 16.3590], name: 'Anna K.',  status: 'moderate' },
    { coords: [48.1998, 16.3489], name: 'Hans B.',  status: 'critical' },
    { coords: [48.2045, 16.3620], name: 'Lisa W.',  status: 'moderate' },
    { coords: [48.1952, 16.3445], name: 'Peter S.', status: 'critical' },
    { coords: [48.2060, 16.3510], name: 'Eva R.',   status: 'moderate' },
  ],
};
