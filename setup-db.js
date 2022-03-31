const pool = require('./db.js');
const setup = require('./setup.js');

setup(pool)
  .catch((err) => console.error(err))
  .finally(() => process.exit());