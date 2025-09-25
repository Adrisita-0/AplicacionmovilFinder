import {
    consultarReservas,
    consultarClientes,
    consultarEstadosReserva,
    consultarMetodosPago,
    registrarReservas,
    actualizarReservas,
    eliminarReservas,
} from "../services/reservasService.js";

let currentPage = 0;
let currentSize = 10;

document.addEventListener("DOMContentLoaded", ()=>{
    const pastContainer = document.getElementById('past-reservations');
    const modal = document.getElementById('reservation-modal');
    const tableBody = document.querySelector("#itemsTable tbody")
    const form = document.getElementById("reservaForm");
    const overlay = document.getElementById("modal-overlay");
    const modalTitle = document.getElementById('modal-title');
    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    const addReservationBtn = document.getElementById('add-reservation-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelbtn = document.getElementById('cancel-btn');
    const idReserva = document.getElementById("idReserva");
    const idCliente = document.getElementById("idCliente");
    const idEstadoReserva = document.getElementById("idEstadoReserva");
    const idMetodoPago = document.getElementById("idMetodoPago");
    const fechaReserva = document.getElementById("fechaReserva");
    const precioTotalReserva = document.getElementById("precioTotalReserva");


    //Selector de tamaño de página
    const sizeSelector = document.getElementById("pageSize");
    sizeSelector.addEventListener("change", ()=>{
        currentSize = parseInt(sizeSelector.value);
        currentPage = 0;
        cargarReservas();
    });

    //Submit del formulario (Actualizar reserva)
    form.addEventListener("submit", async (e)=>{
        e.preventDefault();
        let id = idReserva.value;

        const payload ={
            idCliente: idCliente.value,
            idEstadoReserva: idEstadoReserva.value,
            idMetodoPago: idMetodoPago.value,
            fechaReserva: fechaReserva.value,
            precioTotalReserva: Number(precioTotalReserva.value),
        };
        const fecha = new Date(fechaReserva.value);
        const fechaActual = new Date();
        const milisegundosEnUnDia = 1000 * 60 * 60 * 24;

        const diferenciaEnDias = (fecha - fechaActual)/ milisegundosEnUnDia;

        if (!fechaReserva.value || diferenciaEnDias < 0) {
            Swal.fire("Error", "Selecciona una fecha válida mayor a la fecha actual", "error");
            return;
        }
        if(diferenciaEnDias < 15){
            Swal.fire("Info", "No se puede actualizar, la reserva debe hacerse con 15 dias de anticipacion", "info");
            return;
        }
                    
        //Actualizar reserva
        try{
            if(id){
                await actualizarReservas(id, payload);
                Swal.fire("Exitoso", "La actualizacion fue exitosa", "success")
            }
            modal.classList.add("hidden");
            await cargarReservas();
        }catch(err){
             Swal.fire("Error", "Error al guardar la reserva: " + err, "error");
        }
    });

    //Funcion para cargar las reservas con paginación
    async function cargarReservas(){
        try{
            //Aqui mandamos a traer las reservas del backend.
            //Le indcamos la cantidad de registros y la página actual.
            const data = await consultarReservas(currentPage, currentSize);
            const items = data.content || [];

            //Limpiamos la tabla antes de llenarla.
            tableBody.innerHTML = "";
            renderPaginacion(data.number, data.totalPages);

            //Renderizado de filas en la tabla
            items.forEach((item) => {
                //Por cada registro se crea un <tr> (Table Row - Fila)
                const tr = document.createElement("tr");

                //ID
                const tdId = document.createElement("td");
                tdId.textContent = item.idReserva;
                tdId.hidden = true;
                tr.appendChild(tdId);

                //Cliente
                const tdCliente = document.createElement("td");
                tdCliente.textContent = item.nombreCliente;
                tr.appendChild(tdCliente);


                //EstadoReserva
                const tdEstadoReserva = document.createElement("td");
                tdEstadoReserva.textContent = item.nombreEstadoReserva;
                tr.appendChild(tdEstadoReserva);


                //MetodoPago
                const tdMetodoPago = document.createElement("td");
                tdMetodoPago.textContent = item.nombreMetodoPago;
                tr.appendChild(tdMetodoPago);


                //fechaReserva
                const tdFechaReserva = document.createElement("td");
                tdFechaReserva.textContent = item.fechaReserva;
                tr.appendChild(tdFechaReserva);

                //precioTotalReserva
                const tdPrecioTotalReserva = document.createElement("td");
                tdPrecioTotalReserva.textContent = item.precioTotalReserva;
                tr.appendChild(tdPrecioTotalReserva);

                //Botones Editar/Eliminar
                const tdBtns = document.createElement("td");
                tdBtns.className = "text-center acciones-td"

                const btnEdit = document.createElement("button");
                btnEdit.className = "btn btn-sm btn-outline-secondary me-1 edit-btn";
                btnEdit.title = "Editar";

                //El icono del botón es sacado de lucide.dev
                btnEdit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>`;

                const fecha = new Date(item.fechaReserva);
                const fechaActual = new Date();

                if(fecha < fechaActual){
                    btnEdit.disabled = true;
                }else{
                    btnEdit.disabled = false;
                }

                btnEdit.addEventListener("click", ()=> setFormulario(item));
                tdBtns.appendChild(btnEdit);

                const btnDel = document.createElement("button");
                btnDel.className = "btn btn-sm btn-outline-danger delete-btn";
                btnDel.title = "Eliminar";

                //El icono del botón es sacado de lucide.dev
                btnDel.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
                
                btnDel.addEventListener("click", ()=>{
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
                            eliminarReserva(item.idReserva);
                            Swal.fire('Eliminada', 'La reserva ha sido eliminada.', 'success');
                        }
                    });
                });
                tdBtns.appendChild(btnDel);

                tr.appendChild(tdBtns);

                //La fila que construimos anexada al tBody
                tableBody.appendChild(tr);
            });
        }catch(err){
            Swal.fire("Error", "Error al cargar reservas " + err, "error");
        }
    }
    
    //Cargar clientes para <select>
    async function cargarClientes(){
        try{
            const data = await consultarClientes();
            const Clientes = data.content;

            idCliente.innerHTML = "";
            const opt = document.createElement("option");
            opt.value = "";
            opt.disabled = true;
            opt.selected = true;
            opt.hidden = true;
            opt.textContent = "Seleccione...";
            idCliente.appendChild(opt);

            Clientes.forEach((c) => {
                const option = document.createElement("option");
                option.value = c.idCliente;
                option.textContent = c.nombreCliente
                idCliente.appendChild(option);
            });
        }catch(err){
            Swal.fire("Error", "Error al cargar los clientes: " + err, "error");
        }
    }

    //Cargar estados de reserva para <select>
    async function cargarEstadosReserva(){
        try{
            const data = await consultarEstadosReserva();
            const EstadosReserva = data.content;

            idEstadoReserva.innerHTML = "";
            const opt = document.createElement("option");
            opt.value = "";
            opt.disabled = true;
            opt.selected = true;
            opt.hidden = true;
            opt.textContent = "Seleccione...";
            idEstadoReserva.appendChild(opt);

            EstadosReserva.forEach((e) => {
                const option = document.createElement("option");
                option.value = e.idEstadoReserva;
                option.textContent = e.nombreEstadoReserva;
                idEstadoReserva.appendChild(option);
            });
        }catch(err){
            Swal.fire("Error", "Error al cargar los estados de las reservas: " + err, "error");
        }
    }

    //Cargar metodos de pago para <select>
    async function cargarMetodosPago(){
        try{
            const data = await consultarMetodosPago();
            const MetodosPago = data.content;

            idMetodoPago.innerHTML = "";
            const opt = document.createElement("option");
            opt.value = "";
            opt.disabled = true;
            opt.selected = true;
            opt.hidden = true;
            opt.textContent = "Seleccione...";
            idMetodoPago.appendChild(opt);

            MetodosPago.forEach((m) => {
                const option = document.createElement("option");
                option.value = m.idMetodoPago;
                option.textContent = m.nombreMetodoPago;
                idMetodoPago.appendChild(option);
            });
        }catch(err){
            Swal.fire("Error", "Error al cargar los metodos de pago: " + err, "error");
        }
    }

    //Rellenar formulario para editar reserva
    function setFormulario(item){
        idReserva.value = item.idReserva;
        idCliente.value = item.idCliente;
        idEstadoReserva.value = item.idEstadoReserva;
        idMetodoPago.value = item.idMetodoPago;
        fechaReserva.value = item.fechaReserva;
        precioTotalReserva.value = item.precioTotalReserva;

        modalTitle.textContent = "Editar Reserva";
        modal.classList.remove("hidden");
    }

    //Eliminar reserva por ID
    async function eliminarReserva(id){
        try{
            await eliminarReservas(id);
            await cargarReservas();
        }catch(err){
            Swal.fire("Error", "Error al eliminar reserva: " + err, "error");
        }
    }

    //Renderizado de paginación
    function renderPaginacion(current, totalPages){
        const paginacion = document.getElementById("paginacion");
        paginacion.innerHTML = ""; //Limpiamos el contenedor antes de dibujar los botones

        //Botón "Anterior"
        const prev = document.createElement("li");
        //Si estamos en la primera pagina (current === 0), se desactiva el botón
        prev.className = `page-item ${current === 0 ? "disabled": ""}`;

        const prevLink = document.createElement("a");
        prevLink.className = "page-link"; //Clase de Bootstrap para darle estilo
        prevLink.href = "#"; //No dirige a otra pagina
        prevLink.textContent = "Anterior" //Texto visible en el botón
        prevLink.addEventListener("click", (e) => {
            e.preventDefault(); //Evita que el enlace recargue la página
            if(current > 0){
                currentPage = current - 1 //Retrocedemos una pagina
                cargarReservas(); //Y recargamos las reservas
            }
        });
        prev.appendChild(prevLink); //Metemos el <a> dentro del <li>
        paginacion.appendChild(prev); //Agregamos el botón al paginador

        //Botones numéricos
        for(let i = 0; i < totalPages; i++){
            const li = document.createElement("li");
            //Si "i" es la pagina actual, se marca como "active"
            li.className = `page-item ${i === current ? "active": ""}`

            const link = document.createElement("a");
            link.className = "page-link";
            link.href = "#";
            link.textContent = i + 1; //Mostramos el número de página (1, 2, 3, ...)
            link.addEventListener("click", (e) => {
                e.preventDefault();
                currentPage = i; //Cambiamos la página actual al número clicado
                cargarReservas(); //Volvemos a pedir reservas a esa página
            });
            li.appendChild(link),
            paginacion.appendChild(li);
        }

        //Botón "Siguiente"
        const next = document.createElement("li");
        //Se desactiva si ya estamos en la última página
        next.className = `page-item ${current >= totalPages - 1 ? "disabled": ""}`;

        const nextLink = document.createElement("a");
        nextLink.className = "page-link";
        nextLink.href = "#";
        nextLink.textContent = "Siguiente";
        nextLink.addEventListener("click", (e) => {
            e.preventDefault();
            if(current < totalPages - 1){
                currentPage = current + 1; //Avanzamos una página
                cargarReservas(); //Y actualizamos las reservas
            }
        });
        next.appendChild(nextLink);
        paginacion.appendChild(next);
    }

    function closeModal() {
        modal.classList.add("hidden");
        document.body.style.overflow = "";
        form.reset();
    }

    overlay.addEventListener("click", closeModal);
    modalCloseBtn.addEventListener("click", closeModal);
    cancelbtn.addEventListener("click", closeModal)
    

    //Cargar datos iniciales
    cargarClientes();
    cargarEstadosReserva();
    cargarMetodosPago();
    cargarReservas();
});