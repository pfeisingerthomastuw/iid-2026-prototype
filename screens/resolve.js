/* ─────────────────────────────────────────
   SCREEN: RESOLVE — INCIDENT CLOSED (Task 3 end)
   Responder chooses how to close the incident:
   stable / handover / escalate to EMS.
───────────────────────────────────────── */
registerScreen('resolve', () => {
  const screen  = el('div', 'screen');
  const content = el('div', 'resolve-content');

  // ── Heading ───────────────────────────────
  const heading = el('div', 'resolve-choose-heading');
  heading.textContent = 'How are you closing this incident?';

  const sub = el('div', 'resolve-choose-sub');
  sub.textContent = 'Choose the outcome that best describes the current situation.';

  // ── Resolution options ────────────────────
  const optionsWrap = el('div', 'resolve-options');

  // Option 1 — Stable
  const stableOpt = el('div', 'resolve-option teal');
  stableOpt.innerHTML = `
    <div class="resolve-option-icon teal">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white"
        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <div class="resolve-option-text">
      <div class="resolve-option-title">Patient is stable</div>
      <div class="resolve-option-sub">Worker has recovered — no further help needed</div>
    </div>
    <div class="resolve-option-arrow">›</div>
  `;
  stableOpt.addEventListener('click', () => {
    showConfirmDialog({
      title:        'Confirm patient is stable?',
      body:         'Only confirm if the worker is fully responsive and no longer in immediate danger.',
      confirmLabel: 'Yes, close incident',
      cancelLabel:  '← Go back',
      confirmClass: 'btn-teal',
      onConfirm:    () => showResolved('stable'),
    });
  });

  // Option 2 — Handover
  const handoverOpt = el('div', 'resolve-option blue');
  handoverOpt.innerHTML = `
    <div class="resolve-option-icon blue">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white"
        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    </div>
    <div class="resolve-option-text">
      <div class="resolve-option-title">Hand over to responder</div>
      <div class="resolve-option-sub" id="handoverSub">A qualified responder is taking over</div>
    </div>
    <div class="resolve-option-arrow">›</div>
  `;
  handoverOpt.addEventListener('click', () => {
    const qualified = DATA.incident.responders.find(r => r.role.toLowerCase().includes('first aid') || r.role.toLowerCase().includes('trained'));
    const name = qualified ? qualified.name : 'a qualified responder';
    showConfirmDialog({
      title:        `Hand over to ${name}?`,
      body:         `Confirm that ${name} has taken lead responsibility for the patient. You are stepping back.`,
      confirmLabel: 'Yes, hand over',
      cancelLabel:  '← Go back',
      confirmClass: 'btn-teal',
      onConfirm:    () => showResolved('handover', name),
    });
  });

  // Option 3 — Escalate
  const escalateOpt = el('div', 'resolve-option red');
  escalateOpt.innerHTML = `
    <div class="resolve-option-icon red">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white"
        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
          A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35a2 2 0 0 1
          1.98-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0
          1-.45 2.11L7.91 9a16 16 0 0 0 6.09 6.09l.92-.92a2 2 0 0 1
          2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    </div>
    <div class="resolve-option-text">
      <div class="resolve-option-title">Call 144 — Escalate</div>
      <div class="resolve-option-sub">Condition is serious — emergency services needed</div>
    </div>
    <div class="resolve-option-arrow">›</div>
  `;
  escalateOpt.addEventListener('click', () => {
    showConfirmDialog({
      title:        'Call emergency services?',
      body:         'This will dial 144. Stay with the patient and keep monitoring until EMS arrives.',
      confirmLabel: 'Call 144 now',
      cancelLabel:  '← Go back',
      confirmClass: 'btn-red',
      onConfirm:    () => {
        window.location.href = 'tel:144';
        showResolved('escalate');
      },
    });
  });

  optionsWrap.append(stableOpt, handoverOpt, escalateOpt);

  // ── Resolved state (shown after choice) ───
  const resolvedView = el('div', 'resolve-resolved-view');
  resolvedView.style.display = 'none';

  const resolveIcon = el('div', 'resolve-check-icon');
  resolveIcon.innerHTML = `
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  `;

  const resolveHeading = el('div', 'resolve-heading');
  resolveHeading.textContent = 'Incident Closed';

  const resolveSub = el('div', 'resolve-sub');

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

  const resolveMessage = el('div', 'resolve-message');

  const homeBtn = el('button', 'btn-teal');
  homeBtn.style.width = '100%';
  homeBtn.textContent = 'Back to Home →';
  homeBtn.addEventListener('click', () => {
    goTo('home');
    showToast('Incident closed', 'Thank you for your help today.');
  });

  resolvedView.append(resolveIcon, resolveHeading, resolveSub, statsRow, resolveMessage, homeBtn);

  content.append(heading, sub, optionsWrap, resolvedView);
  screen.append(makeTopBar(), content, makeBottomNav());

  // ── Show resolved state ───────────────────
  function showResolved(type, handoverName) {
    optionsWrap.style.display = 'none';
    heading.style.display     = 'none';
    sub.style.display         = 'none';
    resolvedView.style.display = 'contents';

    const sess = DATA.session || {};
    const timeEl   = document.getElementById('resolveTime');
    const checksEl = document.getElementById('resolveChecks');

    if (timeEl && sess.startTime) {
      const sec = Math.floor((Date.now() - sess.startTime) / 1000);
      const m = Math.floor(sec / 60), s = sec % 60;
      timeEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }
    if (checksEl) {
      checksEl.textContent = `${sess.checksCompleted ?? 0}/${sess.total ?? 5}`;
    }

    if (type === 'stable') {
      resolveSub.textContent    = `${DATA.incident.victim.name} is stable. You provided critical on-site support.`;
      resolveMessage.textContent = 'Your location data will be cleared. Emergency Services have been notified of the outcome.';
    } else if (type === 'handover') {
      resolveSub.textContent    = `Handed over to ${handoverName}. Your role in this incident is complete.`;
      resolveMessage.textContent = `${handoverName} has taken lead responsibility. Stay nearby if needed and wait for further instructions.`;
    } else if (type === 'escalate') {
      resolveHeading.textContent = 'EMS Called';
      resolveSub.textContent    = 'Emergency services are on the way. Keep the patient monitored until they arrive.';
      resolveMessage.textContent = 'Do not leave the patient. Follow any instructions given by the 144 dispatcher.';
      resolveIcon.style.background = 'var(--red)';
      resolveIcon.style.boxShadow  = '0 8px 32px rgba(211,47,47,0.4)';
    }
  }

  // ── Reset on re-entry ─────────────────────
  screen._onActivate = () => {
    optionsWrap.style.display   = '';
    heading.style.display       = '';
    sub.style.display           = '';
    resolvedView.style.display  = 'none';
    resolveIcon.style.background = '';
    resolveIcon.style.boxShadow  = '';
    resolveHeading.textContent   = 'Incident Closed';

    const subEl = document.getElementById('handoverSub');
    if (subEl) {
      const qualified = DATA.incident.responders.find(r =>
        r.role.toLowerCase().includes('first aid') || r.role.toLowerCase().includes('trained'));
      if (qualified) subEl.textContent = `${qualified.name} is certified and ready to take over`;
    }
  };

  return screen;
});
