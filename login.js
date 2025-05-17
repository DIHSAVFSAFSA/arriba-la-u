document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('showLogin');
    const registerLink = document.getElementById('showRegister');
    const loginBox = document.querySelector('.login-box');
    const registerBox = document.querySelector('.register-box');

    // Formularios y mensajes
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');

    // Función para mostrar mensajes
    function showMessage(element, type, message) {
        element.textContent = message;
        element.className = 'message ' + type; // 'message success' o 'message error'
        element.style.display = 'block';
    }

    // Alternar entre formularios de login y registro
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('LOG: Clic en "Logearse". Mostrando form de login.');
            if (registerBox) registerBox.style.display = 'none';
            if (loginBox) loginBox.style.display = 'block';
            if (loginMessage) loginMessage.style.display = 'none';
            if (registerMessage) registerMessage.style.display = 'none'; // Oculta mensajes al cambiar
        });
    }

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('LOG: Clic en "Registrarse". Mostrando form de registro.');
            if (loginBox) loginBox.style.display = 'none';
            if (registerBox) registerBox.style.display = 'block';
            if (loginMessage) loginMessage.style.display = 'none';
            if (registerMessage) registerMessage.style.display = 'none'; // Oculta mensajes al cambiar
        });
    }

    // Envío del Formulario de Login (mantiene fetch por ahora)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('LOG: Formulario de login ENVIADO.');
            if (loginMessage) loginMessage.style.display = 'none';

            const email = loginForm['login-email'].value;
            const password = loginForm['login-password'].value;

            if (!email || !password) {
                showMessage(loginMessage, 'error', 'Por favor, introduce tu email y contraseña.');
                return;
            }

            try {
                const targetUrlLogin = 'https://ssenatinogaaaa.lovestoblog.com/login_user.php'; 
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);

                const response = await fetch(targetUrlLogin, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                console.log('LOG: Respuesta del servidor de login:', data);

                if (response.ok && data.success) {
                    showMessage(loginMessage, 'success', 'Inicio de sesión exitoso. ¡Bienvenido!');
                } else {
                    showMessage(loginMessage, 'error', data.message || 'Error en el inicio de sesión. Credenciales incorrectas.');
                }
            } catch (error) {
                console.error('ERROR: Error durante el inicio de sesión (catch):', error);
                showMessage(loginMessage, 'error', 'Ocurrió un error de red o el servidor no respondió con un JSON válido. Revisa la Consola para más detalles.');
            }
        });
    }

    // Envío del Formulario de Registro (¡AHORA CON XMLHttpRequest!)
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => { // ¡Nota: No 'async' aquí!
            e.preventDefault();
            console.log('LOG: Formulario de registro ENVIADO.');
            if (registerMessage) registerMessage.style.display = 'none';

            const username = registerForm['username'].value;
            const email = registerForm['email'].value;
            const password = registerForm['password'].value;

            console.log('DEBUG - Valores recogidos por JS antes de enviar:');
            console.log('Username:', username);
            console.log('Email:', email);
            console.log('Password:', password);

            if (!username || !email || !password) {
                showMessage(registerMessage, 'error', 'Por favor, completa todos los campos.');
                return;
            }

            // --- ¡CAMBIO CLAVE AQUÍ: Usamos XMLHttpRequest! ---
            const xhr = new XMLHttpRequest();
            const targetUrlRegister = 'https://ssenatinogaaaa.lovestoblog.com/register_user.php'; // Tu URL PHP

            xhr.open('POST', targetUrlRegister, true); // true para asíncrono
            // No es necesario setear Content-Type si envías FormData, XHR lo maneja

            // Manejar la respuesta del servidor
            xhr.onload = function() {
                console.log('LOG: XHR Response status:', xhr.status);
                console.log('LOG: XHR Response text:', xhr.responseText);

                if (xhr.status >= 200 && xhr.status < 300) { // HTTP OK (2xx)
                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log('LOG: Respuesta JSON PARSEADA por XHR:', data);

                        if (data.success) {
                            showMessage(registerMessage, 'success', 'Registro exitoso. ¡Ahora puedes iniciar sesión!');
                            if (registerForm) registerForm.reset();
                        } else {
                            showMessage(registerMessage, 'error', data.message || 'Error en el registro. Inténtalo de nuevo.');
                        }
                    } catch (jsonError) {
                        console.error('ERROR: No se pudo parsear la respuesta JSON del servidor (XHR). Esto es lo que se recibió:', xhr.responseText, jsonError);
                        showMessage(registerMessage, 'error', 'Error inesperado del servidor: La respuesta no es JSON válido. Revisa la Consola.');
                    }
                } else { // Si el status no es 2xx (ej. 400, 500)
                    console.error('ERROR: El servidor respondió con un error de status (XHR):', xhr.status, xhr.statusText);
                    showMessage(registerMessage, 'error', `Error del servidor: ${xhr.status} ${xhr.statusText}.`);
                }
            };

            // Manejar errores de red o de conexión
            xhr.onerror = function() {
                console.error('ERROR: Error de red o conexión durante el registro (XHR).');
                showMessage(registerMessage, 'error', 'Ocurrió un error de red o no se pudo conectar al servidor.');
            };

            // Crear FormData (igual que antes, PHP lo entenderá)
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);

            console.log('LOG: Enviando XHR...');
            xhr.send(formData); // Envía los datos
            // -----------------------------------------------------------
        });
    }
});
