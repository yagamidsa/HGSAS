/* ===================================================================
   COOKIES BANNER - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Banner de cookies conforme a GDPR y normativas colombianas
   =================================================================== */

class CookiesBannerController {
    constructor() {
        this.banner = null;
        this.acceptButton = null;
        this.configureButton = null;
        this.configModal = null;
        this.isVisible = false;
        
        // Configuración de cookies
        this.cookieTypes = {
            necessary: {
                name: 'Cookies Necesarias',
                description: 'Cookies esenciales para el funcionamiento del sitio web',
                required: true,
                enabled: true
            },
            analytics: {
                name: 'Cookies Analíticas',
                description: 'Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web',
                required: false,
                enabled: false
            },
            marketing: {
                name: 'Cookies de Marketing',
                description: 'Se utilizan para rastrear visitantes y mostrar anuncios relevantes',
                required: false,
                enabled: false
            },
            functional: {
                name: 'Cookies Funcionales',
                description: 'Permiten funcionalidades mejoradas y personalización',
                required: false,
                enabled: false
            }
        };
        
        // Configuración
        this.config = {
            cookieName: 'hgsas_cookie_consent',
            cookieExpiry: 365, // días
            checkInterval: 24 * 60 * 60 * 1000, // 24 horas en ms
            bannerDelay: 2000, // 2 segundos
            autoHideDelay: 30000 // 30 segundos si no hay interacción
        };
        
        this.init();
    }
    
    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeBanner());
        } else {
            this.initializeBanner();
        }
        
        console.log('🍪 Cookies Banner Controller inicializado');
    }
    
    initializeBanner() {
        // Crear banner si no existe
        this.createBanner();
        
        // Verificar estado de cookies
        this.checkCookieConsent();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Cookies banner inicializado');
    }
    
    createBanner() {
        // Verificar si ya existe
        this.banner = document.getElementById('cookies-banner');
        
        if (!this.banner) {
            // Crear banner dinámicamente
            this.banner = document.createElement('div');
            this.banner.id = 'cookies-banner';
            this.banner.className = 'cookies-banner';
            this.banner.setAttribute('role', 'dialog');
            this.banner.setAttribute('aria-labelledby', 'cookies-title');
            this.banner.setAttribute('aria-describedby', 'cookies-description');
            this.banner.style.display = 'none';
            
            this.banner.innerHTML = `
                <div class="cookies-content">
                    <h3 id="cookies-title">🍪 Utilizamos cookies</h3>
                    <p id="cookies-description">
                        Utilizamos cookies para mejorar tu experiencia de navegación, 
                        analizar el tráfico del sitio web y personalizar el contenido. 
                        Al hacer clic en "Aceptar todas", consientes el uso de TODAS las cookies.
                    </p>
                    <div class="cookies-actions">
                        <button id="accept-all-cookies" class="btn btn-primary btn-small">
                            Aceptar Todas
                        </button>
                        <button id="accept-necessary-cookies" class="btn btn-secondary btn-small">
                            Solo Necesarias
                        </button>
                        <button id="configure-cookies" class="btn btn-secondary btn-small">
                            Configurar
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(this.banner);
        }
        
        // Encontrar botones
        this.acceptAllButton = document.getElementById('accept-all-cookies');
        this.acceptNecessaryButton = document.getElementById('accept-necessary-cookies');
        this.configureButton = document.getElementById('configure-cookies');
        
        console.log('🏗️ Banner de cookies creado');
    }
    
    createConfigModal() {
        if (this.configModal) return;
        
        this.configModal = document.createElement('div');
        this.configModal.id = 'cookies-config-modal';
        this.configModal.className = 'cookies-config-modal';
        this.configModal.setAttribute('role', 'dialog');
        this.configModal.setAttribute('aria-modal', 'true');
        this.configModal.style.display = 'none';
        
        let cookieOptions = '';
        Object.keys(this.cookieTypes).forEach(type => {
            const cookie = this.cookieTypes[type];
            const disabled = cookie.required ? 'disabled' : '';
            const checked = cookie.enabled ? 'checked' : '';
            
            cookieOptions += `
                <div class="cookie-option">
                    <div class="cookie-header">
                        <label class="cookie-label">
                            <input type="checkbox" 
                                   id="cookie-${type}" 
                                   ${checked} 
                                   ${disabled}
                                   data-cookie-type="${type}">
                            <span class="cookie-name">${cookie.name}</span>
                            ${cookie.required ? '<span class="cookie-required">(Requerida)</span>' : ''}
                        </label>
                    </div>
                    <p class="cookie-description">${cookie.description}</p>
                </div>
            `;
        });
        
        this.configModal.innerHTML = `
            <div class="config-content">
                <div class="config-header">
                    <h3>Configuración de Cookies</h3>
                    <button class="config-close" aria-label="Cerrar configuración">&times;</button>
                </div>
                <div class="config-body">
                    <p>Puedes elegir qué tipos de cookies quieres permitir. 
                       Las cookies necesarias son requeridas para el funcionamiento básico del sitio.</p>
                    <div class="cookie-options">
                        ${cookieOptions}
                    </div>
                </div>
                <div class="config-footer">
                    <button id="save-cookie-config" class="btn btn-primary">
                        Guardar Configuración
                    </button>
                    <button id="cancel-cookie-config" class="btn btn-secondary">
                        Cancelar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.configModal);
        
        console.log('⚙️ Modal de configuración creado');
    }
    
    setupEventListeners() {
        if (this.acceptAllButton) {
            this.acceptAllButton.addEventListener('click', () => this.acceptAllCookies());
        }
        
        if (this.acceptNecessaryButton) {
            this.acceptNecessaryButton.addEventListener('click', () => this.acceptNecessaryCookies());
        }
        
        if (this.configureButton) {
            this.configureButton.addEventListener('click', () => this.showConfigModal());
        }
        
        // Escape key para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.configModal && this.configModal.style.display !== 'none') {
                    this.hideConfigModal();
                } else if (this.isVisible) {
                    this.acceptNecessaryCookies();
                }
            }
        });
        
        // Auto-hide banner después de tiempo límite
        this.setupAutoHide();
    }
    
    setupAutoHide() {
        setTimeout(() => {
            if (this.isVisible && !this.hasUserInteracted()) {
                console.log('⏰ Auto-hiding cookies banner due to inactivity');
                this.acceptNecessaryCookies();
            }
        }, this.config.autoHideDelay);
    }
    
    hasUserInteracted() {
        // Verificar si el usuario ha interactuado con la página
        return document.hasFocus() && 
               (window.pageYOffset > 100 || 
                performance.now() - performance.timeOrigin > 10000);
    }
    
    checkCookieConsent() {
        const consent = this.getCookieConsent();
        
        if (!consent) {
            // No hay consentimiento, mostrar banner
            setTimeout(() => {
                this.showBanner();
            }, this.config.bannerDelay);
        } else {
            // Hay consentimiento, aplicar configuración
            this.applyCookieSettings(consent);
            
            // Verificar si necesita renovación (cada año)
            const consentDate = new Date(consent.timestamp);
            const now = new Date();
            const daysDiff = (now - consentDate) / (1000 * 60 * 60 * 24);
            
            if (daysDiff > this.config.cookieExpiry) {
                console.log('📅 Consentimiento de cookies expirado, solicitando renovación');
                this.showBanner();
            }
        }
    }
    
    showBanner() {
        if (this.isVisible) return;
        
        this.banner.style.display = 'block';
        this.banner.classList.add('show');
        this.isVisible = true;
        
        // Focus en el primer botón para accesibilidad
        setTimeout(() => {
            if (this.acceptAllButton) {
                this.acceptAllButton.focus();
            }
        }, 300);
        
        // Prevenir scroll del body en móvil
        if (window.innerWidth <= 767) {
            document.body.style.paddingBottom = '120px';
        }
        
        console.log('👀 Banner de cookies mostrado');
        this.trackEvent('Cookies', 'banner_shown');
    }
    
    hideBanner() {
        if (!this.isVisible) return;
        
        this.banner.classList.remove('show');
        this.isVisible = false;
        
        setTimeout(() => {
            this.banner.style.display = 'none';
        }, 500);
        
        // Restaurar scroll del body
        if (window.innerWidth <= 767) {
            document.body.style.paddingBottom = '';
        }
        
        console.log('🙈 Banner de cookies ocultado');
    }
    
    acceptAllCookies() {
        // Habilitar todas las cookies
        Object.keys(this.cookieTypes).forEach(type => {
            this.cookieTypes[type].enabled = true;
        });
        
        this.saveCookieConsent();
        this.applyCookieSettings();
        this.hideBanner();
        
        console.log('✅ Todas las cookies aceptadas');
        this.trackEvent('Cookies', 'accept_all');
    }
    
    acceptNecessaryCookies() {
        // Solo habilitar cookies necesarias
        Object.keys(this.cookieTypes).forEach(type => {
            this.cookieTypes[type].enabled = this.cookieTypes[type].required;
        });
        
        this.saveCookieConsent();
        this.applyCookieSettings();
        this.hideBanner();
        
        console.log('✅ Solo cookies necesarias aceptadas');
        this.trackEvent('Cookies', 'accept_necessary');
    }
    
    showConfigModal() {
        this.createConfigModal();
        
        // Actualizar checkboxes con estado actual
        Object.keys(this.cookieTypes).forEach(type => {
            const checkbox = document.getElementById(`cookie-${type}`);
            if (checkbox) {
                checkbox.checked = this.cookieTypes[type].enabled;
            }
        });
        
        this.configModal.style.display = 'flex';
        
        // Setup event listeners para el modal
        this.setupConfigModalListeners();
        
        // Focus en el primer checkbox para accesibilidad
        const firstCheckbox = this.configModal.querySelector('input[type="checkbox"]:not([disabled])');
        if (firstCheckbox) {
            firstCheckbox.focus();
        }
        
        console.log('⚙️ Modal de configuración mostrado');
        this.trackEvent('Cookies', 'config_opened');
    }
    
    hideConfigModal() {
        if (this.configModal) {
            this.configModal.style.display = 'none';
        }
        
        // Devolver focus al botón configurar
        if (this.configureButton) {
            this.configureButton.focus();
        }
        
        console.log('⚙️ Modal de configuración ocultado');
    }
    
    setupConfigModalListeners() {
        const saveButton = document.getElementById('save-cookie-config');
        const cancelButton = document.getElementById('cancel-cookie-config');
        const closeButton = this.configModal.querySelector('.config-close');
        
        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveCustomConfig());
        }
        
        if (cancelButton) {
            cancelButton.addEventListener('click', () => this.hideConfigModal());
        }
        
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hideConfigModal());
        }
        
        // Click fuera del modal para cerrar
        this.configModal.addEventListener('click', (e) => {
            if (e.target === this.configModal) {
                this.hideConfigModal();
            }
        });
    }
    
    saveCustomConfig() {
        // Leer configuración de checkboxes
        Object.keys(this.cookieTypes).forEach(type => {
            const checkbox = document.getElementById(`cookie-${type}`);
            if (checkbox && !checkbox.disabled) {
                this.cookieTypes[type].enabled = checkbox.checked;
            }
        });
        
        this.saveCookieConsent();
        this.applyCookieSettings();
        this.hideConfigModal();
        this.hideBanner();
        
        console.log('💾 Configuración personalizada guardada');
        this.trackEvent('Cookies', 'custom_config_saved');
    }
    
    saveCookieConsent() {
        const consent = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            preferences: {}
        };
        
        Object.keys(this.cookieTypes).forEach(type => {
            consent.preferences[type] = this.cookieTypes[type].enabled;
        });
        
        // Guardar en localStorage
        try {
            localStorage.setItem(this.config.cookieName, JSON.stringify(consent));
            
            // También crear cookie de consentimiento
            this.setCookie(this.config.cookieName, 'accepted', this.config.cookieExpiry);
            
            console.log('💾 Consentimiento de cookies guardado');
        } catch (error) {
            console.error('❌ Error guardando consentimiento de cookies:', error);
        }
    }
    
    getCookieConsent() {
        try {
            const stored = localStorage.getItem(this.config.cookieName);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('❌ Error leyendo consentimiento de cookies:', error);
            return null;
        }
    }
    
    applyCookieSettings(consent = null) {
        const settings = consent || { preferences: {} };
        
        // Aplicar configuración actual si no se proporciona consentimiento
        if (!consent) {
            Object.keys(this.cookieTypes).forEach(type => {
                settings.preferences[type] = this.cookieTypes[type].enabled;
            });
        } else {
            // Actualizar configuración interna
            Object.keys(this.cookieTypes).forEach(type => {
                if (settings.preferences.hasOwnProperty(type)) {
                    this.cookieTypes[type].enabled = settings.preferences[type];
                }
            });
        }
        
        // Aplicar cookies analíticas
        if (settings.preferences.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
        
        // Aplicar cookies de marketing
        if (settings.preferences.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }
        
        // Aplicar cookies funcionales
        if (settings.preferences.functional) {
            this.enableFunctional();
        } else {
            this.disableFunctional();
        }
        
        // Evento personalizado para otros scripts
        window.dispatchEvent(new CustomEvent('cookieSettingsApplied', {
            detail: { preferences: settings.preferences }
        }));
        
        console.log('⚙️ Configuración de cookies aplicada:', settings.preferences);
    }
    
    enableAnalytics() {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
        // Google Analytics 4
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'consent_update',
            'analytics_enabled': true
        });
        
        console.log('📊 Analytics cookies habilitadas');
    }
    
    disableAnalytics() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        
        console.log('📊 Analytics cookies deshabilitadas');
    }
    
    enableMarketing() {
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('consent', 'grant');
        }
        
        // Google Ads
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted'
            });
        }
        
        console.log('📢 Marketing cookies habilitadas');
    }
    
    disableMarketing() {
        if (typeof fbq !== 'undefined') {
            fbq('consent', 'revoke');
        }
        
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'denied'
            });
        }
        
        console.log('📢 Marketing cookies deshabilitadas');
    }
    
    enableFunctional() {
        // Habilitar funcionalidades adicionales
        // Por ejemplo: chat widget, mapas, videos embebidos
        
        console.log('🔧 Functional cookies habilitadas');
    }
    
    disableFunctional() {
        // Deshabilitar funcionalidades no esenciales
        
        console.log('🔧 Functional cookies deshabilitadas');
    }
    
    /* ===== UTILITY METHODS ===== */
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
    
    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
    
    trackEvent(category, action, label = null) {
        // Solo trackear si las cookies analíticas están habilitadas
        if (this.cookieTypes.analytics.enabled && typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        console.log(`📊 Cookie Event: ${category} - ${action}`, label);
    }
    
    /* ===== PUBLIC API ===== */
    hasConsent(cookieType = null) {
        if (cookieType) {
            return this.cookieTypes[cookieType]?.enabled || false;
        }
        
        // Verificar si hay algún consentimiento
        return this.getCookieConsent() !== null;
    }
    
    updateConsent(cookieType, enabled) {
        if (this.cookieTypes[cookieType] && !this.cookieTypes[cookieType].required) {
            this.cookieTypes[cookieType].enabled = enabled;
            this.saveCookieConsent();
            this.applyCookieSettings();
            
            console.log(`🔄 Consentimiento actualizado: ${cookieType} = ${enabled}`);
        }
    }
    
    revokeAllConsent() {
        // Resetear a solo cookies necesarias
        Object.keys(this.cookieTypes).forEach(type => {
            this.cookieTypes[type].enabled = this.cookieTypes[type].required;
        });
        
        // Limpiar localStorage y cookies
        localStorage.removeItem(this.config.cookieName);
        this.deleteCookie(this.config.cookieName);
        
        this.applyCookieSettings();
        this.showBanner();
        
        console.log('🗑️ Todo el consentimiento revocado');
        this.trackEvent('Cookies', 'consent_revoked');
    }
    
    showBannerAgain() {
        this.showBanner();
    }
    
    getConsentDetails() {
        return {
            hasConsent: this.hasConsent(),
            preferences: { ...this.cookieTypes },
            lastUpdated: this.getCookieConsent()?.timestamp || null
        };
    }
}

/* ===== CSS DINÁMICO ===== */
const cookiesStyles = document.createElement('style');
cookiesStyles.textContent = `
.cookies-config-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4000;
    backdrop-filter: blur(5px);
}

.config-content {
    background: var(--gradient-primary);
    border-radius: 20px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    border: 2px solid var(--accent-purple);
    position: relative;
}

.config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.config-header h3 {
    color: var(--accent-purple);
    margin: 0;
    font-size: 1.5rem;
}

.config-close {
    background: none;
    border: none;
    color: var(--accent-pink);
    font-size: 24px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.3s ease;
}

.config-close:hover {
    background: rgba(255, 121, 198, 0.2);
}

.config-body p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 20px;
    line-height: 1.5;
}

.cookie-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.cookie-option {
    background: rgba(255, 255, 255, 0.05);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid rgba(189, 147, 249, 0.2);
}

.cookie-header {
    margin-bottom: 8px;
}

.cookie-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-weight: 600;
}

.cookie-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--accent-purple);
}

.cookie-name {
    color: var(--white);
    font-size: 1rem;
}

.cookie-required {
    color: var(--accent-green);
    font-size: 0.8rem;
    font-weight: 400;
}

.cookie-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 0;
    padding-left: 28px;
}

.config-footer {
    display: flex;
    gap: 15px;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.config-footer .btn {
    flex: 1;
    min-height: 44px;
}

@media (max-width: 767px) {
    .config-content {
        width: 95%;
        padding: 20px;
        max-height: 90vh;
    }
    
    .config-footer {
        flex-direction: column;
    }
    
    .cookie-label {
        flex-wrap: wrap;
    }
    
    .cookie-description {
        padding-left: 0;
        margin-top: 8px;
    }
}
`;

document.head.appendChild(cookiesStyles);

/* ===== INICIALIZACIÓN ===== */
document.addEventListener('DOMContentLoaded', () => {
    window.cookiesBanner = new CookiesBannerController();
    
    // API global
    window.hasConsent = (type) => window.cookiesBanner.hasConsent(type);
    window.updateConsent = (type, enabled) => window.cookiesBanner.updateConsent(type, enabled);
    window.revokeConsent = () => window.cookiesBanner.revokeAllConsent();
    window.showCookiesBanner = () => window.cookiesBanner.showBannerAgain();
    window.getConsentDetails = () => window.cookiesBanner.getConsentDetails();
});

// Exportar para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookiesBannerController;
}

console.log('🍪 cookies-banner.js cargado completamente');