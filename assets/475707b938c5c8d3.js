// DEAR PAPA motion layer. On the home page it runs before the runtime replaces the prerendered page:
// keeps the hero intro continuous across that swap, then arms scroll reveals, the gift-process rules
// and the footer logo turn. Journal pages (no runtime) arm their reveals straight away.
(function () {
  'use strict';
  var html = document.documentElement;
  var root = document.getElementById('dc-root');
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Group containers whose children rise in once, in order, the first time the group reaches the viewport.
  var REVEAL = ['.dp-sec-head', '.dp-routine', '.dp-facts-list', '.dp-gift-layout', '.dp-story-grid',
    '.dp-reminder-grid', '.dp-faq-list', '#news .dp-wrap', '.article-list', '.journal-note'];

  function watch(selector, options, arm) {
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
      if (arm) arm(el);
      el.classList.add(arm ? 'dp-rv-armed' : 'dp-armed');
      io.observe(el);
    });
  }

  function staggerChildren(el) {
    Array.prototype.forEach.call(el.children, function (child, i) { child.style.setProperty('--dp-rv-i', String(Math.min(i, 6))); });
  }

  function bind() {
    if (reduce || !('IntersectionObserver' in window)) return;
    requestAnimationFrame(function () {
      // The list can be taller than a phone screen: start once its top passes 85% of the viewport.
      watch('.dp-process-list', { threshold: 0, rootMargin: '0px 0px -15% 0px' });
      watch('.dp-logo', { threshold: 0.6 });
      watch(REVEAL.join(','), { threshold: 0, rootMargin: '0px 0px -10% 0px' }, staggerChildren);
    });
  }

  function mounted() {
    if (html.classList.contains('dp-intro') && typeof window.__dpIntroT0 === 'number') {
      // The runtime swaps in fresh nodes; offset their delays so the intro carries on instead of restarting.
      html.style.setProperty('--dp-intro-elapsed', Math.round(performance.now() - window.__dpIntroT0) + 'ms');
    }
    if (html.classList.contains('dp-intro')) {
      // The header logo makes its entrance now, on the fresh nodes, unless its 3s wait has already run out.
      var fcp = performance.getEntriesByName ? performance.getEntriesByName('first-contentful-paint')[0] : null;
      html.classList.add(fcp && performance.now() - fcp.startTime > 2700 ? 'dp-brand-done' : 'dp-brand-in');
    }
    bind();
  }

  if (!root) { bind(); return; }
  if (!root.hasAttribute('data-prerendered')) { mounted(); return; }
  new MutationObserver(function (records, observer) {
    for (var i = 0; i < records.length; i++) {
      if (records[i].addedNodes.length) { observer.disconnect(); mounted(); return; }
    }
  }).observe(root, { childList: true });
})();
