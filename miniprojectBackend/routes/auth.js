// backend/routes/auth.js
const express = require("express");
const router  = express.Router();
const bcrypt  = require("bcrypt");
const jwt     = require("jsonwebtoken");
const pool    = require("../db");
const { verifyToken } = require("../middleware/auth");

const SALT_ROUNDS = 11;

router.post('/register',    async (req , res) =>{
    const {username , email ,password } = req.body;

    if(!username || !email || !password){
        res.status(400).json({ success: false, message: "All fields are required" })
    }

    try {
    // Check if email already exists
    const [existing] = await pool.execute(
        "SELECT id FROM users WHERE email = ?", [email]
    );
    if (existing.length > 0) {
        return res.status(409).json({ success: false, message: "Email already registered" });
    }


    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.execute(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
    );

    const token = jwt.sign(
        { id: result.insertId, username, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(201).json({
        success: true,
        message: "Registered successfully",
        token,
        user: { id: result.insertId, username, email },
    });

    } catch (error) {
    console.error("POST /api/auth/register error:", err);
    res.status(500).json({ success: false, message: "Registration failed" });
    }
})

// ── POST /api/auth/login ──────────────────────────────────────
router.post("/login", async (req, res) => {
const { email, password } = req.body;

if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
}

try {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?", [email]
    );

    if (rows.length === 0) {
        return res.status(401).json({ success: false, message: "Invalid credentials or email doesn't exist " });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
        success: true,
        message: "Login successful",
        token,
        user: { id: user.id, username: user.username, email: user.email },
    });
} catch (err) {
    console.error("POST /api/auth/login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
}
});

// ── GET /api/auth/me  — verify token + return user info ───────
router.get("/me", verifyToken, async (req, res) => {
try {
    const [rows] = await pool.execute(
        "SELECT id, username, email, created_at FROM users WHERE id = ?",
        [req.user.id]
    );
    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user: rows[0] });
} catch (err) {
    console.error("GET /api/auth/me error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
    }
});

module.exports = router;