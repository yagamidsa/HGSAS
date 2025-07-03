/* ===================================================================
   CATÁLOGO DIGITAL JAVASCRIPT - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Control de apertura/cierre y efectos 3D del catálogo
   =================================================================== */

class CatalogController {
    constructor() {
        this.activeCatalog = null;
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        console.log('🎯 Catálogo Digital inicializado correctamente');
    }
    
    setupEventListeners() {
        // Botones para abrir catálogos
        const catalogButtons = document.querySelectorAll('.product-open-catalog');
        catalogButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCatalog(button);
            });
        });
        
        // Botones para cerrar catálogos
        const closeButtons = document.querySelectorAll('.catalog-close');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeCatalog();
            });
        });
        
        // Cerrar al hacer click en el overlay
        const catalogs = document.querySelectorAll('.product-catalog');
        catalogs.forEach(catalog => {
            catalog.addEventListener('click', (e) => {
                if (e.target === catalog) {
                    this.closeCatalog();
                }
            });
        });
        
        // Prevenir cierre al hacer click en el contenido
        const catalogContents = document.querySelectorAll('.catalog-content');
        catalogContents.forEach(content => {
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }
    
    openCatalog(button) {
        if (this.isOpen) {
            this.closeCatalog();
            return;
        }
        
        // Encontrar el catálogo correspondiente al botón
        const productCard = button.closest('.product-card');
        const catalogId = this.getCatalogId(productCard);
        const catalog = document.getElementById(catalogId);
        
        if (!catalog) {
            console.error('Catálogo no encontrado:', catalogId);
            return;
        }
        
        // Efecto 3D en el botón antes de abrir
        this.animateButton(button);
        
        // Abrir catálogo después de un delay
        setTimeout(() => {
            this.showCatalog(catalog);
        }, 200);
    }
    
    getCatalogId(productCard) {
        // Detectar qué producto es basado en el contenido
        const productName = productCard.querySelector('.product-name')?.textContent || '';
        
        if (productName.includes('Rosado')) return 'catalog-rosado';
        if (productName.includes('Cereza')) return 'catalog-cereza';
        if (productName.includes('Manzana')) return 'catalog-manzana';
        if (productName.includes('Uva')) return 'catalog-uva';
        
        // Fallback: usar el data-product attribute
        const dataProduct = productCard.getAttribute('data-product');
        if (dataProduct) return `catalog-${dataProduct}`;
        
        return null;
    }
    
    showCatalog(catalog) {
        this.activeCatalog = catalog;
        this.isOpen = true;
        
        // Mostrar overlay
        catalog.setAttribute('aria-hidden', 'false');
        catalog.classList.add('active');
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        // Efecto de aparición 3D
        const content = catalog.querySelector('.catalog-content');
        if (content) {
            content.style.transform = 'rotateY(-15deg) scale(0.8)';
            
            requestAnimationFrame(() => {
                content.style.transform = 'rotateY(0deg) scale(1)';
            });
        }
        
        // Focus en el botón de cierre para accesibilidad
        const closeButton = catalog.querySelector('.catalog-close');
        if (closeButton) {
            setTimeout(() => {
                closeButton.focus();
            }, 300);
        }
        
        // Analytics
        this.trackCatalogOpen(catalog.id);
    }
    
    closeCatalog() {
        if (!this.isOpen || !this.activeCatalog) return;
        
        const catalog = this.activeCatalog;
        const content = catalog.querySelector('.catalog-content');
        
        // Efecto de cierre 3D
        if (content) {
            content.style.transform = 'rotateY(-15deg) scale(0.8)';
        }
        
        // Ocultar después de la animación
        setTimeout(() => {
            catalog.classList.remove('active');
            catalog.setAttribute('aria-hidden', 'true');
            
            // Restaurar scroll del body
            document.body.style.overflow = 'auto';
            
            this.isOpen = false;
            this.activeCatalog = null;
        }, 300);
        
        // Analytics
        this.trackCatalogClose(catalog.id);
    }
    
    animateButton(button) {
        // Efecto 3D en el botón
        button.style.transform = 'translateZ(15px) rotateX(-8deg) scale(0.95)';
        
        setTimeout(() => {
            button.style.transform = 'translateZ(10px) rotateX(-5deg) scale(1)';
        }, 150);
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    e.preventDefault();
                    this.closeCatalog();
                    break;
                    
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
            }
        });
    }
    
    handleTabNavigation(e) {
        if (!this.activeCatalog) return;
        
        const focusableElements = this.activeCatalog.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    trackCatalogOpen(catalogId) {
        const productName = catalogId.replace('catalog-', '');
        
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'catalog_open', {
                'product_name': productName,
                'engagement_time_msec': Date.now()
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: `AJEDREZ ${productName}`,
                content_category: 'product_catalog'
            });
        }
        
        console.log(`📖 Catálogo abierto: ${productName}`);
    }
    
    trackCatalogClose(catalogId) {
        const productName = catalogId.replace('catalog-', '');
        console.log(`📖 Catálogo cerrado: ${productName}`);
    }
    
    // Método público para abrir catálogo por ID
    openCatalogById(catalogId) {
        const catalog = document.getElementById(catalogId);
        if (catalog) {
            this.showCatalog(catalog);
        }
    }
    
    // Método público para cerrar cualquier catálogo activo
    closeActiveCatalog() {
        this.closeCatalog();
    }
    
    // Método público para obtener el estado
    getState() {
        return {
            isOpen: this.isOpen,
            activeCatalog: this.activeCatalog?.id || null
        };
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.catalogController = new CatalogController();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CatalogController;
}