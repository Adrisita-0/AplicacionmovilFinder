const API_URL = "http://localhost:8080/api";

export async function consultarEventos(){
    const res = await fetch(`${API_URL}/consultarEventos`);
    return res.json();
}

export async function consultarHotel(){
    const res = await fetch(`${API_URL}/consultarHotel`);
    return res.json();
}

export async function registrarEventos(data){
    await fetch(`${API_URL}/registrarEventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function actualizarEventos(id, data){
    await fetch(`${API_URL}/actualizarEventos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function eliminarEventos(id){
    await fetch(`${API_URL}/eliminarEventos/${id}`, {
        method: 'DELETE'
    });
}