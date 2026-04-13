// backend/routes/order.js
const express  = require("express");
const router   = express.Router();
const pool     = require("../db");
const { verifyToken, initCart } = require("../middleware/auth");
const Joi      = require("joi");
const { validate } = require("../middleware/validate");

// All order routes require a logged-in user
router.use(verifyToken);

// ── POST /api/order/place ─────────────────────────────────────
// Takes cart from session, saves to order_history, clears session cart.
// Body: { tableNumber }   (cart is read from session, not body)
const placeOrderSchema = Joi.object({
    tableNumber: Joi.number().min(1).max(999).optional().allow(null)
});

router.post("/place", validate(placeOrderSchema), initCart, async (req, res) => {
    const { tableNumber } = req.body;
    const cart = req.session.cart;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    try {
        // CRITICAL SECURITY FIX: Fetch fresh prices from DB to prevent client-side manipulation
        const itemIds = cart.map(i => i.id);
        const dbItems = await pool.query(
            "SELECT id, name, price, discount FROM menu WHERE id = ANY($1)",
            [itemIds]
        );

        // Map the real prices to our cart items
        let subtotal = 0;
        const verifiedCart = cart.map(cartItem => {
            const realMenu = dbItems.rows.find(row => row.id === cartItem.id);
            if (!realMenu) {
                throw new Error(`Item "${cartItem.name}" no longer exists in our menu`);
            }
            
            const price = realMenu.price;
            const discount = realMenu.discount;
            const effectivePrice = discount > 0
                ? Math.round(price - (price * discount) / 100)
                : price;
            
            subtotal += effectivePrice * cartItem.quantity;

            return {
                ...cartItem,
                name: realMenu.name,
                price: price,
                discount: discount
            };
        });

        const tax   = parseFloat((subtotal * 0.05).toFixed(2));
        const total = parseFloat((subtotal + tax).toFixed(2));

        const result = await pool.query(
            `INSERT INTO order_history
            (user_id, items, subtotal, tax, total, table_number, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'placed')
            RETURNING id`,
            [
                req.user.id,
                JSON.stringify(verifiedCart),
                subtotal,
                tax,
                total,
                tableNumber || null,
            ]
        );

        const newId = result.rows[0].id;

        // Clear session cart after successful order
        req.session.cart = [];

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: {
                id: newId,
                user_id: req.user.id,
                items:  verifiedCart,
                subtotal,
                tax,
                total,
                table_number: tableNumber || null,
                status:       "placed",
            },
        });
    } catch (err) {
        console.error("POST /api/order/place error:", err);
        const code = err.message.includes("no longer exists") ? 404 : 500;
        res.status(code).json({ success: false, message: err.message || "Failed to place order" });
    }
});

// ── GET /api/order/history ────────────────────────────────────
// Returns all past orders for the logged-in user, newest first
router.get("/history", async (req, res) => {
    try {
    const result = await pool.query(
        `SELECT id, items, subtotal, tax, total, table_number, status, placed_at
        FROM order_history
        WHERE user_id = $1
        ORDER BY placed_at DESC`,
        [req.user.id]
    );

    // Parse the JSON items column back to an array
    const orders = result.rows.map((row) => ({
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
    const result = await pool.query(
        `SELECT id, items, subtotal, tax, total, table_number, status, placed_at
        FROM order_history
        WHERE id = $1 AND user_id = $2`,
        [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = {
        ...result.rows[0],
        items: typeof result.rows[0].items === "string" ? JSON.parse(result.rows[0].items) : result.rows[0].items,
    };

    res.json({ success: true, data: order });
} catch (err) {
    console.error("GET /api/order/:id error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
    }
});

module.exports = router;