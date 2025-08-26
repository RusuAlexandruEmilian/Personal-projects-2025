const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, 
  database: process.env.DATABASE,
  ssl: { rejectUnauthorized: false }
})

pool.connect()
  .then(() => console.log('Connected to Supabase!'))
  .catch(err => console.error('Connection error:', err))
  


module.exports = pool;