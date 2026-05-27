/* ─────────────────────────────────────────
   SCREEN: WHO IS AFFECTED?
───────────────────────────────────────── */
registerScreen('affected', () => {
  const screen = el('div', 'screen screen--urgent');

  // ── Back button in header (Fix #3) ───────────
  const header = el('div', 'emerg-page-header');
  header.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
      <button class="aff-back-btn">← Back</button>
      <div class="emerg-tag" style="margin:0">REPORT EMERGENCY</div>
    </div>
    <div class="emerg-bar"></div>
  `;
  header.querySelector('.aff-back-btn').addEventListener('click', () => history.back());

  const scroll = el('div', 'inner-scroll');

  const heading = el('div', 'page-heading');
  heading.innerHTML = 'Who is<br>affected?';

  const options = [
    { label: 'MYSELF',       iconBg: 'red', icon: ICON.personLarge('#C62828'), target: 'reported' },
    { label: 'SOMEONE ELSE', iconBg: '',    icon: ICON.group('#888888'),        target: 'reported' },
  ];

  options.forEach(opt => {
    const card = el('div', 'select-card');
    card.innerHTML = `
      <div class="select-icon-bg ${opt.iconBg}">${opt.icon}</div>
      <div class="select-label">${opt.label}</div>`;
    card.addEventListener('click', () => showLoading(1500, () => goTo(opt.target)));
    scroll.appendChild(card);
  });

  scroll.prepend(heading);

  const footer = el('div', 'cancel-footer');
  const cancelBtn = el('button', 'btn-outline');
  cancelBtn.textContent = 'Cancel Emergency';
  cancelBtn.addEventListener('click', () => showCancelDialog(() => goTo('home')));
  const note = el('p', 'cancel-note');
  note.textContent = 'Only cancel if the emergency was triggered accidently';
  footer.append(cancelBtn, note);

  screen.append(makeTopBar(), header, scroll, footer, makeBottomNav());
  return screen;
});
