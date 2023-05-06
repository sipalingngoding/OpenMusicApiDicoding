const { pool } = require('./index');

pool.query('CREATE DATABASE openmusicapi', (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Database openmusicapi created');
  pool.end();
});

module.exports = pool;
