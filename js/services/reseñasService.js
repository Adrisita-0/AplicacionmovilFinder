const API_URL = "http://localhost:8080/api";

export async function consultarReseñas(){
    const res = await fetch(`${API_URL}/consultarReseñas`, {
        credentials: "include", // necesario para que el backend identifique la sesión
    });
    return res.json();
}

export async function consultarClientes(){
    const res = await fetch(`${API_URL}/consultarClientes`, {
        credentials: "include", // necesario para que el backend identifique la sesión
    });
    return res.json();
}

export async function consultarHotel(){
    const res = await fetch(`${API_URL}/consultarHotel`, {
        credentials: "include", // necesario para que el backend identifique la sesión
    });
    return res.json();
}

export async function registrarReseñas(data){
    await fetch(`${API_URL}/registrarReseñas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        credentials: "include", // necesario para que el backend identifique la sesión
        body: JSON.stringify(data),
    });
}

export async function actualizarReseñas(id, data){
    await fetch(`${API_URL}/actualizarReseñas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        credentials: "include", // necesario para que el backend identifique la sesión
        body: JSON.stringify(data),
    });
}

export async function eliminarReseñas(id){
    await fetch(`${API_URL}/eliminarReseñas/${id}`, {
        method: 'DELETE',
        credentials: "include", // necesario para que el backend identifique la sesión
    });
}
