/* ─────────────────────────────────────────
   SCREEN: REQUEST DETAIL (Task 2, step 2)
   Shows the responder their assigned role,
   patient vitals (color-coded, (i) expands
   to raw numbers), and items to bring.
───────────────────────────────────────── */
registerScreen('request-detail', () => {
  const screen  = el('div', 'screen');
  const content = el('div', 'rd-content');

  // ── Header ────────────────────────────────
  const header = el('div', 'emerg-page-header');
  header.innerHTML = `
    <div class="emerg-tag teal">EMERGENCY REQUEST</div>
    <div class="emerg-bar teal"></div>
    <div class="page-heading" style="margin-bottom:0">Your role</div>
  `;

  // ── Role section ──────────────────────────
  const roleSection = el('div', 'rd-section');
  roleSection.innerHTML = `
    <div class="rd-role-badge">
      <div class="rd-role-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <div>
        <div class="rd-role-name">${DATA.incident.role}</div>
        <div class="rd-role-desc">${DATA.incident.roleDesc}</div>
      </div>
    </div>
  `;

  // ── Vitals section ────────────────────────
  const vitalsSection = el('div', 'rd-section');
  const vitalsTitle   = el('div', 'rd-section-title');
  vitalsTitle.textContent = 'Patient vitals';
  vitalsSection.appendChild(vitalsTitle);

  DATA.incident.vitals.forEach(vt => {
    const row = el('div', 'rd-vital-row');
    row.innerHTML = `
      <div class="rd-vital-left">
        <div class="rd-vital-label">${vt.label}</div>
        <div class="rd-vital-badge ${vt.color}">
          <div class="rd-vital-badge-dot"></div>
          <span class="rd-vital-badge-text">${vt.badge}</span>
        </div>
      </div>
      <button class="rd-vital-info-btn" aria-label="Show raw value">ⓘ</button>
    `;
    const detail = el('div', 'rd-vital-detail');
    detail.innerHTML = `<strong>${vt.value}</strong> &nbsp;·&nbsp; Normal range: ${vt.normal}`;
    detail.hidden = true;
    row.appendChild(detail);

    row.querySelector('.rd-vital-info-btn').addEventListener('click', () => {
      detail.hidden = !detail.hidden;
    });

    vitalsSection.appendChild(row);
  });

  // ── Items section ─────────────────────────
  const itemsSection = el('div', 'rd-section');
  const itemsTitle   = el('div', 'rd-section-title');
  itemsTitle.textContent = 'Bring these items';
  itemsSection.appendChild(itemsTitle);

  DATA.incident.itemsToBring.forEach(item => {
    const row = el('div', 'rd-item-row');
    row.innerHTML = `<div class="rd-item-dot"></div><span>${item}</span>`;
    itemsSection.appendChild(row);
  });

  // ── Actions ───────────────────────────────
  const acceptBtn = el('button', 'btn-teal');
  acceptBtn.textContent = 'Accept & Navigate →';
  acceptBtn.addEventListener('click', () => goTo('responder-nav'));

  const backBtn = el('button', 'btn-outline');
  backBtn.textContent = '← Go Back';
  backBtn.addEventListener('click', () => history.back());

  content.append(header, roleSection, vitalsSection, itemsSection, acceptBtn, backBtn);
  screen.append(makeTopBar(), content, makeBottomNav());
  return screen;
});
