/* ─────────────────────────────────────────
   SCREEN: RESOLVE — INCIDENT CLOSED (Task 3 end)
   Shows elapsed time, actions taken, and a
   positive confirmation before returning home.
───────────────────────────────────────── */
registerScreen('resolve', () => {
  const screen  = el('div', 'screen');
  const content = el('div', 'resolve-content');

  // ── Big teal checkmark ────────────────────
  const icon = el('div', 'resolve-check-icon');
  icon.innerHTML = `
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  `;

  const heading = el('div', 'resolve-heading');
  heading.textContent = 'Incident Resolved';

  const sub = el('div', 'resolve-sub');
  sub.textContent = `You provided critical on-site support to ${DATA.incident.victim.name}. Well done.`;

  // ── Stats (populated on activate) ─────────
  const statsRow = el('div', 'resolve-stats');
  const timeStat = el('div', 'resolve-stat-item');
  timeStat.innerHTML = `
    <div class="resolve-stat-value" id="resolveTime">—</div>
    <div class="resolve-stat-label">Time on-site</div>
  `;
  const checkStat = el('div', 'resolve-stat-item');
  checkStat.innerHTML = `
    <div class="resolve-stat-value" id="resolveChecks">—</div>
    <div class="resolve-stat-label">Steps completed</div>
  `;
  statsRow.append(timeStat, checkStat);

  // ── Message card ──────────────────────────
  const message = el('div', 'resolve-message');
  message.textContent =
    'Emergency Services have been notified. Your location data will be cleared. Thank you for responding.';

  // ── Return home ───────────────────────────
  const homeBtn = el('button', 'btn-teal');
  homeBtn.style.width = '100%';
  homeBtn.textContent = 'Return to Home';
  homeBtn.addEventListener('click', () => goTo('home'));

  content.append(icon, heading, sub, statsRow, message, homeBtn);
  screen.append(makeTopBar(), content, makeBottomNav());

  // ── Populate stats on activate ─────────────
  screen._onActivate = () => {
    const sess = DATA.session || {};

    // Elapsed time
    const timeEl = document.getElementById('resolveTime');
    if (timeEl && sess.startTime) {
      const sec = Math.floor((Date.now() - sess.startTime) / 1000);
      const m = Math.floor(sec / 60), s = sec % 60;
      timeEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }

    // Checks
    const checksEl = document.getElementById('resolveChecks');
    if (checksEl) {
      const done  = sess.checksCompleted ?? 0;
      const total = sess.total ?? 5;
      checksEl.textContent = `${done}/${total}`;
    }
  };

  return screen;
});
