const API_URL = "http://localhost:8080/api";

export async function consultarReseñas(){
    const res = await fetch(`${API_URL}/consultarReseñas`);
    return res.json();
}

export async function consultarClientes(){
    const res = await fetch(`${API_URL}/consultarClientes`);
    return res.json();
}

export async function consultarHotel(){
    const res = await fetch(`${API_URL}/consultarHotel`);
    return res.json();
}

export async function registrarReseñas(data){
    await fetch(`${API_URL}/registrarReseñas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function actualizarReseñas(id, data){
    await fetch(`${API_URL}/actualizarReseñas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function eliminarReseñas(id){
    await fetch(`${API_URL}/eliminarReseñas/${id}`, {
        method: 'DELETE',
    });
}
