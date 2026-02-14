-- ################################################################################
-- FOODPOYNT COMPLETE SUPABASE SETUP SCRIPT
-- RUN THIS IN YOUR SUPABASE SQL EDITOR (Table Editor -> SQL Query)
-- ################################################################################

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE CATEGORIES TABLE (Supports Subcategories)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT '{}',
    featured_image TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    left_banner TEXT,
    right_banner TEXT
);

-- 4. CREATE USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

-- 6. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at 
    BEFORE UPDATE ON public.articles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 8. SECURITY POLICIES (No-Recursion Fix)

-- Categories: Anyone can read, only Admins can manage
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Manage Categories" ON public.categories;
CREATE POLICY "Admin Manage Categories" ON public.categories FOR ALL USING (
  (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin'
);

-- Articles: Public reads published, Admins manage all
DROP POLICY IF EXISTS "Public Read Published Articles" ON public.articles;
CREATE POLICY "Public Read Published Articles" ON public.articles FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admin Manage Articles" ON public.articles;
CREATE POLICY "Admin Manage Articles" ON public.articles FOR ALL USING (
  (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin'
);

-- Profiles: Authenticated users can read, only Admins can manage
DROP POLICY IF EXISTS "Auth Read Profiles" ON public.user_profiles;
CREATE POLICY "Auth Read Profiles" ON public.user_profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin Manage Profiles" ON public.user_profiles;
CREATE POLICY "Admin Manage Profiles" ON public.user_profiles FOR ALL TO authenticated USING (
  (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'admin'
);

-- 9. AUTOMATION: AUTOMATIC PROFILE & ADMIN CREATION
-- This function runs whenever a new user signs up.
-- IMPORTANT: It makes the VERY FIRST USER the 'admin' automatically!
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    is_first_user BOOLEAN;
BEGIN
    -- Check if ANY user profile exists. If not, this is the first user.
    SELECT (NOT EXISTS (SELECT 1 FROM public.user_profiles)) INTO is_first_user;

    INSERT INTO public.user_profiles (id, full_name, avatar_url, role)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Default User'),
        NEW.raw_user_meta_data->>'avatar_url',
        CASE WHEN is_first_user THEN 'admin' ELSE 'editor' END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function above
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ################################################################################
-- SETUP COMPLETE! 
-- 1. Go to Authentication -> Policies in Supabase to verify RLS is enabled.
-- 2. Sign up on your website.
-- 3. Since you are the first user, you will be the ADMIN automatically.
-- ################################################################################
