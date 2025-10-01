document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // Selección de elementos
    // =========================
    const roomItems = document.querySelectorAll('.trending-item');
    const roomDetailsModal = document.getElementById('room-details-modal');
    const reservationModal = document.getElementById('reservation-modal');
    const roomDetailsModalCloseBtn = roomDetailsModal ? roomDetailsModal.querySelector('.modal-close-btn') : null;
    const reservationModalCloseBtn = reservationModal ? reservationModal.querySelector('.modal-close-btn') : null;
    const reserveBtn = document.getElementById('modal-reserve-btn');
    const searchInput = document.getElementById("search-input");
    const notificationBtn = document.getElementById("notification-btn");

    // =========================
    // Funciones para modales
    // =========================
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('hidden');
    }
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
    }

    // =========================
    // Búsqueda en tiempo real
    // =========================
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = this.value.toLowerCase();
            roomItems.forEach(item => {
                const roomNameEl = item.querySelector("h4");
                if (!roomNameEl) return;
                const roomName = roomNameEl.textContent.toLowerCase();
                item.style.display = roomName.includes(query) ? "block" : "none";
            });
        });
    }

    // =========================
    // Notificaciones
    // =========================
    if (notificationBtn) {
        notificationBtn.addEventListener("click", function (e) {
            e.preventDefault();
            Swal.fire({
                title: '¡Tienes nuevas notificaciones!',
                html: `
                    <ul style="text-align:left; padding-left:20px">
                        <li>Tu reserva fue confirmada ✅</li>
                        <li>Oferta especial en Suite de Lujo 💰</li>
                        <li>Nuevo comentario en tus reseñas 📝</li>
                    </ul>
                `,
                icon: 'info',
                confirmButtonText: 'Cerrar'
            });
        });
    }

    // =========================
    // Abrir modal de habitación
    // =========================
    if (roomItems && roomItems.length && roomDetailsModal) {
        roomItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const roomNameEl = item.querySelector('h4');
                const roomPriceEl = item.querySelector('.trending-price');
                if (!roomNameEl || !roomPriceEl) return;

                const roomName = roomNameEl.textContent;
                const roomPrice = roomPriceEl.textContent;

                document.getElementById('modal-room-name').textContent = roomName;
                document.getElementById('modal-price').textContent = roomPrice;

                const reservationNameEl = document.getElementById('reservation-room-name');
                if (reservationNameEl) reservationNameEl.textContent = `Reservando: ${roomName}`;

                openModal('room-details-modal');
            });
        });
    }

    // =========================
    // Botón "Reservar ahora"
    // =========================
    if (reserveBtn) {
        reserveBtn.addEventListener('click', () => {
            if (roomDetailsModal) closeModal('room-details-modal');
            if (reservationModal) openModal('reservation-modal');
        });
    }

    // =========================
    // Confirmar reserva
    // =========================
    const confirmBtn = document.getElementById('confirm-reservation-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const checkInDate = document.getElementById('check-in-date').value;
            const checkOutDate = document.getElementById('check-out-date').value;
            const today = new Date().toISOString().split('T')[0];

            if (!checkInDate || !checkOutDate) {
                Swal.fire({ icon: 'error', title: 'Error de validación', text: 'Por favor, selecciona una fecha de entrada y salida.' });
                return;
            }
            if (checkInDate < today) {
                Swal.fire({ icon: 'error', title: 'Fecha inválida', text: 'La fecha de entrada no puede ser en el pasado.' });
                return;
            }
            if (checkOutDate <= checkInDate) {
                Swal.fire({ icon: 'error', title: 'Fechas incorrectas', text: 'La fecha de salida debe ser posterior a la fecha de entrada.' });
                return;
            }

            const roomName = document.getElementById('reservation-room-name').textContent;
            Swal.fire({
                title: '¡Reserva Confirmada!',
                text: `${roomName.replace('Reservando: ', '')} ha sido reservada con éxito.`,
                icon: 'success',
                confirmButtonText: 'OK',
                allowOutsideClick: false
            }).then(() => closeModal('reservation-modal'));
        });
    }

    // =========================
    // Botones de cerrar modales
    // =========================
    if (roomDetailsModalCloseBtn) roomDetailsModalCloseBtn.addEventListener('click', () => closeModal('room-details-modal'));
    if (reservationModalCloseBtn) reservationModalCloseBtn.addEventListener('click', () => closeModal('reservation-modal'));

});
