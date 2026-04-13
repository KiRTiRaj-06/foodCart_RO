// backend/db.js
const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: connectionString && connectionString.includes("render.com") 
    ? { rejectUnauthorized: false } 
    : false
});

pool.connect()
  .then(() => console.log("PostgreSQL connected ✅"))
  .catch(err => console.error("DB connection error:", err));

module.exports = pool;
