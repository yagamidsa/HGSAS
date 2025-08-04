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
    
    /* ===== SMOOTH SCROLL ENHANCEMENTS ===== */
    initializeSmoothScrollEnhancements() {
        // Mejorar todos los links de navegación interna
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
        
        console.log('🔄 Smooth scroll mejorado');
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
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
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