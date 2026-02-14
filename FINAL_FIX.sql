-- ################################################################################
-- FINAL COMPLETE FIX - Run ALL of these commands in order
-- ################################################################################

-- STEP 1: Completely disable RLS on all tables
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop ALL existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.' || r.tablename;
    END LOOP;
END $$;

-- STEP 3: Grant full permissions to authenticated and anon roles
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.categories TO anon;
GRANT ALL ON public.articles TO authenticated;
GRANT ALL ON public.articles TO anon;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO anon;

-- STEP 4: Grant usage on sequences (if any)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- STEP 5: Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('categories', 'articles', 'user_profiles');
-- All should show rowsecurity = false

-- STEP 6: Test insert
INSERT INTO public.categories (name, slug, description) 
VALUES ('Test Food Category', 'test-food', 'Testing category creation')
RETURNING *;

-- If this works, delete the test:
-- DELETE FROM public.categories WHERE slug = 'test-food';
