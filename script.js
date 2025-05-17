// script.js
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar si hay un usuario logueado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || !currentUser.id) {
        // Si no hay usuario, redirigir al login
        window.location.href = 'login.html';
        return;
    }

    const userId = currentUser.id; // Obtener el ID del usuario actual

    // --- Lógica del Calendario y Actividades (existente) ---
    const calendarEl = document.getElementById('calendar');
    const selectedDateEl = document.getElementById('selected-date');
    const activitiesListEl = document.getElementById('activities-list');
    const activityInputEl = document.getElementById('activity-input');
    const addActivityBtn = document.getElementById('add-activity');

    let selectedDate = new Date(); // La fecha seleccionada por defecto

    function renderCalendar() {
        calendarEl.innerHTML = '';
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Ir al domingo de esta semana

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);

            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            if (date.toDateString() === selectedDate.toDateString()) {
                dayDiv.classList.add('selected');
            }
            if (date.toDateString() === today.toDateString()) {
                dayDiv.classList.add('today');
            }

            dayDiv.innerHTML = `<span>${date.toLocaleString('es-ES', { weekday: 'short' })}</span><span>${date.getDate()}</span>`;
            dayDiv.dataset.date = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD para la API

            dayDiv.addEventListener('click', () => {
                document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
                dayDiv.classList.add('selected');
                selectedDate = new Date(dayDiv.dataset.date);
                selectedDateEl.textContent = selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
                loadActivitiesForDate(userId, dayDiv.dataset.date);
            });
            calendarEl.appendChild(dayDiv);
        }
        selectedDateEl.textContent = selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    async function loadActivitiesForDate(userId, date) {
        activitiesListEl.innerHTML = 'Cargando actividades...';
        try {
            // Podrías tener un endpoint PHP que obtenga hábitos Y completaciones para una fecha
            // Por ahora, usaremos get_user_habits.php y asumiremos que luego marcarás la completación
            const response = await fetch(`http://tu-dominio-infinityfree.com/get_user_habits.php?user_id=${userId}`);
            const data = await response.json();

            activitiesListEl.innerHTML = ''; // Limpiar antes de añadir
            if (data.success && data.data.length > 0) {
                data.data.forEach(habit => {
                    const li = document.createElement('li');
                    li.textContent = habit.name;
                    // Aquí podrías añadir un checkbox o botón para "Marcar como completado"
                    const completeButton = document.createElement('button');
                    completeButton.textContent = 'Completar';
                    completeButton.classList.add('complete-btn');
                    completeButton.dataset.habitId = habit.id;
                    completeButton.addEventListener('click', async () => {
                        await recordCompletion(userId, habit.id, date);
                        // Recargar actividades para ver el cambio (o actualizar UI)
                        loadActivitiesForDate(userId, date);
                    });
                    li.appendChild(completeButton);
                    activitiesListEl.appendChild(li);
                });
            } else {
                activitiesListEl.textContent = 'No tienes hábitos registrados para este día o no hay conexión.';
            }
        } catch (error) {
            console.error('Error al cargar actividades:', error);
            activitiesListEl.textContent = 'Error al cargar actividades.';
        }
    }

    // --- Función para Agregar Nuevo Hábito ---
    addActivityBtn.addEventListener('click', async function() {
        const activityName = activityInputEl.value.trim();
        if (activityName === '') {
            alert('Por favor, ingresa una actividad.');
            return;
        }

        const newHabitData = {
            user_id: userId,
            name: activityName,
            description: "Hábito añadido desde la app.",
            frequency: "daily" // O podrías permitir al usuario elegir la frecuencia
        };

        try {
            const response = await fetch('http://tu-dominio-infinityfree.com/add_habit.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHabitData)
            });
            const data = await response.json();

            if (data.success) {
                alert('Hábito añadido exitosamente!');
                activityInputEl.value = ''; // Limpiar input
                loadActivitiesForDate(userId, selectedDate.toISOString().split('T')[0]); // Recargar la lista
            } else {
                alert('Error al añadir hábito: ' + data.message);
            }
        } catch (error) {
            console.error('Error de red o API al añadir hábito:', error);
            alert('Error de conexión al añadir hábito.');
        }
    });

    // --- Función para Registrar Completación ---
    async function recordCompletion(userId, habitId, completionDate) {
        const completionData = {
            user_id: userId,
            habit_id: habitId,
            completion_date: completionDate
        };

        try {
            const response = await fetch('http://tu-dominio-infinityfree.com/record_completion.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completionData)
            });
            const data = await response.json();

            if (data.success) {
                alert('¡Hábito completado!');
            } else {
                alert('Error al completar hábito: ' + data.message);
            }
        } catch (error) {
            console.error('Error de red o API al registrar completación:', error);
            alert('Error de conexión al registrar completación.');
        }
    }

    // --- Cargar Insignias en la Sección de Insignias (en index.html) ---
    async function loadAllBadges() {
        const badgesGrid = document.querySelector('.badges-panel .badges-grid');
        badgesGrid.innerHTML = 'Cargando insignias...';
        try {
            const response = await fetch('http://tu-dominio-infinityfree.com/get_all_badges.php');
            const data = await response.json();

            badgesGrid.innerHTML = ''; // Limpiar antes de añadir
            if (data.success && data.data.length > 0) {
                data.data.forEach(badge => {
                    const badgeItem = document.createElement('div');
                    badgeItem.classList.add('badge-item');
                    // Puedes añadir 'incomplete' si no la tiene el usuario (esto requeriría otra llamada o datos más complejos)
                    // Por ahora, solo muestra todas las insignias disponibles.

                    const badgeIcon = document.createElement('div');
                    badgeIcon.classList.add('badge-icon');
                    badgeIcon.innerHTML = `<span class="icon-emoji">${badge.icon_emoji || '❓'}</span>`;

                    const badgeName = document.createElement('h3');
                    badgeName.textContent = badge.name;

                    badgeItem.appendChild(badgeIcon);
                    badgeItem.appendChild(badgeName);
                    badgesGrid.appendChild(badgeItem);
                });
            } else {
                badgesGrid.innerHTML = '<p>No se encontraron insignias.</p>';
            }
        } catch (error) {
            console.error('Error al cargar todas las insignias:', error);
            badgesGrid.innerHTML = '<p>Error al cargar las insignias disponibles.</p>';
        }
    }

    // --- Ejecución Inicial ---
    renderCalendar();
    // Cargar actividades para la fecha seleccionada por defecto al iniciar
    loadActivitiesForDate(userId, selectedDate.toISOString().split('T')[0]);
    loadAllBadges(); // Cargar todas las insignias disponibles

    // --- Lógica del menú hamburguesa (si no la tienes ya) ---
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
});
