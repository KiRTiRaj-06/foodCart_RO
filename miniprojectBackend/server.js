const express = require('express')
const cors = require('cors')
const session= require('express-session')
require('dotenv').config()

const PORT = process.env.PORT || 5000;
const app = express()

app.use(cors({
    origin:      process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,   // required so cookies/session are sent cross-origin
    }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/auth",  require("./routes/auth"));
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