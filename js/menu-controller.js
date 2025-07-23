/* ===================================================================
   MENU CONTROLLER COMPLETO - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Sistema de control unificado para los 3 tipos de menú - FUNCIONAL
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

        // FORZAR OCULTAR TODOS PRIMERO
        [this.orbitalMenu, this.hexMenu, this.morphingMenu].forEach(menu => {
            if (menu) menu.style.display = 'none';
        });

        // MOSTRAR SOLO EL CORRECTO
        switch (this.currentBreakpoint) {
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
    }

    setupEventListeners() {
        // UN SOLO event listener unificado para evitar conflictos
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
        console.log('🔍 Click detectado en:', e.target);

        // PRIORIDAD 1: Click en activadores de menú
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

        // PRIORIDAD 2: Click en items del menú (navegación)
        const menuItem = e.target.closest('.orbital-item, .hex-item, .morphing-item');
        if (menuItem) {
            console.log('📍 Click en item del menú:', menuItem.textContent);
            e.stopPropagation();

            // CERRAR MENÚ INMEDIATAMENTE
            console.log('🔴 Cerrando menú por navegación...');
            this.closeAllMenus();

            // Manejar la navegación después de un pequeño delay
            setTimeout(() => {
                this.handleNavigation(menuItem);
            }, 200);
            return;
        }

        // PRIORIDAD 3: Click dentro del área del menú (no cerrar)
        if (e.target.closest('.menu-system, .menu-orbital, .menu-hexagonal, .menu-morphing, .orbital-items, .hex-items, .morphing-panel')) {
            return;
        }

        // PRIORIDAD 4: Click fuera del menú (cerrar)
        if (this.isOpen) {
            this.closeAllMenus();
            console.log('🔴 Menú cerrado por click fuera');
        }
    }

    handleNavigation(menuItem) {
        const href = menuItem.getAttribute('href');
        const menuText = menuItem.textContent.trim().toLowerCase();

        console.log(`🔗 Navegando a: ${href} (${menuText})`);

        // Manejar navegación según el tipo de link
        if (href && href.startsWith('#')) {
            // Link interno directo
            this.smoothScrollToSection(href);
        } else if (href && (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel'))) {
            // Link externo
            if (menuItem.hasAttribute('target') && menuItem.getAttribute('target') === '_blank') {
                window.open(href, '_blank', 'noopener,noreferrer');
            } else {
                window.location.href = href;
            }
        } else {
            // Navegación por texto del menú
            this.navigateByMenuText(menuText);
        }
    }

    navigateByMenuText(menuText) {
        let targetSection = null;

        // Mapear texto del menú a secciones
        if (menuText.includes('inicio') || menuText.includes('home')) {
            targetSection = '#home';
        } else if (menuText.includes('productos') || menuText.includes('ajedrez')) {
            targetSection = '#productos';
        } else if (menuText.includes('empresa') || menuText.includes('quienes') || menuText.includes('somos')) {
            targetSection = '#quienes-somos';
        } else if (menuText.includes('contacto') || menuText.includes('consulta')) {
            targetSection = '#contacto';
        } else if (menuText.includes('whatsapp')) {
            this.openWhatsApp();
            return;
        }

        // Navegar a la sección encontrada
        if (targetSection) {
            console.log(`📍 Navegando por texto a: ${targetSection}`);
            this.smoothScrollToSection(targetSection);
        } else {
            console.warn(`⚠️ No se encontró sección para: ${menuText}`);
            // Fallback: ir al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    openWhatsApp() {
        // Usar el controlador de WhatsApp si existe
        if (window.whatsappController) {
            window.whatsappController.handleFloatingButtonClick();
        } else {
            // Fallback directo
            const message = 'Hola, me interesa conocer más sobre los productos AJEDREZ';
            const phone = '573XXXXXXXXX'; // Reemplaza con tu número real
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
        console.log('📱 Abriendo WhatsApp');
    }

    smoothScrollToSection(href) {
        // Primero intentar con el href directo
        let targetSection = document.querySelector(href);

        // Si no existe, intentar encontrar por selectores alternativos
        if (!targetSection) {
            const sectionId = href.replace('#', '');
            const alternativeSelectors = [
                `#${sectionId}`,
                `[data-section="${sectionId}"]`,
                `.${sectionId}-section`,
                `section[id*="${sectionId}"]`,
                `section[class*="${sectionId}"]`
            ];

            for (const selector of alternativeSelectors) {
                targetSection = document.querySelector(selector);
                if (targetSection) {
                    console.log(`✅ Sección encontrada con: ${selector}`);
                    break;
                }
            }
        }

        // Si aún no existe, buscar por posición aproximada
        if (!targetSection) {
            if (href === '#home' || href === '#inicio') {
                targetSection = document.querySelector('.hero-section, .main-content, body');
            } else if (href === '#productos') {
                targetSection = document.querySelector('.products-section, [class*="product"]');
            } else if (href === '#quienes-somos') {
                targetSection = document.querySelector('.about-section, [class*="about"]');
            } else if (href === '#contacto') {
                targetSection = document.querySelector('.contact-section, [class*="contact"]');
            }
        }

        if (!targetSection) {
            console.warn(`❌ Sección ${href} no encontrada. Navegando al inicio.`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 80;
        const extraMargin = 30;
        const totalOffset = headerHeight + extraMargin;

        const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = Math.max(0, elementPosition - totalOffset);

        // Scroll suave
        this.animatedScrollTo(offsetPosition, 800);

        // Actualizar URL
        if (history.pushState) {
            history.pushState(null, null, href);
        }

        // Focus para accesibilidad
        setTimeout(() => {
            if (targetSection.setAttribute) {
                targetSection.setAttribute('tabindex', '-1');
                targetSection.focus({ preventScroll: true });
            }
        }, 900);

        console.log(`🎯 Navegación exitosa a ${href}`);
    }

    animatedScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

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

        switch (type) {
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
                    document.body.style.overflow = 'hidden';
                }
                break;
        }

        console.log(`🎯 Menú ${type} abierto`);
    }

    closeMenu(type) {
        if (!this.isOpen) return;

        this.isOpen = false;

        switch (type) {
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
                    document.body.style.overflow = 'auto';
                }
                break;
        }

        console.log(`🎯 Menú ${type} cerrado`);
    }

    closeAllMenus() {
        console.log('🔴 closeAllMenus ejecutado');

        // Cambiar el estado interno PRIMERO
        this.isOpen = false;

        // Cerrar todos los menús específicos
        if (this.orbitalMenu) {
            this.orbitalMenu.setAttribute('aria-expanded', 'false');
            const activator = this.orbitalMenu.querySelector('.orbital-activator');
            if (activator) activator.setAttribute('aria-expanded', 'false');
        }

        if (this.hexMenu) {
            this.hexMenu.setAttribute('aria-expanded', 'false');
            const activator = this.hexMenu.querySelector('.hex-activator');
            if (activator) activator.setAttribute('aria-expanded', 'false');
        }

        if (this.morphingMenu) {
            this.morphingMenu.setAttribute('aria-expanded', 'false');
            const trigger = this.morphingMenu.querySelector('.morphing-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        }

        console.log('✅ Todos los menús cerrados');
    }

    handleMenuItemClick(e, menuItem) {
        // Esta función existe para compatibilidad
        // La navegación real se maneja en handleNavigation()
        this.handleNavigation(menuItem);
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

            switch (e.key) {
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
                        this.closeAllMenus();
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
        window.closeMenus = () => window.menuController.closeAllMenus();

        console.log('🎯 Menu Controller listo y funcional');
    }, 100);
});

// ===== BACKUP SYSTEM - Por si algo falla =====
document.addEventListener('click', function (e) {
    const menuItem = e.target.closest('.orbital-item, .hex-item, .morphing-item');

    if (menuItem && window.menuController && window.menuController.isOpen) {
        console.log('🚨 BACKUP: Detectado click en menú, forzando cierre');

        // Forzar cierre inmediato
        window.menuController.isOpen = false;

        // Quitar aria-expanded de todos los menús
        document.querySelectorAll('.menu-orbital, .menu-hexagonal, .menu-morphing').forEach(menu => {
            menu.setAttribute('aria-expanded', 'false');
        });

        // Quitar aria-expanded de todos los activadores
        document.querySelectorAll('.orbital-activator, .hex-activator, .morphing-trigger').forEach(activator => {
            activator.setAttribute('aria-expanded', 'false');
        });

        // Restaurar body overflow
        document.body.style.overflow = 'auto';

        console.log('🚨 BACKUP: Menú forzadamente cerrado');
    }
});

// Exportar para otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuController;
}

console.log('🔧 Menu Controller COMPLETO cargado - Navegación + cierre automático funcionan');