-- Migration: Add team approval system
-- Date: 2025-11-07
-- Description: Adds approved column to teams table to allow admin approval before teams can purchase hardware

-- Add approved boolean column (defaults to false so new teams need approval)
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;

-- Add index for better query performance on approved status
CREATE INDEX IF NOT EXISTS idx_teams_approved ON teams(approved);

-- Add comment to document the column
COMMENT ON COLUMN teams.approved IS 'Whether the team has been approved by an admin to access the hardware shop';

-- Optional: Set existing teams as approved (if you want to grandfather them in)
-- Comment out the line below if you want existing teams to also require approval
UPDATE teams SET approved = TRUE WHERE approved IS NULL OR approved = FALSE;

