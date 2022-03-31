const { Pool } = require('pg');

const pool = new Pool({
    // connectionString: process.env.DATABASE_URL
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME
});

module.exports = pool;