//Aquí va la URL de la API, no los endpoints específicos
const API_URL = "http://localhost:8080/api";

export async function consultarReservas(page = 0, size = 10){
    const res = await fetch(`${API_URL}/consultarReservas?page=${page}&size=${size}`, {
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

export async function consultarEstadosReserva(){
    const res = await fetch(`${API_URL}/consultarEstadosReserva`, {
        credentials: "include", // necesario para que el backend identifique la sesión
    });
    return res.json();
}

export async function consultarMetodosPago(){
    const res = await fetch(`${API_URL}/consultarMetodosPago`, {
        credentials: "include", // necesario para que el backend identifique la sesión
    });
    return res.json();
}

export async function registrarReservas(data){
    await fetch(`${API_URL}/registrarReservas`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: "include", // necesario para que el backend identifique la sesión
        body: JSON.stringify(data),
    });
}

export async function actualizarReservas(id, data){
    await fetch(`${API_URL}/actualizarReservas/${id}`,{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        credentials: "include", // necesario para que el backend identifique la sesión
        body: JSON.stringify(data)
    });
}

export async function eliminarReservas(id){
    await fetch(`${API_URL}/eliminarReservas/${id}`,{
        method: 'DELETE',
        credentials: "include", // necesario para que el backend identifique la sesión
    });
}