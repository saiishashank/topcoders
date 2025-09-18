require('dotenv').config();
const { Pool } = require('pg');


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

const query = async (sql, params) => {
  const { rows } = await pool.query(sql, params);
  return rows;
};

module.exports = { query };