/* ─────────────────────────────────────────
   SCREEN: SUPPORT — UNCONSCIOUS (Task 3, NO path)
   Responder follows emergency protocol for an
   unconscious heat-stroke patient until EMS arrives.
───────────────────────────────────────── */
registerScreen('support-unconscious', () => {
  const screen = el('div', 'screen');

  // ── Red urgent hero ───────────────────────
  const hero = el('div', 'unconscious-hero');
  hero.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0
        1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9"  x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
    <div class="unconscious-hero-title">${DATA.incident.victim.name} is UNCONSCIOUS</div>
    <div class="unconscious-hero-sub">Follow steps — call 144 immediately</div>
  `;

  const content = el('div', 'support-content');

  // ── Call 144 — first and most prominent ───
  const callBtn = el('button', 'btn-red fa-call-btn');
  callBtn.style.cssText = 'margin-top:12px; font-size:16px; font-weight:800; letter-spacing:.3px;';
  callBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
        A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35a2 2 0 0 1
        1.98-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0
        1-.45 2.11L7.91 9a16 16 0 0 0 6.09 6.09l.92-.92a2 2 0 0 1
        2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
    Call 144 — Emergency Services
  `;
  callBtn.addEventListener('click', () => { window.location.href = 'tel:144'; });

  // ── Timer strip ───────────────────────────
  const timerStrip = el('div', 'support-timer-strip');
  timerStrip.style.marginTop = '0';
  timerStrip.innerHTML = `
    <span class="support-timer-label">Time on-site</span>
    <span class="support-timer-value" id="suTimer">0:00</span>
  `;

  // ── Checklist ─────────────────────────────
  const checks = [
    { label: 'Cleared the airway',             sub: 'Head tilt, chin lift — checked for obstructions' },
    { label: 'Placed in recovery position',    sub: 'On side; prevents airway obstruction if vomiting' },
    { label: 'Applied cooling to body',        sub: 'Cool wet cloths on neck, armpits, and groin' },
    { label: 'NOT given food or water',        sub: 'Unconscious patients must not be given anything orally' },
    { label: 'Staying with patient',           sub: 'Not leaving until Emergency Services arrive' },
  ];

  const checklistCard = el('div', 'support-checklist-card');
  checklistCard.innerHTML = `
    <div class="support-checklist-title">Protocol checklist</div>
    <div class="support-progress-bar-wrap">
      <div class="support-progress-bar" id="suProgress"></div>
    </div>
  `;

  let doneCount = 0;

  checks.forEach(c => {
    const item = el('div', 'support-check-item');
    item.innerHTML = `
      <div class="support-check-box">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display:none">
          <polyline points="2,6 5,9 10,3" stroke="white" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="support-check-text">
        <div class="support-check-label">${c.label}</div>
        <div class="support-check-sub">${c.sub}</div>
      </div>
    `;

    const mark = item.querySelector('svg');
    item.addEventListener('click', () => {
      if (item.classList.contains('done')) return;
      item.classList.add('done');
      mark.style.display = 'block';
      doneCount++;
      const bar = document.getElementById('suProgress');
      if (bar) bar.style.width = `${(doneCount / checks.length) * 100}%`;
      if (doneCount >= checks.length) resolveBtn.classList.add('resolve-ready');
    });

    checklistCard.appendChild(item);
  });

  // ── Resolve button ────────────────────────
  const resolveBtn = el('button', 'btn-teal');
  resolveBtn.textContent = 'Emergency Services Have Arrived →';
  resolveBtn.addEventListener('click', () => {
    DATA.session = {
      startTime: startTs || Date.now(),
      path: 'unconscious',
      checksCompleted: doneCount,
      total: checks.length,
    };
    goTo('resolve');
  });

  content.append(callBtn, timerStrip, checklistCard, resolveBtn);
  screen.append(makeTopBar(), hero, content, makeBottomNav('help'));

  // ── Lifecycle ─────────────────────────────
  let startTs = null;
  let timerInterval = null;

  screen._onActivate = () => {
    startTs = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const sec = Math.floor((Date.now() - startTs) / 1000);
      const m = Math.floor(sec / 60), s = sec % 60;
      const node = document.getElementById('suTimer');
      if (node) node.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }, 1000);
  };

  return screen;
});
