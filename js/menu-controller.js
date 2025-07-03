/* ===================================================================
   MENU CONTROLLER - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Sistema de control unificado para los 3 tipos de menú
   =================================================================== */

class MenuController {
    constructor() {
        this.currentBreakpoint = this.getBreakpoint();
        this.activeMenu = null;
        this.isOpen = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        // Referencias a los elementos del DOM
        this.orbitalMenu = document.querySelector('.menu-orbital');
        this.hexMenu = document.querySelector('.menu-hexagonal');
        this.morphingMenu = document.querySelector('.menu-morphing');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateActiveMenu();
        this.setupScrollBehavior();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        this.setupContextAwareness();
        
        // Detectar cambios de orientación y redimensionamiento
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });
        
        console.log('🎯 Menu Controller inicializado correctamente');
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
        
        // Actualizar estado de menús
        document.querySelectorAll('.menu-system > div').forEach(menu => {
            menu.style.display = 'none';
        });
        
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
    }
    
    setupEventListeners() {
        // Orbital Menu (Desktop)
        if (this.orbitalMenu) {
            const orbitalActivator = this.orbitalMenu.querySelector('.orbital-activator');
            if (orbitalActivator) {
                orbitalActivator.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleMenu('orbital');
                });
                
                // Hover effects
                orbitalActivator.addEventListener('mouseenter', () => {
                    this.playHoverEffect('orbital');
                });
            }
            
            // Click en items del menú orbital
            this.orbitalMenu.querySelectorAll('.orbital-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    this.handleMenuItemClick(e);
                });
            });
        }
        
        // Hexagonal Menu (Tablet)
        if (this.hexMenu) {
            const hexActivator = this.hexMenu.querySelector('.hex-activator');
            if (hexActivator) {
                hexActivator.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleMenu('hexagonal');
                });
                
                hexActivator.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.playTouchFeedback('hexagonal');
                });
            }
            
            // Click en items del menú hexagonal
            this.hexMenu.querySelectorAll('.hex-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    this.handleMenuItemClick(e);
                });
            });
        }
        
        // Morphing Menu (Mobile)
        if (this.morphingMenu) {
            const morphingTrigger = this.morphingMenu.querySelector('.morphing-trigger');
            if (morphingTrigger) {
                morphingTrigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleMenu('morphing');
                });
                
                morphingTrigger.addEventListener('touchstart', (e) => {
                    this.playTouchFeedback('morphing');
                });
            }
            
            // Click en items del menú morphing
            this.morphingMenu.querySelectorAll('.morphing-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    this.handleMenuItemClick(e);
                });
            });
            
            // Botón de cierre del panel morphing
            const morphingPanel = this.morphingMenu.querySelector('.morphing-panel');
            if (morphingPanel) {
                morphingPanel.addEventListener('click', (e) => {
                    if (e.target === morphingPanel || e.target.matches('.morphing-panel::after')) {
                        this.closeMenu('morphing');
                    }
                });
            }
        }
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-system')) {
                this.closeAllMenus();
            }
        });
        
        // Escape key para cerrar menús
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeAllMenus();
            }
        });
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
                    this.playOpenAnimation('orbital');
                }
                break;
                
            case 'hexagonal':
                if (this.hexMenu) {
                    this.hexMenu.setAttribute('aria-expanded', 'true');
                    const activator = this.hexMenu.querySelector('.hex-activator');
                    if (activator) activator.setAttribute('aria-expanded', 'true');
                    this.playOpenAnimation('hexagonal');
                }
                break;
                
            case 'morphing':
                if (this.morphingMenu) {
                    this.morphingMenu.setAttribute('aria-expanded', 'true');
                    const trigger = this.morphingMenu.querySelector('.morphing-trigger');
                    if (trigger) trigger.setAttribute('aria-expanded', 'true');
                    this.playOpenAnimation('morphing');
                    // Prevenir scroll del body cuando el menú está abierto
                    document.body.style.overflow = 'hidden';
                }
                break;
        }
        
        // Anunciar cambio para lectores de pantalla
        this.announceMenuState('abierto');
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
                    this.playCloseAnimation('orbital');
                }
                break;
                
            case 'hexagonal':
                if (this.hexMenu) {
                    this.hexMenu.setAttribute('aria-expanded', 'false');
                    const activator = this.hexMenu.querySelector('.hex-activator');
                    if (activator) activator.setAttribute('aria-expanded', 'false');
                    this.playCloseAnimation('hexagonal');
                }
                break;
                
            case 'morphing':
                if (this.morphingMenu) {
                    this.morphingMenu.setAttribute('aria-expanded', 'false');
                    const trigger = this.morphingMenu.querySelector('.morphing-trigger');
                    if (trigger) trigger.setAttribute('aria-expanded', 'false');
                    this.playCloseAnimation('morphing');
                    // Restaurar scroll del body
                    document.body.style.overflow = 'auto';
                }
                break;
        }
        
        // Anunciar cambio para lectores de pantalla
        this.announceMenuState('cerrado');
    }
    
    closeAllMenus() {
        if (this.orbitalMenu) this.closeMenu('orbital');
        if (this.hexMenu) this.closeMenu('hexagonal');
        if (this.morphingMenu) this.closeMenu('morphing');
    }
    
    handleMenuItemClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            // Cerrar menú con animación
            this.closeAllMenus();
            
            // Smooth scroll a la sección CON OFFSET para mostrar el título
            setTimeout(() => {
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    // Calcular offset del header + margen extra
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    const extraMargin = 20; // Margen adicional para que se vea bien el título
                    const totalOffset = headerHeight + extraMargin;
                    
                    // Posición del elemento menos el offset
                    const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - totalOffset;
                    
                    // Scroll suave a la posición correcta
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar URL sin recargar página
                    history.pushState(null, null, href);
                    
                    // Focus en la sección para accesibilidad
                    setTimeout(() => {
                        targetSection.focus({ preventScroll: true });
                    }, 500);
                }
            }, 300);
        }
        
        // Analytics tracking
        this.trackMenuInteraction(e.currentTarget);
    }
    
    playOpenAnimation(type) {
        switch(type) {
            case 'orbital':
                // Animación de rotación y escala para el activador
                const orbitalActivator = this.orbitalMenu?.querySelector('.orbital-activator');
                if (orbitalActivator) {
                    orbitalActivator.style.transform = 'scale(0.9) rotate(180deg)';
                }
                
                // Animación secuencial de los items orbitales
                const orbitalItems = this.orbitalMenu?.querySelectorAll('.orbital-item');
                orbitalItems?.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.visibility = 'visible';
                        item.style.transform = 'scale(1)';
                    }, index * 100);
                });
                break;
                
            case 'hexagonal':
                // Animación de rotación hexagonal
                const hexShape = this.hexMenu?.querySelector('.hex-shape');
                if (hexShape) {
                    hexShape.style.transform = 'scale(0.8) rotate(180deg)';
                }
                
                // Expansión elástica de los items hexagonales
                const hexItems = this.hexMenu?.querySelectorAll('.hex-item');
                hexItems?.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.visibility = 'visible';
                        item.style.animation = 'hexExpand 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
                    }, index * 60);
                });
                break;
                
            case 'morphing':
                // Transformación de dots en formación circular
                const dots = this.morphingMenu?.querySelectorAll('.dot');
                dots?.forEach((dot, index) => {
                    dot.style.animationDelay = `${index * 0.5}s`;
                });
                
                // Deslizamiento del panel
                const panel = this.morphingMenu?.querySelector('.morphing-panel');
                if (panel) {
                    panel.style.right = '0';
                }
                
                // Animación de entrada de items con efecto typewriter
                const morphingItems = this.morphingMenu?.querySelectorAll('.morphing-item');
                morphingItems?.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                        item.style.animation = 'morphingEntrance 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
                    }, index * 100);
                });
                break;
        }
        
        // Efecto de sonido opcional
        this.playMenuSound('open');
    }
    
    playCloseAnimation(type) {
        switch(type) {
            case 'orbital':
                const orbitalActivator = this.orbitalMenu?.querySelector('.orbital-activator');
                if (orbitalActivator) {
                    orbitalActivator.style.transform = 'scale(1) rotate(0deg)';
                }
                
                const orbitalItems = this.orbitalMenu?.querySelectorAll('.orbital-item');
                orbitalItems?.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.visibility = 'hidden';
                        item.style.transform = 'scale(0.3)';
                    }, index * 50);
                });
                break;
                
            case 'hexagonal':
                const hexShape = this.hexMenu?.querySelector('.hex-shape');
                if (hexShape) {
                    hexShape.style.transform = 'scale(1) rotate(0deg)';
                }
                
                const hexItems = this.hexMenu?.querySelectorAll('.hex-item');
                hexItems?.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.animation = 'hexCollapse 0.4s ease-in forwards';
                    }, index * 40);
                });
                break;
                
            case 'morphing':
                const dots = this.morphingMenu?.querySelectorAll('.dot');
                dots?.forEach(dot => {
                    dot.style.animation = 'none';
                });
                
                const panel = this.morphingMenu?.querySelector('.morphing-panel');
                if (panel) {
                    panel.style.right = '-100%';
                }
                
                const morphingItems = this.morphingMenu?.querySelectorAll('.morphing-item');
                morphingItems?.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.animation = 'morphingExit 0.4s ease-in forwards';
                    }, index * 30);
                });
                break;
        }
        
        // Efecto de sonido opcional
        this.playMenuSound('close');
    }
    
    playHoverEffect(type) {
        switch(type) {
            case 'orbital':
                // Efecto de partículas en hover
                this.createParticleEffect('orbital');
                break;
            case 'hexagonal':
                // Efecto de glow hexagonal
                this.createGlowEffect('hexagonal');
                break;
            case 'morphing':
                // Efecto de morphing en hover
                this.createMorphingEffect();
                break;
        }
    }
    
    playTouchFeedback(type) {
        // Vibración táctil en dispositivos compatibles
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
        
        // Efecto visual de feedback táctil
        const activators = {
            hexagonal: this.hexMenu?.querySelector('.hex-activator'),
            morphing: this.morphingMenu?.querySelector('.morphing-trigger')
        };
        
        const activator = activators[type];
        if (activator) {
            activator.style.transform = 'scale(0.95)';
            setTimeout(() => {
                activator.style.transform = '';
            }, 150);
        }
    }
    
    setupScrollBehavior() {
        // SCROLL BEHAVIOR COMPLETAMENTE DESHABILITADO
        // Los menús mantienen tamaño fijo siempre
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        const updateMenuOnScroll = () => {
            const currentScrollY = window.scrollY;
            const header = document.querySelector('.header');
            
            if (currentScrollY > 100) {
                header?.classList.add('scrolled');
                // NO llamar updateMenuSizeOnScroll - ELIMINADO
            } else {
                header?.classList.remove('scrolled');
                // NO llamar updateMenuSizeOnScroll - ELIMINADO
            }
            
            // Auto-hide en scroll hacia abajo (solo en móvil)
            if (this.currentBreakpoint === 'mobile') {
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
                requestAnimationFrame(updateMenuOnScroll);
                ticking = true;
            }
        });
    }
    
    updateMenuSizeOnScroll(isScrolled) {
        // DESHABILITADO - No cambiar tamaño en scroll
        // Los menús mantienen siempre el mismo tamaño
        return;
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
        // Navegación por teclado para accesibilidad
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            const currentMenu = this.activeMenu;
            if (!currentMenu) return;
            
            const menuItems = currentMenu.querySelectorAll('[role="menuitem"], .orbital-item, .hex-item, .morphing-item');
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
                
                panel.addEventListener('touchmove', (e) => {
                    if (!this.isOpen || this.currentBreakpoint !== 'mobile') return;
                    
                    const touchX = e.touches[0].clientX;
                    const deltaX = touchX - this.touchStartX;
                    
                    // Swipe hacia la derecha para cerrar
                    if (deltaX > 50) {
                        panel.style.transform = `translateX(${Math.min(deltaX - 50, 100)}px)`;
                    }
                });
                
                panel.addEventListener('touchend', (e) => {
                    if (!this.isOpen || this.currentBreakpoint !== 'mobile') return;
                    
                    const touchX = e.changedTouches[0].clientX;
                    const deltaX = touchX - this.touchStartX;
                    
                    if (deltaX > 100) {
                        this.closeMenu('morphing');
                    } else {
                        panel.style.transform = '';
                    }
                });
            }
        }
    }
    
    setupContextAwareness() {
        // Cambiar colores del menú según la sección actual
        const updateMenuContext = () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100;
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.id;
                }
            });
            
            // Actualizar colores del menú según la sección
            this.updateMenuTheme(currentSection);
        };
        
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateMenuContext);
                ticking = true;
            }
        });
    }
    
    updateMenuTheme(sectionId) {
        const themes = {
            'home': '--accent-purple',
            'productos': '--accent-green',
            'quienes-somos': '--accent-pink',
            'contacto': '--whatsapp-green'
        };
        
        const currentTheme = themes[sectionId] || '--accent-purple';
        document.documentElement.style.setProperty('--menu-active-color', `var(${currentTheme})`);
    }
    
    handleResize() {
        const newBreakpoint = this.getBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.closeAllMenus();
            this.currentBreakpoint = newBreakpoint;
            this.updateActiveMenu();
        }
    }
    
    createParticleEffect(type) {
        // Crear efecto de partículas para el menú orbital
        const activator = this.orbitalMenu?.querySelector('.orbital-activator');
        if (!activator) return;
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'menu-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--accent-purple);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0.8;
                z-index: 1000;
            `;
            
            activator.appendChild(particle);
            
            // Animación de partícula
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 0.8
                },
                { 
                    transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
    
    createGlowEffect(type) {
        // Crear efecto de resplandor para el menú hexagonal
        const activator = this.hexMenu?.querySelector('.hex-activator');
        if (!activator) return;
        
        activator.style.filter = 'drop-shadow(0 0 20px rgba(189, 147, 249, 0.6))';
        
        setTimeout(() => {
            activator.style.filter = '';
        }, 500);
    }
    
    createMorphingEffect() {
        // Crear efecto de morphing para móvil
        const dots = this.morphingMenu?.querySelectorAll('.dot');
        
        dots?.forEach((dot, index) => {
            dot.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) scale(${1 + Math.random() * 0.5})`;
            
            setTimeout(() => {
                dot.style.transform = '';
            }, 300);
        });
    }
    
    playMenuSound(action) {
        // SONIDOS DESHABILITADOS - Removido porque es fastidioso
        return;
    }
    
    announceMenuState(state) {
        // Anunciar cambios para lectores de pantalla
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Menú de navegación ${state}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    trackMenuInteraction(element) {
        // Tracking de analytics para interacciones del menú
        const menuType = this.currentBreakpoint;
        const itemText = element.textContent.trim();
        const itemHref = element.getAttribute('href');
        
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'menu_interaction', {
                'menu_type': menuType,
                'menu_item': itemText,
                'menu_destination': itemHref
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: itemText,
                content_category: 'navigation'
            });
        }
        
        console.log(`📊 Menu interaction: ${menuType} -> ${itemText}`);
    }
    
    // Método público para abrir/cerrar menú desde otros scripts
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
    
    // Método público para obtener el estado del menú
    getState() {
        return {
            isOpen: this.isOpen,
            breakpoint: this.currentBreakpoint,
            activeMenu: this.activeMenu?.className
        };
    }
}

// Inicializar el controlador de menús cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.menuController = new MenuController();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuController;
}