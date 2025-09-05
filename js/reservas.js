document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const upcomingContainer = document.getElementById('upcoming-reservations');
    const pastContainer = document.getElementById('past-reservations');
    const modal = document.getElementById('reservation-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    const addReservationBtn = document.getElementById('add-reservation-btn');
    const saveBtn = document.getElementById('save-reservation-btn');
    const deleteBtn = document.getElementById('delete-reservation-btn');

    // --- Funciones de Utilidad ---
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    function isUpcoming(reservation) {
        const checkInDate = new Date(reservation.checkIn);
        const today = new Date();
        return checkInDate >= today;
    }

    function renderReservations() {
        // Limpiar los contenedores
        upcomingContainer.innerHTML = '';
        pastContainer.innerHTML = '';

        const sortedReservations = [...reservations].sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

        sortedReservations.forEach(res => {
            const card = document.createElement('div');
            card.classList.add('reservation-card');
            card.dataset.id = res.id;

            const isUpcomingReservation = isUpcoming(res);
            card.classList.add(isUpcomingReservation ? 'upcoming' : 'past');

            const status = isUpcomingReservation ? 'Confirmada' : 'Completada';
            const statusClass = isUpcomingReservation ? 'upcoming-badge' : 'past-badge';

            card.innerHTML = `
                <div class="card-header">
                    <span class="room-name">${res.room}</span>
                    <span class="status-badge ${statusClass}">${status}</span>
                </div>
                <div class="card-details">
                    <p>Entrada: <strong>${formatDate(res.checkIn)}</strong></p>
                    <p>Salida: <strong>${formatDate(res.checkOut)}</strong></p>
                    <p>Comentarios: <strong>${res.comments || 'N/A'}</strong></p>
                </div>
                <button class="edit-btn"><i class="fas fa-pencil-alt"></i></button>
            `;

            if (isUpcomingReservation) {
                upcomingContainer.appendChild(card);
            } else {
                pastContainer.appendChild(card);
            }
        });

        // Añadir event listeners a los nuevos botones de editar
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.closest('.reservation-card').dataset.id;
                openEditModal(id);
            });
        });
    }

    function openModal(title, reservation = null) {
        modalTitle.textContent = title;
        document.getElementById('reservation-id').value = reservation ? reservation.id : '';
        document.getElementById('room-description').value = reservation ? reservation.room : '';
        document.getElementById('check-in-date').value = reservation ? reservation.checkIn.slice(0, 16) : '';
        document.getElementById('check-out-date').value = reservation ? reservation.checkOut.slice(0, 16) : '';
        document.getElementById('reservation-comments').value = reservation ? reservation.comments : '';

        if (reservation && isUpcoming(reservation)) {
            deleteBtn.classList.remove('hidden');
        } else {
            deleteBtn.classList.add('hidden');
        }

        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    function validateDates(checkIn, checkOut) {
        if (!checkIn || !checkOut) {
            Swal.fire('Error', 'Por favor, selecciona una fecha y hora de entrada y salida.', 'error');
            return false;
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const now = new Date();

        if (checkInDate < now) {
            Swal.fire('Error', 'La fecha y hora de entrada no puede ser en el pasado.', 'error');
            return false;
        }

        if (checkOutDate <= checkInDate) {
            Swal.fire('Error', 'La fecha y hora de salida debe ser posterior a la de entrada.', 'error');
            return false;
        }
        return true;
    }

    // --- Manejo de Eventos ---

    // Botón para agregar nueva reserva
    addReservationBtn.addEventListener('click', () => {
        openModal('Agregar Nueva Reserva');
    });

    // Botón de cerrar modal
    modalCloseBtn.addEventListener('click', closeModal);

    // Botón de guardar/actualizar
    saveBtn.addEventListener('click', () => {
        const id = document.getElementById('reservation-id').value;
        const room = document.getElementById('room-description').value.trim();
        const checkIn = document.getElementById('check-in-date').value;
        const checkOut = document.getElementById('check-out-date').value;
        const comments = document.getElementById('reservation-comments').value.trim();

        if (!room || !checkIn || !checkOut) {
            Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
            return;
        }
        if (!validateDates(checkIn, checkOut)) {
            return;
        }

        if (id) {
            // Lógica de Actualización (Update)
            const index = reservations.findIndex(res => res.id === id);
            if (index !== -1) {
                reservations[index] = { id, room, checkIn, checkOut, comments };
                Swal.fire('Actualizada', 'La reserva ha sido actualizada con éxito.', 'success');
            }
        } else {
            // Lógica de Agregar (Create)
            const newId = 'reserva' + (reservations.length + 1);
            const newReservation = { id: newId, room, checkIn, checkOut, comments };
            reservations.push(newReservation);
            Swal.fire('Guardada', 'Tu nueva reserva ha sido guardada con éxito.', 'success');
        }

        closeModal();
        renderReservations();
    });

    // Botón de eliminar
    deleteBtn.addEventListener('click', () => {
        const id = document.getElementById('reservation-id').value;

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
                reservations = reservations.filter(res => res.id !== id);
                Swal.fire('Eliminada', 'La reserva ha sido eliminada.', 'success');
                closeModal();
                renderReservations();
            }
        });
    });

    // Función para abrir el modal en modo edición
    function openEditModal(id) {
        const reservation = reservations.find(res => res.id === id);
        if (reservation) {
            openModal('Editar Reserva', reservation);
        }
    }

    // Renderizar las reservas al cargar la página
    renderReservations();
});