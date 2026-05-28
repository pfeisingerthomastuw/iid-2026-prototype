/* ─────────────────────────────────────────
   SCREEN: ON-SITE ASSESSMENT (Task 2 end / Task 3 entry)
   Responder has arrived. First step: assess
   whether the worker is conscious.
   Task 3 (support + resolve) continues from here.
───────────────────────────────────────── */
registerScreen('on-site', () => {
  const screen  = el('div', 'screen');
  const content = el('div', 'onsite-content');

  const question = el('div', 'onsite-question');
  question.textContent = 'Is the worker conscious?';

  const guide = el('div', 'onsite-check-guide');
  guide.innerHTML = `
    <div class="onsite-check-guide-title">How to check</div>
    <div class="onsite-check-step">
      <div class="onsite-check-num">1</div>
      <span>Tap their shoulder firmly</span>
    </div>
    <div class="onsite-check-step">
      <div class="onsite-check-num">2</div>
      <span>Call their name loudly</span>
    </div>
    <div class="onsite-check-threshold">No reaction to either → unconscious</div>
  `;

  const yesCard = el('div', 'onsite-card teal');
  yesCard.innerHTML = `
    <div class="onsite-card-label">YES — CONSCIOUS</div>
    <div class="onsite-card-sub">Responsive to voice or touch</div>
  `;
  yesCard.addEventListener('click', () => goTo('support-conscious'));

  const noCard = el('div', 'onsite-card red');
  noCard.innerHTML = `
    <div class="onsite-card-label">NO — UNCONSCIOUS</div>
    <div class="onsite-card-sub">Not responding — call 144 immediately</div>
  `;
  noCard.addEventListener('click', () => goTo('support-unconscious'));

  content.append(question, guide, yesCard, noCard);
  screen.append(makeTopBar(), makeEmergHeader(true), content, makeBottomNav());
  return screen;
});
