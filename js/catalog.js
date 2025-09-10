/* ===================================================================
   CATALOG SYSTEM - COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S
   Sistema de catálogo digital interactivo para productos AJEDREZ
   =================================================================== */

class CatalogSystem {
    constructor() {
        this.currentProduct = null;
        this.isOpen = false;
        this.catalogData = {};
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isSwipeGesture = false;

        this.init();
    }

    init() {
        this.loadCatalogData();
        this.setupProductCards();
        this.setupCatalogModal();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        this.setupAccessibility();

        console.log('📖 Catalog System inicializado');
    }

    loadCatalogData() {
        // Datos de los productos AJEDREZ
        this.catalogData = {
            'rosado': {
                name: 'AJEDREZ Rosado',
                description: 'Elegancia y frescura para brindis especiales',
                volume: '750ml',
                alcohol: '0% Vol',
                sweetener: 'Edulcorantes naturales',
                flavor: 'Rosado elegante',
                occasions: ['Celebraciones', 'Brindis', 'Reuniones familiares'],
                ingredients: [
                    'Agua carbonatada',
                    'Edulcorantes naturales (stevia, eritritol)',
                    'Saborizantes naturales',
                    'Ácido cítrico',
                    'Conservantes naturales'
                ],
                color: '#ff79c6',
                whatsappMessage: 'Buenos días, me interesa obtener información sobre el producto AJEDREZ Rosado 750ml. ¿Podrían proporcionarme detalles sobre precios, disponibilidad y condiciones de distribución? Quedo atento a su respuesta. Saludos cordiales.'
            },
            'blanco': {
                name: 'AJEDREZ Champagne Blanco',
                description: 'Pureza y distinción para momentos especiales',
                volume: '750ml',
                alcohol: '0% Vol',
                sweetener: 'Edulcorantes naturales',
                flavor: 'Champagne blanco clásico',
                profile: 'Fresco, limpio y equilibrado',
                occasions: [
                    'Brindis elegantes',
                    'Bodas',
                    'Eventos corporativos de alto nivel',
                    'Cenas de gala',
                    'Celebraciones familiares especiales'
                ],
                ingredients: [
                    'Agua carbonatada premium',
                    'Edulcorantes naturales (stevia, eritritol)',
                    'Aromas naturales de uva blanca',
                    'Ácido tartárico',
                    'Conservantes naturales',
                    'Antioxidantes naturales'
                ],
                serving: 'Servir bien frío (6-8°C) en copas flauta',
                pairing: ['Canapés', 'Mariscos', 'Quesos suaves', 'Postres delicados'],
                benefits: [
                    '0% alcohol - Apto para toda la familia',
                    'Edulcorantes naturales sin azúcares añadidos',
                    'Perfecto para conductores designados',
                    'Ideal para embarazadas y lactantes',
                    'Experiencia premium sin comprometer la salud'
                ],
                color: '#f8f8ff',
                whatsappMessage: 'Buenos días, me interesa obtener información sobre el producto AJEDREZ Blanco 750ml. ¿Podrían proporcionarme detalles sobre precios, disponibilidad y condiciones de distribución para este elegante espumoso sin alcohol? Quedo atento a su respuesta. Saludos cordiales.'
            },
            'cereza': {
                name: 'AJEDREZ Cereza',
                description: 'Intensidad frutal para celebraciones únicas',
                volume: '750ml',
                alcohol: '0% Vol',
                sweetener: 'Sabor cereza natural',
                flavor: 'Dulce, frutal, refrescante',
                occasions: ['Celebraciones especiales', 'Eventos corporativos', 'Reuniones sociales'],
                ingredients: [
                    'Agua carbonatada',
                    'Extracto natural de cereza',
                    'Edulcorantes naturales',
                    'Ácido málico',
                    'Antioxidantes naturales'
                ],
                color: '#ff5555',
                whatsappMessage: 'Buenos días, me interesa el producto AJEDREZ Cereza 750ml. ¿Podrían facilitarme información sobre precios mayoristas, cantidades mínimas de pedido y tiempos de entrega? Agradezco su pronta respuesta.'
            },
            'manzana': {
                name: 'AJEDREZ Manzana',
                description: 'Refrescancia natural y sofisticación',
                volume: '750ml',
                alcohol: '0% Vol',
                sweetener: 'Manzana fresca',
                flavor: 'Refrescante, natural, crujiente',
                occasions: ['Comidas', 'Aperitivos', 'Eventos de día'],
                ingredients: [
                    'Agua carbonatada',
                    'Jugo concentrado de manzana',
                    'Edulcorantes naturales',
                    'Ácido ascórbico (Vitamina C)',
                    'Aroma natural de manzana'
                ],
                benefits: ['Sin azúcar agregada', 'Con vitamina C', 'Antioxidantes naturales'],
                recommendations: 'Servir frío entre 4-6°C',
                color: '#50fa7b',
                whatsappMessage: 'Estimados, solicito cotización para el producto AJEDREZ Manzana 750ml. Requiero información sobre precios, descuentos por volumen y cobertura de distribución en mi zona. Muchas gracias.'
            },
            'uva': {
                name: 'AJEDREZ Uva',
                description: 'Tradición y calidad en cada sorbo',
                volume: '750ml',
                alcohol: '0% Vol',
                sweetener: 'Uva seleccionada',
                flavor: 'Tradicional, elegante, burbujas finas',
                occasions: ['Brindis tradicionales', 'Cenas elegantes', 'Celebraciones familiares'],
                ingredients: [
                    'Agua carbonatada',
                    'Mosto de uva concentrado',
                    'Edulcorantes naturales',
                    'Ácido tartárico',
                    'Sulfitos naturales'
                ],
                characteristics: ['Sabor tradicional', 'Burbujas finas', 'Aroma intenso'],
                pairing: ['Postres', 'Frutas frescas', 'Aperitivos gourmet'],
                color: '#bd93f9',
                whatsappMessage: 'Buen día, me dirijo a ustedes para solicitar información comercial sobre AJEDREZ Uva 750ml. Necesito conocer precios, condiciones de pago y requisitos para convertirme en distribuidor. Quedo pendiente de su respuesta.'
            }
        };
    }

    setupProductCards() {
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            const openButton = card.querySelector('.product-open-catalog');
            const productType = card.dataset.product;

            if (!openButton || !productType) return;

            // Click para abrir catálogo
            openButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openCatalog(productType);

                // Analytics
                this.trackCatalogOpen(productType);
            });

            // Accesibilidad con Enter/Space
            openButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openCatalog(productType);
                }
            });

            // Efecto hover mejorado
            card.addEventListener('mouseenter', () => {
                this.enhanceCardHover(card, true);
            });

            card.addEventListener('mouseleave', () => {
                this.enhanceCardHover(card, false);
            });
        });

        console.log(`🎯 ${productCards.length} tarjetas de producto configuradas`);
    }

    setupCatalogModal() {
        // Crear modal si no existe
        let catalogModal = document.getElementById('product-catalog-modal');

        if (!catalogModal) {
            catalogModal = this.createCatalogModal();
            document.body.appendChild(catalogModal);
        }

        this.catalogModal = catalogModal;
        this.catalogContent = catalogModal.querySelector('.catalog-content');
        this.catalogClose = catalogModal.querySelector('.catalog-close');

        // Eventos del modal
        this.catalogClose.addEventListener('click', () => {
            this.closeCatalog();
        });

        // Cerrar con click en backdrop
        catalogModal.addEventListener('click', (e) => {
            if (e.target === catalogModal) {
                this.closeCatalog();
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCatalog();
            }
        });
    }

    createCatalogModal() {
        const modal = document.createElement('div');
        modal.id = 'product-catalog-modal';
        modal.className = 'catalog-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'catalog-title');
        modal.innerHTML = `
            <div class="catalog-overlay"></div>
            <div class="catalog-container">
                <button class="catalog-close" aria-label="Cerrar catálogo">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
                <div class="catalog-content">
                    <!-- Contenido dinámico -->
                </div>
            </div>
        `;

        return modal;
    }

    openCatalog(productType) {
        const productData = this.catalogData[productType];

        if (!productData) {
            console.error(`❌ Producto no encontrado: ${productType}`);
            return;
        }

        this.currentProduct = productType;
        this.isOpen = true;

        // Generar contenido del catálogo
        this.generateCatalogContent(productData);

        // Mostrar modal con animación
        this.catalogModal.style.display = 'flex';
        this.catalogModal.offsetHeight; // Force reflow
        this.catalogModal.classList.add('catalog-open');

        // Focus management
        this.catalogClose.focus();

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        console.log(`📖 Catálogo abierto: ${productData.name}`);
    }

    generateCatalogContent(productData) {
        const contentHTML = `
            <div class="catalog-page" style="--product-color: ${productData.color}">
                <div class="catalog-header">
                    <div class="product-image-large">
                        <img src="images/${this.currentProduct}.png" 
                             alt="${productData.name}"
                             loading="lazy">
                        <div class="product-glow" style="background: ${productData.color}"></div>
                    </div>
                    <div class="product-info">
                        <h2 id="catalog-title" class="product-title">${productData.name}</h2>
                        <p class="product-description">${productData.description}</p>
                        
                        <div class="product-specs">
                            <div class="spec-item">
                                <span class="spec-label">Volumen:</span>
                                <span class="spec-value">${productData.volume}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Alcohol:</span>
                                <span class="spec-value">${productData.alcohol}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Perfil:</span>
                                <span class="spec-value">${productData.flavor}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="catalog-body">
                    <div class="catalog-section">
                        <h3>Ingredientes</h3>
                        <ul class="ingredients-list">
                            ${productData.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="catalog-section">
                        <h3>Ocasiones Ideales</h3>
                        <div class="occasions-grid">
                            ${productData.occasions.map(occasion => `
                                <div class="occasion-tag" style="border-color: ${productData.color}">
                                    ${occasion}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    ${productData.benefits ? `
                        <div class="catalog-section">
                            <h3>Beneficios</h3>
                            <ul class="benefits-list">
                                ${productData.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${productData.characteristics ? `
                        <div class="catalog-section">
                            <h3>Características</h3>
                            <ul class="characteristics-list">
                                ${productData.characteristics.map(char => `<li>${char}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${productData.pairing ? `
                        <div class="catalog-section">
                            <h3>Maridaje Sugerido</h3>
                            <div class="pairing-grid">
                                ${productData.pairing.map(item => `
                                    <div class="pairing-item" style="background: linear-gradient(135deg, ${productData.color}20, transparent)">
                                        ${item}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${productData.recommendations ? `
                        <div class="catalog-section">
                            <h3>Recomendaciones</h3>
                            <p class="recommendation-text">${productData.recommendations}</p>
                        </div>
                    ` : ''}
                </div>
                
                <div class="catalog-footer">
                    <a href="https://wa.me/573XXXXXXXXX?text=${encodeURIComponent(productData.whatsappMessage)}" 
                       class="btn btn-whatsapp btn-large" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       style="background: linear-gradient(135deg, #1DB954, #17a543)">
                        <svg class="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        Solicitar ${productData.name}
                    </a>
                </div>
            </div>
        `;

        this.catalogContent.innerHTML = contentHTML;

        // Setup animaciones para el contenido
        this.setupCatalogAnimations();
    }

    setupCatalogAnimations() {
        const catalogPage = this.catalogContent.querySelector('.catalog-page');
        const sections = this.catalogContent.querySelectorAll('.catalog-section');

        // Animar entrada del catálogo
        setTimeout(() => {
            catalogPage.classList.add('catalog-page-animate');

            sections.forEach((section, index) => {
                setTimeout(() => {
                    section.classList.add('section-animate');
                }, index * 100);
            });
        }, 100);
    }

    closeCatalog() {
        if (!this.isOpen) return;

        this.catalogModal.classList.remove('catalog-open');

        setTimeout(() => {
            this.catalogModal.style.display = 'none';
            this.catalogContent.innerHTML = '';
            this.isOpen = false;
            this.currentProduct = null;

            // Restore body scroll
            document.body.style.overflow = '';

        }, 300);

        console.log('📖 Catálogo cerrado');
    }

    enhanceCardHover(card, isHover) {
        const image = card.querySelector('.product-image');
        const content = card.querySelector('.product-content');
        const button = card.querySelector('.product-open-catalog');

        if (isHover) {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(189, 147, 249, 0.3)';

            if (image) {
                image.style.filter = 'brightness(1.1) contrast(1.05)';
            }

            if (button) {
                button.style.transform = 'scale(1.05)';
            }
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';

            if (image) {
                image.style.filter = '';
            }

            if (button) {
                button.style.transform = 'scale(1)';
            }
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;

            switch (e.key) {
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigateProduct('prev');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateProduct('next');
                    break;
            }
        });
    }

    setupTouchGestures() {
        document.addEventListener('touchstart', (e) => {
            if (!this.isOpen) return;

            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.isSwipeGesture = false;
        });

        document.addEventListener('touchmove', (e) => {
            if (!this.isOpen) return;

            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = touchX - this.touchStartX;
            const deltaY = touchY - this.touchStartY;

            // Detectar swipe horizontal
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                this.isSwipeGesture = true;
            }
        });

        document.addEventListener('touchend', (e) => {
            if (!this.isOpen || !this.isSwipeGesture) return;

            const touchX = e.changedTouches[0].clientX;
            const deltaX = touchX - this.touchStartX;

            if (Math.abs(deltaX) > 100) {
                if (deltaX > 0) {
                    this.navigateProduct('prev');
                } else {
                    this.navigateProduct('next');
                }
            }

            this.isSwipeGesture = false;
        });
    }

    navigateProduct(direction) {
        const products = Object.keys(this.catalogData);
        const currentIndex = products.indexOf(this.currentProduct);

        let newIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % products.length;
        } else {
            newIndex = currentIndex - 1 < 0 ? products.length - 1 : currentIndex - 1;
        }

        const newProduct = products[newIndex];
        this.openCatalog(newProduct);

        console.log(`📖 Navegando: ${this.currentProduct} → ${newProduct}`);
    }

    handleTabNavigation(e) {
        const focusableElements = this.catalogModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    setupAccessibility() {
        // Anunciar cambios de contenido para lectores de pantalla
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);

        this.announcer = announcer;
    }

    announceToScreenReader(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
            setTimeout(() => {
                this.announcer.textContent = '';
            }, 1000);
        }
    }

    trackCatalogOpen(productType) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'catalog_open', {
                event_category: 'product_catalog',
                event_label: productType,
                value: 1
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: this.catalogData[productType].name,
                content_category: 'product_catalog',
                content_type: 'product'
            });
        }

        console.log(`📊 Tracking: Catálogo abierto - ${productType}`);
    }

    // ===== MÉTODOS PÚBLICOS =====

    openProductCatalog(productType) {
        this.openCatalog(productType);
    }

    closeProductCatalog() {
        this.closeCatalog();
    }

    getCurrentProduct() {
        return this.currentProduct;
    }

    isModalOpen() {
        return this.isOpen;
    }

    updateProductData(productType, newData) {
        if (this.catalogData[productType]) {
            this.catalogData[productType] = { ...this.catalogData[productType], ...newData };
            console.log(`📖 Datos actualizados: ${productType}`);
        }
    }

    getProductData(productType) {
        return this.catalogData[productType] || null;
    }

    getAllProducts() {
        return Object.keys(this.catalogData);
    }

    getStats() {
        return {
            totalProducts: Object.keys(this.catalogData).length,
            currentProduct: this.currentProduct,
            isOpen: this.isOpen
        };
    }
}

// ===== ESTILOS CSS DINÁMICOS =====
const catalogStyles = document.createElement('style');
catalogStyles.textContent = `
    /* Modal del catálogo */
    .catalog-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        display: none;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .catalog-modal.catalog-open {
        opacity: 1;
    }
    
    .catalog-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 15, 35, 0.95);
        backdrop-filter: blur(10px);
    }
    
    .catalog-container {
        position: relative;
        width: 90vw;
        max-width: 900px;
        max-height: 90vh;
        background: linear-gradient(135deg, #1e1e3f, #0f0f23);
        border-radius: 20px;
        border: 1px solid rgba(189, 147, 249, 0.3);
        overflow: hidden;
        transform: scale(0.8);
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .catalog-modal.catalog-open .catalog-container {
        transform: scale(1);
    }
    
    .catalog-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .catalog-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }
    
    .catalog-close svg {
        width: 20px;
        height: 20px;
    }
    
    .catalog-content {
        height: 100%;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(189, 147, 249, 0.5) transparent;
    }
    
    .catalog-content::-webkit-scrollbar {
        width: 6px;
    }
    
    .catalog-content::-webkit-scrollbar-track {
        background: transparent;
    }
    
    .catalog-content::-webkit-scrollbar-thumb {
        background: rgba(189, 147, 249, 0.5);
        border-radius: 3px;
    }
    
    /* Página del catálogo */
    .catalog-page {
        padding: 30px;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .catalog-page.catalog-page-animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .catalog-header {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 30px;
        margin-bottom: 40px;
        align-items: center;
    }
    
    .product-image-large {
        position: relative;
        text-align: center;
    }
    
    .product-image-large img {
        width: 100%;
        max-width: 200px;
        height: auto;
        filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));
        transition: transform 0.3s ease;
    }
    
    .product-image-large:hover img {
        transform: scale(1.05);
    }
    
    .product-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 150px;
        height: 150px;
        border-radius: 50%;
        opacity: 0.3;
        filter: blur(50px);
        z-index: -1;
    }
    
    .product-title {
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, var(--product-color), white);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 15px;
    }
    
    .product-description {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 25px;
        line-height: 1.6;
    }
    
    .product-specs {
        display: grid;
        gap: 10px;
    }
    
    .spec-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .spec-label {
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
    }
    
    .spec-value {
        font-weight: 500;
        color: white;
    }
    
    /* Cuerpo del catálogo */
    .catalog-body {
        display: grid;
        gap: 30px;
        margin-bottom: 40px;
    }
    
    .catalog-section {
        opacity: 0;
        transform: translateX(-20px);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .catalog-section.section-animate {
        opacity: 1;
        transform: translateX(0);
    }
    
    .catalog-section h3 {
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--product-color);
        margin-bottom: 15px;
        position: relative;
    }
    
    .catalog-section h3::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 50px;
        height: 2px;
        background: var(--product-color);
    }
    
    .ingredients-list,
    .benefits-list,
    .characteristics-list {
        list-style: none;
        padding: 0;
        display: grid;
        gap: 8px;
    }
    
    .ingredients-list li,
    .benefits-list li,
    .characteristics-list li {
        position: relative;
        padding-left: 25px;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.5;
    }
    
    .ingredients-list li::before,
    .benefits-list li::before,
    .characteristics-list li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--product-color);
        font-weight: bold;
        font-size: 1.2rem;
    }
    
    .occasions-grid,
    .pairing-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
    }
    
    .occasion-tag,
    .pairing-item {
        padding: 10px 15px;
        border-radius: 20px;
        text-align: center;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .occasion-tag {
        border: 2px solid var(--product-color);
        color: white;
        background: rgba(255, 255, 255, 0.05);
    }
    
    .occasion-tag:hover {
        background: var(--product-color);
        transform: translateY(-2px);
    }
    
    .pairing-item {
        background: linear-gradient(135deg, var(--product-color)20, transparent);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .recommendation-text {
        color: rgba(255, 255, 255, 0.8);
        font-style: italic;
        line-height: 1.6;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        border-left: 4px solid var(--product-color);
    }
    
    /* Footer del catálogo */
    .catalog-footer {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .btn-large {
        padding: 15px 30px;
        font-size: 1.1rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        min-width: 250px;
        justify-content: center;
    }
    
    .whatsapp-icon {
        width: 24px;
        height: 24px;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .catalog-container {
            width: 95vw;
            max-height: 95vh;
        }
        
        .catalog-page {
            padding: 20px;
        }
        
        .catalog-header {
            grid-template-columns: 1fr;
            gap: 20px;
            text-align: center;
        }
        
        .product-title {
            font-size: 2rem;
        }
        
        .occasions-grid,
        .pairing-grid {
            grid-template-columns: 1fr;
        }
        
        .btn-large {
            width: 100%;
        }
    }
    
    /* Screen reader only */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
        .catalog-modal,
        .catalog-container,
        .catalog-page,
        .catalog-section,
        .product-image-large img,
        .occasion-tag,
        .catalog-close {
            transition: none !important;
            animation: none !important;
        }
    }
`;
document.head.appendChild(catalogStyles);

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    window.catalogSystem = new CatalogSystem();

    // Funciones globales para testing y uso
    window.openCatalog = (product) => window.catalogSystem.openProductCatalog(product);
    window.closeCatalog = () => window.catalogSystem.closeProductCatalog();
    window.catalogStats = () => window.catalogSystem.getStats();
});

// Exportar para otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CatalogSystem;
}

/* ===== COMANDOS DE TESTING =====

// Abrir catálogo específico
openCatalog('rosado')
openCatalog('cereza')
openCatalog('manzana')
openCatalog('uva')

// Cerrar catálogo
closeCatalog()

// Ver estadísticas
catalogStats()

// Ver sistema
catalogSystem

===============================================*/