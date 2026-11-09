-- Migration V8: Create listing_moderation_history table for audit trail
CREATE TABLE listing_moderation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id),
    admin_user_id UUID NOT NULL REFERENCES users(id),
    previous_status VARCHAR(30) NOT NULL,
    new_status VARCHAR(30) NOT NULL,
    reason VARCHAR(1000) NOT NULL,
    action_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT fk_moderation_listing FOREIGN KEY (listing_id) REFERENCES listings(id),
    CONSTRAINT fk_moderation_admin FOREIGN KEY (admin_user_id) REFERENCES users(id)
);

CREATE INDEX idx_moderation_listing_id ON listing_moderation_history(listing_id);
CREATE INDEX idx_moderation_admin_id ON listing_moderation_history(admin_user_id);
CREATE INDEX idx_moderation_action_at ON listing_moderation_history(action_at);

