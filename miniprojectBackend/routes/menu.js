const express = require("express");
const router  = express.Router();
const pool    = require("../db");
const Joi     = require("joi");
const { validate } = require("../middleware/validate");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const menuSchema = Joi.object({
    name: Joi.string().max(40).required(),
    category: Joi.string().max(20).optional().allow(""),
    price: Joi.number().integer().required(),
    discount: Joi.number().integer().min(0).max(100).default(0),
    descrip: Joi.string().max(100).optional().allow(""),
    image: Joi.string().max(255).optional().allow(""),
    badge: Joi.string().max(30).optional().allow(""),
    veg: Joi.boolean().default(true),
    available: Joi.boolean().default(true)
});

// Cache variable for ultra-fast reads. 
// A food menu rarely changes, so skipping a DB query saves ~2-3 seconds per user session!
let menuCache = null;

router.get('/', async (req, res) => {
    try {
        if (menuCache) {
            // Serve directly from fast RAM
            return res.json({ success: true, data: menuCache, cached: true });
        }

        const result = await pool.query('SELECT * FROM menu ORDER BY id ASC');

        // PostgreSQL returns native booleans, but ensure consistency
        const items = result.rows.map((row) => ({
            ...row,
            veg:       !!row.veg,
            available: !!row.available,
        }));

        menuCache = items; // Populate the cache for the next users!

        res.json({ success: true, data: items, cached: false });

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
router.post('/', verifyToken, verifyAdmin, validate(menuSchema), async (req, res) => {
    const { name, category, price, discount, descrip, image, badge, veg, available } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO menu 
            (name, category, price, discount, descrip, image, badge, veg, available) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`,
            [name, category, price, discount || 0, descrip, image, badge, veg, available]
        );

        menuCache = null; // Invalidate cache so the next load pulls fresh data
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

// ── PUT /api/menu/:id ────────────────────────────────────────
router.put('/:id', verifyToken, verifyAdmin, validate(menuSchema), async (req, res) => {
    const { id } = req.params;
    const { name, category, price, discount, descrip, image, badge, veg, available } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE menu 
             SET name = $1, category = $2, price = $3, discount = $4, descrip = $5, image = $6, badge = $7, veg = $8, available = $9, updated_at = NOW()
             WHERE id = $10 RETURNING *`,
            [name, category, price, discount || 0, descrip, image, badge, veg, available, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }

        menuCache = null; // Invalidate cache
        res.json({ success: true, message: "Menu item updated", data: result.rows[0] });
    } catch (error) {
        console.error("PUT /api/menu error:", error);
        if (error.code === '23505') {
            return res.status(409).json({ success: false, message: "A menu item with this name already exists" });
        }
        res.status(500).json({ success: false, message: "Failed to update menu item" });
    }
});

// ── DELETE /api/menu/:id ────────────────────────────────────────
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM menu WHERE id = $1 RETURNING id", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }
        
        menuCache = null; // Invalidate cache
        res.json({ success: true, message: "Menu item deleted successfully" });
    } catch (error) {
        console.error("DELETE /api/menu error:", error);
        res.status(500).json({ success: false, message: "Failed to delete menu item" });
    }
});

module.exports = router;
