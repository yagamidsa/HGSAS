/* ===================================================================
   MAIN.JS UNIFICADO - PARTE 1 DE 5 (CORREGIDA)
   COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   =================================================================== */

// ===== CONFIGURACIÓN GLOBAL =====
const SITE_CONFIG = {
    email: {
        to: 'contacto@discomerhgsas.com.co',
        subject: 'Nueva Solicitud de Distribución AJEDREZ',
        emailJS: {
            publicKey: 'xsVNhAMEbm3nWvUb-',
            templateID: 'template_94lnsil'
        }
    },
    whatsapp: {
        number: '573222284212',
        baseMessage: 'Hola, me interesa información sobre distribución de AJEDREZ. '
    },
    locations: {
        bogota: {
            name: "Bogotá D.C.",
            message: "Buenos días, me interesa obtener información sobre la distribución de AJEDREZ en Bogotá D.C. ¿Podrían proporcionarme detalles sobre precios, disponibilidad y condiciones comerciales para la capital?"
        },
        cundinamarca: {
            name: "Cundinamarca",
            message: "Hola, me interesa información sobre la distribución de AJEDREZ en la región de Cundinamarca. ¿Podrían facilitarme detalles sobre cobertura municipal, precios regionales y condiciones de distribución?"
        },
        expansion: {
            name: "Nuevas Oportunidades",
            message: "Buenos días, me interesa la posibilidad de convertirme en distribuidor de AJEDREZ en mi región. ¿Podrían evaluarme como posible distribuidor y proporcionarme información sobre requisitos, inversión inicial y condiciones comerciales?"
        }
    },
    images: {
        expansionNacional: 'images/Expansion.webp',
        nuevosDistribuidores: 'images/wine.jpg',
        tendenciasBebidas: 'images/bebidas.png'
    }
};

// ===== CONTROLADOR PRINCIPAL =====
class SiteController {
    constructor() {
        this.isInitialized = false;
        this.scrollProgress = null;
        this.backToTopButton = null;
        this.intersectionObserver = null;
        this.formController = null;
        this.mapController = null;
        this.newsController = null;
        this.floatingWhatsApp = null;
        this.currentSection = 'home';
        this.isScrolling = false;
        this.lastScrollY = 0;
        this.eventListeners = new Map();
        this.performanceMetrics = {
            loadStart: performance.now(),
            domContentLoaded: null,
            fullyLoaded: null
        };
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeCore());
        } else {
            this.initializeCore();
        }
        window.addEventListener('load', () => this.initializeEnhancements());
        console.log('🚀 SiteController inicializado');
    }

    initializeCore() {
        this.performanceMetrics.domContentLoaded = performance.now();
        try {
            this.cleanupEventListeners();
            this.initializeScrollProgress();
            this.initializeBackToTop();
            this.initializeSmoothScrollEnhanced();
            this.isInitialized = true;
            console.log('✅ Core funcionalidades inicializadas');
        } catch (error) {
            console.error('❌ Error en inicialización core:', error);
        }
    }

    initializeEnhancements() {
        this.performanceMetrics.fullyLoaded = performance.now();
        try {
            this.mapController = new MapController();
            this.newsController = new NewsController();
            this.floatingWhatsApp = new FloatingWhatsApp();
            console.log('🎯 Todas las funcionalidades cargadas');
        } catch (error) {
            console.error('❌ Error en inicialización de mejoras:', error);
        }
    }

    cleanupEventListeners() {
        const navigationLinks = document.querySelectorAll('a[href^="#"]');
        navigationLinks.forEach(link => {
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
        });
        console.log('🧹 Event listeners limpiados');
    }

    initializeSmoothScrollEnhanced() {
        const linkMapping = {
            '#inicio': '#home',
            '#home': '#home',
            '#productos': '#productos',
            '#quienes-somos': '#quienes-somos',
            '#contacto': '#contacto'
        };

        const internalLinks = document.querySelectorAll('a[href^="#"]:not(.whatsapp-btn)');
        console.log('🔗 Configurando navegación para', internalLinks.length, 'enlaces');

        internalLinks.forEach(link => {
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);

            newLink.addEventListener('click', (e) => {
                const href = newLink.getAttribute('href');
                console.log('🔗 Click en enlace:', href);

                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    this.smoothScrollToTop();
                    return;
                }

                const mappedHref = linkMapping[href] || href;
                const targetElement = document.querySelector(mappedHref);

                if (targetElement) {
                    e.preventDefault();
                    console.log('✅ Navegando a:', mappedHref);
                    this.closeMobileMenu();
                    this.smoothScrollToElement(targetElement);
                    this.updateActiveLinks(href);
                } else {
                    console.error('❌ Sección no encontrada:', mappedHref);
                }
            });
        });

        console.log('🔄 Navegación unificada configurada');
    }

    closeMobileMenu() {
        const mobileNav = document.getElementById('mobileNavigation');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileOverlay = document.querySelector('.mobile-overlay');

        if (mobileNav && mobileNav.classList.contains('active')) {
            console.log('📱 Cerrando menú mobile');
            if (mobileToggle) mobileToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    initializeScrollProgress() {
        this.scrollProgress = document.querySelector('.scroll-progress .progress-fill');
        if (!this.scrollProgress) {
            console.warn('⚠️ Scroll progress element no encontrado');
            return;
        }

        let ticking = false;
        const updateScrollProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min((scrollTop / docHeight) * 100, 100);
            this.scrollProgress.style.width = `${progress}%`;
            const progressBar = this.scrollProgress.closest('.scroll-progress');
            if (progressBar) {
                progressBar.setAttribute('aria-valuenow', Math.round(progress));
            }
            ticking = false;
        };

        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollProgress);
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
        setTimeout(() => {
            updateScrollProgress();
        }, 100);
        console.log('📊 Scroll progress inicializado');
    }

    initializeBackToTop() {
        this.backToTopButton = document.getElementById('back-to-top');
        if (!this.backToTopButton) {
            console.warn('⚠️ Back to top button no encontrado');
            return;
        }

        let ticking = false;
        const threshold = 300;
        const handleScroll = () => {
            const scrollY = window.pageYOffset;
            if (scrollY > threshold) {
                this.backToTopButton.style.display = 'flex';
                this.backToTopButton.style.opacity = '1';
            } else {
                this.backToTopButton.style.opacity = '0';
                setTimeout(() => {
                    if (window.pageYOffset <= threshold) {
                        this.backToTopButton.style.display = 'none';
                    }
                }, 300);
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }, { passive: true });

        this.backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.smoothScrollToTop();
        });

        console.log('⬆️ Back to top inicializado');
    }

    smoothScrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    smoothScrollToElement(element, offset = 100) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    updateActiveLinks(activeHref) {
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });
        document.querySelectorAll(`a[href="${activeHref}"]`).forEach(link => {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        });
        console.log('✅ Enlaces activos actualizados:', activeHref);
    }

    getCurrentSection() {
        return this.currentSection;
    }

    goToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            this.smoothScrollToElement(targetSection);
        }
    }
}

/* ===================================================================
   MAIN.JS UNIFICADO - PARTE 2 DE 5
   MapController - Controlador del Mapa
   =================================================================== */

// ===== CONTROLADOR DEL MAPA =====
class MapController {
    constructor() {
        this.config = SITE_CONFIG.locations;
        this.phoneNumber = SITE_CONFIG.whatsapp.number;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeAnimations();
        console.log('🗺️ Mapa Controller inicializado');
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[onclick*="contactLocation"]')) {
                e.preventDefault();
                const button = e.target.closest('[onclick*="contactLocation"]');
                const onclick = button.getAttribute('onclick');
                const match = onclick.match(/contactLocation\(['"]([^'"]+)['"]\)/);
                if (match) {
                    this.contactLocation(match[1]);
                }
            }

            if (e.target.closest('[onclick*="showMapDetails"]')) {
                e.preventDefault();
                this.showMapDetails();
            }
        });
    }

    contactLocation(locationKey) {
        const location = this.config[locationKey];
        if (location) {
            const message = encodeURIComponent(location.message);
            const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${message}`;
            this.showContactEffects(locationKey);
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            if (window.siteController && window.siteController.trackEvent) {
                window.siteController.trackEvent('Map', 'contact_location', locationKey);
            }
            console.log(`📱 WhatsApp contact: ${location.name}`);
        }
    }

    showContactEffects(locationKey) {
        const button = document.querySelector(`[onclick*="contactLocation('${locationKey}')"]`);
        if (button) {
            button.classList.add('clicked');
            const originalContent = button.innerHTML;
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            `;
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.style.background = '';
                button.classList.remove('clicked');
            }, 3000);
        }
    }

    showMapDetails() {
        const mapCard = document.querySelector('.map-card');
        if (mapCard) {
            mapCard.style.transform = 'scale(1.02)';
            mapCard.style.boxShadow = '0 20px 50px rgba(189, 147, 249, 0.4)';
            setTimeout(() => {
                mapCard.style.transform = '';
                mapCard.style.boxShadow = '';
            }, 300);
        }
        this.mostrarModalMapa();
    }

    mostrarModalMapa() {
        const modal = document.createElement('div');
        modal.className = 'map-info-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="window.siteController.mapController.cerrarModalMapa()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Nuestra Cobertura en Detalle</h3>
                    <button class="modal-close" onclick="window.siteController.mapController.cerrarModalMapa()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="coverage-detail">
                        <h4>🏢 Bogotá D.C. - Sede Principal</h4>
                        <p>Centro neurálgico de nuestra operación con cobertura completa en las 32 localidades de la capital.</p>
                    </div>
                    <div class="coverage-detail">
                        <h4>🎯 Cundinamarca - Región Completa</h4>
                        <p>Distribución regional que abarca los 116 municipios de Cundinamarca con logística especializada.</p>
                    </div>
                    <div class="coverage-highlight">
                        <p><strong>✅ 100% de cobertura</strong> en nuestra zona de influencia</p>
                        <p><strong>🚚 Distribución directa</strong> desde nuestras instalaciones</p>
                        <p><strong>📞 Atención personalizada</strong> para cada distribuidor</p>
                    </div>
                    <div class="modal-actions">
                        <button class="modal-contact-btn" onclick="window.contactLocation('bogota')">
                            Contactar Bogotá
                        </button>
                        <button class="modal-contact-btn" onclick="window.contactLocation('cundinamarca')">
                            Contactar Cundinamarca
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.aplicarEstilosModal(modal);
        document.body.appendChild(modal);
        setTimeout(() => {
            modal.querySelector('.modal-overlay').style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'translateY(0)';
            modal.querySelector('.modal-content').style.opacity = '1';
        }, 50);
    }

    aplicarEstilosModal(modal) {
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        const overlay = modal.querySelector('.modal-overlay');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: pointer;
        `;

        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            background: linear-gradient(135deg, #1e1e3f, #2a2a5f);
            border-radius: 20px;
            border: 1px solid rgba(189, 147, 249, 0.3);
            max-width: 500px;
            width: 100%;
            transform: translateY(50px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;

        const header = modal.querySelector('.modal-header');
        header.style.cssText = `
            padding: 24px 24px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const title = modal.querySelector('.modal-header h3');
        title.style.cssText = `
            color: #bd93f9;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0;
        `;

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const body = modal.querySelector('.modal-body');
        body.style.cssText = `
            padding: 24px;
            color: rgba(255, 255, 255, 0.9);
        `;

        const details = modal.querySelectorAll('.coverage-detail');
        details.forEach(detail => {
            detail.style.cssText = `
                margin-bottom: 20px;
                padding: 16px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                border: 1px solid rgba(189, 147, 249, 0.2);
            `;

            const h4 = detail.querySelector('h4');
            if (h4) {
                h4.style.cssText = `
                    color: #bd93f9;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 8px;
                `;
            }

            const p = detail.querySelector('p');
            if (p) {
                p.style.cssText = `
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.5;
                    margin: 0;
                `;
            }
        });

        const highlight = modal.querySelector('.coverage-highlight');
        if (highlight) {
            highlight.style.cssText = `
                background: rgba(189, 147, 249, 0.1);
                border: 1px solid rgba(189, 147, 249, 0.3);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 20px;
            `;

            const paragraphs = highlight.querySelectorAll('p');
            paragraphs.forEach(p => {
                p.style.cssText = `
                    color: rgba(255, 255, 255, 0.9);
                    margin: 8px 0;
                    font-size: 0.95rem;
                `;
            });
        }

        const actions = modal.querySelector('.modal-actions');
        if (actions) {
            actions.style.cssText = `
                display: flex;
                gap: 12px;
                justify-content: center;
                margin-top: 20px;
            `;

            const buttons = actions.querySelectorAll('.modal-contact-btn');
            buttons.forEach(btn => {
                btn.style.cssText = `
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #25D366, #128C7E);
                    border: none;
                    border-radius: 25px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                `;
            });
        }
    }

    cerrarModalMapa() {
        const modal = document.querySelector('.map-info-modal');
        if (modal) {
            modal.querySelector('.modal-overlay').style.opacity = '0';
            modal.querySelector('.modal-content').style.transform = 'translateY(50px)';
            modal.querySelector('.modal-content').style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 400);
        }
    }

    initializeAnimations() {
        const mapCards = document.querySelectorAll('.location-card, .stat-card');
        mapCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    }
}

/* ===================================================================
   MAIN.JS UNIFICADO - PARTE 3 DE 5
   NewsController - Controlador de Noticias
   =================================================================== */

// ===== CONTROLADOR DE NOTICIAS =====
class NewsController {
    constructor() {
        this.config = SITE_CONFIG;
        this.newsData = this.initializeNewsData();
        this.init();
    }

    init() {
        this.createModalStructure();
        this.bindEvents();
        console.log('📰 News Controller inicializado');
    }

    initializeNewsData() {
        return {
            'expansion-nacional': {
                title: 'Expansión Nacional AJEDREZ 2025',
                date: '15 de Enero, 2025',
                image: this.config.images.expansionNacional,
                type: 'expansion',
                content: {
                    intro: 'Durante 2025, AJEDREZ llegará a 8 nuevas ciudades estratégicas de Colombia, consolidando su presencia nacional con una inversión de $45 millones de pesos colombianos y la incorporación de más de 35 nuevos distribuidores especializados.',
                    sections: [
                        {
                            title: 'Nuevas Ciudades Estratégicas',
                            content: '<p>Durante 2025, AJEDREZ llegará a <strong>8 nuevas ciudades estratégicas</strong> de Colombia. Esta expansión incluye:</p><ul class="feature-list"><li><strong>Costa Atlántica:</strong> Barranquilla, Cartagena</li><li><strong>Eje Cafetero:</strong> Manizales, Pereira</li><li><strong>Valle del Cauca:</strong> Cali, Palmira</li><li><strong>Santanderes:</strong> Bucaramanga, Cúcuta</li></ul>'
                        },
                        {
                            title: 'Inversión y Crecimiento',
                            content: '<div class="stats-grid"><div class="stat-item"><span class="stat-number">$45M</span><span class="stat-label">Millones COP Inversión</span></div><div class="stat-item"><span class="stat-number">35+</span><span class="stat-label">Nuevos Distribuidores</span></div><div class="stat-item"><span class="stat-number">180%</span><span class="stat-label">Crecimiento Proyectado</span></div><div class="stat-item"><span class="stat-number">12</span><span class="stat-label">Departamentos Cubiertos</span></div></div>'
                        }
                    ],
                    whatsappMessage: "Hola, me interesa ser distribuidor de AJEDREZ en la expansión 2025. ¿Podrían darme información sobre las oportunidades en mi región y los requisitos para participar?"
                }
            },
            'nuevos-distribuidores': {
                title: 'Nuevos Distribuidores Autorizados',
                date: '20 de Diciembre, 2024',
                image: this.config.images.nuevosDistribuidores,
                type: 'distribuidores',
                content: {
                    intro: 'La familia AJEDREZ crece con la incorporación de distribuidores estratégicos que fortalecen nuestra presencia nacional.',
                    sections: [
                        {
                            title: 'Nuevos Socios Estratégicos',
                            content: '<p>Hemos incorporado <strong>12 nuevos distribuidores autorizados</strong> seleccionados por su experiencia y compromiso.</p><div class="highlight-box"><h4>🏆 Distribuidores Destacados</h4><ul class="feature-list"><li><strong>Bebidas Premium Medellín:</strong> Especialistas en eventos corporativos</li><li><strong>Distribuciones del Caribe:</strong> Cobertura en Barranquilla</li><li><strong>Vinos Selectos Cali:</strong> Red en tiendas gourmet</li></ul></div>'
                        }
                    ],
                    whatsappMessage: "Hola, me interesa convertirme en distribuidor autorizado de AJEDREZ. ¿Podrían enviarme información sobre los requisitos?"
                }
            },
            'tendencias-sin-alcohol': {
                title: 'Tendencias en Bebidas Sin Alcohol',
                date: '10 de Diciembre, 2024',
                image: this.config.images.tendenciasBebidas,
                type: 'tendencias',
                content: {
                    intro: 'El mercado colombiano de bebidas sin alcohol presenta un panorama prometedor con múltiples oportunidades de crecimiento.',
                    sections: [
                        {
                            title: 'Panorama del Mercado Colombiano',
                            content: '<p>Colombia se consolida como mercado clave en Latinoamérica para bebidas premium sin alcohol.</p><div class="stats-grid"><div class="stat-item"><span class="stat-number">42%</span><span class="stat-label">Crecimiento anual</span></div><div class="stat-item"><span class="stat-number">67%</span><span class="stat-label">Prefieren alternativas</span></div><div class="stat-item"><span class="stat-number">$450M</span><span class="stat-label">Mercado 2026</span></div></div>'
                        }
                    ],
                    whatsappMessage: "Hola, me interesa conocer más sobre las oportunidades de distribución de AJEDREZ y las tendencias del mercado."
                }
            }
        };
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            const newsCard = e.target.closest('.news-card');
            if (newsCard) {
                const newsType = this.getNewsType(newsCard);
                if (newsType && this.newsData[newsType]) {
                    this.openModal(newsType);
                }
            }

            if (e.target.id === 'closeModal' || e.target.id === 'newsModalOverlay') {
                this.closeModal();
            }
        });
    }

    createModalStructure() {
        if (!document.getElementById('newsModalOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'newsModalOverlay';
            overlay.className = 'news-modal-overlay';
            overlay.innerHTML = `
                <div class="news-modal" id="newsModal">
                    <div class="modal-header">
                        <img class="modal-header-image" src="" alt="">
                        <button class="modal-close" id="closeModal">&times;</button>
                    </div>
                    <div class="modal-content">
                        <h2 class="modal-title"></h2>
                        <div class="modal-date"></div>
                        <div class="modal-text"></div>
                        <div class="cta-section">
                            <h3>¿Te interesa esta información?</h3>
                            <p>Contáctanos por WhatsApp para conocer más detalles</p>
                            <a href="" class="cta-button" target="_blank">
                                <span>📱</span>
                                <span>Contactar por WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    }

    openModal(newsType) {
        const data = this.newsData[newsType];
        const modal = document.getElementById('newsModal');
        const overlay = document.getElementById('newsModalOverlay');

        const headerImage = modal.querySelector('.modal-header-image');
        headerImage.style.opacity = '0';
        headerImage.style.transform = 'scale(0.8)';

        setTimeout(() => {
            headerImage.src = data.image;
            headerImage.alt = data.title;
            modal.querySelector('.modal-title').textContent = data.title;
            modal.querySelector('.modal-date').textContent = data.date;

            let contentHTML = `<p class="modal-intro">${data.content.intro}</p>`;
            data.content.sections.forEach(section => {
                contentHTML += `
                    <div class="modal-section">
                        <h3 class="section-title">${section.title}</h3>
                        <div class="section-content">${section.content}</div>
                    </div>
                `;
            });

            modal.querySelector('.modal-text').innerHTML = contentHTML;

            const whatsappUrl = `https://wa.me/${this.config.whatsapp.number}?text=${encodeURIComponent(data.content.whatsappMessage)}`;
            modal.querySelector('.cta-button').href = whatsappUrl;

            modal.className = `news-modal modal-${data.type}`;

            headerImage.style.opacity = '1';
            headerImage.style.transform = 'scale(1)';

            this.applyModalContentStyles();
        }, 100);

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (window.siteController && window.siteController.trackEvent) {
            window.siteController.trackEvent('News', 'modal_opened', newsType);
        }

        setTimeout(() => {
            this.animateElements();
        }, 400);
    }

    applyModalContentStyles() {
        if (document.getElementById('news-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'news-modal-styles';
        style.textContent = `
            .news-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.4s ease;
                padding: 20px;
            }
            .news-modal-overlay.active {
                opacity: 1;
            }
            .news-modal {
                background: linear-gradient(135deg, #1e1e3f, #2a2a5f);
                border-radius: 20px;
                border: 2px solid rgba(189, 147, 249, 0.3);
                max-width: 800px;
                max-height: 90vh;
                width: 100%;
                overflow: hidden;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.7);
                transform: scale(0.8);
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .news-modal-overlay.active .news-modal {
                transform: scale(1);
            }
            .modal-header {
                position: relative;
                height: 250px;
                overflow: hidden;
                border-radius: 18px 18px 0 0;
            }
            .modal-header-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: all 0.6s ease;
            }
            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 24px;
                font-weight: bold;
                transition: all 0.3s ease;
                z-index: 10;
            }
            .modal-close:hover {
                background: rgba(255, 79, 198, 0.8);
                transform: rotate(90deg);
            }
            .modal-content {
                padding: 30px;
                color: white;
                max-height: calc(90vh - 250px);
                overflow-y: auto;
            }
            .modal-title {
                color: #bd93f9;
                font-size: 2rem;
                font-weight: 800;
                margin-bottom: 10px;
                line-height: 1.2;
            }
            .modal-intro {
                font-size: 1.1rem;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 30px;
                padding: 20px;
                background: rgba(189, 147, 249, 0.1);
                border-radius: 12px;
                border-left: 4px solid #bd93f9;
            }
            .section-title {
                color: #50fa7b;
                font-size: 1.4rem;
                font-weight: 700;
                margin-bottom: 20px;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 20px;
                margin: 25px 0;
                padding: 25px;
                background: rgba(15, 15, 35, 0.5);
                border-radius: 15px;
            }
            .stat-item {
                text-align: center;
                padding: 20px 10px;
                background: rgba(189, 147, 249, 0.1);
                border-radius: 12px;
            }
            .stat-number {
                display: block;
                font-size: 2rem;
                font-weight: 800;
                color: #bd93f9;
                margin-bottom: 8px;
            }
            .stat-label {
                display: block;
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.7);
            }
            .cta-button {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 15px 30px;
                background: linear-gradient(135deg, #1DB954, #128C7E);
                color: white;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 600;
                font-size: 1.1rem;
                transition: all 0.4s ease;
            }
            .cta-button:hover {
                transform: translateY(-3px) scale(1.05);
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    animateElements() {
        const modal = document.getElementById('newsModal');
        const sections = modal.querySelectorAll('.modal-section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 200 + (index * 150));
        });

        const statNumbers = modal.querySelectorAll('.stat-number');
        statNumbers.forEach((stat, index) => {
            setTimeout(() => {
                this.animateNumber(stat);
            }, 500 + (index * 100));
        });
    }

    animateNumber(element) {
        const finalNumber = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/\d/g, '');

        if (finalNumber && !element.hasAttribute('data-animated')) {
            element.setAttribute('data-animated', 'true');
            let currentNumber = 0;
            const increment = Math.ceil(finalNumber / 30);
            const stepTime = 50;

            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    currentNumber = finalNumber;
                    clearInterval(timer);
                }
                element.textContent = currentNumber + suffix;
            }, stepTime);
        }
    }

    getNewsType(newsCard) {
        const titleElement = newsCard.querySelector('h3');
        if (!titleElement) return null;

        const title = titleElement.textContent.toLowerCase();

        if (title.includes('expansión') || title.includes('nacional') || title.includes('2025')) {
            return 'expansion-nacional';
        } else if (title.includes('distribuidores') || title.includes('autorizados') || title.includes('nuevos')) {
            return 'nuevos-distribuidores';
        } else if (title.includes('tendencias') || title.includes('sin alcohol')) {
            return 'tendencias-sin-alcohol';
        }

        return null;
    }

    closeModal() {
        const overlay = document.getElementById('newsModalOverlay');
        const modal = document.getElementById('newsModal');
        const headerImage = modal.querySelector('.modal-header-image');

        overlay.classList.remove('active');
        document.body.style.overflow = '';

        setTimeout(() => {
            headerImage.src = '';
            headerImage.alt = '';
            modal.querySelector('.modal-title').textContent = '';
            modal.querySelector('.modal-date').textContent = '';
            modal.querySelector('.modal-text').innerHTML = '';
            modal.className = 'news-modal';
        }, 100);
    }
}

/* ===================================================================
   MAIN.JS UNIFICADO - PARTE 4 DE 5
   FormController + FloatingWhatsApp
   =================================================================== */

// ===== CONTROLADOR DE FORMULARIOS =====
class FormController {
    constructor(form) {
        this.form = form;
        this.submitButton = form.querySelector('.btn-submit, .submit-btn');
        this.statusElement = form.querySelector('.form-status');
        this.isSubmitting = false;
        this.config = SITE_CONFIG;
        this.setupFormValidation();
        this.setupFormSubmission();
        console.log('📝 FormController inicializado');
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('.form-input, .form-select, .form-textarea, input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (value && isValid) {
            switch (fieldName) {
                case 'firstName':
                case 'lastName':
                case 'nombre':
                    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Solo se permiten letras y espacios';
                    } else if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Mínimo 2 caracteres';
                    }
                    break;
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Formato de email inválido';
                    }
                    break;
                case 'phone':
                case 'telefono':
                    if (!/^[\+]?[0-9\s\-\(\)]+$/.test(value)) {
                        isValid = false;
                        errorMessage = 'Formato de teléfono inválido';
                    } else if (value.replace(/\D/g, '').length < 10) {
                        isValid = false;
                        errorMessage = 'Teléfono debe tener al menos 10 dígitos';
                    }
                    break;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            field.style.borderColor = '#ff79c6';
            field.style.boxShadow = '0 0 0 3px rgba(255, 121, 198, 0.2)';
        }
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
            field.style.borderColor = '';
            field.style.boxShadow = '';
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    async handleFormSubmit() {
        if (this.isSubmitting) return;

        if (!this.validateAllFields()) {
            this.showFormError('Por favor corrige los errores antes de enviar');
            return;
        }

        this.isSubmitting = true;
        this.showLoadingState();

        try {
            const formData = new FormData(this.form);
            const result = await this.submitForm(formData);

            if (result.success) {
                this.showSuccessMessage();
                this.form.reset();
                if (window.siteController && window.siteController.trackEvent) {
                    window.siteController.trackEvent('Form', 'contact_form_submit', 'success');
                }
            } else {
                throw new Error(result.message || 'Error al enviar el formulario');
            }

        } catch (error) {
            console.error('Error al enviar formulario:', error);
            this.showFormError('Error al enviar el mensaje. Por favor intenta nuevamente.');
            if (window.siteController && window.siteController.trackEvent) {
                window.siteController.trackEvent('Form', 'contact_form_submit', 'error');
            }
        } finally {
            this.isSubmitting = false;
            this.hideLoadingState();
        }
    }

    validateAllFields() {
        const inputs = this.form.querySelectorAll('[required]');
        let allValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });
        return allValid;
    }

    async submitForm(formData) {
        try {
            // Inicializar EmailJS
            emailjs.init(this.config.email.emailJS.publicKey);

            // Preparar datos del formulario
            const emailData = {};
            for (let [key, value] of formData.entries()) {
                emailData[key] = value;
            }

            // Agregar timestamp formateado
            emailData.timestamp = new Date().toLocaleString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            console.log('📧 Enviando email con EmailJS...', emailData);

            // Enviar con EmailJS
            const response = await emailjs.send(
                'default_service',
                this.config.email.emailJS.templateID,
                emailData
            );

            console.log('✅ Email enviado exitosamente:', response);
            return { success: true };

        } catch (error) {
            console.error('❌ Error al enviar email:', error);
            throw error;
        }
    }

    formatEmailBody(data) {
        return `
NUEVA SOLICITUD DE DISTRIBUCIÓN AJEDREZ

=== INFORMACIÓN PERSONAL ===
Nombre: ${data.firstName || data.nombre || ''} ${data.lastName || ''}
Email: ${data.email || ''}
Teléfono: ${data.phone || data.telefono || ''}

=== INFORMACIÓN DEL NEGOCIO ===
Empresa: ${data.businessName || data.empresa || ''}
Tipo de Negocio: ${data.businessType || 'No especificado'}

=== UBICACIÓN ===
Departamento: ${data.department || data.departamento || ''}
Ciudad: ${data.city || data.ciudad || ''}

=== MENSAJE ===
${data.message || data.mensaje || 'Sin mensaje adicional'}

=== METADATOS ===
Fecha: ${new Date().toLocaleString('es-CO')}
Fuente: Formulario Web AJEDREZ

---
Enviado desde el sitio web de COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
        `.trim();
    }

    showLoadingState() {
        if (this.submitButton) {
            const btnText = this.submitButton.querySelector('.btn-text');
            const btnLoading = this.submitButton.querySelector('.btn-loading');

            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'flex';

            this.submitButton.disabled = true;
            this.submitButton.style.opacity = '0.7';
        }
    }

    hideLoadingState() {
        if (this.submitButton) {
            const btnText = this.submitButton.querySelector('.btn-text');
            const btnLoading = this.submitButton.querySelector('.btn-loading');

            if (btnText) btnText.style.display = 'block';
            if (btnLoading) btnLoading.style.display = 'none';

            this.submitButton.disabled = false;
            this.submitButton.style.opacity = '1';
        }
    }

    showSuccessMessage() {
        this.form.style.display = 'none';

        let successElement = document.getElementById('successMessage');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.id = 'successMessage';
            successElement.className = 'success-message';
            successElement.innerHTML = `
                <div class="success-content">
                    <div class="success-icon">✅</div>
                    <h3>¡Mensaje enviado correctamente!</h3>
                    <p>Te contactaremos pronto para brindarte más información sobre las oportunidades de distribución AJEDREZ.</p>
                    <button onclick="window.resetForm()" class="btn btn-primary">Enviar otro mensaje</button>
                </div>
            `;
            this.form.parentNode.insertBefore(successElement, this.form.nextSibling);
        }

        successElement.style.display = 'block';
        successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showFormError(message) {
        let errorBanner = document.querySelector('.form-error-banner');

        if (!errorBanner) {
            errorBanner = document.createElement('div');
            errorBanner.className = 'form-error-banner';
            errorBanner.style.cssText = `
                background: rgba(255, 121, 198, 0.1);
                border: 2px solid #ff79c6;
                border-radius: 12px;
                padding: 1rem;
                margin-bottom: 1.5rem;
                color: #ff79c6;
                text-align: center;
                font-weight: 600;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            `;
            this.form.insertBefore(errorBanner, this.form.firstChild);
        }

        errorBanner.textContent = message;

        setTimeout(() => {
            errorBanner.style.opacity = '1';
            errorBanner.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            if (errorBanner) {
                errorBanner.style.opacity = '0';
                setTimeout(() => errorBanner.remove(), 300);
            }
        }, 5000);
    }

    resetForm() {
        this.form.reset();
        this.clearAllErrors();
        this.form.style.display = 'block';

        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.style.display = 'none';
        }

        console.log('🔄 Formulario reiniciado');
    }

    clearAllErrors() {
        const errorElements = this.form.querySelectorAll('.form-error');
        errorElements.forEach(error => {
            error.classList.remove('show');
        });

        const errorBanner = document.querySelector('.form-error-banner');
        if (errorBanner) {
            errorBanner.remove();
        }
    }
}

// ===== FLOATING WHATSAPP BUTTON =====
class FloatingWhatsApp {
    constructor() {
        this.config = SITE_CONFIG.whatsapp;
        this.createButton();
        this.setupEventListeners();
    }

    createButton() {
        if (document.querySelector('.whatsapp-float')) return;

        const button = document.createElement('a');
        button.className = 'whatsapp-float';
        button.href = '#';
        button.setAttribute('aria-label', 'Contactar por WhatsApp');
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 30px; height: 30px;">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.488"/>
            </svg>
        `;

        this.addStyles();
        document.body.appendChild(button);
    }

    addStyles() {
        if (document.querySelector('#whatsapp-float-styles')) return;

        const styles = `
            .whatsapp-float {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: #1DB954;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 20px rgba(29, 185, 84, 0.4);
                z-index: 9999;
                transition: all 0.3s ease;
                animation: whatsappPulse 2s infinite;
                text-decoration: none;
                color: white;
            }
            
            .whatsapp-float:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 30px rgba(29, 185, 84, 0.6);
                color: white;
            }
            
            @keyframes whatsappPulse {
                0%, 100% { box-shadow: 0 4px 20px rgba(29, 185, 84, 0.4); }
                50% { box-shadow: 0 4px 20px rgba(29, 185, 84, 0.8), 0 0 0 10px rgba(29, 185, 84, 0.1); }
            }
            
            @media (max-width: 768px) {
                .whatsapp-float {
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                }
                
                .whatsapp-float svg {
                    width: 25px !important;
                    height: 25px !important;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'whatsapp-float-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupEventListeners() {
        const button = document.querySelector('.whatsapp-float');
        if (!button) return;

        button.addEventListener('click', (e) => {
            e.preventDefault();

            const message = 'Hola, me interesa conocer más sobre los productos AJEDREZ y las oportunidades de distribución.';
            const whatsappUrl = `https://wa.me/${this.config.number}?text=${encodeURIComponent(message)}`;

            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

            if (window.siteController && window.siteController.trackEvent) {
                window.siteController.trackEvent('WhatsApp', 'floating_button_click');
            }
            console.log('📱 Floating WhatsApp button clicked');
        });
    }
}

/* ===================================================================
   MAIN.JS UNIFICADO - PARTE 5 DE 5 (FINAL)
   Funciones Globales + Inicialización
   =================================================================== */

// ===== FUNCIONES GLOBALES =====

// Función global para contactar ubicaciones
window.contactLocation = function (locationKey) {
    if (window.siteController && window.siteController.mapController) {
        window.siteController.mapController.contactLocation(locationKey);
    } else {
        console.warn('MapController no disponible');
    }
};

// Función global para mostrar detalles del mapa
window.showMapDetails = function () {
    if (window.siteController && window.siteController.mapController) {
        window.siteController.mapController.showMapDetails();
    } else {
        console.warn('MapController no disponible');
    }
};

// Función global para resetear formulario
window.resetForm = function () {
    if (window.siteController && window.siteController.formController) {
        window.siteController.formController.resetForm();
    } else {
        console.warn('FormController no disponible');
    }
};

// Función global para cerrar modal del mapa
window.cerrarModalMapa = function () {
    if (window.siteController && window.siteController.mapController) {
        window.siteController.mapController.cerrarModalMapa();
    } else {
        console.warn('MapController no disponible');
    }
};

// Funciones de debugging
window.getSiteState = function () {
    if (window.siteController) {
        return window.siteController.getCurrentSection();
    }
    return null;
};

window.goToSection = function (section) {
    if (window.siteController) {
        window.siteController.goToSection(section);
    }
};

window.getPerformanceMetrics = function () {
    if (window.siteController) {
        return window.siteController.performanceMetrics;
    }
    return null;
};

// Función para testing de clases específicas
window.testSpecificClass = function (productType) {
    console.log('Probando clase para:', productType);
    if (window.siteController) {
        window.siteController.applySpecificClass(productType);
    }
};

// Función para verificar qué clase está activa
window.checkActiveClass = function () {
    const modal = document.querySelector('.catalog-modal.active, .catalog-modal.catalog-open');
    if (modal) {
        const classes = Array.from(modal.classList).filter(c => c.includes('-active'));
        const dataProduct = modal.getAttribute('data-product');
        console.log('Clases activas:', classes.join(', '));
        console.log('Data product:', dataProduct);

        const catalogSection = modal.querySelector('.catalog-section');
        if (catalogSection) {
            const style = window.getComputedStyle(catalogSection);
            console.log('Padding actual:', style.padding);
        }
    } else {
        console.log('No hay modal activo');
    }
};

// ===== INICIALIZACIÓN COMPLETA =====
document.addEventListener('DOMContentLoaded', function () {
    console.log('Limpiando listeners duplicados...');

    // Reemplazar enlaces problemáticos para evitar duplicados
    const problematicLinks = document.querySelectorAll('a[href^="#"]:not(.whatsapp-btn)');
    problematicLinks.forEach(link => {
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
    });

    // Inicializar controlador principal después de limpiar
    setTimeout(() => {
        try {
            window.siteController = new SiteController();
            console.log('Sistema unificado inicializado correctamente');

            // Verificar que todos los componentes estén disponibles
            setTimeout(() => {
                if (window.siteController.mapController) {
                    console.log('MapController disponible');
                }
                if (window.siteController.newsController) {
                    console.log('NewsController disponible');
                }
                if (window.siteController.floatingWhatsApp) {
                    console.log('FloatingWhatsApp disponible');
                }
            }, 500);

        } catch (error) {
            console.error('Error en inicialización:', error);
        }
    }, 100);
});

// Error handling global
window.addEventListener('error', function (e) {
    console.error('Error en el sistema:', e.error);
});

// Cleanup al salir
window.addEventListener('beforeunload', function () {
    if (window.siteController) {
        console.log('Limpiando recursos...');
    }
});

// Export para testing (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SiteController,
        FormController,
        MapController,
        NewsController,
        FloatingWhatsApp,
        SITE_CONFIG
    };
}

// ===== FUNCIONALIDADES ADICIONALES =====

// Agregar métodos faltantes al SiteController después de la inicialización
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        if (window.siteController && SiteController.prototype) {

            // Agregar método de section tracking si no existe
            if (!SiteController.prototype.initializeSectionTracking) {
                SiteController.prototype.initializeSectionTracking = function () {
                    const sections = document.querySelectorAll('section[id]');
                    if (sections.length === 0) return;

                    let ticking = false;
                    const updateCurrentSection = () => {
                        const scrollPosition = window.pageYOffset + 150;
                        sections.forEach(section => {
                            const sectionTop = section.offsetTop;
                            const sectionHeight = section.offsetHeight;
                            const sectionId = section.id;

                            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                                if (this.currentSection !== sectionId) {
                                    this.currentSection = sectionId;
                                    const newUrl = `${window.location.pathname}#${sectionId}`;
                                    history.replaceState(null, null, newUrl);
                                    console.log('Sección activa:', sectionId);
                                }
                            }
                        });
                        ticking = false;
                    };

                    window.addEventListener('scroll', () => {
                        if (!ticking) {
                            requestAnimationFrame(updateCurrentSection);
                            ticking = true;
                        }
                    }, { passive: true });

                    console.log('Section tracking inicializado');
                };
            }

            // Agregar método para clases específicas de productos si no existe
            if (!SiteController.prototype.applySpecificClass) {
                SiteController.prototype.applySpecificClass = function (productType) {
                    const modal = document.querySelector('.catalog-modal.active, .catalog-modal.catalog-open, .catalog-modal[style*="block"]');
                    if (modal) {
                        modal.classList.remove('rosado-active', 'cereza-active', 'manzana-active', 'uva-active');
                        modal.classList.add(`${productType}-active`);
                        modal.setAttribute('data-product', productType);
                        console.log('Clase aplicada:', `${productType}-active`);
                    }
                };
            }

            // Inicializar funcionalidades faltantes
            if (window.siteController.initializeSectionTracking) {
                window.siteController.initializeSectionTracking();
            }
        }
    }, 200);
});

// Forzar inicialización del scroll progress si no funciona
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        const progressFill = document.querySelector('.progress-fill');
        const progressContainer = document.querySelector('.scroll-progress');

        if (progressFill && progressContainer) {
            progressContainer.style.display = 'block';
            progressContainer.style.visibility = 'visible';
            progressContainer.style.opacity = '1';

            function forceUpdateProgress() {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
                progressFill.style.width = progress + '%';
            }

            forceUpdateProgress();
            window.addEventListener('scroll', forceUpdateProgress);
            console.log('Scroll progress forzado');
        }
    }, 500);
});

console.log('main.js unificado cargado completamente - Sin conflictos');

// ===== FIN DEL ARCHIVO =====

/* ===================================================================
   MAIN.JS UNIFICADO - PARTE 6 DE 6 (CORREGIDA Y FUNCIONAL)
   Fix de Clases Específicas para Rosado y Cereza
   =================================================================== */

// Variable global para tracking de modales
let modalClassApplied = false;

// Función principal para aplicar clases específicas (UNIFICADA)
function applySpecificClass(productType) {
    console.log(`🎯 Intentando aplicar clase: ${productType}`);

    // Buscar modal activo con múltiples métodos
    let modal = null;

    // Método 1: Por clases activas
    modal = document.querySelector('.catalog-modal.active') ||
        document.querySelector('.catalog-modal.catalog-open') ||
        document.querySelector('.catalog-modal[style*="block"]') ||
        document.querySelector('.catalog-modal[style*="flex"]');

    // Método 2: Por display visible
    if (!modal) {
        const allModals = document.querySelectorAll('.catalog-modal');
        allModals.forEach(m => {
            const style = window.getComputedStyle(m);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
                modal = m;
            }
        });
    }

    if (modal) {
        // Limpiar clases anteriores
        modal.classList.remove('rosado-active', 'blanco-active', 'cereza-active', 'manzana-active', 'uva-active');

        // Aplicar nueva clase
        modal.classList.add(`${productType}-active`);
        modal.setAttribute('data-product', productType);

        console.log(`✅ Clase aplicada exitosamente: ${productType}-active`);

        // Verificar padding aplicado
        setTimeout(() => {
            const catalogSection = modal.querySelector('.catalog-section');
            if (catalogSection) {
                const computedStyle = window.getComputedStyle(catalogSection);
                console.log(`📏 Padding verificado: ${computedStyle.padding}`);
            }
        }, 100);

        modalClassApplied = true;
        return true;
    } else {
        console.warn('❌ No se encontró modal activo para aplicar clase');
        return false;
    }
}

// Detectar clicks en productos específicos
document.addEventListener('click', function (e) {
    const clickedElement = e.target;

    // Buscar si es un botón de catálogo
    const catalogBtn = clickedElement.closest('.catalog-btn') ||
        clickedElement.closest('[class*="open-catalog"]') ||
        clickedElement.closest('[onclick*="catalog"]');

    if (catalogBtn) {
        // Buscar la tarjeta del producto
        const productCard = catalogBtn.closest('.product-card') ||
            catalogBtn.closest('[class*="product"]');

        if (productCard) {
            const cardText = productCard.textContent.toLowerCase();
            let productType = null;

            // Detectar tipo de producto
            if (cardText.includes('rosado')) {
                productType = 'rosado';
            } else if (cardText.includes('cereza')) {
                productType = 'cereza';
            } else if (cardText.includes('manzana')) {
                productType = 'manzana';
            } else if (cardText.includes('uva')) {
                productType = 'uva';
            }

            if (productType) {
                console.log(`🔍 Detectado producto: ${productType}`);

                // Aplicar clase con múltiples intentos
                let attempts = 0;
                const maxAttempts = 10;

                const applyClassWithRetry = () => {
                    attempts++;
                    const success = applySpecificClass(productType);

                    if (!success && attempts < maxAttempts) {
                        setTimeout(applyClassWithRetry, 200);
                    } else if (success) {
                        console.log(`✅ Clase aplicada en intento #${attempts}`);
                    } else {
                        console.warn(`❌ No se pudo aplicar clase después de ${maxAttempts} intentos`);
                    }
                };

                // Primer intento inmediato
                setTimeout(applyClassWithRetry, 100);
            }
        }
    }
});

// Observer avanzado para detectar modales dinámicos
const advancedModalObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        // Observar cambios de atributos (clase, style)
        if (mutation.type === 'attributes') {
            const target = mutation.target;

            if (target.classList && target.classList.contains('catalog-modal')) {
                const isVisible = target.classList.contains('active') ||
                    target.classList.contains('catalog-open') ||
                    target.style.display === 'block' ||
                    target.style.display === 'flex';

                if (isVisible && !modalClassApplied) {
                    setTimeout(() => {
                        detectProductFromModal(target);
                    }, 150);
                }
            }
        }

        // Observar nodos agregados al DOM
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    // Si es un modal
                    if (node.classList && node.classList.contains('catalog-modal')) {
                        setTimeout(() => {
                            detectProductFromModal(node);
                        }, 200);
                    }

                    // Si contiene un modal
                    const modalInside = node.querySelector && node.querySelector('.catalog-modal');
                    if (modalInside) {
                        setTimeout(() => {
                            detectProductFromModal(modalInside);
                        }, 200);
                    }
                }
            });
        }
    });
});

// Función para detectar producto desde el contenido del modal
function detectProductFromModal(modal) {
    if (!modal) return;

    // Buscar título en múltiples selectores
    const titleSelectors = [
        '.product-title',
        '.modal-title',
        'h1', 'h2', 'h3',
        '[class*="title"]',
        '[class*="product-name"]'
    ];

    let title = null;
    for (const selector of titleSelectors) {
        title = modal.querySelector(selector);
        if (title) break;
    }

    if (!title) {
        // Buscar en todo el texto del modal
        const allText = modal.textContent.toLowerCase();

        if (allText.includes('rosado')) {
            applySpecificClass('rosado');
        } else if (allText.includes('cereza')) {
            applySpecificClass('cereza');
        } else if (allText.includes('blanco')) {
            applySpecificClass('blanco');
        } else if (allText.includes('manzana')) {
            applySpecificClass('manzana');
        } else if (allText.includes('uva')) {
            applySpecificClass('uva');
        }
        return;
    }

    const titleText = title.textContent.toLowerCase();
    console.log(`🔍 Analizando título: "${titleText}"`);

    if (titleText.includes('rosado')) {
        applySpecificClass('rosado');
    } else if (titleText.includes('cereza')) {
        applySpecificClass('cereza');
    } else if (titleText.includes('blanco')) {
        applySpecificClass('blanco');
    } else if (titleText.includes('manzana')) {
        applySpecificClass('manzana');
    } else if (titleText.includes('uva')) {
        applySpecificClass('uva');
    }
}

// Inicializar observer cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Observar cambios en todo el body
    advancedModalObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class', 'style'],
        childList: true,
        subtree: true
    });

    console.log('🔍 Observer avanzado de modales inicializado');
});

// Limpiar flag cuando se cierre modal
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('catalog-close') ||
        e.target.closest('.catalog-close') ||
        e.target.classList.contains('modal-overlay')) {
        modalClassApplied = false;
        console.log('🔄 Flag de modal reseteado');
    }
});

// También resetear con ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        modalClassApplied = false;
        console.log('🔄 Flag de modal reseteado (ESC)');
    }
});

// Integración con SiteController existente
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        if (window.siteController && typeof SiteController !== 'undefined') {

            // Sobrescribir método si existe
            if (SiteController.prototype.applySpecificClass) {
                const originalMethod = SiteController.prototype.applySpecificClass;

                SiteController.prototype.applySpecificClass = function (productType) {
                    console.log(`🔄 Usando método SiteController para: ${productType}`);
                    return applySpecificClass(productType);
                };
            } else {
                // Agregar método si no existe
                SiteController.prototype.applySpecificClass = function (productType) {
                    return applySpecificClass(productType);
                };
            }

            console.log('🔗 Método applySpecificClass integrado con SiteController');
        }
    }, 300);
});

// Funciones de debugging para testing
window.forceApplyClass = function (productType) {
    console.log(`🧪 Test manual: aplicando ${productType}`);
    return applySpecificClass(productType);
};

window.checkModalState = function () {
    const modals = document.querySelectorAll('.catalog-modal');
    modals.forEach((modal, index) => {
        const isVisible = window.getComputedStyle(modal).display !== 'none';
        const classes = Array.from(modal.classList).filter(c => c.includes('-active'));
        console.log(`Modal ${index}: visible=${isVisible}, classes=${classes.join(', ')}`);
    });
};

window.resetModalFlags = function () {
    modalClassApplied = false;
    console.log('🔄 Flags reseteados manualmente');
};

console.log('✅ Parte 6 del main.js cargada - Sistema de clases específicas activo');

// Export para compatibilidad
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { applySpecificClass, detectProductFromModal };
}   


/* ===================================================================
   INICIALIZACIÓN DEL FORMULARIO CON EMAILJS
   =================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Buscando formulario distributorForm...');
    
    // Esperar a que EmailJS esté disponible
    const initFormWithEmailJS = () => {
        const form = document.getElementById('distributorForm');
        
        if (!form) {
            console.error('❌ Formulario distributorForm no encontrado');
            return;
        }
        
        if (typeof emailjs === 'undefined') {
            console.warn('⚠️ EmailJS no disponible aún, reintentando...');
            setTimeout(initFormWithEmailJS, 500);
            return;
        }
        
        console.log('📝 Inicializando FormController con EmailJS...');
        
        // Crear instancia del FormController
        const formController = new FormController(form);
        
        // Guardar referencia global
        if (window.siteController) {
            window.siteController.formController = formController;
        }
        window.distributorFormController = formController;
        
        console.log('✅ FormController inicializado exitosamente');
    };
    
    // Iniciar después de un pequeño delay
    setTimeout(initFormWithEmailJS, 1000);
});