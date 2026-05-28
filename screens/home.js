/* ─────────────────────────────────────────
   SCREEN: HOME
───────────────────────────────────────── */
registerScreen('home', () => {
  const screen = el('div', 'screen');

  const pct    = DATA.home.heatstressRisk;
  const C      = 175.9; // circumference for r=28
  const offset = C * (1 - pct / 100);

  // Two identical repetitions of the EKG pattern side-by-side.
  // The SVG is rendered at 200% width and translateX(-50%) loops it seamlessly.
  const ekgD = 'M0,29 L24,29 L32,29 L37,8 L42,50 L47,16 L52,29'
    + ' L76,29 L84,29 L89,8 L94,50 L99,16 L104,29'
    + ' L128,29 L136,29 L141,8 L146,50 L151,16 L156,29'
    + ' L180,29 L188,29 L193,8 L198,50 L203,16 L208,29'
    + ' L240,29 L248,29 L253,8 L258,50 L263,16 L268,29'
    + ' L300,29'
    + ' L324,29 L332,29 L337,8 L342,50 L347,16 L352,29'
    + ' L376,29 L384,29 L389,8 L394,50 L399,16 L404,29'
    + ' L428,29 L436,29 L441,8 L446,50 L451,16 L456,29'
    + ' L480,29 L488,29 L493,8 L498,50 L503,16 L508,29'
    + ' L540,29 L548,29 L553,8 L558,50 L563,16 L568,29'
    + ' L600,29';

  const w = DATA.weather;

  const scroll = el('div', 'scroll-area');
  scroll.innerHTML = `
    <!-- Weather -->
    <div class="card weather-card">
      <div class="weather-top">
        <div class="weather-icon-wrap">${ICON.sun()}</div>
        <div class="weather-main">
          <div class="weather-temp">${w.temp}°C</div>
          <div class="weather-feels">Feels like ${w.feelsLike}°C</div>
        </div>
        <div class="weather-meta">
          <div class="weather-location">${w.location}</div>
          <div class="weather-condition">${w.condition}</div>
        </div>
      </div>
      <div class="weather-divider"></div>
      <div class="weather-metrics">
        <div class="weather-metric">
          ${ICON.drop('#3B82F6')}
          <div class="weather-metric-inner">
            <span class="weather-metric-val">${w.humidity}%</span>
            <span class="weather-metric-lbl">Humidity</span>
          </div>
        </div>
        <div class="weather-metric">
          ${ICON.uvRay('#F59E0B')}
          <div class="weather-metric-inner">
            <span class="weather-metric-val">UV ${w.uvIndex}<span class="uv-badge">${w.uvLabel}</span></span>
            <span class="weather-metric-lbl">UV Index</span>
          </div>
        </div>
        <div class="weather-metric">
          ${ICON.wind('#6B7280')}
          <div class="weather-metric-inner">
            <span class="weather-metric-val">${w.windSpeed} km/h</span>
            <span class="weather-metric-lbl">Wind</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Heatstress Risk -->
    <div class="card heat-card" id="heatCard">
      <div>
        <div class="heat-label">Heatstress<br>Risk</div>
        <div class="heat-sublabel" id="heatLabel">Low</div>
      </div>
      <div class="ring-wrap" id="ringWrap">
        <svg width="70" height="70" viewBox="0 0 64 64">
          <circle class="ring-bg"   cx="32" cy="32" r="28"/>
          <circle class="ring-fill" id="ringFill" cx="32" cy="32" r="28"
            style="stroke-dashoffset:${offset}"/>
        </svg>
        <div class="ring-pct" id="ringPct">—</div>
      </div>
    </div>

    <!-- Report Emergency (hold to send) -->
    <div class="card emergency-card" id="emergCard">
      <div class="emerg-icon-box">${ICON.warning('white')}</div>
      <div class="emerg-title">REPORT<br>EMERGENCY</div>
      <div class="emerg-subtitle">HOLD TO SEND</div>
      <svg class="hold-ring-svg" id="holdRing" viewBox="0 0 100 100">
        <circle class="hold-track" cx="50" cy="50" r="45"/>
        <circle class="hold-fill"  cx="50" cy="50" r="45"
          id="holdFill" transform="rotate(-90 50 50)"/>
      </svg>
      <div class="hold-nudge" id="holdNudge">Hold until complete</div>
    </div>

    <!-- Health Condition -->
    <div class="card health-card">
      <div class="health-header">
        <div class="health-header-label">Health-Condition</div>
        <button class="health-info-btn" id="healthInfoBtn">${ICON.info('#4A7FA5')}</button>
      </div>
      <div class="health-chart">
        <svg class="ekg-scroll" viewBox="0 0 600 58"
          style="width:200%;height:100%" preserveAspectRatio="none">
          <path class="ekg-line" d="${ekgD}"/>
        </svg>
      </div>
      <div class="health-status">${DATA.home.healthStatus}</div>
    </div>
  `;

  screen.append(makeTopBar(), scroll, makeBottomNav());

  // Hold-to-send interaction
  const card  = screen.querySelector('#emergCard');
  const ring  = screen.querySelector('#holdRing');
  const fill  = screen.querySelector('#holdFill');
  const nudge = screen.querySelector('#holdNudge');
  const CIRC  = 283;
  const HOLD  = 2000; // ms to hold before triggering
  let   raf   = null;
  let   t0    = null;
  let   nudgeTimer = null;

  function startHold(e) {
    e.preventDefault();
    clearTimeout(nudgeTimer);
    nudge.classList.remove('visible');
    endHold();
    t0 = performance.now();
    ring.style.opacity = '1';
    card.classList.add('holding');
    tick();
  }
  function tick() {
    const p = Math.min((performance.now() - t0) / HOLD, 1);
    fill.style.strokeDashoffset = CIRC * (1 - p);
    if (p < 1) { raf = requestAnimationFrame(tick); }
    else        { endHold(); goTo('affected'); }
  }
  function endHold() {
    const wasHolding = t0 !== null;
    const progress   = wasHolding ? (performance.now() - t0) / HOLD : 0;

    if (raf) cancelAnimationFrame(raf);
    raf = null; t0 = null;
    card.classList.remove('holding');
    ring.style.opacity = '0';
    fill.style.strokeDashoffset = CIRC;

    // Only fire feedback if released early (not a clean completion or fresh tap)
    if (wasHolding && progress < 1 && progress > 0.05) {
      card.classList.add('shake');
      card.addEventListener('animationend', () => card.classList.remove('shake'), { once: true });
      nudge.classList.add('visible');
      nudgeTimer = setTimeout(() => nudge.classList.remove('visible'), 1500);
    }
  }

  card.addEventListener('mousedown',   startHold);
  card.addEventListener('touchstart',  startHold, { passive: false });
  card.addEventListener('mouseup',     endHold);
  card.addEventListener('mouseleave',  endHold);
  card.addEventListener('touchend',    endHold);
  card.addEventListener('touchcancel', endHold);

  // Health detail sheet
  screen.querySelector('#healthInfoBtn').addEventListener('click', () => showHealthSheet());

  // Heatstress risk animation
  const CIRC_HEAT = 175.9;
  const heatSteps = [
    {
      pct: 62, label: 'MODERATE', warning: false,
      cardBg: '#FFFDF5', cardBorder: '#F59E0B',
      ringColor: '#F59E0B', labelColor: '#B45309',
      pulse: 'pulse-amber', throb: false,
    },
    {
      pct: 79, label: 'HIGH', warning: false,
      cardBg: '#FFF5F0', cardBorder: '#EF6C00',
      ringColor: '#EF6C00', labelColor: '#BF360C',
      pulse: 'pulse-orange', throb: false,
    },
    {
      pct: 94, label: 'CRITICAL', warning: false,
      cardBg: '#FFF0F0', cardBorder: '#D32F2F',
      ringColor: '#D32F2F', labelColor: '#B71C1C',
      pulse: 'pulse-red', throb: true,
    },
  ];

  function applyHeatStep(step) {
    const heatCard   = document.getElementById('heatCard');
    const ringWrap   = document.getElementById('ringWrap');
    const ringFill   = document.getElementById('ringFill');
    const ringPct    = document.getElementById('ringPct');
    const heatLabel  = document.getElementById('heatLabel');
    if (!heatCard) return;

    heatCard.style.background  = step.cardBg;
    heatCard.style.borderColor = step.cardBorder;
    heatCard.classList.remove('pulse-amber', 'pulse-orange', 'pulse-red');
    heatCard.classList.add(step.pulse);

    ringFill.style.stroke           = step.ringColor;
    ringFill.style.strokeDashoffset = CIRC_HEAT * (1 - step.pct / 100);
    ringPct.style.color             = step.ringColor;
    ringPct.textContent             = `${step.pct}%`;
    ringWrap.classList.toggle('throb', step.throb);

    heatLabel.style.color  = step.labelColor;
    heatLabel.textContent  = step.label;
  }

  let heatStepIdx = 0;
  let heatTimer   = null;

  screen._onActivate = () => {
    heatStepIdx = 0;
    const heatCard  = document.getElementById('heatCard');
    const ringWrap  = document.getElementById('ringWrap');
    const ringFill  = document.getElementById('ringFill');
    const ringPct   = document.getElementById('ringPct');
    const heatLabel = document.getElementById('heatLabel');
    if (heatCard) {
      heatCard.style.background  = '';
      heatCard.style.borderColor = '#E5E5E5';
      heatCard.classList.remove('pulse-amber', 'pulse-orange', 'pulse-red');
    }
    if (ringWrap)  ringWrap.classList.remove('throb');
    if (ringFill)  { ringFill.style.stroke = '#E5E5E5'; ringFill.style.strokeDashoffset = String(CIRC_HEAT); }
    if (ringPct)   { ringPct.style.color = '#AAAAAA'; ringPct.textContent = '—'; }
    if (heatLabel) { heatLabel.style.color = '#AAAAAA'; heatLabel.textContent = 'LOW'; }

    clearTimeout(heatTimer);
    function scheduleNext() {
      if (heatStepIdx >= heatSteps.length) return;
      heatTimer = setTimeout(() => {
        applyHeatStep(heatSteps[heatStepIdx]);
        heatStepIdx++;
        scheduleNext();
      }, heatStepIdx === 0 ? 2000 : 3000);
    }
    scheduleNext();
  };

  return screen;
});

/* ─────────────────────────────────────────
   HEALTH DETAIL SHEET
───────────────────────────────────────── */
function showHealthSheet() {
  const iconFor = (item) => item.color === 'red'
    ? ICON.heart('#D32F2F')
    : ICON.thermometer('#00838F');

  const miniEkg = `<svg class="metric-ekg" viewBox="0 0 72 28">
    <path d="M0,14 L18,14 L22,14 L26,4 L29,24 L32,7 L35,14 L72,14"/>
  </svg>`;

  const backdrop = el('div', 'health-backdrop');
  const sheet    = el('div', 'health-sheet');
  const handle   = el('div', 'sheet-handle');

  sheet.appendChild(handle);

  DATA.healthDetail.forEach(item => {
    const card = el('div', `metric-card ${item.color}`);
    card.innerHTML = `
      <div class="metric-header">
        ${iconFor(item)}
        <span class="metric-label">${item.label}</span>
      </div>
      <div class="metric-value-row">
        <div class="metric-value">${item.value}</div>
        ${item.ekg ? miniEkg : ''}
      </div>
      <div class="metric-guide">Guideline: ${item.guideline}</div>
    `;
    sheet.appendChild(card);
  });

  backdrop.appendChild(sheet);
  document.getElementById('app').appendChild(backdrop);

  // Animate sheet in
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

  // Tap backdrop to dismiss
  backdrop.addEventListener('click', e => { if (e.target === backdrop) dismiss(); });

  // Drag-to-dismiss on the sheet
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
    if (dragY > 100) { dismiss(); }
    else {
      sheet.style.transition = 'transform .25s cubic-bezier(.32,1,.6,1)';
      sheet.style.transform  = 'translateY(0)';
      backdrop.style.opacity = '1';
    }
    dragY = 0;
  }

  sheet.addEventListener('touchstart', onDragStart, { passive: true });
  sheet.addEventListener('touchmove',  onDragMove,  { passive: true });
  sheet.addEventListener('touchend',   onDragEnd);
  sheet.addEventListener('mousedown',  onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup',   onDragEnd);
}
