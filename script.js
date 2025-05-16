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


    // --- Funciones de Utilidad ---

    // Función auxiliar para guardar las actividades en localStorage
    function saveActivities() {
        localStorage.setItem('activities', JSON.stringify(activities));
    }

    // Helper para formatear la fecha de visualización (ej: 15/5/2025)
    function formatDateDisplay(date) {
         // Asegura que 'date' es un objeto Date válido para toLocaleDateString
         if (!(date instanceof Date) || isNaN(date)) {
            // Si no es una fecha válida, intenta crearla asumiendo que selectedDate es YYYY-MM-DD
             const parts = selectedDate.split('-');
             date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
             if (!(date instanceof Date) || isNaN(date)) {
                 return 'Fecha Inválida'; // Retorna un mensaje si aún falla
             }
         }
         return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' });
    }


    // Helper para obtener el Lunes de la semana de una fecha dada
    function getMonday(d) {
        const date = new Date(d); // Clona la fecha para no modificar la original
        const day = date.getDay();
        // Ajusta la diferencia para el inicio de la semana (0=Domingo, 1=Lunes)
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        date.setDate(diff);
        return date;
    }

    function formatAsYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses son 0-index, suma 1
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


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


    function renderCalendar() {
        calendarEl.innerHTML = ''; 
        const today = new Date();
        const monday = getMonday(today);

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const dateStr = formatAsYYYYMMDD(date); 

            const card = document.createElement('div');
            card.className = 'card-day';
            card.dataset.date = dateStr; 

            card.innerHTML = `<div class="card-day__name">${date.toLocaleDateString('es-ES', { weekday: 'short' })}</div>` +
                             `<div class="card-day__date">${date.getDate()}</div>`;

            card.addEventListener('click', () => selectDate(dateStr));

            calendarEl.appendChild(card);

            if (dateStr === formatAsYYYYMMDD(today)) {
                 selectDate(dateStr); 
            }
        }
    }


    function selectDate(dateStr) { 
        selectedDate = dateStr; 

        document.querySelectorAll('.card-day').forEach(c => c.classList.remove('card-day--selected'));
        const selectedCard = document.querySelector(`.card-day[data-date="${selectedDate}"]`);
        if (selectedCard) { // Asegúrate de que la tarjeta exista (ej: si la fecha seleccionada está en la semana visible)
            selectedCard.classList.add('card-day--selected');
        }

        // Actualiza el texto de la fecha en el título de actividades
        // Crea un objeto Date temporal para formatear, importante incluir la zona horaria 'T00:00:00'
        const displayDate = new Date(selectedDate + 'T00:00:00');
        selectedDateEl.textContent = formatDateDisplay(displayDate); // Formatea para mostrar (ej: 15/5/2025)

        renderActivities(); // Renderiza las actividades para la nueva fecha seleccionada
    }


     // Renderiza las actividades para la fecha actualmente seleccionada, incluyendo botón de borrar
    function renderActivities() {
        activitiesListEl.innerHTML = ''; // Limpia la lista actual
        // Obtiene la lista de actividades para la fecha seleccionada, o un arreglo vacío si no hay ninguna
        const list = activities[selectedDate] || [];

        if (list.length === 0) {
            activitiesListEl.innerHTML = '<li>No hay actividades para este día.</li>'; // Muestra un mensaje si la lista está vacía
            return; // Sale de la función
        }

        list.forEach((act, index) => {
            const li = document.createElement('li');
            // Usar flexbox para alinear el texto y el botón de borrar
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between'; // Separa el texto del botón
            li.style.alignItems = 'center'; // Centra verticalmente

            const textSpan = document.createElement('span'); // Envuelve el texto de la actividad en un span
            textSpan.textContent = act;
            textSpan.style.flexGrow = 1; // Permite que el texto ocupe el espacio disponible
            textSpan.style.marginRight = '10px'; // Espacio entre texto y botón

            const deleteBtn = document.createElement('button');
            // Usar un icono de FontAwesome si lo tienes, o simplemente 'X'
            // Asegúrate de que FontAwesome esté cargado en tu HTML (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">)
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.classList.add('delete-activity-btn'); // Añade una clase para estilizar
            deleteBtn.dataset.index = index; // Guarda el índice del elemento en el arreglo (importante para borrar)
            deleteBtn.setAttribute('aria-label', `Eliminar actividad: ${act}`); // Mejora la accesibilidad

            // Añade el "escuchador" de clic para el botón de borrar
            deleteBtn.addEventListener('click', function() {
                // Confirma con el usuario antes de borrar (opcional pero recomendado)
                // if (!confirm(`¿Estás seguro de eliminar la actividad "${act}"?`)) {
                //     return; // Si el usuario cancela, no hace nada
                // }

                const itemIndex = parseInt(this.dataset.index, 10); // Obtiene el índice guardado

                // Elimina la actividad del arreglo usando el índice
                // Verifica si el arreglo para la fecha seleccionada existe antes de hacer splice
                if (activities[selectedDate]) {
                    activities[selectedDate].splice(itemIndex, 1);
                    // Si después de borrar el arreglo queda vacío, elimínalo de 'activities'
                    if (activities[selectedDate].length === 0) {
                        delete activities[selectedDate];
                    }
                }


                // Guarda los cambios en localStorage
                saveActivities();

                // Vuelve a renderizar la lista para actualizar la UI
                renderActivities();
            });

            li.appendChild(textSpan); // Añade el texto al li
            li.appendChild(deleteBtn); // Añade el botón al li
            activitiesListEl.appendChild(li); // Añade el li a la lista (ul)
        });
    }


    // --- Escuchadores de Eventos Principales ---

    // Escuchador del botón hamburguesa para abrir/cerrar menú
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

    // Escuchador del botón para añadir actividades
    addActivityBtn.addEventListener('click', () => {
        const text = activityInput.value.trim();
        if (!text) return; // No añadir actividades vacías

        // Asegúrate de que exista un arreglo para la fecha seleccionada
        activities[selectedDate] = activities[selectedDate] || [];
        // Añade la nueva actividad al arreglo de la fecha seleccionada
        activities[selectedDate].push(text);

        activityInput.value = ''; // Limpia el campo de input

        saveActivities(); // Guarda los cambios en localStorage

        renderActivities(); // Vuelve a renderizar la lista para mostrar la nueva actividad
    });

     // Permitir añadir actividad presionando "Enter" en el input
     activityInput.addEventListener('keypress', function(event) {
        // Verifica si la tecla presionada fue Enter (código 13)
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita la acción por defecto (como enviar un formulario)
            addActivityBtn.click(); // Simula un clic en el botón de añadir
        }
    });


    // --- Lógica y Escuchadores para Insignias y Racha ---

    // Encontrar el elemento H3 de la insignia de racha y añadir listeners a todas las insignias
     badgeItems.forEach(badge => {
        const h3 = badge.querySelector('h3');
        if (h3 && h3.textContent.includes('Racha Prendida')) {
            streakBadgeH3 = h3; // Guarda la referencia al h3 de la racha
        }

        // (Mantén o añade tu código para el evento click en CADA insignia si lo necesitas)
        badge.style.cursor = 'pointer'; // Indica que son clickeables
        badge.addEventListener('click', function() {
            const badgeName = this.querySelector('h3').textContent;
            // Aquí puedes añadir la lógica de si la insignia está completa o no si es relevante para el clic
            // const isComplete = !this.classList.contains('incomplete');
            console.log(`¡Insignia clickeada! Nombre: "${badgeName}".`);

            // Efecto visual temporal al hacer click (usando CSS)
            this.classList.add('active-click');
            setTimeout(() => {
                this.classList.remove('active-click');
            }, 300);
        });
    });


    // Lógica principal para calcular y mostrar la racha diaria al cargar la página
    const today = new Date();
    const todayStr = formatAsYYYYMMDD(today);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = formatAsYYYYMMDD(yesterday);

    let lastCheckInDateStr = localStorage.getItem('lastCheckInDate');
    let streakCount = parseInt(localStorage.getItem('streakCount') || '0', 10);

    console.log(`--- Lógica de Racha ---`);
    console.log(`Datos guardados: Última visita=${lastCheckInDateStr}, Racha=${streakCount}`);
    console.log(`Fechas de referencia: Hoy=${todayStr}, Ayer=${yesterdayStr}`);


    if (!lastCheckInDateStr || lastCheckInDateStr !== todayStr) {
        // Si no hay fecha guardada (primera visita) O la última visita NO fue hoy
        console.log("Visitando por primera vez hoy.");
        if (lastCheckInDateStr === yesterdayStr) {
            // Si la última visita fue AYER, la racha continúa
            streakCount++;
            console.log(`Racha continúa! Nueva racha: ${streakCount}`);
        } else {
            // Si la última visita fue antes de ayer, o nunca hubo visita, la racha se reinicia (o empieza)
            streakCount = 1;
            console.log(`Racha reiniciada/iniciada. Nueva racha: ${streakCount}`);
        }

        // Actualizar la fecha de la última visita a HOY
        localStorage.setItem('lastCheckInDate', todayStr);
        // Guardar el nuevo conteo de la racha
        localStorage.setItem('streakCount', streakCount.toString());

        console.log(`Datos actualizados en localStorage: lastCheckInDate=${todayStr}, streakCount=${streakCount}`);

    } else {
        // Si la última visita fue HOY, no hacer nada con el conteo (el usuario ya entró hoy en este dispositivo/navegador)
        console.log("Visita de hoy ya registrada anteriormente. Racha sin cambios.");
    }

    // --- Actualizar el texto de la insignia de racha en la página ---
    if (streakBadgeH3) {
         // Busca la parte " xN" y la reemplaza con el nuevo número de racha
        streakBadgeH3.textContent = `Racha Prendida x${streakCount}`;
        console.log(`Texto de insignia de racha actualizado a: "${streakBadgeH3.textContent}"`);

        // Opcional: Lógica para quitar la clase 'incomplete' de la insignia de racha si es >= 1
        // Esto depende de cómo quieres que se vea la insignia cuando la racha empieza
        // if (streakCount >= 1) {
        //     streakBadgeH3.closest('.badge-item').classList.remove('incomplete');
        // } else {
        //     // Si la racha vuelve a 0 o menos, podrías volver a ponerla como incomplete
        //     streakBadgeH3.closest('.badge-item').classList.add('incomplete');
        // }

    } else {
        console.warn("No se encontró el elemento H3 con 'Racha Prendida' dentro de '.badge-item'.");
    }


    // --- Inicializar la UI al cargar la página ---

    // Iniciar el calendario y la selección/renderización de actividades
    renderCalendar();
    // selectDate() es llamada dentro de renderCalendar() para seleccionar la fecha de hoy e iniciar renderActivities().

    // Si tienes otros elementos que necesitan inicialización al cargar, agrégalos aquí


}); // Fin del único addEventListener('DOMContentLoaded')
