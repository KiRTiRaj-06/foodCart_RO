// backend/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

// const  db =  mysql.createConnection({
//     // connectionString: process.env.DATABASE_URL,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     // port: process.env.PORT,
// })

// db.connect((err)=>{
//     if(err)
//         console.log(err)
//     else
//         console.log("mysql connected")

// })
// module.exports = db;


const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
});

module.exports = pool;


