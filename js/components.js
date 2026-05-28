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
  bar.querySelector('.topbar-logo').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
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

    }

    nav.appendChild(item);
  });
  return nav;
}

// ── Incoming-alert notification banner ──────────────────────
function showNotificationBanner() {
  document.querySelectorAll('.notif-banner').forEach(b => b.remove());

  const banner = el('div', 'notif-banner');
  const v = DATA.incident;
  const isCrit = v.victim.status === 'critical';
  banner.innerHTML = `
    <div class="notif-app-icon">CHEN</div>
    <div class="notif-body">
      <div class="notif-title">${isCrit ? 'Heat Emergency Nearby' : 'Heat Stress Case Nearby'}</div>
      <div class="notif-sub">${v.victim.name} · ${v.victim.status} · ${v.distance} away — tap to respond</div>
    </div>
    <button class="notif-dismiss" aria-label="Dismiss">✕</button>
  `;
  document.getElementById('app').appendChild(banner);

  requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('visible')));

  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    banner.classList.remove('visible');
    banner.classList.add('hiding');
    setTimeout(() => banner.remove(), 320);
  }

  banner.querySelector('.notif-dismiss').addEventListener('click', e => { e.stopPropagation(); dismiss(); });
  banner.addEventListener('click', () => { dismiss(); goTo('incoming'); });
  setTimeout(dismiss, 8000);
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

// ── Generic confirm dialog (Fix #5) ─────────────────────────
function showConfirmDialog({ title, body, confirmLabel = 'Confirm', cancelLabel = '← Go Back', confirmClass = 'btn-teal', onConfirm }) {
  const backdrop = el('div', 'dialog-backdrop');
  const dialog   = el('div', 'dialog');

  const titleEl = el('div', 'dialog-title');
  titleEl.textContent = title;

  const bodyEl = el('p', 'dialog-body');
  bodyEl.textContent = body;

  const confirmBtn = el('button', confirmClass);
  confirmBtn.textContent = confirmLabel;

  const cancelBtn = el('button', 'btn-outline');
  cancelBtn.textContent = cancelLabel;
  cancelBtn.style.marginTop = '0';

  function close() { backdrop.remove(); }
  confirmBtn.addEventListener('click', () => { close(); onConfirm(); });
  cancelBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });

  dialog.append(titleEl, bodyEl, confirmBtn, cancelBtn);
  backdrop.appendChild(dialog);
  document.getElementById('app').appendChild(backdrop);
}

// ── Error banner (Fix #9) ────────────────────────────────────
// type: 'warning' (default amber) | 'red'
function showErrorBanner(message, type = 'warning', container) {
  const target = container || document.getElementById('app');
  target.querySelectorAll('.error-banner').forEach(b => b.remove());

  const banner = el('div', `error-banner${type === 'red' ? ' red' : ''}`);
  banner.innerHTML = `
    <span class="error-banner-icon">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0
          1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9"  x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </span>
    <span class="error-banner-text">${message}</span>
    <button class="error-banner-dismiss" aria-label="Dismiss">✕</button>
  `;
  banner.querySelector('.error-banner-dismiss').addEventListener('click', () => banner.remove());
  return banner;
}

// ── Coordination bottom sheet (shared) ──────────────────────
function showCoordinationSheet() {
  const backdrop = el('div', 'health-backdrop');
  const sheet    = el('div', 'health-sheet');
  const handle   = el('div', 'sheet-handle');

  const title = el('div', 'rd-section-title');
  title.style.cssText = 'padding: 0 16px 12px; display:block;';
  title.textContent = 'Team on-site';

  sheet.append(handle, title);

  const avatarColors = ['teal', 'grey'];
  DATA.incident.responders.forEach((r, i) => {
    const item        = el('div', 'coord-sheet-item');
    const avatarColor = avatarColors[i] ?? 'grey';
    const statusClass = r.status === 'arrived' ? 'arrived' : 'en-route';
    const statusLabel = r.status === 'arrived' ? 'Arrived'  : 'En Route';
    item.innerHTML = `
      <div class="coord-avatar-large ${avatarColor}">${r.initials}</div>
      <div style="flex:1">
        <div class="coord-name">${r.name}</div>
        <div class="coord-role">${r.role}</div>
        ${r.task ? `
        <div class="coord-task">
          <span class="coord-task-dot ${statusClass}"></span>
          ${r.task}
        </div>` : ''}
      </div>
      <div class="coord-status-badge ${statusClass}">${statusLabel}</div>
    `;
    sheet.appendChild(item);
  });

  const youItem = el('div', 'coord-sheet-item');
  youItem.innerHTML = `
    <div class="coord-avatar-large" style="background:#4285F4">YOU</div>
    <div style="flex:1">
      <div class="coord-name">You</div>
      <div class="coord-role">${DATA.incident.role}</div>
      <div class="coord-task">
        <span class="coord-task-dot arrived"></span>
        Following support protocol
      </div>
    </div>
    <div class="coord-status-badge arrived">Arrived</div>
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

  function onDragStart(e) {
    dragging = true;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    sheet.style.transition = 'none';
  }
  function onDragMove(e) {
    if (!dragging) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    dragY = Math.max(0, y - startY);
    sheet.style.transform = `translateY(${dragY}px)`;
    backdrop.style.opacity = Math.max(0, 1 - dragY / 250);
  }
  function onDragEnd() {
    if (!dragging) return;
    dragging = false;
    if (dragY > 100) {
      dismiss();
    } else {
      sheet.style.transition = 'transform .25s cubic-bezier(.32,1,.6,1)';
      sheet.style.transform  = 'translateY(0)';
      backdrop.style.opacity = '1';
    }
    dragY = 0;
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup',   onDragEnd);
  }

  sheet.addEventListener('touchstart', onDragStart, { passive: true });
  sheet.addEventListener('touchmove',  onDragMove,  { passive: true });
  sheet.addEventListener('touchend',   onDragEnd);
  sheet.addEventListener('mousedown',  e => {
    onDragStart(e);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup',   onDragEnd);
  });
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
