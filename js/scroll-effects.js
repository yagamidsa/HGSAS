/* ===================================================================
   SCROLL EFFECTS - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Scroll indicator, back-to-top, y efectos de scroll optimizados
   =================================================================== */

class ScrollEffectsController {
    constructor() {
        this.scrollProgress = null;
        this.backToTopButton = null;
        this.header = null;
        this.isScrolling = false;
        this.lastScrollY = 0;
        this.ticking = false;

        // Configuración
        this.config = {
            backToTopThreshold: 300,
            headerHideThreshold: 200,
            smoothScrollDuration: 800,
            throttleDelay: 16 // 60fps
        };

        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeElements());
        } else {
            this.initializeElements();
        }

        console.log('📜 Scroll Effects Controller inicializado');
    }

    initializeElements() {
        // Encontrar elementos
        this.scrollProgress = document.querySelector('.scroll-progress .progress-fill');
        this.backToTopButton = document.getElementById('back-to-top');
        this.header = document.querySelector('.header');

        // Verificar elementos críticos
        if (!this.scrollProgress) {
            console.warn('⚠️ Scroll progress element no encontrado');
        }

        if (!this.backToTopButton) {
            console.warn('⚠️ Back to top button no encontrado');
        }

        // Inicializar funcionalidades
        this.initializeScrollProgress();
        this.initializeBackToTop();
        this.initializeHeaderBehavior();
        this.initializeSmoothScroll();
        this.initializeScrollSpy();

        console.log('✅ Scroll effects inicializados correctamente');
    }

    /* ===== SCROLL PROGRESS INDICATOR ===== */
    initializeScrollProgress() {
        if (!this.scrollProgress) return;

        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min((scrollTop / docHeight) * 100, 100);

            this.scrollProgress.style.width = `${progress}%`;

            // Actualizar ARIA para accesibilidad
            const progressBar = this.scrollProgress.closest('.scroll-progress');
            if (progressBar) {
                progressBar.setAttribute('aria-valuenow', Math.round(progress));
            }

            // Event personalizado para otros componentes
            window.dispatchEvent(new CustomEvent('scrollProgress', {
                detail: { progress }
            }));
        };

        this.addScrollListener(updateProgress);
        console.log('📊 Scroll progress inicializado');
    }

    /* ===== BACK TO TOP BUTTON ===== */
    initializeBackToTop() {
        if (!this.backToTopButton) return;

        const updateVisibility = () => {
            const scrollY = window.pageYOffset;

            if (scrollY > this.config.backToTopThreshold) {
                this.showBackToTop();
            } else {
                this.hideBackToTop();
            }
        };

        // Event listeners
        this.backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.smoothScrollToTop();
            this.trackEvent('Navigation', 'back_to_top_click');
        });

        // Keyboard support
        this.backToTopButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.smoothScrollToTop();
            }
        });

        this.addScrollListener(updateVisibility);
        console.log('⬆️ Back to top inicializado');
    }

    showBackToTop() {
        if (this.backToTopButton.style.display === 'flex') return;

        this.backToTopButton.style.display = 'flex';
        this.backToTopButton.style.opacity = '0';
        this.backToTopButton.style.transform = 'translateY(20px)';

        // Animar entrada
        requestAnimationFrame(() => {
            this.backToTopButton.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            this.backToTopButton.style.opacity = '1';
            this.backToTopButton.style.transform = 'translateY(0)';
        });
    }

    hideBackToTop() {
        if (this.backToTopButton.style.display === 'none') return;

        this.backToTopButton.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        this.backToTopButton.style.opacity = '0';
        this.backToTopButton.style.transform = 'translateY(20px)';

        setTimeout(() => {
            if (this.backToTopButton.style.opacity === '0') {
                this.backToTopButton.style.display = 'none';
            }
        }, 300);
    }

    /* ===== SMOOTH SCROLL TO TOP ===== */
    smoothScrollToTop() {
        const startPosition = window.pageYOffset;
        const startTime = performance.now();

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animateScroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / this.config.smoothScrollDuration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition * (1 - ease));

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                // Focus en el elemento principal para accesibilidad
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.focus({ preventScroll: true });
                }
            }
        };

        requestAnimationFrame(animateScroll);
    }

    /* ===== HEADER BEHAVIOR ===== */
    initializeHeaderBehavior() {
        if (!this.header) return;

        const updateHeader = () => {
            const currentScrollY = window.pageYOffset;

            // Agregar clase "scrolled" después de cierto scroll
            if (currentScrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            // Auto-hide en móvil (solo si no hay menú abierto)
            if (window.innerWidth <= 767) {
                const isMenuOpen = document.querySelector('.menu-morphing[aria-expanded="true"]');

                if (!isMenuOpen) {
                    if (currentScrollY > this.lastScrollY && currentScrollY > this.config.headerHideThreshold) {
                        this.hideHeader();
                    } else if (currentScrollY < this.lastScrollY) {
                        this.showHeader();
                    }
                }
            }

            this.lastScrollY = currentScrollY;
        };

        this.addScrollListener(updateHeader);
        console.log('📱 Header behavior inicializado');
    }

    hideHeader() {
        this.header.style.transform = 'translateY(-100%)';
        this.header.setAttribute('aria-hidden', 'true');
    }

    showHeader() {
        this.header.style.transform = 'translateY(0)';
        this.header.setAttribute('aria-hidden', 'false');
    }

    /* ===== SMOOTH SCROLL FOR INTERNAL LINKS ===== */
    initializeSmoothScroll() {
        const internalLinks = document.querySelectorAll('a[href^="#"]');

        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    this.smoothScrollToTop();
                    return;
                }

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    this.smoothScrollToElement(targetElement);
                }
            });
        });

        console.log('🔗 Smooth scroll inicializado');
    }

    smoothScrollToElement(element, offset = 100) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        const startPosition = window.pageYOffset;
        const distance = offsetPosition - startPosition;
        const startTime = performance.now();

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animateScroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / this.config.smoothScrollDuration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                // Actualizar URL y focus
                const href = `#${element.id}`;
                history.pushState(null, null, href);
                element.focus({ preventScroll: true });

                // Event personalizado
                window.dispatchEvent(new CustomEvent('smoothScrollComplete', {
                    detail: { target: element, href }
                }));
            }
        };

        requestAnimationFrame(animateScroll);
    }

    /* ===== SCROLL SPY ===== */
    initializeScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;

        const updateActiveSection = () => {
            const scrollPosition = window.pageYOffset + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.id;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Actualizar navegación activa
                    this.updateActiveNavigation(sectionId);

                    // Event personalizado
                    window.dispatchEvent(new CustomEvent('sectionChanged', {
                        detail: { section: sectionId }
                    }));
                }
            });
        };

        this.addScrollListener(updateActiveSection);
        console.log('🎯 Scroll spy inicializado');
    }

    updateActiveNavigation(activeSection) {
        // Actualizar enlaces de navegación
        const navLinks = document.querySelectorAll('a[href^="#"]');

        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === activeSection) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    /* ===== SCROLL LISTENER MANAGER ===== */
    addScrollListener(callback) {
        const throttledCallback = () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    callback();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        };

        window.addEventListener('scroll', throttledCallback, { passive: true });
    }

    /* ===== INTERSECTION OBSERVER PARA ANIMACIONES ===== */
    initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');

        if (animatedElements.length === 0) return;

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

        animatedElements.forEach(el => observer.observe(el));
        console.log('✨ Scroll animations inicializadas');
    }

    /* ===== SCROLL TO SECTION API ===== */
    scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            this.smoothScrollToElement(targetSection);
        } else {
            console.warn(`⚠️ Sección ${sectionId} no encontrada`);
        }
    }

    /* ===== UTILITIES ===== */
    trackEvent(category, action, label = null) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }

        console.log(`📊 Event tracked: ${category} - ${action}`, label);
    }

    /* ===== PUBLIC API ===== */
    getScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.min((scrollTop / docHeight) * 100, 100);
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 150;

        for (const section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                return section.id;
            }
        }

        return null;
    }

    /* ===== PERFORMANCE MONITORING ===== */
    initializePerformanceMonitoring() {
        let scrollCount = 0;
        let frameCount = 0;
        let lastTime = performance.now();

        const monitorPerformance = () => {
            scrollCount++;

            requestAnimationFrame(() => {
                frameCount++;
                const currentTime = performance.now();

                // Log performance cada 100 scrolls
                if (scrollCount % 100 === 0) {
                    const fps = frameCount / ((currentTime - lastTime) / 1000);
                    console.log(`📊 Scroll Performance: ${scrollCount} scrolls, ${fps.toFixed(2)} FPS`);
                    frameCount = 0;
                    lastTime = currentTime;
                }
            });
        };

        this.addScrollListener(monitorPerformance);
    }
}

/* ===== INICIALIZACIÓN ===== */
document.addEventListener('DOMContentLoaded', () => {
    window.scrollEffects = new ScrollEffectsController();

    // API global para otros scripts
    window.scrollToSection = (sectionId) => window.scrollEffects.scrollToSection(sectionId);
    window.getScrollProgress = () => window.scrollEffects.getScrollProgress();
    window.getCurrentSection = () => window.scrollEffects.getCurrentSection();
});

// Exportar para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollEffectsController;
}

console.log('📜 scroll-effects.js cargado completamente');