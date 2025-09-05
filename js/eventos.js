// ========================
// CRUD de eventos
// ========================

let eventos = [
    { id: 1, nombre: "Noche de Jazz", desc: "Velada en el bar", precio: 30 },
    { id: 2, nombre: "Conferencia Ejecutiva", desc: "Capacidad 500 personas", precio: 200 }
];

function mostrarEventos() {
    const cont = document.querySelector(".cards");
    cont.innerHTML = "";
    eventos.forEach(e => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <img src="https://picsum.photos/400/250?random=${e.id + 50}" alt="Evento">
      <div class="card-body">
        <h3>${e.nombre}</h3>
        <p>${e.desc}</p>
        <div class="card-footer">
          <span>$${e.precio}</span>
          <button class="btn-book" onclick="editarEvento(${e.id})">Editar</button>
        </div>
      </div>
    `;
        cont.appendChild(card);
    });
}

function nuevoEvento() {
    Swal.fire({
        title: "Nuevo Evento",
        html: `
      <input id="nombre" class="swal2-input" placeholder="Nombre">
      <textarea id="desc" class="swal2-textarea" placeholder="Descripción"></textarea>
      <input id="precio" type="number" class="swal2-input" placeholder="Precio">
    `,
        confirmButtonText: "Guardar",
        preConfirm: () => {
            const nombre = document.getElementById("nombre").value;
            const desc = document.getElementById("desc").value;
            const precio = document.getElementById("precio").value;
            if (!nombre || !desc || !precio) { Swal.showValidationMessage("Todos los campos son obligatorios"); return false; }
            return { nombre, desc, precio };
        }
    }).then(r => {
        if (r.isConfirmed) {
            eventos.push({ id: Date.now(), ...r.value });
            mostrarEventos();
            Swal.fire("Guardado", "Evento creado", "success");
        }
    });
}

function editarEvento(id) {
    const ev = eventos.find(e => e.id === id);
    Swal.fire({
        title: "Editar Evento",
        html: `
      <input id="nombre" class="swal2-input" value="${ev.nombre}">
      <textarea id="desc" class="swal2-textarea">${ev.desc}</textarea>
      <input id="precio" type="number" class="swal2-input" value="${ev.precio}">
    `,
        confirmButtonText: "Actualizar",
        showCancelButton: true,
        cancelButtonText: "Eliminar",
        preConfirm: () => {
            const nombre = document.getElementById("nombre").value;
            const desc = document.getElementById("desc").value;
            const precio = document.getElementById("precio").value;
            if (!nombre || !desc || !precio) { Swal.showValidationMessage("Todos los campos son obligatorios"); return false; }
            return { nombre, desc, precio };
        }
    }).then(r => {
        if (r.isConfirmed) {
            ev.nombre = r.value.nombre;
            ev.desc = r.value.desc;
            ev.precio = r.value.precio;
            mostrarEventos();
            Swal.fire("Actualizado", "Evento modificado", "success");
        } else if (r.dismiss === Swal.DismissReason.cancel) {
            eventos = eventos.filter(e => e.id !== id);
            mostrarEventos();
            Swal.fire("Eliminado", "Evento eliminado", "success");
        }
    });
}

document.addEventListener("DOMContentLoaded", mostrar)
