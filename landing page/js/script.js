const initHamburgerMenu = () => {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = mobileNav?.querySelectorAll('a');

  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  mobileLinks?.forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
};

const initScrollReveal = () => {
  const revealItems = document.querySelectorAll('[data-reveal]');
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
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '#top') return;

      let target = null;
      try {
        target = document.querySelector(targetId);
      } catch (error) {
        console.warn(`Smooth scroll skipped for invalid anchor "${targetId}"`, error);
        return;
      }
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
};

const initHeaderScroll = () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

const initServiceCarousel = () => {
  const wrapper = document.querySelector('.service__cards');
  const track = wrapper?.querySelector('.service__track');
  const cards = track ? Array.from(track.children) : [];
  const prevButton = document.querySelector('.service__nav--prev');
  const nextButton = document.querySelector('.service__nav--next');

  if (!wrapper || !track || cards.length === 0 || !prevButton || !nextButton) return;

  let activeIndex = Math.min(1, cards.length - 1);

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
