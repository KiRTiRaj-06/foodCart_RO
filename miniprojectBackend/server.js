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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});