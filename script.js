/* ============================================================
   NAV — scroll shrink + hamburger toggle
   ============================================================ */
const nav = document.querySelector('.nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealEls = document.querySelectorAll(
  '.about-grid, .project-card, .bento-card, .volunteer-card, .gh-stat-card, .contrib-graph-wrap, .contact-wrap'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

/* ============================================================
   CONTRIBUTION GRAPH — seeded random data
   ============================================================ */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function buildContribGraph() {
  const container = document.getElementById('contribGraph');
  if (!container) return;

  const rand = seededRandom(42);
  const weeks = 52;

  // Bias toward higher contributions in recent weeks
  for (let w = 0; w < weeks; w++) {
    const col = document.createElement('div');
    col.className = 'contrib-col';

    for (let d = 0; d < 7; d++) {
      const cell = document.createElement('div');
      cell.className = 'contrib-cell';

      const r = rand();
      const recencyBoost = w / weeks;

      let level;
      if (r < 0.35 - recencyBoost * 0.1)   level = 0;
      else if (r < 0.55) level = 1;
      else if (r < 0.72) level = 2;
      else if (r < 0.88) level = 3;
      else                level = 4;

      // Occasional blank days (weekends)
      if (d >= 5 && rand() < 0.45) level = 0;

      cell.dataset.level = level;
      col.appendChild(cell);
    }
    container.appendChild(col);
  }
}

buildContribGraph();

/* ============================================================
   CONTACT FORM — mock submit
   ============================================================ */
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Message Sent!';
    success.classList.add('show');
    form.reset();
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      success.classList.remove('show');
    }, 4000);
  }, 1200);
});

/* ============================================================
   ACTIVE NAV LINK on scroll
   ============================================================ */
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--espresso)' : '';
  });
});
