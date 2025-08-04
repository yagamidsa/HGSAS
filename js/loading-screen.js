document.addEventListener('DOMContentLoaded', function () {
    const splashScreen = document.getElementById('videoSplashScreen');
    const splashVideo = document.getElementById('splashVideo');
    const mainContent = document.getElementById('mainContent');

    // Configuración del video
    splashVideo.muted = true;
    splashVideo.autoplay = true;

    // Función para ocultar splash y mostrar contenido
    function hideSplashScreen() {
        splashScreen.classList.add('hidden');

        // Después de la transición, mostrar contenido principal
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.style.display = 'block';
            document.body.style.overflow = 'auto';
        }, 800);
    }

    // Configurar timer de 6 segundos
    let splashTimer = setTimeout(() => {
        hideSplashScreen();
    }, 6000);

    // Si el video termina antes de 6 segundos, esperar a que se complete el tiempo
    splashVideo.addEventListener('ended', function () {
        // No hacer nada, dejar que el timer se encargue
        console.log('Video terminado, esperando timer...');
    });

    // Manejar errores de video
    splashVideo.addEventListener('error', function () {
        console.error('Error al cargar el video');
        // Si hay error, continuar después de 2 segundos
        clearTimeout(splashTimer);
        setTimeout(() => {
            hideSplashScreen();
        }, 2000);
    });

    // Asegurar que el video se reproduzca
    splashVideo.addEventListener('loadeddata', function () {
        console.log('Video cargado correctamente');
        splashVideo.play().catch(function (error) {
            console.error('Error al reproducir video:', error);
        });
    });

    // Prevenir scroll durante splash
    document.body.style.overflow = 'hidden';

    // Fallback: si después de 8 segundos no se ha ocultado, forzar
    setTimeout(() => {
        if (!splashScreen.classList.contains('hidden')) {
            hideSplashScreen();
        }
    }, 8000);
});

// Precargar el video si es posible
window.addEventListener('load', function () {
    const video = document.getElementById('splashVideo');
    if (video) {
        video.load();
    }
});


// ===== FIX SCROLL PROGRESS DESPUÉS DEL SPLASH =====
window.addEventListener('load', function() {
    setTimeout(() => {
        // Reinicializar scroll progress después del splash
        const scrollProgress = document.querySelector('.scroll-progress .progress-fill');
        const container = document.querySelector('.scroll-progress');
        
        if (scrollProgress && container) {
            // Hacer visible
            container.style.display = 'block';
            container.style.visibility = 'visible';
            container.style.opacity = '1';
            scrollProgress.style.display = 'block';
            scrollProgress.style.width = '0%';
            
            // Activar scroll tracking
            function updateProgress() {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = Math.min((scrollTop / docHeight) * 100, 100);
                scrollProgress.style.width = `${progress}%`;
            }
            
            // Calcular progreso inicial
            updateProgress();
            
            // Agregar listener
            window.addEventListener('scroll', updateProgress);
            
            console.log('✅ Scroll progress reactivado después del splash');
        }
    }, 2500); // Después de que termine el splash (2.5 segundos)
});