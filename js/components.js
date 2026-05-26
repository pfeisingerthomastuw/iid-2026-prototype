/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS & REGISTRY
   - el()            tiny DOM helper
   - SCREENS         registry populated by registerScreen()
   - registerScreen() called by each screen file
   - makeTopBar()    shared top bar
   - makeBottomNav() shared bottom nav
   - makeEmergHeader() red/teal "REPORT EMERGENCY" header
═══════════════════════════════════════════════════════════════ */

function el(tag, classes = '') {
  const e = document.createElement(tag);
  if (classes) e.className = classes;
  return e;
}

// Screen registry — populated in order by the screen files
const SCREENS = {};

function registerScreen(id, buildFn) {
  SCREENS[id] = buildFn;
}

// ── Top bar (shared across all screens) ──────────────────────
function makeTopBar() {
  const bar = el('div', 'topbar');
  bar.innerHTML = `
    <div class="topbar-logo">${DATA.appName}</div>
    <div class="topbar-gps">
      <div class="gps-dot"></div>${DATA.gpsLabel}
    </div>
    <div class="topbar-avatar">${ICON.person('#777')}</div>
  `;
  return bar;
}

// ── Bottom nav (shared across all screens) ───────────────────
// active: 'alarm' | 'map' | 'firstaid'
function makeBottomNav(active = 'alarm') {
  const nav = el('div', 'bottom-nav');
  DATA.navTabs.forEach(tab => {
    const item    = el('div', 'nav-item');
    const isOn    = tab.alarm ? active === 'alarm' : tab.id === active;
    const onColor = '#D32F2F';
    const offColor= '#AAAAAA';

    if (tab.alarm) {
      item.style.flex = '1.2';
      if (isOn) {
        item.innerHTML = `
          <div class="alarm-pill">
            ${ICON.star('white')}
            <span class="nav-label">${tab.label}</span>
          </div>`;
      } else {
        item.innerHTML = `
          ${ICON.star(offColor)}
          <span class="nav-label">${tab.label}</span>`;
      }
      item.addEventListener('click', () => goTo('home'));

    } else if (tab.id === 'map') {
      const c = isOn ? onColor : offColor;
      item.innerHTML = `
        ${ICON.menu(c)}
        <span class="nav-label" style="color:${c}">${tab.label}</span>`;
      item.addEventListener('click', () => goTo('map'));

    } else if (tab.id === 'help') {
      const c = isOn ? onColor : offColor;
      item.innerHTML = `
        ${ICON.medkit(c)}
        <span class="nav-label" style="color:${c}">${tab.label}</span>`;
      item.addEventListener('click', () => goTo('help-map'));

    } else {
      const c = isOn ? onColor : offColor;
      item.innerHTML = `
        ${ICON.info(c)}
        <span class="nav-label" style="color:${c}">${tab.label}</span>`;
    }

    nav.appendChild(item);
  });
  return nav;
}

// ── Toast notification ───────────────────────────────────────
function showToast(title, subtitle = '') {
  // Remove any existing toast first
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = el('div', 'toast');
  toast.innerHTML = `
    <div class="toast-icon">${ICON.check('white').replace('width="44" height="44"', 'width="22" height="22"')}</div>
    <div class="toast-text">
      <div class="toast-title">${title}</div>
      ${subtitle ? `<div class="toast-sub">${subtitle}</div>` : ''}
    </div>
  `;
  document.getElementById('app').appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('visible'));
  });

  setTimeout(() => {
    toast.classList.add('hiding');
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 280);
  }, 2500);
}

// ── Loading overlay ──────────────────────────────────────────
function showLoading(ms, onDone) {
  const overlay = el('div', 'loading-overlay');
  overlay.innerHTML = `
    <svg class="spinner" viewBox="0 0 56 56">
      <circle class="spinner-track" cx="28" cy="28" r="22"/>
      <circle class="spinner-arc"   cx="28" cy="28" r="22"/>
    </svg>
    <div class="loading-label">Contacting responders…</div>
  `;
  document.getElementById('app').appendChild(overlay);

  setTimeout(() => {
    overlay.style.transition = 'opacity .18s ease';
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.remove(); onDone(); }, 180);
  }, ms);
}

// ── Cancel confirmation dialog ───────────────────────────────
function showCancelDialog(onConfirm) {
  const backdrop = el('div', 'dialog-backdrop');
  const dialog   = el('div', 'dialog');

  const title = el('div', 'dialog-title');
  title.textContent = 'Cancel Emergency?';

  const body = el('p', 'dialog-body');
  body.textContent = 'Responders will be notified that no help is needed. Only cancel if this was triggered by accident.';

  const keepBtn = el('button', 'btn-red');
  keepBtn.textContent = 'Keep Emergency Active';

  const confirmBtn = el('button', 'btn-outline');
  confirmBtn.textContent = 'Yes, Cancel Emergency';
  confirmBtn.style.marginTop = '0';

  function close() { backdrop.remove(); }

  keepBtn.addEventListener('click', close);
  confirmBtn.addEventListener('click', () => { close(); onConfirm(); });
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });

  dialog.append(title, body, keepBtn, confirmBtn);
  backdrop.appendChild(dialog);
  document.getElementById('app').appendChild(backdrop);
}

// ── "REPORT EMERGENCY" label + colored bar ───────────────────
function makeEmergHeader(useTeal = false) {
  const wrap = el('div', 'emerg-page-header');
  const tag  = el('div', `emerg-tag${useTeal ? ' teal' : ''}`);
  tag.textContent = 'REPORT EMERGENCY';
  const bar = el('div', `emerg-bar${useTeal ? ' teal' : ''}`);
  wrap.append(tag, bar);
  return wrap;
}
