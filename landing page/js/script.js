/* ==========================================================
   MEGURILIFE — script.js
   Plain classic script (no ES modules) so it also runs fine
   when the file is opened directly via file:// during local
   testing, not just from a dev server. qs/qsa below replace
   the old dom.js import.
   ========================================================== */

function qs(selector, root) { return (root || document).querySelector(selector); }
function qsa(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }

/* ---------- Hamburger / mobile nav dropdown ---------- */
function initHamburgerMenu() {
  const toggle = qs('#nav-toggle');
  const mobileNav = qs('#mobile-nav');
  if (!toggle || !mobileNav) return;

  const links = qsa('a', mobileNav);

  function setMenu(open) {
    toggle.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => {
    setMenu(!mobileNav.classList.contains('open'));
  });

  links.forEach(link => link.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  // If the viewport is resized past the mobile breakpoint while open, close it
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1080 && mobileNav.classList.contains('open')) {
        setMenu(false);
      }
    }, 120);
  });
}

/* ---------- Scroll reveal (single observer, reused everywhere) ---------- */
function initScrollReveal() {
  const items = qsa('[data-reveal]');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
}

/* ---------- Smooth in-page anchor scrolling ---------- */
function initSmoothAnchors() {
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = qs(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------- Header shadow on scroll ---------- */
function initHeaderScroll() {
  const header = qs('#site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Service carousel ----------
   Transform-based (not native scroll) so the active card can grow,
   side cards can shrink/dim, and any card — including the first
   and last — can be centered precisely in the viewport. */
function initServiceCarousel() {
  const track = qs('.service__track');
  const prevBtn = qs('.service__nav--prev');
  const nextBtn = qs('.service__nav--next');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = qsa('.service-card', track);
  if (!cards.length) return;

  let activeIndex = cards.findIndex(card => card.classList.contains('service-card--active'));
  if (activeIndex === -1) activeIndex = 0;

  function render() {
    cards.forEach((card, idx) => {
      card.classList.toggle('service-card--active', idx === activeIndex);
    });

    // Wait a frame so the active card's new (larger) width is applied
    // before we measure offsets — otherwise centering math uses stale sizes.
    requestAnimationFrame(() => {
      const viewport = track.parentElement;
      if (!viewport) return;
      const activeCard = cards[activeIndex];
      const cardCenter = activeCard.offsetLeft + activeCard.offsetWidth / 2;
      const viewportCenter = viewport.offsetWidth / 2;
      const maxOffset = Math.max(0, track.scrollWidth - viewport.offsetWidth);
      const rawOffset = cardCenter - viewportCenter;
      const offset = Math.min(Math.max(rawOffset, 0), maxOffset);
      track.style.transform = `translateX(-${offset}px)`;
    });
  }

  prevBtn.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + cards.length) % cards.length;
    render();
  });

  nextBtn.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % cards.length;
    render();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 150);
  });

  render();
}

/* ---------- Init everything ---------- */
function initSite() {
  const features = [
    initHamburgerMenu,
    initHeaderScroll,
    initServiceCarousel,
    initScrollReveal,
    initSmoothAnchors,
  ];

  features.forEach((fn) => {
    try {
      fn();
    } catch (error) {
      console.error(`Failed to initialise ${fn.name || 'a site feature'}`, error);
    }
  });
}

document.addEventListener('DOMContentLoaded', initSite);

/* ---- CommonJS exports for tests ---- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initHamburgerMenu,
    initScrollReveal,
    initSmoothAnchors,
    initHeaderScroll,
    initServiceCarousel,
    initSite,
  };
}