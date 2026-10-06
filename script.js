/**
 * ==========================================================================
 * A SONG OF ICE AND CODE - PORTFOLIO INTERACTION ENGINE
 * Theme: Game of Thrones / Cinematic Ice & Fire
 * Author: Shubham Sharma
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initScrollAnimations();
  initNavigation();
  initRavenForm();
  initClipboardFeatures();
  initAudioDesign();
});

/* ==========================================================================
   1. DUAL PARTICLE ENGINE ("A Song of Ice and Fire")
   Simulates gently falling snow crystals and rising dragon embers
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Calculate particle density based on screen dimensions
  const isMobile = window.innerWidth < 768;
  const snowCount = isMobile ? 35 : 75;
  const emberCount = isMobile ? 25 : 55;

  const particles = [];

  // Snow Particle Class (Ice of Winter)
  class SnowFlake {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -10;
      this.radius = Math.random() * 2.2 + 0.8;
      this.speedY = Math.random() * 0.9 + 0.4;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.swing = Math.random() * 2;
      this.swingSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.swing += this.swingSpeed;
      this.x += Math.sin(this.swing) * 0.5 + this.speedX;
      this.y += this.speedY;

      if (this.y > height + 10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 235, 255, ${this.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(122, 229, 255, 0.6)';
      ctx.fill();
    }
  }

  // Ember Particle Class (Fire & Blood)
  class EmberParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 15;
      this.radius = Math.random() * 2.4 + 1;
      this.speedY = -(Math.random() * 1.2 + 0.6);
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.85 + 0.15;
      this.flickerSpeed = Math.random() * 0.04 + 0.02;
      this.hue = Math.random() > 0.4 ? 30 : 12; // Gold/Amber or Deep Fire Orange
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.02) * 0.4;
      this.opacity -= 0.0035;

      if (this.y < -20 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${Math.max(0, this.opacity)})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 55%, 0.8)`;
      ctx.fill();
    }
  }

  // Initialize particles
  for (let i = 0; i < snowCount; i++) particles.push(new SnowFlake());
  for (let i = 0; i < emberCount; i++) particles.push(new EmberParticle());

  // Render Loop
  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  // Pause rendering when document tab is hidden to conserve GPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });
}

/* ==========================================================================
   2. SCROLL ANIMATIONS (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.fade-up, .fade-in, .fade-left, .fade-right');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   3. NAVIGATION & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const nav = document.querySelector('.realm-nav');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinksList = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll header styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Scrollspy active state
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile drawer toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('open');
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !expanded);
    });

    // Close on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   4. SEND A RAVEN (Interactive Contact Experience)
   ========================================================================== */
function initRavenForm() {
  const form = document.getElementById('raven-form');
  const modal = document.getElementById('raven-modal');
  const modalClose = document.getElementById('raven-modal-close');
  const statusEl = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('sender-name').value.trim();
    const email = document.getElementById('sender-email').value.trim();
    const realm = document.getElementById('sender-realm').value.trim() || 'The Known Realm';
    const scroll = document.getElementById('sender-scroll').value.trim();

    if (!name || !email || !scroll) {
      alert('Please inscribe all required parchment fields before releasing the raven.');
      return;
    }

    // Play blade chime sound if enabled
    playValyrianChime();

    // Trigger Raven Flight modal
    if (modal) {
      const recipientNameEl = document.getElementById('modal-sender-name');
      if (recipientNameEl) recipientNameEl.textContent = name;
      modal.classList.add('active');
    }

    // Create a pre-filled mailto anchor fallback
    const subject = encodeURIComponent(`Raven dispatched from ${name} [${realm}]`);
    const body = encodeURIComponent(`From: ${name} (${email})\nRealm: ${realm}\n\nMessage:\n${scroll}`);
    const mailtoUrl = `mailto:shubhamsharma572007@gmail.com?subject=${subject}&body=${body}`;

    // Reset Form
    form.reset();

    // Attach mailto trigger to modal primary action
    const directClientBtn = document.getElementById('launch-mail-client');
    if (directClientBtn) {
      directClientBtn.onclick = () => {
        window.location.href = mailtoUrl;
      };
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   5. CLIPBOARD QUICK-ACTIONS
   ========================================================================== */
function initClipboardFeatures() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = 'shubhamsharma572007@gmail.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(emailText).then(() => {
      const originalText = copyBtn.getAttribute('data-original-hint') || copyBtn.innerText;
      copyBtn.innerText = '✓ RAVEN SCROLL COPIED!';
      copyBtn.style.color = 'var(--ice-core)';
      
      playValyrianChime();

      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.color = '';
      }, 3000);
    }).catch(() => {
      // Fallback
      window.location.href = `mailto:${emailText}`;
    });
  });
}

/* ==========================================================================
   6. ATMOSPHERIC SOUND DESIGN (Web Audio API)
   Generates a metallic Valyrian blade shimmer tone on interaction
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioDesign() {
  const soundToggle = document.getElementById('sound-toggle');
  if (!soundToggle) return;

  soundToggle.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    soundEnabled = !soundEnabled;
    soundToggle.setAttribute('aria-pressed', soundEnabled);
    
    const icon = soundToggle.querySelector('svg');
    if (soundEnabled) {
      soundToggle.classList.add('sound-on');
      soundToggle.title = 'Mute Valyrian Steel Sounds';
      playValyrianChime();
    } else {
      soundToggle.classList.remove('sound-on');
      soundToggle.title = 'Enable Valyrian Steel Sounds';
    }
  });
}

function playValyrianChime() {
  if (!soundEnabled || !audioCtx) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  
  // Shimmering blade harmonic oscillators
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(880, now); // A5 note
  osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // Glides to A6
  osc1.frequency.exponentialRampToValueAtTime(440, now + 1.2);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(1320, now); // E6
  osc2.frequency.exponentialRampToValueAtTime(660, now + 1.0);

  gainNode.gain.setValueAtTime(0.12, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 1.2);
  osc2.stop(now + 1.2);
}
