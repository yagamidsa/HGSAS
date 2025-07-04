/* ===================================================================
   CATÁLOGO SIMPLE - js/catalog.js
   JavaScript que SÍ FUNCIONA - Sin complicaciones
   =================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🎯 Catálogo simple iniciado');
    
    // Variables globales
    let catalogoActivo = null;
    
    // ===== FUNCIÓN PARA ABRIR CATÁLOGO =====
    function abrirCatalogo(button) {
        // Encontrar el producto
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        
        let catalogoId = '';
        
        // Detectar qué catálogo abrir
        if (productName.includes('Rosado')) {
            catalogoId = 'catalog-rosado';
        } else if (productName.includes('Cereza')) {
            catalogoId = 'catalog-cereza';
        } else if (productName.includes('Manzana')) {
            catalogoId = 'catalog-manzana';
        } else if (productName.includes('Uva')) {
            catalogoId = 'catalog-uva';
        }
        
        const catalogo = document.getElementById(catalogoId);
        
        if (catalogo) {
            catalogoActivo = catalogo;
            catalogo.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            console.log('📖 Catálogo abierto:', catalogoId);
            
            // Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'catalog_open', {
                    'product_name': productName
                });
            }
        }
    }
    
    // ===== FUNCIÓN PARA CERRAR CATÁLOGO =====
    function cerrarCatalogo() {
        if (catalogoActivo) {
            catalogoActivo.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            console.log('📖 Catálogo cerrado');
            
            catalogoActivo = null;
        }
    }
    
    // ===== EVENT LISTENERS =====
    
    // Botones "Ver Detalles"
    document.querySelectorAll('.product-open-catalog').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            abrirCatalogo(this);
        });
    });
    
    // Botones de cerrar (X)
    document.querySelectorAll('.catalog-close').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            cerrarCatalogo();
        });
    });
    
    // Click fuera del catálogo
    document.querySelectorAll('.product-catalog').forEach(catalogo => {
        catalogo.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarCatalogo();
            }
        });
    });
    
    // Tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && catalogoActivo) {
            cerrarCatalogo();
        }
    });
    
    // ===== FUNCIONES GLOBALES PARA TESTING =====
    window.abrirCatalogoTest = function(tipo) {
        const catalogo = document.getElementById('catalog-' + tipo);
        if (catalogo) {
            catalogoActivo = catalogo;
            catalogo.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    window.cerrarCatalogoTest = function() {
        cerrarCatalogo();
    };
    
    console.log('✅ Catálogo listo. Test: abrirCatalogoTest("rosado")');
});

/* ===== COMANDOS PARA TESTING EN CONSOLA =====

// Abrir catálogos específicos:
abrirCatalogoTest('rosado')
abrirCatalogoTest('cereza') 
abrirCatalogoTest('manzana')
abrirCatalogoTest('uva')

// Cerrar catálogo:
cerrarCatalogoTest()

=======================================================*/