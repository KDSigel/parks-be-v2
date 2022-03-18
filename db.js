const Pool = require("pg").Pool;

const pool = new Pool({
    user: 'k',
    password: 'm34tm3',
    host: 'localhost',
    port: 5432,
    database: 'parks'
});

module.exports = pool;