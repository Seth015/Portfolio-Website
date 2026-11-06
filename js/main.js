/**
 * Seth Hoorman – Portfolio
 * main.js
 */

'use strict';

/* ── Navbar: scroll effect & active link ─────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const links    = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('main section[id]');

  function onScroll() {
    // Scrolled class
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
})();

/* ── Hamburger menu ──────────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  const navLinks  = document.querySelectorAll('.navbar__link');

  if (!hamburger || !navMenu) return;

  function closeMenu() {
    hamburger.classList.remove('is-open');
    navMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    navMenu.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ── Typed text animation ────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Software Developer in opleiding.',
    'Webapplicaties bouwen.',
    'Altijd aan het leren.',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let isPausing    = false;

  const TYPING_SPEED   = 65;
  const DELETING_SPEED = 35;
  const PAUSE_AFTER    = 2000;
  const PAUSE_BEFORE   = 400;

  function tick() {
    const phrase = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = phrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === phrase.length) {
        isPausing = true;
        setTimeout(() => {
          isPausing = false;
          isDeleting = true;
          tick();
        }, PAUSE_AFTER);
        return;
      }
    } else {
      el.textContent = phrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(tick, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  setTimeout(tick, 800);
})();

/* ── Scroll-triggered animations ────────────────────────────── */
(function initAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const delay = parseInt(entry.target.dataset.delay || '0', 10);
      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, delay);

      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  });

  elements.forEach(el => observer.observe(el));
})();

/* ── Floating particles ──────────────────────────────────────── */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const COUNT = 18;

  function createParticle() {
    const p = document.createElement('span');
    p.className = 'particle';

    const size = Math.random() * 4 + 1;
    const x    = Math.random() * 100;
    const y    = Math.random() * 100 + 10;
    const dur  = Math.random() * 8 + 6;
    const del  = Math.random() * 8;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      animation-duration: ${dur}s;
      animation-delay: ${del}s;
      opacity: 0;
    `;

    container.appendChild(p);
  }

  for (let i = 0; i < COUNT; i++) createParticle();
})();

/* ── Contact form – mailto opener ────────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn  = document.getElementById('submit-btn');
  const successBox = document.getElementById('form-success');

  const MAILTO_TO  = 'shoorman@student.scalda.nl';

  const fields = {
    name:    { el: form.querySelector('#name'),    error: form.querySelector('#name-error'),    validate: v => v.trim().length >= 2 ? '' : 'Vul je naam in (minimaal 2 tekens).' },
    email:   { el: form.querySelector('#email'),   error: form.querySelector('#email-error'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Vul een geldig e-mailadres in.' },
    subject: { el: form.querySelector('#subject'), error: form.querySelector('#subject-error'), validate: v => v.trim().length >= 3 ? '' : 'Vul een onderwerp in.' },
    message: { el: form.querySelector('#message'), error: form.querySelector('#message-error'), validate: v => v.trim().length >= 10 ? '' : 'Je bericht moet minimaal 10 tekens bevatten.' },
  };

  // Live validation on blur
  Object.values(fields).forEach(({ el, error, validate }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      const msg = validate(el.value);
      error.textContent = msg;
      el.classList.toggle('is-error', !!msg);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('is-error')) {
        const msg = validate(el.value);
        error.textContent = msg;
        el.classList.toggle('is-error', !!msg);
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    let firstInvalid = null;

    Object.values(fields).forEach(({ el, error, validate }) => {
      if (!el) return;
      const msg = validate(el.value);
      error.textContent = msg;
      el.classList.toggle('is-error', !!msg);
      if (msg && !firstInvalid) {
        isValid = false;
        firstInvalid = el;
      }
    });

    if (!isValid) {
      firstInvalid.focus();
      return;
    }

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();

    // Bouw de mailbody op
    const body =
      `Naam: ${name}\n` +
      `E-mail: ${email}\n\n` +
      `${message}`;

    // Maak mailto link aan en open e-mailapp
    const mailto = `mailto:${MAILTO_TO}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}` +
      `&reply-to=${encodeURIComponent(email)}`;

    window.location.href = mailto;

    // Toon succesmelding en reset formulier
    successBox.hidden = false;
    form.reset();
    setTimeout(() => { successBox.hidden = true; }, 6000);
  });
})();

/* ── Auto copyright year ─────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ── Smooth scroll for anchor links ──────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
