-- Insert admin user for environment-based authentication
INSERT INTO user_profiles (id, full_name, role, created_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Admin User',
  'admin',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;
