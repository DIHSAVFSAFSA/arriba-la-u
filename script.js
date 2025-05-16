document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const menuOverlay = document.getElementById('menu-overlay'); // Obtener el overlay
    const body = document.body; // Obtener el body para controlar el scroll

    // Función para abrir el menú
    function openMenu() {
        mainNav.classList.add('open'); // Añade la clase para mostrar el menú
        menuOverlay.classList.add('visible'); // Muestra el overlay
        menuToggle.textContent = '✕'; // Cambia el icono a cerrar
        menuToggle.setAttribute('aria-expanded', 'true'); // Para accesibilidad
        body.style.overflow = 'hidden'; // Evita el scroll del cuerpo
    }

    // Función para cerrar el menú
    function closeMenu() {
        mainNav.classList.remove('open'); // Quita la clase para ocultar el menú
        menuOverlay.classList.remove('visible'); // Oculta el overlay
        menuToggle.textContent = '☰'; // Restaura el icono de hamburguesa
        menuToggle.setAttribute('aria-expanded', 'false'); // Para accesibilidad
        body.style.overflow = ''; // Restaura el scroll del cuerpo
    }

    // Verificar que los elementos existen
    if (menuToggle && mainNav && menuOverlay) {
        // Añadir "escuchador" al botón hamburguesa
        menuToggle.addEventListener('click', function() {
            if (mainNav.classList.contains('open')) {
                closeMenu(); // Si está abierto, ciérralo
            } else {
                openMenu(); // Si está cerrado, ábrelo
            }
        });

        // Cerrar el menú si se hace clic en el overlay
        menuOverlay.addEventListener('click', function() {
            closeMenu();
        });

        // Cerrar el menú si se hace clic en un enlace del menú (para navegar y cerrar)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                 // Pequeño retraso para dar tiempo a la animación antes de la navegación
                setTimeout(closeMenu, 100);
            });
        });

         // Cerrar el menú si se redimensiona la ventana (de móvil a escritorio)
        window.addEventListener('resize', function() {
            // Usar el mismo breakpoint que en el CSS
            if (window.innerWidth > 768) {
                closeMenu(); // Asegura que el menú esté cerrado en pantallas grandes
            }
        });

    } else {
        console.error('Error: No se encontró el botón del menú, la navegación principal o el overlay.');
    }
});

const calendarEl = document.getElementById('calendar');
    const selectedDateEl = document.getElementById('selected-date');
    const activitiesListEl = document.getElementById('activities-list');
    const activityInput = document.getElementById('activity-input');
    const addActivityBtn = document.getElementById('add-activity');
    let activities = {};
    let selectedDate;
function formatDate(date) {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' });
}
function getMonday(d) {
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff);
}
function renderCalendar() {
    const today = new Date();
    const monday = getMonday(today);
    for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const card = document.createElement('div');
    card.className = 'card-day';
    card.dataset.date = date.toISOString().split('T')[0];
    card.innerHTML = `<div class="card-day__name">${date.toLocaleDateString('es-ES', { weekday: 'short' })}</div>` +
                         `<div class="card-day__date">${date.getDate()}</div>`;
    card.addEventListener('click', () => selectDate(date));
    calendarEl.appendChild(card);
    
    if (date.toDateString() === today.toDateString()) selectDate(date);
    }
}
function selectDate(date) {
    selectedDate = date.toISOString().split('T')[0];
    document.querySelectorAll('.card-day').forEach(c => c.classList.remove('card-day--selected'));
    document.querySelector(`.card-day[data-date="${selectedDate}"]`).classList.add('card-day--selected');
    selectedDateEl.textContent = formatDate(date);
    renderActivities();
}
function renderActivities() {
    activitiesListEl.innerHTML = '';
    const list = activities[selectedDate] || [];
    list.forEach(act => {
    const li = document.createElement('li');
    li.textContent = act;
    activitiesListEl.appendChild(li);
    });
}
addActivityBtn.addEventListener('click', () => {
    const text = activityInput.value.trim();
    if (!text) return;
    activities[selectedDate] = activities[selectedDate] || [];
    activities[selectedDate].push(text);
    activityInput.value = '';
    renderActivities();
});
renderCalendar();
