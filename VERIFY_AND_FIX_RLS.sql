-- ################################################################################
-- COMPLETE RLS VERIFICATION AND FIX
-- Run EACH section ONE AT A TIME and check the results
-- ################################################################################

-- STEP 1: Check if RLS is actually disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'categories';
-- If rowsecurity = true, RLS is ENABLED (we need it to be false)

-- STEP 2: Force disable RLS (run this multiple times if needed)
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;

-- STEP 3: Verify it's disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'categories';
-- Should show rowsecurity = false

-- STEP 4: Check all existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'categories';

-- STEP 5: Drop ALL policies on categories table
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Manage Categories" ON public.categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.categories;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.categories;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.categories;

-- STEP 6: Verify no policies exist
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'categories';
-- Should return 0 rows

-- STEP 7: Grant full access to authenticated users
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.categories TO anon;

-- STEP 8: Try inserting a test category directly in SQL
INSERT INTO public.categories (name, slug, description) 
VALUES ('Test Category', 'test-category', 'This is a test')
RETURNING *;

-- If STEP 8 works, the issue is with your application code, not the database
-- If STEP 8 fails, there's a deeper permission issue
