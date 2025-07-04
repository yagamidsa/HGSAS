/* ===================================================================
   MENU CONTROLLER - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Sistema de control unificado para los 3 tipos de menú - ARREGLADO
   =================================================================== */

class MenuController {
    constructor() {
        this.currentBreakpoint = this.getBreakpoint();
        this.activeMenu = null;
        this.isOpen = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        // Referencias a los elementos del DOM
        this.orbitalMenu = null;
        this.hexMenu = null;
        this.morphingMenu = null;
        
        this.init();
    }
    
    init() {
        // Esperar a que el DOM esté completamente cargado
        this.findMenuElements();
        this.setupEventListeners();
        this.updateActiveMenu();
        this.setupScrollBehavior();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        
        // Detectar cambios de orientación y redimensionamiento
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });
        
        console.log('🎯 Menu Controller inicializado correctamente');
        console.log(`📱 Breakpoint actual: ${this.currentBreakpoint}`);
    }
    
    findMenuElements() {
        // Buscar elementos del menú con reintentos
        this.orbitalMenu = document.querySelector('.menu-orbital');
        this.hexMenu = document.querySelector('.menu-hexagonal');
        this.morphingMenu = document.querySelector('.menu-morphing');
        
        // Debug
        console.log('🔍 Menús encontrados:', {
            orbital: !!this.orbitalMenu,
            hexagonal: !!this.hexMenu,
            morphing: !!this.morphingMenu
        });
    }
    
    getBreakpoint() {
        const width = window.innerWidth;
        if (width >= 1024) return 'desktop';
        if (width >= 768) return 'tablet';
        return 'mobile';
    }
    
    updateActiveMenu() {
        const newBreakpoint = this.getBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.closeAllMenus();
            this.currentBreakpoint = newBreakpoint;
        }
        
        // Ocultar todos los menús primero
        [this.orbitalMenu, this.hexMenu, this.morphingMenu].forEach(menu => {
            if (menu) menu.style.display = 'none';
        });
        
        // Mostrar el menú correcto
        switch(this.currentBreakpoint) {
            case 'desktop':
                if (this.orbitalMenu) {
                    this.orbitalMenu.style.display = 'flex';
                    this.activeMenu = this.orbitalMenu;
                }
                break;
            case 'tablet':
                if (this.hexMenu) {
                    this.hexMenu.style.display = 'flex';
                    this.activeMenu = this.hexMenu;
                }
                break;
            case 'mobile':
                if (this.morphingMenu) {
                    this.morphingMenu.style.display = 'flex';
                    this.activeMenu = this.morphingMenu;
                }
                break;
        }
        
        console.log(`📱 Menú activo: ${this.currentBreakpoint}`, this.activeMenu);
    }
    
    setupEventListeners() {
        // Usar delegación de eventos para mejor rendimiento
        document.addEventListener('click', (e) => {
            this.handleDocumentClick(e);
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeAllMenus();
            }
        });
    }
    
    handleDocumentClick(e) {
        // Click en activadores de menú
        if (e.target.closest('.orbital-activator')) {
            e.stopPropagation();
            this.toggleMenu('orbital');
            return;
        }
        
        if (e.target.closest('.hex-activator')) {
            e.stopPropagation();
            this.toggleMenu('hexagonal');
            return;
        }
        
        if (e.target.closest('.morphing-trigger')) {
            e.stopPropagation();
            this.toggleMenu('morphing');
            return;
        }
        
        // Click en items del menú
        const menuItem = e.target.closest('.orbital-item, .hex-item, .morphing-item');
        if (menuItem) {
            this.handleMenuItemClick(e, menuItem);
            return;
        }
        
        // Click fuera del menú - cerrar
        if (!e.target.closest('.menu-system')) {
            this.closeAllMenus();
        }
    }
    
    toggleMenu(type) {
        if (this.isOpen) {
            this.closeMenu(type);
        } else {
            this.openMenu(type);
        }
    }
    
    openMenu(type) {
        if (this.isOpen) return;
        
        this.isOpen = true;
        
        switch(type) {
            case 'orbital':
                if (this.orbitalMenu) {
                    this.orbitalMenu.setAttribute('aria-expanded', 'true');
                    const activator = this.orbitalMenu.querySelector('.orbital-activator');
                    if (activator) activator.setAttribute('aria-expanded', 'true');
                }
                break;
                
            case 'hexagonal':
                if (this.hexMenu) {
                    this.hexMenu.setAttribute('aria-expanded', 'true');
                    const activator = this.hexMenu.querySelector('.hex-activator');
                    if (activator) activator.setAttribute('aria-expanded', 'true');
                }
                break;
                
            case 'morphing':
                if (this.morphingMenu) {
                    this.morphingMenu.setAttribute('aria-expanded', 'true');
                    const trigger = this.morphingMenu.querySelector('.morphing-trigger');
                    if (trigger) trigger.setAttribute('aria-expanded', 'true');
                    
                    // Prevenir scroll del body cuando el menú móvil está abierto
                    document.body.style.overflow = 'hidden';
                }
                break;
        }
        
        console.log(`🎯 Menú ${type} abierto`);
    }
    
    closeMenu(type) {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        switch(type) {
            case 'orbital':
                if (this.orbitalMenu) {
                    this.orbitalMenu.setAttribute('aria-expanded', 'false');
                    const activator = this.orbitalMenu.querySelector('.orbital-activator');
                    if (activator) activator.setAttribute('aria-expanded', 'false');
                }
                break;
                
            case 'hexagonal':
                if (this.hexMenu) {
                    this.hexMenu.setAttribute('aria-expanded', 'false');
                    const activator = this.hexMenu.querySelector('.hex-activator');
                    if (activator) activator.setAttribute('aria-expanded', 'false');
                }
                break;
                
            case 'morphing':
                if (this.morphingMenu) {
                    this.morphingMenu.setAttribute('aria-expanded', 'false');
                    const trigger = this.morphingMenu.querySelector('.morphing-trigger');
                    if (trigger) trigger.setAttribute('aria-expanded', 'false');
                    
                    // Restaurar scroll del body
                    document.body.style.overflow = 'auto';
                }
                break;
        }
        
        console.log(`🎯 Menú ${type} cerrado`);
    }
    
    closeAllMenus() {
        if (this.orbitalMenu) this.closeMenu('orbital');
        if (this.hexMenu) this.closeMenu('hexagonal');
        if (this.morphingMenu) this.closeMenu('morphing');
    }
    
    handleMenuItemClick(e, menuItem) {
        const href = menuItem.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            // Cerrar menú inmediatamente
            this.closeAllMenus();
            
            // Scroll suave a la sección con offset correcto
            setTimeout(() => {
                this.smoothScrollToSection(href);
            }, 200);
        }
    }
    
    smoothScrollToSection(href) {
        const targetSection = document.querySelector(href);
        if (!targetSection) {
            console.warn(`Sección ${href} no encontrada`);
            return;
        }
        
        // Calcular offset del header + margen extra
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 80;
        const extraMargin = 30; // Margen extra para que se vea bien el título
        const totalOffset = headerHeight + extraMargin;
        
        // Posición del elemento menos el offset
        const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - totalOffset;
        
        // Scroll suave con mejor animación
        this.animatedScrollTo(offsetPosition, 800);
        
        // Actualizar URL sin recargar página
        history.pushState(null, null, href);
        
        // Focus en la sección para accesibilidad
        setTimeout(() => {
            targetSection.focus({ preventScroll: true });
        }, 900);
        
        console.log(`🎯 Navegando a ${href}`);
    }
    
    animatedScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        // Función de easing más suave
        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = easeInOutCubic(progress);
            window.scrollTo(0, startPosition + distance * ease);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }
    
    setupScrollBehavior() {
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        const updateOnScroll = () => {
            const currentScrollY = window.scrollY;
            const header = document.querySelector('.header');
            
            // Actualizar estado del header
            if (currentScrollY > 100) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
            
            // Auto-hide en móvil solo si el menú no está abierto
            if (this.currentBreakpoint === 'mobile' && !this.isOpen) {
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    this.hideMenuOnScroll();
                } else if (currentScrollY < lastScrollY) {
                    this.showMenuOnScroll();
                }
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        });
    }
    
    hideMenuOnScroll() {
        const header = document.querySelector('.header');
        if (header && !this.isOpen) {
            header.style.transform = 'translateY(-100%)';
        }
    }
    
    showMenuOnScroll() {
        const header = document.querySelector('.header');
        if (header) {
            header.style.transform = 'translateY(0)';
        }
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen || !this.activeMenu) return;
            
            const menuItems = this.activeMenu.querySelectorAll('[role="menuitem"], .orbital-item, .hex-item, .morphing-item');
            const currentFocus = document.activeElement;
            const currentIndex = Array.from(menuItems).indexOf(currentFocus);
            
            let nextIndex = currentIndex;
            
            switch(e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    nextIndex = (currentIndex + 1) % menuItems.length;
                    break;
                    
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    nextIndex = 0;
                    break;
                    
                case 'End':
                    e.preventDefault();
                    nextIndex = menuItems.length - 1;
                    break;
                    
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (currentFocus && typeof currentFocus.click === 'function') {
                        currentFocus.click();
                    }
                    return;
            }
            
            if (menuItems[nextIndex]) {
                menuItems[nextIndex].focus();
            }
        });
    }
    
    setupTouchGestures() {
        // Gestos táctiles para cerrar el menú morphing
        if (this.morphingMenu) {
            const panel = this.morphingMenu.querySelector('.morphing-panel');
            
            if (panel) {
                panel.addEventListener('touchstart', (e) => {
                    this.touchStartX = e.touches[0].clientX;
                    this.touchStartY = e.touches[0].clientY;
                });
                
                panel.addEventListener('touchend', (e) => {
                    if (!this.isOpen || this.currentBreakpoint !== 'mobile') return;
                    
                    const touchX = e.changedTouches[0].clientX;
                    const touchY = e.changedTouches[0].clientY;
                    const deltaX = touchX - this.touchStartX;
                    const deltaY = touchY - this.touchStartY;
                    
                    // Swipe hacia la derecha para cerrar
                    if (deltaX > 100 && Math.abs(deltaY) < 50) {
                        this.closeMenu('morphing');
                    }
                });
            }
        }
    }
    
    handleResize() {
        const newBreakpoint = this.getBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            console.log(`📱 Cambio de breakpoint: ${this.currentBreakpoint} → ${newBreakpoint}`);
            this.closeAllMenus();
            this.currentBreakpoint = newBreakpoint;
            this.updateActiveMenu();
        }
    }
    
    // ===== MÉTODOS PÚBLICOS =====
    
    toggle() {
        const currentType = {
            'desktop': 'orbital',
            'tablet': 'hexagonal',
            'mobile': 'morphing'
        }[this.currentBreakpoint];
        
        if (currentType) {
            this.toggleMenu(currentType);
        }
    }
    
    getState() {
        return {
            isOpen: this.isOpen,
            breakpoint: this.currentBreakpoint,
            activeMenu: this.activeMenu?.className || null,
            menuElements: {
                orbital: !!this.orbitalMenu,
                hexagonal: !!this.hexMenu,
                morphing: !!this.morphingMenu
            }
        };
    }
    
    forceUpdate() {
        this.findMenuElements();
        this.updateActiveMenu();
        console.log('🔄 Menu Controller actualizado manualmente');
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Pequeño delay para asegurar que todos los elementos estén listos
    setTimeout(() => {
        window.menuController = new MenuController();
        
        // Funciones globales para testing y uso
        window.toggleMenu = () => window.menuController.toggle();
        window.getMenuState = () => window.menuController.getState();
        window.updateMenus = () => window.menuController.forceUpdate();
    }, 100);
});

// Exportar para otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuController;
}

/* ===== COMANDOS DE TESTING =====

// Estado del menú
getMenuState()

// Alternar menú actual
toggleMenu()

// Forzar actualización
updateMenus()

// Ver controlador
menuController

=======================================================*/