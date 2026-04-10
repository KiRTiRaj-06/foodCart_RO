const express = require("express");
const router  = express.Router();
const pool    = require("../db");
const Joi     = require("joi");
const { validate } = require("../middleware/validate");

const menuSchema = Joi.object({
    name: Joi.string().max(20).required(),
    category: Joi.string().max(10).optional().allow(""),
    price: Joi.number().integer().required(),
    discount: Joi.number().integer().min(0).max(100).default(0),
    descrip: Joi.string().max(40).optional().allow(""),
    image: Joi.string().max(100).optional().allow(""),
    badge: Joi.string().max(10).optional().allow(""),
    veg: Joi.boolean().default(true),
    available: Joi.boolean().default(true)
});

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
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu",
    });
  }
});

// ── POST /api/menu ───────────────────────────────────────────
// Creates a new menu item
router.post('/', validate(menuSchema), async (req, res) => {
    const { name, category, price, discount, descrip, image, badge, veg, available } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO menu 
            (name, category, price, discount, descrip, image, badge, veg, available) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`,
            [name, category, price, discount || 0, descrip, image, badge, veg, available]
        );

        res.status(201).json({ success: true, message: "Menu item added", data: result.rows[0] });
    } catch (error) {
        console.error("POST /api/menu error:", error);
        // Catch duplicate name errors
        if (error.code === '23505') {
            return res.status(409).json({ success: false, message: "A menu item with this name already exists" });
        }
        res.status(500).json({ success: false, message: "Failed to add menu item" });
    }
});

module.exports = router;
