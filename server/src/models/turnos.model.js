import db from '../config/db.js';

const guardarTurno = async (turno) => {
    const {nombre_contacto, telefono_contacto, profesional_id, fecha_hora,motivo, observaciones} = turno;
    const {rows} = await db.query(
        'INSERT INTO turnos (nombre_contacto, telefono_contacto, profesional_id, fecha_hora, motivo, observaciones) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nombre_contacto, telefono_contacto, profesional_id, fecha_hora, motivo, observaciones || null]
    );
    return rows[0];
}

const editarTurno = async (id, turno) => {
    const {profesional_id, fecha_hora,motivo, estado, observaciones} = turno;
    const {rows} = await db.query(
        'UPDATE turnos SET (profesional_id, fecha_hora, motivo, estado, observaciones) = ($1, $2, $3, $4, $5) WHERE id = $6 RETURNING *',
        [profesional_id, fecha_hora, motivo, estado, observaciones || null, id]
    );
    return rows[0];
}

const eliminarTurno = async (id) => {
    const {rows} = await db.query('UPDATE turnos SET estado = $1 WHERE id = $2 RETURNING *', ['cancelado', id]);
    return rows[0];
};

const completarTurno = async (id) => {
    const {rows} = await db.query('UPDATE turnos SET estado = $1 WHERE id = $2 RETURNING *', ['completado',id])
    return rows[0]
}

const datosTurno = async (id) => {
    const {rows} = await db.query('SELECT * FROM turnos WHERE id = $1', [id]);
    return rows[0];
}

export default {
    guardarTurno,
    editarTurno,
    eliminarTurno,
    completarTurno,
    datosTurno
};