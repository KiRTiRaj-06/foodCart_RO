// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { verifyToken } = require("../middleware/auth");
const Joi     = require("joi");
const { validate } = require("../middleware/validate");

const SALT_ROUNDS = 11;

const registerSchema = Joi.object({
    username: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(255).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

router.post('/register', validate(registerSchema), async (req, res) => {
    const { username, email, password } = req.body;

    try {
    // Check if email already exists
    const existing = await pool.query(
        "SELECT id FROM users WHERE email = $1", [email]
    );
    if (existing.rows.length > 0) {
        return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
        [username, email, hashedPassword]
    );

    const newId = result.rows[0].id;

    const token = jwt.sign(
        { id: newId, username, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
        success: true,
        message: "Registered successfully",
        user: { id: newId, username, email },
    });

  } catch (err) {
    console.error("POST /api/auth/register error:", err);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post("/login", validate(loginSchema), async (req, res) => {
const { email, password } = req.body;

try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1", [email]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({ success: false, message: "Invalid credentials or email doesn't exist " });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
        success: true,
        message: "Login successful",
        user: { id: user.id, username: user.username, email: user.email },
    });

  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});


// ── GET CURRENT USER ─────────────────────────────────────────
router.get("/me", verifyToken, async (req, res) => {
try {
    const result = await pool.query(
        "SELECT id, username, email, created_at FROM users WHERE id = $1",
        [req.user.id]
    );
    if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user: result.rows[0] });
} catch (err) {
    console.error("GET /api/auth/me error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
});

// ── POST /api/auth/logout ──────────────────────────────────────
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
