import {
    consultarReseñas,
    consultarClientes,
    consultarHotel,
    registrarReseñas,
    actualizarReseñas,
    eliminarReseñas,
} from "../services/reseñasService.js";

document.addEventListener("DOMContentLoaded", () => {

    // Referencias DOM
    const reviewsContainer = document.getElementById("reviews-container");
    const modal = document.getElementById("review-modal");
    const overlay = document.getElementById("modal-overlay");
    const btnNew = document.getElementById("new-review-btn");
    const btnClose = document.getElementById("modal-close-btn");
    const btnCancel = document.getElementById("cancel-btn");
    const form = document.getElementById("review-form");
    const modalTitle = document.getElementById("modal-title");
    const idReseña = document.getElementById("idReseña");
    const idCliente = document.getElementById("idCliente");
    const idHotel = document.getElementById("idHotel");
    const comentario = document.getElementById("comentario");
    const calificacion = document.getElementById("calificacion");

    btnNew.addEventListener("click", () =>{
        limpiarFormulario();
        modalTitle.textContent = "Nueva Reseña";
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // evitar scroll del fondo
        // focus en el primer campo
        setTimeout(() => idCliente.focus(), 80);
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let id = idReseña.value;

        const payload = {
            idCliente: idCliente.value,
            idHotel: idHotel.value,
            comentarioReseña: comentario.value.trim(),
            calificacionReseña: Number(calificacion.value),
        }

        if (!comentario || isNaN(calificacion.value) || calificacion < 0 || calificacion > 5) {
            Swal.fire("Error", "Completa todos los campos y pon una calificación entre 0 y 5.", "error");
            return;
        }

        try{
            if(id){
                await actualizarReseñas(id, payload);
            }else{
                await registrarReseñas(payload);
            }
            Swal.fire("Exito", "Se guardaron los datos exitosamente", "success");
            modal.classList.add("hidden");
            document.body.style.overflow = "";
            await CargarReseñas();
        }catch(err){
            Swal.fire("Error", "Error al guardar los datos de la reseña: " + err, "error");
        }
    });

    async function CargarReseñas(){
        try{
            const data = await consultarReseñas();
            const reseñas = data.content || [];

            reviewsContainer.innerHTML = "";

            if(!reseñas || reseñas.length === 0){
            reviewsContainer.innerHTML = `<p style="color:#777">Aún no hay reseñas. Crea la primera 😊</p>`;
            return;
            }

            reseñas.forEach((r) =>{
                const card = document.createElement("div");
                card.className = "review-card";
                // estrellas (llenar y vacías)
                let estrellas = "";
                for (let i = 0; i < r.calificacionReseña; i++) estrellas += "★";
                for (let i = r.calificacionReseña; i < 5; i++) estrellas += "☆";
                
                card.innerHTML = `
                <h4>${escapeHtml(r.nombreHotel)}</h4>
                <p class="stars">${estrellas}</p>
                <p><i class="fas fa-comment"></i> ${escapeHtml(r.comentarioReseña)}</p>
                <div class="card-actions">
                <button class="edit-btn" data-id="${r.idReseña}"><i class="fas fa-edit"></i> Editar</button>
                <button class="delete-btn" data-id="${r.idReseña}"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
                `;
                
                reviewsContainer.appendChild(card);

                card.querySelector(".edit-btn").addEventListener("click", ()=> setFormulario(r));

                card.querySelector(".delete-btn").addEventListener("click", ()=>{
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: 'Esta acción no se puede deshacer.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#e74c3c',
                        cancelButtonColor: '#95a5a6',
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'No, mantener'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Lógica de Eliminación (Delete)
                            eliminarReseña(r.idReseña);
                            Swal.fire('Eliminada', 'La reseña ha sido eliminada.', 'success');
                        }
                    });
                });
            });
        }catch(err){
            Swal.fire("Error", "Error al cargar las reseñas: " + err, "error");
        }
    }

    async function cargarClientes(){
        try{
            const data = await consultarClientes();
            const clientes = data.content || [];

            idCliente.innerHTML = "";
            const opt = document.createElement("option");
            opt.value = "";
            opt.disabled = true;
            opt.selected = true;
            opt.hidden = true;
            opt.textContent = "Seleccione...";
            idCliente.appendChild(opt);

            clientes.forEach((c) => {
                const option = document.createElement("option");
                option.value = c.idCliente;
                option.textContent = c.nombreCliente;
                idCliente.appendChild(option);
            });
        } catch (err) {
            Swal.fire("Error", "Error al cargar los clientes: " + err, "error");
        }
    }

    async function cargarHotel(){
        try{
            const data = await consultarHotel();
            const hotel = data.content || [];

            idHotel.innerHTML = "";
            const opt = document.createElement("option");
            opt.value = "";
            opt.disabled = true;
            opt.selected = true;
            opt.hidden = true;
            opt.textContent = "Seleccione...";
            idHotel.appendChild(opt);

            hotel.forEach((h) => {
                const option = document.createElement("option");
                option.value = h.idHotel;
                option.textContent = h.nombreHotel;
                idHotel.appendChild(option);
            });
        } catch (err) {
            Swal.fire("Error", "Error al cargar el hotel: " + err, "error");
        }
    }

    function setFormulario(item) {
        
        idReseña.value = item.idReseña;
        idCliente.value = item.idCliente;
        idHotel.value = item.idHotel;
        comentario.value = item.comentarioReseña;
        calificacion.value = item.calificacionReseña;

        modalTitle.textContent = "Editar Reseña";
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // evitar scroll del fondo
        // focus en el primer campo
        setTimeout(() => idCliente.focus(), 80);
    }

    function closeModal() {
        modal.classList.add("hidden");
        document.body.style.overflow = "";
        form.reset();
    }

    // cerrar por overlay click
    overlay.addEventListener("click", closeModal);
    // cerrar por botón
    btnClose.addEventListener("click", closeModal);
    btnCancel.addEventListener("click", closeModal);

    function limpiarFormulario(){
        form.reset();
        idReseña.value = "";
    }

    async function eliminarReseña(id){
        try{
            await eliminarReseñas(id);
            await CargarReseñas();
        }catch(err){
            Swal.fire("Error", "Error al eliminar reseña: " + err, "error");
        }
    }

    // --- escape para evitar inyección simple en el innerHTML ---
    function escapeHtml(text) {
        return text
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    cargarClientes();
    cargarHotel();
    CargarReseñas();

});