import api from '../../config/api.js'

const API_URL = "especies";

export const obtenerEspecies = async () => {
    const response = await api.get(`${API_URL}`, {
        withCredentials:true,
    });

    return response.data.especies ?? [];
};

export const obtenerRazas = async (idEspecie) => {
    const response = await api.get(
        `${API_URL}/${idEspecie}/razas`,
        {withCredentials:true, }
    );

    return response.data.razas ?? [];
};