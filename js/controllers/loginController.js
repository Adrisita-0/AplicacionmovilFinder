import {
    login,
    me
} from "../services/authService.js";

document.addEventListener('DOMContentLoaded', async () =>{
    const form = document.getElementById('loginForm');

    //Contenedor de alertas: si no existe en el DOM, se crea antes del formulario.
    const alertbox = document.getElementById('loginAlert') || (() => {
        const a = document.createElement("div");
        a.id = 'loginAlert';
        a.className = 'alert alert-danger d-none'; //oculto por defecto
        form?.parentElement.insertBefore(a, form) //inserta el alert encima del form
        return a;
    })();

    //Maneja el submit del formulario del login.
    form?.addEventListener('submit', async (e)=> {
        e.preventDefault();
        alertbox.classList.add('d-none'); //oculta alert previo

        // 1) Obtención tolerante de campos (acepta varios selectores equivalentes)
        const correoUsuario = (document.getElementById("correoUsuario")?.value || '').trim();
        const contraseñaUsuario = document.getElementById("contraseñaUsuario")?.value || '';

        //Referencia y estado del botón "Ingresar"
        const btnIngresar = document.getElementById('btnIngresar');
        let originalText;

        try {
            // 2) Desactiva botón para evitar reenvíos múltiples y muestra feedback de carga
            if(btnIngresar){
                originalText = btnIngresar.innerHTML;
                btnIngresar.setAttribute("disabled", "disabled");
                btnIngresar.innerHTML = 'Ingresando...';
            }

            // 3) Llama al servicio de login (envía credenciales, espera cookie de sesión)
            await login({correoUsuario, contraseñaUsuario});

            // 4) Verifica sesión con /authMe para configurar que la cookie quedó activa
            const info = await me(); //El service incluye credentials: 'Include'
            if(info?.authenticated){
                // 5) Redirección a la página principal si autenticado
                window.location.href = "home.html";
            }else{
                //Entre líneas: si no se refleja autenticación, alerta de cookie/sesión
                alertbox.textContent = 'Error de Cookie o de inicio de sesión';
                alertbox.classList.remove('d-none');
            }
        }catch(err){
            // 6) Muestra mensaje de error de backend/red o fellback genérico
            alertbox.textContent = err?.message || 'No fue posible iniciar sesión.';
            alertbox.classList.remove('d-none');
        }finally{
            // 7) Restaura estado del botón (habilita y devuelve texto original)
            if(btnIngresar){
                btnIngresar.removeAttribute("disabled");
                if(originalText) btnIngresar.innerHTML = originalText;
            }
        }
    });
});