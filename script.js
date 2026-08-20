// ═══════════════════════════════════════════════════════════════
// Patrick Kilonzo Mbithi — Portfolio Scripts
// ═══════════════════════════════════════════════════════════════

// ── SCROLL NAV ──
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const THRESHOLD = 40;

  function update() {
    if (window.scrollY > THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ── HAMBURGER MENU ──
function closeMobile() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('nav-mobile');
  if (btn) btn.classList.remove('open');
  if (menu) menu.classList.remove('open');
}

(function () {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('nav-mobile');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  // Close on escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobile();
  });

  // Close when clicking outside
  var navbar = document.getElementById('navbar');
  document.addEventListener('click', function (e) {
    if (navbar && !navbar.contains(e.target) && menu.classList.contains('open')) {
      closeMobile();
    }
  });
})();

// ── SMOOTH SCROLL FOR ANCHOR LINKS ──
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        closeMobile();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();

// ── SCROLL REVEAL ──
(function () {
  // Fallback for browsers without IntersectionObserver
  if (!window.IntersectionObserver) {
    document.querySelectorAll('.reveal, .stagger-children').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  var opts = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, opts);

  document.querySelectorAll('.reveal, .stagger-children').forEach(function (el) {
    observer.observe(el);
  });
})();

// ── ACTIVE NAV LINK HIGHLIGHTING ──
(function () {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    var scrollPos = window.scrollY + 200;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.style.color = '';
          link.style.background = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--text-primary)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();
