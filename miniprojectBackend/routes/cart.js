const express  = require("express");
const router   = express.Router();
const { initCart } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const Joi = require("joi");

// All cart routes need the session cart initialised
router.use(initCart);

const cartAddSchema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().required(),
    price: Joi.number().min(0).optional(),
    quantity: Joi.number().integer().min(1).default(1),
    discount: Joi.number().min(0).max(100).optional(),
    image: Joi.string().allow("").optional()
});

// ── GET /api/cart ─────────────────────────────────────────────
router.get("/", (req, res) => {
  res.json({ success: true, data: req.session.cart });
});

// ── POST /api/cart/add ────────────────────────────────────────
// Body: { id, name, price, quantity, discount, image }
router.post("/add", validate(cartAddSchema), (req, res) => {
  const { id, name, price, quantity = 1, discount = 0, image = "" } = req.body;

  if (!id || !name || price == null) {
    return res.status(400).json({ success: false, message: "id, name and price are required" });
  }

  const cart    = req.session.cart;
  const existing = cart.find((i) => i.id === id);

  if (existing) {
    existing.quantity += quantity;
    if (image && !existing.image) existing.image = image; // backfill image if missing
  } else {
    cart.push({ id, name, price, quantity, discount, image });
  }

  req.session.cart = cart;
  res.json({ success: true, data: cart });
});

// ── POST /api/cart/remove ─────────────────────────────────────
// Body: { id }  — decrements by 1, removes row when quantity hits 0
router.post("/remove", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ success: false, message: "id is required" });

  let cart = req.session.cart.map((i) =>
    i.id === id ? { ...i, quantity: i.quantity - 1 } : i
  ).filter((i) => i.quantity > 0);

  req.session.cart = cart;
  res.json({ success: true, data: cart });
});

// ── DELETE /api/cart/item/:id ─────────────────────────────────
// Removes entire row regardless of quantity
router.delete("/item/:id", (req, res) => {
  const id = parseInt(req.params.id);
  req.session.cart = req.session.cart.filter((i) => i.id !== id);
  res.json({ success: true, data: req.session.cart });
});

// ── DELETE /api/cart ──────────────────────────────────────────
// Clears the entire cart
router.delete("/", (req, res) => {
  req.session.cart = [];
  res.json({ success: true, message: "Cart cleared" });
});

module.exports = router;