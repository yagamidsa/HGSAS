/* ===================================================================
   MOBILE MENU FORCE NAVIGATION - Forzar navegación en mobile menu
   =================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('mobileNavigation');
    const overlay = document.querySelector('.mobile-overlay');
    const navLinks = document.querySelectorAll('.mobile-nav-link');
    
    console.log('📱 Mobile menu FORCE NAVIGATION inicializando...');
    
    if (!toggle || !nav) {
        console.error('❌ Elementos del menú no encontrados');
        return;
    }
    
    // FUNCIONES DE MENÚ
    function closeMenu() {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        console.log('📱 Menú cerrado');
    }
    
    function openMenu() {
        toggle.classList.add('active');
        nav.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.classList.add('no-scroll');
        console.log('📱 Menú abierto');
    }
    
    function toggleMenu() {
        const isOpen = nav.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // NAVEGACIÓN FORZADA QUE SOBRESCRIBE TODO
    function forceNavigateToSection(href) {
        console.log('🚀 FORZANDO navegación a:', href);
        
        // Mapeo de enlaces a IDs reales (por si acaso)
        const sectionMap = {
            '#inicio': 'home',
            '#home': 'home',
            '#productos': 'productos', 
            '#quienes-somos': 'quienes-somos',
            '#contacto': 'contacto'
        };
        
        let targetId = href.substring(1); // Quitar #
        
        // Usar mapeo si existe
        if (sectionMap[href]) {
            targetId = sectionMap[href];
        }
        
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            console.log('✅ Sección encontrada:', targetId);
            
            // Calcular posición
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = targetSection.offsetTop - headerHeight - 20;
            
            // SCROLL FORZADO - NO usar behavior smooth para evitar conflictos
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // También probar método alternativo
            setTimeout(() => {
                window.scrollTo(0, targetPosition);
            }, 100);
            
            // Actualizar URL
            if (history.pushState) {
                history.pushState(null, null, href);
            }
            
            // Actualizar enlaces activos
            updateActiveLinks(href);
            
            console.log('📍 Navegación completada a:', targetId);
            
        } else {
            console.error('❌ Sección no encontrada:', targetId);
            // Log de todas las secciones disponibles
            const allSections = Array.from(document.querySelectorAll('section[id]')).map(s => s.id);
            console.log('📋 Secciones disponibles:', allSections);
        }
    }
    
    function updateActiveLinks(activeHref) {
        // Remover active de todos
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Agregar active al correcto
        document.querySelectorAll(`a[href="${activeHref}"]`).forEach(link => {
            link.classList.add('active');
        });
    }
    
    // EVENT LISTENERS PRINCIPALES
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // Cerrar con overlay
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMenu();
            toggle.focus();
        }
    });
    
    // NAVEGACIÓN MÓVIL - CAPTURAR ANTES QUE main.js
    navLinks.forEach(link => {
        // Usar 'mousedown' y 'touchstart' para capturar ANTES del click
        ['mousedown', 'touchstart'].forEach(eventType => {
            link.addEventListener(eventType, function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                const href = this.getAttribute('href');
                console.log(`🔗 ${eventType} en enlace mobile:`, href);
                
                if (href && href.startsWith('#')) {
                    // Cerrar menú inmediatamente
                    closeMenu();
                    
                    // Navegación con delay
                    setTimeout(() => {
                        forceNavigateToSection(href);
                    }, 200);
                }
            }, { capture: true, passive: false });
        });
        
        // También capturar click normal
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const href = this.getAttribute('href');
            
            
            if (href && href.startsWith('#')) {
                closeMenu();
                setTimeout(() => {
                    forceNavigateToSection(href);
                }, 200);
            }
        }, { capture: true });
    });
    
    // Cerrar al cambiar tamaño de pantalla
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767 && nav.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // FUNCIÓN DE DEBUGGING
    window.testMobileNavigation = function() {
        console.log('🧪 TESTING MOBILE NAVIGATION...');
        
        const testLinks = ['#inicio', '#productos', '#quienes-somos', '#contacto'];
        
        testLinks.forEach(href => {
            const targetId = href.substring(1);
            const section = document.getElementById(targetId) || document.getElementById(targetId === 'inicio' ? 'home' : targetId);
            console.log(`${href} →`, section ? '✅ EXISTE' : '❌ NO EXISTE');
        });
        
        console.log('📱 Mobile links encontrados:', navLinks.length);
        console.log('🔧 Toggle funcional:', !!toggle);
        console.log('📋 Navigation panel:', !!nav);
    };
    
    
    // Test automático
    setTimeout(() => {
        if (typeof window.testMobileNavigation === 'function') {
            window.testMobileNavigation();
        }
    }, 1000);
    
    // Exponer funciones globalmente
    window.mobileMenu = {
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu,
        navigate: forceNavigateToSection,
        isOpen: () => nav.classList.contains('active')
    };
});