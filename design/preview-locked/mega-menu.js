/**
 * DílnaJobs v8 — mega menu, mobile drawer, sticky header hide/show
 * Mega hover: open on nav-item enter; close only when leaving .site-header
 */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.querySelector('.mobile-drawer');
  var backdrop = document.querySelector('.drawer-backdrop');
  var megaTriggers = document.querySelectorAll('[data-mega]');
  var lastY = window.scrollY || 0;
  var ticking = false;
  var deltaAccum = 0;
  var THRESHOLD = 8;
  var hoverCloseTimer = null;
  var HOVER_CLOSE_MS = 200;

  function isDesktopMega() {
    return window.matchMedia('(min-width: 901px)').matches;
  }

  function clearHoverClose() {
    if (hoverCloseTimer) {
      clearTimeout(hoverCloseTimer);
      hoverCloseTimer = null;
    }
  }

  function scheduleHoverClose() {
    clearHoverClose();
    hoverCloseTimer = setTimeout(closeAllMegas, HOVER_CLOSE_MS);
  }

  /* ---- Sticky header: hide on scroll down, show on scroll up ---- */
  function onScroll() {
    var y = window.scrollY || 0;
    var delta = y - lastY;

    if (y < 16) {
      header.classList.remove('is-hidden');
      header.classList.add('is-top');
      lastY = y;
      return;
    }
    header.classList.remove('is-top');

    deltaAccum += delta;
    if (Math.abs(deltaAccum) < THRESHOLD) {
      lastY = y;
      return;
    }

    if (document.body.classList.contains('drawer-open')) {
      header.classList.remove('is-hidden');
      lastY = y;
      deltaAccum = 0;
      return;
    }
    if (deltaAccum > 0 && y > 80) {
      header.classList.add('is-hidden');
      closeAllMegas();
    } else if (deltaAccum < 0) {
      header.classList.remove('is-hidden');
    }
    deltaAccum = 0;
    lastY = y;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ---- Mega menu (desktop) ---- */
  function closeAllMegas() {
    clearHoverClose();
    megaTriggers.forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.classList.remove('is-open');
    });
    document.body.classList.remove('mega-open');
  }

  /* Swap panels without dropping mega-open (avoids flicker) */
  function openMega(btn) {
    clearHoverClose();
    megaTriggers.forEach(function (other) {
      if (other === btn) return;
      other.setAttribute('aria-expanded', 'false');
      var p = document.getElementById(other.getAttribute('aria-controls'));
      if (p) p.classList.remove('is-open');
    });
    btn.setAttribute('aria-expanded', 'true');
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (panel) panel.classList.add('is-open');
    document.body.classList.add('mega-open');
  }

  megaTriggers.forEach(function (btn) {
    var item = btn.closest('.nav-item');

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) closeAllMegas();
      else openMega(btn);
    });

    /* Open on trigger/item enter — do NOT close on item mouseleave */
    if (item) {
      item.addEventListener('mouseenter', function () {
        if (isDesktopMega()) openMega(btn);
      });
    }
  });

  /* Close only when pointer leaves the entire site-header (includes mega panels) */
  if (header) {
    header.addEventListener('mouseenter', function () {
      clearHoverClose();
    });
    header.addEventListener('mouseleave', function () {
      if (isDesktopMega()) scheduleHoverClose();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllMegas();
      closeDrawer();
    }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-header') && !e.target.closest('.mega-panel')) {
      closeAllMegas();
    }
  });

  /* ---- Mobile drawer ---- */
  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
    closeAllMegas();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) backdrop.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      if (drawer && drawer.classList.contains('is-open')) closeDrawer();
      else openDrawer();
    });
  }
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('[data-drawer-close]').forEach(function (el) {
    el.addEventListener('click', closeDrawer);
  });

  /* Accordion inside drawer */
  document.querySelectorAll('[data-drawer-acc]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (panel) panel.classList.toggle('is-open', !expanded);
    });
  });

  /* Init */
  if (header) header.classList.add('is-top');
})();
