/* ===================================================================
   ACCESSIBILITY - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Navegación por teclado, ARIA, y mejoras de accesibilidad WCAG 2.1 AA
   =================================================================== */

class AccessibilityController {
    constructor() {
        this.focusableElements = [];
        this.currentFocusIndex = -1;
        this.skipLinksEnabled = true;
        this.keyboardNavigationEnabled = true;
        this.screenReaderSupport = false;
        this.highContrastMode = false;
        this.reducedMotion = false;
        
        // Configuración de navegación
        this.config = {
            skipToContentKey: 'Tab',
            navigationKeys: {
                'ArrowUp': 'previous',
                'ArrowDown': 'next',
                'ArrowLeft': 'previous',
                'ArrowRight': 'next',
                'Home': 'first',
                'End': 'last',
                'Enter': 'activate',
                ' ': 'activate',
                'Escape': 'close'
            },
            focusableSelectors: [
                'a[href]',
                'button:not([disabled])',
                'input:not([disabled])',
                'select:not([disabled])',
                'textarea:not([disabled])',
                '[tabindex]:not([tabindex="-1"])',
                '[contenteditable="true"]'
            ].join(', ')
        };
        
        this.init();
    }
    
    init() {
        this.detectAccessibilityPreferences();
        this.setupKeyboardNavigation();
        this.setupAriaSupport();
        this.setupSkipLinks();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
        this.setupHighContrastMode();
        this.setupReducedMotion();
        
        console.log('♿ Accessibility Controller inicializado');
    }
    
    detectAccessibilityPreferences() {
        // Detectar preferencias del sistema
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.highContrastMode = window.matchMedia('(prefers-contrast: high)').matches;
        
        // Detectar lectores de pantalla
        this.screenReaderSupport = this.detectScreenReader();
        
        // Escuchar cambios en las preferencias
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            this.applyReducedMotion();
        });
        
        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            this.highContrastMode = e.matches;
            this.applyHighContrast();
        });
        
        console.log('🔍 Preferencias de accesibilidad detectadas:', {
            reducedMotion: this.reducedMotion,
            highContrast: this.highContrastMode,
            screenReader: this.screenReaderSupport
        });
    }
    
    detectScreenReader() {
        // Detectar lectores de pantalla comunes
        const userAgent = navigator.userAgent.toLowerCase();
        const screenReaders = ['jaws', 'nvda', 'voiceover', 'narrator', 'dragon'];
        
        return screenReaders.some(sr => userAgent.includes(sr)) || 
               navigator.userAgent.includes('aural') ||
               window.speechSynthesis !== undefined;
    }
    
    setupKeyboardNavigation() {
        // Navegación global por teclado
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeydown(e);
        });
        
        // Navegación específica de menús
        this.setupMenuKeyboardNavigation();
        
        // Navegación de catálogos
        this.setupCatalogKeyboardNavigation();
        
        // Navegación de formularios
        this.setupFormKeyboardNavigation();
        
        console.log('⌨️ Navegación por teclado configurada');
    }
    
    handleGlobalKeydown(e) {
        // Alt + número para navegación rápida
        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    this.navigateToSection('home');
                    break;
                case '2':
                    e.preventDefault();
                    this.navigateToSection('productos');
                    break;
                case '3':
                    e.preventDefault();
                    this.navigateToSection('quienes-somos');
                    break;
                case '4':
                    e.preventDefault();
                    this.navigateToSection('contacto');
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    this.toggleMenu();
                    break;
                case 's':
                case 'S':
                    e.preventDefault();
                    this.focusSearchElement();
                    break;
            }
        }
        
        // Escape para cerrar elementos
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
        
        // Tab trapping en modales
        if (e.key === 'Tab') {
            this.handleTabNavigation(e);
        }
    }
    
    setupMenuKeyboardNavigation() {
        // Navegación orbital (desktop)
        this.setupOrbitalMenuKeyboard();
        
        // Navegación hexagonal (tablet)
        this.setupHexagonalMenuKeyboard();
        
        // Navegación morphing (mobile)
        this.setupMorphingMenuKeyboard();
    }
    
    setupOrbitalMenuKeyboard() {
        const orbitalActivator = document.querySelector('.orbital-activator');
        const orbitalItems = document.querySelectorAll('.orbital-item');
        
        if (orbitalActivator) {
            orbitalActivator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    orbitalActivator.click();
                    
                    // Focus en el primer item cuando se abre
                    setTimeout(() => {
                        const firstItem = document.querySelector('.orbital-item');
                        if (firstItem) firstItem.focus();
                    }, 100);
                }
            });
        }
        
        orbitalItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                this.handleMenuItemKeydown(e, orbitalItems, index);
            });
        });
    }
    
    setupHexagonalMenuKeyboard() {
        const hexActivator = document.querySelector('.hex-activator');
        const hexItems = document.querySelectorAll('.hex-item');
        
        if (hexActivator) {
            hexActivator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    hexActivator.click();
                    
                    setTimeout(() => {
                        const firstItem = document.querySelector('.hex-item');
                        if (firstItem) firstItem.focus();
                    }, 100);
                }
            });
        }
        
        hexItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                this.handleMenuItemKeydown(e, hexItems, index);
            });
        });
    }
    
    setupMorphingMenuKeyboard() {
        const morphingTrigger = document.querySelector('.morphing-trigger');
        const morphingItems = document.querySelectorAll('.morphing-item');
        
        if (morphingTrigger) {
            morphingTrigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    morphingTrigger.click();
                    
                    setTimeout(() => {
                        const firstItem = document.querySelector('.morphing-item');
                        if (firstItem) firstItem.focus();
                    }, 100);
                }
            });
        }
        
        morphingItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                this.handleMenuItemKeydown(e, morphingItems, index);
            });
        });
    }
    
    handleMenuItemKeydown(e, items, currentIndex) {
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex].focus();
                break;
                
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                items[prevIndex].focus();
                break;
                
            case 'Home':
                e.preventDefault();
                items[0].focus();
                break;
                
            case 'End':
                e.preventDefault();
                items[items.length - 1].focus();
                break;
                
            case 'Escape':
                e.preventDefault();
                this.closeAllMenus();
                break;
        }
    }
    
    setupCatalogKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const activeCatalog = document.querySelector('.product-catalog.active');
            if (!activeCatalog) return;
            
            if (e.key === 'Escape') {
                e.preventDefault();
                this.closeCatalog(activeCatalog);
            }
            
            // Tab trapping dentro del catálogo
            if (e.key === 'Tab') {
                this.trapFocusInCatalog(e, activeCatalog);
            }
        });
    }
    
    setupFormKeyboardNavigation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea, button');
            
            inputs.forEach((input, index) => {
                input.addEventListener('keydown', (e) => {
                    // Enter para ir al siguiente campo (excepto en textarea)
                    if (e.key === 'Enter' && input.tagName !== 'TEXTAREA') {
                        e.preventDefault();
                        const nextInput = inputs[index + 1];
                        if (nextInput) {
                            nextInput.focus();
                        } else {
                            // Último campo, intentar enviar formulario
                            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                            if (submitBtn) submitBtn.focus();
                        }
                    }
                });
            });
        });
    }
    
    setupAriaSupport() {
        // Mejorar etiquetas ARIA existentes
        this.enhanceAriaLabels();
        
        // Añadir landmarks ARIA
        this.addAriaLandmarks();
        
        // Configurar live regions
        this.setupLiveRegions();
        
        // Mejorar navegación ARIA
        this.enhanceAriaNavigation();
        
        console.log('🏷️ Soporte ARIA configurado');
    }
    
    enhanceAriaLabels() {
        // Botones sin etiquetas
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        buttons.forEach(button => {
            const text = button.textContent.trim();
            if (!text) {
                // Intentar obtener contexto
                if (button.classList.contains('morphing-trigger')) {
                    button.setAttribute('aria-label', 'Abrir menú de navegación');
                } else if (button.classList.contains('catalog-close')) {
                    button.setAttribute('aria-label', 'Cerrar catálogo de producto');
                } else if (button.classList.contains('back-to-top')) {
                    button.setAttribute('aria-label', 'Volver al inicio de la página');
                }
            }
        });
        
        // Enlaces sin contexto
        const links = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
        links.forEach(link => {
            if (link.classList.contains('whatsapp-float')) {
                link.setAttribute('aria-label', 'Contactar por WhatsApp');
            }
        });
        
        // Imágenes sin alt
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            if (img.src.includes('ajedrez')) {
                img.setAttribute('alt', 'Producto AJEDREZ - Vino espumoso sin alcohol');
            } else {
                img.setAttribute('alt', 'Imagen de COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S');
            }
        });
    }
    
    addAriaLandmarks() {
        // Main navigation
        const nav = document.querySelector('.navbar');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Navegación principal');
        }
        
        // Main content
        const main = document.querySelector('.main-content, main');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }
        
        // Sections as regions
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            if (!section.getAttribute('role')) {
                section.setAttribute('role', 'region');
                const heading = section.querySelector('h1, h2, h3');
                if (heading) {
                    if (!heading.id) {
                        heading.id = `heading-${section.id}`;
                    }
                    section.setAttribute('aria-labelledby', heading.id);
                }
            }
        });
        
        // Footer
        const footer = document.querySelector('.footer, footer');
        if (footer && !footer.getAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }
    }
    
    setupLiveRegions() {
        // Crear region para anuncios
        const announceRegion = document.createElement('div');
        announceRegion.id = 'aria-live-announcements';
        announceRegion.setAttribute('aria-live', 'polite');
        announceRegion.setAttribute('aria-atomic', 'true');
        announceRegion.style.position = 'absolute';
        announceRegion.style.left = '-10000px';
        announceRegion.style.width = '1px';
        announceRegion.style.height = '1px';
        announceRegion.style.overflow = 'hidden';
        document.body.appendChild(announceRegion);
        
        this.announceRegion = announceRegion;
        
        // Region para alertas
        const alertRegion = document.createElement('div');
        alertRegion.id = 'aria-live-alerts';
        alertRegion.setAttribute('aria-live', 'assertive');
        alertRegion.setAttribute('aria-atomic', 'true');
        alertRegion.style.position = 'absolute';
        alertRegion.style.left = '-10000px';
        alertRegion.style.width = '1px';
        alertRegion.style.height = '1px';
        alertRegion.style.overflow = 'hidden';
        document.body.appendChild(alertRegion);
        
        this.alertRegion = alertRegion;
    }
    
    enhanceAriaNavigation() {
        // Mejorar navegación de menús
        const menus = document.querySelectorAll('[role="menu"], .orbital-items, .hex-items, .morphing-content');
        menus.forEach(menu => {
            if (!menu.getAttribute('role')) {
                menu.setAttribute('role', 'menu');
            }
            
            const menuItems = menu.querySelectorAll('a, button');
            menuItems.forEach(item => {
                if (!item.getAttribute('role')) {
                    item.setAttribute('role', 'menuitem');
                }
            });
        });
        
        // Mejorar navegación de catálogos
        const catalogs = document.querySelectorAll('.product-catalog');
        catalogs.forEach(catalog => {
            catalog.setAttribute('role', 'dialog');
            catalog.setAttribute('aria-modal', 'true');
            
            const title = catalog.querySelector('h3');
            if (title && !title.id) {
                title.id = `catalog-title-${Math.random().toString(36).substr(2, 9)}`;
                catalog.setAttribute('aria-labelledby', title.id);
            }
        });
    }
    
    setupSkipLinks() {
        // Verificar si existe skip link
        let skipLink = document.querySelector('.skip-link');
        
        if (!skipLink) {
            // Crear skip link
            skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Saltar al contenido principal';
            skipLink.setAttribute('tabindex', '1');
            document.body.insertBefore(skipLink, document.body.firstChild);
        }
        
        // Añadir más skip links
        this.addAdditionalSkipLinks();
        
        console.log('🔗 Skip links configurados');
    }
    
    addAdditionalSkipLinks() {
        const skipLinksContainer = document.createElement('nav');
        skipLinksContainer.className = 'skip-links-container';
        skipLinksContainer.setAttribute('aria-label', 'Enlaces de navegación rápida');
        
        const skipLinks = [
            { href: '#productos', text: 'Saltar a productos' },
            { href: '#quienes-somos', text: 'Saltar a información de la empresa' },
            { href: '#contacto', text: 'Saltar al formulario de contacto' }
        ];
        
        skipLinks.forEach(link => {
            const skipLink = document.createElement('a');
            skipLink.href = link.href;
            skipLink.className = 'skip-link';
            skipLink.textContent = link.text;
            skipLinksContainer.appendChild(skipLink);
        });
        
        document.body.insertBefore(skipLinksContainer, document.body.firstChild);
    }
    
    setupFocusManagement() {
        // Focus visible para elementos interactivos
        this.setupFocusVisible();
        
        // Focus trapping para modales
        this.setupFocusTrapping();
        
        // Focus restoration
        this.setupFocusRestoration();
        
        console.log('👁️ Gestión de focus configurada');
    }
    
    setupFocusVisible() {
        // Añadir clase focus-visible para mejor styling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    setupFocusTrapping() {
        // Trap focus en catálogos activos
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const activeCatalog = document.querySelector('.product-catalog.active');
                if (activeCatalog) {
                    this.trapFocusInCatalog(e, activeCatalog);
                }
                
                const activeMenu = document.querySelector('[aria-expanded="true"]');
                if (activeMenu) {
                    this.trapFocusInMenu(e, activeMenu);
                }
            }
        });
    }
    
    trapFocusInCatalog(e, catalog) {
        const focusableElements = catalog.querySelectorAll(this.config.focusableSelectors);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    trapFocusInMenu(e, menu) {
        const menuItems = menu.querySelectorAll('[role="menuitem"], .orbital-item, .hex-item, .morphing-item');
        if (menuItems.length === 0) return;
        
        const firstItem = menuItems[0];
        const lastItem = menuItems[menuItems.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstItem) {
                e.preventDefault();
                lastItem.focus();
            }
        } else {
            if (document.activeElement === lastItem) {
                e.preventDefault();
                firstItem.focus();
            }
        }
    }
    
    setupFocusRestoration() {
        this.focusHistory = [];
        
        // Guardar focus antes de abrir modales
        document.addEventListener('catalogOpened', (e) => {
            this.focusHistory.push(document.activeElement);
        });
        
        document.addEventListener('catalogClosed', (e) => {
            const lastFocused = this.focusHistory.pop();
            if (lastFocused && typeof lastFocused.focus === 'function') {
                setTimeout(() => lastFocused.focus(), 100);
            }
        });
    }
    
    setupScreenReaderSupport() {
        if (!this.screenReaderSupport) return;
        
        // Mejorar anuncios para lectores de pantalla
        this.setupScreenReaderAnnouncements();
        
        // Configurar descripciones adicionales
        this.setupScreenReaderDescriptions();
        
        console.log('📢 Soporte para lectores de pantalla configurado');
    }
    
    setupScreenReaderAnnouncements() {
        // Anunciar cambios de sección
        window.addEventListener('sectionChanged', (e) => {
            this.announce(`Navegando a sección ${e.detail.section}`);
        });
        
        // Anunciar apertura de catálogos
        document.addEventListener('catalogOpened', (e) => {
            this.announce(`Catálogo de ${e.detail.product} abierto`);
        });
        
        // Anunciar cambios en el menú
        document.addEventListener('menuStateChanged', (e) => {
            this.announce(`Menú ${e.detail.isOpen ? 'abierto' : 'cerrado'}`);
        });
        
        // Anunciar envío de formularios
        document.addEventListener('formSubmitted', (e) => {
            this.announce('Formulario enviado correctamente');
        });
    }
    
    setupScreenReaderDescriptions() {
        // Añadir descripciones a elementos complejos
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const productName = card.querySelector('.product-name')?.textContent;
            const description = card.querySelector('.product-description-short')?.textContent;
            
            if (productName && description) {
                card.setAttribute('aria-label', `${productName}: ${description}`);
            }
        });
        
        // Describir navegación compleja
        const orbitalMenu = document.querySelector('.menu-orbital');
        if (orbitalMenu) {
            orbitalMenu.setAttribute('aria-describedby', 'orbital-menu-description');
            
            const description = document.createElement('div');
            description.id = 'orbital-menu-description';
            description.className = 'sr-only';
            description.textContent = 'Menú de navegación orbital. Use las teclas de flecha para navegar entre opciones.';
            orbitalMenu.appendChild(description);
        }
    }
    
    setupHighContrastMode() {
        if (this.highContrastMode) {
            this.applyHighContrast();
        }
        
        // Botón para alternar modo alto contraste
        this.addHighContrastToggle();
    }
    
    applyHighContrast() {
        document.body.classList.toggle('high-contrast', this.highContrastMode);
        
        if (this.highContrastMode) {
            this.announce('Modo de alto contraste activado');
        }
    }
    
    addHighContrastToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'high-contrast-toggle';
        toggle.className = 'accessibility-toggle';
        toggle.setAttribute('aria-label', 'Alternar modo de alto contraste');
        toggle.textContent = 'Alto Contraste';
        
        toggle.addEventListener('click', () => {
            this.highContrastMode = !this.highContrastMode;
            this.applyHighContrast();
        });
        
        // Posicionar el botón
        toggle.style.position = 'fixed';
        toggle.style.top = '10px';
        toggle.style.left = '10px';
        toggle.style.zIndex = '9999';
        toggle.style.padding = '8px 12px';
        toggle.style.fontSize = '12px';
        toggle.style.background = 'var(--accent-purple)';
        toggle.style.color = 'white';
        toggle.style.border = 'none';
        toggle.style.borderRadius = '4px';
        
        document.body.appendChild(toggle);
    }
    
    setupReducedMotion() {
        if (this.reducedMotion) {
            this.applyReducedMotion();
        }
    }
    
    applyReducedMotion() {
        document.body.classList.toggle('reduced-motion', this.reducedMotion);
        
        if (this.reducedMotion) {
            this.announce('Movimiento reducido activado');
        }
    }
    
    /* ===== UTILITY METHODS ===== */
    
    announce(message, priority = 'polite') {
        const region = priority === 'assertive' ? this.alertRegion : this.announceRegion;
        
        if (region) {
            region.textContent = message;
            
            // Limpiar después de un tiempo
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }
        
        console.log(`📢 Anuncio: ${message}`);
    }
    
    alert(message) {
        this.announce(message, 'assertive');
    }
    
    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            section.focus({ preventScroll: true });
            this.announce(`Navegando a ${sectionId}`);
        }
    }
    
    toggleMenu() {
        if (typeof window.toggleMenu === 'function') {
            window.toggleMenu();
        } else {
            // Fallback: intentar activar el menú actual
            const activeMenu = document.querySelector('.orbital-activator, .hex-activator, .morphing-trigger');
            if (activeMenu) {
                activeMenu.click();
            }
        }
    }
    
    closeAllModals() {
        // Cerrar catálogos
        const activeCatalogs = document.querySelectorAll('.product-catalog.active');
        activeCatalogs.forEach(catalog => {
            this.closeCatalog(catalog);
        });
        
        // Cerrar menús
        this.closeAllMenus();
        
        // Cerrar cookies banner config
        const cookiesModal = document.getElementById('cookies-config-modal');
        if (cookiesModal && cookiesModal.style.display !== 'none') {
            cookiesModal.style.display = 'none';
        }
    }
    
    closeCatalog(catalog) {
        catalog.classList.remove('active');
        this.announce('Catálogo cerrado');
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('catalogClosed', {
            detail: { catalog }
        }));
    }
    
    closeAllMenus() {
        if (typeof window.menuController?.closeAllMenus === 'function') {
            window.menuController.closeAllMenus();
        }
    }
    
    focusSearchElement() {
        // Intentar encontrar elemento de búsqueda
        const searchInput = document.querySelector('input[type="search"], input[name="search"], #search');
        if (searchInput) {
            searchInput.focus();
            this.announce('Campo de búsqueda enfocado');
        }
    }
    
    handleTabNavigation(e) {
        // Manejar navegación Tab inteligente
        const activeElement = document.activeElement;
        
        // Si estamos en un menú activo, manejar la navegación
        const activeMenu = document.querySelector('[aria-expanded="true"]');
        if (activeMenu) {
            this.trapFocusInMenu(e, activeMenu);
        }
        
        // Si estamos en un catálogo activo
        const activeCatalog = document.querySelector('.product-catalog.active');
        if (activeCatalog) {
            this.trapFocusInCatalog(e, activeCatalog);
        }
    }
    
    /* ===== PUBLIC API ===== */
    
    setFocus(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element && typeof element.focus === 'function') {
            element.focus();
            this.announce(`Enfoque en ${element.tagName.toLowerCase()}`);
        }
    }
    
    announceMessage(message, priority = 'polite') {
        this.announce(message, priority);
    }
    
    enableKeyboardNavigation() {
        this.keyboardNavigationEnabled = true;
        document.body.classList.add('keyboard-navigation-enabled');
        this.announce('Navegación por teclado habilitada');
    }
    
    disableKeyboardNavigation() {
        this.keyboardNavigationEnabled = false;
        document.body.classList.remove('keyboard-navigation-enabled');
        this.announce('Navegación por teclado deshabilitada');
    }
    
    getAccessibilityStatus() {
        return {
            keyboardNavigation: this.keyboardNavigationEnabled,
            screenReader: this.screenReaderSupport,
            highContrast: this.highContrastMode,
            reducedMotion: this.reducedMotion,
            skipLinks: this.skipLinksEnabled
        };
    }
}

/* ===== CSS ADICIONAL PARA ACCESIBILIDAD ===== */
const accessibilityStyles = document.createElement('style');
accessibilityStyles.textContent = `
/* Focus visible mejorado */
.keyboard-navigation *:focus {
    outline: 3px solid var(--accent-purple) !important;
    outline-offset: 2px !important;
    border-radius: 4px;
}

/* Skip links */
.skip-link,
.skip-links-container .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--accent-purple);
    color: var(--primary-dark);
    padding: 8px 12px;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 600;
    z-index: 10000;
    transition: top 0.3s ease;
}

.skip-link:focus,
.skip-links-container .skip-link:focus {
    top: 6px;
}

/* Screen reader only */
.sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}

/* Alto contraste */
.high-contrast {
    --primary-dark: #000000 !important;
    --secondary-dark: #111111 !important;
    --white: #ffffff !important;
    --accent-purple: #ffff00 !important;
    --accent-green: #00ff00 !important;
    --accent-pink: #ff00ff !important;
}

.high-contrast * {
    border-color: #ffffff !important;
    box-shadow: none !important;
    text-shadow: none !important;
}

/* Movimiento reducido */
.reduced-motion *,
.reduced-motion *::before,
.reduced-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
}

/* Toggles de accesibilidad */
.accessibility-toggle {
    font-size: 12px;
    padding: 6px 10px;
    margin: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.accessibility-toggle:hover {
    transform: scale(1.05);
}

.accessibility-toggle:focus {
    outline: 2px solid white;
    outline-offset: 2px;
}

/* Mejoras para focus en móvil */
@media (max-width: 767px) {
    .keyboard-navigation *:focus {
        outline-width: 2px !important;
        outline-offset: 1px !important;
    }
    
    .skip-link:focus {
        top: 10px;
        left: 10px;
        right: 10px;
        text-align: center;
    }
}
`;

document.head.appendChild(accessibilityStyles);

/* ===== INICIALIZACIÓN ===== */
document.addEventListener('DOMContentLoaded', () => {
    window.accessibility = new AccessibilityController();
    
    // API global
    window.announce = (message, priority) => window.accessibility.announceMessage(message, priority);
    window.setFocus = (element) => window.accessibility.setFocus(element);
    window.getAccessibilityStatus = () => window.accessibility.getAccessibilityStatus();
});

// Exportar para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityController;
}

console.log('♿ accessibility.js cargado completamente');