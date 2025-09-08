// ============================
// Eventos JS - Gestión de eventos para huésped
// ============================

document.addEventListener("DOMContentLoaded", () => {
    const eventsContainer = document.getElementById("events-container");
    const eventModal = document.getElementById("event-modal");
    const modalOverlay = document.getElementById("modal-overlay");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const eventForm = document.getElementById("event-form");
    const eventInfo = document.getElementById("event-info");
    const eventIdInput = document.getElementById("event-id");

    // Simulación de datos de eventos (puedes reemplazar por API)
    const events = [
        { id: 1, nombre: "Cena de Gala", fecha: "2025-09-20", hora: "19:00" },
        { id: 2, nombre: "Clases de Cocina", fecha: "2025-09-22", hora: "15:00" },
        { id: 3, nombre: "Tour de Spa", fecha: "2025-09-25", hora: "10:00" },
    ];

    // Función para renderizar eventos
    function renderEvents() {
        eventsContainer.innerHTML = "";
        events.forEach(ev => {
            const card = document.createElement("div");
            card.classList.add("event-card");
            card.innerHTML = `
                <div>
                    <h4>${ev.nombre}</h4>
                    <p>${ev.fecha} - ${ev.hora}</p>
                </div>
                <button data-id="${ev.id}">Registrarse</button>
            `;
            eventsContainer.appendChild(card);
        });
    }

    renderEvents();

    // Abrir modal
    eventsContainer.addEventListener("click", e => {
        if (e.target.tagName === "BUTTON") {
            const id = e.target.dataset.id;
            const selectedEvent = events.find(ev => ev.id == id);

            eventIdInput.value = selectedEvent.id;
            eventInfo.textContent = `${selectedEvent.nombre} - ${selectedEvent.fecha} ${selectedEvent.hora}`;

            eventModal.classList.remove("hidden");
            eventModal.setAttribute("aria-hidden", "false");
        }
    });

    // Cerrar modal
    function closeModal() {
        eventModal.classList.add("hidden");
        eventModal.setAttribute("aria-hidden", "true");
        eventForm.reset();
    }

    modalCloseBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    // Enviar formulario
    eventForm.addEventListener("submit", e => {
        e.preventDefault();
        const participantes = document.getElementById("participantes").value;
        const comentarios = document.getElementById("comentarios-evento").value;

        Swal.fire({
            icon: "success",
            title: "Registro confirmado",
            text: `Te has registrado para el evento con ${participantes} participante(s).`
        });

        closeModal();
    });
});
