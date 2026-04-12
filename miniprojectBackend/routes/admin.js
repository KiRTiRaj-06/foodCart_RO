// backend/routes/admin.js
// Admin-only routes — all users, all orders
const express  = require("express");
const router   = express.Router();
const pool     = require("../db");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Protect all admin routes
router.use(verifyToken, verifyAdmin);

// ── GET /api/admin/users ─────────────────────────────────────
// Returns all registered users (no passwords)
router.get("/users", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC"
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("GET /api/admin/users error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
});

// ── GET /api/admin/orders ────────────────────────────────────
// Returns ALL orders from all users, newest first
router.get("/orders", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT oh.id, oh.user_id, u.username, u.email,
                    oh.items, oh.subtotal, oh.tax, oh.total,
                    oh.table_number, oh.status, oh.placed_at
             FROM order_history oh
             LEFT JOIN users u ON oh.user_id = u.id
             ORDER BY oh.placed_at DESC`
        );

        const orders = result.rows.map((row) => ({
            ...row,
            items: typeof row.items === "string" ? JSON.parse(row.items) : row.items,
        }));

        res.json({ success: true, data: orders });
    } catch (err) {
        console.error("GET /api/admin/orders error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
});

module.exports = router;
