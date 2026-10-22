import db from "../config/db.js";

const añadirMotivo = async (motivo) => {
    const { rows } = await db.query(
        'INSERT INTO motivos (motivo) VALUES ($1) RETURNING *',
        [motivo]
    );
    return rows[0];
};

const añadirDiagnosticoSegunMotivo = async (id_motivo, diagnostico) => {
    const { rows } = await db.query(
        'INSERT INTO diagnosticos (diagnostico, id_motivo) VALUES ($1, $2) RETURNING *',
        [diagnostico, id_motivo]
    );
    return rows[0];
};

export default {
    añadirMotivo,
    añadirDiagnosticoSegunMotivo
};