/* ===================================================================
   COOKIES BANNER - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Sistema simple de gestión de cookies conforme a normativas
   =================================================================== */

class CookiesBanner {
    constructor() {
        this.cookiesAccepted = false;
        this.cookieName = 'hgsas_cookies_accepted';
        this.expiryDays = 365;

        this.init();
    }

    init() {
        this.checkExistingConsent();
        this.setupEventListeners();

        if (!this.cookiesAccepted) {
            this.showBanner();
        }

        console.log('🍪 Cookies Banner inicializado');
    }

    checkExistingConsent() {
        const consent = this.getCookie(this.cookieName);
        if (consent === 'true') {
            this.cookiesAccepted = true;
            this.enableAnalytics();
        }
    }

    setupEventListeners() {
        const acceptBtn = document.getElementById('accept-cookies');
        const configureBtn = document.getElementById('configure-cookies');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                this.acceptAllCookies();
            });
        }

        if (configureBtn) {
            configureBtn.addEventListener('click', () => {
                this.showConfiguration();
            });
        }
    }

    showBanner() {
        const banner = document.getElementById('cookies-banner');
        if (banner) {
            // Mostrar después de 2 segundos para mejor UX
            setTimeout(() => {
                banner.style.display = 'block';
                banner.classList.add('show');

                // Focus management para accesibilidad
                const acceptBtn = banner.querySelector('#accept-cookies');
                if (acceptBtn) {
                    acceptBtn.focus();
                }
            }, 2000);
        }
    }

    hideBanner() {
        const banner = document.getElementById('cookies-banner');
        if (banner) {
            banner.classList.add('hide');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    }

    acceptAllCookies() {
        this.cookiesAccepted = true;
        this.setCookie(this.cookieName, 'true', this.expiryDays);
        this.enableAnalytics();
        this.hideBanner();

        // Analytics tracking
        this.trackConsentAction('accept_all');

        console.log('✅ Cookies aceptadas por el usuario');
    }

    showConfiguration() {
        // Implementación simple - aceptar todas por ahora
        // En una implementación completa, aquí abriría un modal de configuración
        this.acceptAllCookies();
    }

    enableAnalytics() {
        // Habilitar Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }

        // Habilitar Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('consent', 'grant');
        }

        console.log('📊 Analytics habilitado');
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    trackConsentAction(action) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cookie_consent', {
                event_category: 'privacy',
                event_label: action
            });
        }

        console.log(`🍪 Consent action tracked: ${action}`);
    }

    // Métodos públicos
    hasConsent() {
        return this.cookiesAccepted;
    }

    revokeConsent() {
        this.cookiesAccepted = false;
        this.setCookie(this.cookieName, 'false', this.expiryDays);
        this.showBanner();
        console.log('❌ Consentimiento revocado');
    }
}

// Estilos CSS para el banner
const cookiesStyles = document.createElement('style');
cookiesStyles.textContent = `
    .cookies-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: linear-gradient(135deg, rgba(15, 15, 35, 0.98), rgba(30, 30, 63, 0.98));
        backdrop-filter: blur(20px);
        border-top: 1px solid rgba(189, 147, 249, 0.3);
        padding: 20px;
        z-index: 9998;
        transform: translateY(100%);
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
    }
    
    .cookies-banner.show {
        transform: translateY(0);
    }
    
    .cookies-banner.hide {
        transform: translateY(100%);
    }
    
    .cookies-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
    }
    
    .cookies-content h3 {
        color: #bd93f9;
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 5px 0;
    }
    
    .cookies-content p {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
        line-height: 1.4;
        margin: 0;
    }
    
    .cookies-actions {
        display: flex;
        gap: 10px;
        flex-shrink: 0;
    }
    
    .btn-small {
        padding: 8px 16px;
        font-size: 0.9rem;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #bd93f9, #ff79c6);
        color: white;
    }
    
    .btn-primary:hover {
        background: linear-gradient(135deg, #a969f7, #ff65c3);
        transform: translateY(-1px);
    }
    
    .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .cookies-content {
            flex-direction: column;
            text-align: center;
            gap: 15px;
        }
        
        .cookies-actions {
            width: 100%;
            justify-content: center;
        }
        
        .btn-small {
            flex: 1;
            max-width: 150px;
        }
    }
    
    /* High contrast mode */
    @media (prefers-contrast: high) {
        .cookies-banner {
            background: #000;
            border-top-color: #fff;
        }
        
        .btn-primary {
            background: #fff;
            color: #000;
        }
        
        .btn-secondary {
            background: #000;
            color: #fff;
            border-color: #fff;
        }
    }
    
    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
        .cookies-banner {
            transition: none;
        }
    }
`;
document.head.appendChild(cookiesStyles);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    window.cookiesBanner = new CookiesBanner();

    // Función global para revocar consentimiento
    window.revokeCookieConsent = () => window.cookiesBanner.revokeConsent();
});

// Exportar para otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookiesBanner;
}