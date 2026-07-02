-- M4: portal messaging. One async thread per client (CHAT-1).
-- Phase 1 is human-authored (Tianna / coach) per CHAT-5. `channel` and
-- `author_role` leave room for WhatsApp/email/agent sources later (CHAT-2/6).

CREATE TABLE message (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id    UUID NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    sender_id    UUID REFERENCES app_user (id) ON DELETE SET NULL,
    author_role  VARCHAR(20) NOT NULL,
    channel      VARCHAR(20) NOT NULL DEFAULT 'portal',
    body         TEXT NOT NULL,
    read_at      TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_message_author_role CHECK (author_role IN ('client', 'coach')),
    CONSTRAINT chk_message_channel CHECK (channel IN ('portal', 'whatsapp', 'email', 'sms'))
);

CREATE INDEX idx_message_client_created ON message (client_id, created_at);
