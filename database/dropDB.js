const { pool } = require('./index');

pool.query('DROP DATABASE openmusicapi', (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Database openmusicapi droped');
  pool.end();
});
