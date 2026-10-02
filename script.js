// Shared layout, scroll effects, counters, filters, forms
const PAGES = [['index.html', 'Home'], ['about.html', 'About'], ['projects.html', 'Projects'], ['services.html', 'Services'], ['contact.html', 'Contact']];

const SHIELD_SVG = `
<svg viewBox="0 0 100 120" aria-hidden="true">
  <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6BA4E8"/><stop offset="1" stop-color="#A78BFA"/></linearGradient></defs>
  <path d="M50 22 C32 22 14 28 10 34 C10 74 26 100 50 114 C74 100 90 74 90 34 C86 28 68 22 50 22Z" fill="#0B192C" stroke="url(#sg)" stroke-width="3"/>
  <path d="M34 20 L36 6 L43 13 L50 2 L57 13 L64 6 L66 20Z" fill="url(#sg)"/>
  <path d="M20 44 Q16 66 32 90 M80 44 Q84 66 68 90" fill="none" stroke="#6BA4E8" stroke-width="2.5" stroke-linecap="round"/>
  <g fill="#A78BFA"><ellipse cx="17" cy="56" rx="3" ry="6" transform="rotate(-20 17 56)"/><ellipse cx="19" cy="70" rx="3" ry="6" transform="rotate(-35 19 70)"/><ellipse cx="25" cy="83" rx="3" ry="6" transform="rotate(-50 25 83)"/>
  <ellipse cx="83" cy="56" rx="3" ry="6" transform="rotate(20 83 56)"/><ellipse cx="81" cy="70" rx="3" ry="6" transform="rotate(35 81 70)"/><ellipse cx="75" cy="83" rx="3" ry="6" transform="rotate(50 75 83)"/></g>
  <circle cx="50" cy="64" r="22" fill="#1B365D" stroke="url(#sg)" stroke-width="2"/>
  <text x="50" y="76" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-weight="700" font-size="34" fill="#fff">P</text>
</svg>`;
const shield = (size) => `<span class="shield-wrapper ${size}"><span class="shield-inner">${SHIELD_SVG}</span></span>`;

function renderLayout() {
  const current = location.pathname.split('/').pop() || 'index.html';
  const links = PAGES.map(([h, t]) => `<a class="link ${h === current ? 'active' : ''}" href="${h}">${t}</a>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `
    <div id="progress"></div>
    <header class="site"><div class="container bar">
      <a class="brand" href="index.html">${shield('sm')}<span>Perry Gakpe</span></a>
      <button class="burger" aria-label="Menu" aria-expanded="false"><i class="ri-menu-line"></i></button>
      <nav class="main">${links}
        <button class="btn-donate" data-donate><span><i class="ri-heart-3-fill"></i> Donate</span></button>
      </nav></div></header>`);
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="site"><div class="container">
      <p>© ${new Date().getFullYear()} Perry Gakpe · Heraldic Futurism · Built with care in Ghana</p>
    </div></footer>`);
  const burger = document.querySelector('.burger'), nav = document.querySelector('nav.main');
  burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
}

function initScroll() {
  const progress = document.getElementById('progress');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
    document.body.style.setProperty('--scroll', scrollY);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('reveal-visible');
    e.target.querySelectorAll('.bar-fill').forEach((b) => (b.style.width = b.dataset.level + '%'));
    if (e.target.matches('[data-count]')) countUp(e.target);
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

function countUp(el) {
  if (el.dataset.done) return; el.dataset.done = 1;
  const target = +el.dataset.count, suffix = el.dataset.suffix || '', t0 = performance.now();
  const step = (t) => {
    const p = Math.min((t - t0) / 1800, 1);
    el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initTyped() {
  const el = document.querySelector('.typed'); if (!el) return;
  const words = JSON.parse(el.dataset.words); let w = 0, c = 0, del = false;
  (function tick() {
    const word = words[w];
    el.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1500); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    c += del ? -1 : 1; setTimeout(tick, del ? 40 : 90);
  })();
}

function initFilters() {
  const bar = document.querySelector('.filters'); if (!bar) return;
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    bar.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    document.querySelectorAll('#grid .card').forEach((c) => c.classList.toggle('hide', b.dataset.f !== 'all' && c.dataset.cat !== b.dataset.f));
  });
  const modal = document.getElementById('project-modal');
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-details]');
    if (t) {
      const d = t.closest('.card');
      modal.querySelector('h3').textContent = d.querySelector('h3').textContent;
      modal.querySelector('.desc').textContent = d.dataset.desc;
      modal.querySelector('.stack').innerHTML = d.dataset.stack.split(',').map((s) => `<span class="chip">${s}</span>`).join('');
      modal.classList.add('open');
    }
    if (e.target === modal || e.target.closest('#project-modal .close')) modal.classList.remove('open');
  });
}

function initToggle() {
  const t = document.querySelector('.toggle'); if (!t) return;
  t.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    t.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    document.querySelectorAll('[data-monthly]').forEach((p) => (p.textContent = '$' + (b.dataset.mode === 'm' ? p.dataset.monthly : p.dataset.project)));
    document.querySelectorAll('.per').forEach((p) => (p.textContent = b.dataset.mode === 'm' ? '/ month' : '/ project'));
  });
}

function initContact() {
  const form = document.getElementById('contact-form'); if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const body = `${d.get('message')}\n\n— ${d.get('name')} (${d.get('email')})`;
    const msg = form.querySelector('.msg');
    msg.textContent = 'Thank you! Opening your email app to send the message…'; msg.classList.add('show');
    location.href = `mailto:perrykwesi123@gmail.com?subject=${encodeURIComponent(d.get('subject') || 'Portfolio enquiry')}&body=${encodeURIComponent(body)}`;
    form.reset();
  });
  const slots = document.querySelector('.cal-wrap'), out = document.getElementById('booking-out');
  if (slots) slots.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    slots.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    out.textContent = 'Selected: ' + b.dataset.slot + ' — send a message above to confirm your booking.'; out.classList.add('show');
  });
}

renderLayout();
document.querySelectorAll('[data-shield]').forEach((el) => (el.innerHTML = shield('lg')));
initScroll(); initTyped(); initFilters(); initToggle(); initContact();

// Interactive skills grid
(function () {
  const grid = document.querySelector('.skill-grid'); if (!grid) return;
  const box = document.querySelector('.skill-detail');
  const pick = (t) => {
    grid.querySelectorAll('.skill-tile').forEach((x) => x.classList.toggle('on', x === t));
    box.querySelector('h3').textContent = t.dataset.title;
    box.querySelector('p').textContent = t.dataset.desc;
    document.getElementById('skill-bar').style.width = t.dataset.level + '%';
    document.getElementById('skill-pct').textContent = 'Proficiency: ' + t.dataset.level + '%';
  };
  grid.addEventListener('click', (e) => { const t = e.target.closest('.skill-tile'); if (t) pick(t); });
  pick(grid.firstElementChild);
})();

// Project cards: show description on thumbnail hover
document.querySelectorAll('#grid .card').forEach((c) => (c.querySelector('.thumb').dataset.more = c.dataset.desc));
