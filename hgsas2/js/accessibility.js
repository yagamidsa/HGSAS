/* ===================================================================
   ACCESSIBILITY SYSTEM - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Sistema de accesibilidad WCAG 2.1 AA compliant
   =================================================================== */

class AccessibilitySystem {
    constructor() {
        this.isHighContrast = false;
        this.fontSize = 100; // Porcentaje
        this.focusedElement = null;
        this.skipLinksCreated = false;
        this.announcer = null;
        
        this.config = {
            maxFontSize: 150,
            minFontSize: 75,
            focusOutlineColor: '#bd93f9',
            highContrastColors: {
                background: '#000000',
                text: '#ffffff',
                accent: '#ffff00'
            }
        };
        
        this.init();
    }
    
    init() {
        this.createSkipLinks();
        this.createScreenReaderAnnouncer();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIALabels();
        this.setupHighContrastMode();
        this.setupFontSizeControls();
        this.monitorFormAccessibility();
        this.setupReducedMotionRespect();
        
        console.log('♿ Accessibility System inicializado');
        console.log('✅ WCAG 2.1 AA compliance activado');
    }
    
    createSkipLinks() {
        if (this.skipLinksCreated) return;
        
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.setAttribute('role', 'navigation');
        skipLinks.setAttribute('aria-label', 'Enlaces de acceso rápido');
        
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
            <a href="#productos" class="skip-link">Saltar a productos</a>
            <a href="#contacto" class="skip-link">Saltar a contacto</a>
            <a href="#footer" class="skip-link">Saltar al pie de página</a>
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
        this.skipLinksCreated = true;
        
        // Manejar clicks en skip links
        skipLinks.addEventListener('click', (e) => {
            if (e.target.classList.contains('skip-link')) {
                const targetId = e.target.getAttribute('href').substring(1);
                this.focusElement(targetId);
            }
        });
    }
    
    createScreenReaderAnnouncer() {
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.className = 'sr-only';
        this.announcer.id = 'screen-reader-announcer';
        document.body.appendChild(this.announcer);
    }
    
    setupKeyboardNavigation() {
        // Navegación global con teclado
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
                case 'Escape':
                    this.handleEscapeKey(e);
                    break;
                case 'Enter':
                case ' ':
                    this.handleActivationKey(e);
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.handleArrowNavigation(e);
                    break;
                case 'Home':
                case 'End':
                    this.handleHomeEndNavigation(e);
                    break;
            }
        });
        
        // Mostrar focus outline solo cuando se navega con teclado
        document.addEventListener('keydown', () => {
            document.body.classList.add('keyboard-navigation');
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    setupFocusManagement() {
        // Mejorar la gestión del focus
        const focusableElements = 'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
        
        // Asegurar que todos los elementos focusables tengan outline visible
        document.addEventListener('focusin', (e) => {
            this.focusedElement = e.target;
            this.announceElementFocus(e.target);
        });
        
        document.addEventListener('focusout', (e) => {
            this.focusedElement = null;
        });
        
        // Trap focus en modales y menús desplegables
        this.setupFocusTrap();
    }
    
    setupFocusTrap() {
        // Focus trap para elementos modales
        const trapFocus = (container) => {
            const focusableElements = container.querySelectorAll(
                'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) return;
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            container.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
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
            });
        };
        
        // Aplicar focus trap a elementos modales
        const modals = document.querySelectorAll('.catalog-modal, .menu-panel, .morphing-panel');
        modals.forEach(modal => trapFocus(modal));
    }
    
    setupARIALabels() {
        // Mejorar etiquetas ARIA automáticamente
        const elementsNeedingLabels = document.querySelectorAll('button, a, input, select, textarea');
        
        elementsNeedingLabels.forEach(element => {
            if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
                this.addImplicitLabel(element);
            }
        });
        
        // Agregar roles faltantes
        this.addMissingRoles();
    }
    
    addImplicitLabel(element) {
        const tagName = element.tagName.toLowerCase();
        
        switch (tagName) {
            case 'button':
                if (!element.textContent.trim()) {
                    const icon = element.querySelector('svg, img');
                    if (icon) {
                        element.setAttribute('aria-label', 'Botón');
                    }
                }
                break;
                
            case 'a':
                if (!element.textContent.trim() && element.href) {
                    element.setAttribute('aria-label', `Enlace a ${element.href}`);
                }
                break;
                
            case 'input':
                if (element.type === 'submit' && !element.value) {
                    element.setAttribute('aria-label', 'Enviar formulario');
                }
                break;
        }
    }
    
    addMissingRoles() {
        // Agregar roles faltantes automáticamente
        const nav = document.querySelector('.menu-system');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
        }
        
        const main = document.querySelector('main') || document.querySelector('.main-content');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }
        
        const footer = document.querySelector('footer');
        if (footer && !footer.getAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }
    }
    
    setupHighContrastMode() {
        // Detectar preferencia de alto contraste del sistema
        const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
        
        if (highContrastQuery.matches) {
            this.enableHighContrast();
        }
        
        highContrastQuery.addEventListener('change', (e) => {
            if (e.matches) {
                this.enableHighContrast();
            } else {
                this.disableHighContrast();
            }
        });
        
        // Crear toggle manual
        this.createHighContrastToggle();
    }
    
    createHighContrastToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'accessibility-toggle high-contrast-toggle';
        toggle.setAttribute('aria-label', 'Alternar modo de alto contraste');
        toggle.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-4.08 3.06-7.44 7-7.93v15.86z"/>
            </svg>
        `;
        
        toggle.addEventListener('click', () => {
            this.toggleHighContrast();
        });
        
        document.body.appendChild(toggle);
    }
    
    setupFontSizeControls() {
        const fontControls = document.createElement('div');
        fontControls.className = 'accessibility-controls font-size-controls';
        fontControls.innerHTML = `
            <button class="font-decrease" aria-label="Disminuir tamaño de fuente">A-</button>
            <button class="font-reset" aria-label="Restablecer tamaño de fuente">A</button>
            <button class="font-increase" aria-label="Aumentar tamaño de fuente">A+</button>
        `;
        
        fontControls.addEventListener('click', (e) => {
            if (e.target.classList.contains('font-decrease')) {
                this.decreaseFontSize();
            } else if (e.target.classList.contains('font-increase')) {
                this.increaseFontSize();
            } else if (e.target.classList.contains('font-reset')) {
                this.resetFontSize();
            }
        });
        
        document.body.appendChild(fontControls);
    }
    
    setupReducedMotionRespect() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            this.disableAnimations();
        }
        
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                this.disableAnimations();
            } else {
                this.enableAnimations();
            }
        });
    }
    
    monitorFormAccessibility() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            this.enhanceFormAccessibility(form);
        });
    }
    
    enhanceFormAccessibility(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Asociar labels automáticamente
            if (!input.getAttribute('aria-labelledby') && !input.getAttribute('aria-label')) {
                const label = form.querySelector(`label[for="${input.id}"]`);
                if (!label && input.placeholder) {
                    input.setAttribute('aria-label', input.placeholder);
                }
            }
            
            // Describir campos requeridos
            if (input.required && !input.getAttribute('aria-describedby')) {
                const description = document.createElement('span');
                description.className = 'sr-only';
                description.textContent = 'Campo requerido';
                description.id = `${input.id || 'input'}-required`;
                input.parentNode.appendChild(description);
                input.setAttribute('aria-describedby', description.id);
            }
            
            // Manejar errores de validación
            input.addEventListener('invalid', (e) => {
                this.announceError(e.target);
            });
        });
    }
    
    // ===== MÉTODOS DE NAVEGACIÓN =====
    
    handleTabNavigation(e) {
        // Mejorar la navegación con tab
        const currentElement = document.activeElement;
        
        // Si estamos en un menú, manejar navegación especial
        if (this.isInMenu(currentElement)) {
            this.handleMenuTabNavigation(e, currentElement);
        }
    }
    
    handleEscapeKey(e) {
        // Cerrar modales, menús y elementos desplegables
        const activeModal = document.querySelector('.catalog-modal.catalog-open');
        const activeMenu = document.querySelector('.menu-panel.open, .morphing-panel.panel-open');
        
        if (activeModal) {
            this.closeModal(activeModal);
        } else if (activeMenu) {
            this.closeMenu(activeMenu);
        }
    }
    
    handleActivationKey(e) {
        // Manejar Enter y Space como click en elementos apropiados
        const target = e.target;
        
        if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
            if (e.key === ' ') {
                e.preventDefault();
                target.click();
            }
        }
    }
    
    handleArrowNavigation(e) {
        // Navegación con flechas en menús y listas
        const currentElement = document.activeElement;
        
        if (this.isInMenu(currentElement)) {
            e.preventDefault();
            this.navigateMenu(e.key, currentElement);
        }
    }
    
    handleHomeEndNavigation(e) {
        // Navegación Home/End en listas y menús
        const currentElement = document.activeElement;
        
        if (this.isInMenu(currentElement)) {
            e.preventDefault();
            this.navigateMenuHomeEnd(e.key, currentElement);
        }
    }
    
    // ===== MÉTODOS PÚBLICOS =====
    
    announceToScreenReader(message, priority = 'polite') {
        if (this.announcer) {
            this.announcer.setAttribute('aria-live', priority);
            this.announcer.textContent = message;
            
            setTimeout(() => {
                this.announcer.textContent = '';
            }, 1000);
        }
    }
    
    focusElement(elementOrId) {
        let element;
        
        if (typeof elementOrId === 'string') {
            element = document.getElementById(elementOrId) || document.querySelector(elementOrId);
        } else {
            element = elementOrId;
        }
        
        if (element) {
            element.focus({ preventScroll: false });
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    enableHighContrast() {
        document.body.classList.add('high-contrast');
        this.isHighContrast = true;
        this.announceToScreenReader('Alto contraste activado');
        localStorage.setItem('accessibility-high-contrast', 'true');
    }
    
    disableHighContrast() {
        document.body.classList.remove('high-contrast');
        this.isHighContrast = false;
        this.announceToScreenReader('Alto contraste desactivado');
        localStorage.setItem('accessibility-high-contrast', 'false');
    }
    
    toggleHighContrast() {
        if (this.isHighContrast) {
            this.disableHighContrast();
        } else {
            this.enableHighContrast();
        }
    }
    
    increaseFontSize() {
        if (this.fontSize < this.config.maxFontSize) {
            this.fontSize += 10;
            this.applyFontSize();
            this.announceToScreenReader(`Tamaño de fuente: ${this.fontSize}%`);
        }
    }
    
    decreaseFontSize() {
        if (this.fontSize > this.config.minFontSize) {
            this.fontSize -= 10;
            this.applyFontSize();
            this.announceToScreenReader(`Tamaño de fuente: ${this.fontSize}%`);
        }
    }
    
    resetFontSize() {
        this.fontSize = 100;
        this.applyFontSize();
        this.announceToScreenReader('Tamaño de fuente restablecido');
    }
    
    applyFontSize() {
        document.documentElement.style.fontSize = `${this.fontSize}%`;
        localStorage.setItem('accessibility-font-size', this.fontSize.toString());
    }
    
    disableAnimations() {
        document.body.classList.add('reduce-motion');
        this.announceToScreenReader('Animaciones reducidas');
    }
    
    enableAnimations() {
        document.body.classList.remove('reduce-motion');
    }
    
    getAccessibilityReport() {
        return {
            highContrast: this.isHighContrast,
            fontSize: this.fontSize,
            skipLinksCreated: this.skipLinksCreated,
            currentFocus: this.focusedElement?.tagName || null,
            reduceMotion: document.body.classList.contains('reduce-motion')
        };
    }
    
    // ===== MÉTODOS PRIVADOS =====
    
    isInMenu(element) {
        return element.closest('.menu-orbital, .menu-hexagonal, .menu-morphing, .catalog-modal');
    }
    
    announceElementFocus(element) {
        const label = element.getAttribute('aria-label') || 
                     element.textContent?.trim() || 
                     element.getAttribute('title') || 
                     element.tagName.toLowerCase();
        
        if (label && label !== this.lastAnnouncement) {
            this.announceToScreenReader(label);
            this.lastAnnouncement = label;
        }
    }
    
    announceError(input) {
        const errorMessage = input.validationMessage || 'Error en el campo';
        this.announceToScreenReader(errorMessage, 'assertive');
    }
    
    navigateMenu(direction, currentElement) {
        const menu = currentElement.closest('[role="menu"], .menu-items');
        if (!menu) return;
        
        const items = Array.from(menu.querySelectorAll('[role="menuitem"], a, button'));
        const currentIndex = items.indexOf(currentElement);
        
        let nextIndex;
        
        if (direction === 'ArrowDown' || direction === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % items.length;
        } else {
            nextIndex = currentIndex - 1 < 0 ? items.length - 1 : currentIndex - 1;
        }
        
        items[nextIndex].focus();
    }
    
    loadSavedPreferences() {
        // Cargar preferencias guardadas
        const savedHighContrast = localStorage.getItem('accessibility-high-contrast');
        const savedFontSize = localStorage.getItem('accessibility-font-size');
        
        if (savedHighContrast === 'true') {
            this.enableHighContrast();
        }
        
        if (savedFontSize) {
            this.fontSize = parseInt(savedFontSize);
            this.applyFontSize();
        }
    }
}

// ===== ESTILOS CSS DINÁMICOS =====
const accessibilityStyles = document.createElement('style');
accessibilityStyles.textContent = `
    /* Skip Links */
    .skip-links {
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 10000;
    }
    
    .skip-link {
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
        background: #bd93f9;
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .skip-link:focus {
        position: static;
        width: auto;
        height: auto;
        overflow: visible;
        left: 6px;
        top: 6px;
    }
    
    /* Screen Reader Only */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    /* Focus Styles */
    body.keyboard-navigation *:focus {
        outline: 2px solid #bd93f9;
        outline-offset: 2px;
        border-radius: 4px;
    }
    
    body.keyboard-navigation button:focus,
    body.keyboard-navigation a:focus,
    body.keyboard-navigation input:focus,
    body.keyboard-navigation textarea:focus,
    body.keyboard-navigation select:focus {
        box-shadow: 0 0 0 2px #bd93f9, 0 0 0 4px rgba(189, 147, 249, 0.3);
    }
    
    /* High Contrast Mode */
    body.high-contrast {
        background: #000000 !important;
        color: #ffffff !important;
    }
    
    body.high-contrast * {
        background-color: #000000 !important;
        color: #ffffff !important;
        border-color: #ffffff !important;
    }
    
    body.high-contrast a,
    body.high-contrast button,
    body.high-contrast .btn {
        background: #ffff00 !important;
        color: #000000 !important;
        border: 2px solid #ffffff !important;
    }
    
    body.high-contrast img,
    body.high-contrast svg {
        filter: contrast(2) brightness(1.5);
    }
    
    /* Accessibility Controls */
    .accessibility-controls {
        position: fixed;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .accessibility-toggle,
    .font-size-controls button {
        width: 40px;
        height: 40px;
        background: rgba(189, 147, 249, 0.9);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }
    
    .accessibility-toggle:hover,
    .font-size-controls button:hover {
        background: rgba(189, 147, 249, 1);
        transform: scale(1.1);
    }
    
    .accessibility-toggle svg {
        width: 20px;
        height: 20px;
    }
    
    .font-size-controls {
        background: rgba(0, 0, 0, 0.8);
        border-radius: 25px;
        padding: 5px;
    }
    
    .font-size-controls button {
        width: 35px;
        height: 35px;
        margin: 2px;
        border-radius: 50%;
        font-size: 12px;
    }
    
    /* Reduced Motion */
    body.reduce-motion *,
    body.reduce-motion *::before,
    body.reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
    
    /* Form Accessibility */
    input:invalid,
    textarea:invalid,
    select:invalid {
        border-color: #ff5555 !important;
        box-shadow: 0 0 0 2px rgba(255, 85, 85, 0.3) !important;
    }
    
    .field-error {
        color: #ff5555;
        font-size: 0.875rem;
        margin-top: 4px;
        display: block;
    }
    
    /* Mobile Accessibility */
    @media (max-width: 768px) {
        .accessibility-controls {
            right: 5px;
            top: auto;
            bottom: 100px;
            transform: none;
        }
        
        .accessibility-toggle,
        .font-size-controls button {
            width: 35px;
            height: 35px;
        }
        
        .skip-link:focus {
            left: 3px;
            top: 3px;
            font-size: 14px;
        }
    }
    
    /* Print Accessibility */
    @media print {
        .accessibility-controls,
        .skip-links {
            display: none !important;
        }
    }
`;
document.head.appendChild(accessibilityStyles);

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilitySystem = new AccessibilitySystem();
    
    // Cargar preferencias guardadas
    window.accessibilitySystem.loadSavedPreferences();
    
    // Funciones globales para testing
    window.announceToScreenReader = (message) => window.accessibilitySystem.announceToScreenReader(message);
    window.toggleHighContrast = () => window.accessibilitySystem.toggleHighContrast();
    window.accessibilityReport = () => window.accessibilitySystem.getAccessibilityReport();
});

// Exportar para otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilitySystem;
}

/* ===== COMANDOS DE TESTING =====

// Anunciar mensaje
announceToScreenReader('Mensaje de prueba')

// Toggle alto contraste
toggleHighContrast()

// Ver reporte de accesibilidad
accessibilityReport()

// Ver sistema
accessibilitySystem

===============================================*/