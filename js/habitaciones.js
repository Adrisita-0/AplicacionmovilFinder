/* habitaciones.js - Versión cliente para explorar y reservar habitaciones */

// Datos simulados (se puede reemplazar por fetch a la API)
let habitaciones = [
    { id: 1, numero: "101", tipo: "Suite", precio: 150, estado: "Disponible" },
    { id: 2, numero: "102", tipo: "Doble", precio: 90, estado: "Ocupada" },
    { id: 3, numero: "103", tipo: "Sencilla", precio: 70, estado: "Mantenimiento" }
];

// Referencias DOM
const roomsContainer = document.getElementById("rooms-container");
const modal = document.getElementById("reservation-modal");
const overlay = document.getElementById("modal-overlay");
const btnClose = document.getElementById("modal-close-btn");
const btnCancel = document.getElementById("cancel-btn");
const form = document.getElementById("reservation-form");

const roomIdInput = document.getElementById("room-id");
const roomInfo = document.getElementById("room-info");
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const comentarios = document.getElementById("comentarios");

// Renderizar habitaciones
function renderHabitaciones() {
    roomsContainer.innerHTML = "";

    habitaciones.forEach(h => {
        const card = document.createElement("div");
        card.className = "room-card";

        card.innerHTML = `
      <h4>Habitación ${h.numero} - ${h.tipo}</h4>
      <p><i class="fas fa-dollar-sign"></i> $${h.precio} / noche</p>
      <p><i class="fas fa-door-closed"></i> ${h.estado}</p>
      <button class="reserve-btn" ${h.estado !== "Disponible" ? "disabled" : ""} data-id="${h.id}">
        ${h.estado === "Disponible" ? "Reservar" : "No disponible"}
      </button>
    `;

        roomsContainer.appendChild(card);
    });

    document.querySelectorAll(".reserve-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
            openModal(id);
        });
    });
}

// --- Modal ---
function openModal(id) {
    const room = habitaciones.find(r => r.id == id);
    if (!room) return;

    roomIdInput.value = room.id;
    roomInfo.textContent = `Habitación ${room.numero} - ${room.tipo} ($${room.precio}/noche)`;

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    form.reset();
}

overlay.addEventListener("click", closeModal);
btnClose.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

// --- Confirmar reserva ---
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = roomIdInput.value;
    const entrada = checkin.value;
    const salida = checkout.value;
    const comentario = comentarios.value.trim();

    if (!entrada || !salida) {
        Swal.fire("Error", "Selecciona las fechas de entrada y salida", "error");
        return;
    }

    Swal.fire("Reserva confirmada",
        `Has reservado la habitación ${id} del ${entrada} al ${salida}`,
        "success"
    );

    closeModal();
});

// Inicializar
renderHabitaciones();
