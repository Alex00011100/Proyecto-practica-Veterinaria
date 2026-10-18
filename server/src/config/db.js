import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 5
});

// Verificar conexión
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error de conexión:', err.message);
        return;
    }

    console.log('✅ Conexión exitosa a PostgreSQL');
    release();
});

export default {
    query: (text, params) => pool.query(text, params),
    pool
};