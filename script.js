/* BSF PERFORMANCE — GLOBAL JAVASCRIPT */
/* Interactive functionality and premium animations */

// ==================== PAGE LOADER ====================
function initPageLoader() {
  // Create loader if it doesn't exist
  let loader = document.querySelector('.page-loader');
  const loadStart = performance.now();

  if (!loader) {
    // Determine if we're in a subdirectory
    const logoPath = window.location.pathname.includes('/locations/') ? '../images/bsflogo.webp' : 'images/bsflogo.webp';
    
    loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-brand" role="status" aria-live="polite" aria-label="Loading page">
        <img src="${logoPath}" alt="BSF Performance" class="loader-logo">
        <span class="loader-line"></span>
      </div>
    `;
    document.body.prepend(loader);
  }

  let isHidden = false;
  const hideLoader = () => {
    if (isHidden) {
      return;
    }

    isHidden = true;
    const elapsed = performance.now() - loadStart;
    const minVisible = 120;
    const delay = Math.max(0, minVisible - elapsed);

    window.setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      document.documentElement.classList.remove('is-loading');
      window.setTimeout(() => loader.remove(), 220);
    }, delay);
  };

  // Hide as soon as layout is stable, with load and timeout fallbacks.
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => requestAnimationFrame(hideLoader));
  }, { once: true });
  window.addEventListener('load', hideLoader, { once: true });
  window.setTimeout(hideLoader, 900);

  // Prevent scrolling while loading
  document.documentElement.classList.add('is-loading');
  document.body.style.overflow = 'hidden';
}

// Initialize loader immediately
initPageLoader();

// ==================== MOBILE NAVIGATION ====================
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const body = document.body;
  const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

  if (hamburger && mobileNav) {
    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a non-dropdown link
    const directLinks = mobileNav.querySelectorAll('.mobile-nav-item:not(.mobile-dropdown-toggle)');
    directLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        body.style.overflow = '';
      });
    });

    // Handle dropdown toggles
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const menu = toggle.nextElementSibling;
        const isActive = toggle.classList.contains('active');
        
        // Close all other dropdowns
        dropdownToggles.forEach(otherToggle => {
          if (otherToggle !== toggle) {
            otherToggle.classList.remove('active');
            otherToggle.nextElementSibling.classList.remove('active');
          }
        });
        
        // Toggle current dropdown
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
      });
    });

    // Close dropdown menus when clicking their links
    const dropdownLinks = mobileNav.querySelectorAll('.mobile-dropdown-menu a');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        body.style.overflow = '';
        
        // Close dropdowns
        dropdownToggles.forEach(toggle => {
          toggle.classList.remove('active');
          toggle.nextElementSibling.classList.remove('active');
        });
      });
    });
  }
}

// ==================== SCROLL REVEAL ANIMATIONS ====================
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optionally unobserve to prevent re-animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with .reveal class
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));

  // Observe card-reveal elements
  const cardRevealElements = document.querySelectorAll('.card-reveal');
  cardRevealElements.forEach(el => observer.observe(el));
}

// ==================== STICKY NAVIGATION ====================
function initStickyNav() {
  const nav = document.querySelector('.nav-header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for enhanced styling
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// ==================== FAQ ACCORDION ====================
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(accItem => {
        accItem.classList.remove('active');
        accItem.querySelector('.accordion-content').style.maxHeight = null;
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// ==================== MODAL FUNCTIONALITY ====================
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
  const modals = document.querySelectorAll('.modal');
  const modalCloses = document.querySelectorAll('.modal-close');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-trigger');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloses.forEach(close => {
    close.addEventListener('click', () => {
      const modal = close.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal when clicking outside
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });

  // Check for hash on page load to open modal
  const hash = window.location.hash.substring(1);
  if (hash && hash.startsWith('coach-modal-')) {
    const modal = document.getElementById(hash);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
}

// ==================== HERO TEXT ANIMATION ====================
function initHeroAnimation() {
  const heroWords = document.querySelectorAll('.hero-word');
  
  if (heroWords.length > 0) {
    heroWords.forEach((word, index) => {
      setTimeout(() => {
        word.style.opacity = '1';
        word.style.transform = 'translateY(0)';
      }, index * 110);
    });

    // Animate CTAs after hero words
    const heroCtas = document.querySelector('.hero-ctas');
    if (heroCtas) {
      setTimeout(() => {
        heroCtas.style.opacity = '1';
        heroCtas.style.transform = 'translateY(0)';
      }, heroWords.length * 110 + 120);
    }
  }
}

// ==================== MARQUEE DUPLICATION ====================
function initMarquee() {
  const marqueeContent = document.querySelector('.marquee-content');
  
  if (marqueeContent && !marqueeContent.parentElement.dataset.marqueeInitialized) {
    // Duplicate content for seamless loop
    const clone = marqueeContent.cloneNode(true);
    clone.classList.add('marquee-clone');
    marqueeContent.parentElement.appendChild(clone);
    marqueeContent.parentElement.dataset.marqueeInitialized = 'true';
  }
}

// ==================== FORM VALIDATION ====================
function initFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    // Skip Netlify forms - check for form-name hidden input (Netlify injects this)
    const hasNetlifyFormName = form.querySelector('input[name="form-name"]');
    if (hasNetlifyFormName) {
      return; // Let Netlify handle the submission
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const inputs = form.querySelectorAll('[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--accent-red)';
        } else {
          input.style.borderColor = 'var(--border)';
        }
      });

      if (isValid) {
        // Form is valid - in production, this would submit to server
        alert('Thank you for your submission! We\'ll be in touch soon.');
        form.reset();
      } else {
        alert('Please fill in all required fields.');
      }
    });

    // Remove error styling on input
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = 'var(--border)';
      });
    });
  });
}

// ==================== CONTACT INTAKE ROUTING ====================
function initContactIntakeRouting() {
  const form = document.getElementById('contactIntakeForm');
  if (!form) return;

  const serviceType = document.getElementById('serviceType');
  const programType = document.getElementById('programType');
  const locationField = document.getElementById('locationField');
  const locationSelect = document.getElementById('location');
  const metricTestingNote = document.getElementById('metricTestingNote');

  if (!serviceType || !programType || !locationField || !locationSelect) return;

  const locationOptions = {
    default: [
      { value: 'lockport', label: 'Lockport, IL' },
      { value: 'bensenville', label: 'Bensenville, IL' },
      { value: 'columbus', label: 'Columbus, OH' }
    ],
    fastpitch: [
      { value: 'bensenville', label: 'Bensenville, IL' }
    ]
  };

  const routingMap = {
    'remote|pitching|remote': {
      formName: 'contact-remote-pitching',
      metricRequired: 'No',
      notificationGroup: 'Collin Sharman'
    },
    'remote|strength-and-conditioning|remote': {
      formName: 'contact-remote-sc',
      metricRequired: 'No',
      notificationGroup: 'Brett Velon'
    },
    'remote|fastpitch|remote': {
      formName: 'contact-remote-fastpitch',
      metricRequired: 'No',
      notificationGroup: 'Natalie Reuchel'
    },
    'in-house|pitching|lockport': {
      formName: 'contact-lockport-pitching',
      metricRequired: 'Yes',
      notificationGroup: 'Ryan McWilliams and Collin Sharman'
    },
    'in-house|strength-and-conditioning|lockport': {
      formName: 'contact-lockport-sc',
      metricRequired: 'No',
      notificationGroup: 'Brett Velon'
    },
    'in-house|pitching|bensenville': {
      formName: 'contact-bensenville-pitching',
      metricRequired: 'Yes',
      notificationGroup: 'Logan Schmitt'
    },
    'in-house|strength-and-conditioning|bensenville': {
      formName: 'contact-bensenville-sc',
      metricRequired: 'No',
      notificationGroup: 'James Young'
    },
    'in-house|fastpitch|bensenville': {
      formName: 'contact-bensenville-fastpitch',
      metricRequired: 'Yes',
      notificationGroup: 'Natalie Reuchel'
    },
    'in-house|pitching|columbus': {
      formName: 'contact-columbus-pitching',
      metricRequired: 'Yes',
      notificationGroup: 'BSF Performance'
    },
    'in-house|strength-and-conditioning|columbus': {
      formName: 'contact-columbus-sc',
      metricRequired: 'No',
      notificationGroup: 'Gehrig Diemoz'
    }
  };

  function setLocationOptions(program) {
    const options = program === 'fastpitch' ? locationOptions.fastpitch : locationOptions.default;
    const previousValue = locationSelect.value;

    locationSelect.innerHTML = '<option value="">Select in-house location</option>';
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      locationSelect.appendChild(optionElement);
    });

    const isPreviousValueAvailable = options.some(option => option.value === previousValue);
    locationSelect.value = isPreviousValueAvailable ? previousValue : '';
  }

  function updateMetricNote(service, program, location) {
    if (!metricTestingNote) return;

    if (service === 'remote') {
      metricTestingNote.textContent = 'Metric Testing Evaluation not required. Available upon request.';
      return;
    }

    if (service === 'in-house' && program === 'strength-and-conditioning') {
      metricTestingNote.textContent = 'Metric Testing Evaluation not required. Available upon request.';
      return;
    }

    if (service === 'in-house' && (program === 'pitching' || program === 'fastpitch')) {
      metricTestingNote.textContent = 'Requires Metric Testing Evaluation before training begins.';
      return;
    }

    if (service === 'in-house') {
      metricTestingNote.textContent = 'Select program to view evaluation requirements.';
      return;
    }

    metricTestingNote.textContent = 'Select training type to view evaluation requirements.';
  }

  function updateConditionalFields() {
    const selectedService = serviceType.value;
    const selectedProgram = programType.value;

    const isInPerson = selectedService === 'in-house';
    locationField.hidden = !isInPerson;
    locationField.style.display = isInPerson ? '' : 'none';
    locationSelect.required = isInPerson;

    if (!isInPerson) {
      locationSelect.value = '';
    }

    setLocationOptions(selectedProgram);
    updateMetricNote(selectedService, selectedProgram, locationSelect.value);
  }

  function buildRoutingKey() {
    const selectedService = serviceType.value;
    const selectedProgram = programType.value;
    const selectedLocation = selectedService === 'remote' ? 'remote' : locationSelect.value;
    return `${selectedService}|${selectedProgram}|${selectedLocation}`;
  }

  serviceType.addEventListener('change', updateConditionalFields);
  programType.addEventListener('change', updateConditionalFields);
  locationSelect.addEventListener('change', () => {
    updateMetricNote(serviceType.value, programType.value, locationSelect.value);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const routingKey = buildRoutingKey();
    const route = routingMap[routingKey];

    if (!route) {
      alert('This training combination is not currently available. Please update your selections and try again.');
      return;
    }

    const selectedService = serviceType.value;
    const selectedProgram = programType.value;
    const selectedLocation = selectedService === 'remote' ? 'Remote' : locationSelect.options[locationSelect.selectedIndex].text;

    const setOrCreateHiddenField = (fieldName, value) => {
      let input = form.querySelector(`input[name="${fieldName}"]`);
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = fieldName;
        form.appendChild(input);
      }
      input.value = value;
    };

    // Route to the correct Netlify form so each team receives the right submission notifications.
    setOrCreateHiddenField('form-name', route.formName);
    setOrCreateHiddenField('location', selectedLocation);
    setOrCreateHiddenField('metric_testing_required', route.metricRequired);
    setOrCreateHiddenField('routing_path', routingKey);
    setOrCreateHiddenField('notification_group', route.notificationGroup);
    setOrCreateHiddenField('redirect', '/thank-you.html');
    form.setAttribute('action', '/');

    form.submit();
  });

  updateConditionalFields();
}

// ==================== CONTACT SIGNUP FUNNEL ====================
function initContactSignupFunnel() {
  const panel = document.getElementById('signupFunnelPanel');
  if (!panel) return;

  const serviceStep = document.getElementById('funnelServiceStep');
  const programStep = document.getElementById('funnelProgramStep');
  const locationStep = document.getElementById('funnelLocationStep');

  if (!serviceStep || !programStep || !locationStep) {
    return;
  }

  const serviceButtons = panel.querySelectorAll('[data-funnel-group="service"]');
  const programButtons = panel.querySelectorAll('[data-funnel-group="program"]');
  const locationButtons = panel.querySelectorAll('[data-funnel-group="location"]');

  const validLocationsByProgram = {
    pitching: ['lockport', 'bensenville', 'columbus'],
    'strength-and-conditioning': ['lockport', 'bensenville', 'columbus'],
    fastpitch: ['bensenville']
  };

  const routeMap = {
    'in-house|pitching|lockport': {
      href: 'https://tms.ezfacility.com/OnlineRegistrations/Register.aspx?CompanyID=477&GroupID=3985399',
      actionLabel: 'Open Lockport Evaluation Signup',
      requiresEvaluation: true
    },
    'in-house|strength-and-conditioning|lockport': {
      href: 'https://tms.ezfacility.com/OnlineRegistrations/Register.aspx?CompanyID=477&GroupID=3361016#SelectRegistrationType',
      actionLabel: 'Open Lockport Strength Signup',
      requiresEvaluation: false
    },
    'in-house|pitching|bensenville': {
      href: 'https://bjesbensenville.ezfacility.com/Sessions',
      actionLabel: 'Open Bensenville Evaluation Signup',
      requiresEvaluation: true
    },
    'in-house|strength-and-conditioning|bensenville': {
      href: 'mailto:jyoung@bjesbensenville.com',
      actionLabel: 'Email James Young',
      requiresEvaluation: false
    },
    'in-house|fastpitch|bensenville': {
      href: 'https://tms.ezfacility.com/OnlineRegistrations/Register.aspx?CompanyID=6666&GroupID=3893810',
      actionLabel: 'Open Bensenville Fastpitch Evaluation',
      requiresEvaluation: true
    },
    'in-house|pitching|columbus': {
      href: 'mailto:info@bsfperformance.com?subject=Columbus%20Pitching%20Inquiry',
      actionLabel: 'Email BSF Performance',
      requiresEvaluation: true
    },
    'in-house|strength-and-conditioning|columbus': {
      href: 'https://tms.ezfacility.com/OnlineRegistrations/Register.aspx?CompanyID=5351&GroupID=3777473#SelectRegistrationType',
      actionLabel: 'Open Columbus Strength Signup',
      requiresEvaluation: false
    },
    'remote|pitching|remote': {
      href: 'https://tms.ezfacility.com/OnlineRegistrations/Register.aspx?CompanyID=477&GroupID=3361021',
      actionLabel: 'Open Remote Pitching Signup',
      requiresEvaluation: false
    },
    'remote|strength-and-conditioning|remote': {
      href: 'https://tms.ezfacility.com/OnlineRegistrations/Register.aspx?CompanyID=477&GroupID=3361018',
      actionLabel: 'Open Remote Strength Signup',
      requiresEvaluation: false
    },
    'remote|fastpitch|remote': {
      href: 'https://tms.ezfacility.com/OnlineRegistrations/Register.aspx?CompanyID=6666&GroupID=3893826&utm_source=ig&utm_medium=social&utm_content=link_in_bio',
      actionLabel: 'Open Remote Fastpitch Signup',
      requiresEvaluation: false
    }
  };

  const state = {
    service: '',
    program: '',
    location: ''
  };

  const setActive = (buttons, value) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.value === value;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const updateLocationAvailability = () => {
    const validLocations = validLocationsByProgram[state.program] || [];
    locationButtons.forEach((button) => {
      const isAllowed = validLocations.includes(button.dataset.value);
      button.hidden = !isAllowed;
      button.disabled = !isAllowed;
      if (!isAllowed && button.dataset.value === state.location) {
        state.location = '';
      }
    });
  };

  const showService = () => {
    serviceStep.hidden = false;
    programStep.hidden = true;
    locationStep.hidden = true;
  };

  const showProgram = () => {
    serviceStep.hidden = true;
    programStep.hidden = false;
    locationStep.hidden = true;
    const firstProgramButton = programStep.querySelector('.funnel-option-btn');
    if (firstProgramButton) firstProgramButton.focus();
  };

  const showLocation = () => {
    serviceStep.hidden = true;
    programStep.hidden = true;
    locationStep.hidden = false;
    const firstLocationButton = locationStep.querySelector('.funnel-option-btn:not([hidden])');
    if (firstLocationButton) firstLocationButton.focus();
  };

  const redirectIfReady = () => {
    if (!state.service || !state.program) {
      return;
    }

    if (state.service === 'in-house' && !state.location) {
      return;
    }

    const resolvedLocation = state.service === 'remote' ? 'remote' : state.location;
    const routeKey = `${state.service}|${state.program}|${resolvedLocation}`;
    const route = routeMap[routeKey];
    if (!route || !route.href) {
      return;
    }

    window.location.assign(route.href);
  };

  serviceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.service = button.dataset.value;
      state.program = '';
      state.location = '';

      setActive(serviceButtons, state.service);
      setActive(programButtons, '');
      setActive(locationButtons, '');

      showProgram();
    });
  });

  programButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!state.service) {
        return;
      }

      state.program = button.dataset.value;
      state.location = '';

      setActive(programButtons, state.program);
      setActive(locationButtons, '');

      if (state.service === 'in-house') {
        updateLocationAvailability();
        showLocation();
      } else {
        state.location = 'remote';
        redirectIfReady();
      }
    });
  });

  locationButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.disabled) {
        return;
      }

      state.location = button.dataset.value;
      setActive(locationButtons, state.location);
      redirectIfReady();
    });
  });

  updateLocationAvailability();
  showService();
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// ==================== ACTIVE NAV LINK ====================
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === '/')) {
      link.classList.add('active');
    }
  });
}

// ==================== LAZYLOAD IMAGES ====================
function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// ==================== COACH BIO SYSTEM ====================
function initCoachBios() {
  const bioTriggers = document.querySelectorAll('[data-coach-bio]');
  
  bioTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const coachId = trigger.getAttribute('data-coach-bio');
      const modal = document.getElementById(`coach-modal-${coachId}`);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

// ==================== COACH CAROUSEL ====================
function initCoachCarousel() {
  const carousels = document.querySelectorAll('.coach-carousel');
  
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.coach-track');
    const slides = carousel.querySelectorAll('.coach-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const counter = carousel.querySelector('.carousel-counter .current');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    function updateCarousel() {
      // Move track
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update counter
      if (counter) {
        counter.textContent = String(currentIndex + 1).padStart(2, '0');
      }
      
      // Update button states
      if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
      }
      if (nextBtn) {
        nextBtn.disabled = currentIndex === totalSlides - 1;
      }
    }
    
    // Event listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
          currentIndex++;
          updateCarousel();
        }
      });
    }
    
    // Initialize
    updateCarousel();
  });
}

// ==================== LOCATION CAROUSEL ====================
function initLocationCarousel() {
  const carousel = document.querySelector('.location-carousel');
  
  if (!carousel) return;
  
  const track = carousel.querySelector('.location-track');
  const slides = carousel.querySelectorAll('.location-slide');
  const prevBtn = carousel.querySelector('.location-nav-prev');
  const nextBtn = carousel.querySelector('.location-nav-next');
  const counter = carousel.querySelector('.location-counter .current');
  
  if (!track || slides.length === 0) return;
  
  let currentIndex = 0;
  const totalSlides = slides.length;
  
  function updateCarousel() {
    // Move track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update counter
    if (counter) {
      counter.textContent = String(currentIndex + 1).padStart(2, '0');
    }
    
    // Update button states
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex === totalSlides - 1;
    }
  }
  
  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (currentIndex < totalSlides - 1) {
        currentIndex++;
        updateCarousel();
      }
    });
  }
  
  // Initialize
  updateCarousel();
}

// ==================== COUNTER ANIMATIONS ====================
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number, [data-counter]');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
  const text = element.textContent;
  const hasPlus = text.includes('+');
  const number = parseInt(text.replace(/[^0-9]/g, ''));
  
  if (isNaN(number)) return;
  
  const duration = 1100;
  const steps = 60;
  const increment = number / steps;
  const stepDuration = duration / steps;
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= number) {
      element.textContent = hasPlus ? `${number}+` : number;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toString();
    }
  }, stepDuration);
}

// ==================== PARALLAX SCROLLING ====================
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-slow');
  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (parallaxElements.length === 0 || isCoarsePointer || prefersReducedMotion) return;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrolled;
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Only apply parallax when element is in viewport
      if (scrolled + viewportHeight > elementTop && scrolled < elementTop + elementHeight) {
        const yPos = (scrolled - elementTop) * 0.3;
        element.style.transform = `translateY(${yPos}px)`;
      }
    });
  }
  
  // Throttle scroll events for performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Initial call
  updateParallax();
}

// ==================== ENHANCED NAVIGATION ====================
function initEnhancedNav() {
  const nav = document.querySelector('.nav-header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class after 50px
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

// ==================== MAGNETIC BUTTONS ====================
function initMagneticButtons() {
  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isCoarsePointer || prefersReducedMotion) return;

  const buttons = document.querySelectorAll('.btn-primary, .btn-magnetic');
  
  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0) scale(1)';
    });
  });
}

// ==================== SMOOTH PAGE TRANSITIONS ====================
function initPageTransitions() {
  if (document.body.dataset.pageTransitionsInitialized === 'true') {
    return;
  }
  document.body.dataset.pageTransitionsInitialized = 'true';

  const resetPageVisibility = () => {
    document.body.style.opacity = '';
    document.body.style.transform = '';
    document.body.style.transition = '';
    document.body.style.visibility = '';
    document.body.style.pointerEvents = '';
  };

  const shouldUseTransitions = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ensure page is visible even if browser restores a snapshot during a transition.
  resetPageVisibility();

  window.addEventListener('pageshow', () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resetPageVisibility);
    });
  });

  window.addEventListener('popstate', () => {
    resetPageVisibility();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      resetPageVisibility();
    }
  });

  document.body.classList.add('page-transition');
  
  // Add transition to same-origin page navigations only.
  const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"])');
  
  internalLinks.forEach(link => {
    if (link.dataset.pageTransitionBound === 'true') {
      return;
    }
    link.dataset.pageTransitionBound = 'true';

    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Skip non-navigation links and browser-managed behaviors.
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
      if (link.hasAttribute('download')) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      let targetUrl;
      try {
        targetUrl = new URL(href, window.location.href);
      } catch (_) {
        return;
      }

      // Only animate same-origin full page navigations.
      if (targetUrl.origin !== window.location.origin) return;
      if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && targetUrl.hash) return;

      if (!shouldUseTransitions) return;
      
      e.preventDefault();
      document.body.style.willChange = 'opacity';
      document.body.style.transition = 'opacity 170ms ease-out';
      document.body.style.opacity = '0.35';
      
      setTimeout(() => {
        window.location.assign(targetUrl.href);
      }, 170);

      // Safety net: if navigation is interrupted, restore page state.
      setTimeout(() => {
        resetPageVisibility();
        document.body.style.willChange = '';
      }, 550);
    });
  });
}

// ==================== INITIALIZE ALL ====================
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStickyNav();
  initScrollReveal();
  initAccordion();
  initModals();
  initHeroAnimation();
  initMarquee();
  initFormValidation();
  initSmoothScroll();
  initActiveNavLink();
  initLazyLoad();
  initCoachBios();
  initCoachCarousel();
  initLocationCarousel();
  
  // New enhanced features
  initCounterAnimations();
  initParallax();
  initEnhancedNav();
  initMagneticButtons();
  initPageTransitions();
  initContactIntakeRouting();
  initContactSignupFunnel();
});

// ==================== UTILITIES ====================

// Add stagger classes to grid children
function autoStagger(selector) {
  const containers = document.querySelectorAll(selector);
  containers.forEach(container => {
    const children = container.children;
    Array.from(children).forEach((child, index) => {
      if (index < 6) {
        child.classList.add(`stagger-${index + 1}`);
      }
    });
  });
}

// Call autoStagger on common grid containers
document.addEventListener('DOMContentLoaded', () => {
  autoStagger('.grid');
  autoStagger('.footer-content');
});

// ==================== SWIPER CAROUSEL INITIALIZATION ====================

// Initialize Facility Gallery Carousels (Location Pages)
function initFacilityGalleries() {
  const facilityGalleries = document.querySelectorAll('.facility-swiper');
  if (typeof Swiper === 'undefined' || facilityGalleries.length === 0) return;
  
  facilityGalleries.forEach((gallery) => {
    new Swiper(gallery, {
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      speed: 800,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      navigation: {
        nextEl: gallery.querySelector('.swiper-button-next'),
        prevEl: gallery.querySelector('.swiper-button-prev'),
      },
      pagination: {
        el: gallery.querySelector('.swiper-pagination'),
        clickable: true,
      },
    });
  });
}

// Initialize all carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if Swiper is loaded
  if (typeof Swiper !== 'undefined') {
    initFacilityGalleries();
  }
});

// ==================== SERVICE CARD HOVER VIDEOS ====================

// Play video on hover for service cards
function initServiceCardVideos() {
  const serviceCards = document.querySelectorAll('.card-gold-accent');
  
  serviceCards.forEach(card => {
    const video = card.querySelector('.service-card-video');
    
    if (video) {
      // Play video on hover (desktop)
      card.addEventListener('mouseenter', () => {
        video.play().catch(err => {
          // Handle autoplay restrictions
          console.log('Video autoplay prevented:', err);
        });
      });
      
      // Pause and reset video when hover ends
      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
      
      // Handle touch devices - play on first tap, pause on second
      card.addEventListener('click', (e) => {
        if (video.paused) {
          video.play().catch(err => console.log('Video play prevented:', err));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    }
  });
}

// Initialize hover videos when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initServiceCardVideos();
  initParallaxEffects();
  initEnhancedMarquee();
  initBackToTop();
});

// ==================== PARALLAX EFFECTS ====================
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.parallax-slow');
  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (parallaxElements.length === 0 || isCoarsePointer || prefersReducedMotion) return;

  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach(element => {
        const speed = Number(element.dataset.speed) || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });

      ticking = false;
    });
  }, { passive: true });
}

// ==================== ENHANCED MARQUEE ====================
function initEnhancedMarquee() {
  const marquees = document.querySelectorAll('.marquee');
  
  marquees.forEach(marquee => {
    if (marquee.dataset.enhancedMarqueeInitialized === 'true') {
      return;
    }

    const content = marquee.querySelector('.marquee-content');
    if (!content) return;
    
    // Clone content for seamless loop if one hasn't already been created.
    let clone = marquee.querySelector('.marquee-clone');
    if (!clone) {
      clone = content.cloneNode(true);
      clone.classList.add('marquee-clone');
      marquee.appendChild(clone);
    }
    
    // Pause on hover
    marquee.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
      content.style.animationPlayState = 'paused';
      clone.style.animationPlayState = 'paused';
    });
    
    marquee.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
      content.style.animationPlayState = 'running';
      clone.style.animationPlayState = 'running';
    });

    marquee.dataset.enhancedMarqueeInitialized = 'true';
  });
}

// ==================== BACK TO TOP BUTTON ====================
function initBackToTop() {
  // Create button if it doesn't exist
  let backToTop = document.querySelector('.back-to-top');
  
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
  }
  
  // Show/hide on scroll
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });
  
  // Smooth scroll to top
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==================== ENHANCED CARD INTERACTIONS ====================
function initEnhancedCards() {
  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isCoarsePointer || prefersReducedMotion) return;

  const cards = document.querySelectorAll('.card, .hover-lift');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      // Add subtle tilt effect
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const rotateX = ((mouseY - centerY) / rect.height) * -5;
      const rotateY = ((mouseX - centerX) / rect.width) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const rotateX = ((mouseY - centerY) / rect.height) * -5;
      const rotateY = ((mouseX - centerX) / rect.width) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Initialize enhanced cards
document.addEventListener('DOMContentLoaded', () => {
  initEnhancedCards();
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Throttle function for scroll events
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounce function for resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ==================== LOCATION SLIDESHOW ====================
function initLocationSlideshow() {
  const locationSlideshow = document.querySelector('.location-slideshow');
  
  if (locationSlideshow) {
    const slideCount = locationSlideshow.querySelectorAll('.swiper-slide').length;
    
    new Swiper('.location-slideshow', {
      loop: slideCount > 1,
      autoplay: slideCount > 1 ? {
        delay: 4000,
        disableOnInteraction: false,
      } : false,
      effect: slideCount > 1 ? 'fade' : 'slide',
      fadeEffect: {
        crossFade: true
      },
      speed: 1000,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
}

// Initialize location slideshow
initLocationSlideshow();

// ==================== PROGRAM TABS ====================
function initProgramTabs() {
  const tabs = document.querySelectorAll('.program-tab');
  const panels = document.querySelectorAll('.program-panel');
  
  if (tabs.length === 0) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      
      // Remove active class from all tabs and panels
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding panel
      tab.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// Initialize program tabs
initProgramTabs();

// ==================== ATHLETE CAROUSEL ====================
function initAthleteCarousel() {
  const carousels = document.querySelectorAll('.athlete-carousel-container');
  
  carousels.forEach(container => {
    const carousel = container.querySelector('.athlete-carousel');
    const items = Array.from(carousel.querySelectorAll('[data-carousel-item]'));
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    
    if (items.length === 0) return;
    
    let currentIndex = 0;
    let isTransitioning = false;
    
    function updateCarousel(instant = false) {
      items.forEach((item, index) => {
        // Remove all data attributes first
        item.removeAttribute('data-carousel-active');
        
        // Determine position relative to current
        if (index === currentIndex) {
          item.setAttribute('data-carousel-active', 'true');
        } else if (index === (currentIndex - 1 + items.length) % items.length) {
          item.setAttribute('data-carousel-active', 'prev');
        } else if (index === (currentIndex + 1) % items.length) {
          item.setAttribute('data-carousel-active', 'next');
        }
      });
      
      // Manage transition state
      if (!instant) {
        isTransitioning = true;
        if (prevBtn) prevBtn.style.pointerEvents = 'none';
        if (nextBtn) nextBtn.style.pointerEvents = 'none';
        
        setTimeout(() => {
          isTransitioning = false;
          if (prevBtn) prevBtn.style.pointerEvents = 'auto';
          if (nextBtn) nextBtn.style.pointerEvents = 'auto';
        }, 700); // Match CSS transition duration
      }
    }
    
    function nextSlide() {
      if (isTransitioning) return;
      currentIndex = (currentIndex + 1) % items.length;
      updateCarousel();
    }
    
    function prevSlide() {
      if (isTransitioning) return;
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateCarousel();
    }
    
    // Event listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      if (isTransitioning) return;
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide();
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide();
      }
    }
    
    // Initialize
    updateCarousel(true);
  });
}

// Initialize athlete carousel
initAthleteCarousel();

// Testimonial Carousel with Auto-rotation
function initTestimonialCarousel() {
  const container = document.querySelector('.testimonial-carousel-container');
  if (!container) return;

  const carousel = container.querySelector('.testimonial-carousel');
  const items = Array.from(carousel.querySelectorAll('[data-testimonial-item]'));
  const dotsContainer = container.querySelector('.testimonial-dots');
  
  if (items.length === 0) return;
  
  let currentIndex = 0;
  let autoRotateInterval;
  const autoRotateDelay = 7500; // 7.5 seconds per testimonial
  
  // Create dots
  items.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('testimonial-dot');
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoRotate();
    });
    dotsContainer.appendChild(dot);
  });
  
  const dots = Array.from(dotsContainer.querySelectorAll('.testimonial-dot'));
  
  function updateCarousel() {
    items.forEach((item, index) => {
      item.removeAttribute('data-active');
      
      if (index === currentIndex) {
        item.setAttribute('data-active', 'true');
      } else if (index === (currentIndex - 1 + items.length) % items.length) {
        item.setAttribute('data-active', 'prev');
      } else if (index === (currentIndex + 1) % items.length) {
        item.setAttribute('data-active', 'next');
      }
    });
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
  
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  }
  
  function startAutoRotate() {
    autoRotateInterval = setInterval(nextSlide, autoRotateDelay);
  }
  
  function stopAutoRotate() {
    clearInterval(autoRotateInterval);
  }
  
  function resetAutoRotate() {
    stopAutoRotate();
    startAutoRotate();
  }
  
  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoRotate);
  carousel.addEventListener('mouseleave', startAutoRotate);
  
  // Initialize
  updateCarousel();
  startAutoRotate();
}

// Initialize testimonial carousel
initTestimonialCarousel();

// ==================== COACH LOCATION FILTER ====================
(function () {
  const filterBtns = document.querySelectorAll('.coach-filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const coachCards = document.querySelectorAll('.coach-card');

      coachCards.forEach(card => {
        card.classList.remove('fade-in');
        const locations = (card.dataset.location || '').split(/\s+/).filter(Boolean);
        if (filter === 'all' || locations.includes(filter)) {
          card.classList.remove('is-hidden');
          requestAnimationFrame(() => card.classList.add('fade-in'));
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
})();

// ==================== MOBILE CAROUSELS ====================
function initMobileCarousels() {
  // Only initialize on mobile breakpoints
  if (window.innerWidth > 768) return;
  
  // Locations carousel - the .locations-mobile element IS the swiper
  const locationsSwiper = document.querySelector('.locations-mobile.swiper');
  if (locationsSwiper && !locationsSwiper.swiper) {
    new Swiper('.locations-mobile.swiper', {
      slidesPerView: 1.1,
      spaceBetween: 16,
      centeredSlides: true,
      pagination: {
        el: '.locations-mobile .swiper-pagination',
        clickable: true,
      },
    });
  }
  
  // Athletes carousel - the .athletes-mobile element IS the swiper
  const athletesSwiper = document.querySelector('.athletes-mobile.swiper');
  if (athletesSwiper && !athletesSwiper.swiper) {
    new Swiper('.athletes-mobile.swiper', {
      slidesPerView: 1.1,
      spaceBetween: 16,
      centeredSlides: true,
      pagination: {
        el: '.athletes-mobile .swiper-pagination',
        clickable: true,
      },
    });
  }
  
  // Facility carousel - for location pages facility images
  const facilitySwiper = document.querySelector('.facility-mobile.swiper');
  if (facilitySwiper && !facilitySwiper.swiper) {
    new Swiper('.facility-mobile.swiper', {
      slidesPerView: 1.1,
      spaceBetween: 16,
      centeredSlides: true,
      pagination: {
        el: '.facility-mobile .swiper-pagination',
        clickable: true,
      },
    });
  }
  
  // Coaches carousel - for location pages coaching staff
  const coachesSwiper = document.querySelector('.coaches-mobile.swiper');
  if (coachesSwiper && !coachesSwiper.swiper) {
    new Swiper('.coaches-mobile.swiper', {
      slidesPerView: 1.1,
      spaceBetween: 16,
      centeredSlides: true,
      pagination: {
        el: '.coaches-mobile .swiper-pagination',
        clickable: true,
      },
    });
  }
}

// Debounce helper for resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize on load
window.addEventListener('load', initMobileCarousels);

// Re-initialize on resize (debounced)
window.addEventListener('resize', debounce(initMobileCarousels, 250));
