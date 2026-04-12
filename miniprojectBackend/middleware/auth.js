// backend/middleware/auth.js
const jwt = require("jsonwebtoken");


// ── 1. verifyToken ────────────────────────────────────────────
// Protects routes that require a logged-in user.
// Reads the Bearer token from Authorization header.
// Attaches decoded payload to req.user on success.
const verifyToken = (req, res, next) => {
let token = req.cookies?.token;
if (!token) {
    const authHeader = req.headers["authorization"];
    token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"
}

if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
}

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, email, is_admin, iat, exp }
    next();
} catch (err) {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
}
};

// ── 2. verifyAdmin ────────────────────────────────────────────
// Ensure the user is an admin. Must be used AFTER verifyToken.
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.is_admin === true) {
        next();
    } else {
        res.status(403).json({ success: false, message: "Access denied. Admin role required." });
    }
};

// ── 3. initCart ───────────────────────────────────────────────
// Ensures req.session.cart always exists.
// Cart lives in the session for up to 24 hours (set in server.js).
const initCart = (req, res, next) => {
    if (!req.session.cart) {
    req.session.cart = [];   // array of { id, name, price, quantity, discount }
    }
    next();
};

module.exports = { verifyToken, verifyAdmin, initCart };