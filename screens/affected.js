/* ─────────────────────────────────────────
   SCREEN: WHO IS AFFECTED?
───────────────────────────────────────── */
registerScreen('affected', () => {
  const screen = el('div', 'screen screen--urgent');
  const scroll = el('div', 'inner-scroll');

  const heading = el('div', 'page-heading');
  heading.innerHTML = 'Who is<br>affected?';

  // Add or edit options here to change who can be selected
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

  screen.append(makeTopBar(), makeEmergHeader(false), scroll, footer, makeBottomNav());
  return screen;
});
