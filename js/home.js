document.addEventListener('DOMContentLoaded', () => {

    // modal funciones 
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // --- Lógica Principal ---
    //aqui se seleccionan las tarjetas de las habitaciones con la clase y se guardan en una lista
    const roomItems = document.querySelectorAll('.trending-item');

    // se selecciona el modal de detalles de la habitación por su ID.
    const roomDetailsModal = document.getElementById('room-details-modal');

    //  aqui tambien se selcciona el modal  solo que aquie es de reserva por su ID.
    const reservationModal = document.getElementById('reservation-modal');

    // Selecciona el botón para cerrar el modal de detalles.
    // La parte `roomDetailsModal ? ... : null` es una validación para asegurar que el modal existe antes de buscar el botón dentro de él.
    const roomDetailsModalCloseBtn = roomDetailsModal ? roomDetailsModal.querySelector('.modal-close-btn') : null;

    // Selecciona el botón para cerrar el modal de reserva, usando la misma validación que la línea anterior.
    const reservationModalCloseBtn = reservationModal ? reservationModal.querySelector('.modal-close-btn') : null;

    // Selecciona el botón de "Reservar ahora" que se encuentra dentro del modal de detalles.
    const reserveBtn = document.getElementById('modal-reserve-btn');


    //aqui se manejan los clicks en las tarjetas para las habitaciones para poder abrirlas en el modal 
    roomItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();



            const roomName = item.querySelector('h4').textContent;
            const roomPrice = item.querySelector('.trending-price').textContent;

            if (roomDetailsModal) {

                //actualizamos el contenido del modal con datos que estan en la tarjeta 
                document.getElementById('modal-room-name').textContent = roomName;
                document.getElementById('modal-price').textContent = roomPrice;
                document.getElementById('reservation-room-name').textContent = `Reservando: ${roomName}`;

                openModal('room-details-modal');
            }
        });
    });


    //aqui puse el boton de reservar pero con el modal de los detalles
    if (reserveBtn) {
        reserveBtn.addEventListener('click', () => {
            if (roomDetailsModal) {
                closeModal('room-details-modal');
            }
            if (reservationModal) {
                openModal('reservation-modal');
            }
        });
    }


    //aqui esta el boton de reserva 
    document.getElementById('confirm-reservation-btn').addEventListener('click', () => {
        const checkInDate = document.getElementById('check-in-date').value;
        const checkOutDate = document.getElementById('check-out-date').value;
        const today = new Date().toISOString().split('T')[0];

        // se validan las fechas 
        if (!checkInDate || !checkOutDate) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'Por favor, selecciona una fecha de entrada y salida.'
            });
            return;
        }

        if (checkInDate < today) {
            Swal.fire({
                icon: 'error',
                title: 'Fecha inválida',
                text: 'La fecha de entrada no puede ser en el pasado.'
            });
            return;
        }

        if (checkOutDate <= checkInDate) {
            Swal.fire({
                icon: 'error',
                title: 'Fechas incorrectas',
                text: 'La fecha de salida debe ser posterior a la fecha de entrada.'
            });
            return;
        }


        //cuando las fechas sean validas, mostrara la alerta de que si esta bien 
        const roomName = document.getElementById('reservation-room-name').textContent;
        Swal.fire({
            title: '¡Reserva Confirmada!',
            text: `${roomName.replace('Reservando: ', '')} ha sido reservada con éxito.`,
            icon: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false
        }).then(() => {
            closeModal('reservation-modal');
        });
    });

    // aqui esta la funcion del  modal 
    if (roomDetailsModalCloseBtn) {
        roomDetailsModalCloseBtn.addEventListener('click', () => closeModal('room-details-modal'));
    }
    if (reservationModalCloseBtn) {
        reservationModalCloseBtn.addEventListener('click', () => closeModal('reservation-modal'));
    }
});