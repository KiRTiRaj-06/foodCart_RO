const express = require('express')
const cors = require('cors')
const session = require('express-session')
const PgSession = require('connect-pg-simple')(session)
const pool = require('./db') // Import pool for session storage
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const PORT = process.env.PORT || 5000;
const app = express()
app.set("trust proxy", 1); 

// ── Performance Middlewares ───────────────────────────────────
app.use(compression()); // Gzip all responses
app.use(morgan('dev')); // Structured request logging

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
    }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── CSRF Origin Verification ──────────────────────────────────
app.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const origin = req.headers.origin;
        const expectedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
        if (origin && origin !== expectedOrigin) {
            return res.status(403).json({ success: false, message: "Cross-Site Request Blocked" });
        }
    }
    next();
});

// ── Security Middlewares ──────────────────────────────────────
app.use(helmet());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 150, 
    message: { success: false, message: "Too many requests from this IP, please try again after 10 minutes" }
});
app.use("/api", limiter);

// ── Persistent Session (Cart stays even if server restarts) ────
app.use(
    session({
        store: new PgSession({
            pool: pool,
            tableName: 'session' // Uses the table you will create manually
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: parseInt(process.env.SESSION_MAX_AGE_MS) || 86400000,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
        },
    })
);

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth")); // Removed authLimiter here
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