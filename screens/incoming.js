/* ─────────────────────────────────────────
   SCREEN: INCOMING ALERT (Task 2, step 1)
───────────────────────────────────────── */
registerScreen('incoming', () => {
  const screen = el('div', 'screen');

  // ── Hero ──────────────────────────────────
  const hero = el('div', 'incoming-hero');
  const heroTitle = el('div', 'inc-hero-title');
  const heroSub   = el('div', 'inc-hero-sub');
  hero.innerHTML = `
    <div class="inc-warn-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9"  x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </div>
  `;
  hero.appendChild(heroTitle);
  hero.appendChild(heroSub);

  // ── Body ──────────────────────────────────
  const body        = el('div', 'incoming-body');
  const victimCard  = el('div', 'inc-victim-card');
  const actions     = el('div', 'inc-actions');

  const helpBtn = el('button', 'btn-teal');
  helpBtn.textContent = 'I can help →';
  helpBtn.addEventListener('click', () => goTo('request-detail'));

  const unavailBtn = el('button', 'btn-outline');
  unavailBtn.textContent = 'Unavailable right now';
  unavailBtn.addEventListener('click', () => goTo('home'));

  actions.append(helpBtn, unavailBtn);
  body.append(victimCard, actions);
  screen.append(makeTopBar(), hero, body, makeBottomNav());

  // ── Refresh on activate ───────────────────
  screen._onActivate = () => {
    const v      = DATA.incident;
    const isCrit = v.victim.status === 'critical';

    hero.style.background = isCrit
      ? 'linear-gradient(160deg,#C62828 0%,#7B1A1A 100%)'
      : 'linear-gradient(160deg,#E65100 0%,#BF360C 100%)';
    hero.style.animation = isCrit ? '' : 'none';

    heroTitle.innerHTML  = isCrit ? 'HEAT EMERGENCY<br>NEARBY' : 'HEAT STRESS<br>NEARBY';
    heroSub.textContent  = isCrit ? 'Immediate help needed' : 'Assistance requested nearby';

    victimCard.innerHTML = `
      <span class="hd-pill ${isCrit ? 'critical' : 'warning'}">${v.victim.status}</span>
      <div class="inc-victim-name">${v.victim.name}</div>
      <div class="inc-victim-dist">${v.distance} away &nbsp;·&nbsp; Construction Site Worker</div>
      <div class="inc-vitals">
        ${v.vitals.map(vt => `
          <div class="inc-vital-badge ${vt.color}">
            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg>
            <span>${vt.label}: <strong>${vt.badge}</strong></span>
          </div>
        `).join('')}
      </div>
    `;
  };

  return screen;
});
