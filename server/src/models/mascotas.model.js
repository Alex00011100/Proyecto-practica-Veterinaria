import db from '../config/db.js';

const añadirMascotaADB = async (mascota) => {
    const {id_cliente,nombre,id_especie,id_raza,fecha_nacimiento,peso,genero,alergias,observaciones,numero_chip,activo} = mascota;
    const {rows} = await db.query('INSERT INTO mascotas (id_cliente,nombre,id_especie,id_raza,fecha_nacimiento,peso,genero,alergias,observaciones,numero_chip,activo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *', [id_cliente,nombre,id_especie,id_raza,fecha_nacimiento,peso,genero,alergias,observaciones,numero_chip,activo]);
    return rows[0];
}

const obtenerListaMascotas = async () => {
    const {rows} = await db.query('SELECT * FROM mascotas WHERE activo = TRUE');
    return rows;
}


const editarMascotaADB = async (id, mascota) => {
    const {id_cliente,nombre,id_especie,id_raza,fecha_nacimiento,peso,genero,alergias,observaciones,numero_chip,activo} = mascota;
    const {rows} = await db.query('UPDATE mascotas SET id_cliente = $1, nombre = $2, id_especie = $3, id_raza = $4, fecha_nacimiento = $5, peso = $6, genero = $7, alergias = $8, observaciones = $9, numero_chip = $10, activo = $11 WHERE id = $12 RETURNING *', [id_cliente,nombre,id_especie,id_raza,fecha_nacimiento,peso,genero,alergias,observaciones,numero_chip,activo,id]);
    return rows[0];
}

const eliminarMascotaADB = async (id) => {
    const {rows} = await db.query('UPDATE mascotas SET activo = false WHERE id = $1 RETURNING *', [id]);
    return rows[0];
}

const obtenerDetalleConsulta = async (id_consulta) => {
    const {rows} = await db.query('SELECT * FROM detalle_consulta WHERE id_consulta = $1', [id_consulta]);
    return rows;
}

const obtenerConsultaPorID = async (id) => {
    const {rows} = await db.query('SELECT * FROM consultas WHERE id = $1', [id]);
    return rows[0];
}

const obtenerMotivos = async () => {
    const {rows} = await db.query('SELECT * FROM motivos');
    console.log(rows); 
    return rows;
}

const obtenerDiagnosticos = async () => {
    const {rows} = await db.query('SELECT * FROM diagnosticos');
    return rows;
}

const datosMascota = async (id) => {
    const {rows} = await db.query('SELECT * FROM mascotas WHERE id = $1', [id]);
    return rows[0];
}

const obtenerAntecedentes = async (id_mascota) => {
    const {rows} = await db.query('SELECT * FROM antecedentes WHERE id_mascota = $1', [id_mascota]);
    return rows;
}

const añadirConsulta = async (consulta) => {
    const {id_mascota,id_veterinario,motivo_id,fecha_consulta,peso_actual,temperatura,tratamiento,observaciones} = consulta;
    const {rows} = await db.query('INSERT INTO consultas (id_mascota,id_veterinario,fecha_consulta,peso_actual,temperatura,motivo_id,tratamiento,observaciones) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', [id_mascota,id_veterinario,fecha_consulta,peso_actual,temperatura,motivo_id,tratamiento,observaciones]);
    return rows[0];
}

const añadirDetalleConsulta = async (detalle) => {
    const {id_consulta,id_lote,proxima_dosis,observaciones} = detalle;
    const {rows} = await db.query('INSERT INTO detalle_consulta (id_consulta,id_lote,proxima_dosis,observaciones) VALUES ($1,$2,$3,$4) RETURNING *', [id_consulta,id_lote,proxima_dosis,observaciones]);
    return rows[0];
}

export default {
    añadirMascotaADB,
    obtenerListaMascotas,
    editarMascotaADB,
    eliminarMascotaADB,
    obtenerDetalleConsulta,
    obtenerConsultaPorID,
    obtenerMotivos,
    obtenerDiagnosticos,
    datosMascota,
    obtenerAntecedentes,
    añadirConsulta,
    añadirDetalleConsulta
};
