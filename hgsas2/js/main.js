/* ===================================================================
   MAIN.JS - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Funcionalidades principales y coordinación del sitio web
   =================================================================== */

class SiteController {
    constructor() {
        this.isInitialized = false;
        this.scrollProgress = null;
        this.backToTopButton = null;
        this.intersectionObserver = null;
        this.formController = null;

        // Estado del sitio
        this.currentSection = 'home';
        this.isScrolling = false;
        this.lastScrollY = 0;

        // Performance tracking
        this.performanceMetrics = {
            loadStart: performance.now(),
            domContentLoaded: null,
            fullyLoaded: null
        };

        this.init();
    }

    init() {
        // Inicializar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeCore());
        } else {
            this.initializeCore();
        }

        // Inicialización completa cuando todo esté cargado
        window.addEventListener('load', () => this.initializeEnhancements());

        console.log('🚀 SiteController inicializado');
    }

    initializeCore() {
        this.performanceMetrics.domContentLoaded = performance.now();

        try {
            // Funcionalidades críticas
            this.initializeScrollProgress();
            this.initializeBackToTop();
            this.initializeFormHandling();
            this.initializeSectionTracking();
            this.initializeKeyboardNavigation();

            // Marcar como inicializado
            this.isInitialized = true;

            console.log('✅ Core funcionalidades inicializadas');

        } catch (error) {
            console.error('❌ Error en inicialización core:', error);
        }
    }

    initializeEnhancements() {
        this.performanceMetrics.fullyLoaded = performance.now();

        try {
            // Funcionalidades de mejora UX
            this.initializeIntersectionObserver();
            this.initializeSmoothScrollEnhancements();
            this.initializePerformanceOptimizations();
            this.initializeAnalyticsTracking();

            // Mostrar métricas de rendimiento
            this.logPerformanceMetrics();

            console.log('🎯 Todas las funcionalidades cargadas');

        } catch (error) {
            console.error('❌ Error en inicialización de mejoras:', error);
        }
    }

    /* ===== SCROLL PROGRESS INDICATOR ===== */
    initializeScrollProgress() {
        this.scrollProgress = document.querySelector('.scroll-progress .progress-fill');

        if (!this.scrollProgress) {
            console.warn('⚠️ Scroll progress element no encontrado');
            return;
        }

        // Throttled scroll handler para mejor performance
        let ticking = false;

        const updateScrollProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min((scrollTop / docHeight) * 100, 100);

            this.scrollProgress.style.width = `${progress}%`;

            // Actualizar atributo ARIA para accesibilidad
            const progressBar = this.scrollProgress.closest('.scroll-progress');
            if (progressBar) {
                progressBar.setAttribute('aria-valuenow', Math.round(progress));
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollProgress);
                ticking = true;
            }
        });

        console.log('📊 Scroll progress inicializado');
    }

    /* ===== BACK TO TOP BUTTON ===== */
    initializeBackToTop() {
        this.backToTopButton = document.getElementById('back-to-top');

        if (!this.backToTopButton) {
            console.warn('⚠️ Back to top button no encontrado');
            return;
        }

        // Mostrar/ocultar botón basado en scroll
        let ticking = false;
        const threshold = 300; // Mostrar después de 300px de scroll

        const handleScroll = () => {
            const scrollY = window.pageYOffset;

            if (scrollY > threshold) {
                this.backToTopButton.style.display = 'flex';
                this.backToTopButton.style.opacity = '1';
            } else {
                this.backToTopButton.style.opacity = '0';
                setTimeout(() => {
                    if (window.pageYOffset <= threshold) {
                        this.backToTopButton.style.display = 'none';
                    }
                }, 300);
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });

        // Click handler para scroll hacia arriba
        this.backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.smoothScrollToTop();

            // Analytics tracking
            this.trackEvent('Navigation', 'back_to_top_click');
        });

        // Keyboard navigation
        this.backToTopButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.smoothScrollToTop();
            }
        });

        console.log('⬆️ Back to top inicializado');
    }

    smoothScrollToTop() {
        const duration = 800;
        const start = window.pageYOffset;
        const startTime = performance.now();

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animation = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, start * (1 - ease));

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    /* ===== SECTION TRACKING ===== */
    initializeSectionTracking() {
        const sections = document.querySelectorAll('section[id]');

        if (sections.length === 0) {
            console.warn('⚠️ No se encontraron secciones para tracking');
            return;
        }

        let ticking = false;

        const updateCurrentSection = () => {
            const scrollPosition = window.pageYOffset + 150; // Offset para header

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.id;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    if (this.currentSection !== sectionId) {
                        this.currentSection = sectionId;
                        this.onSectionChange(sectionId);
                    }
                }
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateCurrentSection);
                ticking = true;
            }
        });

        console.log('🎯 Section tracking inicializado');
    }

    onSectionChange(sectionId) {
        // Actualizar URL sin recargar página
        const newUrl = `${window.location.pathname}#${sectionId}`;
        history.replaceState(null, null, newUrl);

        // Tracking para analytics
        this.trackEvent('Navigation', 'section_view', sectionId);

        // Event personalizado para otros módulos
        window.dispatchEvent(new CustomEvent('sectionChanged', {
            detail: { section: sectionId }
        }));

        console.log(`📍 Sección activa: ${sectionId}`);
    }

    /* ===== INTERSECTION OBSERVER PARA ANIMACIONES ===== */
    initializeIntersectionObserver() {
        // Elementos que deben animarse al entrar en viewport
        const animatableElements = document.querySelectorAll(
            '.product-card, .testimonial-card, .info-card, .news-card, .gallery-item'
        );

        if (animatableElements.length === 0) {
            console.warn('⚠️ No se encontraron elementos animables');
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElementEntry(entry.target);
                    this.intersectionObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar todos los elementos
        animatableElements.forEach(el => {
            el.classList.add('fade-in'); // Clase inicial
            this.intersectionObserver.observe(el);
        });

        console.log(`👁️ Intersection Observer inicializado (${animatableElements.length} elementos)`);
    }

    animateElementEntry(element) {
        element.classList.add('visible');

        // Añadir delay escalonado para elementos en grid
        const siblings = Array.from(element.parentElement.children);
        const index = siblings.indexOf(element);
        const delay = index * 100; // 100ms entre cada elemento

        setTimeout(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, delay);
    }

    /* ===== FORM HANDLING ===== */
    initializeFormHandling() {
        const contactForm = document.getElementById('contact-form');

        if (!contactForm) {
            console.warn('⚠️ Formulario de contacto no encontrado');
            return;
        }

        this.formController = new FormController(contactForm);
        console.log('📝 Formulario de contacto inicializado');
    }

    /* ===== KEYBOARD NAVIGATION ===== */
    initializeKeyboardNavigation() {
        // Navegación por secciones con teclado
        document.addEventListener('keydown', (e) => {
            // Alt + flecha para navegar entre secciones
            if (e.altKey) {
                const sections = ['home', 'productos', 'quienes-somos', 'contacto'];
                const currentIndex = sections.indexOf(this.currentSection);

                if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                    e.preventDefault();
                    this.navigateToSection(sections[currentIndex + 1]);
                } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                    e.preventDefault();
                    this.navigateToSection(sections[currentIndex - 1]);
                }
            }

            // Escape para cerrar modales/overlays
            if (e.key === 'Escape') {
                this.closeAllOverlays();
            }
        });

        console.log('⌨️ Navegación por teclado inicializada');
    }

    navigateToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    closeAllOverlays() {
        // Cerrar catálogos de productos
        const openCatalogs = document.querySelectorAll('.product-catalog.active');
        openCatalogs.forEach(catalog => {
            catalog.classList.remove('active');
            catalog.setAttribute('aria-hidden', 'true');
        });

        // Restaurar scroll del body
        document.body.style.overflow = 'auto';

        // Event personalizado para otros módulos
        window.dispatchEvent(new CustomEvent('overlaysClosed'));
    }

    /* ===== SMOOTH SCROLL ENHANCEMENTS - VERSIÓN CORREGIDA ===== */
    initializeSmoothScrollEnhancements() {
        // MAPEO CORRECTO DE ENLACES A SECCIONES
        const linkMapping = {
            '#inicio': '#home',        // ✅ CORRECCIÓN PRINCIPAL
            '#home': '#home',
            '#productos': '#productos',
            '#quienes-somos': '#quienes-somos',
            '#contacto': '#contacto'
        };

        // Mejorar todos los links de navegación interna
        const internalLinks = document.querySelectorAll('a[href^="#"]');

        console.log('🔗 Configurando navegación para', internalLinks.length, 'enlaces');

        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                console.log('🔗 Click en enlace:', href);

                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    this.smoothScrollToTop();
                    return;
                }

                // USAR MAPEO CORRECTO
                const mappedHref = linkMapping[href] || href;
                const targetElement = document.querySelector(mappedHref);

                if (targetElement) {
                    console.log('✅ Navegando a:', mappedHref, 'desde:', href);
                    e.preventDefault();

                    // Cerrar menú mobile si está abierto
                    const mobileNav = document.getElementById('mobileNavigation');
                    const mobileToggle = document.getElementById('mobileMenuToggle');
                    const mobileOverlay = document.querySelector('.mobile-overlay');

                    if (mobileNav && mobileNav.classList.contains('active')) {
                        console.log('📱 Cerrando menú mobile');
                        mobileToggle.classList.remove('active');
                        mobileNav.classList.remove('active');
                        if (mobileOverlay) mobileOverlay.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                    }

                    // Navegación suave
                    this.smoothScrollToElement(targetElement);

                    // Actualizar enlaces activos
                    this.updateActiveLinks(href); // Usar href original

                } else {
                    console.error('❌ Sección no encontrada para:', href, 'mapeado a:', mappedHref);

                    // Debug: mostrar todas las secciones disponibles
                    const allSections = Array.from(document.querySelectorAll('section[id]')).map(s => s.id);
                    console.log('📋 Secciones disponibles:', allSections);
                }
            });
        });

        console.log('🔄 Smooth scroll mejorado con mapeo correcto');
    }

    smoothScrollToElement(element, offset = 100) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    /* ===== PERFORMANCE OPTIMIZATIONS ===== */
    initializePerformanceOptimizations() {
        // Lazy loading para imágenes que no estén marcadas
        const lazyImages = document.querySelectorAll('img:not([loading])');

        if ('loading' in HTMLImageElement.prototype) {
            lazyImages.forEach(img => {
                img.loading = 'lazy';
            });
        } else {
            // Fallback para browsers que no soporten lazy loading nativo
            this.implementLazyLoading(lazyImages);
        }

        // Preload de recursos críticos
        this.preloadCriticalResources();

        console.log('⚡ Optimizaciones de performance aplicadas');
    }

    implementLazyLoading(images) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
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

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {

    }

    /* ===== ANALYTICS TRACKING ===== */
    initializeAnalyticsTracking() {
        // Tracking de tiempo en página
        this.startTime = Date.now();

        // Tracking de scroll depth
        this.maxScrollDepth = 0;

        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round(
                (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollDepth > this.maxScrollDepth) {
                this.maxScrollDepth = scrollDepth;

                // Tracking en hitos del 25%, 50%, 75%, 100%
                if ([25, 50, 75, 100].includes(scrollDepth)) {
                    this.trackEvent('Engagement', 'scroll_depth', `${scrollDepth}%`);
                }
            }
        });

        // Tracking al salir de la página
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);
            this.trackEvent('Engagement', 'time_on_page', timeOnPage);
            this.trackEvent('Engagement', 'max_scroll_depth', this.maxScrollDepth);
        });

        console.log('📊 Analytics tracking inicializado');
    }

    trackEvent(category, action, label = null, value = null) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            const eventData = {
                event_category: category,
                event_label: label,
                value: value
            };

            gtag('event', action, eventData);
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'CustomEvent', {
                category: category,
                action: action,
                label: label
            });
        }

        console.log(`📈 Event tracked: ${category} - ${action}`, label);
    }

    logPerformanceMetrics() {
        const metrics = {
            'DOMContentLoaded': this.performanceMetrics.domContentLoaded - this.performanceMetrics.loadStart,
            'FullyLoaded': this.performanceMetrics.fullyLoaded - this.performanceMetrics.loadStart,
            'InitializationTime': this.performanceMetrics.domContentLoaded - this.performanceMetrics.loadStart
        };

        console.log('📊 Performance Metrics:');
        Object.entries(metrics).forEach(([key, value]) => {
            console.log(`   ${key}: ${Math.round(value)}ms`);
        });

        // Enviar métricas a analytics si es necesario
        if (metrics.FullyLoaded > 3000) {
            this.trackEvent('Performance', 'slow_load', 'over_3s', Math.round(metrics.FullyLoaded));
        }
    }

    /* ===== MÉTODOS PÚBLICOS ===== */

    // Método para otros módulos que necesiten acceder al estado
    getCurrentSection() {
        return this.currentSection;
    }

    // Método para forzar actualización de scroll progress
    updateScrollProgress() {
        window.dispatchEvent(new Event('scroll'));
    }

    // Método para navegar programáticamente
    goToSection(sectionId) {
        this.navigateToSection(sectionId);
    }

    // Método para obtener métricas de performance
    getPerformanceMetrics() {
        return this.performanceMetrics;
    }

    updateActiveLinks(activeHref) {
        // Remover active de todos los enlaces
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });

        // Agregar active a los enlaces correspondientes
        document.querySelectorAll(`a[href="${activeHref}"]`).forEach(link => {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        });

        console.log('✅ Enlaces activos actualizados:', activeHref);
    }


}

/* ===== FORM CONTROLLER ===== */
class FormController {
    constructor(form) {
        this.form = form;
        this.submitButton = form.querySelector('.btn-submit');
        this.statusElement = form.querySelector('.form-status');
        this.isSubmitting = false;

        this.setupFormValidation();
        this.setupFormSubmission();

        console.log('📝 FormController inicializado');
    }

    setupFormValidation() {
        // Validación en tiempo real
        const inputs = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);

        let isValid = true;
        let errorMessage = '';

        // Validaciones específicas
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (fieldName === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
        } else if (fieldName === 'telefono' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Ingresa un teléfono válido';
        }

        // Mostrar/ocultar error
        if (errorElement) {
            if (isValid) {
                errorElement.textContent = '';
                field.parentElement.classList.remove('error');
            } else {
                errorElement.textContent = errorMessage;
                field.parentElement.classList.add('error');
            }
        }

        return isValid;
    }

    clearFieldError(field) {
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);

        if (errorElement) {
            errorElement.textContent = '';
            field.parentElement.classList.remove('error');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
        return phoneRegex.test(phone);
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    async handleFormSubmit() {
        if (this.isSubmitting) return;

        // Validar todos los campos
        const isFormValid = this.validateAllFields();

        if (!isFormValid) {
            this.showStatus('Por favor corrige los errores antes de enviar', 'error');
            return;
        }

        this.isSubmitting = true;
        this.setSubmittingState(true);

        try {
            // Simular envío del formulario
            const formData = new FormData(this.form);
            const result = await this.submitForm(formData);

            if (result.success) {
                this.showStatus('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                this.form.reset();

                // Analytics tracking
                window.siteController?.trackEvent('Form', 'contact_form_submit', 'success');
            } else {
                throw new Error(result.message || 'Error al enviar el formulario');
            }

        } catch (error) {
            console.error('Error al enviar formulario:', error);
            this.showStatus('Error al enviar el mensaje. Por favor intenta nuevamente.', 'error');

            // Analytics tracking
            window.siteController?.trackEvent('Form', 'contact_form_submit', 'error');
        } finally {
            this.isSubmitting = false;
            this.setSubmittingState(false);
        }
    }

    validateAllFields() {
        const inputs = this.form.querySelectorAll('.form-input[required], .form-select[required]');
        let allValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        return allValid;
    }

    async submitForm(formData) {
        // Aquí iría la lógica real de envío
        // Por ahora simulamos una respuesta exitosa después de 2 segundos

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Formulario enviado correctamente' });
            }, 2000);
        });
    }

    setSubmittingState(isSubmitting) {
        if (isSubmitting) {
            this.submitButton.classList.add('loading');
            this.submitButton.disabled = true;
        } else {
            this.submitButton.classList.remove('loading');
            this.submitButton.disabled = false;
        }
    }

    showStatus(message, type) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
            this.statusElement.className = `form-status ${type}`;

            // Auto-hide después de 5 segundos para mensajes de éxito
            if (type === 'success') {
                setTimeout(() => {
                    this.statusElement.textContent = '';
                    this.statusElement.className = 'form-status';
                }, 5000);
            }
        }
    }
}

/* ===== INICIALIZACIÓN GLOBAL ===== */

// Inicializar el controlador principal
window.siteController = new SiteController();

// Funciones globales para debugging y uso externo
window.getSiteState = () => window.siteController.getCurrentSection();
window.goToSection = (section) => window.siteController.goToSection(section);
window.updateScrollProgress = () => window.siteController.updateScrollProgress();
window.getPerformanceMetrics = () => window.siteController.getPerformanceMetrics();

// Event listeners para coordinación con otros módulos
window.addEventListener('menuStateChanged', (e) => {
    console.log('📱 Menu state changed:', e.detail);
});

window.addEventListener('catalogOpened', (e) => {
    console.log('📖 Catalog opened:', e.detail);
});

// Exportar para uso en módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SiteController, FormController };
}

console.log('🎯 main.js cargado completamente');


// ===== FORCE SCROLL PROGRESS INIT =====
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        const progressFill = document.querySelector('.progress-fill');
        const progressContainer = document.querySelector('.scroll-progress');

        if (progressFill && progressContainer) {
            // Forzar visibilidad
            progressContainer.style.display = 'block';
            progressContainer.style.visibility = 'visible';
            progressContainer.style.opacity = '1';

            // Función de actualización forzada
            function forceUpdateProgress() {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
                progressFill.style.width = progress + '%';
            }

            // Ejecutar inmediatamente
            forceUpdateProgress();

            // Agregar listener
            window.addEventListener('scroll', forceUpdateProgress);

            console.log('🔥 SCROLL PROGRESS FORZADO');
        }
    }, 500);
});










/* ===================================================================
   JAVASCRIPT MAPA PROFESIONAL - AGREGAR A TU ARCHIVO JS PRINCIPAL
   Funcionalidades optimizadas y separadas para el mapa interactivo
   =================================================================== */

// Configuración del mapa profesional
const MapaConfig = {
    phoneNumber: '573222284212',
    locations: {
        bogota: {
            name: "Bogotá D.C.",
            message: "Buenos días, me interesa obtener información sobre la distribución de AJEDREZ en Bogotá D.C. ¿Podrían proporcionarme detalles sobre precios, disponibilidad y condiciones comerciales para la capital?"
        },
        cundinamarca: {
            name: "Cundinamarca",
            message: "Hola, me interesa información sobre la distribución de AJEDREZ en la región de Cundinamarca. ¿Podrían facilitarme detalles sobre cobertura municipal, precios regionales y condiciones de distribución?"
        },
        expansion: {
            name: "Nuevas Oportunidades",
            message: "Buenos días, me interesa la posibilidad de convertirme en distribuidor de AJEDREZ en mi región. ¿Podrían evaluarme como posible distribuidor y proporcionarme información sobre requisitos, inversión inicial y condiciones comerciales?"
        }
    }
};

// Función principal de contacto con efectos profesionales
function contactLocation(locationKey) {
    const location = MapaConfig.locations[locationKey];

    if (location) {
        const message = encodeURIComponent(location.message);
        const whatsappUrl = `https://wa.me/${MapaConfig.phoneNumber}?text=${message}`;

        // Efectos visuales profesionales
        mostrarEfectosContacto(locationKey);

        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        // Tracking para analytics
        trackEventoMapa('contact_location', locationKey);

        console.log(`📱 WhatsApp contact: ${location.name}`);
    }
}

// Efectos visuales profesionales al contactar
function mostrarEfectosContacto(locationKey) {
    const button = document.querySelector(`[onclick="contactLocation('${locationKey}')"]`);

    if (button) {
        // Agregar clase de click para efecto de onda
        button.classList.add('clicked');

        // Guardar contenido original
        const originalContent = button.innerHTML;

        // Cambiar a check de éxito
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        `;

        // Cambiar estilo a éxito
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        button.style.transform = 'translateY(-3px) scale(1.05)';

        // Mostrar notificación de éxito
        mostrarNotificacionExito(locationKey);

        // Restaurar botón después de 3 segundos
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.background = '';
            button.style.transform = '';
            button.classList.remove('clicked');
        }, 3000);
    }
}

// Mostrar notificación de éxito profesional
function mostrarNotificacionExito(locationKey) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <svg class="notification-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>¡Abriendo WhatsApp!</span>
    `;

    document.body.appendChild(notification);

    // Animar entrada
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // Animar salida después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 3000);
}

// Función para mostrar detalles del mapa (modal)
function showMapDetails() {
    const mapCard = document.querySelector('.map-card');

    // Efecto visual en el mapa
    if (mapCard) {
        mapCard.style.transform = 'scale(1.02)';
        mapCard.style.boxShadow = '0 20px 50px rgba(189, 147, 249, 0.4)';

        setTimeout(() => {
            mapCard.style.transform = '';
            mapCard.style.boxShadow = '';
        }, 300);
    }

    // Mostrar modal informativo
    mostrarModalMapa();
}

// Modal de información detallada del mapa
function mostrarModalMapa() {
    const modal = document.createElement('div');
    modal.className = 'map-info-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="cerrarModalMapa()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Nuestra Cobertura en Detalle</h3>
                <button class="modal-close" onclick="cerrarModalMapa()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="coverage-detail">
                    <h4>🏢 Bogotá D.C. - Sede Principal</h4>
                    <p>Centro neurálgico de nuestra operación con cobertura completa en las 32 localidades de la capital.</p>
                </div>
                <div class="coverage-detail">
                    <h4>🎯 Cundinamarca - Región Completa</h4>
                    <p>Distribución regional que abarca los 116 municipios de Cundinamarca con logística especializada.</p>
                </div>
                <div class="coverage-highlight">
                    <p><strong>✅ 100% de cobertura</strong> en nuestra zona de influencia</p>
                    <p><strong>🚚 Distribución directa</strong> desde nuestras instalaciones</p>
                    <p><strong>📞 Atención personalizada</strong> para cada distribuidor</p>
                </div>
                <div class="modal-actions">
                    <button class="modal-contact-btn" onclick="contactLocation('bogota')">
                        Contactar Bogotá
                    </button>
                    <button class="modal-contact-btn" onclick="contactLocation('cundinamarca')">
                        Contactar Cundinamarca
                    </button>
                </div>
            </div>
        </div>
    `;

    // Aplicar estilos al modal
    aplicarEstilosModal(modal);

    document.body.appendChild(modal);

    // Animar entrada
    setTimeout(() => {
        modal.querySelector('.modal-overlay').style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        modal.querySelector('.modal-content').style.opacity = '1';
    }, 50);
}

// Aplicar estilos inline al modal
function aplicarEstilosModal(modal) {
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    const overlay = modal.querySelector('.modal-overlay');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: pointer;
    `;

    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
        background: linear-gradient(135deg, #1e1e3f, #2a2a5f);
        border-radius: 20px;
        border: 1px solid rgba(189, 147, 249, 0.3);
        max-width: 500px;
        width: 100%;
        transform: translateY(50px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;

    const header = modal.querySelector('.modal-header');
    header.style.cssText = `
        padding: 24px 24px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

    const title = modal.querySelector('.modal-header h3');
    title.style.cssText = `
        color: #bd93f9;
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
    `;

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const body = modal.querySelector('.modal-body');
    body.style.cssText = `
        padding: 24px;
        color: rgba(255, 255, 255, 0.9);
    `;

    // Estilos para elementos del cuerpo
    const details = modal.querySelectorAll('.coverage-detail');
    details.forEach(detail => {
        detail.style.cssText = `
            margin-bottom: 20px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border: 1px solid rgba(189, 147, 249, 0.2);
        `;

        const h4 = detail.querySelector('h4');
        if (h4) {
            h4.style.cssText = `
                color: #bd93f9;
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 8px;
            `;
        }

        const p = detail.querySelector('p');
        if (p) {
            p.style.cssText = `
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.5;
                margin: 0;
            `;
        }
    });

    const highlight = modal.querySelector('.coverage-highlight');
    if (highlight) {
        highlight.style.cssText = `
            background: rgba(189, 147, 249, 0.1);
            border: 1px solid rgba(189, 147, 249, 0.3);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
        `;

        const paragraphs = highlight.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.style.cssText = `
                color: rgba(255, 255, 255, 0.9);
                margin: 8px 0;
                font-size: 0.95rem;
            `;
        });
    }

    const actions = modal.querySelector('.modal-actions');
    if (actions) {
        actions.style.cssText = `
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 20px;
        `;

        const buttons = actions.querySelectorAll('.modal-contact-btn');
        buttons.forEach(btn => {
            btn.style.cssText = `
                padding: 12px 24px;
                background: linear-gradient(135deg, #25D366, #128C7E);
                border: none;
                border-radius: 25px;
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            `;
        });
    }
}

// Cerrar modal del mapa
function cerrarModalMapa() {
    const modal = document.querySelector('.map-info-modal');
    if (modal) {
        modal.querySelector('.modal-overlay').style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translateY(50px)';
        modal.querySelector('.modal-content').style.opacity = '0';

        setTimeout(() => {
            modal.remove();
        }, 400);
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    console.log('🗺️ Mapa Profesional inicializado');

    // Inicializar animaciones
    inicializarAnimacionesMapa();

    // Configurar efectos de hover mejorados
    configurarEfectosHover();

    // Optimizar para dispositivos touch
    optimizarParaTouch();

    // Configurar Intersection Observer para animaciones al scroll
    configurarScrollAnimations();

    // Tracking de inicialización
    trackEventoMapa('map_initialized', window.innerWidth <= 768 ? 'mobile' : 'desktop');
});

// Animaciones iniciales del mapa
function inicializarAnimacionesMapa() {
    const mapVisual = document.querySelector('.map-visual');
    const locationCards = document.querySelectorAll('.location-card');
    const statCards = document.querySelectorAll('.stat-card');

    // Animación del mapa con efecto de revelado
    if (mapVisual) {
        mapVisual.style.opacity = '0';
        mapVisual.style.transform = 'translateY(30px) scale(0.95)';
        mapVisual.style.filter = 'blur(5px)';

        setTimeout(() => {
            mapVisual.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
            mapVisual.style.opacity = '1';
            mapVisual.style.transform = 'translateY(0) scale(1)';
            mapVisual.style.filter = 'blur(0px)';
        }, 300);
    }

    // Animación escalonada de las tarjetas
    locationCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';

        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 800 + (index * 300));
    });

    // Animación de estadísticas
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 1400 + (index * 150));
    });
}

// Configurar efectos de hover mejorados
function configurarEfectosHover() {
    // Efectos para las tarjetas de ubicación
    const locationCards = document.querySelectorAll('.location-card');
    locationCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 60px rgba(189, 147, 249, 0.3)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Efectos para las estadísticas
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-6px) scale(1.05)';

            const statNumber = this.querySelector('.stat-number');
            if (statNumber) {
                statNumber.style.transform = 'scale(1.1)';
                statNumber.style.filter = 'drop-shadow(0 0 10px rgba(189, 147, 249, 0.8))';
            }
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';

            const statNumber = this.querySelector('.stat-number');
            if (statNumber) {
                statNumber.style.transform = '';
                statNumber.style.filter = '';
            }
        });
    });
}

// Optimización para dispositivos touch
function optimizarParaTouch() {
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');

        const elementos = document.querySelectorAll('.contact-location-btn, .cta-button, .location-card');
        elementos.forEach(elemento => {
            elemento.addEventListener('touchstart', function (e) {
                this.style.transform = 'scale(0.98)';
                crearEfectoRipple(e, this);
            });

            elemento.addEventListener('touchend', function () {
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            });
        });
    }
}

// Crear efecto ripple al tocar
function crearEfectoRipple(event, elemento) {
    const rect = elemento.getBoundingClientRect();
    const ripple = document.createElement('span');

    const size = Math.max(rect.width, rect.height);
    const x = event.touches[0].clientX - rect.left - size / 2;
    const y = event.touches[0].clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: rippleAnimation 0.6s linear;
        pointer-events: none;
    `;

    elemento.style.position = 'relative';
    elemento.style.overflow = 'hidden';
    elemento.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Configurar animaciones al scroll
function configurarScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');

                    // Efectos específicos por tipo de elemento
                    if (entry.target.classList.contains('stat-number')) {
                        animarNumeroEstadistica(entry.target);
                    } else if (entry.target.classList.contains('expansion-cta')) {
                        const button = entry.target.querySelector('.cta-button');
                        if (button) {
                            button.style.animation = 'subtlePulse 3s ease-in-out infinite';
                        }
                    }
                }
            });
        }, observerOptions);

        // Observar elementos clave
        document.querySelectorAll('.stat-card, .location-card, .expansion-cta').forEach(el => {
            observer.observe(el);
        });
    }
}

// Animar números de estadísticas
function animarNumeroEstadistica(elemento) {
    const finalNumber = parseInt(elemento.textContent.replace(/\D/g, ''));
    const suffix = elemento.textContent.replace(/\d/g, '');

    if (finalNumber && !elemento.hasAttribute('data-animated')) {
        elemento.setAttribute('data-animated', 'true');

        let currentNumber = 0;
        const increment = Math.ceil(finalNumber / 50);
        const duration = 1500; // 1.5 segundos
        const stepTime = duration / (finalNumber / increment);

        const timer = setInterval(() => {
            currentNumber += increment;

            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }

            elemento.textContent = currentNumber + suffix;
        }, stepTime);
    }
}

// Tracking de eventos para analytics
function trackEventoMapa(action, label) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: 'Professional_Map',
            event_label: label,
            value: 1
        });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
            content_name: `Map_${action}`,
            content_category: 'Map_Interaction'
        });
    }

    // Console log para debug
    console.log(`📊 Event tracked: ${action} - ${label}`);
}

// Manejo de errores de WhatsApp
window.addEventListener('error', function (e) {
    if (e.message && (e.message.includes('wa.me') || e.message.includes('whatsapp'))) {
        console.warn('WhatsApp error handled:', e.message);

        // Mostrar alerta amigable
        mostrarAlertaWhatsApp();
    }
});

// Mostrar alerta si hay problemas con WhatsApp
function mostrarAlertaWhatsApp() {
    const alerta = document.createElement('div');
    alerta.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1e1e3f, #2a2a5f);
            color: white;
            padding: 24px;
            border-radius: 16px;
            border: 1px solid rgba(189, 147, 249, 0.3);
            max-width: 400px;
            text-align: center;
            z-index: 3000;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        ">
            <h3 style="color: #bd93f9; margin-bottom: 12px;">WhatsApp no disponible</h3>
            <p style="margin-bottom: 20px; line-height: 1.5;">
                Por favor, asegúrate de tener WhatsApp instalado o utiliza WhatsApp Web en tu navegador.
            </p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                padding: 12px 24px;
                background: linear-gradient(135deg, #bd93f9, #ff79c6);
                border: none;
                border-radius: 25px;
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Entendido</button>
        </div>
        <div onclick="this.parentElement.remove()" style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 2999;
            cursor: pointer;
        "></div>
    `;

    document.body.appendChild(alerta);
}

// Preload de optimización
document.addEventListener('DOMContentLoaded', function () {
    // Preload WhatsApp domain
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = '//wa.me';
    document.head.appendChild(link);

    // Preload Google Fonts si es necesario
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
});

// Funciones de utilidad adicionales

// Detectar si el usuario está en mobile
function esMobile() {
    return window.innerWidth <= 768;
}

// Detectar si el dispositivo soporta hover
function soportaHover() {
    return window.matchMedia('(hover: hover)').matches;
}

// Smooth scroll para navegación interna
function scrollSuave(elemento) {
    if (elemento) {
        elemento.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Debounce para optimizar eventos de scroll/resize
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

// Manejo de resize con debounce
window.addEventListener('resize', debounce(() => {
    // Reconfigurar si cambió de mobile a desktop o viceversa
    const nuevoEsMobile = esMobile();
    if (nuevoEsMobile !== document.body.classList.contains('touch-device')) {
        optimizarParaTouch();
    }
}, 250));

// Agregar estilos CSS necesarios mediante JavaScript
function agregarEstilosAdicionales() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleAnimation {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }
        
        @keyframes subtlePulse {
            0%, 100% {
                box-shadow: 0 8px 30px rgba(189, 147, 249, 0.4);
            }
            50% {
                box-shadow: 0 8px 35px rgba(189, 147, 249, 0.6);
            }
        }
        
        .touch-device .contact-location-btn:hover,
        .touch-device .location-card:hover,
        .touch-device .stat-card:hover {
            transform: none !important;
        }
        
        /* Mejoras de accesibilidad */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        /* Focus visible para navegación por teclado */
        .contact-location-btn:focus-visible,
        .cta-button:focus-visible {
            outline: 2px solid #bd93f9;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
}

// Ejecutar al cargar
agregarEstilosAdicionales();

// Exportar funciones globales necesarias
window.contactLocation = contactLocation;
window.showMapDetails = showMapDetails;
window.cerrarModalMapa = cerrarModalMapa;

console.log('✅ Mapa Profesional: Todas las funciones cargadas correctamente');


















/* ===================================================================
   FORMULARIO DE CONTACTO - JAVASCRIPT CORREGIDO
   COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Envío a: yagamidsa@hotmail.com
   =================================================================== */

// ===== CONFIGURACIÓN GLOBAL =====
const FORM_CONFIG = {
    // Email Configuration
    emailTo: 'yagamidsa@hotmail.com',
    emailSubject: 'Nueva Solicitud de Distribución AJEDREZ',

    // EmailJS Configuration (Opcional - configurar si se usa EmailJS)
    emailJS: {
        serviceID: 'service_ajedrez',
        templateID: 'template_ajedrez',
        userID: 'tu_user_id_emailjs'
    },

    // WhatsApp Configuration
    whatsappNumber: '573222284212',
    whatsappBaseMessage: 'Hola, me interesa información sobre distribución de AJEDREZ. ',

    // Form Validation Rules
    validation: {
        name: {
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-ZÀ-ÿ\s]+$/
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        phone: {
            pattern: /^[\+]?[0-9\s\-\(\)]+$/,
            minLength: 10
        }
    }
};

// ===== CLASE PRINCIPAL DEL FORMULARIO =====
class DistributorContactForm {
    constructor() {
        this.form = document.getElementById('distributorForm');
        this.submitButton = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.formData = {};
        this.isSubmitting = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupRealTimeValidation();
        this.setupAnimations();
        this.setupWhatsAppIntegration();
        console.log('📋 Formulario de contacto inicializado correctamente');
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        if (!this.form || !this.submitButton) {
            console.error('❌ Elementos del formulario no encontrados');
            return;
        }

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Input effects
        this.setupInputEffects();

        // Button effects
        this.setupButtonEffects();

        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    setupInputEffects() {
        const inputs = this.form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            const label = this.form.querySelector(`label[for="${input.id}"]`);

            // Focus effects
            input.addEventListener('focus', () => {
                this.animateInputFocus(input, label);
            });

            // Blur effects
            input.addEventListener('blur', () => {
                this.animateInputBlur(input, label);
                this.validateField(input);
            });

            // Input effects while typing
            input.addEventListener('input', () => {
                this.clearFieldError(input);
                this.updateFormData(input);
            });
        });
    }

    setupButtonEffects() {
        const buttons = document.querySelectorAll('.submit-btn, .whatsapp-btn, .phone-btn');

        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.animateButtonHover(button, true);
            });

            button.addEventListener('mouseleave', () => {
                this.animateButtonHover(button, false);
            });
        });
    }

    setupKeyboardNavigation() {
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.type !== 'textarea') {
                e.preventDefault();
                this.focusNextField(e.target);
            }
        });
    }

    // ===== VALIDACIÓN =====
    setupRealTimeValidation() {
        const requiredFields = this.form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (field.type === 'email' || field.type === 'tel') {
                field.addEventListener('input', () => {
                    this.debounce(() => this.validateField(field), 500);
                });
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }

        // Specific validations
        if (value && isValid) {
            switch (fieldName) {
                case 'firstName':
                case 'lastName':
                    if (!FORM_CONFIG.validation.name.pattern.test(value)) {
                        isValid = false;
                        errorMessage = 'Solo se permiten letras y espacios';
                    } else if (value.length < FORM_CONFIG.validation.name.minLength) {
                        isValid = false;
                        errorMessage = `Mínimo ${FORM_CONFIG.validation.name.minLength} caracteres`;
                    }
                    break;

                case 'email':
                    if (!FORM_CONFIG.validation.email.pattern.test(value)) {
                        isValid = false;
                        errorMessage = 'Formato de email inválido';
                    }
                    break;

                case 'phone':
                    if (!FORM_CONFIG.validation.phone.pattern.test(value)) {
                        isValid = false;
                        errorMessage = 'Formato de teléfono inválido';
                    } else if (value.replace(/\D/g, '').length < FORM_CONFIG.validation.phone.minLength) {
                        isValid = false;
                        errorMessage = 'Teléfono debe tener al menos 10 dígitos';
                    }
                    break;

                case 'businessName':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Nombre del negocio muy corto';
                    }
                    break;

                case 'city':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Nombre de ciudad inválido';
                    }
                    break;
            }
        }

        // Terms validation
        if (fieldName === 'terms' && !field.checked) {
            isValid = false;
            errorMessage = 'Debe aceptar los términos y condiciones';
        }

        // Show/hide error
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    validateAllFields() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        let isFormValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    // ===== MANEJO DE ERRORES =====
    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            field.style.borderColor = '#ff79c6';
            field.style.boxShadow = '0 0 0 3px rgba(255, 121, 198, 0.2)';
        }
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
            field.style.borderColor = '';
            field.style.boxShadow = '';
        }
    }

    // ===== ANIMACIONES =====
    animateInputFocus(input, label) {
        if (label) {
            label.style.color = '#bd93f9';
            label.style.transform = 'translateY(-2px)';
        }

        input.style.transform = 'translateY(-2px)';
        input.style.borderColor = '#bd93f9';
        input.style.boxShadow = '0 0 0 3px rgba(189, 147, 249, 0.2)';
    }

    animateInputBlur(input, label) {
        if (label && !input.value) {
            label.style.color = '';
            label.style.transform = '';
        }

        input.style.transform = '';
        if (!input.value) {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        }
    }

    animateButtonHover(button, isHover) {
        if (isHover) {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
        } else {
            button.style.transform = '';
            button.style.boxShadow = '';
        }
    }

    // ===== ENVÍO DEL FORMULARIO =====
    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        // Validate all fields
        if (!this.validateAllFields()) {
            this.showFormError('Por favor, corrige los errores antes de enviar');
            return;
        }

        this.isSubmitting = true;
        this.showLoadingState();

        try {
            // Collect form data
            this.collectFormData();

            // Send email
            await this.sendEmail();

            // Show success
            this.showSuccessMessage();

            console.log('✅ Formulario enviado exitosamente');

        } catch (error) {
            console.error('❌ Error al enviar formulario:', error);
            this.showFormError('Error al enviar el formulario. Por favor, contacta directamente por WhatsApp.');
        } finally {
            this.isSubmitting = false;
            this.hideLoadingState();
        }
    }

    collectFormData() {
        const formData = new FormData(this.form);
        this.formData = {};

        for (let [key, value] of formData.entries()) {
            this.formData[key] = value;
        }

        // Add metadata
        this.formData.timestamp = new Date().toISOString();
        this.formData.source = 'Formulario Web AJEDREZ';

        console.log('📋 Datos recopilados:', this.formData);
    }

    async sendEmail() {
        // Crear enlace mailto
        const subject = encodeURIComponent(FORM_CONFIG.emailSubject);
        const body = encodeURIComponent(this.formatEmailBody());
        const mailtoLink = `mailto:${FORM_CONFIG.emailTo}?subject=${subject}&body=${body}`;

        // Abrir cliente de email
        window.open(mailtoLink, '_blank');

        // Simular envío exitoso
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }

    formatEmailBody() {
        return `
NUEVA SOLICITUD DE DISTRIBUCIÓN AJEDREZ

=== INFORMACIÓN PERSONAL ===
Nombre: ${this.formData.firstName || ''} ${this.formData.lastName || ''}
Email: ${this.formData.email || ''}
Teléfono: ${this.formData.phone || ''}

=== INFORMACIÓN DEL NEGOCIO ===
Empresa: ${this.formData.businessName || ''}
Tipo de Negocio: ${this.formData.businessType || 'No especificado'}
Experiencia: ${this.formData.experience || 'No especificado'}

=== UBICACIÓN ===
Departamento: ${this.formData.department || ''}
Ciudad: ${this.formData.city || ''}

=== INFORMACIÓN COMERCIAL ===
Tipo de Consulta: ${this.formData.inquiryType || 'Consulta general'}
Volumen Mensual: ${this.formData.monthlyVolume || 'No especificado'}

=== MENSAJE ===
${this.formData.message || 'Sin mensaje adicional'}

=== METADATOS ===
Fecha: ${new Date().toLocaleString('es-CO')}
Fuente: Formulario Web AJEDREZ

---
Enviado desde el sitio web de COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
        `.trim();
    }

    showLoadingState() {
        const btnText = this.submitButton.querySelector('.btn-text');
        const btnLoading = this.submitButton.querySelector('.btn-loading');

        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'flex';

        this.submitButton.disabled = true;
        this.submitButton.style.opacity = '0.7';
    }

    hideLoadingState() {
        const btnText = this.submitButton.querySelector('.btn-text');
        const btnLoading = this.submitButton.querySelector('.btn-loading');

        if (btnText) btnText.style.display = 'block';
        if (btnLoading) btnLoading.style.display = 'none';

        this.submitButton.disabled = false;
        this.submitButton.style.opacity = '1';
    }

    showSuccessMessage() {
        this.form.style.display = 'none';
        if (this.successMessage) {
            this.successMessage.style.display = 'block';

            setTimeout(() => {
                this.successMessage.style.opacity = '1';
                this.successMessage.style.transform = 'translateY(0)';
            }, 100);

            this.successMessage.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    showFormError(message) {
        let errorBanner = document.querySelector('.form-error-banner');

        if (!errorBanner) {
            errorBanner = document.createElement('div');
            errorBanner.className = 'form-error-banner';
            errorBanner.style.cssText = `
                background: rgba(255, 121, 198, 0.1);
                border: 2px solid #ff79c6;
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1.5rem;
                color: #ff79c6;
                text-align: center;
                font-weight: 600;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            `;
            this.form.insertBefore(errorBanner, this.form.firstChild);
        }

        errorBanner.textContent = message;

        setTimeout(() => {
            errorBanner.style.opacity = '1';
            errorBanner.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            if (errorBanner) {
                errorBanner.style.opacity = '0';
                errorBanner.style.transform = 'translateY(-10px)';
                setTimeout(() => errorBanner.remove(), 300);
            }
        }, 5000);
    }

    // ===== WHATSAPP INTEGRATION =====
    setupWhatsAppIntegration() {
        const whatsappButtons = document.querySelectorAll('.whatsapp-btn');

        whatsappButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openWhatsApp(button);
            });
        });
    }

    openWhatsApp(button) {
        let message = FORM_CONFIG.whatsappBaseMessage;

        const partialData = this.getPartialFormData();
        if (partialData.businessName) {
            message += ` Mi empresa es: ${partialData.businessName}.`;
        }
        if (partialData.city) {
            message += ` Ubicación: ${partialData.city}.`;
        }

        const whatsappUrl = `https://wa.me/${FORM_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        console.log('📱 WhatsApp abierto');
    }

    getPartialFormData() {
        const partialData = {};
        const fields = ['businessName', 'city', 'inquiryType'];

        fields.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && field.value.trim()) {
                partialData[fieldName] = field.value.trim();
            }
        });

        return partialData;
    }

    // ===== UTILITY FUNCTIONS =====
    debounce(func, wait) {
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

    focusNextField(currentField) {
        const formElements = Array.from(this.form.querySelectorAll(
            'input, select, textarea, button'
        )).filter(el => !el.disabled && el.tabIndex !== -1);

        const currentIndex = formElements.indexOf(currentField);
        const nextField = formElements[currentIndex + 1];

        if (nextField) {
            nextField.focus();
        }
    }

    updateFormData(field) {
        this.formData[field.name] = field.value;
    }

    // ===== RESET FUNCTIONS =====
    resetForm() {
        this.form.reset();
        this.formData = {};
        this.clearAllErrors();
        this.form.style.display = 'block';
        if (this.successMessage) {
            this.successMessage.style.display = 'none';
        }

        console.log('🔄 Formulario reiniciado');
    }

    clearAllErrors() {
        const errorElements = this.form.querySelectorAll('.form-error');
        errorElements.forEach(error => {
            error.classList.remove('show');
        });

        const errorBanner = document.querySelector('.form-error-banner');
        if (errorBanner) {
            errorBanner.remove();
        }
    }

    setupAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===== FLOATING WHATSAPP BUTTON =====
class FloatingWhatsApp {
    constructor() {
        this.createButton();
        this.setupEventListeners();
    }

    createButton() {
        if (document.querySelector('.whatsapp-float')) return;

        const button = document.createElement('a');
        button.className = 'whatsapp-float';
        button.href = '#';
        button.setAttribute('aria-label', 'Contactar por WhatsApp');
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 30px; height: 30px;">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.488"/>
            </svg>
        `;

        const styles = `
            .whatsapp-float {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: #1DB954;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 20px rgba(29, 185, 84, 0.4);
                z-index: 9999;
                transition: all 0.3s ease;
                animation: whatsappPulse 2s infinite;
                text-decoration: none;
                color: white;
            }
            
            .whatsapp-float:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 30px rgba(29, 185, 84, 0.6);
                color: white;
            }
            
            @keyframes whatsappPulse {
                0%, 100% { box-shadow: 0 4px 20px rgba(29, 185, 84, 0.4); }
                50% { box-shadow: 0 4px 20px rgba(29, 185, 84, 0.8), 0 0 0 10px rgba(29, 185, 84, 0.1); }
            }
            
            @media (max-width: 768px) {
                .whatsapp-float {
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                }
                
                .whatsapp-float svg {
                    width: 25px !important;
                    height: 25px !important;
                }
            }
        `;

        if (!document.querySelector('#whatsapp-float-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'whatsapp-float-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        document.body.appendChild(button);
    }

    setupEventListeners() {
        const button = document.querySelector('.whatsapp-float');
        if (!button) return;

        button.addEventListener('click', (e) => {
            e.preventDefault();

            const message = 'Hola, me interesa conocer más sobre los productos AJEDREZ y las oportunidades de distribución.';
            const whatsappUrl = `https://wa.me/${FORM_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

            console.log('📱 Floating WhatsApp button clicked');
        });
    }
}

// ===== GLOBAL RESET FUNCTION =====
window.resetForm = function () {
    if (window.contactForm) {
        window.contactForm.resetForm();
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Inicializando sistema de formularios AJEDREZ...');

    // Initialize contact form if present
    const contactFormElement = document.getElementById('distributorForm');
    if (contactFormElement) {
        window.contactForm = new DistributorContactForm();
        console.log('✅ Formulario de contacto inicializado');
    }

    // Initialize floating WhatsApp button
    window.floatingWhatsApp = new FloatingWhatsApp();
    console.log('✅ Botón flotante de WhatsApp inicializado');

    // Initialize smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('🎉 Todos los sistemas inicializados correctamente');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function (e) {
    console.error('❌ Error en el sistema de formularios:', e.error);
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DistributorContactForm, FloatingWhatsApp, FORM_CONFIG };
}






// AJEDREZ News Modal System - Complete JavaScript
class AjedrezNewsModal {
    constructor() {
        // CONFIGURACIÓN - CAMBIAR AQUÍ TU NÚMERO DE WHATSAPP
        this.config = {
            whatsappNumber: '573222284212',
            images: {
                expansionNacional: 'images/Expansion.webp',
                nuevosDistribuidores: 'images/wine.jpg',
                tendenciasBebidas: 'images/bebidas.png',
                // Fallbacks usando imágenes existentes
                fallbacks: {
                    expansion: 'images/Expansion.webp',
                    distribuidores: 'images/wine.jpg'
                }
            }
        };

        this.newsData = {
            'expansion-nacional': {
                title: 'Expansión Nacional AJEDREZ 2025',
                date: '15 de Enero, 2025',
                image: this.config.images.expansionNacional,
                type: 'expansion',
                content: {
                    intro: 'Durante 2025, AJEDREZ llegará a 8 nuevas ciudades estratégicas de Colombia, consolidando su presencia nacional con una inversión de $45 millones de pesos colombianos y la incorporación de más de 35 nuevos distribuidores especializados.',
                    sections: [
                        {
                            title: 'Nuevas Ciudades Estratégicas',
                            content: `
                                <p>Durante 2025, AJEDREZ llegará a <strong>8 nuevas ciudades estratégicas</strong> de Colombia, expandiendo gradualmente su presencia regional. Esta expansión inteligente incluye:</p>
                                <ul class="feature-list">
                                    <li><strong>Costa Atlántica:</strong> Barranquilla, Cartagena</li>
                                    <li><strong>Eje Cafetero:</strong> Manizales, Pereira</li>
                                    <li><strong>Valle del Cauca:</strong> Cali, Palmira</li>
                                    <li><strong>Santanderes:</strong> Bucaramanga, Cúcuta</li>
                                </ul>
                                <p>Cada nueva ciudad representa una oportunidad cuidadosamente estudiada para maximizar el retorno de inversión.</p>
                            `
                        },
                        {
                            title: 'Inversión y Crecimiento',
                            content: `
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <span class="stat-number">$45M</span>
                                        <span class="stat-label">Millones COP Inversión</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">35+</span>
                                        <span class="stat-label">Nuevos Distribuidores</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">180%</span>
                                        <span class="stat-label">Crecimiento Proyectado</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">12</span>
                                        <span class="stat-label">Departamentos Cubiertos</span>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Estrategia de Distribución',
                            content: `
                                <div class="highlight-box">
                                    <p><strong>🎯 Objetivo 2025:</strong> Consolidarnos como distribuidores especializados en vinos espumosos sin alcohol, con presencia estratégica en las principales ciudades de Colombia.</p>
                                </div>
                                <p>Nuestra estrategia de expansión se basa en crecimiento sostenible:</p>
                                <ul class="feature-list">
                                    <li><strong>Distribuidores Selectos:</strong> Alianzas con socios locales de confianza</li>
                                    <li><strong>Logística Eficiente:</strong> 3 centros de distribución regionales</li>
                                    <li><strong>Marketing Dirigido:</strong> Campañas focalizadas por región</li>
                                    <li><strong>Capacitación Personalizada:</strong> Entrenamiento directo a cada distribuidor</li>
                                </ul>
                            `
                        }
                    ],
                    whatsappMessage: "Hola, me interesa ser distribuidor de AJEDREZ en la expansión 2025. ¿Podrían darme información sobre las oportunidades en mi región y los requisitos para participar?"
                }
            },
            'nuevos-distribuidores': {
                title: 'Nuevos Distribuidores Autorizados',
                date: '20 de Diciembre, 2024',
                image: this.config.images.nuevosDistribuidores,
                type: 'distribuidores',
                content: {
                    intro: 'La familia AJEDREZ crece con la incorporación de distribuidores estratégicos que fortalecen nuestra presencia nacional y garantizan la mejor experiencia para nuestros consumidores.',
                    sections: [
                        {
                            title: 'Nuevos Socios Estratégicos',
                            content: `
                                <p>Durante el último trimestre de 2024, hemos incorporado <strong>12 nuevos distribuidores autorizados</strong> cuidadosamente seleccionados por su experiencia local y compromiso con la excelencia en el servicio.</p>
                                
                                <div class="highlight-box">
                                    <h4>🏆 Distribuidores Destacados del Mes</h4>
                                    <ul class="feature-list">
                                        <li><strong>Bebidas Premium Medellín:</strong> Especialistas en eventos corporativos</li>
                                        <li><strong>Distribuciones del Caribe:</strong> Cobertura en Barranquilla y zona metropolitana</li>
                                        <li><strong>Vinos Selectos Cali:</strong> Red en tiendas gourmet y restaurantes</li>
                                        <li><strong>Celebraciones Especiales Bucaramanga:</strong> Enfoque en mercado de eventos</li>
                                    </ul>
                                </div>
                            `
                        },
                        {
                            title: 'Perfil del Distribuidor AJEDREZ',
                            content: `
                                <p>Nuestros distribuidores autorizados cumplen con estrictos estándares de calidad y servicio:</p>
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <span class="stat-number">5+</span>
                                        <span class="stat-label">Años de Experiencia</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">98%</span>
                                        <span class="stat-label">Satisfacción del Cliente</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">24h</span>
                                        <span class="stat-label">Tiempo de Respuesta</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">100%</span>
                                        <span class="stat-label">Productos Originales</span>
                                    </div>
                                </div>
                            `
                        },
                        {
                            title: 'Beneficios y Garantías',
                            content: `
                                <h4>🤝 Lo que ofrecemos a nuestros distribuidores:</h4>
                                <ul class="feature-list">
                                    <li><strong>Territorio Exclusivo:</strong> Protección de zona geográfica</li>
                                    <li><strong>Material POP:</strong> Elementos promocionales de alta calidad</li>
                                    <li><strong>Capacitación Continua:</strong> Entrenamientos mensuales especializados</li>
                                    <li><strong>Soporte Técnico:</strong> Asesoría comercial permanente</li>
                                    <li><strong>Marketing Digital:</strong> Campañas locales personalizadas</li>
                                    <li><strong>Descuentos Escalonados:</strong> Mejores precios por volumen</li>
                                </ul>
                                
                                <div class="highlight-box">
                                    <p><strong>💡 ¿Sabías que?</strong> El 87% de nuestros distribuidores han aumentado sus ventas en un 25% durante el primer año de asociación con AJEDREZ.</p>
                                </div>
                            `
                        }
                    ],
                    whatsappMessage: "Hola, me interesa convertirme en distribuidor autorizado de AJEDREZ. ¿Podrían enviarme información sobre los requisitos y beneficios?"
                }
            },
            'tendencias-sin-alcohol': {
                title: 'Tendencias en Bebidas Sin Alcohol',
                date: '10 de Diciembre, 2024',
                image: this.config.images.tendenciasBebidas,
                type: 'tendencias',
                content: {
                    intro: 'El mercado colombiano de bebidas sin alcohol presenta un panorama prometedor con múltiples oportunidades de crecimiento para distribuidores y consumidores conscientes.',
                    sections: [
                        {
                            title: 'Panorama del Mercado Colombiano',
                            content: `
                    <p>Colombia se consolida como un mercado clave en Latinoamérica para las bebidas premium sin alcohol, impulsado por nuevos hábitos de consumo y preferencias saludables.</p>
                    
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-number">42%</span>
                            <span class="stat-label">Crecimiento anual del sector</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">67%</span>
                            <span class="stat-label">Consumidores prefieren alternativas</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">25-40</span>
                            <span class="stat-label">Años - Segmento principal</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">$450M</span>
                            <span class="stat-label">Millones COP - Mercado 2026</span>
                        </div>
                    </div>
                    
                    <div class="highlight-box">
                        <h4>🌟 Datos Destacados</h4>
                        <ul class="feature-list">
                            <li><strong>Penetración de mercado:</strong> 31% en ciudades principales</li>
                            <li><strong>Frecuencia de compra:</strong> 2.3 veces por mes promedio</li>
                            <li><strong>Precio promedio:</strong> $28,000 - $45,000 COP por botella</li>
                            <li><strong>Canales preferidos:</strong> Supermercados (54%), Tiendas especializadas (29%)</li>
                        </ul>
                    </div>
                `
                        },
                        {
                            title: 'Comportamiento del Consumidor',
                            content: `
                    <div class="highlight-box">
                        <h4>🎯 Perfil del Consumidor Moderno</h4>
                        <p>Investigaciones recientes revelan patrones específicos en el consumo de bebidas sin alcohol en Colombia:</p>
                    </div>
                    
                    <ul class="feature-list">
                        <li><strong>Género:</strong> 58% mujeres, 42% hombres</li>
                        <li><strong>Motivaciones principales:</strong> Salud (73%), Conducción responsable (48%)</li>
                        <li><strong>Ocasiones de consumo:</strong> Celebraciones familiares (69%), Eventos corporativos (34%)</li>
                        <li><strong>Factores de decisión:</strong> Sabor (81%), Calidad (76%), Precio (54%)</li>
                        <li><strong>Lealtad de marca:</strong> 63% repite compra del mismo producto</li>
                        <li><strong>Recomendación:</strong> 78% recomienda a familiares y amigos</li>
                    </ul>
                    
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-number">89%</span>
                            <span class="stat-label">Valora ingredientes naturales</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">76%</span>
                            <span class="stat-label">Busca opciones premium</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">52%</span>
                            <span class="stat-label">Compra online regularmente</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">$120K</span>
                            <span class="stat-label">Gasto promedio mensual COP</span>
                        </div>
                    </div>
                `
                        },
                        {
                            title: 'Innovación y Oportunidades',
                            content: `
                    <p><strong>AJEDREZ lidera la innovación</strong> en el segmento de vinos espumosos sin alcohol con tecnología avanzada y sabores únicos desarrollados específicamente para el paladar colombiano.</p>
                    
                    <h4>🚀 Tendencias que Definen el 2025:</h4>
                    <ul class="feature-list">
                        <li><strong>Sabores Locales:</strong> Incorporación de frutas tropicales colombianas</li>
                        <li><strong>Empaques Sostenibles:</strong> 94% prefiere envases eco-amigables</li>
                        <li><strong>Experiencias Personalizadas:</strong> Eventos y degustaciones exclusivas</li>
                        <li><strong>Tecnología:</strong> Apps para rastreo de productos y recompensas</li>
                        <li><strong>Distribución:</strong> Expansión a municipios de segundo nivel</li>
                        <li><strong>Alianzas:</strong> Partnerships con eventos y restaurantes</li>
                    </ul>
                    
                    <div class="highlight-box">
                        <p><strong>📈 Proyección Optimista:</strong> El segmento de bebidas sin alcohol premium alcanzará el 35% de participación en el mercado total de bebidas para celebraciones en Colombia para finales de 2025.</p>
                    </div>
                    
                    <h4>💼 Oportunidades para Distribuidores:</h4>
                    <ul class="feature-list">
                        <li><strong>Márgenes atractivos:</strong> 40-55% de margen bruto promedio</li>
                        <li><strong>Baja competencia:</strong> Mercado en desarrollo con pocos players</li>
                        <li><strong>Demanda estable:</strong> Consumo durante todo el año</li>
                        <li><strong>Apoyo de marca:</strong> Material publicitario y capacitación incluida</li>
                        <li><strong>Territorialidad:</strong> Exclusividad por zonas geográficas</li>
                        <li><strong>Crecimiento:</strong> Incremento del 15-25% anual proyectado</li>
                    </ul>
                `
                        },
                        {
                            title: 'Análisis Regional',
                            content: `
                    <h4>🗺️ Penetración por Regiones (2024):</h4>
                    
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-number">68%</span>
                            <span class="stat-label">Bogotá y Cundinamarca</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">45%</span>
                            <span class="stat-label">Medellín y Antioquia</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">38%</span>
                            <span class="stat-label">Cali y Valle del Cauca</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">29%</span>
                            <span class="stat-label">Barranquilla y Costa</span>
                        </div>
                    </div>
                    
                    <ul class="feature-list">
                        <li><strong>Zona Andina:</strong> Mayor consumo en eventos familiares y corporativos</li>
                        <li><strong>Costa Caribe:</strong> Preferencia por sabores frutales y refrescantes</li>
                        <li><strong>Pacífico:</strong> Mercado emergente con alto potencial</li>
                        <li><strong>Orinoquia y Amazonia:</strong> Oportunidades inexploradas</li>
                    </ul>
                `
                        }
                    ],
                    whatsappMessage: "Hola, me interesa conocer más sobre las oportunidades de distribución de AJEDREZ y las tendencias del mercado colombiano de bebidas sin alcohol."
                }
            }
        };

        this.init();
    }

    init() {
        this.createModalStructure();
        this.bindEvents();
        console.log('📰 Sistema de Noticias AJEDREZ inicializado');
        console.log('💬 WhatsApp configurado:', this.config.whatsappNumber);
    }

    createModalStructure() {
        // Crear el overlay del modal si no existe
        if (!document.getElementById('newsModalOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'newsModalOverlay';
            overlay.className = 'news-modal-overlay';
            overlay.innerHTML = `
                <div class="news-modal" id="newsModal">
                    <div class="modal-header">
                        <img class="modal-header-image" src="" alt="">
                        <button class="modal-close" id="closeModal">&times;</button>
                    </div>
                    <div class="modal-content">
                        <h2 class="modal-title"></h2>
                        <div class="modal-date"></div>
                        <div class="modal-text"></div>
                        <div class="cta-section">
                            <h3>¿Te interesa esta información?</h3>
                            <p>Contáctanos por WhatsApp para conocer más detalles</p>
                            <a href="" class="cta-button" target="_blank">
                                <span>📱</span>
                                <span>Contactar por WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    }

    bindEvents() {
        // Event listeners para las tarjetas de noticias
        document.addEventListener('click', (e) => {
            const newsCard = e.target.closest('.news-card');
            if (newsCard) {
                const newsType = this.getNewsType(newsCard);
                if (newsType && this.newsData[newsType]) {
                    this.openModal(newsType);
                }
            }

            // Cerrar modal
            if (e.target.id === 'closeModal' || e.target.id === 'newsModalOverlay') {
                this.closeModal();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Prevenir scroll del body cuando el modal está abierto
        document.getElementById('newsModalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });
    }

    getNewsType(newsCard) {
        // Determinar el tipo de noticia basado en el contenido de la tarjeta
        const titleElement = newsCard.querySelector('h3');
        const imageElement = newsCard.querySelector('img');

        if (!titleElement) return null;

        const title = titleElement.textContent.toLowerCase();
        const imageSrc = imageElement ? imageElement.src.toLowerCase() : '';

        // Detectar por título
        if (title.includes('expansión') || title.includes('nacional') || title.includes('2025')) {
            return 'expansion-nacional';
        } else if (title.includes('distribuidores') || title.includes('autorizados') || title.includes('nuevos')) {
            return 'nuevos-distribuidores';
        } else if (title.includes('tendencias') || title.includes('sin alcohol') || imageSrc.includes('bebidas')) {
            return 'tendencias-sin-alcohol';
        }

        // Detectar por imagen si el título no es claro
        if (imageSrc.includes('expansion') || imageSrc.includes('nacional')) {
            return 'expansion-nacional';
        } else if (imageSrc.includes('distribuidores')) {
            return 'nuevos-distribuidores';
        } else if (imageSrc.includes('bebidas') || imageSrc.includes('tendencias')) {
            return 'tendencias-sin-alcohol';
        }

        return null;
    }

    openModal(newsType) {
        const data = this.newsData[newsType];
        const modal = document.getElementById('newsModal');
        const overlay = document.getElementById('newsModalOverlay');

        // Determinar la imagen a usar - priorizar las del proyecto o usar fallbacks
        let modalImage = data.image;

        // Si es la imagen de tendencias, usar la existente del proyecto
        if (newsType === 'tendencias-sin-alcohol') {
            modalImage = this.config.images.tendenciasBebidas;
        }

        // Para las otras, usar fallbacks temporales hasta que agregues las imágenes
        if (newsType === 'expansion-nacional') {
            // Verificar si existe la imagen específica, sino usar fallback
            modalImage = this.config.images.fallbacks.expansion;
        }

        if (newsType === 'nuevos-distribuidores') {
            // Verificar si existe la imagen específica, sino usar fallback
            modalImage = this.config.images.fallbacks.distribuidores;
        }

        // IMPORTANTE: Limpiar imagen anterior primero
        const headerImage = modal.querySelector('.modal-header-image');
        headerImage.style.opacity = '0';
        headerImage.style.transform = 'scale(0.8)';

        // Actualizar contenido del modal después de un pequeño delay
        setTimeout(() => {
            headerImage.src = modalImage;
            headerImage.alt = data.title;
            modal.querySelector('.modal-title').textContent = data.title;
            modal.querySelector('.modal-date').textContent = data.date;

            // Generar contenido completo
            let contentHTML = `<p class="modal-text">${data.content.intro}</p>`;

            data.content.sections.forEach(section => {
                contentHTML += `
                    <h3>${section.title}</h3>
                    <div class="modal-text">${section.content}</div>
                `;
            });

            modal.querySelector('.modal-text').innerHTML = contentHTML;

            // Actualizar WhatsApp link usando la configuración
            const whatsappUrl = `https://wa.me/${this.config.whatsappNumber}?text=${encodeURIComponent(data.content.whatsappMessage)}`;
            modal.querySelector('.cta-button').href = whatsappUrl;

            // Añadir clase específica para el tipo de modal
            modal.className = `news-modal modal-${data.type}`;

            // Mostrar imagen con animación
            headerImage.style.opacity = '1';
            headerImage.style.transform = 'scale(1)';
        }, 100);

        // Mostrar modal
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Tracking de interacción
        this.trackInteraction('modal_opened', newsType);

        // Efectos de entrada después de que la imagen esté lista
        setTimeout(() => {
            this.animateElements();
        }, 400);
    }

    closeModal() {
        const overlay = document.getElementById('newsModalOverlay');
        const modal = document.getElementById('newsModal');
        const headerImage = modal.querySelector('.modal-header-image');

        overlay.classList.remove('active');
        document.body.style.overflow = '';

        // Limpiar la imagen al cerrar para evitar que se mantenga
        setTimeout(() => {
            headerImage.style.transform = 'scale(1)';
            headerImage.src = ''; // Limpiar la imagen
            headerImage.alt = '';

            // Limpiar el contenido también
            modal.querySelector('.modal-title').textContent = '';
            modal.querySelector('.modal-date').textContent = '';
            modal.querySelector('.modal-text').innerHTML = '';

            // Resetear clase del modal
            modal.className = 'news-modal';
        }, 100);
    }

    // Método para añadir animaciones de entrada a los elementos
    animateElements() {
        const elements = document.querySelectorAll('.modal-content .stat-item, .modal-content .feature-list li, .modal-content .highlight-box');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';

            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    }

    // Método para tracking de interacciones
    trackInteraction(action, newsType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'News Modal',
                'event_label': newsType,
                'value': 1
            });
        }

        console.log(`📊 Tracking: ${action} - ${newsType}`);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.ajedrezNewsModal = new AjedrezNewsModal();
});

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AjedrezNewsModal;
}




/* ===================================================================
   🚀 CÓDIGO LIMPIO DE PRODUCCIÓN - SIN DEBUG
   🎯 Solo funcionalidad, sin console.log ni debug
   =================================================================== */

// REEMPLAZAR TODO EL CÓDIGO ANTERIOR CON ESTE:

// Detectar apertura de catálogos específicos - VERSIÓN LIMPIA
document.addEventListener('click', function(e) {
    const button = e.target;
    
    if (button.classList.contains('catalog-btn') || button.closest('.catalog-btn')) {
        const card = button.closest('.product-card');
        
        if (card) {
            const isRosado = card.classList.contains('rosado') || 
                           card.textContent.toLowerCase().includes('rosado');
            
            const isCereza = card.classList.contains('cereza') || 
                           card.textContent.toLowerCase().includes('cereza');
            
            if (isRosado || isCereza) {
                setTimeout(() => {
                    applySpecificClass(isRosado ? 'rosado' : 'cereza');
                }, 200);
            }
        }
    }
});

function applySpecificClass(productType) {
    const modal = document.querySelector('.catalog-modal.active, .catalog-modal.catalog-open, .catalog-modal[style*="block"]');
    
    if (modal) {
        modal.classList.remove('rosado-active', 'cereza-active', 'blanco-active', 'manzana-active', 'uva-active');
        modal.classList.add(`${productType}-active`);
        modal.setAttribute('data-product', productType);
    }
}

// Observer simplificado - SIN DEBUG
const modalObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const modal = mutation.target;
            
            if (modal.classList.contains('catalog-modal') && 
                (modal.classList.contains('active') || modal.classList.contains('catalog-open'))) {
                
                setTimeout(() => {
                    detectProductFromModal(modal);
                }, 100);
            }
        }
        
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList?.contains('catalog-modal')) {
                    setTimeout(() => {
                        detectProductFromModal(node);
                    }, 200);
                }
            });
        }
    });
});

function detectProductFromModal(modal) {
    const title = modal.querySelector('.product-title, h2, h3');
    if (!title) return;
    
    const titleText = title.textContent.toLowerCase();
    
    if (titleText.includes('rosado')) {
        applySpecificClass('rosado');
    } else if (titleText.includes('cereza')) {
        applySpecificClass('cereza');
    } else if (titleText.includes('blanco')) {
        applySpecificClass('blanco');
    } else if (titleText.includes('manzana')) {
        applySpecificClass('manzana');
    } else if (titleText.includes('uva')) {
        applySpecificClass('uva');
    }
}

// Inicialización simple
document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.catalog-modal, .product-modal');
    modals.forEach(modal => {
        modalObserver.observe(modal, { 
            attributes: true, 
            attributeFilter: ['class', 'style'] 
        });
    });
    
    modalObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
});

// ELIMINAR estas funciones de debug:
// window.testSpecificClass = function() { ... }
// window.checkActiveClass = function() { ... }
// window.diagnosticImages = function() { ... }
// window.debugCatalogImages = function() { ... }
// window.fixRosadoCereza = function() { ... }

// SCROLL FIX SIMPLE - SIN DEBUG
function resetCatalogScroll() {
    const catalogContent = document.querySelector('.catalog-content');
    if (catalogContent) {
        catalogContent.scrollTop = 0;
    }
}

// Aplicar scroll reset cuando se abre catálogo
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('catalog-btn') || e.target.closest('.catalog-btn')) {
        setTimeout(() => {
            resetCatalogScroll();
        }, 300);
    }
});

// Observer para reset de scroll - SIMPLIFICADO
const scrollObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const modal = mutation.target;
            if (modal.classList.contains('catalog-modal') && 
                (modal.classList.contains('active') || modal.classList.contains('catalog-open'))) {
                setTimeout(resetCatalogScroll, 100);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.catalog-modal');
    modals.forEach(modal => {
        scrollObserver.observe(modal, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    });
});



/* ===================================================================
   🔧 JAVASCRIPT CORREGIDO - SIN CONFLICTOS DE VARIABLES
   🎯 Eliminar scroll de products section sin errores
   =================================================================== */

// Variables para gestionar el scroll (renombradas para evitar conflictos)
let bodyScrollPosition = 0;

// Función para bloquear scroll del body
function blockBodyScroll() {
    bodyScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    document.body.classList.add('catalog-open', 'no-scroll');
    document.documentElement.classList.add('catalog-open');
    document.body.style.top = `-${bodyScrollPosition}px`;
}

// Función para restaurar scroll del body
function restoreBodyScroll() {
    document.body.classList.remove('catalog-open', 'no-scroll');
    document.documentElement.classList.remove('catalog-open');
    document.body.style.top = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    window.scrollTo(0, bodyScrollPosition);
}

// Función para eliminar scroll interno de products section
function removeProductsScroll() {
    const productsSection = document.querySelector('.products-section, .productos-section, #productos');
    
    if (productsSection) {
        productsSection.style.overflow = 'visible';
        productsSection.style.overflowX = 'visible';
        productsSection.style.overflowY = 'visible';
        productsSection.style.height = 'auto';
        productsSection.style.maxHeight = 'none';
        
        const children = productsSection.querySelectorAll('*');
        children.forEach(child => {
            child.style.overflowX = 'visible';
            
            if (child.style.height && child.style.height !== 'auto') {
                child.style.height = 'auto';
            }
            
            if (child.style.maxHeight && 
                !child.matches('textarea, .product-description, .modal-content, .catalog-content')) {
                child.style.maxHeight = 'none';
            }
        });
    }
    
    const productsGrid = document.querySelector('.productos-grid, .products-grid');
    if (productsGrid) {
        productsGrid.style.overflow = 'visible';
        productsGrid.style.height = 'auto';
        productsGrid.style.maxHeight = 'none';
    }
    
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.overflow = 'visible';
        card.style.height = 'auto';
        card.style.maxHeight = 'none';
    });
}

// Función para forzar scroll solo en body
function enforceBodyScroll() {
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'hidden';
    document.body.style.height = 'auto';
    document.body.style.minHeight = '100vh';
    
    document.documentElement.style.overflowY = 'auto';
    document.documentElement.style.overflowX = 'hidden';
    
    const elementsToFix = document.querySelectorAll('main, .main-content, .page-wrapper, section:not(.catalog-modal)');
    elementsToFix.forEach(element => {
        if (!element.classList.contains('catalog-content') && 
            !element.classList.contains('modal-content')) {
            element.style.overflow = 'visible';
            element.style.height = 'auto';
        }
    });
}

// Detectar apertura de catálogo
document.addEventListener('click', function(e) {
    const button = e.target;
    
    if (button.classList.contains('catalog-btn') || button.closest('.catalog-btn')) {
        const card = button.closest('.product-card');
        
        if (card) {
            blockBodyScroll();
            
            const isRosado = card.classList.contains('rosado') || 
                           card.textContent.toLowerCase().includes('rosado');
            const isCereza = card.classList.contains('cereza') || 
                           card.textContent.toLowerCase().includes('cereza');
            
            setTimeout(() => {
                if (isRosado || isCereza) {
                    applySpecificClass(isRosado ? 'rosado' : 'cereza');
                }
                resetCatalogScroll();
            }, 200);
        }
    }
});

// Detectar cierre de catálogo
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('catalog-close') || 
        e.target.closest('.catalog-close') ||
        e.target.classList.contains('catalog-overlay') || 
        e.target.classList.contains('catalog-modal')) {
        restoreBodyScroll();
    }
});

// Detectar tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.catalog-modal.active, .catalog-modal.catalog-open');
        if (openModal) {
            restoreBodyScroll();
        }
    }
});

// Observer para modales (RENOMBRADO)
const catalogModalObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const modal = mutation.target;
            
            if (modal.classList.contains('catalog-modal')) {
                if (modal.classList.contains('active') || modal.classList.contains('catalog-open')) {
                    blockBodyScroll();
                    setTimeout(() => {
                        detectProductFromModal(modal);
                        resetCatalogScroll();
                    }, 100);
                } else {
                    restoreBodyScroll();
                }
            }
        }
        
        if (mutation.type === 'childList') {
            mutation.removedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList?.contains('catalog-modal')) {
                    restoreBodyScroll();
                }
            });
        }
    });
});

// Observer para products section (RENOMBRADO)
const productsScrollObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.closest('.products-section, .productos-section')) {
                        setTimeout(() => {
                            removeProductsScroll();
                        }, 100);
                    }
                }
            });
        }
    });
});

// Funciones auxiliares
function applySpecificClass(productType) {
    const modal = document.querySelector('.catalog-modal.active, .catalog-modal.catalog-open, .catalog-modal[style*="block"]');
    
    if (modal) {
        modal.classList.remove('rosado-active', 'cereza-active', 'blanco-active', 'manzana-active', 'uva-active');
        modal.classList.add(`${productType}-active`);
        modal.setAttribute('data-product', productType);
    }
}

function detectProductFromModal(modal) {
    const title = modal.querySelector('.product-title, h2, h3');
    if (!title) return;
    
    const titleText = title.textContent.toLowerCase();
    
    if (titleText.includes('rosado')) {
        applySpecificClass('rosado');
    } else if (titleText.includes('cereza')) {
        applySpecificClass('cereza');
    }
}

function resetCatalogScroll() {
    const catalogContent = document.querySelector('.catalog-content');
    if (catalogContent) {
        catalogContent.scrollTop = 0;
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Aplicar fixes de scroll
    removeProductsScroll();
    enforceBodyScroll();
    
    // Inicializar observers
    const modals = document.querySelectorAll('.catalog-modal, .product-modal');
    modals.forEach(modal => {
        catalogModalObserver.observe(modal, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    });
    
    catalogModalObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Observer para products section
    const productsSection = document.querySelector('.products-section, .productos-section, #productos');
    if (productsSection) {
        productsScrollObserver.observe(productsSection, {
            childList: true,
            subtree: true
        });
    }
    
    // Verificar después de cargar imágenes
    setTimeout(() => {
        removeProductsScroll();
        enforceBodyScroll();
    }, 1000);
});

// Event listeners adicionales
window.addEventListener('resize', () => {
    setTimeout(() => {
        removeProductsScroll();
        enforceBodyScroll();
    }, 100);
});

window.addEventListener('beforeunload', () => {
    restoreBodyScroll();
});

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        const openModal = document.querySelector('.catalog-modal.active, .catalog-modal.catalog-open');
        if (openModal) {
            blockBodyScroll();
        }
    }, 500);
});

// Función manual para debugging
window.fixProductsScroll = function() {
    removeProductsScroll();
    enforceBodyScroll();
};
