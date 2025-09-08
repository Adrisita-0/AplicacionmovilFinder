/* resenas.js - Modal funcional para crear/editar/eliminar reseñas
   - Asegúrate de tener en /js/resenas.js y que esté enlazado en el HTML
*/

// Datos iniciales (simulados)
let resenas = [
    { id: 1, habitacion: "Suite de Lujo", calificacion: 5, comentario: "Excelente: cama cómoda, limpieza impecable.", fecha: "2025-09-05" },
    { id: 2, habitacion: "Habitación Doble", calificacion: 4, comentario: "Buena atención, pero algo de ruido.", fecha: "2025-08-20" }
];

let editandoId = null; // id de la reseña que estamos editando (null = nueva)

// Referencias DOM
const reviewsContainer = document.getElementById("reviews-container");
const modal = document.getElementById("review-modal");
const overlay = document.getElementById("modal-overlay");
const btnNew = document.getElementById("new-review-btn");
const btnClose = document.getElementById("modal-close-btn");
const btnCancel = document.getElementById("cancel-btn");
const form = document.getElementById("review-form");

// inputs
const inputHabitacion = document.getElementById("habitacion");
const inputCalificacion = document.getElementById("calificacion");
const inputComentario = document.getElementById("comentario");

// --- Funciones de apertura/cierre del modal ---
function openModalForNew() {
    editandoId = null;
    document.getElementById("modal-title").textContent = "Nueva Reseña";
    form.reset();
    openModal();
}

function openModalForEdit(id) {
    const r = resenas.find(x => x.id == id);
    if (!r) return;
    editandoId = id;
    document.getElementById("modal-title").textContent = "Editar Reseña";
    inputHabitacion.value = r.habitacion;
    inputCalificacion.value = r.calificacion;
    inputComentario.value = r.comentario;
    openModal();
}

function openModal() {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // evitar scroll del fondo
    // focus en el primer campo
    setTimeout(() => inputHabitacion.focus(), 80);
}

function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    editandoId = null;
    form.reset();
}

// cerrar por overlay click
overlay.addEventListener("click", closeModal);
// cerrar por botón
btnClose.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);

// cerrar por ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

// --- Renderizado de tarjetas ---
function renderResenas() {
    reviewsContainer.innerHTML = "";

    if (resenas.length === 0) {
        reviewsContainer.innerHTML = `<p style="color:#666">Aún no hay reseñas. Crea la primera 😊</p>`;
        return;
    }

    resenas.forEach(r => {
        const card = document.createElement("div");
        card.className = "review-card";
        // estrellas (llenar y vacías)
        let estrellas = "";
        for (let i = 0; i < r.calificacion; i++) estrellas += "★";
        for (let i = r.calificacion; i < 5; i++) estrellas += "☆";

        // fecha: mostramos tal cual, si viene vacía, poner hoy
        const fecha = r.fecha || new Date().toISOString().split("T")[0];

        card.innerHTML = `
      <h4>${escapeHtml(r.habitacion)}</h4>
      <p class="stars">${estrellas}</p>
      <p><i class="fas fa-comment"></i> ${escapeHtml(r.comentario)}</p>
      <p style="color:#777;margin:.4rem 0;font-size:.9rem"><i class="fas fa-calendar"></i> ${fecha}</p>
      <div class="card-actions">
        <button class="edit-btn" data-id="${r.id}"><i class="fas fa-edit"></i> Editar</button>
        <button class="delete-btn" data-id="${r.id}"><i class="fas fa-trash"></i> Eliminar</button>
      </div>
    `;

        reviewsContainer.appendChild(card);
    });

    // asignar eventos de los botones (delegación simple)
    document.querySelectorAll(".edit-btn").forEach(b => {
        b.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
            openModalForEdit(id);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(b => {
        b.addEventListener("click", (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            eliminarResena(id);
        });
    });
}

// --- Manejo de formulario (crear/editar) ---
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const habitacion = inputHabitacion.value.trim();
    const calificacion = parseInt(inputCalificacion.value);
    const comentario = inputComentario.value.trim();

    if (!habitacion || !comentario || isNaN(calificacion) || calificacion < 1 || calificacion > 5) {
        Swal.fire("Error", "Completa todos los campos y pon una calificación entre 1 y 5.", "error");
        return;
    }

    if (editandoId) {
        // editar
        const idx = resenas.findIndex(r => r.id == editandoId);
        if (idx === -1) { Swal.fire("Error", "No se encontró la reseña a editar", "error"); closeModal(); return; }
        resenas[idx] = { ...resenas[idx], habitacion, calificacion, comentario };
        Swal.fire("Actualizado", "La reseña fue actualizada", "success");
    } else {
        // crear
        const nueva = {
            id: Date.now(),
            habitacion,
            calificacion,
            comentario,
            fecha: new Date().toISOString().split("T")[0] // YYYY-MM-DD
        };
        resenas.unshift(nueva); // agregar al inicio
        Swal.fire("Creada", "La reseña fue creada", "success");
    }

    closeModal();
    renderResenas();
});

// --- Eliminar reseña ---
function eliminarResena(id) {
    Swal.fire({
        title: "¿Eliminar reseña?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            resenas = resenas.filter(r => r.id != id);
            renderResenas();
            Swal.fire("Eliminada", "La reseña fue eliminada", "success");
        }
    });
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

// --- inicialización ---
btnNew.addEventListener("click", openModalForNew);
renderResenas();
