-- ################################################################################
-- FIX ADMIN ACCESS - Run this in Supabase SQL Editor
-- ################################################################################

-- OPTION 1: If you already have a user account, make it admin
-- Replace 'YOUR_EMAIL_HERE' with your actual email address
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (
    SELECT id FROM auth.users 
    WHERE email = 'bankonkamalakar@gmail.com'
    LIMIT 1
);

-- OPTION 2: If the above doesn't work, check if you have any users
SELECT u.id, u.email, up.role 
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id;

-- OPTION 3: If you see a user but no profile, create the profile manually
-- Replace 'USER_ID_HERE' with the actual user ID from the query above
-- INSERT INTO user_profiles (id, full_name, role, created_at)
-- VALUES (
--     'USER_ID_HERE',
--     'Admin User',
--     'admin',
--     NOW()
-- );
