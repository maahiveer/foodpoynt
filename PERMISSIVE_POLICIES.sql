-- ################################################################################
-- ALTERNATIVE FIX: Create permissive policies instead of disabling RLS
-- ################################################################################

-- First, drop all existing policies
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Manage Categories" ON public.categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.categories;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.categories;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.categories;

-- Create super permissive policies that allow EVERYTHING
CREATE POLICY "Allow all for categories" ON public.categories
FOR ALL
USING (true)
WITH CHECK (true);

-- Do the same for articles
DROP POLICY IF EXISTS "Public Read Published Articles" ON public.articles;
DROP POLICY IF EXISTS "Admin Manage Articles" ON public.articles;

CREATE POLICY "Allow all for articles" ON public.articles
FOR ALL
USING (true)
WITH CHECK (true);

-- And for user_profiles
DROP POLICY IF EXISTS "Auth Read Profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin Manage Profiles" ON public.user_profiles;

CREATE POLICY "Allow all for user_profiles" ON public.user_profiles
FOR ALL
USING (true)
WITH CHECK (true);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, cmd
FROM pg_policies 
WHERE tablename IN ('categories', 'articles', 'user_profiles')
ORDER BY tablename, policyname;
