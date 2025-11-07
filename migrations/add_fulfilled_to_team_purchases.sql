-- Add fulfilled columns to team_purchases table
-- Run this in your Supabase SQL Editor

ALTER TABLE team_purchases
ADD COLUMN IF NOT EXISTS fulfilled BOOLEAN DEFAULT FALSE;

ALTER TABLE team_purchases
ADD COLUMN IF NOT EXISTS fulfilled_at TIMESTAMP WITH TIME ZONE;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_team_purchases_fulfilled ON team_purchases(fulfilled);
CREATE INDEX IF NOT EXISTS idx_team_purchases_team_id_fulfilled ON team_purchases(team_id, fulfilled);



