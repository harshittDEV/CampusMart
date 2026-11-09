-- Migration V3: Add indexes for authentication tables
CREATE INDEX idx_email_verification_user ON email_verification_tokens(user_id);
CREATE INDEX idx_email_verification_hash ON email_verification_tokens(token_hash);
CREATE INDEX idx_refresh_token_hash ON refresh_tokens(token_hash);
