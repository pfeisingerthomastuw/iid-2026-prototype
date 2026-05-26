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
function makeBottomNav() {
  const nav = el('div', 'bottom-nav');
  DATA.navTabs.forEach(tab => {
    const item = el('div', 'nav-item');
    if (tab.alarm) {
      item.style.flex = '1.2';
      item.innerHTML = `
        <div class="alarm-pill">
          ${ICON.star('white')}
          <span class="nav-label">${tab.label}</span>
        </div>`;
    } else {
      item.innerHTML = `
        ${tab.id === 'map' ? ICON.menu('#AAAAAA') : ICON.info('#AAAAAA')}
        <span class="nav-label">${tab.label}</span>`;
    }
    nav.appendChild(item);
  });
  return nav;
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
