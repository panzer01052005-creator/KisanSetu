CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'seller' CHECK (role IN ('seller', 'buyer', 'admin')),
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE collection_centers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL UNIQUE,
    address VARCHAR(240) NOT NULL,
    district VARCHAR(100) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE crop_registrations (
    id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT REFERENCES users(id),
    crop_name VARCHAR(120) NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('kg', 'quintal', 'ton')),
    collection_center VARCHAR(160) NOT NULL,
    collection_center_id BIGINT REFERENCES collection_centers(id),
    address VARCHAR(240) NOT NULL,
    district VARCHAR(100) NOT NULL,
    pincode CHAR(6) NOT NULL CHECK (pincode ~ '^[0-9]{6}$'),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE procurement_orders (
    id BIGSERIAL PRIMARY KEY,
    registration_id BIGINT NOT NULL REFERENCES crop_registrations(id),
    farmer_id BIGINT REFERENCES users(id),
    token_number VARCHAR(40) UNIQUE,
    delivery_date DATE,
    slot_start TIME,
    slot_end TIME,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE queue_entries (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES procurement_orders(id),
    position INTEGER NOT NULL CHECK (position > 0),
    estimated_wait_minutes INTEGER CHECK (estimated_wait_minutes >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'waiting',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inspections (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES procurement_orders(id),
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    grade VARCHAR(20),
    notes TEXT,
    inspected_at TIMESTAMPTZ
);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES procurement_orders(id),
    farmer_id BIGINT REFERENCES users(id),
    gross_amount NUMERIC(14, 2) CHECK (gross_amount >= 0),
    deductions NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (deductions >= 0),
    net_amount NUMERIC(14, 2) CHECK (net_amount >= 0),
    payment_method VARCHAR(30),
    reference VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    settlement_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE support_tickets (
    id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT REFERENCES users(id),
    category VARCHAR(60) NOT NULL,
    subject VARCHAR(160) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX crop_registrations_status_idx ON crop_registrations(status);
CREATE INDEX crop_registrations_district_idx ON crop_registrations(district);
CREATE INDEX orders_farmer_idx ON procurement_orders(farmer_id);
CREATE INDEX queue_order_idx ON queue_entries(order_id);

INSERT INTO collection_centers (name, address, district, latitude, longitude)
VALUES
    ('Shivaji Nagar Mandi', 'Shivaji Nagar, Bareilly', 'Bareilly', 28.367000, 79.430000),
    ('Agriculture Produce Market, Bareilly', 'Agriculture Market Road, Bareilly', 'Bareilly', 28.347000, 79.414000),
    ('Model Town Collection Center', 'Model Town, Bareilly', 'Bareilly', 28.382000, 79.425000)
ON CONFLICT DO NOTHING;