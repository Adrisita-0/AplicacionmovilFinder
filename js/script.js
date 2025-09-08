// Datos de ejemplo de reseñas (luego puedes conectarlo a tu API)
const reseñas = [
    { usuario: "Maria.R", habitacion: "Suite de Lujo", comentario: "Excelente experiencia, muy cómodo.", estrellas: 5 },
    { usuario: "Maria.R", habitacion: "Habitación Doble", comentario: "Buena atención, pero la cama un poco dura.", estrellas: 4 },
    { usuario: "María R.", habitacion: "Habitación Sencilla", comentario: "Precio accesible y limpio.", estrellas: 4 }
];

// Función para renderizar reseñas
function mostrarReseñas(lista) {
    const contenedor = document.getElementById("listaReseñas");
    contenedor.innerHTML = "";

    lista.forEach(r => {
        const div = document.createElement("div");
        div.classList.add("reseña");
        div.innerHTML = `
      <h3>${r.habitacion}</h3>
      <div class="estrellas">${"⭐".repeat(r.estrellas)}</div>
      <p><strong>${r.usuario}:</strong> ${r.comentario}</p>
    `;
        contenedor.appendChild(div);
    });
}

// Filtrar reseñas con barra de búsqueda
document.getElementById("inputBusqueda").addEventListener("input", e => {
    const texto = e.target.value.toLowerCase();
    const filtradas = reseñas.filter(r =>
        r.habitacion.toLowerCase().includes(texto) ||
        r.comentario.toLowerCase().includes(texto) ||
        r.usuario.toLowerCase().includes(texto)
    );
    mostrarReseñas(filtradas);
});

// Inicializar
mostrarReseñas(reseñas);
