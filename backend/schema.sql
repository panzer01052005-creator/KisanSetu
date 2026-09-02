CREATE TABLE crop_registrations (
    id BIGSERIAL PRIMARY KEY,
    crop_name VARCHAR(120) NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('kg', 'quintal', 'ton')),
    collection_center VARCHAR(160) NOT NULL,
    address VARCHAR(240) NOT NULL,
    district VARCHAR(100) NOT NULL,
    pincode CHAR(6) NOT NULL CHECK (pincode ~ '^[0-9]{6}$'),
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);