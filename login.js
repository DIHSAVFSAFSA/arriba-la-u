// login.js o dentro de un <script> en login.html
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
                const response = await fetch('http://tu-dominio-infinityfree.com/register_user.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await response.json();

                if (data.success) {
                    registerMessage.textContent = data.message + ' ¡Ahora puedes iniciar sesión!';
                    registerMessage.style.color = 'green';
                    // Opcional: Cambiar automáticamente a la vista de login
                    if (showLoginLink) showLoginLink.click();
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
                const response = await fetch('http://tu-dominio-infinityfree.com/login_user.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();

                if (data.success) {
                    loginMessage.textContent = data.message;
                    loginMessage.style.color = 'green';
                    // ¡Importante! Guardar los datos del usuario en localStorage
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    // Redirigir al perfil o a la página principal
                    window.location.href = 'perfil.html'; // O 'index.html'
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

    // Para "Cerrar Sesión" en la navegación:
    // Asegúrate de que el enlace de cerrar sesión tenga un ID, por ejemplo:
    // <a href="login.html" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            localStorage.removeItem('currentUser'); // Elimina los datos del usuario
            // Opcional: Redirigir explícitamente a login.html si no lo hace el href
            // window.location.href = 'login.html';
        });
    }
});
