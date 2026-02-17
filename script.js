/* ============================================
   TEN — Landing Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- NAVBAR SCROLL ----------
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- MOBILE MENU ----------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // ---------- SCROLL REVEAL ----------
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- STAT COUNTER ANIMATION ----------
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'));
      const duration = 2000;
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      };

      requestAnimationFrame(update);
    });
  };

  // Trigger counters when hero stats are visible
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- PARALLAX GLOW EFFECT ----------
  const glows = document.querySelectorAll('.hero-glow');
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    glows.forEach((glow, i) => {
      const intensity = (i + 1) * 15;
      glow.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
    });
  }, { passive: true });

  // ---------- THEME SWITCHING ----------
  const themeOptions = document.querySelectorAll('.theme-option');
  const themeRing = document.getElementById('themeRing');
  const themePicker = document.getElementById('themePicker');
  const root = document.documentElement;

  // Position the ring over the active swatch
  function moveRing(btn, animate = true) {
    if (!themeRing || !btn || !themePicker) return;
    const swatch = btn.querySelector('.theme-swatch');
    if (!swatch) return;

    const pickerRect = themePicker.getBoundingClientRect();
    const swatchRect = swatch.getBoundingClientRect();

    const ringSize = themeRing.offsetWidth;
    const x = swatchRect.left - pickerRect.left + (swatchRect.width / 2) - (ringSize / 2);
    const y = swatchRect.top - pickerRect.top + (swatchRect.height / 2) - (ringSize / 2);

    if (!animate) {
      themeRing.style.transition = 'none';
    }
    themeRing.style.left = x + 'px';
    themeRing.style.top = y + 'px';
    themeRing.style.opacity = '1';

    if (!animate) {
      // Force reflow then restore transition
      themeRing.offsetHeight;
      themeRing.style.transition = '';
    }
  }

  function setTheme(themeName, animate = true) {
    // Apply theme attribute
    root.setAttribute('data-theme', themeName);

    // Update active state on buttons
    themeOptions.forEach(opt => opt.classList.remove('active'));
    const activeBtn = document.querySelector(`.theme-option[data-theme="${themeName}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
      moveRing(activeBtn, animate);
    }

    // Trigger transition animation on phone mockup
    if (animate) {
      const heroPhone = document.querySelector('.hero-phone');
      if (heroPhone) {
        heroPhone.classList.add('theme-transitioning');
        setTimeout(() => heroPhone.classList.remove('theme-transitioning'), 600);
      }
    }

    // Save preference
    localStorage.setItem('ten-theme', themeName);
  }

  // Click handlers for theme buttons
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.getAttribute('data-theme');
      setTheme(theme);
    });
  });

  // Load saved theme on page load
  const savedTheme = localStorage.getItem('ten-theme');
  if (savedTheme) {
    setTheme(savedTheme, false);
  }

  // Position ring once the picker is visible
  const pickerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeBtn = document.querySelector('.theme-option.active');
        if (activeBtn) moveRing(activeBtn, false);
        pickerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  if (themePicker) pickerObserver.observe(themePicker);

  // Reposition ring on resize
  window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.theme-option.active');
    if (activeBtn) moveRing(activeBtn, false);
  });

  // ---------- SCROLL TO TOP ----------
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
