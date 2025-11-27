-- Create site_settings table for global homepage settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default homepage banner settings
INSERT INTO site_settings (setting_key, setting_value) 
VALUES 
  ('homepage_left_banner', NULL),
  ('homepage_right_banner', NULL)
ON CONFLICT (setting_key) DO NOTHING;
