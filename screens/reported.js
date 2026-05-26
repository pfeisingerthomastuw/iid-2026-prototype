/* ─────────────────────────────────────────
   SCREEN: EMERGENCY REPORTED
───────────────────────────────────────── */
registerScreen('reported', () => {
  const screen = el('div', 'screen');
  const scroll = el('div', 'inner-scroll');

  const heading = el('div', 'page-heading');
  heading.innerHTML = 'Emergency<br>reported';

  const confirmIcon = el('div', 'confirm-icon');
  confirmIcon.innerHTML = ICON.check('white');

  const confirmText = el('p', 'confirm-text');
  confirmText.innerHTML = 'Help is already on the way<br>Your location is being shared with nearby responders';

  // Extra info box built from DATA.symptoms
  const extraBox   = el('div', 'extra-box');
  const extraTitle = el('div', 'extra-box-title');
  extraTitle.textContent = 'You can provide extra information';
  const extraSub = el('div', 'extra-box-sub');
  extraSub.textContent = 'Information helps your responder';

  const grid = el('div', 'symptoms-grid');
  DATA.symptoms.forEach(sym => {
    const row = el('div', 'symptom-row');
    const chk = el('div', 'sym-check');
    const lbl = el('div', 'sym-label');
    lbl.innerHTML = sym.label.replace('\n', '<br>');
    const ico = el('span', 'sym-icon');
    ico.textContent = sym.icon;

    row.append(chk, lbl, ico);
    row.addEventListener('click', () => {
      row.classList.toggle('checked');
      chk.innerHTML = row.classList.contains('checked')
        ? ICON.checkSmall('white')
        : '';
    });
    grid.appendChild(row);
  });

  extraBox.append(extraTitle, extraSub, grid);

  const shareBtn = el('button', 'btn-teal');
  shareBtn.textContent = 'Share extra Info';
  shareBtn.addEventListener('click', () =>
    showToast('Information shared', 'Your responder has been notified'));

  scroll.append(heading, confirmIcon, confirmText, extraBox, shareBtn);

  const footer = el('div', 'cancel-footer');
  const cancelBtn = el('button', 'btn-outline');
  cancelBtn.textContent = 'Cancel Emergency';
  cancelBtn.addEventListener('click', () => showCancelDialog(() => goTo('home')));
  const note = el('p', 'cancel-note');
  note.textContent = 'Only cancel if the emergency was triggered accidently';
  footer.append(cancelBtn, note);

  screen.append(makeTopBar(), makeEmergHeader(true), scroll, footer, makeBottomNav());

  // Re-trigger the pop-in animation each time this screen is shown
  screen._onActivate = () => {
    const icon = screen.querySelector('.confirm-icon');
    icon.style.animation = 'none';
    void icon.offsetWidth;
    icon.style.animation = '';
  };

  return screen;
});
