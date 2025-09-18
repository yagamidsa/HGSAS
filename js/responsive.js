/* ===================================================================
   RESPONSIVE CONTROLLER - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Sistema de comportamientos responsive y adaptación de dispositivos
   =================================================================== */

class ResponsiveController {
    constructor() {
        this.currentBreakpoint = null;
        this.previousBreakpoint = null;
        this.isMobile = false;
        this.isTablet = false;
        this.isDesktop = false;
        this.orientation = null;
        this.resizeTimeout = null;
        
        // Breakpoints definidos
        this.breakpoints = {
            mobile: 767,
            tablet: 1023,
            desktop: 1024
        };
        
        this.init();
    }
    
    init() {
        this.detectInitialBreakpoint();
        this.setupEventListeners();
        this.setupOrientationHandling();
        this.setupViewportMetaTag();
        this.handleResponsiveImages();
        this.setupTouchHandling();
        
        console.log('📱 Responsive Controller inicializado');
        console.log(`📏 Breakpoint inicial: ${this.currentBreakpoint}`);
    }
    
    detectInitialBreakpoint() {
        const width = window.innerWidth;
        this.previousBreakpoint = this.currentBreakpoint;
        
        if (width <= this.breakpoints.mobile) {
            this.currentBreakpoint = 'mobile';
            this.isMobile = true;
            this.isTablet = false;
            this.isDesktop = false;
        } else if (width <= this.breakpoints.tablet) {
            this.currentBreakpoint = 'tablet';
            this.isMobile = false;
            this.isTablet = true;
            this.isDesktop = false;
        } else {
            this.currentBreakpoint = 'desktop';
            this.isMobile = false;
            this.isTablet = false;
            this.isDesktop = true;
        }
        
        // Agregar clases al body
        this.updateBodyClasses();
        
        // Detectar orientación
        this.detectOrientation();
    }
    
    setupEventListeners() {
        // Resize window con debounce
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 100);
        });
        
        // Orientación
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Media queries con JavaScript
        this.setupMediaQueries();
    }
    
    setupMediaQueries() {
        // Mobile breakpoint
        const mobileQuery = window.matchMedia(`(max-width: ${this.breakpoints.mobile}px)`);
        mobileQuery.addEventListener('change', (e) => {
            if (e.matches) {
                this.changeBreakpoint('mobile');
            }
        });
        
        // Tablet breakpoint
        const tabletQuery = window.matchMedia(`(min-width: ${this.breakpoints.mobile + 1}px) and (max-width: ${this.breakpoints.tablet}px)`);
        tabletQuery.addEventListener('change', (e) => {
            if (e.matches) {
                this.changeBreakpoint('tablet');
            }
        });
        
        // Desktop breakpoint
        const desktopQuery = window.matchMedia(`(min-width: ${this.breakpoints.desktop}px)`);
        desktopQuery.addEventListener('change', (e) => {
            if (e.matches) {
                this.changeBreakpoint('desktop');
            }
        });
        
        // Reduced motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addEventListener('change', (e) => {
            this.handleReducedMotion(e.matches);
        });
        
        // Dark mode preference
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeQuery.addEventListener('change', (e) => {
            this.handleDarkModePreference(e.matches);
        });
    }
    
    handleResize() {
        const oldBreakpoint = this.currentBreakpoint;
        this.detectInitialBreakpoint();
        
        if (oldBreakpoint !== this.currentBreakpoint) {
            this.onBreakpointChange(oldBreakpoint, this.currentBreakpoint);
        }
        
        // Actualizar alturas de viewport para móviles
        this.updateViewportHeight();
        
        // Reajustar elementos que dependan del tamaño
        this.adjustResponsiveElements();
        
        console.log(`📏 Resize: ${window.innerWidth}x${window.innerHeight} - Breakpoint: ${this.currentBreakpoint}`);
    }
    
    changeBreakpoint(newBreakpoint) {
        if (this.currentBreakpoint !== newBreakpoint) {
            const oldBreakpoint = this.currentBreakpoint;
            this.currentBreakpoint = newBreakpoint;
            
            // Actualizar flags de dispositivo
            this.isMobile = newBreakpoint === 'mobile';
            this.isTablet = newBreakpoint === 'tablet';
            this.isDesktop = newBreakpoint === 'desktop';
            
            this.updateBodyClasses();
            this.onBreakpointChange(oldBreakpoint, newBreakpoint);
        }
    }
    
    onBreakpointChange(oldBreakpoint, newBreakpoint) {
        console.log(`📱 Breakpoint cambió: ${oldBreakpoint} → ${newBreakpoint}`);
        
        // Notificar a otros componentes del cambio
        this.notifyBreakpointChange(oldBreakpoint, newBreakpoint);
        
        // Ajustar menús según el dispositivo
        this.adjustMenusForBreakpoint(newBreakpoint);
        
        // Ajustar imágenes
        this.handleResponsiveImages();
        
        // Ajustar formularios
        this.adjustFormsForBreakpoint(newBreakpoint);
        
        // Custom event para otros scripts
        window.dispatchEvent(new CustomEvent('breakpointChange', {
            detail: { oldBreakpoint, newBreakpoint }
        }));
    }
    
    updateBodyClasses() {
        const body = document.body;
        
        // Remover clases existentes
        body.classList.remove('mobile', 'tablet', 'desktop');
        body.classList.remove('portrait', 'landscape');
        
        // Agregar clase actual
        body.classList.add(this.currentBreakpoint);
        
        // Agregar orientación
        if (this.orientation) {
            body.classList.add(this.orientation);
        }
    }
    
    detectOrientation() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.orientation = width > height ? 'landscape' : 'portrait';
    }
    
    setupOrientationHandling() {
        this.detectOrientation();
    }
    
    handleOrientationChange() {
        const oldOrientation = this.orientation;
        this.detectOrientation();
        
        if (oldOrientation !== this.orientation) {
            console.log(`🔄 Orientación cambió: ${oldOrientation} → ${this.orientation}`);
            
            this.updateBodyClasses();
            this.updateViewportHeight();
            
            // Custom event
            window.dispatchEvent(new CustomEvent('orientationChanged', {
                detail: { oldOrientation, newOrientation: this.orientation }
            }));
        }
    }
    
    setupViewportMetaTag() {
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }
        
        // Configuración optimizada para móviles
        viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no';
    }
    
    updateViewportHeight() {
        // Fix para altura de viewport en móviles (100vh issue)
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    handleResponsiveImages() {
        const responsiveImages = document.querySelectorAll('img[data-src-mobile], img[data-src-tablet], img[data-src-desktop]');
        
        responsiveImages.forEach(img => {
            let srcToUse = img.src;
            
            if (this.isMobile && img.dataset.srcMobile) {
                srcToUse = img.dataset.srcMobile;
            } else if (this.isTablet && img.dataset.srcTablet) {
                srcToUse = img.dataset.srcTablet;
            } else if (this.isDesktop && img.dataset.srcDesktop) {
                srcToUse = img.dataset.srcDesktop;
            }
            
            if (srcToUse !== img.src) {
                img.src = srcToUse;
            }
        });
    }
    
    setupTouchHandling() {
        // Detectar si es dispositivo táctil
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouch) {
            document.body.classList.add('touch-device');
            this.setupTouchGestures();
        } else {
            document.body.classList.add('no-touch');
        }
    }
    
    setupTouchGestures() {
        let startX, startY, startTime;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            // Detectar swipe
            if (Math.abs(deltaX) > 50 && deltaTime < 300) {
                const direction = deltaX > 0 ? 'right' : 'left';
                this.handleSwipeGesture(direction, deltaX);
            }
            
            // Reset
            startX = startY = null;
        }, { passive: true });
    }
    
    adjustMenusForBreakpoint(breakpoint) {
        // Notificar al menu controller sobre el cambio
        if (window.menuController) {
            window.menuController.forceUpdate();
        }
    }
    
    adjustFormsForBreakpoint(breakpoint) {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            if (this.isMobile) {
                // Optimizaciones para móvil
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    if (input.type === 'email') {
                        input.setAttribute('autocomplete', 'email');
                    }
                    if (input.type === 'tel') {
                        input.setAttribute('autocomplete', 'tel');
                    }
                });
            }
        });
    }
    
    adjustResponsiveElements() {
        // Ajustar elementos específicos que necesiten recálculo
        const catalogModal = document.querySelector('.catalog-modal');
        if (catalogModal && catalogModal.classList.contains('catalog-open')) {
            this.adjustModalForDevice(catalogModal);
        }
        
        // Ajustar elementos con altura viewport
        const fullHeightElements = document.querySelectorAll('.vh-100, .full-height');
        fullHeightElements.forEach(element => {
            element.style.height = `${window.innerHeight}px`;
        });
    }
    
    adjustModalForDevice(modal) {
        const container = modal.querySelector('.catalog-container');
        if (!container) return;
        
        if (this.isMobile) {
            container.style.width = '95vw';
            container.style.height = '95vh';
            container.style.maxHeight = '95vh';
        } else {
            container.style.width = '';
            container.style.height = '';
            container.style.maxHeight = '';
        }
    }
    
    handleSwipeGesture(direction, distance) {
        // Dispatch custom swipe event
        window.dispatchEvent(new CustomEvent('swipeGesture', {
            detail: { direction, distance }
        }));
        
        console.log(`👆 Swipe detectado: ${direction} (${distance}px)`);
    }
    
    handleReducedMotion(isReduced) {
        if (isReduced) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
        
        console.log(`🎬 Reduced motion: ${isReduced ? 'ON' : 'OFF'}`);
    }
    
    handleDarkModePreference(isDark) {
        // Manejar preferencia de modo oscuro del sistema
        if (isDark) {
            document.body.classList.add('prefers-dark');
        } else {
            document.body.classList.remove('prefers-dark');
        }
        
        console.log(`🌙 Dark mode preference: ${isDark ? 'ON' : 'OFF'}`);
    }
    
    notifyBreakpointChange(oldBreakpoint, newBreakpoint) {
        // Notificar a sistemas específicos
        if (window.morphingAnimations) {
            window.morphingAnimations.pauseAnimations();
            setTimeout(() => {
                window.morphingAnimations.resumeAnimations();
            }, 100);
        }
    }
    
    // ===== MÉTODOS PÚBLICOS =====
    
    getCurrentBreakpoint() {
        return this.currentBreakpoint;
    }
    
    getCurrentDevice() {
        return {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isDesktop: this.isDesktop,
            orientation: this.orientation
        };
    }
    
    getViewportSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
    
    isTouchDevice() {
        return document.body.classList.contains('touch-device');
    }
    
    isLandscape() {
        return this.orientation === 'landscape';
    }
    
    isPortrait() {
        return this.orientation === 'portrait';
    }
    
    // Métodos de utilidad
    executeOnBreakpoint(breakpoint, callback) {
        if (this.currentBreakpoint === breakpoint) {
            callback();
        }
    }
    
    executeOnMobile(callback) {
        this.executeOnBreakpoint('mobile', callback);
    }
    
    executeOnTablet(callback) {
        this.executeOnBreakpoint('tablet', callback);
    }
    
    executeOnDesktop(callback) {
        this.executeOnBreakpoint('desktop', callback);
    }
    
    getDeviceInfo() {
        return {
            breakpoint: this.currentBreakpoint,
            device: this.getCurrentDevice(),
            viewport: this.getViewportSize(),
            orientation: this.orientation,
            isTouch: this.isTouchDevice(),
            userAgent: navigator.userAgent
        };
    }
}

// ===== ESTILOS CSS RESPONSIVOS DINÁMICOS =====
const responsiveStyles = document.createElement('style');
responsiveStyles.textContent = `
    /* Variables CSS para viewport height fix */
    :root {
        --vh: 1vh;
    }
    
    /* Utilidades responsive */
    .mobile-only {
        display: none;
    }
    
    .tablet-only {
        display: none;
    }
    
    .desktop-only {
        display: none;
    }
    
    /* Mostrar elementos según breakpoint */
    body.mobile .mobile-only {
        display: block;
    }
    
    body.tablet .tablet-only {
        display: block;
    }
    
    body.desktop .desktop-only {
        display: block;
    }
    
    /* Ocultar elementos en móvil */
    body.mobile .hide-mobile {
        display: none !important;
    }
    
    body.tablet .hide-tablet {
        display: none !important;
    }
    
    body.desktop .hide-desktop {
        display: none !important;
    }
    
    /* Touch device optimizations */
    body.touch-device {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
    }
    
    body.touch-device button,
    body.touch-device a {
        min-height: 44px;
        min-width: 44px;
    }
    
    /* Viewport height fix for mobile */
    .vh-100 {
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100);
    }
    
    .min-vh-100 {
        min-height: 100vh;
        min-height: calc(var(--vh, 1vh) * 100);
    }
    
    /* Responsive text sizes */
    body.mobile {
        font-size: 14px;
    }
    
    body.tablet {
        font-size: 15px;
    }
    
    body.desktop {
        font-size: 16px;
    }
    
    /* Responsive padding/margins */
    body.mobile .container,
    body.mobile .section-content {
        padding-left: 15px;
        padding-right: 15px;
    }
    
    body.tablet .container,
    body.tablet .section-content {
        padding-left: 30px;
        padding-right: 30px;
    }
    
    body.desktop .container,
    body.desktop .section-content {
        padding-left: 40px;
        padding-right: 40px;
    }
    
    /* Orientation specific styles */
    body.landscape.mobile {
        /* Landscape mobile specific styles */
    }
    
    body.portrait.mobile {
        /* Portrait mobile specific styles */
    }
    
    /* High DPI display optimizations */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        /* Retina display optimizations */
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    }
    
    /* Safe area insets for iPhone X+ */
    @supports (padding: max(0px)) {
        body {
            padding-left: max(0px, env(safe-area-inset-left));
            padding-right: max(0px, env(safe-area-inset-right));
        }
        
        .header {
            padding-top: max(0px, env(safe-area-inset-top));
        }
        
        .footer {
            padding-bottom: max(0px, env(safe-area-inset-bottom));
        }
    }
    
    /* Prevent zoom on input focus (iOS) */
    @media screen and (max-width: 767px) {
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="password"],
        textarea,
        select {
            font-size: 16px !important;
        }
    }
`;
document.head.appendChild(responsiveStyles);

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    window.responsiveController = new ResponsiveController();
    
    // Funciones globales para testing y uso
    window.getBreakpoint = () => window.responsiveController.getCurrentBreakpoint();
    window.getDeviceInfo = () => window.responsiveController.getDeviceInfo();
    window.isMobile = () => window.responsiveController.isMobile;
    window.isTablet = () => window.responsiveController.isTablet;
    window.isDesktop = () => window.responsiveController.isDesktop;
    
    // Listeners para otros componentes
    window.addEventListener('breakpointChange', (e) => {
        console.log('📱 Breakpoint change event:', e.detail);
    });
    
    window.addEventListener('orientationChanged', (e) => {
        console.log('🔄 Orientation change event:', e.detail);
    });
    
    window.addEventListener('swipeGesture', (e) => {
        console.log('👆 Swipe gesture event:', e.detail);
    });
});

// Exportar para otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveController;
}

/* ===== COMANDOS DE TESTING =====

// Ver breakpoint actual
getBreakpoint()

// Ver información completa del dispositivo
getDeviceInfo()

// Verificar tipo de dispositivo
isMobile()
isTablet()
isDesktop()

// Ver controlador
responsiveController

===============================================*/




/* ===================================================================
   🔥 FIX SIMPLE DEL SCROLL - SOLO ELIMINA DUPLICADOS
   Agrega esto AL FINAL del HTML, después de todos los JS
   =================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Esperar que todos los scripts se carguen
    setTimeout(() => {
        console.log('🔥 Eliminando event listeners duplicados...');
        
        // ENCONTRAR TODOS LOS ENLACES PROBLEMÁTICOS
        const enlacesProblematicos = document.querySelectorAll('a[href^="#"]:not(.whatsapp-btn)');
        
        console.log('🔍 Encontrados', enlacesProblematicos.length, 'enlaces para limpiar');
        
        // REEMPLAZAR CADA ENLACE (esto elimina TODOS los event listeners)
        enlacesProblematicos.forEach((enlaceViejo, index) => {
            const href = enlaceViejo.getAttribute('href');
            
            // Saltar enlaces vacíos
            if (!href || href === '#' || href === '#top') return;
            
            // CREAR ENLACE NUEVO (sin event listeners)
            const enlaceNuevo = enlaceViejo.cloneNode(true);
            
            // AGREGAR NUESTRO ÚNICO EVENT LISTENER
            enlaceNuevo.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🎯 Click limpio en:', href);
                
                // MAPEO DE SECCIONES
                const mapeo = {
                    '#inicio': 'home',
                    '#home': 'home',
                    '#productos': 'productos', 
                    '#quienes-somos': 'quienes-somos',
                    '#contacto': 'contacto'
                };
                
                const seccionId = mapeo[href] || href.substring(1);
                const seccion = document.getElementById(seccionId);
                
                if (seccion) {
                    // CERRAR MENÚ MOBILE SI ESTÁ ABIERTO
                    const menuMobile = document.getElementById('mobileNavigation');
                    const toggle = document.getElementById('mobileMenuToggle');
                    const overlay = document.querySelector('.mobile-overlay');
                    
                    if (menuMobile && menuMobile.classList.contains('active')) {
                        toggle?.classList.remove('active');
                        menuMobile.classList.remove('active');
                        overlay?.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                        
                        // Esperar que se cierre el menú
                        setTimeout(() => {
                            scrollLimpio(seccion);
                        }, 300);
                    } else {
                        scrollLimpio(seccion);
                    }
                    
                    // ACTUALIZAR URL
                    history.pushState(null, null, href);
                    
                    // ACTUALIZAR ENLACES ACTIVOS
                    actualizarActivos(href);
                }
            });
            
            // REEMPLAZAR EN EL DOM
            enlaceViejo.parentNode.replaceChild(enlaceNuevo, enlaceViejo);
            
            console.log(`✅ Enlace ${index + 1} limpiado:`, href);
        });
        
        console.log('🎉 Todos los enlaces limpiados - scroll debería funcionar normal');
        
    }, 500); // Esperar medio segundo para que se carguen todos los scripts
});

// FUNCIÓN DE SCROLL SIMPLE
function scrollLimpio(elemento) {
    const header = document.querySelector('.header');
    const alturaHeader = header ? header.offsetHeight : 80;
    
    elemento.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Ajustar por el header después del scroll
    setTimeout(() => {
        const ajuste = elemento.getBoundingClientRect().top + window.pageYOffset - alturaHeader - 20;
        window.scrollTo({
            top: ajuste,
            behavior: 'smooth'
        });
    }, 100);
}

// FUNCIÓN PARA ACTUALIZAR ENLACES ACTIVOS
function actualizarActivos(hrefActivo) {
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelectorAll(`a[href="${hrefActivo}"]`).forEach(link => {
        link.classList.add('active');
    });
}

console.log('🔥 Script de limpieza de scroll cargado');