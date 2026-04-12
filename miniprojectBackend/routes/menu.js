const express = require("express");
const router  = express.Router();
const pool    = require("../db");
const Joi     = require("joi");
const { validate } = require("../middleware/validate");
const upload  = require("../middleware/upload");

const menuSchema = Joi.object({
    name: Joi.string().max(40).required(),
    category: Joi.string().max(20).optional().allow(""),
    price: Joi.number().integer().required(),
    discount: Joi.number().integer().min(0).max(100).default(0),
    descrip: Joi.string().max(40).optional().allow(""),
    image: Joi.string().max(100).optional().allow(""),
    badge: Joi.string().max(30).optional().allow(""),
    veg: Joi.boolean(),
    available: Joi.boolean().default(true)
});

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM menu ORDER by id');

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
router.post('/', upload.single('image'), validate(menuSchema), async (req, res) => {
    const { name, category, price, discount, descrip, badge, veg, available } = req.body;
    let finalImage = req.body.image || "";
    if (req.file) {
        finalImage = "/public/uploads/" + req.file.filename;
    }

    try {
        const result = await pool.query(
            `INSERT INTO menu 
            (name, category, price, discount, descrip, image, badge, veg, available) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`,
            [name, category, price, discount || 0, descrip, finalImage, badge, veg, available]
        );

        res.status(201).json({ success: true, message: "Menu item added", data: result.rows[0] });
    } catch (error) {
        console.error("POST /api/menu error:", error);
        if (error.code === '23505') {
            return res.status(409).json({ success: false, message: "A menu item with this name already exists" });
        }
        res.status(500).json({ success: false, message: "Failed to add menu item" });
    }
});

// ── PUT /api/menu/:id ────────────────────────────────────────
// Edit a menu item
router.put('/:id', upload.single('image'), validate(menuSchema), async (req, res) => {
    const { id } = req.params;
    const { name, category, price, discount, descrip, badge, veg, available } = req.body;
    
    try {
        // Fetch existing item to preserve image if no new one provided
        const existingResult = await pool.query("SELECT image FROM menu WHERE id = $1", [id]);
        if (existingResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }

        let finalImage = existingResult.rows[0].image;
        if (req.file) {
            finalImage = "/uploads/" + req.file.filename;
        } else if (req.body.image !== undefined) {
             // allow fallback if admin decides to paste a new URL directly in an edit modal
            finalImage = req.body.image;
        }

        const result = await pool.query(
            `UPDATE menu 
             SET name = $1, category = $2, price = $3, discount = $4, descrip = $5, image = $6, badge = $7, veg = $8, available = $9, updated_at = NOW()
             WHERE id = $10 RETURNING *`,
            [name, category, price, discount || 0, descrip, finalImage, badge, veg, available, id]
        );

        res.json({ success: true, message: "Menu item updated", data: result.rows[0] });
    } catch (error) {
        console.error("PUT /api/menu error:", error);
        if (error.code === '23505') {
            return res.status(409).json({ success: false, message: "A menu item with this name already exists" });
        }
        res.status(500).json({ success: false, message: "Failed to update menu item" });
    }
});

// ── DELETE /api/menu/:id ─────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM menu WHERE id = $1 RETURNING id", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }
        res.json({ success: true, message: "Menu item deleted successfully" });
    } catch (error) {
        console.error("DELETE /api/menu error:", error);
        res.status(500).json({ success: false, message: "Failed to delete menu item" });
    }
});

module.exports = router;
