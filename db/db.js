import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); 

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const pool = createPool(dbConfig);


(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('connected to the database.');
        connection.release(); // Libera la conexión después de la verificación
    } catch (err) {
        console.error('Error connecting database:', err);
        process.exit(1); // Termina el proceso si hay un error en la conexión
    }
})();

const query = async (sql, params = []) => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql, params);
        return results;
    } finally {
        connection.release(); // Asegúrate de liberar la conexión
    }
};

export { pool, query };