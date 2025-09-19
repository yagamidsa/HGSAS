document.addEventListener('DOMContentLoaded', function () {
    console.log('🔧 Inicializando splash screen...');
    
    const splashScreen = document.getElementById('videoSplashScreen');
    const splashVideo = document.getElementById('splashVideo');
    const mainContent = document.getElementById('mainContent');
    
    // VERIFICAR QUE LOS ELEMENTOS EXISTAN
    if (splashVideo) {
        console.log('📹 Video encontrado, configurando...');
        try {
            splashVideo.muted = true;
            splashVideo.autoplay = true;
            splashVideo.playsInline = true; // Para móviles
            
            // Reproducir el video
            splashVideo.play().then(() => {
                console.log('✅ Video reproduciéndose');
            }).catch(error => {
                console.log('⚠️ No se pudo reproducir video:', error);
                // Si falla, pasar directamente al contenido
                hideSplashScreen();
            });
            
            // Cuando termine el video, mostrar contenido
            splashVideo.addEventListener('ended', () => {
                console.log('📹 Video terminado');
                hideSplashScreen();
            });
            
            // Timeout de seguridad (máximo 5 segundos)
            setTimeout(() => {
                console.log('⏰ Timeout del video');
                hideSplashScreen();
            }, 5000);
            
        } catch (error) {
            console.error('❌ Error configurando video:', error);
            hideSplashScreen();
        }
    } else {
        console.log('⚠️ No se encontró elemento de video, saltando splash screen');
        // Si no hay video, mostrar contenido inmediatamente
        hideSplashScreen();
    }
    
    function hideSplashScreen() {
        if (splashScreen) {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 500);
        }
        
        if (mainContent) {
            mainContent.style.display = 'block';
            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 100);
        }
        
        console.log('✅ Splash screen ocultado');
    }
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