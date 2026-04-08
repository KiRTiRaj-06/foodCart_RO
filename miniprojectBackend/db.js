require('dotenv').config();
const mysql = require('mysql2')

const  db =  mysql.createConnection({
    // connectionString: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    // port: process.env.PORT,
})

db.connect((err)=>{
    if(err)
        console.log(err)
    else
        console.log("mysql connected")

})
module.exports = db;
