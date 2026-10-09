/**
 * Maharashtra: Unity in Diversity 2026
 * Main Interaction Engine
 * Department of Artificial Intelligence & Data Science
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initScrollProgress();
  initBackToTop();
  initStatCounters();
  initFlipCards();
  initCultureTabs();
  initFilters();
  initFortsCarousel();
  initLightbox();
});

/* ==================================================
   1. Theme Toggle (Dark / Light)
   ================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('mh_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(toggleBtn, savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('mh_theme', next);
      updateThemeIcon(toggleBtn, next);

      // Re-render chart colors
      if (window.renderCharts) window.renderCharts();

      // Update map tiles (Dark Matter vs Voyager)
      if (window.updateMapTiles) window.updateMapTiles();
    });
  }
}

function updateThemeIcon(btn, theme) {
  if (!btn) return;
  // SVG Sun icon for dark mode (to switch to light), Moon icon for light mode (to switch to dark)
  if (theme === 'dark') {
    btn.innerHTML = `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;
    btn.setAttribute('title', 'Switch to Light Theme');
  } else {
    btn.innerHTML = `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" fill="currentColor"/></svg>`;
    btn.setAttribute('title', 'Switch to Dark Theme');
  }
}

/* ==================================================
   2. Sticky Navbar & Mobile Hamburger
   ================================================== */
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const links = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      // Lock body scroll when mobile menu is open
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link highlighter on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href="#${id}"]`);

      if (scrollY >= top && scrollY < top + height) {
        links.forEach(l => l.classList.remove('active'));
        if (navItem) navItem.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==================================================
   3. Scroll Progress Bar
   ================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  }, { passive: true });
}

/* ==================================================
   4. Back to Top Button
   ================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==================================================
   5. Animated Stat Counters
   ================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = (start + (target - start) * easeProgress);

          el.textContent = (target % 1 === 0 ? Math.floor(currentVal) : currentVal.toFixed(1)) + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

/* ==================================================
   6. Flip Cards (Marathi Phrases)
   ================================================== */
function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

/* ==================================================
   7. Culture Tabs Switching
   ================================================== */
function initCultureTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
  const contents = document.querySelectorAll('.tab-content[data-content]');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      const activeContent = document.querySelector(`.tab-content[data-content="${target}"]`);
      if (activeContent) activeContent.classList.add('active');
    });
  });
}

/* ==================================================
   8. Filters (Tourism & Personalities)
   ================================================== */
function initFilters() {
  // Tourism filters
  const tourismBtns = document.querySelectorAll('.filter-btn[data-tourism-filter]');
  const tourismCards = document.querySelectorAll('.tourism-card[data-category]');

  tourismBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tourismBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-tourism-filter');

      tourismCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Personalities filters
  const personBtns = document.querySelectorAll('.filter-btn[data-person-filter]');
  const personCards = document.querySelectorAll('.personality-card[data-category]');

  personBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      personBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-person-filter');

      personCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==================================================
   9. Forts Carousel
   ================================================== */
function initFortsCarousel() {
  const track = document.getElementById('fortsTrack');
  const prevBtn = document.getElementById('fortsPrev');
  const nextBtn = document.getElementById('fortsNext');

  if (track && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -300, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }
}

/* ==================================================
   10. Lightbox Gallery
   ================================================== */
function initLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const items = document.querySelectorAll('.gallery-item');

  if (!lightbox || !lightboxImg) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Stall Gallery Photo';
        lightbox.classList.add('active');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
    }
  });
}
