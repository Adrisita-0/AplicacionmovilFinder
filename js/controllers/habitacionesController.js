import {
    consultarHabitaciones,
    consultarClientes,
    consultarEstadosReserva,
    consultarMetodosPago,
    registrarHabitaciones,
    actualizarHabitaciones,
    eliminarHabitaciones
} from "../services/habitacionesService.js";

import { registrarReservas } from "../services/reservasService.js";

document.addEventListener("DOMContentLoaded", () => {
    // Referencias DOM
    const roomsContainer = document.getElementById("rooms-container");
    const modal = document.getElementById("reservation-modal");
    const overlay = document.getElementById("modal-overlay");
    const btnClose = document.getElementById("modal-close-btn");
    const btnCancel = document.getElementById("cancel-btn");
    const form = document.getElementById("reservation-form");

    const roomIdInput = document.getElementById("room-id");
    const roomInfo = document.getElementById("room-info");
    const idCliente = document.getElementById("idCliente");
    const idEstadoReserva = document.getElementById("idEstadoReserva");
    const idMetodoPago = document.getElementById("idMetodoPago");
    const fechaReserva = document.getElementById("fechaReserva");
    const precioTotalReserva = document.getElementById("precioTotalReserva");
    let selectedroom = null

    init();

    async function CargarHabitaciones() {
        try {
            const habitaciones = await consultarHabitaciones();
            roomsContainer.innerHTML = "";

            if (!habitaciones || habitaciones.length === 0) {
                roomsContainer.innerHTML = `<h3>Actualmente no hay habitaciones registradas</h3>`;
                return;
            }

            habitaciones.forEach(h => {
                const card = document.createElement("div");
                card.className = "room-card";
                card.innerHTML = `
                    <h4>Habitación ${h.numeroHabitacion} - ${h.nombreTipoHabitacion}</h4>
                    <p><i class="fas fa-dollar-sign"></i> $${h.precioHabitacion} / noche</p>
                    <p><i class="fas fa-door-closed"></i> ${h.nombreEstadoHabitacion}</p>
                    <button class="reserve-btn" ${h.nombreEstadoHabitacion !== "Disponible" ? "disabled" : ""} data-id="${h.idHabitacion}">
                        ${h.nombreEstadoHabitacion === "Disponible" ? "Reservar" : "No disponible"}
                    </button>
                `;

                roomsContainer.appendChild(card);

                // Agregar el evento click a este botón específico
                card.querySelector(".reserve-btn").addEventListener("click", () => openModal(h));
            });
        } catch (ex) {
            Swal.fire("Error", "Error al cargar las habitaciones: " + ex, "error");
        }
    }

    async function cargarClientes() {
        try {
            const data = await consultarClientes();
            const clientes = data.content;

            idCliente.innerHTML = "";
            const option = document.createElement("option");
            option.value = "";
            option.disabled = true;
            option.selected = true;
            option.hidden = true;
            option.textContent = "Seleccione...";
            idCliente.appendChild(option);

            clientes.forEach(e => {
                const opcion = document.createElement("option");
                opcion.value = e.idCliente;
                opcion.textContent = e.nombreCliente;
                idCliente.appendChild(opcion);
            });
        } catch (err) {
            Swal.fire("Error", "Error al cargar los clientes: " + err, "error");
        }
    }

    async function cargarEstadosReserva() {
        try {
            const data = await consultarEstadosReserva();
            const estadosReserva = data.content;

            idEstadoReserva.innerHTML = "";
            const option = document.createElement("option");
            option.value = "";
            option.disabled = true;
            option.selected = true;
            option.hidden = true;
            option.textContent = "Seleccione...";
            idEstadoReserva.appendChild(option);

            estadosReserva.forEach(e => {
                const opcion = document.createElement("option");
                opcion.value = e.idEstadoReserva;
                opcion.textContent = e.nombreEstadoReserva;
                idEstadoReserva.appendChild(opcion);
            });
        } catch (err) {
            Swal.fire("Error", "Error al cargar estados de reserva: " + err, "error");
        }
    }

    async function cargarMetodosPago() {
        try {
            const data = await consultarMetodosPago();
            const metodosPago = data.content;

            idMetodoPago.innerHTML = "";
            const option = document.createElement("option");
            option.value = "";
            option.disabled = true;
            option.selected = true;
            option.hidden = true;
            option.textContent = "Seleccione...";
            idMetodoPago.appendChild(option);

            metodosPago.forEach(e => {
                const opcion = document.createElement("option");
                opcion.value = e.idMetodoPago;
                opcion.textContent = e.nombreMetodoPago;
                idMetodoPago.appendChild(opcion);
            });
        } catch (err) {
            Swal.fire("Error", "Error al cargar los metodos de pago: " + err, "error");
        }
    }

    function init() {
        CargarHabitaciones();
        cargarEstadosReserva();
        cargarClientes();
        cargarMetodosPago();
    }

    function openModal(room) {
        if (!room) return;

        selectedroom = room;

        roomIdInput.value = room.idHabitacion;
        roomInfo.textContent = `Habitación ${room.numeroHabitacion} - ${room.nombreTipoHabitacion} ($${room.precioHabitacion}/noche)`;
        precioTotalReserva.value = Number(room.precioHabitacion);

        modal.classList.remove("hidden");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.add("hidden");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        form.reset();
        selectedroom = null;
    }

    overlay.addEventListener("click", closeModal);
    btnClose.addEventListener("click", closeModal);
    btnCancel.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
    });

    // Único evento submit con validaciones y registro
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fecha = new Date(fechaReserva.value);
        const fechaActual = new Date();

        if (!fechaReserva.value || fecha < fechaActual) {
            Swal.fire("Error", "Selecciona una fecha válida mayor a la fecha actual", "error");
            return;
        }
        const data = {
            idCliente: idCliente.value,
            idEstadoReserva: idEstadoReserva.value,
            idMetodoPago: idMetodoPago.value,
            fechaReserva: fechaReserva.value,
            precioTotalReserva: precioTotalReserva.value
        };

        try {
            await registrarReservas(data);
            Swal.fire("Reserva confirmada", `Has reservado la habitación ${selectedroom.numeroHabitacion} para ${fechaReserva.value}`, "success");
            closeModal();
            await CargarHabitaciones();
        } catch (ex) {
            Swal.fire("Error", "Error al registrar la reserva: " + ex, "error");
        }
    });
});
