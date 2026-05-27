/* ─────────────────────────────────────────
   SCREEN: EMERGENCY REPORTED
───────────────────────────────────────── */
registerScreen('reported', () => {
  const screen = el('div', 'screen');
  const scroll = el('div', 'inner-scroll');

  const heading = el('div', 'page-heading');
  heading.innerHTML = 'Emergency<br>reported';

  const confirmIcon = el('div', 'confirm-icon');
  confirmIcon.innerHTML = ICON.check('white');

  const confirmText = el('p', 'confirm-text');
  confirmText.innerHTML = 'Help is already on the way<br>Your location is being shared with nearby responders';

  // Extra info box built from DATA.symptoms
  const extraBox   = el('div', 'extra-box');
  const extraTitle = el('div', 'extra-box-title');
  extraTitle.textContent = 'You can provide extra information';
  const extraSub = el('div', 'extra-box-sub');
  extraSub.textContent = 'Information helps your responder';

  const grid = el('div', 'symptoms-grid');
  DATA.symptoms.forEach(sym => {
    const row = el('div', 'symptom-row');
    const chk = el('div', 'sym-check');
    const lbl = el('div', 'sym-label');
    lbl.innerHTML = sym.label.replace('\n', '<br>');
    const ico = el('span', 'sym-icon');
    ico.textContent = sym.icon;

    row.append(chk, lbl, ico);
    row.addEventListener('click', () => {
      row.classList.toggle('checked');
      chk.innerHTML = row.classList.contains('checked')
        ? ICON.checkSmall('white')
        : '';
    });
    grid.appendChild(row);
  });

  extraBox.append(extraTitle, extraSub, grid);

  const shareBtn = el('button', 'btn-teal');
  shareBtn.textContent = 'Share extra Info';
  shareBtn.addEventListener('click', () =>
    showToast('Information shared', 'Your responder has been notified'));

  // Location map
  const mapWrap = el('div', 'reported-map-wrap');
  const mapLabel = el('div', 'reported-map-label');
  mapLabel.textContent = 'YOUR LOCATION IS BEING SHARED';
  const mapDiv = el('div', 'reported-map');
  mapWrap.append(mapLabel, mapDiv);

  scroll.append(heading, confirmIcon, confirmText, extraBox, shareBtn, mapWrap);

  const footer = el('div', 'cancel-footer');
  const cancelBtn = el('button', 'btn-outline');
  cancelBtn.textContent = 'Cancel Emergency';
  cancelBtn.addEventListener('click', () => showCancelDialog(() => goTo('home')));
  const note = el('p', 'cancel-note');
  note.textContent = 'Only cancel if the emergency was triggered accidently';
  footer.append(cancelBtn, note);

  screen.append(makeTopBar(), makeEmergHeader(true), scroll, footer, makeBottomNav());

  const USER_COORDS = [48.1972, 16.3488];
  let map = null;

  const userIcon = L.divIcon({
    className: '',
    html: `<div class="help-marker-wrap">
             <div class="help-pulse"></div>
             <div class="help-pulse" style="animation-delay:.6s"></div>
             <div class="help-dot"></div>
           </div>`,
    iconSize: [36, 36], iconAnchor: [18, 18],
  });

  screen._onActivate = () => {
    const icon = screen.querySelector('.confirm-icon');
    icon.style.animation = 'none';
    void icon.offsetWidth;
    icon.style.animation = '';

    setTimeout(() => {
      if (!map) {
        map = L.map(mapDiv, {
          center: USER_COORDS, zoom: 15,
          zoomControl: false, attributionControl: false,
          dragging: false, scrollWheelZoom: false,
          doubleClickZoom: false, touchZoom: false,
        });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 20 }).addTo(map);
        L.marker(USER_COORDS, { icon: userIcon }).addTo(map);
      } else {
        map.invalidateSize();
      }
    }, 300);
  };

  return screen;
});
