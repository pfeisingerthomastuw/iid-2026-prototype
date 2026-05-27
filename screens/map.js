/* ─────────────────────────────────────────
   SCREEN: MAP
   Leaflet GPS view centred on Vienna.
   Mock location: Mariahilfer Str. 88, 1060 Vienna
───────────────────────────────────────── */
registerScreen('map', () => {
  const COORDS   = [48.1972, 16.3488]; // Mariahilfer Str., Vienna
  const ADDRESS  = 'Mariahilfer Str. 88';
  const SUBADDR  = 'Vienna, 1060 Austria';
  const ZOOM     = 17;

  const screen = el('div', 'screen');

  // Map container fills between topbar and bottom nav via CSS
  const mapDiv = el('div', 'map-viewport');
  mapDiv.id = 'leaflet-map';

  // Floating info card
  const infoCard = el('div', 'map-info-card');
  infoCard.innerHTML = `
    <div class="map-info-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="#4285F4" stroke-width="2.5" stroke-linecap="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>
    <div>
      <div class="map-info-address">${ADDRESS}</div>
      <div class="map-info-sub">${SUBADDR}</div>
    </div>
    <div class="map-gps-badge">GPS ●</div>
  `;

  // Re-center button
  const recenterBtn = el('div', 'map-recenter');
  recenterBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="#4285F4" stroke-width="2.5" stroke-linecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    </svg>
  `;

  screen.append(makeTopBar(), mapDiv, infoCard, recenterBtn, makeBottomNav('map'));

  // Custom GPS dot marker
  const locIcon = L.divIcon({
    className: '',
    html: `<div class="loc-wrap">
             <div class="loc-accuracy"></div>
             <div class="loc-pulse"></div>
             <div class="loc-dot"></div>
           </div>`,
    iconSize:   [60, 60],
    iconAnchor: [30, 30],
  });

  let map = null;
  let marker = null;

  screen._onActivate = () => {
    // Delay until the CSS transition finishes so Leaflet measures correctly
    setTimeout(() => {
      if (!map) {
        map = L.map(mapDiv, {
          center:             COORDS,
          zoom:               ZOOM,
          zoomControl:        false,
          attributionControl: false,
        });

        const tileLayer = L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          { maxZoom: 20 }
        ).addTo(map);

        // Fix #9 — show banner if tiles fail to load
        tileLayer.on('tileerror', () => {
          if (!screen.querySelector('.error-banner')) {
            const banner = showErrorBanner('No internet — map tiles unavailable.');
            screen.insertBefore(banner, mapDiv);
          }
        });

        marker = L.marker(COORDS, { icon: locIcon }).addTo(map);

        recenterBtn.addEventListener('click', () => {
          map.flyTo(COORDS, ZOOM, { duration: 0.8 });
        });
      } else {
        map.invalidateSize();
        map.setView(COORDS, ZOOM);
      }
    }, 300);
  };

  return screen;
});
