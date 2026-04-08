const express = require('express')
const cors = require('cors')
require('dotenv').config()
const db = require("./db");


const app = express()

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/api/menu",(req,res)=>{
    const sql =" SELECT * from menu"
    db.query(sql, (err, result) => {
        if (err) {
        console.log(err);
        return res.status(500).json({ error: "Database error" });
    }

    res.json(result);
})})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});