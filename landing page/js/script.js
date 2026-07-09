import { qs, qsa } from './dom.js';

const initHamburgerMenu = () => {
  const toggle = qs('.nav-toggle');
  const mobileNav = qs('.mobile-nav');
  const mobileLinks = mobileNav ? qsa('a', mobileNav) : [];

  if (!toggle || !mobileNav) return;

  const setMenu = (open) => {
    toggle.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setMenu(!mobileNav.classList.contains('open'));
  });

  mobileLinks?.forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });
};

const initScrollReveal = () => {
  const revealItems = qsa('[data-reveal]');
  if (!revealItems.length) return;

  const revealAll = () => revealItems.forEach((item) => item.classList.add('is-visible'));

  if (!('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
};

const initSmoothAnchors = () => {
  qsa('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '#top') return;
      const target = qs(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
};

const initHeaderScroll = () => {
  const header = qs('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

const initServiceCarousel = () => {
  const wrapper = qs('.service__cards');
  const track = wrapper ? qs('.service__track', wrapper) : null;
  const cards = track ? Array.from(track.children) : [];
  const prevButton = document.querySelector('.service__nav--prev');
  const nextButton = document.querySelector('.service__nav--next');

  if (!wrapper || !track || cards.length === 0 || !prevButton || !nextButton) return;

  const initialActive = cards.findIndex((card) => card.classList.contains('service-card--active'));
  let activeIndex = initialActive === -1 ? 0 : initialActive;

  const updateCarousel = () => {
    cards.forEach((card, index) => {
      card.classList.toggle('service-card--active', index === activeIndex);
    });

    const activeCard = cards[activeIndex];
    const wrapperWidth = wrapper.clientWidth;
    const cardWidth = activeCard.clientWidth;
    const offset = Math.max(0, Math.min(activeCard.offsetLeft - (wrapperWidth - cardWidth) / 2, track.scrollWidth - wrapperWidth));
    track.style.transform = `translateX(${-offset}px)`;
  };

  prevButton.addEventListener('click', () => {
    activeIndex = (activeIndex + cards.length - 1) % cards.length;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % cards.length;
    updateCarousel();
  });

  window.addEventListener('resize', () => window.requestAnimationFrame(updateCarousel));
  updateCarousel();
};

const initSite = () => {
  const features = [
    initHamburgerMenu,
    initHeaderScroll,
    initServiceCarousel,
    initScrollReveal,
    initSmoothAnchors,
  ];

  features.forEach((init) => {
    try {
      init();
    } catch (error) {
      console.error(`Failed to initialise ${init.name || 'site feature'}`, error);
    }
  });
};

document.addEventListener('DOMContentLoaded', initSite);

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
