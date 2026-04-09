const express = require("express");
const router  = express.Router();
const pool    = require("../db");

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM menu');

        // PostgreSQL returns native booleans, but ensure consistency
        const items = result.rows.map((row) => ({
            ...row,
            veg:       !!row.veg,
            available: !!row.available,
        }));

        res.json({ success: true, data: items });

    } catch (error) {
    console.error("GET /api/menu error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch menu" });
    }
})

module.exports = router;