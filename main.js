(function() {
  'use strict';

  // ── 1. HEADER SCROLL ──────────────────────────────────────
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });


  // ── 2. MOBILE MENU TOGGLE ─────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  const body = document.body;

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      
      // Previne scroll quando menu aberto
      if (isOpen) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });

    // Fecha menu ao clicar em link
    const mobileLinks = navMobile.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      });
    });

    // Fecha menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (navMobile.classList.contains('open') && 
          !navMobile.contains(e.target) && 
          !navToggle.contains(e.target)) {
        navMobile.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      }
    });
  }


  // ── 3. INTERSECTION OBSERVER (Scroll Animations) ──────────
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observa elementos com classe .reveal
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));


  // ── 4. SMOOTH SCROLL para links âncora ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Ignora links vazios ou só com #
      if (href === '#' || href === '') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // ── 5. PRELOAD de imagens críticas (opcional) ─────────────
  // Uncomment se quiser preload da foto do hero
  /*
  const heroImage = new Image();
  heroImage.src = 'img/Marcos-foto.png';
  */


  // ── 6. LAZY LOADING para imagens de marca ─────────────────
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }


  // ── 7. ANIMAÇÃO DE NÚMEROS (Stats counter) ────────────────
  const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value + (end >= 30 ? '+' : '');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const valueElement = entry.target.querySelector('.stat__value');
        if (valueElement && !valueElement.classList.contains('animated')) {
          valueElement.classList.add('animated');
          const finalValue = parseInt(valueElement.textContent);
          valueElement.textContent = '0';
          animateValue(valueElement, 0, finalValue, 1200);
        }
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
  });


  // ── 8. PERFORMANCE: Remove animações em dispositivos lentos
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    // Remove delays e reduz duração das animações
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.transitionDuration = '0.2s';
      el.style.transitionDelay = '0s';
    });
  }


  // ── 9. TOUCH FEEDBACK para mobile ─────────────────────────
  // Adiciona classe visual em elementos tocáveis
  const touchElements = document.querySelectorAll('.btn, .brand-card, .diff-card, .social-btn');
  
  touchElements.forEach(el => {
    el.addEventListener('touchstart', function() {
      this.style.opacity = '0.8';
    }, { passive: true });
    
    el.addEventListener('touchend', function() {
      this.style.opacity = '';
    }, { passive: true });
  });


  // ── 10. LOADING STATE (Opcional) ──────────────────────────
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Dispara animações iniciais do hero após load
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        heroContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      }, 100);
    }
  });


  // ── DEBUG: Log de viewport em desenvolvimento ─────────────
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Viewport:', {
      width: window.innerWidth,
      height: window.innerHeight,
      mobile: window.innerWidth < 768
    });
  }

})();
