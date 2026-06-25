/* =========================================
   TAJCHOVÁ OSMIČKA — main.js
   ========================================= */

/* --- Navigation --- */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const nav = document.querySelector('.nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // nav shadow on scroll
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // auto-mark active nav link
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* --- Scroll reveal --- */
(function () {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    io.observe(el);
  });
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.revealed').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  });

  const style = document.createElement('style');
  style.textContent = '.revealed { opacity: 1 !important; transform: none !important; }';
  document.head.appendChild(style);
})();

/* --- Lightbox (galeria.html) --- */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lightboxClose');
  if (!lb) return;

  document.querySelectorAll('.g-photo[data-src]').forEach(photo => {
    photo.addEventListener('click', () => {
      const src = photo.getAttribute('data-src');
      lbImg.src = src;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLB() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  if (lbClose) lbClose.addEventListener('click', closeLB);
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
}

/* --- Year filter (infoservis.html) --- */
function initYearFilter() {
  const tabs = document.querySelectorAll('.year-tab');
  const sections = document.querySelectorAll('.year-section');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const year = tab.getAttribute('data-year');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      sections.forEach(s => {
        s.style.display = (year === 'all' || s.getAttribute('data-year') === year) ? '' : 'none';
      });
    });
  });
}

/* --- Gallery filter (galeria.html) --- */
function initGalleryFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const photos = document.querySelectorAll('.g-photo');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const yr = btn.getAttribute('data-year');
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      photos.forEach(p => {
        p.style.display = (yr === 'all' || p.getAttribute('data-year') === yr) ? '' : 'none';
      });
    });
  });
}

/* --- Init on DOM ready --- */
document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
  initYearFilter();
  initGalleryFilter();
});
