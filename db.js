const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Kursovaya',
    password: '123',
    port: 5432,
});

const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'Kursovaya',
    password: '123',
    port: 5432,
};

module.exports = {
    connect: async () => {
        const client = await pool.connect();
        return client;
    },
    query: async (text, params) => {
        const client = await pool.connect();
        try {
            const res = await client.query(text, params);
            return res;
        } finally {
            client.release();
        }
    },
    end: () => {
        pool.end()
    },
    dbConfig: dbConfig
};