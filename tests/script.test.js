const path = require('path');

const SCRIPT_PATH = path.resolve(__dirname, '../landing page/js/script.js');

const {
  initHamburgerMenu,
  initScrollReveal,
  initSmoothAnchors,
  initHeaderScroll,
  initServiceCarousel,
  initSite,
} = require(SCRIPT_PATH);

const resetDom = () => {
  document.body.innerHTML = '';
};

afterEach(() => {
  resetDom();
  jest.restoreAllMocks();
});

describe('initHamburgerMenu', () => {
  const buildDom = () => {
    document.body.innerHTML = `
      <button class="nav-toggle" aria-expanded="false"></button>
      <div class="mobile-nav">
        <a href="#a">A</a>
        <a href="#b">B</a>
      </div>
    `;
  };

  test('does nothing when toggle or mobile nav is missing', () => {
    document.body.innerHTML = '<button class="nav-toggle"></button>';
    expect(() => initHamburgerMenu()).not.toThrow();
  });

  test('toggles open state and aria-expanded on toggle click', () => {
    buildDom();
    initHamburgerMenu();
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.classList.contains('open')).toBe(true);
    expect(mobileNav.classList.contains('open')).toBe(true);

    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.classList.contains('open')).toBe(false);
    expect(mobileNav.classList.contains('open')).toBe(false);
  });

  test('clicking a mobile link closes the menu', () => {
    buildDom();
    initHamburgerMenu();
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    toggle.click();
    expect(mobileNav.classList.contains('open')).toBe(true);

    mobileNav.querySelector('a').click();
    expect(toggle.classList.contains('open')).toBe(false);
    expect(mobileNav.classList.contains('open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('initHeaderScroll', () => {
  test('does nothing when header is missing', () => {
    expect(() => initHeaderScroll()).not.toThrow();
  });

  test('adds and removes scrolled class based on scroll position', () => {
    document.body.innerHTML = '<header class="site-header"></header>';
    const header = document.querySelector('.site-header');

    window.scrollY = 0;
    initHeaderScroll();
    expect(header.classList.contains('scrolled')).toBe(false);

    window.scrollY = 100;
    window.dispatchEvent(new Event('scroll'));
    expect(header.classList.contains('scrolled')).toBe(true);

    window.scrollY = 10;
    window.dispatchEvent(new Event('scroll'));
    expect(header.classList.contains('scrolled')).toBe(false);
  });
});

describe('initSmoothAnchors', () => {
  test('ignores plain "#" and "#top" links', () => {
    document.body.innerHTML = `
      <a href="#" id="hash">hash</a>
      <a href="#top" id="top-link">top</a>
    `;
    initSmoothAnchors();

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const prevented = !document.getElementById('hash').dispatchEvent(event);
    expect(prevented).toBe(false);
  });

  test('does not prevent default when target is missing', () => {
    document.body.innerHTML = '<a href="#missing" id="link">go</a>';
    initSmoothAnchors();

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const prevented = !document.getElementById('link').dispatchEvent(event);
    expect(prevented).toBe(false);
  });

  test('scrolls to the target and prevents default for valid anchors', () => {
    document.body.innerHTML = `
      <a href="#section" id="link">go</a>
      <section id="section"></section>
    `;
    const scrollIntoView = jest.fn();
    document.getElementById('section').scrollIntoView = scrollIntoView;
    initSmoothAnchors();

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const prevented = !document.getElementById('link').dispatchEvent(event);

    expect(prevented).toBe(true);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });
});

describe('initScrollReveal', () => {
  test('does nothing when there are no reveal items', () => {
    const spy = jest.fn();
    global.IntersectionObserver = jest.fn(() => ({ observe: spy, unobserve: jest.fn() }));
    initScrollReveal();
    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  test('observes items and reveals them on intersection', () => {
    document.body.innerHTML = `
      <div data-reveal id="a"></div>
      <div data-reveal id="b"></div>
    `;
    const observe = jest.fn();
    const unobserve = jest.fn();
    let capturedCallback;
    global.IntersectionObserver = jest.fn((cb) => {
      capturedCallback = cb;
      return { observe, unobserve };
    });

    initScrollReveal();
    expect(observe).toHaveBeenCalledTimes(2);

    const target = document.getElementById('a');
    const obs = { unobserve };
    capturedCallback(
      [
        { isIntersecting: false, target: document.getElementById('b') },
        { isIntersecting: true, target },
      ],
      obs
    );

    expect(target.classList.contains('is-visible')).toBe(true);
    expect(unobserve).toHaveBeenCalledWith(target);
    expect(document.getElementById('b').classList.contains('is-visible')).toBe(false);
  });
});

describe('initServiceCarousel', () => {
  const buildDom = () => {
    document.body.innerHTML = `
      <button class="service__nav--prev"></button>
      <div class="service__cards">
        <div class="service__track">
          <article class="service-card service-card--active"></article>
          <article class="service-card"></article>
          <article class="service-card"></article>
        </div>
      </div>
      <button class="service__nav--next"></button>
    `;
  };

  test('does nothing when required elements are missing', () => {
    document.body.innerHTML = '<div class="service__cards"></div>';
    expect(() => initServiceCarousel()).not.toThrow();
  });

  test('advances to next card and marks it active', () => {
    buildDom();
    initServiceCarousel();
    const cards = document.querySelectorAll('.service-card');

    expect(cards[1].classList.contains('service-card--active')).toBe(true);

    document.querySelector('.service__nav--next').click();
    expect(cards[2].classList.contains('service-card--active')).toBe(true);
    expect(cards[1].classList.contains('service-card--active')).toBe(false);
  });

  test('wraps around when going next past the last card', () => {
    buildDom();
    initServiceCarousel();
    const cards = document.querySelectorAll('.service-card');
    const next = document.querySelector('.service__nav--next');

    next.click(); // index 2
    next.click(); // wraps to 0
    expect(cards[0].classList.contains('service-card--active')).toBe(true);
  });

  test('wraps around when going prev before the first card', () => {
    buildDom();
    initServiceCarousel();
    const cards = document.querySelectorAll('.service-card');
    const prev = document.querySelector('.service__nav--prev');

    prev.click(); // from 1 -> 0
    prev.click(); // wraps to 2
    expect(cards[2].classList.contains('service-card--active')).toBe(true);
  });

  test('recenters the track on window resize', () => {
    buildDom();
    const raf = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => cb());
    initServiceCarousel();

    window.dispatchEvent(new Event('resize'));
    expect(raf).toHaveBeenCalled();
  });
});

describe('initSite', () => {
  test('wires up every feature without throwing', () => {
    global.IntersectionObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
    document.body.innerHTML = `
      <header class="site-header"></header>
      <button class="nav-toggle" aria-expanded="false"></button>
      <div class="mobile-nav"><a href="#a">A</a></div>
      <div data-reveal></div>
      <a href="#top">top</a>
    `;
    expect(() => initSite()).not.toThrow();
  });
});
