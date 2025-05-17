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

    // Envío del Formulario de Login (Ejemplo)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('LOG: Formulario de login ENVIADO.');
            if (loginMessage) loginMessage.style.display = 'none';

            const email = loginForm['login-email'].value;
            const password = loginForm['login-password'].value;

            // Validación simple
            if (!email || !password) {
                showMessage(loginMessage, 'error', 'Por favor, introduce tu email y contraseña.');
                return;
            }

            try {
                // *** ¡IMPORTANTE! AJUSTA ESTA URL A TU SCRIPT DE LOGIN EN INFINITYFREE ***
                const targetUrlLogin = 'https://ssenatinogaaaa.lovestoblog.com/login_user.php'; // Cambia esto si tienes un script de login

                // Construir los datos como FormData, que PHP entiende en $_POST
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);

                const response = await fetch(targetUrlLogin, {
                    method: 'POST',
                    // NO es necesario especificar 'Content-Type' para FormData, fetch lo hace automáticamente
                    body: formData
                });

                const data = await response.json(); // Espera JSON como respuesta del servidor
                console.log('LOG: Respuesta del servidor de login:', data);

                if (response.ok && data.success) { // 'response.ok' verifica códigos 200-299
                    showMessage(loginMessage, 'success', 'Inicio de sesión exitoso. ¡Bienvenido!');
                    // Aquí puedes redirigir o realizar otras acciones post-login
                } else {
                    showMessage(loginMessage, 'error', data.message || 'Error en el inicio de sesión. Credenciales incorrectas.');
                }
            } catch (error) {
                console.error('ERROR: Error durante el inicio de sesión (catch):', error);
                showMessage(loginMessage, 'error', 'Ocurrió un error de red o el servidor no respondió con un JSON válido. Revisa la Consola para más detalles.');
            }
        });
    }

    // Envío del Formulario de Registro
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('LOG: Formulario de registro ENVIADO.');
            if (registerMessage) registerMessage.style.display = 'none';

            const username = registerForm['username'].value;
            const email = registerForm['email'].value;
            const password = registerForm['password'].value;

            // Depuración: Registra los valores recogidos antes de enviar
            console.log('DEBUG - Valores recogidos por JS antes de enviar:');
            console.log('Username:', username);
            console.log('Email:', email);
            console.log('Password:', password);

            // Validación simple del lado del cliente
            if (!username || !email || !password) {
                showMessage(registerMessage, 'error', 'Por favor, completa todos los campos.');
                return;
            }

            // --- ¡CAMBIO CLAVE AQUÍ: Usamos FormData para enviar datos como un formulario real! ---
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            // ---------------------------------------------------------------------------------

            try {
                console.log('LOG: Intentando fetch a register_user.php con FormData...');
                // *** ¡IMPORTANTE! ASEGÚRATE QUE ESTA URL ES LA CORRECTA PARA TU script PHP en InfinityFree ***
                const targetUrlRegister = 'https://ssenatinogaaaa.lovestoblog.com/register_user.php';

                const response = await fetch(targetUrlRegister, {
                    method: 'POST',
                    // ¡IMPORTANTE! NO es necesario especificar 'Content-Type' para FormData.
                    // fetch lo maneja automáticamente como 'multipart/form-data', lo cual es perfecto para $_POST.
                    body: formData // Envía el objeto FormData directamente
                });
                console.log('LOG: Fetch a register_user.php completado.');

                const data = await response.json(); // La respuesta de tu PHP seguirá siendo JSON
                console.log('LOG: Respuesta de register_user.php:', data);

                if (response.ok && data.success) {
                    showMessage(registerMessage, 'success', 'Registro exitoso. ¡Ahora puedes iniciar sesión!');
                    if (registerForm) registerForm.reset(); // Limpia el formulario
                } else {
                    // Muestra el mensaje de error que viene del servidor
                    showMessage(registerMessage, 'error', data.message || 'Error en el registro. Inténtalo de nuevo.');
                }
            } catch (error) {
                console.error('ERROR: Error durante el registro (catch):', error);
                showMessage(registerMessage, 'error', 'Ocurrió un error de red o el servidor no respondió con un JSON válido. Revisa la Consola para más detalles.');
            }
        });
    }
});
