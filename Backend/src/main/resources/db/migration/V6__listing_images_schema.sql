-- Migration V6: Listing images table (Phase 5)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE listing_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL,
    image_url VARCHAR(1024) NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_image_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    CONSTRAINT uq_image_order UNIQUE (listing_id, display_order)
);

CREATE INDEX idx_listing_images_listing ON listing_images(listing_id);

