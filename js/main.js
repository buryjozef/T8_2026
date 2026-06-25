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

/* --- Partners / sponsors (index.html, future partneri.html) --- */
function renderLogoLink(className, placeholderClassName, item) {
  const link = document.createElement('a');
  link.className = className;
  link.href = item.url;
  link.target = '_blank';
  link.rel = 'noopener';

  const img = document.createElement('img');
  img.src = item.logo;
  img.alt = item.name;
  img.onerror = () => {
    img.remove();
    const placeholder = document.createElement('span');
    placeholder.className = placeholderClassName;
    placeholder.textContent = item.name;
    link.appendChild(placeholder);
  };
  link.appendChild(img);
  return link;
}

function initPartners() {
  if (typeof PARTNERS_CONFIG === 'undefined') return;

  const sponsorMainEl = document.getElementById('sponsorMain');
  if (sponsorMainEl) {
    const sponsor = PARTNERS_CONFIG.mainSponsor;
    if (PARTNERS_CONFIG.showMainSponsor && sponsor) {
      sponsorMainEl.appendChild(renderLogoLink('sponsor-main', 'sponsor-main-placeholder', sponsor));
    } else {
      sponsorMainEl.hidden = true;
    }
  }

  const partnersGridEl = document.getElementById('partnersGrid');
  if (partnersGridEl) {
    (PARTNERS_CONFIG.partners || []).forEach(partner => {
      partnersGridEl.appendChild(renderLogoLink('partner-card', 'partner-card-placeholder', partner));
    });
  }
}

/* --- Site config (registration URL, edition, race date) --- */
const SK_MONTHS_GENITIVE = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];
const SK_MONTHS_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

function initSiteConfig() {
  if (typeof SITE_CONFIG === 'undefined') return;

  const raceDate = new Date(SITE_CONFIG.raceDate + 'T00:00:00');
  const day = raceDate.getDate();
  const month = raceDate.getMonth();
  const year = raceDate.getFullYear();
  const raceDateDisplay = `${day}. ${SK_MONTHS_GENITIVE[month]} ${year}`;

  document.querySelectorAll('[data-config-href="registration-url"]').forEach(el => {
    el.href = SITE_CONFIG.registrationUrl;
  });
  document.querySelectorAll('[data-config="edition"]').forEach(el => {
    el.textContent = SITE_CONFIG.edition;
  });
  document.querySelectorAll('[data-config="year"]').forEach(el => {
    el.textContent = year;
  });
  document.querySelectorAll('[data-config="race-date"]').forEach(el => {
    el.textContent = raceDateDisplay;
  });
  document.querySelectorAll('[data-config="race-day"]').forEach(el => {
    el.textContent = day;
  });
  document.querySelectorAll('[data-config="race-month-abbr"]').forEach(el => {
    el.textContent = SK_MONTHS_ABBR[month];
  });
}

/* --- Init on DOM ready --- */
document.addEventListener('DOMContentLoaded', () => {
  initSiteConfig();
  initYearFilter();
  initPartners();
});
