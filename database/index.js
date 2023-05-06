const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: 'postgres',
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

module.exports = { pool };
