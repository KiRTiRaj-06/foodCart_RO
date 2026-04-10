const express = require("express");
const router  = express.Router();
const pool    = require("../db");

// GET /api/menu
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM menu";
    const result = await pool.query(query); // ✅ PostgreSQL syntax

    const rows = result.rows;

    // Convert to proper booleans (optional but safe)
    const items = rows.map((row) => ({
      ...row,
      veg: !!row.veg,
      available: !!row.available,
    }));

    res.json({ success: true, data: items });

  } catch (error) {
    console.error("GET /api/menu error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu",
    });
  }
});

module.exports = router;

// router.get('/menu',(req , res)=>{
//     try {
//         const query = 'SELECT * from menu'
//         const [rows] = pool.execute(query)

//             // Convert tinyint booleans to JS booleans
//     const items = rows.map((row) => ({
//         ...row,
//         veg:       !!row.veg,
//         available: !!row.available,
//     }));

//     res.json({success: true , data: items})

//     } catch (error) {
//     console.error("GET /api/menu error:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch menu" });
//     }
// })

// module.exports = router;