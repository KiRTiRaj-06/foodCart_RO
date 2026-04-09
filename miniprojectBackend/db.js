// backend/db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.connect()
  .then(() => console.log("PostgreSQL connected ✅"))
  .catch(err => console.error("DB connection error:", err));

module.exports = pool;

// // backend/db.js
// const mysql = require("mysql2/promise");
// require("dotenv").config();



// const pool = mysql.createPool({
//     host:     process.env.DB_HOST,
//     port:     process.env.DB_PORT || 3306,
//     user:     process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit:    10,
//     queueLimit:         0,
// });

// module.exports = pool;


