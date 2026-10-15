// DEAR PAPA motion layer. Runs before the runtime replaces the prerendered page:
// keeps the hero intro continuous across that swap, then arms the gift-process
// rules and the footer logo turn for when they scroll into view.
(function () {
  'use strict';
  var html = document.documentElement;
  var root = document.getElementById('dc-root');
  if (!root) return;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function watch(selector, options) {
    var els = document.querySelectorAll(selector);
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('dp-in');
        io.unobserve(e.target);
      });
    }, options);
    Array.prototype.forEach.call(els, function (el) {
      // Only arm what has not been seen yet; anything already on screen stays as it is.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('dp-armed');
      io.observe(el);
    });
  }

  function mounted() {
    if (html.classList.contains('dp-intro') && typeof window.__dpIntroT0 === 'number') {
      // The runtime swaps in fresh nodes; offset their delays so the intro carries on instead of restarting.
      html.style.setProperty('--dp-intro-elapsed', Math.round(performance.now() - window.__dpIntroT0) + 'ms');
    }
    if (reduce || !('IntersectionObserver' in window)) return;
    requestAnimationFrame(function () {
      // The list can be taller than a phone screen: start once its top passes 85% of the viewport.
      watch('.dp-process-list', { threshold: 0, rootMargin: '0px 0px -15% 0px' });
      watch('.dp-logo', { threshold: 0.6 });
    });
  }

  if (!root.hasAttribute('data-prerendered')) { mounted(); return; }
  new MutationObserver(function (records, observer) {
    for (var i = 0; i < records.length; i++) {
      if (records[i].addedNodes.length) { observer.disconnect(); mounted(); return; }
    }
  }).observe(root, { childList: true });
})();
