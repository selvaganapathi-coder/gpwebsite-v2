/**
 * Homepage interactions — SREC-style hero popup, thumbnails, progress.
 */
(function () {
  if (document.body.dataset.page !== 'home') return;

  const pop = document.getElementById('heroAdmissionPop');
  const closeBtn = pop?.querySelector('.hero-admission-pop__close');
  const progress = document.querySelector('.hero__progress span');
  const thumbs = document.querySelectorAll('.hero__thumb');
  const SLIDE_MS = 6000;
  let progressTimer;

  function showPopup() {
    if (!pop || sessionStorage.getItem('gp_adm_pop_dismissed')) return;
    pop.hidden = false;
    requestAnimationFrame(() => pop.classList.add('is-visible'));
  }

  function hidePopup() {
    if (!pop) return;
    pop.classList.remove('is-visible');
    sessionStorage.setItem('gp_adm_pop_dismissed', '1');
    setTimeout(() => { pop.hidden = true; }, 400);
  }

  closeBtn?.addEventListener('click', hidePopup);

  setTimeout(showPopup, 1800);

  function setActiveThumb(index) {
    thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === index));
  }

  function restartProgress() {
    if (!progress) return;
    clearInterval(progressTimer);
    progress.style.transition = 'none';
    progress.style.width = '0%';
    requestAnimationFrame(() => {
      progress.style.transition = `width ${SLIDE_MS}ms linear`;
      progress.style.width = '100%';
    });
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      const dot = document.querySelectorAll('.hero__dot')[i];
      dot?.click();
      setActiveThumb(i);
      restartProgress();
    });
  });

  document.addEventListener('hero:slide', (event) => {
    const index = event.detail?.index ?? 0;
    setActiveThumb(index);
    restartProgress();
  });

  restartProgress();
})();
