require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

const initDB = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS habits (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            completed BOOLEAN DEFAULT FALSE
        );
    `;
    try {
        await pool.query(query);
        console.log('Database initialized: habits table is ready');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initDB();
module.exports = pool;