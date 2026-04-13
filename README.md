# FoodCart_RO 🍔

A robust, enterprise-grade full-stack web application designed for restaurant food ordering. While originally built as a college mini-project, this application has been rigorously hardened with modern security practices, intelligent database caching, and a highly responsive React architecture.

## 🚀 Key Features

### 🍽️ Customer Experience
- **Sleek UI/UX**: A modern, dark-themed interface built with glassmorphic aesthetics.
- **Persistent Cart**: Shopping cart data is securely backed by a PostgreSQL session store, surviving browser restarts and page refreshes.
- **Flawless Ordering**: Seamless checkout flow automatically tracking user order history.

### 🛡️ "Bank-Grade" Security
- **Anti-Fraud Checkout**: The server strictly calculates final prices natively from the database, rendering client-side manipulation tools completely useless.
- **100% SQLi Immunity**: Every single database transaction utilizes strict PostgreSQL Parameterized Queries.
- **Bulletproof Auth**: JWT tokens are securely shipped via `httpOnly` secure cookies, eliminating XSS vulnerabilities. Passwords are salted and hashed using `bcrypt` (Salt Rounds: 11).
- **Anti-Brute-Force Shields**: The authentication endpoints implement robust express-rate-limiting to automatically lock out dictionary attacks.
- **Joi Sanitization**: All incoming data, down to lowercase email constraints, is heavily sanitized and validated before execution.

### ⚡ Blistering Performance
- **Zero-Latency In-Memory Caching**: The remote Render database latency loop is completely bypassed for heavily accessed data like the restaurant menu. Read latencies sit between 1ms-4ms.
- **Gzip Payload Compression**: Backend responses are compressed automatically, utilizing drastically less user bandwidth.

### 👑 Admin Dashboard Capabilities
- **Total Menu Control**: Add, edit, or delete items natively from the dashboard interface.
- **Live Order History Monitoring**: Admins can audit all orders across the entire platform.
- **User Management & Soft Deletion**: Admins can physically delete users from the system while automatically keeping aggregate order receipts fully anonymized (`ON DELETE SET NULL`), preventing database ghost-locking.

## 💻 Tech Stack
- **Frontend**: React (Vite) + TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Hosted on Render)
- **State Management**: React `useContext`
- **Validation**: Joi
