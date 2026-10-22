import extrasModel from "../models/extras.models.js";

const añadirMotivo = async (req, res) => {
    try {
        const { motivo } = req.body;
        const nuevoMotivo = await extrasModel.añadirMotivo(motivo);
        res.status(201).json(nuevoMotivo);
    } catch (error) {
        console.error("Error al añadir el motivo:", error);
        res.status(500).json({ message: "Error al añadir el motivo" });
    }
};

const añadirDiagnosticoSegunMotivo = async (req, res) => {
    try {
        const { id_motivo, diagnostico } = req.body;
        const nuevoDiagnostico = await extrasModel.añadirDiagnosticoSegunMotivo(id_motivo, diagnostico);
        res.status(201).json(nuevoDiagnostico);
    } catch (error) {
        console.error("Error al añadir el diagnóstico:", error);
        res.status(500).json({ message: "Error al añadir el diagnóstico" });
    }
};

export default {
    añadirMotivo,
    añadirDiagnosticoSegunMotivo
};