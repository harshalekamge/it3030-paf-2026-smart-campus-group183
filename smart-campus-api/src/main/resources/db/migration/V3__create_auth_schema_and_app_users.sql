-- ================================================================
-- V3: Create auth schema and app_users table
-- Module E: Authentication & OAuth2 (Google Sign-In)
-- ================================================================

-- 1. Create schema
CREATE SCHEMA IF NOT EXISTS auth;

-- 2. Create app_users table
CREATE TABLE IF NOT EXISTS auth.app_users (
    id BIGSERIAL PRIMARY KEY,

    google_id VARCHAR(100) UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,

    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(200),

    profile_picture_url TEXT,

    role VARCHAR(30) NOT NULL DEFAULT 'STUDENT',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    provider VARCHAR(50) NOT NULL DEFAULT 'GOOGLE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMPTZ
);

-- 3. Indexes (for performance)
CREATE INDEX IF NOT EXISTS idx_app_users_email
    ON auth.app_users(email);

CREATE INDEX IF NOT EXISTS idx_app_users_google_id
    ON auth.app_users(google_id);

CREATE INDEX IF NOT EXISTS idx_app_users_role
    ON auth.app_users(role);

-- 4. Constraints (data integrity)
ALTER TABLE auth.app_users
    ADD CONSTRAINT chk_app_users_role
    CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'STAFF', 'LECTURER', 'STUDENT'));

ALTER TABLE auth.app_users
    ADD CONSTRAINT chk_app_users_provider
    CHECK (provider IN ('GOOGLE'));

-- 5. Trigger function for updated_at
CREATE OR REPLACE FUNCTION auth.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger
DROP TRIGGER IF EXISTS trg_set_updated_at_on_app_users ON auth.app_users;

CREATE TRIGGER trg_set_updated_at_on_app_users
BEFORE UPDATE ON auth.app_users
FOR EACH ROW
EXECUTE FUNCTION auth.set_updated_at();