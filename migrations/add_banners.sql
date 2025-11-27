-- Add banner columns to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS left_banner TEXT,
ADD COLUMN IF NOT EXISTS right_banner TEXT;
