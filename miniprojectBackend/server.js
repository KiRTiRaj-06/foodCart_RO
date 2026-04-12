const express = require('express')
const cors = require('cors')
const session= require('express-session')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const PORT = process.env.PORT || 5000;
const app = express()

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,   // required so cookies/session are sent cross-origin
    }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── CSRF Origin Verification ──────────────────────────────────
app.use((req, res, next) => {
    // Only verify state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const origin = req.headers.origin;
        const expectedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
        // If an origin is provided and doesn't match our frontend, heavily suspect CSRF
        if (origin && origin !== expectedOrigin) {
            return res.status(403).json({ success: false, message: "Cross-Site Request Blocked" });
        }
    }
    next();
});

// ── Security Middlewares ──────────────────────────────────────
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // limit each IP to 150 requests per windowMs
    message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes" }
});
app.use("/api", limiter);

// Stricter rate limit for authentication
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: { success: false, message: "Too many authentication attempts, please try again later" }
});

// ── Session (cart lives here for 24 hours) ────────────────────
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge:   parseInt(process.env.SESSION_MAX_AGE_MS) || 86400000, // 24 h
            httpOnly: true,
            sameSite: "lax",
          secure:   process.env.NODE_ENV === "production",  // true in prod (HTTPS)
        },
    })
);

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, require("./routes/auth"));
app.use("/api/menu",  require("./routes/menu"));
app.use("/api/cart",  require("./routes/cart"));
app.use("/api/order", require("./routes/order"));
app.use("/api/admin", require("./routes/admin"));

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Server is running" });
});

// ── 404 fallback ──────────────────────────────────────────────
app.use((req, res) => {
res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});