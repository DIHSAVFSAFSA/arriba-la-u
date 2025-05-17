// perfil.js
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar si hay un usuario logueado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !currentUser.id) {
        // Si no hay usuario, redirigir al login
        window.location.href = 'login.html';
        return;
    }

    // Obtener elementos HTML para mostrar el perfil
    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email strong'); // Ajusta el selector
    const profileConnectedDays = document.querySelector('.profile-connected-days strong'); // Ajusta el selector
    const profileBio = document.querySelector('.profile-bio');
    const badgesGrid = document.querySelector('.badges-grid');

    // Función para cargar datos del perfil
    async function loadUserProfile(userId) {
        try {
            const response = await fetch(`http://tu-dominio-infinityfree.com/get_user_profile.php?user_id=${userId}`);
            const data = await response.json();

            if (data.success) {
                const user = data.data;
                profileName.textContent = user.username || 'Usuario Desconocido';
                profileEmail.textContent = 'Correo: ' + (user.email || 'N/A');
                profileConnectedDays.textContent = 'Días Conectado: ' + (user.days_connected || 0);
                profileBio.textContent = user.bio || 'Sin biografía.';
            } else {
                console.error("Error al cargar perfil:", data.message);
                profileName.textContent = 'Error al cargar perfil';
                profileEmail.textContent = '';
                profileConnectedDays.textContent = '';
                profileBio.textContent = '';
            }
        } catch (error) {
            console.error('Error de red o API al cargar perfil:', error);
            profileName.textContent = 'Error de conexión';
        }
    }

    // Función para cargar las insignias del usuario
    async function loadUserBadges(userId) {
        try {
            const response = await fetch(`http://tu-dominio-infinityfree.com/get_user_badges.php?user_id=${userId}`);
            const data = await response.json();

            badgesGrid.innerHTML = ''; // Limpiar insignias existentes

            if (data.success && data.data.length > 0) {
                data.data.forEach(badge => {
                    const badgeItem = document.createElement('div');
                    badgeItem.classList.add('badge-item');

                    const badgeIcon = document.createElement('div');
                    badgeIcon.classList.add('badge-icon');
                    badgeIcon.innerHTML = `<span class="icon-emoji">${badge.icon_emoji || '🏅'}</span>`; // Usa el emoji de la BD
                    // Puedes añadir clases CSS dinámicamente si tienes estilos para cada tipo de insignia
                    // badgeIcon.classList.add(`badge-${badge.name.toLowerCase().replace(/\s/g, '-')}`);

                    const badgeName = document.createElement('p');
                    badgeName.textContent = badge.name; // Nombre de la insignia de la BD

                    badgeItem.appendChild(badgeIcon);
                    badgeItem.appendChild(badgeName);
                    badgesGrid.appendChild(badgeItem);
                });
            } else {
                badgesGrid.innerHTML = '<p>Este usuario no tiene insignias todavía.</p>';
            }
        } catch (error) {
            console.error('Error de red o API al cargar insignias:', error);
            badgesGrid.innerHTML = '<p>Error al cargar las insignias.</p>';
        }
    }

    // Cargar datos cuando la página carga
    await loadUserProfile(currentUser.id);
    await loadUserBadges(currentUser.id);


    // Lógica para el menú hamburguesa (si no la tienes ya en un script global)
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuToggle && mainNav && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });

        menuOverlay.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }

    // Lógica para compartir (si no la tienes ya)
    const shareFacebookBtn = document.getElementById('shareFacebookBtn');
    const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
    const shareInstagramBtn = document.getElementById('shareInstagramBtn');

    const shareText = "¡Estoy usando HábitoTracker para mejorar mis hábitos! ¡Únete!";
    const shareUrl = "https://tu-pagina-github.github.io/"; // Reemplaza con la URL de tu página de GitHub

    if (shareFacebookBtn) {
        shareFacebookBtn.addEventListener('click', () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        });
    }
    if (shareWhatsappBtn) {
        shareWhatsappBtn.addEventListener('click', () => {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        });
    }
    // Instagram no tiene una API de compartir directa para post (solo stories),
    // puedes simplemente abrir la app y que el usuario suba manualmente o dar un mensaje.
    if (shareInstagramBtn) {
        shareInstagramBtn.addEventListener('click', () => {
            alert('Para compartir en Instagram, puedes hacer una captura de pantalla y subirla manualmente. ¡No olvides etiquetarnos!');
            // Opcional: Abrir Instagram en una nueva pestaña (no compartirá directamente)
            // window.open('https://www.instagram.com/', '_blank');
        });
    }
});
