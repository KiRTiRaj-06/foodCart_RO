-- ============================================================
--  foodcarting database — PostgreSQL schema
-- ============================================================

-- Run this in psql after creating the DB:
\c foodcartingro

-- ============================================================
--  updated_at auto-refresh trigger function
--  PostgreSQL has no ON UPDATE CURRENT_TIMESTAMP like MySQL,
--  so we use a trigger function instead — defined once,
--  reused on any table that needs it.
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ------------------------------------------------------------
-- 1. menu
--    TINYINT(1)        → BOOLEAN
--    AUTO_INCREMENT    → SERIAL (or GENERATED ALWAYS AS IDENTITY)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu (
  id         SERIAL          PRIMARY KEY,
  name       VARCHAR(40)     NOT NULL UNIQUE,
  category   VARCHAR(20),
  price      INT             NOT NULL,
  discount   INT             DEFAULT 0,
  descrip    VARCHAR(40),
  image      VARCHAR(120),
  badge      VARCHAR(30),
  veg        BOOLEAN         DEFAULT TRUE,
  available  BOOLEAN         DEFAULT TRUE,
  created_at TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 2. users
--    UNSIGNED INT      → INTEGER (Postgres has no UNSIGNED)
--    ON UPDATE         → handled by the trigger below
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL          PRIMARY KEY,
  username   VARCHAR(50)     NOT NULL,
  password   VARCHAR(255)    NOT NULL,           -- bcrypt hash only, never plain text
  email      VARCHAR(255)    NOT NULL UNIQUE,
  is_admin   BOOLEAN         DEFAULT FALSE,
  created_at TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Trigger: auto-update updated_at on every UPDATE
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- ------------------------------------------------------------
-- 3. order_history
--    JSON              → JSONB  (binary JSON — faster queries & indexing)
--    DECIMAL           → NUMERIC (same precision, Postgres preferred name)
--    UNSIGNED INT FK   → INTEGER (Postgres has no UNSIGNED)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_history (
  id           SERIAL          PRIMARY KEY,
  user_id      INTEGER,                           -- Nullable to retain order history after user deletion
  items        JSONB           NOT NULL,          -- array of { id, name, price, quantity, discount }
  subtotal     NUMERIC(10,2)   NOT NULL,
  tax          NUMERIC(10,2)   NOT NULL,
  total        NUMERIC(10,2)   NOT NULL,
  table_number INTEGER,
  status       VARCHAR(20)     NOT NULL DEFAULT 'placed',  -- placed | preparing | ready | delivered
  placed_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_order_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE SET NULL
);

-- Index so fetching a user's order history is fast
CREATE INDEX IF NOT EXISTS idx_order_user ON order_history (user_id);

-- ------------------------------------------------------------
-- 4. session (Persistent storage for connect-pg-simple)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "session" (
  "sid"    VARCHAR NOT NULL COLLATE "default",
  "sess"   JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

CREATE INDEX IF NOT EXISTS "idx_session_expire" ON "session" ("expire");

-- ------------------------------------------------------------
-- 5. Performance Optimization Indexes
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu (category);
