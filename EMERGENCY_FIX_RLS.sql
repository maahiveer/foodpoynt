-- ################################################################################
-- EMERGENCY FIX: DISABLE RLS TEMPORARILY OR FIX POLICIES
-- Run this in Supabase SQL Editor
-- ################################################################################

-- OPTION 1: Quick Fix - Temporarily disable RLS on categories
-- (Use this if you need to add categories immediately)
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;

-- OPTION 2: Better Fix - Update the policies to work correctly
-- First, drop the problematic policy
DROP POLICY IF EXISTS "Admin Manage Categories" ON public.categories;

-- Create a simpler policy that checks role directly
CREATE POLICY "Admin Manage Categories" ON public.categories 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  )
);

-- Re-enable RLS if you disabled it
-- ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- OPTION 3: Check if your user is actually admin
SELECT u.id, u.email, up.role 
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
WHERE u.email = 'bankonkamalakar@gmail.com';

-- If the role is NULL or 'editor', run this:
-- UPDATE user_profiles 
-- SET role = 'admin' 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'bankonkamalakar@gmail.com');
