// SRM INNOVATEX 2026 — Interactive System
// Neo-brutalist editorial poster interactions

(function() {
  "use strict";
  
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  /* ============================================================
     NAVIGATION
     ============================================================ */
  const burger = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');
  const closeBtn = document.getElementById('closeBtn');
  
  if (burger && navLinks) {
    // Open menu
    burger.addEventListener('click', function() {
      navLinks.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
    });
    
    // Close menu with close button
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    }
    
    // Close nav when clicking links
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (navLinks.classList.contains('open') && 
          !navLinks.contains(e.target) && 
          !burger.contains(e.target)) {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  /* ============================================================
     NAV SHADOW ON SCROLL
     ============================================================ */
  const nav = document.getElementById('siteNav');
  let scrollTimeout;
  
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (window.scrollY > 20) {
        nav.style.boxShadow = '0 4px 12px rgba(6, 43, 92, 0.12)';
      } else {
        nav.style.boxShadow = 'none';
      }
    }, 10);
  }, { passive: true });
  
  /* ============================================================
     HERO PARALLAX (POINTER-REACTIVE)
     ============================================================ */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const heroVisual = document.querySelector('.hero-visual-zone');
    const parallaxElements = heroVisual ? heroVisual.querySelectorAll('[data-parallax]') : [];
    
    if (heroVisual && parallaxElements.length > 0) {
      let animationFrameId;
      
      heroVisual.addEventListener('mousemove', function(e) {
        cancelAnimationFrame(animationFrameId);
        
        animationFrameId = requestAnimationFrame(function() {
          const rect = heroVisual.getBoundingClientRect();
          const centerX = (e.clientX - rect.left) / rect.width - 0.5;
          const centerY = (e.clientY - rect.top) / rect.height - 0.5;
          
          parallaxElements.forEach(function(el) {
            const depth = parseFloat(el.getAttribute('data-parallax')) || 10;
            const moveX = centerX * depth;
            const moveY = centerY * depth;
            el.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
          });
        });
      });
      
      heroVisual.addEventListener('mouseleave', function() {
        cancelAnimationFrame(animationFrameId);
        parallaxElements.forEach(function(el) {
          el.style.transform = 'translate(0, 0)';
        });
      });
    }
  }
  
  /* ============================================================
     TIMELINE DRAG + SCROLL
     ============================================================ */
  const tlScroller = document.getElementById('tlScroller');
  const progressFill = document.getElementById('progressFill');
  
  if (tlScroller && progressFill) {
    let isDown = false;
    let startX;
    let scrollLeft;
    
    // Update progress bar
    function updateProgress() {
      const maxScroll = tlScroller.scrollWidth - tlScroller.clientWidth;
      const percentage = maxScroll > 0 ? (tlScroller.scrollLeft / maxScroll) * 100 : 0;
      progressFill.style.width = Math.max(10, percentage) + '%';
    }
    
    tlScroller.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    
    // Drag functionality
    tlScroller.addEventListener('pointerdown', function(e) {
      isDown = true;
      tlScroller.classList.add('dragging');
      startX = e.pageX - tlScroller.offsetLeft;
      scrollLeft = tlScroller.scrollLeft;
      tlScroller.setPointerCapture(e.pointerId);
    });
    
    tlScroller.addEventListener('pointerup', function() {
      isDown = false;
      tlScroller.classList.remove('dragging');
    });
    
    tlScroller.addEventListener('pointerleave', function() {
      isDown = false;
      tlScroller.classList.remove('dragging');
    });
    
    tlScroller.addEventListener('pointermove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - tlScroller.offsetLeft;
      const walk = (x - startX) * 1.5;
      tlScroller.scrollLeft = scrollLeft - walk;
    });
    
    // Keyboard navigation
    tlScroller.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight') {
        tlScroller.scrollBy({ left: 220, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      if (e.key === 'ArrowLeft') {
        tlScroller.scrollBy({ left: -220, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }
  
  /* ============================================================
     TRACKS ACCORDION
     ============================================================ */
  const trackCards = document.querySelectorAll('.track-card');
  
  trackCards.forEach(function(card) {
    card.addEventListener('click', function() {
      const isActive = card.classList.contains('active');
      
      // Close all tracks
      trackCards.forEach(function(c) {
        c.classList.remove('active');
        c.setAttribute('aria-expanded', 'false');
      });
      
      // Open clicked track if it wasn't already active
      if (!isActive) {
        card.classList.add('active');
        card.setAttribute('aria-expanded', 'true');
      }
    });
  });
  
  /* ============================================================
     REGISTRATION SELECTION
     ============================================================ */
  const regCards = document.querySelectorAll('.reg-card');
  const regSummary = document.getElementById('regSummary');
  
  regCards.forEach(function(card) {
    card.addEventListener('click', function() {
      // Remove selected from all
      regCards.forEach(function(c) {
        c.classList.remove('selected');
      });
      
      // Select clicked card
      card.classList.add('selected');
      
      // Update summary
      const size = card.getAttribute('data-size');
      const price = card.getAttribute('data-price');
      regSummary.textContent = size + ' MEMBERS — ₹' + Number(price).toLocaleString('en-IN');
    });
  });
  
  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      const isOpen = item.classList.contains('open');
      
      // Close all FAQs
      faqItems.forEach(function(i) {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      
      // Open clicked FAQ if it wasn't already open
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
  
  /* ============================================================
     SMOOTH SCROLL
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
      }
    });
  });
  
  /* ============================================================
     INTERSECTION OBSERVER (Subtle reveals)
     ============================================================ */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe sections for subtle fade-in
    const sectionsToObserve = document.querySelectorAll('.section-intro, .about-box, .build-header');
    sectionsToObserve.forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
  
  /* ============================================================
     TACTILE BUTTON FEEDBACK
     ============================================================ */
  const tactileButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .track-card, .reg-card');
  
  tactileButtons.forEach(function(btn) {
    btn.addEventListener('mousedown', function() {
      this.style.transition = 'transform 0.08s ease';
    });
    
    btn.addEventListener('mouseup', function() {
      this.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
  
  /* ============================================================
     TRACK CARDS HOVER ELEVATION
     ============================================================ */
  const allTrackCards = document.querySelectorAll('.track-card');
  
  allTrackCards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      if (!this.classList.contains('active')) {
        this.style.transition = 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transition = 'all 0.2s ease';
    });
  });
  
  /* ============================================================
     JOURNEY ITEMS STAGGER HOVER
     ============================================================ */
  const journeyItems = document.querySelectorAll('.journey-item');
  
  journeyItems.forEach(function(item, index) {
    item.style.transitionDelay = (index * 0.05) + 's';
  });
  
  /* ============================================================
     PRIZE PANELS MAGNETIC EFFECT (SUBTLE)
     ============================================================ */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const prizePanels = document.querySelectorAll('.prize-panel');
    
    prizePanels.forEach(function(panel) {
      panel.addEventListener('mousemove', function(e) {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.05;
        const moveY = y * 0.05;
        
        panel.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
      });
      
      panel.addEventListener('mouseleave', function() {
        panel.style.transform = 'translate(0, 0)';
      });
    });
  }
  
  /* ============================================================
     OPPORTUNITY TAGS ROTATION ANIMATION
     ============================================================ */
  const oppTags = document.querySelectorAll('.opp-tag');
  
  oppTags.forEach(function(tag) {
    tag.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    
    tag.addEventListener('mouseleave', function() {
      this.style.transition = 'all 0.18s ease';
    });
  });
  
  /* ============================================================
     STICKY NOTES WIGGLE ON HOVER
     ============================================================ */
  const stickyNotes = document.querySelectorAll('.sticky-note');
  
  stickyNotes.forEach(function(note) {
    note.addEventListener('mouseenter', function() {
      if (!reduceMotion) {
        const currentRotation = this.classList.contains('note-1') ? -5 : 4;
        this.style.transform = 'rotate(' + currentRotation + 'deg) scale(1.05)';
      }
    });
    
    note.addEventListener('mouseleave', function() {
      const originalRotation = this.classList.contains('note-1') ? -5 : 4;
      this.style.transform = 'rotate(' + originalRotation + 'deg) scale(1)';
    });
  });
  
  /* ============================================================
     CONSOLE MESSAGE
     ============================================================ */
  console.log('%c🚀 SRM INNOVATEX 2026', 'font-size: 24px; font-weight: bold; color: #F5A900;');
  console.log('%cA student-driven hackathon for a brighter tomorrow.', 'font-size: 14px; color: #062B5C;');
  console.log('%cInterested in the code? Check out the repository or reach out to the organizing team!', 'font-size: 12px; color: #666;');
  
  /* ============================================================
     PAGE LOAD ANIMATION
     ============================================================ */
  window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(function() {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 50);
  });
  
  /* ============================================================
     KEYBOARD ACCESSIBILITY
     ============================================================ */
  // Add visible focus to all interactive elements
  const interactiveElements = document.querySelectorAll('button, a, [tabindex]');
  
  interactiveElements.forEach(function(el) {
    el.addEventListener('focus', function() {
      this.classList.add('keyboard-focused');
    });
    
    el.addEventListener('blur', function() {
      this.classList.remove('keyboard-focused');
    });
  });
  
  // Trap focus in mobile menu when open
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    }
  });
  
  /* ============================================================
     PERFORMANCE MONITORING
     ============================================================ */
  if ('performance' in window && 'PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver(function(list) {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long task detected:', entry.duration.toFixed(2) + 'ms');
        }
      }
    });
    
    try {
      perfObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long task API not supported
    }
  }
  
  /* ============================================================
     RESPONSIVE IMAGES / LAZY LOADING
     ============================================================ */
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imageObserver.observe(img);
    });
  }
  
  /* ============================================================
     DYNAMIC YEAR UPDATE (if needed in future)
     ============================================================ */
  const currentYear = new Date().getFullYear();
  const footerYear = document.querySelector('.footer-bottom');
  if (footerYear && currentYear > 2026) {
    // Could update footer text if event is in the past
  }
  
})();
