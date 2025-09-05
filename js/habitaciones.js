// ========================
// CRUD de habitaciones
// ========================

// Simulación inicial (puedes reemplazar con fetch a la API)
let habitaciones = [
    { id: 1, nombre: "Suite Presidencial", precio: 2500, desc: "Incluye jacuzzi y vista al mar", reseñas: [{ usuario: "Ana", texto: "Hermosa habitación!", estrellas: 5 }] },
    { id: 2, nombre: "Habitación Familiar", precio: 1500, desc: "4 camas y cocina equipada", reseñas: [{ usuario: "Carlos", texto: "Muy cómoda para la familia", estrellas: 4 }] }
];

// Mostrar habitaciones
function mostrarHabitaciones() {
    const contenedor = document.querySelector(".cards");
    contenedor.innerHTML = "";
    habitaciones.forEach(hab => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <img src="https://picsum.photos/400/250?random=${hab.id + 10}" alt="${hab.nombre}">
      <div class="card-body">
        <h3>${hab.nombre}</h3>
        <p>${hab.desc}</p>
        <div class="stars">${dibujarEstrellas(promedioEstrellas(hab.reseñas))}</div>
        <div class="card-footer">
          <span>$${hab.precio}</span>
          <button class="btn-book" onclick="editarHabitacion(${hab.id})">Editar</button>
        </div>
      </div>
    `;
        contenedor.appendChild(card);
    });
}

// Dibujar estrellas
function dibujarEstrellas(num) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
        html += `<i class="bi bi-star-fill star ${i <= num ? "" : "muted"}"></i>`;
    }
    return html;
}

// Calcular promedio reseñas
function promedioEstrellas(resenas) {
    if (resenas.length === 0) return 0;
    return Math.round(resenas.reduce((a, r) => a + r.estrellas, 0) / resenas.length);
}

// Crear habitación
function nuevaHabitacion() {
    Swal.fire({
        title: "Nueva Habitación",
        html: `
      <input id="nombre" class="swal2-input" placeholder="Nombre">
      <input id="precio" type="number" class="swal2-input" placeholder="Precio">
      <textarea id="desc" class="swal2-textarea" placeholder="Descripción"></textarea>
    `,
        confirmButtonText: "Guardar",
        preConfirm: () => {
            const nombre = document.getElementById("nombre").value;
            const precio = document.getElementById("precio").value;
            const desc = document.getElementById("desc").value;
            if (!nombre || !precio || !desc) { Swal.showValidationMessage("Todos los campos son obligatorios"); return false; }
            return { nombre, precio, desc };
        }
    }).then(r => {
        if (r.isConfirmed) {
            habitaciones.push({ id: Date.now(), nombre: r.value.nombre, precio: r.value.precio, desc: r.value.desc, reseñas: [] });
            mostrarHabitaciones();
            Swal.fire("Guardado", "Habitación creada correctamente", "success");
        }
    });
}

// Editar
function editarHabitacion(id) {
    const hab = habitaciones.find(h => h.id === id);
    Swal.fire({
        title: "Editar Habitación",
        html: `
      <input id="nombre" class="swal2-input" value="${hab.nombre}">
      <input id="precio" type="number" class="swal2-input" value="${hab.precio}">
      <textarea id="desc" class="swal2-textarea">${hab.desc}</textarea>
    `,
        confirmButtonText: "Actualizar",
        showCancelButton: true,
        cancelButtonText: "Eliminar",
        preConfirm: () => {
            const nombre = document.getElementById("nombre").value;
            const precio = document.getElementById("precio").value;
            const desc = document.getElementById("desc").value;
            if (!nombre || !precio || !desc) { Swal.showValidationMessage("Todos los campos son obligatorios"); return false; }
            return { nombre, precio, desc };
        }
    }).then(r => {
        if (r.isConfirmed) {
            hab.nombre = r.value.nombre;
            hab.precio = r.value.precio;
            hab.desc = r.value.desc;
            mostrarHabitaciones();
            Swal.fire("Actualizado", "Habitación editada", "success");
        } else if (r.dismiss === Swal.DismissReason.cancel) {
            habitaciones = habitaciones.filter(h => h.id !== id);
            mostrarHabitaciones();
            Swal.fire("Eliminado", "Habitación eliminada", "success");
        }
    });
}

document.addEventListener("DOMContentLoaded", mostrarHabitaciones);
