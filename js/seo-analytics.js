/* ===================================================================
   SEO ANALYTICS - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Sistema SEO y Analytics para AJEDREZ - Champaña y Vinos Sin Alcohol
   =================================================================== */

class SEOAnalytics {
    constructor() {
        this.config = {
            gaId: 'GA_MEASUREMENT_ID', // Reemplazar con tu ID de Google Analytics
            fbPixelId: 'FB_PIXEL_ID', // Reemplazar con tu Facebook Pixel ID
            siteName: 'COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S',
            siteUrl: 'https://discomerhgsas.com.co',
            businessPhone: '573222284212',
            businessEmail: 'info@discomerhgsas.com.co'
        };
        
        this.keywords = {
            primary: [
                'AJEDREZ champaña sin alcohol',
                'vinos espumosos sin alcohol Colombia',
                'champaña sin alcohol Cundinamarca',
                'bebidas sin alcohol para brindis',
                'distribuidora AJEDREZ Colombia'
            ],
            secondary: [
                'champagne sin alcohol Bogotá',
                'vinos sin alcohol rosado cereza manzana uva',
                'bebidas para eventos sin alcohol',
                'champaña para celebraciones',
                'alternativa champaña sin alcohol Colombia',
                'distribuidora bebidas premium sin alcohol'
            ]
        };
        
        this.productData = {
            rosado: {
                name: 'AJEDREZ Champaña Rosado Sin Alcohol',
                category: 'Champaña Sin Alcohol',
                keywords: 'champaña rosado sin alcohol, vino espumoso rosado, bebidas elegantes sin alcohol'
            },
            cereza: {
                name: 'AJEDREZ Champaña Cereza Sin Alcohol',
                category: 'Champaña Sin Alcohol',
                keywords: 'champaña cereza sin alcohol, vino espumoso frutal, bebidas cereza sin alcohol'
            },
            manzana: {
                name: 'AJEDREZ Champaña Manzana Sin Alcohol',
                category: 'Champaña Sin Alcohol',
                keywords: 'champaña manzana sin alcohol, vino espumoso manzana, bebidas refrescantes sin alcohol'
            },
            uva: {
                name: 'AJEDREZ Champaña Uva Sin Alcohol',
                category: 'Champaña Sin Alcohol',
                keywords: 'champaña uva sin alcohol, vino espumoso tradicional, bebidas clásicas sin alcohol'
            }
        };
        
        this.sessionData = {
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            pageViews: 0,
            events: [],
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        this.init();
    }
    
    init() {
        this.setupMetaTags();
        this.setupStructuredData();
        this.initializeGoogleAnalytics();
        this.initializeFacebookPixel();
        this.setupEventTracking();
        this.trackPageView();
        this.setupScrollTracking();
        this.setupConversionTracking();
        
        console.log('📊 SEO Analytics inicializado para AJEDREZ Champaña');
        console.log('🎯 Keywords objetivo:', this.keywords.primary);
    }
    
    generateSessionId() {
        return 'ajedrez_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    setupMetaTags() {
        // Meta tags optimizados para AJEDREZ Champaña
        const metaTags = [
            {
                name: 'description',
                content: 'AJEDREZ - Champaña y vinos espumosos sin alcohol en Colombia. 4 sabores únicos: Rosado, Cereza, Manzana y Uva. Distribución nacional desde Cundinamarca. Perfectos para brindis y celebraciones.'
            },
            {
                name: 'keywords',
                content: 'AJEDREZ, champaña sin alcohol, vinos espumosos sin alcohol, Colombia, Cundinamarca, rosado, cereza, manzana, uva, brindis, celebraciones, distribuidora, HG SAS'
            },
            {
                property: 'og:title',
                content: 'AJEDREZ - Champaña Sin Alcohol Premium | Distribución Colombia'
            },
            {
                property: 'og:description',
                content: 'Descubre AJEDREZ, la champaña sin alcohol perfecta para tus celebraciones. 4 sabores únicos, distribución nacional garantizada.'
            },
            {
                property: 'og:type',
                content: 'business.business'
            },
            {
                property: 'og:url',
                content: this.config.siteUrl
            },
            {
                property: 'og:image',
                content: `${this.config.siteUrl}/assets/images/ajedrez-champana-collection.jpg`
            },
            {
                name: 'twitter:card',
                content: 'summary_large_image'
            },
            {
                name: 'twitter:title',
                content: 'AJEDREZ - Champaña Sin Alcohol Premium'
            },
            {
                name: 'twitter:description',
                content: 'Champaña sin alcohol en 4 sabores únicos. Perfecta para brindis y celebraciones.'
            }
        ];
        
        metaTags.forEach(meta => {
            this.updateOrCreateMetaTag(meta);
        });
        
        // Canonical URL
        this.updateOrCreateLink('canonical', this.config.siteUrl);
        
        // Hreflang para Colombia
        this.updateOrCreateLink('alternate', this.config.siteUrl, 'es-CO');
    }
    
    updateOrCreateMetaTag(metaData) {
        const selector = metaData.name ? 
            `meta[name="${metaData.name}"]` : 
            `meta[property="${metaData.property}"]`;
        
        let meta = document.querySelector(selector);
        
        if (!meta) {
            meta = document.createElement('meta');
            if (metaData.name) meta.name = metaData.name;
            if (metaData.property) meta.setAttribute('property', metaData.property);
            document.head.appendChild(meta);
        }
        
        meta.content = metaData.content;
    }
    
    updateOrCreateLink(rel, href, hreflang = null) {
        let link = document.querySelector(`link[rel="${rel}"]`);
        
        if (!link) {
            link = document.createElement('link');
            link.rel = rel;
            document.head.appendChild(link);
        }
        
        link.href = href;
        if (hreflang) link.hreflang = hreflang;
    }
    
    setupStructuredData() {
        // Schema para la organización
        const organizationSchema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S",
            "description": "Distribuidora oficial de AJEDREZ, champaña y vinos espumosos sin alcohol en Colombia",
            "foundingDate": "2016",
            "taxID": "901.000.572-1",
            "url": this.config.siteUrl,
            "logo": `${this.config.siteUrl}/assets/images/logos/hg-sas-logo.png`,
            "image": `${this.config.siteUrl}/assets/images/ajedrez-champana-collection.jpg`,
            "address": {
                "@type": "PostalAddress",
                "addressRegion": "Cundinamarca",
                "addressCountry": "CO"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": `+${this.config.businessPhone}`,
                "contactType": "sales",
                "availableLanguage": ["Spanish"],
                "serviceArea": {
                    "@type": "Country",
                    "name": "Colombia"
                }
            },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "AJEDREZ Champaña Sin Alcohol",
                "itemListElement": this.generateProductSchemas()
            },
            "sameAs": [
                `https://wa.me/${this.config.businessPhone}`
            ]
        };
        
        // Schema para el sitio web
        const websiteSchema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AJEDREZ Champaña Sin Alcohol",
            "alternateName": "COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S",
            "url": this.config.siteUrl,
            "description": "Sitio oficial de AJEDREZ, champaña sin alcohol premium en Colombia",
            "publisher": {
                "@type": "Organization",
                "name": "COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S"
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${this.config.siteUrl}#productos?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            }
        };
        
        // Schema para los productos
        const productCollectionSchema = {
            "@context": "https://schema.org",
            "@type": "ProductCollection",
            "name": "AJEDREZ Champaña Sin Alcohol",
            "description": "Colección completa de champaña sin alcohol AJEDREZ en 4 sabores únicos",
            "brand": {
                "@type": "Brand",
                "name": "AJEDREZ"
            },
            "category": "Bebidas Sin Alcohol",
            "hasPart": this.generateProductSchemas()
        };
        
        // Insertar schemas
        this.insertJsonLd('organization-schema', organizationSchema);
        this.insertJsonLd('website-schema', websiteSchema);
        this.insertJsonLd('product-collection-schema', productCollectionSchema);
    }
    
    generateProductSchemas() {
        return Object.entries(this.productData).map(([key, product]) => ({
            "@type": "Product",
            "name": product.name,
            "category": product.category,
            "brand": {
                "@type": "Brand",
                "name": "AJEDREZ"
            },
            "description": `${product.name} - Champaña sin alcohol premium con sabor ${key}`,
            "image": `${this.config.siteUrl}/assets/images/products/ajedrez-${key}-bottle.jpg`,
            "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "priceCurrency": "COP",
                "seller": {
                    "@type": "Organization",
                    "name": "COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S"
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "Colombia"
                }
            },
            "additionalProperty": [
                {
                    "@type": "PropertyValue",
                    "name": "Alcohol Content",
                    "value": "0% Vol"
                },
                {
                    "@type": "PropertyValue",
                    "name": "Volume",
                    "value": "750ml"
                }
            ]
        }));
    }
    
    insertJsonLd(id, schema) {
        let script = document.getElementById(id);
        if (!script) {
            script = document.createElement('script');
            script.id = id;
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schema);
    }
    
    initializeGoogleAnalytics() {
        // Google Analytics 4
        if (this.config.gaId !== 'GA_MEASUREMENT_ID') {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaId}`;
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            
            gtag('js', new Date());
            gtag('config', this.config.gaId, {
                send_page_view: false,
                custom_map: {
                    'custom_parameter_1': 'session_id',
                    'custom_parameter_2': 'product_interest'
                }
            });
            
            console.log('📈 Google Analytics inicializado');
        }
    }
    
    initializeFacebookPixel() {
        // Facebook Pixel
        if (this.config.fbPixelId !== 'FB_PIXEL_ID') {
            !function(f,b,e,v,n,t,s) {
                if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
            }(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', this.config.fbPixelId);
            window.fbq = fbq;
            
            console.log('📘 Facebook Pixel inicializado');
        }
    }
    
    setupEventTracking() {
        // Tracking de clics en productos
        document.addEventListener('click', (e) => {
            const productButton = e.target.closest('.product-open-catalog');
            if (productButton) {
                const productCard = productButton.closest('.product-card');
                const productType = productCard?.dataset.product;
                if (productType) {
                    this.trackProductView(productType);
                }
            }
            
            // Tracking de WhatsApp
            const whatsappButton = e.target.closest('.btn-whatsapp, .whatsapp-float');
            if (whatsappButton) {
                const productType = this.getCurrentProductContext(whatsappButton);
                this.trackWhatsAppClick(productType);
            }
            
            // Tracking de formulario
            const formSubmit = e.target.closest('form button[type="submit"]');
            if (formSubmit) {
                this.trackFormSubmission();
            }
        });
    }
    
    setupScrollTracking() {
        let scrollDepth = 0;
        const milestones = [25, 50, 75, 100];
        
        window.addEventListener('scroll', () => {
            const currentDepth = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            milestones.forEach(milestone => {
                if (currentDepth >= milestone && scrollDepth < milestone) {
                    this.trackScrollDepth(milestone);
                }
            });
            
            scrollDepth = Math.max(scrollDepth, currentDepth);
        });
    }
    
    setupConversionTracking() {
        // Tracking de conversiones clave
        const conversionEvents = [
            { selector: '.btn-whatsapp', event: 'whatsapp_contact', value: 5 },
            { selector: 'form', event: 'form_submission', value: 10 },
            { selector: '.product-open-catalog', event: 'product_interest', value: 3 }
        ];
        
        conversionEvents.forEach(({ selector, event, value }) => {
            document.addEventListener('click', (e) => {
                if (e.target.closest(selector)) {
                    this.trackConversion(event, value);
                }
            });
        });
    }
    
    // ===== MÉTODOS DE TRACKING =====
    
    trackPageView() {
        const pageData = {
            page_title: document.title,
            page_location: window.location.href,
            content_group1: 'AJEDREZ Champaña',
            content_group2: 'Distribuidora',
            session_id: this.sessionData.sessionId
        };
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', pageData);
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'PageView', {
                content_name: 'AJEDREZ Champaña Homepage',
                content_category: 'Champaña Sin Alcohol'
            });
        }
        
        this.sessionData.pageViews++;
        console.log('👁️ Page view tracked:', pageData);
    }
    
    trackProductView(productType) {
        const product = this.productData[productType];
        if (!product) return;
        
        const eventData = {
            event_category: 'product',
            event_label: productType,
            custom_parameter_2: productType,
            value: 1
        };
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item', {
                currency: 'COP',
                value: 1,
                items: [{
                    item_id: `ajedrez_${productType}`,
                    item_name: product.name,
                    item_category: 'Champaña Sin Alcohol',
                    item_brand: 'AJEDREZ',
                    quantity: 1
                }]
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: product.name,
                content_category: 'Champaña Sin Alcohol',
                content_type: 'product',
                content_ids: [`ajedrez_${productType}`]
            });
        }
        
        console.log(`👀 Product view tracked: ${product.name}`);
    }
    
    trackWhatsAppClick(productType = 'general') {
        const eventData = {
            event_category: 'contact',
            event_label: `whatsapp_${productType}`,
            value: 5
        };
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact', eventData);
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact', {
                content_name: `WhatsApp ${productType}`,
                content_category: 'Contact',
                value: 5,
                currency: 'COP'
            });
        }
        
        console.log(`📱 WhatsApp click tracked: ${productType}`);
    }
    
    trackFormSubmission() {
        const eventData = {
            event_category: 'form',
            event_label: 'contact_form',
            value: 10
        };
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', {
                currency: 'COP',
                value: 10
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Contact Form',
                content_category: 'Lead Generation',
                value: 10,
                currency: 'COP'
            });
        }
        
        console.log('📝 Form submission tracked');
    }
    
    trackScrollDepth(depth) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll', {
                event_category: 'engagement',
                event_label: `${depth}%`,
                value: depth
            });
        }
        
        console.log(`📜 Scroll depth tracked: ${depth}%`);
    }
    
    trackConversion(event, value) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                event_category: 'conversion',
                event_label: event,
                value: value
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'Conversion', {
                content_name: event,
                value: value,
                currency: 'COP'
            });
        }
        
        console.log(`💰 Conversion tracked: ${event} (${value})`);
    }
    
    // ===== MÉTODOS DE UTILIDAD =====
    
    getCurrentProductContext(element) {
        const productCard = element.closest('.product-card');
        if (productCard) {
            return productCard.dataset.product || 'unknown';
        }
        
        const catalogModal = element.closest('.catalog-modal');
        if (catalogModal && window.catalogSystem) {
            return window.catalogSystem.getCurrentProduct() || 'unknown';
        }
        
        return 'general';
    }
    
    updatePageTitle(newTitle) {
        document.title = newTitle;
        
        // Actualizar meta tags
        this.updateOrCreateMetaTag({
            property: 'og:title',
            content: newTitle
        });
    }
    
    // ===== MÉTODOS PÚBLICOS =====
    
    trackCustomEvent(eventName, category, label, value = 1) {
        const eventData = {
            event_category: category,
            event_label: label,
            value: value
        };
        
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        console.log(`📊 Custom event tracked: ${eventName}`);
    }
    
    getSessionData() {
        return {
            ...this.sessionData,
            currentUrl: window.location.href,
            timeOnSite: Date.now() - this.sessionData.startTime
        };
    }
    
    getKeywords() {
        return this.keywords;
    }
    
    generateSEOReport() {
        return {
            metaTags: this.getMetaTagsStatus(),
            structuredData: this.getStructuredDataStatus(),
            keywords: this.keywords,
            session: this.getSessionData(),
            analytics: {
                ga: typeof gtag !== 'undefined',
                fbPixel: typeof fbq !== 'undefined'
            }
        };
    }
    
    getMetaTagsStatus() {
        const requiredMetas = ['description', 'keywords', 'og:title', 'og:description'];
        const status = {};
        
        requiredMetas.forEach(meta => {
            const element = document.querySelector(`meta[name="${meta}"], meta[property="${meta}"]`);
            status[meta] = {
                exists: !!element,
                content: element?.content || null,
                length: element?.content?.length || 0
            };
        });
        
        return status;
    }
    
    getStructuredDataStatus() {
        const schemas = ['organization-schema', 'website-schema', 'product-collection-schema'];
        const status = {};
        
        schemas.forEach(schema => {
            const element = document.getElementById(schema);
            status[schema] = {
                exists: !!element,
                valid: this.validateJsonLd(element?.textContent)
            };
        });
        
        return status;
    }
    
    validateJsonLd(jsonString) {
        try {
            if (!jsonString) return false;
            const parsed = JSON.parse(jsonString);
            return parsed['@context'] && parsed['@type'];
        } catch {
            return false;
        }
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    window.seoAnalytics = new SEOAnalytics();
    
    // Funciones globales para testing
    window.trackCustomEvent = (event, category, label, value) => 
        window.seoAnalytics.trackCustomEvent(event, category, label, value);
    window.getSEOReport = () => window.seoAnalytics.generateSEOReport();
    window.getSessionData = () => window.seoAnalytics.getSessionData();
});

// Exportar para otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOAnalytics;
}

/* ===== COMANDOS DE TESTING =====

// Evento personalizado
trackCustomEvent('test_event', 'testing', 'manual', 1)

// Reporte SEO completo
getSEOReport()

// Datos de sesión
getSessionData()

// Ver sistema
seoAnalytics

===============================================*/