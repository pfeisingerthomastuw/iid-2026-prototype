/* ─────────────────────────────────────────
   SCREEN: SUPPORT — CONSCIOUS (Task 3, YES path)
   Responder provides cooling & hydration support
   to a conscious heat-stroke patient.
───────────────────────────────────────── */
registerScreen('support-conscious', () => {
  const screen = el('div', 'screen');

  // ── Teal hero ─────────────────────────────
  const hero = el('div', 'support-hero');
  hero.innerHTML = `
    <div class="support-hero-tag">On-Site Support</div>
    <div class="support-hero-title">${DATA.incident.victim.name} is conscious</div>
    <div class="support-hero-sub">Responsive — follow steps below</div>
  `;

  const content = el('div', 'support-content');

  // ── Timer strip ───────────────────────────
  const timerStrip = el('div', 'support-timer-strip');
  timerStrip.innerHTML = `
    <span class="support-timer-label">Time on-site</span>
    <span class="support-timer-value" id="scTimer">0:00</span>
  `;

  // ── Live vitals ───────────────────────────
  let bpm  = 168;
  let temp = 39.2;

  const vitalsCard = el('div', 'support-vitals-card');
  vitalsCard.innerHTML = `
    <div class="support-vitals-title">Live Vitals</div>
    <div class="support-vitals-grid">
      <div class="support-vital-item">
        <div class="support-vital-label">Heart Rate</div>
        <div class="support-vital-value critical" id="scBpm">168 BPM</div>
        <div class="support-vital-trend critical" id="scBpmTrend">▲ Critically elevated</div>
      </div>
      <div class="support-vital-item">
        <div class="support-vital-label">Body Temp</div>
        <div class="support-vital-value critical" id="scTemp">39.2 °C</div>
        <div class="support-vital-trend critical" id="scTempTrend">▲ Dangerously high</div>
      </div>
    </div>
  `;

  // ── Checklist ─────────────────────────────
  const checks = [
    { label: 'Moved to shade or cool area',          sub: 'Away from direct sunlight and heat sources' },
    { label: 'Loosened restrictive clothing',         sub: 'Removed helmet, unbuttoned collar and vest' },
    { label: 'Applied cool wet cloths',               sub: 'To neck, armpits, and groin — most effective zones' },
    { label: 'Provided small sips of cool water',     sub: 'Every few minutes; avoid alcohol or caffeine' },
    { label: 'Monitoring breathing & responsiveness', sub: 'Checking every 2 minutes, person is staying awake' },
  ];

  const checklistCard = el('div', 'support-checklist-card');
  checklistCard.innerHTML = `
    <div class="support-checklist-title">Actions to perform</div>
    <div class="support-progress-bar-wrap">
      <div class="support-progress-bar" id="scProgress"></div>
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
      const pct = (doneCount / checks.length) * 100;
      const bar = document.getElementById('scProgress');
      if (bar) bar.style.width = `${pct}%`;
      if (doneCount >= checks.length) resolveBtn.classList.add('resolve-ready');
    });

    checklistCard.appendChild(item);
  });

  // ── Call 144 button ───────────────────────
  const callBtn = el('button', 'btn-red fa-call-btn');
  callBtn.style.marginBottom = '0';
  callBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white"
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

  // ── Resolve button ────────────────────────
  const resolveBtn = el('button', 'btn-teal');
  resolveBtn.textContent = 'Mark Incident as Resolved →';
  resolveBtn.addEventListener('click', () => {
    DATA.session = {
      startTime: startTs || Date.now(),
      path: 'conscious',
      checksCompleted: doneCount,
      total: checks.length,
    };
    goTo('resolve');
  });

  content.append(timerStrip, vitalsCard, checklistCard, callBtn, resolveBtn);
  screen.append(makeTopBar(), hero, content, makeBottomNav('help'));

  // ── Lifecycle ─────────────────────────────
  let startTs = null;
  let timerInterval  = null;
  let vitalsInterval = null;

  screen._onActivate = () => {
    startTs = Date.now();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const sec = Math.floor((Date.now() - startTs) / 1000);
      const m = Math.floor(sec / 60), s = sec % 60;
      const node = document.getElementById('scTimer');
      if (node) node.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }, 1000);

    // Vitals slowly improve as responder takes action
    bpm  = 168;
    temp = 39.2;
    clearInterval(vitalsInterval);
    vitalsInterval = setInterval(() => {
      bpm  = Math.max(98,  bpm  - (Math.random() * 5 + 2));
      temp = Math.max(37.4, temp - (Math.random() * 0.08 + 0.02));

      const bpmEl     = document.getElementById('scBpm');
      const tempEl    = document.getElementById('scTemp');
      const bpmTrend  = document.getElementById('scBpmTrend');
      const tempTrend = document.getElementById('scTempTrend');
      if (!bpmEl) return;

      bpmEl.textContent  = `${Math.round(bpm)} BPM`;
      tempEl.textContent = `${temp.toFixed(1)} °C`;

      if (bpm < 130) {
        bpmEl.className        = 'support-vital-value warning';
        bpmTrend.className     = 'support-vital-trend improving';
        bpmTrend.textContent   = '▼ Improving';
      }
      if (bpm < 108) {
        bpmEl.className        = 'support-vital-value ok';
        bpmTrend.textContent   = '● Near normal';
      }
      if (temp < 38.8) {
        tempEl.className       = 'support-vital-value warning';
        tempTrend.className    = 'support-vital-trend improving';
        tempTrend.textContent  = '▼ Improving';
      }
      if (temp < 37.8) {
        tempEl.className       = 'support-vital-value ok';
        tempTrend.textContent  = '● Near normal';
      }
    }, 5000);
  };

  return screen;
});
