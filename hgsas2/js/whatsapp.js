/* ===================================================================
   💬 WHATSAPP CONTROLLER - HG SAS
   📁 Archivo: js/whatsapp.js (OPCIONAL - Solo si quieres funciones extra)
   🎯 Sistema completo de WhatsApp con mensajes personalizados
   =================================================================== */

class WhatsAppController {
    constructor() {
        this.phoneNumber = '573222284212';
        this.isInitialized = false;
        
        // Mensajes predefinidos
        this.messages = {
            default: 'Hola, me interesa conocer más sobre los productos AJEDREZ',
            rosado: 'Buenos días, me interesa obtener información sobre el producto AJEDREZ Rosado 750ml. ¿Podrían proporcionarme detalles sobre precios, disponibilidad y condiciones de distribución? Quedo atento a su respuesta. Saludos cordiales.',
            cereza: 'Buenos días, me interesa el producto AJEDREZ Cereza 750ml. ¿Podrían facilitarme información sobre precios mayoristas, cantidades mínimas de pedido y tiempos de entrega? Agradezco su pronta respuesta.',
            manzana: 'Estimados, solicito cotización para el producto AJEDREZ Manzana 750ml. Requiero información sobre precios, descuentos por volumen y cobertura de distribución en mi zona. Muchas gracias.',
            uva: 'Buen día, me dirijo a ustedes para solicitar información comercial sobre AJEDREZ Uva 750ml. Necesito conocer precios, condiciones de pago y requisitos para convertirme en distribuidor. Quedo pendiente de su respuesta.',
            distribucion: 'Hola, estoy interesado en convertirme en distribuidor de productos AJEDREZ en mi zona. ¿Podrían proporcionarme información sobre requisitos, precios mayoristas y condiciones comerciales?',
            evento: 'Buenos días, necesito cotización de productos AJEDREZ para un evento. ¿Podrían ayudarme con precios y disponibilidad?',
            catalogo: 'Hola, me gustaría recibir el catálogo completo de productos AJEDREZ con precios actualizados.'
        };
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        try {
            this.setupEventListeners();
            this.createFloatingButton();
            this.preconnectWhatsApp();
            
            this.isInitialized = true;
            console.log('💬 WhatsApp Controller inicializado');
            
        } catch (error) {
            console.error('❌ Error inicializando WhatsApp:', error);
        }
    }

    setupEventListeners() {
        // Esperar a que el DOM esté cargado
        document.addEventListener('DOMContentLoaded', () => {
            this.bindExistingElements();
        });
        
        // Si el DOM ya está cargado
        if (document.readyState === 'loading') {
            this.bindExistingElements();
        }
    }

    bindExistingElements() {
        // Botón flotante existente
        const floatingBtn = document.getElementById('whatsappFloating');
        if (floatingBtn) {
            floatingBtn.addEventListener('click', () => {
                this.openWhatsApp(this.messages.default);
            });
        }

        // Enlaces de productos específicos
        const productLinks = document.querySelectorAll('.btn-whatsapp');
        productLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleProductClick(link);
            });
        });

        // Enlaces con data attributes personalizados
        const customLinks = document.querySelectorAll('[data-whatsapp]');
        customLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const messageType = link.dataset.whatsapp;
                const customMessage = link.dataset.message;
                
                const message = customMessage || this.messages[messageType] || this.messages.default;
                this.openWhatsApp(message);
            });
        });

        console.log('🔗 Enlaces de WhatsApp configurados');
    }

    handleProductClick(element) {
        // Detectar tipo de producto por clase o data attribute
        let messageType = 'default';
        let customMessage = null;

        // Por data attribute
        if (element.dataset.message) {
            customMessage = element.dataset.message;
        } else if (element.dataset.product) {
            messageType = element.dataset.product.toLowerCase();
        } else {
            // Por clases CSS
            if (element.closest('.rosado') || element.textContent.toLowerCase().includes('rosado')) {
                messageType = 'rosado';
            } else if (element.closest('.cereza') || element.textContent.toLowerCase().includes('cereza')) {
                messageType = 'cereza';
            } else if (element.closest('.manzana') || element.textContent.toLowerCase().includes('manzana')) {
                messageType = 'manzana';
            } else if (element.closest('.uva') || element.textContent.toLowerCase().includes('uva')) {
                messageType = 'uva';
            }
        }

        const message = customMessage || this.messages[messageType] || this.messages.default;
        this.openWhatsApp(message);

        // Analytics tracking
        this.trackWhatsAppClick(messageType, element);
    }

    openWhatsApp(message, trackingLabel = null) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp
        const newWindow = window.open(whatsappURL, '_blank', 'noopener,noreferrer');
        
        // Verificar si se abrió correctamente
        if (!newWindow) {
            console.warn('⚠️ No se pudo abrir WhatsApp (posiblemente bloqueado por popup blocker)');
            
            // Fallback: mostrar alerta con el enlace
            this.showWhatsAppFallback(whatsappURL);
        }

        // Tracking
        this.trackWhatsAppClick(trackingLabel || 'manual', null, message);
        
        console.log('💬 WhatsApp abierto con mensaje:', message.substring(0, 50) + '...');
    }

    showWhatsAppFallback(url) {
        // Crear modal de fallback
        const fallbackModal = document.createElement('div');
        fallbackModal.className = 'whatsapp-fallback-modal';
        fallbackModal.innerHTML = `
            <div class="fallback-content">
                <h3>Abrir WhatsApp</h3>
                <p>Haz clic en el botón para abrir WhatsApp:</p>
                <a href="${url}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-large">
                    Abrir WhatsApp
                </a>
                <button class="btn btn-secondary" onclick="this.closest('.whatsapp-fallback-modal').remove()">
                    Cerrar
                </button>
            </div>
            <div class="fallback-overlay" onclick="this.closest('.whatsapp-fallback-modal').remove()"></div>
        `;
        
        document.body.appendChild(fallbackModal);
        
        // Auto-remove después de 10 segundos
        setTimeout(() => {
            if (fallbackModal.parentNode) {
                fallbackModal.remove();
            }
        }, 10000);
    }

    
    preconnectWhatsApp() {
        // Preconnect para acelerar la carga de WhatsApp
        const preconnectLink = document.createElement('link');
        preconnectLink.rel = 'preconnect';
        preconnectLink.href = 'https://wa.me';
        document.head.appendChild(preconnectLink);

        // DNS prefetch también
        const dnsLink = document.createElement('link');
        dnsLink.rel = 'dns-prefetch';
        dnsLink.href = '//wa.me';
        document.head.appendChild(dnsLink);
    }

    trackWhatsAppClick(type, element, message) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'WhatsApp',
                'event_label': type,
                'custom_parameter_1': message ? message.substring(0, 100) : null
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact', {
                content_name: `WhatsApp - ${type}`,
                content_category: 'Communication'
            });
        }

        // Custom tracking
        console.log(`📊 WhatsApp tracking: ${type}`, {
            element: element?.tagName || 'unknown',
            message_preview: message ? message.substring(0, 50) + '...' : 'default'
        });

        // Enviar evento personalizado para otros listeners
        window.dispatchEvent(new CustomEvent('whatsappClick', {
            detail: {
                type: type,
                element: element,
                message: message
            }
        }));
    }

    /* ===== MÉTODOS PÚBLICOS ===== */

    // Abrir WhatsApp con mensaje personalizado
    sendMessage(message, trackingLabel = null) {
        this.openWhatsApp(message, trackingLabel);
    }

    // Obtener mensaje predefinido
    getMessage(type) {
        return this.messages[type] || this.messages.default;
    }

    // Agregar mensaje personalizado
    addMessage(key, message) {
        this.messages[key] = message;
    }

    // Cambiar número de teléfono
    setPhoneNumber(number) {
        this.phoneNumber = number.replace(/\D/g, ''); // Solo números
        console.log(`📱 Número actualizado: ${this.phoneNumber}`);
    }

    // Crear enlace de WhatsApp
    createWhatsAppLink(message, className = 'btn-whatsapp') {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
    }

    // Verificar disponibilidad de WhatsApp
    static isWhatsAppAvailable() {
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isWhatsAppInstalled = navigator.userAgent.includes('WhatsApp');
        
        return {
            isMobile: isMobile,
            isInstalled: isWhatsAppInstalled,
            canOpen: isMobile || !isMobile // WhatsApp Web funciona en desktop
        };
    }

    // Estado de inicialización
    isReady() {
        return this.isInitialized;
    }
}

/* ===== CSS AUTOMÁTICO PARA EL BOTÓN FLOTANTE ===== */
function injectWhatsAppStyles() {
    if (document.getElementById('whatsapp-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'whatsapp-styles';
    styles.textContent = `
        /* Botón flotante de WhatsApp */
        .whatsapp-floating {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #1DB954;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 8px 30px rgba(29, 185, 84, 0.4);
            transition: all 0.3s ease;
        }

        .whatsapp-floating:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 40px rgba(29, 185, 84, 0.6);
        }

        .whatsapp-floating .whatsapp-icon {
            width: 30px;
            height: 30px;
            color: white;
        }

        .whatsapp-floating .whatsapp-icon svg {
            width: 100%;
            height: 100%;
        }

        .whatsapp-floating .whatsapp-tooltip {
            position: absolute;
            right: 70px;
            top: 50%;
            transform: translateY(-50%);
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .whatsapp-floating:hover .whatsapp-tooltip {
            opacity: 1;
        }

        .whatsapp-floating .whatsapp-tooltip::after {
            content: '';
            position: absolute;
            right: -5px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border: 5px solid transparent;
            border-left-color: #333;
        }

        /* Animación de pulso */
        @keyframes pulse {
            0% {
                box-shadow: 0 8px 30px rgba(29, 185, 84, 0.4);
            }
            50% {
                box-shadow: 0 8px 30px rgba(29, 185, 84, 0.6);
            }
            100% {
                box-shadow: 0 8px 30px rgba(29, 185, 84, 0.4);
            }
        }

        .whatsapp-floating {
            animation: pulse 2s infinite;
        }

        /* Modal fallback */
        .whatsapp-fallback-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .whatsapp-fallback-modal .fallback-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
        }

        .whatsapp-fallback-modal .fallback-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            text-align: center;
            position: relative;
            z-index: 1;
        }

        .whatsapp-fallback-modal h3 {
            margin-bottom: 1rem;
            color: #333;
        }

        .whatsapp-fallback-modal p {
            margin-bottom: 1.5rem;
            color: #666;
        }

        .whatsapp-fallback-modal .btn {
            margin: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .whatsapp-floating {
                bottom: 80px;
                right: 15px;
                width: 55px;
                height: 55px;
            }
            
            .whatsapp-floating .whatsapp-icon {
                width: 25px;
                height: 25px;
            }
            
            .whatsapp-floating .whatsapp-tooltip {
                display: none;
            }
        }
    `;

    document.head.appendChild(styles);
}

/* ===== INICIALIZACIÓN AUTOMÁTICA ===== */
let whatsappController;

// Inyectar estilos inmediatamente
injectWhatsAppStyles();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        whatsappController = new WhatsAppController();
        window.WhatsApp = whatsappController; // Global access
    });
} else {
    whatsappController = new WhatsAppController();
    window.WhatsApp = whatsappController;
}

/* ===== FUNCIONES GLOBALES DE CONVENIENCIA ===== */
window.openWhatsApp = (message, trackingLabel) => {
    if (whatsappController) {
        whatsappController.sendMessage(message, trackingLabel);
    } else {
        console.warn('WhatsApp controller not initialized yet');
    }
};

window.getWhatsAppController = () => whatsappController;

console.log('💬 WhatsApp Controller cargado');

/* ===== EXPORT PARA MÓDULOS ===== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhatsAppController;
}