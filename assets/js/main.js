/* anime4000.github.io — small progressive enhancements. The site works without this file. */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- Theme toggle ---------------------------------------------------- */
  var toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    });
  }

  /* ---- Hero title shadow follows the pointer --------------------------- */
  var hero = document.querySelector('[data-spotlight]');
  var title = hero && hero.querySelector('.hero-title');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hero && title && !calm && window.matchMedia('(pointer: fine)').matches) {
    var frame = 0;
    hero.addEventListener('pointermove', function (event) {
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = 0;
        var box = title.getBoundingClientRect();
        var dx = (box.left + box.width / 2 - event.clientX) / window.innerWidth;
        var dy = (box.top + box.height / 2 - event.clientY) / window.innerHeight;
        title.style.setProperty('--sx', (dx * 22).toFixed(1));
        title.style.setProperty('--sy', (dy * 22).toFixed(1));
      });
    });
    hero.addEventListener('pointerleave', function () {
      title.style.removeProperty('--sx');
      title.style.removeProperty('--sy');
    });
  }

  /* ---- Live GitHub star counts ----------------------------------------- */
  /* The numbers in the HTML are a snapshot. One request to the public GitHub
     API refreshes them, cached for six hours; if it fails the snapshot stays. */
  var targets = document.querySelectorAll('[data-gh-stars]');
  if (!targets.length || !window.fetch) return;

  var CACHE_KEY = 'gh-stars-v1';
  var MAX_AGE = 6 * 60 * 60 * 1000;

  function paint(stars) {
    targets.forEach(function (el) {
      var count = stars[el.getAttribute('data-gh-stars').toLowerCase()];
      if (typeof count === 'number') el.textContent = count.toLocaleString('en-US');
    });
  }

  try {
    var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.at < MAX_AGE) { paint(cached.stars); return; }
  } catch (e) { /* ignore */ }

  fetch('https://api.github.com/users/Anime4000/repos?per_page=100', {
    headers: { Accept: 'application/vnd.github+json' }
  })
    .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
    .then(function (repos) {
      var stars = {};
      repos.forEach(function (repo) { stars[repo.full_name.toLowerCase()] = repo.stargazers_count; });
      paint(stars);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), stars: stars })); } catch (e) { /* ignore */ }
    })
    .catch(function () { /* keep the snapshot */ });
})();
