import turnosModel from '../models/turnos.model.js';

const asignarTurno = async (req, res) => {
    try {
        const turno = await turnosModel.guardarTurno(req.body);
        res.status(201).json({message: "Turno asignado"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const modificarTurno = async (req, res) => {
    try {
        const turno = await turnosModel.editarTurno(req.params.id, req.body);
        res.status(200).json({message: "Turno modificado"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cancelarTurno = async (req, res) => {
    try {
        const turno = await turnosModel.eliminarTurno(req.params.id);
        res.status(200).json({message: "Turno cancelado"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const turnoCompletado = async (req, res) => {
    try {
        const turno = await turnosModel.completarTurno(req.params.id)
        res.status(200).json({message: "Turno completado"})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default {
    asignarTurno,
    modificarTurno,
    cancelarTurno,
    turnoCompletado
};