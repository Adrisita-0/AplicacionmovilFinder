document.getElementById('get-started-btn').addEventListener('click', () => {
    window.location.href = 'home.html';
});

document.getElementById('login-link').addEventListener('click', (e) => {
    e.preventDefault();
    Swal.fire({
        title: 'Iniciar Sesión',
        html: `
            <input id="swal-email" class="swal2-input" placeholder="Correo electrónico">
            <input id="swal-password" type="password" class="swal2-input" placeholder="Contraseña">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Entrar',
        preConfirm: () => {
            const email = Swal.getPopup().querySelector('#swal-email').value;
            const password = Swal.getPopup().querySelector('#swal-password').value;
            if (!email || !password) {
                Swal.showValidationMessage('Por favor, ingresa tu correo y contraseña');
                return false;
            }
            return { email: email, password: password };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí llamarías a tu API para autenticar al usuario
            // api.login(result.value.email, result.value.password).then(...)
            Swal.fire('¡Bienvenido!', 'Has iniciado sesión correctamente.', 'success');
            // Redireccionar a la página principal del hotel
            // window.location.href = 'home.html';
        }
    });
});