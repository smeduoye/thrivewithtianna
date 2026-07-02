-- M1 email/password auth: local credential storage + onboarding completion marker.
-- OAuth-only users leave password_hash NULL and authenticate via auth_identity.

ALTER TABLE app_user
    ADD COLUMN password_hash VARCHAR(255),
    ADD COLUMN onboarded_at  TIMESTAMPTZ;
