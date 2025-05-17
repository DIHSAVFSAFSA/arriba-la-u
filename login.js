document.addEventListener('DOMContentLoaded', () => {
    // --- PASO 1: ¿Se está cargando y ejecutando el script? ---
    console.log('LOG 1: DOM cargado y login.js iniciado.'); 

    const loginBox = document.querySelector('.login-box');
    const registerBox = document.querySelector('.register-box');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');

    // --- PASO 2: ¿Está encontrando todos los elementos HTML? ---
    console.log('LOG 2: Elementos HTML seleccionados:');
    console.log('  loginBox:', loginBox);
    console.log('  registerBox:', registerBox);
    console.log('  showRegisterLink:', showRegisterLink);
    console.log('  showLoginLink:', showLoginLink);
    console.log('  loginForm:', loginForm);
    console.log('  registerForm:', registerForm);

    // Si algún elemento no se encuentra, verás 'null' en la consola y estas advertencias.
    if (!loginBox) console.warn('ADVERTENCIA: .login-box no encontrado.');
    if (!registerBox) console.warn('ADVERTENCIA: .register-box no encontrado.');
    if (!showRegisterLink) console.warn('ADVERTENCIA: #showRegister no encontrado.');
    if (!showLoginLink) console.warn('ADVERTENCIA: #showLogin no encontrado.');
    if (!loginForm) console.warn('ADVERTENCIA: #loginForm no encontrado.');
    if (!registerForm) console.warn('ADVERTENCIA: #registerForm no encontrado. ¡Problema potencial para el registro!');


    // Visibilidad inicial (CSS ya lo hace, JS lo refuerza)
    if (loginBox) loginBox.style.display = 'block';
    if (registerBox) registerBox.style.display = 'none';

    // Event listener para mostrar formulario de registro
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('LOG 3: Clic en "Registrarse" (enlace). Cambiando a form de registro.');
            if (loginBox) loginBox.style.display = 'none';
            if (registerBox) registerBox.style.display = 'block';
            if (loginMessage) loginMessage.style.display = 'none';
            if (registerMessage) registerMessage.style.display = 'none';
            if (registerForm) registerForm.reset();
        });
    }

    // Event listener para mostrar formulario de login
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('LOG 4: Clic en "Logearse" (enlace). Cambiando a form de login.');
            if (registerBox) registerBox.style.display = 'none';
            if (loginBox) loginBox.style.display = 'block';
            if (loginMessage) loginMessage.style.display = 'none';
            if (registerMessage) registerMessage.style.display = 'none';
            if (loginForm) loginForm.reset();
        });
    }

    // Función para mostrar mensajes
    function showMessage(element, type, text) {
        if (element) {
            element.textContent = text;
            element.className = 'message ' + type;
            element.style.display = 'block';
            console.log(`LOG: Mensaje para ${element.id || element.className}: ${text} (${type})`);
        }
    }

    // Envío de Formulario de Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('LOG 5: Formulario de login ENVIADO (se llamó preventDefault).');
            if (loginMessage) loginMessage.style.display = 'none';

            const email = loginForm['login-email'].value;
            const password = loginForm['login-password'].value;

            if (!email || !password) {
                showMessage(loginMessage, 'error', 'Por favor, introduce email y contraseña.');
                return;
            }

            try {
                // *** CAMBIO AQUÍ: Usando un proxy CORS ***
                const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
                const targetUrlLogin = 'http://ssenatinoagaaaa.lovestoblog.com/login_user.php';
                const response = await fetch(proxyUrl + targetUrlLogin, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                console.log('LOG: Respuesta de login_user.php:', data);

                if (response.ok && data.success) {
                    showMessage(loginMessage, 'success', 'Inicio de sesión exitoso. Redirigiendo...');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000); 
                } else {
                    showMessage(loginMessage, 'error', data.message || 'Error en el inicio de sesión.');
                }
            } catch (error) {
                console.error('ERROR: Error durante el inicio de sesión (catch):', error);
                showMessage(loginMessage, 'error', 'Ocurrió un error de red o el servidor no respondió correctamente. Inténtalo de nuevo.');
            }
        });
    }

    // Envío de Formulario de Registro
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('LOG 6: Formulario de registro ENVIADO (se llamó preventDefault).'); 
            if (registerMessage) registerMessage.style.display = 'none';

            const username = registerForm['register-nombre'].value;
            const email = registerForm['register-email'].value;
            const password = registerForm['register-password'].value;

            if (!username || !email || !password) {
                showMessage(registerMessage, 'error', 'Por favor, completa todos los campos.');
                return;
            }

            try {
                console.log('LOG: Intentando fetch a register_user.php...'); 
                // *** CAMBIO AQUÍ: Usando un proxy CORS ***
                const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
                const targetUrlRegister = 'http://ssenatinoagaaaa.lovestoblog.com/register_user.php';
                const response = await fetch(proxyUrl + targetUrlRegister, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                console.log('LOG: Fetch a register_user.php completado.'); 

                const data = await response.json(); 
                console.log('LOG: Respuesta de register_user.php:', data);

                if (response.ok && data.success) {
                    showMessage(registerMessage, 'success', 'Registro exitoso. ¡Ahora puedes iniciar sesión!');
                    if (registerForm) registerForm.reset();
                } else {
                    showMessage(registerMessage, 'error', data.message || 'Error en el registro. Inténtalo de nuevo.');
                }
            } catch (error) {
                console.error('ERROR: Error durante el registro (catch):', error);
                showMessage(registerMessage, 'error', 'Ocurrió un error de red o el servidor no respondió con un JSON válido. Revisa la Consola para más detalles.');
            }
        });
    }
});
