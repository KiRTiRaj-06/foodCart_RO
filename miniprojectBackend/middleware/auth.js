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
    req.user = decoded; // { id, username, email, iat, exp }
    next();
} catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
}
};

// ── 2. initCart ───────────────────────────────────────────────
// Ensures req.session.cart always exists.
// Cart lives in the session for up to 24 hours (set in server.js).
const initCart = (req, res, next) => {
    if (!req.session.cart) {
    req.session.cart = [];   // array of { id, name, price, quantity, discount }
    }
    next();
};

module.exports = { verifyToken, initCart };