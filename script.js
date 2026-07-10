/* ================================================================
   VIGNESHWARAN J — Portfolio JavaScript
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   DIGITAL KEYSTROKE SOUND ENGINE (Web Audio API)
   Generates a synthetic terminal key-click for every character typed.
   No audio files needed — all synthesized in-browser.
   ---------------------------------------------------------------- */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let _audioCtx  = null;
let _soundEnabled = true; // flip to false to mute programmatically

/**
 * Lazily create the AudioContext (must be created/resumed after a user
 * gesture in modern browsers — first keystroke is enough).
 */
function getAudioCtx() {
  if (!_audioCtx) {
    try { _audioCtx = new AudioCtx(); } catch (e) { return null; }
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

/**
 * playKeySound()
 * Plays a short digital click:
 *  - A band-pass-filtered white-noise burst  (body of the click)
 *  - A brief square-wave oscillator blip     (digital "ping")
 * The pitch varies slightly per call for a natural feel.
 *
 * @param {number} [pitchVariance=0] - optional extra pitch offset in Hz
 */
function playKeySound(pitchVariance = 0) {
  if (!_soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const now    = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.18, now);        // overall volume (0–1)
  master.connect(ctx.destination);

  /* ── 1. Noise burst (filtered) ───────────────────────────────── */
  const bufSize   = ctx.sampleRate * 0.04;      // 40 ms of noise
  const noiseBuffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data      = noiseBuffer.getChannelData(0);
  for (let k = 0; k < bufSize; k++) data[k] = (Math.random() * 2) - 1;

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  // Band-pass filter to give it a "clicky" character
  const bpf = ctx.createBiquadFilter();
  bpf.type            = 'bandpass';
  bpf.frequency.value = 1800 + pitchVariance;   // center freq
  bpf.Q.value         = 0.8;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(1, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  noiseSource.connect(bpf);
  bpf.connect(noiseGain);
  noiseGain.connect(master);
  noiseSource.start(now);
  noiseSource.stop(now + 0.045);

  /* ── 2. Short oscillator "tick" ──────────────────────────────── */
  const osc  = ctx.createOscillator();
  const oGain = ctx.createGain();

  osc.type            = 'square';
  osc.frequency.value = 600 + pitchVariance * 0.5;
  oGain.gain.setValueAtTime(0.06, now);
  oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

  osc.connect(oGain);
  oGain.connect(master);
  osc.start(now);
  osc.stop(now + 0.03);
}

/* ----------------------------------------------------------------
   UTILITY: Run function when DOM is ready
   ---------------------------------------------------------------- */
function onReady(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

onReady(() => {
  /* ============================================================
     1. CUSTOM CURSOR
     ============================================================ */
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth trail via requestAnimationFrame
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    if (cursorTrail) {
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top  = trailY + 'px';
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Expand cursor on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .contact-copy, .skill-tag');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('cursor-hover'));
  });

  /* ============================================================
     2. MATRIX CANVAS (background rain)
     ============================================================ */
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    const ctx  = canvas.getContext('2d');
    let width  = window.innerWidth;
    let height = window.innerHeight;
    canvas.width  = width;
    canvas.height = height;

    const fontSize = 14;
    const cols = Math.floor(width / fontSize);

    // Characters: mix of ASCII + katakana for that matrix look
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()[]{}<>/\\|;:,.ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ';

    const drops = Array(cols).fill(1);

    function drawMatrix() {
      // Fade effect: semi-transparent black overlay
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff9d';
      ctx.font      = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop randomly once it passes bottom
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    let matrixInterval = setInterval(drawMatrix, 50);

    // Resize handler
    window.addEventListener('resize', () => {
      clearInterval(matrixInterval);
      width  = window.innerWidth;
      height = window.innerHeight;
      canvas.width  = width;
      canvas.height = height;
      drops.length  = Math.floor(width / fontSize);
      drops.fill(1);
      matrixInterval = setInterval(drawMatrix, 50);
    });
  }

  /* ============================================================
     3. BOOT SCREEN ANIMATION
     ============================================================ */
  const bootScreen = document.getElementById('boot-screen');
  const bootLines  = [
    document.getElementById('boot-line-1'),
    document.getElementById('boot-line-2'),
    document.getElementById('boot-line-3'),
    document.getElementById('boot-line-4'),
    document.getElementById('boot-line-5'),
  ];

  // Lines to type out — ✏️ EDIT: customize boot messages here
  const bootMessages = [
    { text: '> Booting VJ Security OS v2.0 ...', color: '#00ff9d', delay: 100 },
    { text: '> Loading cybersecurity modules ... [OK]', color: '#00d4ff', delay: 80 },
    { text: '> Establishing encrypted connection ... [OK]', color: '#00d4ff', delay: 80 },
    { text: '> Scanning network topology ... [SAFE]', color: '#00ff9d', delay: 80 },
    { text: '> Access granted. Welcome, operator.', color: '#00ff9d', delay: 100 },
  ];

  function typeText(el, text, color, speed, cb) {
    el.style.color = color;
    let i = 0;
    const iv = setInterval(() => {
      const ch = text[i];
      el.textContent += ch;

      // Play a digital sound for every visible character (skip spaces)
      if (ch && ch.trim() !== '') {
        // Slight pitch variance per character for a natural feel
        playKeySound(Math.random() * 400 - 200);
      }

      i++;
      if (i >= text.length) {
        clearInterval(iv);
        if (cb) setTimeout(cb, 250);
      }
    }, speed);
  }

  function runBoot() {
    let lineIdx = 0;

    function nextLine() {
      if (lineIdx >= bootMessages.length) {
        // Boot complete — hide boot screen
        setTimeout(() => {
          bootScreen.classList.add('hidden');
          // Start hero animations after boot
          startHeroAnimations();
        }, 600);
        return;
      }

      const { text, color, delay } = bootMessages[lineIdx];
      const el = bootLines[lineIdx];
      if (el) {
        typeText(el, text, color, delay, nextLine);
      }
      lineIdx++;
    }

    setTimeout(nextLine, 300);
  }

  // Run boot only if boot screen exists
  if (bootScreen && bootLines[0]) {
    runBoot();
  } else {
    startHeroAnimations();
  }

  /* ============================================================
     4. HERO TYPEWRITER EFFECT
     ============================================================ */
  // ✏️ EDIT: Update roles in this array
  const roles = [
    'CYBERSECURITY PROFESSIONAL',
    'FULLSTACK DEVELOPER',
    'APP DEVELOPER',
    'ETHICAL HACKER',
    'NETWORK SECURITY ANALYST',
  ];

  let roleIdx    = 0;
  let charIdx    = 0;
  let isDeleting = false;
  const typeEl   = document.getElementById('typewriter-text');

  function typeRole() {
    if (!typeEl) return;

    const current = roles[roleIdx];

    // No sound here — sound plays only during the boot loader
    if (isDeleting) {
      typeEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typeEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 45 : 75;

    if (!isDeleting && charIdx === current.length) {
      speed      = 1800; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx    = (roleIdx + 1) % roles.length;
      speed      = 400;
    }

    setTimeout(typeRole, speed);
  }

  function startHeroAnimations() {
    // Start typewriter
    setTimeout(typeRole, 500);
  }

  /* ============================================================
     5. STICKY NAVBAR — scroll behavior + active section
     ============================================================ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class for shadow
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }

    // Active nav link via IntersectionObserver alternative
    let currentSection = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) currentSection = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentSection);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial call

  /* ============================================================
     6. HAMBURGER MOBILE MENU
     ============================================================ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen.toString());
      mobileMenu.classList.toggle('open', isOpen);
      mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ============================================================
     7. INTERSECTION OBSERVER — Scroll reveal + skill bar fill
     ============================================================ */
  // Sections fade-in
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-section').forEach(el => revealObserver.observe(el));

  // Items stagger-in
  const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-item').forEach(el => itemObserver.observe(el));

  // Skill bars fill when in view
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const w = bar.getAttribute('data-width');
          bar.style.width = w + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

  /* ============================================================
     8. CLICK-TO-COPY (phone & email)
     ============================================================ */
  const toast = document.getElementById('copy-toast');

  function showToast(msg = '✓ Copied to clipboard!') {
    if (!toast) return;
    toast.textContent = msg;
    toast.setAttribute('aria-hidden', 'false');
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 2200);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`✓ Copied: ${text}`);
    } catch {
      // fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); showToast(`✓ Copied: ${text}`); }
      catch { showToast('⚠ Copy failed — try manually'); }
      document.body.removeChild(ta);
    }
  }

  document.querySelectorAll('.contact-copy').forEach(el => {
    el.addEventListener('click', () => copyText(el.dataset.copy));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyText(el.dataset.copy);
      }
    });
  });

  /* ============================================================
     9. THEME TOGGLE (Dark / Light)
     ============================================================ */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');

  // Persist user preference
  const savedTheme = localStorage.getItem('vj-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (themeIcon) themeIcon.textContent = '🌙';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-mode');
      if (themeIcon) themeIcon.textContent = isLight ? '🌙' : '☀️';
      localStorage.setItem('vj-theme', isLight ? 'light' : 'dark');
    });
  }

  /* ============================================================
     10. SMOOTH SCROLL for anchor links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     11. PROFILE PHOTO fallback already handled via onerror in HTML
     ============================================================ */

  /* ============================================================
     12. BOOT SCREEN — skip on reduced motion preference
     ============================================================ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion && bootScreen) {
    bootScreen.classList.add('hidden');
    startHeroAnimations();
  }
});
