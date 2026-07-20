# client-project
# client-project

> **MEGURILIFE** — Corporate landing page for Megurilife Co., Ltd. A static Japanese-language site showcasing the company's waste management and collection services that support Miharu City's environmental infrastructure. Features custom illustrations, on-site photography, a service carousel, and scroll-reveal animations.

**Client:** Megurilife Co., Ltd. (株式会社メグリライフ) — Miharu City's environmental infrastructure company handling waste processing and collection.

## Overview

A community-focused static website that introduces Megurilife's business of protecting the local environment through proper waste management, presented with original illustrations and on-site photography.

## Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (static) |
| Styling | CSS (custom properties) |
| Language | Japanese (`lang="ja"`) |
| Fonts | Montserrat (Latin) + Hiragino Sans / Noto Sans JP (Japanese) |
| Scripting | Vanilla JS — IntersectionObserver scroll-reveal, carousel, hamburger menu |
| Testing | Jest + jest-environment-jsdom |
| Deployment | Vercel (output dir: `landing page`) |

## Sections

| Section | ID | Content |
|---|---|---|
| Header | — | Fixed navigation, mobile hamburger menu |
| Hero | `#top` | Animated title: "めぐりめぐって地域のしあわせに、つながる仕事。" |
| Town Illustration | `#map` | Miharu City village illustration + speech bubble links (waste & resource guide, job guide) |
| River Band | — | Video-style banner (vacuum truck crossing a bridge) |
| Statement | `#statement` | Company intro text + on-site photos |
| Sea Band | — | Ocean illustration assets (ferry, dolphins, shrimp) |
| Services | `#service` | Carousel (4 services: bulky waste collection, environmental infrastructure, septic tank management, industrial waste collection) |
| Recruitment | `#recruit` | Hiring info + photos |
| News | `#blog` | Blog card list |
| Gallery | — | On-site photo grid |
| Footer | `#footer` | Address, phone number, footer nav |

## Structure

```
client-project/
├── package.json              # Project config (Jest)
├── vercel.json               # Vercel output dir config
├── .gitignore
├── landing page/
│   ├── index.html            # Main page
│   ├── css/
│   │   └── index.css         # All styles (custom props + per-section)
│   ├── js/
│   │   ├── dom.js            # DOM helpers (querySelector wrappers)
│   │   └── script.js         # All functionality (hamburger, reveal, carousel, scroll)
│   └── assets/
│       ├── Fonts/            # Montserrat-VariableFont_wght.ttf
│       ├── illust/           # Town, sea, character illustrations (PNG)
│       ├── Links/            # On-site photos & PSD design sources
│       └── top_pc.png        # Hero background
└── tests/
    └── script.test.js        # Jest tests (hamburger, carousel, reveal, anchor)
```

## Color Palette

Managed via CSS custom properties:

| Variable | Value | Usage |
|---|---|---|
| `--color-primary` | `#4ec3f0` | Accent (speech bubbles, button borders) |
| `--color-primary-deep` | `#2ea6db` | Darker accent, focus rings |
| `--color-pink` | `#f2a0bf` | Sub-accent |
| `--color-book-yellow` | `#f6d873` | Guide books |
| `--color-bg` | `#fbf9f4` | Page background |
| `--color-field` | `#d3ecb4` | Field green |
| `--color-water` | `#bfe3f5` | Water blue bands |
| `--color-ink` | `#2b3a3f` | Body text |
| `--color-muted` | `#6a7780` | Secondary text |

## Features

- **Scroll Reveal** — `[data-reveal]` attribute fade-in via IntersectionObserver
- **Service Carousel** — Previous/next navigation, looping, responsive
- **Hamburger Menu** — Mobile menu, auto-closes on link click
- **Fixed Header** — `scrolled` class toggled on scroll for styling
- **Smooth Scroll** — Internal anchor links via `scrollIntoView`

## Development

```bash
npm install
npm test              # Run Jest tests
npm run test:coverage # Output coverage report
```

Tests live in `tests/script.test.js`, which requires individual functions from `landing page/js/script.js` for module-level unit testing.

Connected to Vercel. Pushing to `git push` auto-deploys the `landing page/` directory (configured in `vercel.json`).

## Notes

- HTML has `lang="ja"`, all content is in Japanese
- All illustration source files (.psd) are in `assets/Links/photoshop files/`
- Hero title is pre-marked up with one `<span class="letter">` per character
- Phone: 0957-99-9999
- Address: 108-1 Aoba-cho, Miharu-shi, Midorikawa-ken
