/* ===================================================================
   MORPHING ANIMATIONS - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Sistema de animaciones de transformación para elementos del sitio
   =================================================================== */

class MorphingAnimations {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.morphingElements = [];
        this.isReducedMotion = this.checkReducedMotion();
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.findMorphingElements();
        this.setupMorphingMenu();
        this.setupProductCards();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        
        console.log('🎭 Morphing Animations inicializadas');
    }
    
    checkReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    setupIntersectionObserver() {
        if (this.isReducedMotion) return;
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1.0]
        };
        
        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const animationType = element.dataset.morphType || 'fadeInUp';
                
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    this.triggerMorphing(element, animationType);
                } else if (!entry.isIntersecting) {
                    this.resetMorphing(element);
                }
            });
        }, observerOptions);
    }
    
    findMorphingElements() {
        // Elementos que se animan al hacer scroll
        const animatedElements = document.querySelectorAll('[data-morph-type]');
        
        animatedElements.forEach(element => {
            if (!this.isReducedMotion) {
                this.scrollObserver.observe(element);
            }
            this.morphingElements.push(element);
        });
        
        console.log(`🎯 ${animatedElements.length} elementos con morphing encontrados`);
    }
    
    setupMorphingMenu() {
        const morphingTrigger = document.querySelector('.morphing-trigger');
        const morphingPanel = document.querySelector('.morphing-panel');
        const morphingDots = document.querySelector('.morphing-dots');
        
        if (!morphingTrigger || !morphingPanel) return;
        
        let isOpen = false;
        
        // Estados de los puntos
        const dotStates = {
            closed: 'dots-closed',
            hover: 'dots-triangle',
            open: 'dots-circle'
        };
        
        // Click en el trigger
        morphingTrigger.addEventListener('click', () => {
            isOpen = !isOpen;
            this.morphMenuState(isOpen, morphingDots, morphingPanel, morphingTrigger);
        });
        
        // Hover effects
        morphingTrigger.addEventListener('mouseenter', () => {
            if (!isOpen && !this.isReducedMotion) {
                morphingDots.className = `morphing-dots ${dotStates.hover}`;
            }
        });
        
        morphingTrigger.addEventListener('mouseleave', () => {
            if (!isOpen) {
                morphingDots.className = `morphing-dots ${dotStates.closed}`;
            }
        });
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                isOpen = false;
                this.morphMenuState(false, morphingDots, morphingPanel, morphingTrigger);
            }
        });
        
        // Cerrar al hacer click fuera
        document.addEventListener('click', (e) => {
            if (isOpen && !morphingTrigger.contains(e.target) && !morphingPanel.contains(e.target)) {
                isOpen = false;
                this.morphMenuState(false, morphingDots, morphingPanel, morphingTrigger);
            }
        });
    }
    
    morphMenuState(isOpen, dotsElement, panelElement, triggerElement) {
        if (this.isReducedMotion) {
            // Versión sin animaciones
            panelElement.style.display = isOpen ? 'block' : 'none';
            triggerElement.setAttribute('aria-expanded', isOpen);
            return;
        }
        
        const dotStates = {
            closed: 'dots-closed',
            hover: 'dots-triangle',
            open: 'dots-circle'
        };
        
        if (isOpen) {
            // Abrir menú
            dotsElement.className = `morphing-dots ${dotStates.open}`;
            panelElement.classList.add('panel-open');
            panelElement.classList.remove('panel-closed');
            triggerElement.setAttribute('aria-expanded', 'true');
            
            // Animar items del menú
            const items = panelElement.querySelectorAll('.morphing-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.animation = `typewriter 0.5s ease forwards`;
                    item.style.animationDelay = `${index * 0.1}s`;
                }, 200);
            });
            
        } else {
            // Cerrar menú
            dotsElement.className = `morphing-dots ${dotStates.closed}`;
            panelElement.classList.add('panel-closed');
            panelElement.classList.remove('panel-open');
            triggerElement.setAttribute('aria-expanded', 'false');
            
            // Reset items
            const items = panelElement.querySelectorAll('.morphing-item');
            items.forEach(item => {
                item.style.animation = '';
                item.style.animationDelay = '';
            });
        }
    }
    
    setupProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const openButton = card.querySelector('.product-open-catalog');
            
            if (!openButton) return;
            
            // Efecto hover en la card
            card.addEventListener('mouseenter', () => {
                if (!this.isReducedMotion) {
                    this.morphProductCard(card, 'hover');
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!this.isReducedMotion) {
                    this.morphProductCard(card, 'normal');
                }
            });
            
            // Click para abrir catálogo
            openButton.addEventListener('click', () => {
                this.morphProductCard(card, 'opening');
            });
        });
    }
    
    morphProductCard(card, state) {
        if (this.isReducedMotion) return;
        
        const image = card.querySelector('.product-image');
        const content = card.querySelector('.product-content');
        
        switch (state) {
            case 'hover':
                card.style.transform = 'translateY(-10px) scale(1.02)';
                if (image) image.style.filter = 'brightness(1.1)';
                break;
                
            case 'normal':
                card.style.transform = 'translateY(0) scale(1)';
                if (image) image.style.filter = 'brightness(1)';
                break;
                
            case 'opening':
                card.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 200);
                break;
        }
    }
    
    setupScrollAnimations() {
        // Elementos con animación de texto reveal
        const textElements = document.querySelectorAll('.text-reveal');
        
        textElements.forEach(element => {
            if (!this.isReducedMotion) {
                element.dataset.morphType = 'textReveal';
                this.scrollObserver.observe(element);
            }
        });
        
        // Elementos con fade in
        const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
        
        fadeElements.forEach(element => {
            if (!this.isReducedMotion) {
                element.dataset.morphType = element.classList.contains('fade-in-left') ? 'fadeInLeft' :
                                          element.classList.contains('fade-in-right') ? 'fadeInRight' :
                                          'fadeInUp';
                this.scrollObserver.observe(element);
            } else {
                element.style.opacity = '1';
                element.style.transform = 'none';
            }
        });
    }
    
    setupHoverEffects() {
        // Botones con efecto ripple
        const rippleButtons = document.querySelectorAll('.btn, .whatsapp-float, .back-to-top');
        
        rippleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!this.isReducedMotion) {
                    this.createRippleEffect(e, button);
                }
            });
        });
        
        // Enlaces con efectos de hover
        const hoverLinks = document.querySelectorAll('.orbital-item, .hex-item, .morphing-item');
        
        hoverLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (!this.isReducedMotion) {
                    this.morphLinkHover(link, true);
                }
            });
            
            link.addEventListener('mouseleave', () => {
                if (!this.isReducedMotion) {
                    this.morphLinkHover(link, false);
                }
            });
        });
    }
    
    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    morphLinkHover(link, isHover) {
        if (isHover) {
            link.style.transform = 'scale(1.1)';
            link.style.filter = 'brightness(1.2)';
        } else {
            link.style.transform = 'scale(1)';
            link.style.filter = 'brightness(1)';
        }
    }
    
    triggerMorphing(element, animationType) {
        if (this.isReducedMotion) return;
        
        element.classList.add('animate');
        
        switch (animationType) {
            case 'fadeInUp':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;
                
            case 'fadeInLeft':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
                
            case 'fadeInRight':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
                
            case 'textReveal':
                element.classList.add('animate');
                break;
                
            case 'scaleIn':
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                break;
        }
    }
    
    resetMorphing(element) {
        if (this.isReducedMotion) return;
        
        element.classList.remove('animate');
        
        // Reset styles based on original animation
        const animationType = element.dataset.morphType;
        
        switch (animationType) {
            case 'fadeInUp':
                element.style.opacity = '0';
                element.style.transform = 'translateY(50px)';
                break;
                
            case 'fadeInLeft':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-50px)';
                break;
                
            case 'fadeInRight':
                element.style.opacity = '0';
                element.style.transform = 'translateX(50px)';
                break;
                
            case 'scaleIn':
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8)';
                break;
        }
    }
    
    // ===== MÉTODOS PÚBLICOS =====
    
    addMorphingElement(element, animationType = 'fadeInUp') {
        if (!element) return;
        
        element.dataset.morphType = animationType;
        
        if (!this.isReducedMotion) {
            this.scrollObserver.observe(element);
        }
        
        this.morphingElements.push(element);
    }
    
    removeMorphingElement(element) {
        if (!element) return;
        
        if (this.scrollObserver) {
            this.scrollObserver.unobserve(element);
        }
        
        const index = this.morphingElements.indexOf(element);
        if (index > -1) {
            this.morphingElements.splice(index, 1);
        }
    }
    
    pauseAnimations() {
        this.isReducedMotion = true;
        console.log('⏸️ Animaciones pausadas');
    }
    
    resumeAnimations() {
        this.isReducedMotion = this.checkReducedMotion();
        console.log('▶️ Animaciones reanudadas');
    }
    
    getStats() {
        return {
            totalElements: this.morphingElements.length,
            isReducedMotion: this.isReducedMotion,
            observersActive: this.observers.size
        };
    }
}

// ===== ESTILOS CSS DINÁMICOS =====
const morphingStyles = document.createElement('style');
morphingStyles.textContent = `
    /* Ripple Effect */
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        pointer-events: none;
        animation: ripple 0.6s ease-out;
        z-index: 1;
    }
    
    /* Typewriter Effect */
    @keyframes typewriter {
        from {
            width: 0;
            opacity: 0;
        }
        to {
            width: 100%;
            opacity: 1;
        }
    }
    
    /* Estados de los puntos del menú móvil */
    .morphing-dots {
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .dots-closed .dot {
        transform: translateY(0) scale(1);
    }
    
    .dots-triangle .dot-1 {
        transform: translateY(-8px) translateX(-4px) scale(1.1);
    }
    
    .dots-triangle .dot-3 {
        transform: translateY(-8px) translateX(4px) scale(1.1);
    }
    
    .dots-circle .dot {
        border-radius: 50%;
        animation: pulse 2s infinite;
    }
    
    .dots-circle .dot-1 {
        transform: translateX(-12px);
    }
    
    .dots-circle .dot-3 {
        transform: translateX(12px);
    }
    
    /* Panel del menú móvil */
    .morphing-panel {
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .panel-open {
        transform: translateX(0);
        opacity: 1;
        visibility: visible;
    }
    
    .panel-closed {
        transform: translateX(100%);
        opacity: 0;
        visibility: hidden;
    }
    
    /* Animaciones de scroll */
    .fade-in-up {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .fade-in-left {
        opacity: 0;
        transform: translateX(-50px);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .fade-in-right {
        opacity: 0;
        transform: translateX(50px);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    /* Hover effects para enlaces */
    .orbital-item,
    .hex-item,
    .morphing-item {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
        .morphing-dots,
        .morphing-panel,
        .fade-in-up,
        .fade-in-left,
        .fade-in-right,
        .orbital-item,
        .hex-item,
        .morphing-item {
            transition: none !important;
            animation: none !important;
        }
    }
`;
document.head.appendChild(morphingStyles);

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    window.morphingAnimations = new MorphingAnimations();
    
    // Funciones globales para testing
    window.pauseAnimations = () => window.morphingAnimations.pauseAnimations();
    window.resumeAnimations = () => window.morphingAnimations.resumeAnimations();
    window.morphingStats = () => window.morphingAnimations.getStats();
});

// Exportar para otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MorphingAnimations;
}

/* ===== COMANDOS DE TESTING =====

// Pausar animaciones
pauseAnimations()

// Reanudar animaciones
resumeAnimations()

// Ver estadísticas
morphingStats()

// Ver controlador
morphingAnimations

===============================================*/