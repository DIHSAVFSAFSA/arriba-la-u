document.addEventListener('DOMContentLoaded', function() {

    // --- Variables Globales ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const menuOverlay = document.getElementById('menu-overlay');
    const body = document.body;

    // Variables relacionadas con actividades y calendario (pueden no estar en esta página de perfil)
    // const calendarEl = document.getElementById('calendar');
    // const selectedDateEl = document.getElementById('selected-date');
    // const activitiesListEl = document.getElementById('activities-list');
    // const activityInput = document.getElementById('activity-input');
    // const addActivityBtn = document.getElementById('add-activity');

    // Botones de Compartir (ahora con IDs específicos)
    const shareFacebookBtn = document.getElementById('shareFacebookBtn');
    const shareInstagramBtn = document.getElementById('shareInstagramBtn');
    const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');

    // Lógica para compartir logros (si los botones existen)
    if (shareFacebookBtn && shareInstagramBtn && shareWhatsappBtn) {
        const pageUrl = window.location.href;
        // Obtiene la racha actual (ejemplo, puede venir de una API o localStorage)
        const currentStreak = parseInt(localStorage.getItem('streakCount') || '0', 10);
        const shareMessage = `¡He alcanzado una racha de ${currentStreak} días en HábitoTracker! 💪 Mira mis logros aquí: `;

        // Funcionalidad para Compartir en Facebook
        shareFacebookBtn.addEventListener('click', function() {
            const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
            window.open(facebookShareUrl, '_blank');
        });

        // Funcionalidad para Compartir en WhatsApp
        shareWhatsappBtn.addEventListener('click', function() {
            const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + pageUrl)}`;
            window.open(whatsappShareUrl, '_blank');
        });

        // Funcionalidad para Compartir en Instagram (Limitaciones Web)
        shareInstagramBtn.addEventListener('click', function() {
            alert("Para compartir en Instagram, te recomendamos tomar una captura de pantalla de tus logros y subirla directamente desde la aplicación móvil de Instagram.");
        });

    } else {
        console.warn('Error: No se encontraron todos los botones de compartir (Facebook, Instagram, WhatsApp).');
    }

    // Lógica de menú lateral (hamburguesa)
    function openMenu() {
        mainNav.classList.add('open');
        menuOverlay.classList.add('visible');
        menuToggle.textContent = '✕'; // Cambia el icono a una 'X'
        menuToggle.setAttribute('aria-expanded', 'true');
        body.style.overflow = 'hidden'; // Evita el scroll en el body cuando el menú está abierto
    }

    function closeMenu() {
        mainNav.classList.remove('open');
        menuOverlay.classList.remove('visible');
        menuToggle.textContent = '☰'; // Vuelve al icono de hamburguesa
        menuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = ''; // Restablece el scroll del body
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
                closeMenu();
            });
        });

        // Cerrar menú si se redimensiona la ventana a tamaño de escritorio
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) { // Usar el mismo breakpoint que en el CSS
                closeMenu();
            }
        });
    } else {
        console.error('Error: No se encontraron todos los elementos necesarios para el menú (menu-toggle, main-nav o menu-overlay). Asegúrate de que los IDs en el HTML son correctos.');
    }

    // Estas variables y lógica parecen ser de la funcionalidad principal del tracker y no directamente del perfil.
    // Se mantienen aquí por si se usan en otras partes de tu aplicación.
    let activities = JSON.parse(localStorage.getItem('activities')) || {};
    let selectedDate;
    let streakBadgeH3 = null;
    const badgeItems = document.querySelectorAll('.badge-item');

});
