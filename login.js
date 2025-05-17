document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('showLogin');
    const registerLink = document.getElementById('showRegister');
    const loginBox = document.querySelector('.login-box');
    const registerBox = document.querySelector('.register-box');

    // Forms and messages
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');

    // Function to show messages
    function showMessage(element, type, message) {
        element.textContent = message;
        element.className = 'message ' + type; // 'message success' or 'message error'
        element.style.display = 'block';
    }

    // Toggle between login and register forms
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('LOG 1: Clic en "Logearse" (enlace). Cambiando a form de login.');
            if (registerBox) registerBox.style.display = 'none';
            if (loginBox) loginBox.style.display = 'block';
            if (loginMessage) loginMessage.style.display = 'none';
            if (registerMessage) registerMessage.style.display = 'none'; // Oculta mensajes al cambiar de form
        });
    }

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('LOG 3: Clic en "Registrarse" (enlace). Cambiando a form de registro.');
            if (loginBox) loginBox.style.display = 'none';
            if (registerBox) registerBox.style.display = 'block';
            if (loginMessage) loginMessage.style.display = 'none'; // Oculta mensajes al cambiar de form
            if (registerMessage) registerMessage.style.display = 'none';
        });
    }

    // Login Form Submission (example, adjust as needed for your login logic)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('LOG 2: Formulario de login ENVIADO (se llamó preventDefault).');
            if (loginMessage) loginMessage.style.display = 'none';

            const email = loginForm['login-email'].value;
            const password = loginForm['login-password'].value;

            // Simple client-side validation
            if (!email || !password) {
                showMessage(loginMessage, 'error', 'Por favor, introduce tu email y contraseña.');
                return;
            }

            try {
                // *** IMPORTANTE: AJUSTA ESTA URL A TU SCRIPT DE LOGIN EN INFINITYFREE ***
                const targetUrlLogin = 'https://your_login_script.lovestoblog.com/login_user.php'; // Cambia esto si tienes un script de login
                
                // Construir los datos como FormData
                const formData = new FormData(); // ¡CAMBIO AQUÍ!
                formData.append('email', email);
                formData.append('password', password);

                const response = await fetch(targetUrlLogin, {
                    method: 'POST',
                    // NO ES NECESARIO ESPECIFICAR Content-Type para FormData, fetch lo hace automáticamente (multipart/form-data)
                    body: formData 
                });

                const data = await response.json(); // Espera JSON como respuesta del servidor
                console.log('LOG: Respuesta del servidor de login:', data);

                if (response.ok && data.success) {
                    showMessage(loginMessage, 'success', 'Inicio de sesión exitoso. ¡Bienvenido!');
                    // Redirigir o realizar otra acción post-login
                } else {
                    showMessage(loginMessage, 'error', data.message || 'Error en el inicio de sesión. Credenciales incorrectas.');
                }
            } catch (error) {
                console.error('ERROR: Error durante el inicio de sesión (catch):', error);
                showMessage(loginMessage, 'error', 'Ocurrió un error de red o el servidor no respondió con un JSON válido. Revisa la Consola para más detalles.');
            }
        });
    }

    // Register Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('LOG 6: Formulario de registro ENVIADO (se llamó preventDefault).');
            if (registerMessage) registerMessage.style.display = 'none';

            const username = registerForm['register-nombre'].value;
            const email = registerForm['register-email'].value;
            const password = registerForm['register-password'].value;

            // DEBUGGING: Log collected values
            console.log('DEBUG - Valores recogidos por JS antes de enviar:');
            console.log('Username:', username);
            console.log('Email:', email);
            console.log('Password:', password);

            if (!username || !email || !password) {
                showMessage(registerMessage, 'error', 'Por favor, completa todos los campos.');
                return;
            }

            // --- ¡CAMBIO CLAVE AQUÍ: Usamos FormData para enviar datos como un formulario real! ---
            const formData = new FormData(); // ¡CAMBIO A FormData!
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            // ---------------------------------------------------------------------------------

            try {
                console.log('LOG: Intentando fetch a register_user.php con FormData...');
                // *** ASEGÚRATE QUE ESTA URL ES CORRECTA PARA TU register_user.php EN INFINITYFREE ***
                const targetUrlRegister = 'https://ssenatinogaaaa.lovestoblog.com/register_user.php'; 
                
                const response = await fetch(targetUrlRegister, {
                    method: 'POST',
                    // ¡IMPORTANTE! NO ES NECESARIO ESPECIFICAR Content-Type para FormData.
                    // fetch lo maneja automáticamente como 'multipart/form-data'.
                    body: formData // Envía el objeto FormData directamente
                });
                console.log('LOG: Fetch a register_user.php completado.');

                const data = await response.json(); // La respuesta del servidor seguirá siendo JSON
                console.log('LOG: Respuesta de register_user.php:', data);

                if (response.ok && data.success) {
                    showMessage(registerMessage, 'success', 'Registro exitoso. ¡Ahora puedes iniciar sesión!');
                    if (registerForm) registerForm.reset();
                } else {
                    // Muestra el mensaje de error del servidor si lo hay
                    showMessage(registerMessage, 'error', data.message || 'Error en el registro. Inténtalo de nuevo.');
                }
            } catch (error) {
                console.error('ERROR: Error durante el registro (catch):', error);
                showMessage(registerMessage, 'error', 'Ocurrió un error de red o el servidor no respondió con un JSON válido. Revisa la Consola para más detalles.');
            }
        });
    }
});
