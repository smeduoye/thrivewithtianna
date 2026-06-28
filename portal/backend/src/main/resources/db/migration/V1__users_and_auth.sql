-- MVP foundation: users, roles, and programme metadata.
-- Auth providers and billing tables arrive in M1/M3 migrations.

CREATE TABLE app_user (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(320) NOT NULL UNIQUE,
    phone_e164      VARCHAR(20),
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    role            VARCHAR(50) NOT NULL DEFAULT 'CLIENT',
    status          VARCHAR(50) NOT NULL DEFAULT 'pending',
    portal_tier     VARCHAR(20) NOT NULL DEFAULT 'full',
    programme       VARCHAR(100),
    cohort_id       UUID,
    goals           JSONB NOT NULL DEFAULT '{}',
    contact_prefs   JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_app_user_role CHECK (role IN ('CLIENT', 'COACH', 'ADMIN')),
    CONSTRAINT chk_app_user_status CHECK (
        status IN ('pending', 'trialing', 'active', 'past_due', 'suspended', 'archived')
    ),
    CONSTRAINT chk_app_user_portal_tier CHECK (portal_tier IN ('full', 'lite', 'none'))
);

CREATE INDEX idx_app_user_status ON app_user (status);
CREATE INDEX idx_app_user_email ON app_user (email);

CREATE TABLE auth_identity (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    provider        VARCHAR(50) NOT NULL,
    provider_sub    VARCHAR(255) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_sub)
);

CREATE INDEX idx_auth_identity_user ON auth_identity (user_id);
