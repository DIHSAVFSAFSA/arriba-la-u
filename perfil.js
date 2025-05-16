// Este código se ejecutará una vez que todo el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', function() {

    // --- Variables Globales (dentro del scope del DOMContentLoaded) ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const menuOverlay = document.getElementById('menu-overlay');
    const body = document.body;

    const calendarEl = document.getElementById('calendar');
    const selectedDateEl = document.getElementById('selected-date');
    const activitiesListEl = document.getElementById('activities-list');
    const activityInput = document.getElementById('activity-input');
    const addActivityBtn = document.getElementById('add-activity');

    const shareFacebookBtn = document.getElementById('shareFacebookBtn');
    const shareInstagramBtn = document.getElementById('shareInstagramBtn');
    const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
    if (shareFacebookBtn && shareInstagramBtn && shareWhatsappBtn) {
        const pageUrl = window.location.href;
        const currentStreak = parseInt(localStorage.getItem('streakCount') || '0', 10);
        const shareMessage = `¡He alcanzado una racha de ${currentStreak} días en HábitoTracker! 💪 Mira mis logros aquí: `;


        // Funcionalidad para Compartir en Facebook
        shareFacebookBtn.addEventListener('click', function() {
            // URL de compartir de Facebook. 'u' es la URL a compartir.
            const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
            // Abrir en una nueva ventana/pestaña
            window.open(facebookShareUrl, '_blank');
        });
                // Funcionalidad para Compartir en WhatsApp
        shareWhatsappBtn.addEventListener('click', function() {
            // URL de compartir de WhatsApp. 'text' es el mensaje codificado.
            const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + pageUrl)}`;
             // Abrir en una nueva ventana/pestaña (o intentar abrir la app si es en móvil)
            window.open(whatsappShareUrl, '_blank');
        });

        // Funcionalidad para Compartir en Instagram (Limitaciones Web)
        shareInstagramBtn.addEventListener('click', function() {
            // Explicar la limitación de compartir directamente desde la web
            alert("Para compartir en Instagram, te recomendamos tomar una captura de pantalla de tus logros y subirla directamente desde la aplicación móvil de Instagram.");
            // O podrías intentar abrir la página de Instagram (menos útil):
            // window.open('https://www.instagram.com/', '_blank');
        });

    } else {
        console.warn('Error: No se encontraron todos los botones de compartir (Facebook, Instagram, WhatsApp).');
    }
    // Cargar actividades desde localStorage al iniciar, si no hay nada, usar un objeto vacío
    let activities = JSON.parse(localStorage.getItem('activities')) || {};
    let selectedDate; // Esta variable almacenará la fecha seleccionada en formato ISO interminable (YYYY-MM-DD)

    // Variables para la lógica de racha
    let streakBadgeH3 = null; // Para encontrar el elemento H3 de la racha
    const badgeItems = document.querySelectorAll('.badge-item'); // Selecciona todos los elementos de insignia



    function openMenu() {
        mainNav.classList.add('open'); 
        menuOverlay.classList.add('visible'); 
        menuToggle.textContent = '✕'; 
        menuToggle.setAttribute('aria-expanded', 'true'); 
        body.style.overflow = 'hidden'; 
    }

    function closeMenu() {
        mainNav.classList.remove('open'); 
        menuOverlay.classList.remove('visible'); 
        menuToggle.textContent = '☰'; 
        menuToggle.setAttribute('aria-expanded', 'false'); 
        body.style.overflow = ''; 
    }

    if (menuToggle && mainNav && menuOverlay) {
        menuToggle.addEventListener('click', function() {
            if (mainNav.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Cerrar menú si se hace clic en el overlay
        menuOverlay.addEventListener('click', function() {
            closeMenu();
        });

        // Cerrar menú si se hace clic en un enlace (útil en móvil)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                 // Cierra el menú inmediatamente al hacer clic en un enlace
                 closeMenu();
                 // Si necesitas prevenir la navegación por defecto, usa event.preventDefault()
                 // event.preventDefault();
            });
        });

        // Cerrar menú si se redimensiona la ventana a tamaño de escritorio
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) { // Usar el mismo breakpoint que en el CSS
                closeMenu();
            }
        });
    } else {
        console.error('Error: No se encontraron todos los elementos necesarios para el menú (toggle, nav o overlay). Asegúrate de que los IDs en el HTML son correctos.');
    }
}); // Fin del único addEventListener('DOMContentLoaded')
