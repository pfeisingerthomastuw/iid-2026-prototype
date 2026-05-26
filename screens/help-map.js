/* ─────────────────────────────────────────
   SCREEN: HELP MAP
   Red dots = people in need (DATA.peopleInNeed).
   Tap a dot → detail card with "Help Now".
   "Help Now" → fetches OSRM walking route,
   draws it, shows time + distance estimate.
───────────────────────────────────────── */
registerScreen('help-map', () => {
  const USER_COORDS = [48.1972, 16.3488];
  const ZOOM        = 14;

  const screen = el('div', 'screen');
  const mapDiv = el('div', 'map-viewport');

  // Count banner
  const critical = DATA.peopleInNeed.filter(p => p.status === 'critical').length;
  const total    = DATA.peopleInNeed.length;
  const banner   = el('div', 'help-banner');
  banner.innerHTML = `
    <div class="help-banner-count">${total}</div>
    <div class="help-banner-text">
      people need help nearby
      <div class="help-banner-sub">${critical} critical · ${total - critical} moderate</div>
    </div>`;

  // Detail card (hidden by default)
  const detailCard = el('div', 'help-detail-card');
  detailCard.style.display = 'none';

  screen.append(makeTopBar(), mapDiv, banner, detailCard, makeBottomNav('help'));

  // ── Icons ────────────────────────────────
  const userIcon = L.divIcon({
    className: '',
    html: `<div class="loc-wrap">
             <div class="loc-accuracy"></div>
             <div class="loc-pulse"></div>
             <div class="loc-dot"></div>
           </div>`,
    iconSize: [60, 60], iconAnchor: [30, 30],
  });

  function personIcon(status) {
    const p = status === 'critical' ? 'help-pulse' : 'help-pulse slow';
    const d = status === 'critical' ? 'help-dot'   : 'help-dot moderate';
    return L.divIcon({
      className: '',
      html: `<div class="help-marker-wrap"><div class="${p}"></div><div class="${d}"></div></div>`,
      iconSize: [36, 36], iconAnchor: [18, 18],
    });
  }

  // ── Helpers ──────────────────────────────
  function haversine(a, b) {
    const R    = 6371000;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLon = (b[1] - a[1]) * Math.PI / 180;
    const lat1 = a[0] * Math.PI / 180;
    const lat2 = b[0] * Math.PI / 180;
    const x    = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  }

  function fmtDist(m) {
    return m < 1000 ? `${Math.round(m)} m` : `${(m/1000).toFixed(1)} km`;
  }
  function fmtTime(sec) {
    const m = Math.round(sec / 60);
    return m < 1 ? '< 1 min' : `${m} min`;
  }

  // ── State ────────────────────────────────
  let map        = null;
  let routeLayer = null;

  function clearRoute() {
    if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; }
  }

  function hideCard() {
    detailCard.style.display = 'none';
    clearRoute();
    map.setView(USER_COORDS, ZOOM, { animate: true, duration: 0.6 });
  }

  // ── Person tapped: show info card ────────
  function showPersonCard(person) {
    clearRoute();
    const dist    = haversine(USER_COORDS, person.coords);
    const estSecs = dist / (5000 / 3600); // 5 km/h walking

    detailCard.style.display = '';
    detailCard.style.animation = 'none';
    void detailCard.offsetWidth;
    detailCard.style.animation = '';

    detailCard.innerHTML = `
      <span class="hd-pill ${person.status}">${person.status}</span>
      <div class="hd-name">${person.name}</div>
      <div class="hd-meta">
        <strong>${fmtDist(dist)}</strong> away &nbsp;·&nbsp; ~${fmtTime(estSecs)} on foot
      </div>
      <button class="btn-teal" id="helpNowBtn">Help Now →</button>
      <button class="btn-outline" id="cancelCardBtn" style="margin-top:0">Cancel</button>
    `;

    detailCard.querySelector('#helpNowBtn').addEventListener('click',   () => startRoute(person));
    detailCard.querySelector('#cancelCardBtn').addEventListener('click', hideCard);
  }

  // ── "Help Now": fetch OSRM route ─────────
  async function startRoute(person) {
    const btn = detailCard.querySelector('#helpNowBtn');
    btn.textContent = 'Finding route…';
    btn.disabled    = true;

    const [uLat, uLon] = USER_COORDS;
    const [pLat, pLon] = person.coords;
    const url = `https://router.project-osrm.org/route/v1/foot/`
      + `${uLon},${uLat};${pLon},${pLat}?overview=full&geometries=geojson`;

    let duration, distance, geojson;

    try {
      const res  = await fetch(url);
      const data = await res.json();
      const r    = data.routes[0];
      duration   = r.duration;  // seconds
      distance   = r.distance;  // metres
      geojson    = r.geometry;
    } catch (_) {
      // Offline fallback: straight line + haversine distance
      const d  = haversine(USER_COORDS, person.coords);
      duration = d / (5000 / 3600);
      distance = d;
      geojson  = {
        type: 'LineString',
        coordinates: [[uLon, uLat], [pLon, pLat]],
      };
    }

    // Draw route
    clearRoute();
    routeLayer = L.geoJSON(geojson, {
      style: {
        color:     '#00838F',
        weight:    5,
        opacity:   0.85,
        lineCap:   'round',
        lineJoin:  'round',
        dashArray: null,
      },
    }).addTo(map);

    map.fitBounds(routeLayer.getBounds(), { padding: [70, 70], animate: true, duration: 0.7 });

    // Update card to navigation view
    detailCard.innerHTML = `
      <div class="route-card-header">
        <div class="route-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#00838F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
        </div>
        <div>
          <div class="route-dest">Navigating to ${person.name}</div>
          <div class="route-stats">
            <strong>${fmtTime(duration)}</strong> &nbsp;·&nbsp; ${fmtDist(distance)} on foot
          </div>
        </div>
      </div>
      <button class="btn-outline" id="cancelNavBtn">Cancel Navigation</button>
    `;

    detailCard.querySelector('#cancelNavBtn').addEventListener('click', hideCard);
  }

  // ── Map init ─────────────────────────────
  screen._onActivate = () => {
    setTimeout(() => {
      if (!map) {
        map = L.map(mapDiv, {
          center:             USER_COORDS,
          zoom:               ZOOM,
          zoomControl:        false,
          attributionControl: false,
        });

        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          { maxZoom: 20 }
        ).addTo(map);

        // User location
        L.marker(USER_COORDS, { icon: userIcon }).addTo(map);

        // People in need
        DATA.peopleInNeed.forEach(person => {
          const marker = L.marker(person.coords, { icon: personIcon(person.status) });
          marker.on('click', () => showPersonCard(person));
          marker.addTo(map);
        });

      } else {
        map.invalidateSize();
      }
    }, 300);
  };

  return screen;
});
