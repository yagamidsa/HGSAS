/* ===================================================================
   COMERCIALIZADORA Y DISTRIBUIDORA HG S.A.S - Loading Screen
   Control del progress circular con contador de 0-100
   =================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressPercentage = document.getElementById('progress-percentage');
    
    let currentPercentage = 0;
    const targetPercentage = 100;
    const duration = 1500; // 1.5 segundos
    const startTime = Date.now();
    
    function updateProgress() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function para suavizar la animación
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        currentPercentage = Math.floor(easeOutQuart * targetPercentage);
        
        // Actualizar el número en el centro
        progressPercentage.textContent = currentPercentage;
        
        if (currentPercentage < targetPercentage) {
            requestAnimationFrame(updateProgress);
        } else {
            // Cuando llega a 100%, esperar un momento y ocultar
            setTimeout(() => {
                loadingScreen.classList.add('loaded');
                // Quitar del DOM después de la transición
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 800);
            }, 300);
        }
    }
    
    // Iniciar la animación del contador
    updateProgress();
    
    // Asegurar que el loading se muestre al inicio
    loadingScreen.style.display = 'flex';
});

// Prevenir el scroll mientras carga
document.body.style.overflow = 'hidden';

// Restaurar scroll cuando termine
window.addEventListener('load', function() {
    setTimeout(() => {
        document.body.style.overflow = 'auto';
    }, 2000);
});