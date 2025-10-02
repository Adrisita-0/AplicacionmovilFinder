//Aquí va la URL de la API, no los endpoints específicos
const API_URL = "http://localhost:8080/api";

export async function consultarHabitaciones(){
    const res = await fetch(`${API_URL}/consultarHabitaciones`, {
        credentials: "include", // necesario para que el backend identifique la sesión
    });
    const data = await res.json();
    return data.content
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

export async function registrarHabitaciones(data){
    await fetch(`${API_URL}/registrarHabitaciones`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include", // necesario para que el backend identifique la sesión
        body: JSON.stringify(data)
    });
}

export async function actualizarHabitaciones(id, data){
    await fetch(`${API_URL}/actualizarHabitaciones/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        credentials: "include", // necesario para que el backend identifique la sesión
        body: JSON.stringify(data)
    });
}

export async function eliminarHabitaciones(id){
    await fetch(`${API_URL}/eliminarHabitaciones/${id}`, {
        method: "DELETE",
        credentials: "include", // necesario para que el backend identifique la sesión
    });
}