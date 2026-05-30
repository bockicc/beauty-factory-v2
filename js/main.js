/* =============================================
   BEAUTY FACTORY — main.js
   Hamburger menu & sticky navigation logic
   ============================================= */

(function () {
  'use strict';

  const header      = document.querySelector('.site-header');
  const hamburger   = document.querySelector('.nav__hamburger');
  const mobileMenu  = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // ── Active nav link ──────────────────────────────────────────────
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Sticky header on scroll ──────────────────────────────────────
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // ── Hamburger / Mobile menu ──────────────────────────────────────
  function openMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
    hamburger.setAttribute('aria-label', 'Otvori meni');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  // Close on mobile link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close on backdrop click (outside menu content — clicking the overlay itself)
  if (mobileMenu) {
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) closeMenu();
    });
  }

  // ── Smooth scroll for anchor links ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Intersection Observer for reveal animations ──────────────────
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || '0';
          entry.target.style.transitionDelay = delay + 'ms';
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ── Booking form date picker ────────────────────────────────────────
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // ── Pricing tabs (usluge.html) ───────────────────────────────────────
  const pricingTabs   = document.querySelectorAll('.pricing__tab');
  const pricingPanels = document.querySelectorAll('.pricing__panel');

  if (pricingTabs.length > 0) {
    pricingTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        pricingTabs.forEach(t => t.classList.remove('active'));
        pricingPanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const panel = document.getElementById('panel-' + target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ── Contact / Signup form fake submit ───────────────────────────
  function handleFormSubmit(formSelector, successSelector) {
    const form    = document.querySelector(formSelector);
    const success = document.querySelector(successSelector);
    if (!form || !success) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Šaljem...';
      }

      // Simulate async send
      setTimeout(() => {
        form.style.display = 'none';
        success.classList.add('show');
      }, 1200);
    });
  }

  handleFormSubmit('#bookingForm',   '#bookingSuccess');
  handleFormSubmit('#signupForm',    '#signupSuccess');
  handleFormSubmit('#contactForm',   '#contactSuccess');

})();