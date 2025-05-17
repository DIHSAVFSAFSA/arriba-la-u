document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const loginBox = document.querySelector('.login-box');
    const registerBox = document.querySelector('.register-box');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');

    // Initially show the login form (CSS now handles this, but JS reinforces)
    // Estos "style.display" se ejecutarán y establecerán la visibilidad inicial
    // Si tu CSS ya hace esto, no son estrictamente necesarios, pero no causan daño.
    loginBox.style.display = 'block';
    registerBox.style.display = 'none';

    // Event listener for showing register form
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault(); // Previene el comportamiento por defecto del enlace
            loginBox.style.display = 'none';
            registerBox.style.display = 'block';
            loginMessage.style.display = 'none'; // Limpia mensajes al cambiar
            registerMessage.style.display = 'none';
            registerForm.reset(); // Opcional: limpia el formulario de registro al mostrarlo
        });
    }

    // Event listener for showing login form
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault(); // Previene el comportamiento por defecto del enlace
            registerBox.style.display = 'none';
            loginBox.style.display = 'block';
            loginMessage.style.display = 'none'; // Limpia mensajes al cambiar
            registerMessage.style.display = 'none';
            loginForm.reset(); // Opcional: limpia el formulario de login al mostrarlo
        });
    }

    // Function to display messages
    function showMessage(element, type, text) {
        element.textContent = text;
        element.className = 'message ' + type; // Establece la clase para el estilo (success/error)
        element.style.display = 'block';
    }

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Previene el envío del formulario por defecto
            loginMessage.style.display = 'none'; // Oculta mensajes anteriores

            const email = loginForm['login-email'].value;
            const password = loginForm['login-password'].value;

            // Validación básica
            if (!email || !password) {
                showMessage(loginMessage, 'error', 'Por favor, introduce email y contraseña.');
                return;
            }

            try {
                // Asegúrate de que esta URL es correcta y accesible
                const response = await fetch('https://ssenatinoagaaa.lovestoblog.com/login_user.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json(); // Intenta parsear la respuesta como JSON

                if (response.ok && data.success) {
                    showMessage(loginMessage, 'success', 'Inicio de sesión exitoso. Redirigiendo...');
                    // Aquí podrías guardar el token o datos del usuario en localStorage si tu API los devuelve
                    // localStorage.setItem('userToken', data.token); 
                    // localStorage.setItem('username', data.username);
                    window.location.href = 'dashboard.html'; // Redirige a la página principal o de dashboard
                } else {
                    showMessage(loginMessage, 'error', data.message || 'Error en el inicio de sesión.');
                }
            } catch (error) {
                console.error('Error durante el inicio de sesión:', error);
                showMessage(loginMessage, 'error', 'Ocurrió un error de red o el servidor no respondió correctamente. Inténtalo de nuevo.');
            }
        });
    }

    // Register Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Previene el envío del formulario por defecto
            registerMessage.style.display = 'none'; // Oculta mensajes anteriores

            const username = registerForm['register-nombre'].value;
            const email = registerForm['register-email'].value;
            const password = registerForm['register-password'].value;

            // Validación básica
            if (!username || !email || !password) {
                showMessage(registerMessage, 'error', 'Por favor, completa todos los campos.');
                return;
            }

            try {
                // Asegúrate de que esta URL es correcta y accesible
                const response = await fetch('https://ssenatinoagaaa.lovestoblog.com/register_user.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                // Intenta parsear la respuesta como JSON. Si el PHP devuelve un error que no es JSON, esto fallará.
                const data = await response.json(); 

                if (response.ok && data.success) {
                    showMessage(registerMessage, 'success', 'Registro exitoso. ¡Ahora puedes iniciar sesión!');
                    registerForm.reset(); // Limpia el formulario
                    // Opcional: Podrías redirigir al formulario de login automáticamente después de un registro exitoso
                    // setTimeout(() => {
                    //     registerBox.style.display = 'none';
                    //     loginBox.style.display = 'block';
                    // }, 2000); 
                } else {
                    // Si response.ok es false (ej. 400, 500) o data.success es false
                    showMessage(registerMessage, 'error', data.message || 'Error en el registro. Inténtalo de nuevo.');
                }
            } catch (error) {
                // Esto capturará errores de red o si la respuesta no es un JSON válido
                console.error('Error durante el registro:', error);
                showMessage(registerMessage, 'error', 'Ocurrió un error de red o el servidor no respondió con un JSON válido. Revisa la Consola para más detalles.');
            }
        });
    }
});
