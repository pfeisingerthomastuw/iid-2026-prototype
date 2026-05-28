/* ─────────────────────────────────────────
   SCREEN: RESPONDER NAVIGATION (Task 2, step 3)
   Leaflet map with route from user to victim.
   Floating top card, coordination strip,
   "I've arrived" button.
───────────────────────────────────────── */
registerScreen('responder-nav', () => {
  const USER_COORDS = [48.1972, 16.3488];

  const screen = el('div', 'screen');
  const mapDiv = el('div', 'map-viewport');

  // ── Top info card ─────────────────────────
  const topCard = el('div', 'rnav-top-card');

  // ── Coordination strip ────────────────────
  const coordStrip = el('div', 'rnav-coord-strip');
  coordStrip.addEventListener('click', showCoordinationSheet);

  // ── Arrived button ────────────────────────
  const arrivedBtn = el('button', 'rnav-arrived-btn');
  arrivedBtn.textContent = "I've arrived ✓";
  arrivedBtn.addEventListener('click', () => {
    const alreadyOnSite = DATA.incident.responders.find(r => r.status === 'arrived');
    if (alreadyOnSite) {
      const target = DATA.incident.victimConscious ? 'support-conscious' : 'support-unconscious';
      showToast(
        `${alreadyOnSite.name} is already with the patient`,
        'Assessment skipped — joining support'
      );
      goTo(target);
    } else {
      goTo('on-site');
    }
  });

  screen.append(makeTopBar(), mapDiv, topCard, coordStrip, arrivedBtn, makeBottomNav('help'));

  // ── Helpers ───────────────────────────────
  function haversine(a, b) {
    const R = 6371000, d2r = Math.PI / 180;
    const dLat = (b[0]-a[0]) * d2r, dLon = (b[1]-a[1]) * d2r;
    const x = Math.sin(dLat/2)**2
            + Math.cos(a[0]*d2r) * Math.cos(b[0]*d2r) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  }
  function fmtDist(m) { return m < 1000 ? `${Math.round(m)} m` : `${(m/1000).toFixed(1)} km`; }
  function fmtTime(s) { const m = Math.round(s/60); return m < 1 ? '< 1 min' : `${m} min`; }

  // ── Map icons ─────────────────────────────
  const userIcon = L.divIcon({
    className: '',
    html: `<div class="loc-wrap">
             <div class="loc-accuracy"></div>
             <div class="loc-pulse"></div>
             <div class="loc-dot"></div>
           </div>`,
    iconSize: [60, 60], iconAnchor: [30, 30],
  });
  const victimIcon = L.divIcon({
    className: '',
    html: `<div class="help-marker-wrap">
             <div class="help-pulse"></div>
             <div class="help-dot"></div>
           </div>`,
    iconSize: [36, 36], iconAnchor: [18, 18],
  });

  // ── Map state ─────────────────────────────
  let map = null;
  let lastVictimCoords = null;

  // ── UI refresh ────────────────────────────
  function refreshUI() {
    const v = DATA.incident;
    const isCrit = v.victim.status === 'critical';

    topCard.innerHTML = `
      <div class="rnav-top-row">
        <div class="rnav-status-dot"></div>
        <div class="rnav-name">Navigating to ${v.victim.name}</div>
        <span class="hd-pill ${isCrit ? 'critical' : 'warning'}">${v.victim.status}</span>
      </div>
      <div class="rnav-stats">
        <div class="rnav-stat"><strong id="rnavEta">Calculating…</strong> ETA</div>
        <div class="rnav-stat"><strong id="rnavDist">—</strong> on foot</div>
      </div>
    `;

    const avatarColors = ['teal', 'red'];
    const avatarHTML = v.responders.map((r, i) =>
      `<div class="rnav-avatar ${avatarColors[i] ?? 'red'}">${r.initials}</div>`
    ).join('');
    const coordText = v.responders.length === 0
      ? 'You are the only responder'
      : `${v.responders.length} other${v.responders.length > 1 ? 's' : ''} also responding`;
    coordStrip.innerHTML = `
      <div class="rnav-coord-avatars">${avatarHTML}</div>
      <div class="rnav-coord-text">${coordText}</div>
      <div class="rnav-coord-arrow">›</div>
    `;
  }

  // ── Map init ──────────────────────────────
  screen._onActivate = () => {
    refreshUI();

    const victimCoords = DATA.incident.victim.coords;

    // Destroy and recreate map if the victim changed
    if (map && lastVictimCoords &&
        (lastVictimCoords[0] !== victimCoords[0] || lastVictimCoords[1] !== victimCoords[1])) {
      map.remove();
      map = null;
    }
    lastVictimCoords = victimCoords;

    setTimeout(async () => {
      if (!map) {
        map = L.map(mapDiv, {
          center: USER_COORDS, zoom: 15,
          zoomControl: false, attributionControl: false,
        });
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          { maxZoom: 20 }
        ).addTo(map);

        L.marker(USER_COORDS,   { icon: userIcon   }).addTo(map);
        L.marker(victimCoords,  { icon: victimIcon }).addTo(map);

        // Fetch OSRM walking route
        const [uLat, uLon] = USER_COORDS;
        const [pLat, pLon] = victimCoords;
        const url = `https://router.project-osrm.org/route/v1/foot/`
          + `${uLon},${uLat};${pLon},${pLat}?overview=full&geometries=geojson`;

        let duration, distance, geojson;
        try {
          const data = await (await fetch(url)).json();
          ({ duration, distance } = data.routes[0]);
          geojson = data.routes[0].geometry;
        } catch (_) {
          const d = haversine(USER_COORDS, victimCoords);
          duration = d / (5000 / 3600); distance = d;
          geojson  = { type: 'LineString', coordinates: [[uLon, uLat], [pLon, pLat]] };
          const banner = showErrorBanner('No internet — showing direct path. Follow local signage.');
          screen.insertBefore(banner, mapDiv.nextSibling);
        }

        L.geoJSON(geojson, {
          style: { color: '#D32F2F', weight: 5, opacity: 0.9, lineCap: 'round', lineJoin: 'round' },
        }).addTo(map);

        map.fitBounds(
          L.geoJSON(geojson).getBounds(),
          { padding: [110, 50], animate: true, duration: 0.7 }
        );

        topCard.querySelector('#rnavEta').textContent  = fmtTime(duration);
        topCard.querySelector('#rnavDist').textContent = fmtDist(distance);

      } else {
        map.invalidateSize();
      }
    }, 300);
  };

  // ── Coordination bottom sheet ─────────────
  function showCoordinationSheet() {
    const backdrop = el('div', 'health-backdrop');
    const sheet    = el('div', 'health-sheet');
    const handle   = el('div', 'sheet-handle');

    const title = el('div', 'rd-section-title');
    title.style.cssText = 'padding: 0 16px 12px; display:block;';
    title.textContent = 'Responding now';

    sheet.append(handle, title);

    DATA.incident.responders.forEach((r, i) => {
      const item        = el('div', 'coord-sheet-item');
      const avatarColor = i === 0 ? 'teal' : 'grey';
      const statusClass = r.status === 'arrived' ? 'arrived' : 'en-route';
      const statusLabel = r.status === 'arrived' ? 'Arrived'  : 'En Route';
      item.innerHTML = `
        <div class="coord-avatar-large ${avatarColor}">${r.initials}</div>
        <div>
          <div class="coord-name">${r.name}</div>
          <div class="coord-role">${r.role}</div>
        </div>
        <div class="coord-status-badge ${statusClass}">${statusLabel}</div>
      `;
      sheet.appendChild(item);
    });

    const youItem = el('div', 'coord-sheet-item');
    youItem.innerHTML = `
      <div class="coord-avatar-large" style="background:#4285F4">YOU</div>
      <div>
        <div class="coord-name">You</div>
        <div class="coord-role">${DATA.incident.role}</div>
      </div>
      <div class="coord-status-badge en-route">En Route</div>
    `;
    sheet.appendChild(youItem);

    backdrop.appendChild(sheet);
    document.getElementById('app').appendChild(backdrop);

    sheet.style.transform = 'translateY(100%)';
    requestAnimationFrame(() => {
      sheet.style.transition = 'transform .28s cubic-bezier(.32,1,.6,1)';
      sheet.style.transform  = 'translateY(0)';
    });

    function dismiss() {
      sheet.style.transition = 'transform .25s ease-in';
      sheet.style.transform  = 'translateY(100%)';
      backdrop.style.transition = 'opacity .25s';
      backdrop.style.opacity = '0';
      setTimeout(() => backdrop.remove(), 260);
    }

    backdrop.addEventListener('click', e => { if (e.target === backdrop) dismiss(); });

    let startY = 0, dragY = 0, dragging = false;
    sheet.addEventListener('touchstart', e => {
      dragging = true; startY = e.touches[0].clientY; sheet.style.transition = 'none';
    }, { passive: true });
    sheet.addEventListener('touchmove', e => {
      if (!dragging) return;
      dragY = Math.max(0, e.touches[0].clientY - startY);
      sheet.style.transform = `translateY(${dragY}px)`;
      backdrop.style.opacity = Math.max(0, 1 - dragY / 250);
    }, { passive: true });
    sheet.addEventListener('touchend', () => {
      if (!dragging) return; dragging = false;
      if (dragY > 100) dismiss();
      else {
        sheet.style.transition = 'transform .25s cubic-bezier(.32,1,.6,1)';
        sheet.style.transform  = 'translateY(0)';
        backdrop.style.opacity = '1';
      }
      dragY = 0;
    });
  }

  return screen;
});
