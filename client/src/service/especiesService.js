import axios from "axios";

const API_URL = "http://localhost:3000/especies";

export const obtenerEspecies = async () => {
    const response = await axios.get(API_URL, {
        whitCredentials:true,
    });

    return response.data.especies ?? [];
};

export const obtenerRazas = async (idEspecie) => {
    const response = await axios.get(
        $,{API_URL}/$,{idEspecie}/obtenerRazas,
        {whitCredentials:true }
    );

    return response.data.razas ?? [];
};