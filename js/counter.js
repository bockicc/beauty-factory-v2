/* =============================================
   BEAUTY FACTORY — counter.js
   Animated number counters triggered on scroll
   ============================================= */

(function () {
  'use strict';

  /**
   * Easing function — ease out cubic
   */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Animate a single counter element from 0 → target
   * @param {HTMLElement} el       - The element with class "counter"
   * @param {number}      target   - End value
   * @param {number}      duration - Animation duration in ms
   */
  function animateCounter(el, target, duration) {
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const current  = Math.round(eased * target);

      el.textContent = current.toLocaleString('sr-RS');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('sr-RS');
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * Find all stat items and set up IntersectionObserver
   */
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show the final values immediately
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        if (!isNaN(target)) counter.textContent = target.toLocaleString('sr-RS');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          const el       = entry.target;
          const target   = parseInt(el.dataset.target, 10);
          const duration = parseInt(el.dataset.duration, 10) || 2000;

          if (!isNaN(target)) {
            el.dataset.counted = 'true'; // Prevent re-triggering
            animateCounter(el, target, duration);
          }

          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.3
    });

    counters.forEach(counter => observer.observe(counter));
  }

  // Init after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }

})();