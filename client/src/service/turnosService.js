import axios from "axios";

const API_URL = "http://localhost:3000/turnos";

export const asignarTurno = async (turno) => {
    const response = await axios.post(
        `${API_URL}/asignar`,
        turno,
        {withCredentials: true}
    );
    return response.data;
};

export const modificarTurno = async (id, turno) => {
    const response = await axios.patch(
        `${API_URL}/modificar/${id}`,
        turno,
        {withCredentials: true}
    );
    return response.data;
};

export const cancelarTurno = async (id) => {
    const response = await axios.patch(
        `${API_URL}/cancelar/${id}`,
        {},
        {withCredentials:true}
    );
    return response.data;
};

export const completarTurno = async (id) => {
    const response = await axios.patch(
        `${API_URL}/completar/${id}`,
        {},
        {withCredentials:true}
    );
    return response.data
};