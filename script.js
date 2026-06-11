// ── SCROLL NAV ──
(function() {
  const nav = document.getElementById('navbar');
  const THRESHOLD = 60;
  function update() {
    if (window.scrollY > THRESHOLD) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ── HAMBURGER ──
function closeMobile() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('nav-mobile').classList.remove('open');
}
(function() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('nav-mobile');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });
})();

// ── SCROLL REVEAL ──
(function() {
  if (!window.IntersectionObserver) {
    document.querySelectorAll('.reveal,.reveal-scale,.stagger-children,.section-header')
      .forEach(el => el.classList.add('visible'));
    return;
  }
  const opts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, opts);
  document.querySelectorAll('.reveal, .reveal-scale, .stagger-children, .section-header')
    .forEach(el => revealObserver.observe(el));
})();

// ── THEME TOGGLE ──
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  localStorage.setItem('theme', document.documentElement.getAttribute('data-theme'));
}
(function() {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.setAttribute('data-theme', 'dark');
})();

// ── LOGO LOOP ──
const loopItems = [
  { label: 'Prisma', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.646 18.432l8.045-16.3c.203-.412.761-.412.964 0l8.045 16.3c.162.329-.053.714-.42.73L10 19.29c-.296.015-.558-.177-.652-.455L2.067 19.162c-.367-.016-.582-.401-.42-.73z"/></svg>' },
  { label: 'GraphQL', svg: '<svg viewBox="0 0 24 24" fill="#E10098"><path d="M12 2.25l9.526 5.5v11L12 24.25l-9.526-5.5v-11L12 2.25zm0 1.155L3.474 8.5v11l8.526 4.905L20.526 19.5v-11L12 3.405z"/></svg>' },
  { label: 'Redis', svg: '<svg viewBox="0 0 24 24" fill="#DC382D"><path d="M10.84 8.334l2.007-.944L15 8.334l-2.153.943zm-7.184 3.89L12 8.334l8.344 3.89L12 16.11zM12 0L.012 5.47l4.578 2.068L0 9.777l5.174 2.339-.65.293 7.477 3.376 7.476-3.376-.649-.293L24 9.777l-4.59-2.239L23.988 5.47zm0 18.669l-7.476-3.375-.65.293L12 19.246l8.125-3.659-.649-.293zm0 3.203l-7.476-3.375-.65.294L12 22.449l8.125-3.658-.649-.294z"/></svg>' },
  { label: 'AWS', svg: '<svg viewBox="0 0 24 24" fill="#FF9900"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.064.056.128.056.184 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.591-.894-.591-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586z"/></svg>' },
  { label: 'Supabase', svg: '<svg viewBox="0 0 24 24" fill="#3ECF8E"><path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.003.507c.015.986 1.26 1.41 1.874.637l9.262-11.652c1.093-1.375.113-3.403-1.647-3.403h-9.58l-.001-.508z"/></svg>' },
  { label: 'Vercel', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>' },
  { label: 'Figma', svg: '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="8" height="8" rx="4" fill="#F24E1E"/><rect x="2" y="10" width="8" height="8" rx="4" fill="#FF7262"/><rect x="10" y="2" width="8" height="8" rx="4" fill="#A259FF"/><rect x="10" y="10" width="8" height="8" rx="0" fill="#1ABCFE"/><circle cx="18" cy="14" r="4" fill="#0ACF83"/></svg>' },
  { label: 'Vite', svg: '<svg viewBox="0 0 24 24" fill="none"><defs><linearGradient id="vg1" x1="6" y1="0" x2="6" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="#41D1FF"/><stop offset="1" stop-color="#BD34FE"/></linearGradient></defs><path d="M22 4L12.55 19.78a.5.5 0 0 1-.86 0L2 4h4.5l5.5 9 5.5-9H22z" fill="url(#vg1)"/></svg>' },
];

(function initLogoLoop() {
  const track = document.getElementById('ll-track');
  if (!track) return;
  const render = () => {
    const items = [...loopItems, ...loopItems, ...loopItems];
    track.innerHTML = items.map(i => `
      <div class="ll-item">${i.svg}<span class="ll-label">${i.label}</span></div>`).join('');
  };
  render();

  let offset = 0, paused = false, last = null;
  const speed = 50;
  track.addEventListener('mouseenter', () => paused = true);
  track.addEventListener('mouseleave', () => paused = false);

  const singleW = () => {
    const items = track.querySelectorAll('.ll-item');
    if (!items.length) return 0;
    return (items[0].getBoundingClientRect().width + 40) * loopItems.length;
  };

  function step(ts) {
    if (!last) last = ts;
    const dt = (ts - last) / 1000;
    last = ts;
    if (!paused) {
      offset += speed * dt;
      const sw = singleW();
      if (sw > 0) offset = offset % sw;
      track.style.transform = `translateX(-${offset}px)`;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();
