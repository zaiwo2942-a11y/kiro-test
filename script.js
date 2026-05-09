/* =========================================================
   献给妈妈的母亲节网页 — 交互脚本
   作者：李圳
   ========================================================= */

/* ---------- 1. 背景花瓣雨（手机端降低数量以保证流畅） ---------- */
(function createPetals() {
  const container = document.getElementById('petals');
  const isMobile = window.innerWidth < 600;
  const NUM = isMobile ? 14 : 28;
  for (let i = 0; i < NUM; i++) {
    const p = document.createElement('div');
    p.className = 'petal-item';
    const size = 10 + Math.random() * 18;
    p.style.width  = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (8 + Math.random() * 10) + 's';
    p.style.animationDelay = (-Math.random() * 15) + 's';
    p.style.opacity = 0.5 + Math.random() * 0.5;
    const hue = 330 + Math.random() * 30;
    p.style.background = `radial-gradient(circle at 30% 30%, hsl(${hue},100%,85%), hsl(${hue},70%,65%) 70%, hsl(${hue},60%,50%))`;
    container.appendChild(p);
  }
})();

/* ---------- 2. 礼物盒点击打开 ---------- */
(function giftBox() {
  const box = document.getElementById('giftbox');
  const heartsContainer = document.getElementById('giftHearts');
  let opened = false;

  box.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    box.classList.add('opened');
    // 飞出爱心
    for (let i = 0; i < 12; i++) {
      const h = document.createElement('span');
      h.className = 'fly-heart';
      h.textContent = ['❤', '💕', '💖', '🌸', '✨'][i % 5];
      h.style.fontSize = (18 + Math.random() * 16) + 'px';
      heartsContainer.appendChild(h);

      const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.4;
      const dist  = 120 + Math.random() * 100;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 100;

      gsap.fromTo(h,
        { x: 0, y: 0, opacity: 0, scale: 0.5 },
        {
          x: dx, y: dy, opacity: 1, scale: 1.2,
          duration: 1.6, ease: 'power2.out',
          onComplete: () => {
            gsap.to(h, { opacity: 0, duration: 0.6, onComplete: () => h.remove() });
          }
        });
    }
    // 打开后自动滚动到第 2 屏
    setTimeout(() => {
      document.getElementById('screen2').scrollIntoView({ behavior: 'smooth' });
    }, 1400);
  });
})();

/* ---------- 3. 打字机效果（第 2 屏） ---------- */
(function typewriter() {
  const el = document.getElementById('typewriter');
  const text = '献给世界上最好的妈妈，\n妈妈我爱你！';
  let started = false;

  function start() {
    if (started) return;
    started = true;
    let i = 0;
    const t = setInterval(() => {
      const ch = text[i];
      if (ch === '\n') {
        el.innerHTML += '<br>';
      } else {
        el.innerHTML += ch;
      }
      i++;
      if (i >= text.length) {
        clearInterval(t);
        el.classList.add('done');
      }
    }, 180);
  }

  // 当第 2 屏进入视口时开始
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) start(); });
  }, { threshold: 0.4 });
  observer.observe(document.getElementById('screen2'));
})();

/* ---------- 4. 时光轴滚动显示 ---------- */
(function timelineReveal() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  items.forEach(i => observer.observe(i));
})();

/* ---------- 5. 优点卡片淡入 ---------- */
(function virtueReveal() {
  const cards = document.querySelectorAll('.virtue-card');
  cards.forEach((c, idx) => {
    c.style.opacity = 0;
    c.style.transform = 'translateY(30px)';
    c.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34,1.56,0.64,1)';
    c.style.transitionDelay = (idx * 0.12) + 's';
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        cards.forEach(c => { c.style.opacity = 1; c.style.transform = 'translateY(0)'; });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });
  observer.observe(document.getElementById('screen3'));
})();

/* ---------- 6. 结尾花朵绽放 ---------- */
(function flowerBloom() {
  const flower = document.getElementById('finaleFlower');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        flower.classList.add('bloom');
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(flower);
})();

/* ---------- 7. 爱心按钮 —— 飞出满屏爱心 ---------- */
(function heartButton() {
  const btn = document.getElementById('heartBtn');
  const layer = document.getElementById('heartsLayer');
  const emojis = ['❤', '💕', '💖', '💗', '💓', '🌸', '🌷', '✨'];
  const isMobile = window.innerWidth < 600;
  const COUNT = isMobile ? 24 : 40;

  btn.addEventListener('click', () => {
    for (let i = 0; i < COUNT; i++) {
      setTimeout(() => {
        const h = document.createElement('span');
        h.className = 'big-heart';
        h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        h.style.left = Math.random() * 100 + 'vw';
        h.style.fontSize = (18 + Math.random() * 24) + 'px';
        h.style.animationDuration = (2.5 + Math.random() * 2) + 's';
        layer.appendChild(h);
        setTimeout(() => h.remove(), 5000);
      }, i * 70);
    }
    // 按钮弹一下
    btn.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }],
      { duration: 300 }
    );
  });
})();

/* ---------- 8. 滚动提示点击 ---------- */
document.getElementById('scrollDown').addEventListener('click', () => {
  document.getElementById('screen2').scrollIntoView({ behavior: 'smooth' });
});
