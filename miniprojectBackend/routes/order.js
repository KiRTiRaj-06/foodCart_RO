// backend/routes/order.js
const express  = require("express");
const router   = express.Router();
const pool     = require("../db");
const { verifyToken, initCart } = require("../middleware/auth");

// All order routes require a logged-in user
router.use(verifyToken);

// ── POST /api/order/place ─────────────────────────────────────
// Takes cart from session, saves to order_history, clears session cart.
// Body: { tableNumber }   (cart is read from session, not body)
router.post("/place", initCart, async (req, res) => {
    const { tableNumber } = req.body;
    const cart = req.session.cart;

    if (!cart || cart.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
    }

  // Calculate totals server-side — never trust client totals
    const subtotal = cart.reduce((sum, item) => {
    const effectivePrice = item.discount > 0
      ? Math.round(item.price - (item.price * item.discount) / 100)
        : item.price;
    return sum + effectivePrice * item.quantity;
}, 0);

    const tax   = parseFloat((subtotal * 0.05).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

try {
    const [result] = await pool.execute(
        `INSERT INTO order_history
        (user_id, items, subtotal, tax, total, table_number, status)
        VALUES (?, ?, ?, ?, ?, ?, 'placed')`,
    [
        req.user.id,
        JSON.stringify(cart),
        subtotal,
        tax,
        total,
        tableNumber || null,
    ]
    );

    // Clear session cart after successful order
    req.session.cart = [];

    res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: {
            id: result.insertId,
            user_id: req.user.id,
            items:  cart,
        subtotal,
        tax,
        total,
        table_number: tableNumber || null,
        status:       "placed",
    },
    });
} catch (err) {
    console.error("POST /api/order/place error:", err);
    res.status(500).json({ success: false, message: "Failed to place order" });
}
});

// ── GET /api/order/history ────────────────────────────────────
// Returns all past orders for the logged-in user, newest first
router.get("/history", async (req, res) => {
    try {
    const [rows] = await pool.execute(
        `SELECT id, items, subtotal, tax, total, table_number, status, placed_at
        FROM order_history
        WHERE user_id = ?
        ORDER BY placed_at DESC`,
        [req.user.id]
    );

    // Parse the JSON items column back to an array
    const orders = rows.map((row) => ({
        ...row,
        items: typeof row.items === "string" ? JSON.parse(row.items) : row.items,
    }));

    res.json({ success: true, data: orders });
    } catch (err) {
    console.error("GET /api/order/history error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch order history" });
    }
});

// ── GET /api/order/:id ────────────────────────────────────────
// Single order detail — only if it belongs to the logged-in user
router.get("/:id", async (req, res) => {
    try {
    const [rows] = await pool.execute(
        `SELECT id, items, subtotal, tax, total, table_number, status, placed_at
        FROM order_history
        WHERE id = ? AND user_id = ?`,
        [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = {
        ...rows[0],
        items: typeof rows[0].items === "string" ? JSON.parse(rows[0].items) : rows[0].items,
    };

    res.json({ success: true, data: order });
} catch (err) {
    console.error("GET /api/order/:id error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
    }
});

module.exports = router;