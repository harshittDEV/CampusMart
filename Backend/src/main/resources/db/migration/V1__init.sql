-- Initial migration: create a placeholder table for future use
CREATE TABLE IF NOT EXISTS placeholder (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
