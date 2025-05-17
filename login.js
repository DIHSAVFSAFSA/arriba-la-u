document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado y login.js iniciado.'); // LOG 1: ¿Se carga el script?

    const loginBox = document.querySelector('.login-box');
    const registerBox = document.querySelector('.register-box');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');

    console.log('Elementos seleccionados:'); // LOG 2: ¿Se encuentran los elementos?
    console.log('loginBox:', loginBox);
    console.log('registerBox:', registerBox);
    console.log('showRegisterLink:', showRegisterLink);
    console.log('showLoginLink:', showLoginLink);
    console.log('loginForm:', loginForm);
    console.log('registerForm:', registerForm);

    // Visibilidad inicial (CSS ya lo hace, JS lo refuerza)
    if (loginBox) loginBox.style.display = 'block';
    if (registerBox) registerBox.style.display = 'none';

    // Event listener para mostrar formulario de registro
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('LOG 3: Clic en "Registrarse" (enlace).'); // LOG 3: ¿Se detecta el clic en el enlace?
            if (loginBox) loginBox.style.display = 'none';
            if (registerBox) registerBox.style.display = 'block';
            if (loginMessage) loginMessage.style.display = 'none';
            if (registerMessage) registerMessage.style.display = 'none';
            if (registerForm) registerForm.reset();
        });
    } else {
        console.warn('ADVERTENCIA: showRegisterLink no encontrado. Revisa el ID en HTML.'); // ADVERTENCIA 1
    }

    // Event listener para mostrar formulario de login
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('LOG 4: Clic en "Logearse" (enlace).'); // LOG 4: ¿Se detecta el clic en el enlace?
            if (registerBox) registerBox.style.display = 'none';
            if (loginBox) loginBox.style.display = 'block';
            if (loginMessage) loginMessage.style.display = 'none';
            if (registerMessage) registerMessage.style.display = 'none';
            if (loginForm) loginForm.reset();
        });
    } else {
        console.warn('ADVERTENCIA: showLoginLink no encontrado. Revisa el ID en HTML.'); // ADVERTENCIA 2
    }

    // Función para mostrar mensajes
    function showMessage(element, type, text) {
        if (element) {
            element.textContent = text;
            element.className = 'message ' + type;
            element.style.display = 'block';
            console.log(`LOG: Mensaje mostrado en ${element.id || element.className}: <span class="math-inline">\{text\} \(</span>{type})`); // LOG de mensajes
        }
    }

    // Envío de Formulario de Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('LOG 5: Formulario de login enviado (prevented default).'); // LOG 5: ¿Se detecta el envío?
            if (loginMessage) loginMessage.style.display = 'none';

            const email = loginForm['login-email'].value;
            const password = loginForm['login-password'].value;

            if (!email || !password) {
                showMessage(loginMessage, 'error', 'Por favor, introduce email y contraseña.');
                return;
            }

            try {
                const response = await fetch('https://ssenatinoagaaa.lovestoblog.com/login_user.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                console.log('LOG: Respuesta de login_user.php:', data); // LOG de respuesta API

                if (response.ok && data.success) {
                    showMessage(loginMessage, 'success', 'Inicio de sesión exitoso. Redirigiendo...');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    showMessage(loginMessage, 'error', data.message || 'Error en el inicio de sesión.');
                }
            } catch (error) {
                console.error('ERROR: Error durante el inicio de sesión (catch):', error); // ERROR de fetch
                showMessage(loginMessage, 'error', 'Ocurrió un error de red o el servidor no respondió correctamente. Inténtalo de nuevo.');
            }
        });
    } else {
        console.warn('ADVERTENCIA: loginForm no encontrado. Revisa el ID en HTML.'); // ADVERTENCIA 3
    }

    // Envío de Formulario de Registro
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('LOG 6: Formulario de registro enviado (prevented default).'); // LOG 6: ¡ESTE ES CLAVE! ¿Se detecta el envío?
            if (registerMessage) registerMessage.style.display = 'none';

            const username = registerForm['register-nombre'].value;
            const email = registerForm['register-email'].value;
            const password = registerForm['register-password'].value;

            if (!username || !email || !password) {
                showMessage(registerMessage, 'error', 'Por favor, completa todos los campos.');
                return;
            }

            try {
                const response = await fetch('https://ssenatinoagaaa.lovestoblog.com/register_user.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                // Aquí, si el PHP no devuelve JSON válido, 'await response.json()' fallará y saltará al 'catch'.
                const data = await response.json(); 
                console.log('LOG: Respuesta de register_user.php:', data); // LOG de respuesta API

                if (response.ok && data.success) {
                    showMessage(registerMessage, 'success', 'Registro exitoso. ¡Ahora puedes iniciar sesión!');
                    if (registerForm) registerForm.reset();
                } else {
                    showMessage(registerMessage, 'error', data.message || 'Error en el registro. Inténtalo de nuevo.');
                }
            } catch (error) {
                console.error('ERROR: Error durante el registro (catch):', error); // ERROR de fetch o JSON.parse
                showMessage(registerMessage, 'error', 'Ocurrió un error de red o el servidor no respondió con un JSON válido. Revisa la Consola para más detalles.');
            }
        });
    } else {
        console.warn('ADVERTENCIA: registerForm no encontrado. Revisa el ID en HTML.'); // ADVERTENCIA 4
    }
});
