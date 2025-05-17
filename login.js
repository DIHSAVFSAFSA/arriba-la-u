// login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');

    // Muestra/oculta formularios
    if (showRegisterLink && showLoginLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            loginMessage.textContent = ''; // Limpiar mensajes
            registerMessage.textContent = '';
        });

        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            loginMessage.textContent = ''; // Limpiar mensajes
            registerMessage.textContent = '';
        });
    }


    // --- Manejo del Registro ---
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('register-nombre').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            registerMessage.textContent = 'Registrando...';
            registerMessage.style.color = 'blue';

            try {
                const response = await fetch('https://ssenatinoagaaa.lovestoblog.com/register_user.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await response.json();

                if (data.success) {
                    registerMessage.textContent = data.message + ' ¡Ahora puedes iniciar sesión!';
                    registerMessage.style.color = 'green';
                    if (showLoginLink) showLoginLink.click(); // Cambiar a la vista de login
                } else {
                    registerMessage.textContent = 'Error: ' + data.message;
                    registerMessage.style.color = 'red';
                }
            } catch (error) {
                console.error('Error al registrar usuario:', error);
                registerMessage.textContent = 'Error de conexión. Intenta de nuevo más tarde.';
                registerMessage.style.color = 'red';
            }
        });
    }

    // --- Manejo del Inicio de Sesión ---
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            loginMessage.textContent = 'Iniciando sesión...';
            loginMessage.style.color = 'blue';

            try {
                const response = await fetch('https://ssenatinoagaaa.lovestoblog.com/login_user.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();

                if (data.success) {
                    loginMessage.textContent = data.message;
                    loginMessage.style.color = 'green';
                    localStorage.setItem('currentUser', JSON.stringify(data.user)); // Guardar datos del usuario
                    window.location.href = 'perfil.html'; // Redirigir al perfil
                } else {
                    loginMessage.textContent = 'Error: ' + data.message;
                    loginMessage.style.color = 'red';
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                loginMessage.textContent = 'Error de conexión. Intenta de nuevo más tarde.';
                loginMessage.style.color = 'red';
            }
        });
    }

    // Para "Cerrar Sesión" en la navegación (asumiendo que tiene id="logoutBtn" en tu HTML):
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            localStorage.removeItem('currentUser'); // Elimina los datos del usuario
            // La redirección a login.html ya la debería manejar el 'href' del enlace.
        });
    }
});
