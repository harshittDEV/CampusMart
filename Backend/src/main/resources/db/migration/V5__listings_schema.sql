-- Migration V5: Listings table (Phase 5)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types are already defined in V2 (listing_status, product_condition)
-- Ensure they exist; if not, they will be created by V2.

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL,
    institution_id UUID NOT NULL,
    category_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    currency_code CHAR(3) NOT NULL DEFAULT 'INR',
    condition VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    sold_at TIMESTAMP WITH TIME ZONE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_listing_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_listing_institution FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE RESTRICT,
    CONSTRAINT fk_listing_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT chk_listing_condition CHECK (condition = ANY (ARRAY['NEW','LIKE_NEW','GOOD','FAIR','POOR'])),
    CONSTRAINT chk_listing_status CHECK (status = ANY (ARRAY['DRAFT','ACTIVE','SOLD','DEACTIVATED']))
);

-- Indexes for fast look‑ups and visibility filtering
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_institution ON listings(institution_id);
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_deleted ON listings(deleted);

