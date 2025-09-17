/* ===================================================================
   WHATSAPP INTEGRATION - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Sistema avanzado de WhatsApp con mensajes predefinidos
   =================================================================== */

class WhatsAppController {
    constructor() {
        // Configuración del negocio
        this.businessPhone = '573222284212'; 
        this.businessName = 'COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S';
        this.businessHours = {
            start: 8,  // 8:00 AM
            end: 18,   // 6:00 PM
            days: [1, 2, 3, 4, 5] // Lunes a Viernes (1=Lunes, 0=Domingo)
        };
        
        // Estados
        this.isBusinessHours = false;
        this.isMobile = false;
        this.clickCount = 0;
        
        this.init();
    }
    
    init() {
        this.detectDevice();
        this.checkBusinessHours();
        this.setupEventListeners();
        this.enhanceFloatingButton();
        this.setupHourlyCheck();
        
        console.log('📱 WhatsApp Controller iniciado');
        console.log(`📱 Dispositivo: ${this.isMobile ? 'Móvil' : 'Desktop'}`);
        console.log(`🕒 Horario comercial: ${this.isBusinessHours ? 'ABIERTO' : 'CERRADO'}`);
    }
    
    detectDevice() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    checkBusinessHours() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay();
        
        this.isBusinessHours = 
            this.businessHours.days.includes(currentDay) &&
            currentHour >= this.businessHours.start &&
            currentHour < this.businessHours.end;
    }
    
    setupEventListeners() {
        // Botones WhatsApp en catálogos
        document.querySelectorAll('.btn-whatsapp').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleWhatsAppClick(button);
            });
        });
        
        // Botón flotante
        const floatingButton = document.querySelector('.whatsapp-float');
        if (floatingButton) {
            floatingButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFloatingButtonClick();
            });
        }
        
        // Otros enlaces de WhatsApp en la página
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            if (!link.classList.contains('btn-whatsapp') && !link.classList.contains('whatsapp-float')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleGenericWhatsAppClick(link);
                });
            }
        });
    }
    
    handleWhatsAppClick(button) {
        // Obtener el href original
        const originalHref = button.getAttribute('href');
        const productName = this.extractProductName(button);
        
        // Validar número de teléfono
        if (!this.validatePhoneNumber()) {
            this.showPhoneError();
            return;
        }
        
        // Crear URL optimizada
        const optimizedUrl = this.createOptimizedUrl(originalHref, {
            source: 'catalog',
            product: productName,
            timestamp: Date.now()
        });
        
        // Tracking
        this.trackWhatsAppClick('product_catalog', productName);
        
        // Abrir WhatsApp
        this.openWhatsApp(optimizedUrl);
        
        // Efecto visual en el botón
        this.addClickEffect(button);
    }
    
    handleFloatingButtonClick() {
        const defaultMessage = this.createFloatingButtonMessage();
        
        // Validar número
        if (!this.validatePhoneNumber()) {
            this.showPhoneError();
            return;
        }
        
        const url = this.createWhatsAppUrl(defaultMessage, {
            source: 'floating_button',
            timestamp: Date.now()
        });
        
        // Tracking
        this.trackWhatsAppClick('floating_button', 'general_inquiry');
        
        // Abrir WhatsApp
        this.openWhatsApp(url);
        
        // Efecto visual
        this.addFloatingButtonEffect();
    }
    
    handleGenericWhatsAppClick(link) {
        const href = link.getAttribute('href');
        
        // Tracking
        this.trackWhatsAppClick('generic_link', 'unknown');
        
        // Abrir directamente
        this.openWhatsApp(href);
    }
    
    extractProductName(button) {
        // Buscar en el texto del botón
        const buttonText = button.textContent;
        if (buttonText.includes('Rosado')) return 'Rosado';
        if (buttonText.includes('Cereza')) return 'Cereza';
        if (buttonText.includes('Manzana')) return 'Manzana';
        if (buttonText.includes('Uva')) return 'Uva';
        
        // Buscar en el catálogo padre
        const catalog = button.closest('.product-catalog');
        if (catalog) {
            const catalogTitle = catalog.querySelector('h3');
            if (catalogTitle) {
                const titleText = catalogTitle.textContent;
                if (titleText.includes('Rosado')) return 'Rosado';
                if (titleText.includes('Cereza')) return 'Cereza';
                if (titleText.includes('Manzana')) return 'Manzana';
                if (titleText.includes('Uva')) return 'Uva';
            }
        }
        
        return 'Producto AJEDREZ';
    }
    
    createFloatingButtonMessage() {
        const greeting = this.getGreeting();
        const businessStatus = this.isBusinessHours ? 
            'Estamos en horario de atención comercial.' : 
            'Estamos fuera del horario comercial, pero te responderemos pronto.';
            
        return `${greeting} Me interesa conocer más sobre los productos AJEDREZ. ${businessStatus}`;
    }
    
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    }
    
    createOptimizedUrl(originalHref, metadata = {}) {
        try {
            const url = new URL(originalHref);
            
            // Agregar metadata como parámetros (para tracking interno)
            Object.keys(metadata).forEach(key => {
                url.searchParams.set(`_${key}`, metadata[key]);
            });
            
            return url.toString();
        } catch (error) {
            console.warn('Error optimizando URL de WhatsApp:', error);
            return originalHref;
        }
    }
    
    createWhatsAppUrl(message, metadata = {}) {
        const baseUrl = `https://wa.me/${this.businessPhone}`;
        const encodedMessage = encodeURIComponent(message);
        
        let url = `${baseUrl}?text=${encodedMessage}`;
        
        // Agregar metadata
        Object.keys(metadata).forEach(key => {
            url += `&_${key}=${encodeURIComponent(metadata[key])}`;
        });
        
        return url;
    }
    
    validatePhoneNumber() {
        // TEMPORAL: Desactivar validación para testing
        return true;
        
        // Código original (comentado)
        /*
        const hasValidPhone = this.businessPhone && 
                            this.businessPhone.length >= 8 && 
                            !this.businessPhone.includes('X') &&
                            /\d/.test(this.businessPhone);
        
        const isDevelopment = this.businessPhone.includes('TEST') || 
                            window.location.hostname === 'localhost';
        
        return hasValidPhone || isDevelopment;
        */
    }
    
    showPhoneError() {
        // Solo mostrar una notificación sutil
        this.showSubtleNotification('📱 Servicio temporalmente no disponible', 'info');
        console.warn('⚠️ Número de WhatsApp necesita configuración');
    }
    
    showSubtleNotification(message, type = 'info') {
        // Verificar si ya existe una notificación
        const existing = document.querySelector('.subtle-notification');
        if (existing) {
            existing.remove();
        }
        
        // Crear notificación sutil
        const notification = document.createElement('div');
        notification.className = 'subtle-notification';
        
        const colors = {
            info: { bg: 'rgba(33, 150, 243, 0.9)', border: '#2196F3' },
            success: { bg: 'rgba(76, 175, 80, 0.9)', border: '#4CAF50' },
            warning: { bg: 'rgba(255, 152, 0, 0.9)', border: '#FF9800' }
        };
        
        const color = colors[type] || colors.info;
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Cerrar">&times;</button>
            </div>
        `;
        
        // Estilos sutiles y elegantes
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${color.bg};
            backdrop-filter: blur(10px);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            border-left: 3px solid ${color.border};
            z-index: 8999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-size: 0.9rem;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        // Estilo del contenido
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        // Estilo del botón cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s ease;
            padding: 0;
            margin-left: auto;
        `;
        
        closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Función para cerrar
        const closeNotification = () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };
        
        // Cerrar al hacer click en el botón
        closeBtn.addEventListener('click', closeNotification);
        
        // Auto-cerrar después de 4 segundos
        setTimeout(closeNotification, 4000);
    }
    
    openWhatsApp(url) {
        // SIEMPRE abrir en nueva pestaña/ventana para no perder el sitio web
        try {
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer,width=800,height=600');
            
            // Si el popup es bloqueado, intentar abrir de otra forma
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                // Crear un enlace temporal y hacer click
                const tempLink = document.createElement('a');
                tempLink.href = url;
                tempLink.target = '_blank';
                tempLink.rel = 'noopener noreferrer';
                tempLink.style.display = 'none';
                
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            }
            
            this.clickCount++;
            console.log(`📱 WhatsApp abierto en nueva pestaña (click #${this.clickCount})`);
            
        } catch (error) {
            console.error('Error abriendo WhatsApp:', error);
            this.showSubtleNotification('❌ No se pudo abrir WhatsApp', 'warning');
        }
    }
    
    addClickEffect(button) {
        // Efecto de pulso en el botón
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 0.15s ease';
        
        setTimeout(() => {
            button.style.transform = 'scale(1.05)';
        }, 150);
        
        setTimeout(() => {
            button.style.transform = '';
        }, 300);
        
        // Crear efecto de ondas
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    addFloatingButtonEffect() {
        const floatingButton = document.querySelector('.whatsapp-float');
        if (floatingButton) {
            // Efecto de rebote
            floatingButton.style.animation = 'bounce 0.6s ease';
            
            setTimeout(() => {
                floatingButton.style.animation = '';
            }, 600);
        }
    }
    
    enhanceFloatingButton() {
        const floatingButton = document.querySelector('.whatsapp-float');
        if (!floatingButton) return;
        
        // Agregar indicador de estado
        this.addStatusIndicator(floatingButton);
        
        // Agregar tooltip dinámico
        this.addDynamicTooltip(floatingButton);
        
        // Efecto de hover mejorado
        this.enhanceHoverEffect(floatingButton);
    }
    
    addStatusIndicator(button) {
        const statusDot = document.createElement('div');
        statusDot.className = 'whatsapp-status-dot';
        statusDot.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${this.isBusinessHours ? '#4CAF50' : '#FF9800'};
            border: 2px solid white;
            box-shadow: 0 0 8px rgba(0,0,0,0.3);
            z-index: 2;
        `;
        
        button.appendChild(statusDot);
    }
    
    addDynamicTooltip(button) {
        const tooltip = document.createElement('div');
        tooltip.className = 'whatsapp-tooltip';
        
        const tooltipText = this.isBusinessHours ? 
            'Estamos en línea - ¡Escríbenos!' : 
            'Fuera de horario - Te responderemos pronto';
            
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            bottom: 120%;
            right: 0;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 3;
        `;
        
        button.appendChild(tooltip);
        
        // Mostrar/ocultar tooltip en hover
        button.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
            tooltip.style.transform = 'translateY(-5px)';
        });
        
        button.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            tooltip.style.transform = 'translateY(0)';
        });
    }
    
    enhanceHoverEffect(button) {
        let isHovering = false;
        
        button.addEventListener('mouseenter', () => {
            isHovering = true;
            
            // Efecto de glow pulsante
            const glowInterval = setInterval(() => {
                if (!isHovering) {
                    clearInterval(glowInterval);
                    return;
                }
                
                button.style.boxShadow = `
                    0 4px 20px rgba(29, 185, 84, 0.4),
                    0 0 0 ${Math.sin(Date.now() * 0.005) * 5 + 10}px rgba(29, 185, 84, 0.1)
                `;
            }, 16);
        });
        
        button.addEventListener('mouseleave', () => {
            isHovering = false;
            button.style.boxShadow = '';
        });
    }
    
    setupHourlyCheck() {
        // Verificar horario comercial cada hora
        setInterval(() => {
            const wasBusinessHours = this.isBusinessHours;
            this.checkBusinessHours();
            
            if (wasBusinessHours !== this.isBusinessHours) {
                console.log(`🕒 Cambio de horario: ${this.isBusinessHours ? 'ABIERTO' : 'CERRADO'}`);
                this.updateFloatingButtonStatus();
            }
        }, 3600000); // 1 hora
    }
    
    updateFloatingButtonStatus() {
        const floatingButton = document.querySelector('.whatsapp-float');
        const statusDot = floatingButton?.querySelector('.whatsapp-status-dot');
        const tooltip = floatingButton?.querySelector('.whatsapp-tooltip');
        
        if (statusDot) {
            statusDot.style.background = this.isBusinessHours ? '#4CAF50' : '#FF9800';
        }
        
        if (tooltip) {
            tooltip.textContent = this.isBusinessHours ? 
                'Estamos en línea - ¡Escríbenos!' : 
                'Fuera de horario - Te responderemos pronto';
        }
    }
    
    trackWhatsAppClick(source, product) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'source': source,
                'product': product,
                'device_type': this.isMobile ? 'mobile' : 'desktop',
                'business_hours': this.isBusinessHours,
                'click_count': this.clickCount + 1
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact', {
                content_name: product,
                content_category: 'whatsapp_contact',
                source: source
            });
        }
        
        // Console log para debug
        console.log(`📊 WhatsApp click tracked:`, {
            source,
            product,
            device: this.isMobile ? 'mobile' : 'desktop',
            businessHours: this.isBusinessHours
        });
    }
    
    // ===== MÉTODOS PÚBLICOS =====
    
    updateBusinessPhone(newPhone) {
        this.businessPhone = newPhone;
        console.log(`📱 Número actualizado: ${newPhone}`);
    }
    
    updateBusinessHours(newHours) {
        this.businessHours = { ...this.businessHours, ...newHours };
        this.checkBusinessHours();
        this.updateFloatingButtonStatus();
        console.log(`🕒 Horarios actualizados:`, this.businessHours);
    }
    
    getStats() {
        return {
            clickCount: this.clickCount,
            isBusinessHours: this.isBusinessHours,
            isMobile: this.isMobile,
            businessPhone: this.businessPhone
        };
    }
    
    testWhatsApp(message = 'Mensaje de prueba') {
        const url = this.createWhatsAppUrl(message, { source: 'test' });
        this.openWhatsApp(url);
    }
}

// ===== ESTILOS CSS DINÁMICOS =====
const whatsappStyles = document.createElement('style');
whatsappStyles.textContent = `
    @keyframes ripple {
        to {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: scale(1);
        }
        40%, 43% {
            transform: scale(1.1);
        }
        70% {
            transform: scale(1.05);
        }
        90% {
            transform: scale(1.02);
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(whatsappStyles);

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    window.whatsappController = new WhatsAppController();
    
    // Funciones globales para testing
    window.testWhatsApp = (message) => window.whatsappController.testWhatsApp(message);
    window.whatsappStats = () => window.whatsappController.getStats();
});

// Exportar para otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhatsAppController;
}