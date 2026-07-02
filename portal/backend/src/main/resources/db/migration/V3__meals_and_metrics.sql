-- M2: meal logging, curated food catalog, weight/sleep/symptoms, GL tracking.

CREATE TABLE food_item (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(200) NOT NULL,
    category            VARCHAR(100) NOT NULL,
    gi                  SMALLINT NOT NULL CHECK (gi BETWEEN 0 AND 100),
    carbs_per_100g      DECIMAL(6, 2) NOT NULL CHECK (carbs_per_100g >= 0),
    default_serving_g   DECIMAL(8, 2) NOT NULL DEFAULT 100,
    search_name         VARCHAR(200) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_food_item_search ON food_item (search_name);
CREATE INDEX idx_food_item_category ON food_item (category);

CREATE TABLE meal_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    logged_at   TIMESTAMPTZ NOT NULL,
    meal_slot   VARCHAR(20) NOT NULL,
    total_gl    DECIMAL(8, 2) NOT NULL DEFAULT 0,
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_meal_slot CHECK (meal_slot IN ('breakfast', 'lunch', 'dinner', 'snack'))
);

CREATE INDEX idx_meal_log_user_logged ON meal_log (user_id, logged_at DESC);

CREATE TABLE meal_log_item (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_log_id     UUID NOT NULL REFERENCES meal_log (id) ON DELETE CASCADE,
    food_item_id    UUID REFERENCES food_item (id),
    free_text_name  VARCHAR(200),
    quantity        DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
    unit            VARCHAR(20) NOT NULL DEFAULT 'g',
    carbs_g         DECIMAL(8, 2),
    gl              DECIMAL(8, 2) NOT NULL DEFAULT 0,
    estimated       BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT chk_meal_item_source CHECK (food_item_id IS NOT NULL OR free_text_name IS NOT NULL)
);

CREATE INDEX idx_meal_log_item_meal ON meal_log_item (meal_log_id);

CREATE TABLE weight_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    logged_at   TIMESTAMPTZ NOT NULL,
    weight_kg   DECIMAL(6, 2) NOT NULL CHECK (weight_kg > 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weight_log_user_logged ON weight_log (user_id, logged_at DESC);

CREATE TABLE sleep_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    log_date    DATE NOT NULL,
    hours       DECIMAL(4, 2) NOT NULL CHECK (hours > 0 AND hours <= 24),
    quality     SMALLINT CHECK (quality BETWEEN 1 AND 5),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, log_date)
);

CREATE INDEX idx_sleep_log_user_date ON sleep_log (user_id, log_date DESC);

CREATE TABLE symptom_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    logged_at   TIMESTAMPTZ NOT NULL,
    symptom     VARCHAR(100) NOT NULL,
    severity    VARCHAR(20) NOT NULL DEFAULT 'mild',
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_symptom_severity CHECK (severity IN ('none', 'mild', 'moderate', 'severe'))
);

CREATE INDEX idx_symptom_log_user_logged ON symptom_log (user_id, logged_at DESC);
