const fs = require('fs').promises;

module.exports = (pool) => {
  return fs
    .readFile(`${__dirname}/database.sql`, { encoding: 'utf-8' })
    .then((sql) => pool.query(sql))
    .then(() => console.log('✅ Database setup complete!'))
    .catch((error) => {
      const dbNotFound = error.message.match(/database "(.+)" does not exist/i);

      if (dbNotFound) {
        const [err, db] = dbNotFound;
        console.error('❌ Error: ' + err);
        console.info(
          `Try running \`createdb -U postgres ${db}\` in your terminal`
        );
      } else {
        console.error(error);
        console.error('❌ Error: ' + error.message);
      }
    });
};