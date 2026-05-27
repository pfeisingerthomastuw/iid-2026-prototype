/* ─────────────────────────────────────────
   SCREEN: FIRST AID — HEAT EMERGENCY
   Step-by-step heat emergency first aid.
   Reached from help-map route card.
───────────────────────────────────────── */
registerScreen('firstaid', () => {
  const screen = el('div', 'screen');

  const steps = [
    {
      num: 1,
      title: 'Move to a cool place',
      body: 'Bring the person indoors, into shade, or near a fan. Avoid direct sunlight.',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00838F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>`,
    },
    {
      num: 2,
      title: 'Cool the body',
      body: 'Apply cold, wet cloths to neck, armpits, and groin. Use ice packs if available. Fan the person while misting with cool water.',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00838F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2C6 10 4 14 4 16a8 8 0 0 0 16 0c0-2-2-6-8-14z"/>
      </svg>`,
    },
    {
      num: 3,
      title: 'Give water if conscious',
      body: 'If the person is awake and can swallow, offer small sips of cool water. Avoid alcohol or caffeine.',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00838F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 8h14l-1.5 9.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 8z"/>
        <path d="M5 8a4 4 0 0 1 7-2.65A4 4 0 0 1 19 8"/>
      </svg>`,
    },
    {
      num: 4,
      title: 'Do NOT give food or medicine',
      body: 'Avoid aspirin and paracetamol — they do not lower heat stroke body temperature and may cause harm.',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>`,
    },
    {
      num: 5,
      title: 'Monitor and position',
      body: 'Keep the person lying down with legs slightly elevated. If unconscious, place in recovery position. Check breathing every 2 minutes.',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00838F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>`,
    },
    {
      num: 6,
      title: 'Call emergency services',
      body: 'Dial 144 (Austria emergency) immediately if symptoms worsen, the person loses consciousness, or seizures occur.',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35a2 2 0 0 1 1.98-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.09 6.09l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>`,
    },
  ];

  // Header section
  const header = el('div', 'fa-header');
  header.innerHTML = `
    <div class="emerg-tag teal" style="margin-bottom:4px">FIRST AID</div>
    <div class="emerg-bar teal"></div>
    <div class="fa-title">Heat Emergency</div>
    <div class="fa-subtitle">Follow these steps while waiting for help to arrive</div>
  `;


  // Steps
  const stepList = el('div', 'fa-steps');
  steps.forEach(s => {
    const card = el('div', 'fa-step-card');
    const urgent = s.num === 4 || s.num === 6;
    card.innerHTML = `
      <div class="fa-step-icon${urgent ? ' urgent' : ''}">${s.icon}</div>
      <div class="fa-step-body">
        <div class="fa-step-num">Step ${s.num}</div>
        <div class="fa-step-title">${s.title}</div>
        <div class="fa-step-text">${s.body}</div>
      </div>
    `;
    stepList.appendChild(card);
  });

  // Emergency call button
  const callBtn = el('button', 'btn-red fa-call-btn');
  callBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35a2 2 0 0 1 1.98-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.09 6.09l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
    If the person is unconscious or not breathing, call 144
  `;
  callBtn.addEventListener('click', () => { window.location.href = 'tel:123'; });

  const backBtn = el('button', 'btn-outline fa-back-btn');
  backBtn.textContent = '← Back to Navigation';
  backBtn.addEventListener('click', () => history.back());

  const content = el('div', 'fa-content');
  content.append(header, callBtn, stepList, backBtn);

  screen.append(makeTopBar(), content, makeBottomNav('firstaid'));

  return screen;
});
