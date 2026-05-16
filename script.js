/* =========================================================
   SPIN A TALE — interaction logic
   ========================================================= */

(function () {
  const body = document.body;
  const loaderValue = document.getElementById('loaderValue');
  const startButton = document.getElementById('startButton');
  const restartButton = document.getElementById('restart');
  const story = document.getElementById('story');
  const sections = Array.from(document.querySelectorAll('.story-section'));
  const soundToggle = document.getElementById('soundToggle');

  /* -------- Loader: 0 → 100 -------- */
  function runLoader() {
    let value = 0;
    const target = 100;
    const tick = () => {
      // Slow toward the end for drama
      const step = value < 70 ? 2 + Math.random() * 3 : 0.6 + Math.random() * 1.4;
      value = Math.min(target, value + step);
      loaderValue.textContent = String(Math.floor(value)).padStart(2, '0');
      if (value < target) {
        requestAnimationFrame(tick);
      } else {
        finishLoading();
      }
    };
    requestAnimationFrame(tick);
  }

  function finishLoading() {
    setTimeout(() => {
      body.classList.remove('is-loading');
      body.classList.add('show-prologue');
      // After prologue, fade to title
      setTimeout(() => {
        body.classList.remove('show-prologue');
        body.classList.add('show-title');
      }, 2400);
    }, 400);
  }

  /* -------- Start button -------- */
  startButton.addEventListener('click', () => {
    body.classList.remove('show-title');
    body.classList.add('story-started');
    // Activate the first section immediately
    setTimeout(() => updateActiveSection(), 400);
    // Smooth-scroll to top so user can scroll forward
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  });

  /* -------- Scroll-driven section switching -------- */
  function updateActiveSection() {
    if (!body.classList.contains('story-started')) return;

    const total = sections.length;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / max));
    // Map progress 0..1 to a section index
    let idx = Math.floor(progress * total);
    if (idx >= total) idx = total - 1;

    sections.forEach((sec, i) => {
      sec.classList.toggle('is-active', i === idx);
    });

    // Mark when we reach the final section
    if (idx === total - 1) {
      body.classList.add('story-finished');
    } else {
      body.classList.remove('story-finished');
    }
  }

  let scrollRaf = null;
  window.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      updateActiveSection();
      scrollRaf = null;
    });
  }, { passive: true });
  window.addEventListener('resize', updateActiveSection);

  /* -------- Restart -------- */
  if (restartButton) {
    restartButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      body.classList.remove('story-started', 'story-finished');
      sections.forEach(s => s.classList.remove('is-active'));
      // Replay title
      body.classList.add('show-title');
    });
  }

  /* -------- Sound toggle (visual only — no audio file shipped) -------- */
  let soundOn = false;
  soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;
    soundToggle.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
  });

  /* -------- Kick off -------- */
  runLoader();
})();
