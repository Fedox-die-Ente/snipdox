-- Migration: Add password_hash column to pastes table
-- Date: 2025-11-22
-- Description: Adds support for password-protected private pastes

ALTER TABLE pastes ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
