# FoodPoynt - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Database Setup](#supabase-database-setup)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [Admin Access Setup](#admin-access-setup)
6. [Adding Categories](#adding-categories)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher) installed
- A Supabase account (free tier works fine)
- Git installed (optional, for version control)

---

## Supabase Database Setup

### Step 1: Create a New Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in the details:
   - **Project Name**: foodpoynt (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be created

### Step 2: Get Your API Keys

1. In your Supabase dashboard, click on **"Settings"** (gear icon) in the left sidebar
2. Click on **"API"**
3. You'll see:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)
   - **service_role** key (another long string)
4. **Keep this page open** - you'll need these values in the next step

### Step 3: Run the Database Setup Script

1. In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste the **ENTIRE** content from `COMPLETE_SUPABASE_SETUP.sql` (provided below)
4. Click **"Run"** or press `Ctrl+Enter`
5. You should see: `Success. No rows returned`

**COMPLETE_SUPABASE_SETUP.sql:**
```sql
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

-- 8. AUTOMATION: AUTOMATIC PROFILE & ADMIN CREATION
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
```

### Step 4: Set Up Permissive Policies

1. Still in the **SQL Editor**, create a new query
2. Copy and paste the content from `PERMISSIVE_POLICIES.sql` (provided below)
3. Click **"Run"**

**PERMISSIVE_POLICIES.sql:**
```sql
-- ################################################################################
-- PERMISSIVE POLICIES - Allows all operations for development
-- ################################################################################

-- Drop all existing policies
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
```

### Step 5: Seed Initial Categories (Optional)

1. Create a new query in SQL Editor
2. Copy and paste the content from `SEED_DATA.sql` (provided below)
3. Click **"Run"**

**SEED_DATA.sql:**
```sql
-- ################################################################################
-- FOODPOYNT DEFAULT CATEGORIES
-- Run this script to populate your database with initial food and drink categories.
-- ################################################################################

-- MEALS
DO $$
DECLARE
    parent_id UUID;
BEGIN
    INSERT INTO categories (name, slug, description) VALUES ('Meals', 'meals', 'Breakfast, Lunch, and Dinner ideas') RETURNING id INTO parent_id;
    
    INSERT INTO categories (name, slug, description, parent_id) VALUES 
    ('Breakfast', 'breakfast', 'Start your day right', parent_id),
    ('Lunch', 'lunch', 'Quick and easy midday meals', parent_id),
    ('Dinner', 'dinner', 'Hearty meals for the whole family', parent_id),
    ('Snacks', 'snacks', 'Small bites for anytime', parent_id);
END $$;

-- CUISINES
DO $$
DECLARE
    parent_id UUID;
BEGIN
    INSERT INTO categories (name, slug, description) VALUES ('Cuisines', 'cuisines', 'Flavors from around the world') RETURNING id INTO parent_id;
    
    INSERT INTO categories (name, slug, description, parent_id) VALUES 
    ('Italian', 'italian', 'Pasta, Pizza, and more', parent_id),
    ('Indian', 'indian', 'Spices, Curries, and traditions', parent_id),
    ('Mexican', 'mexican', 'Tacos, Burritos, and bold flavors', parent_id),
    ('Asian', 'asian', 'Stir-frys, Sushi, and Noodles', parent_id);
END $$;

-- DRINKS
DO $$
DECLARE
    parent_id UUID;
BEGIN
    INSERT INTO categories (name, slug, description) VALUES ('Drinks', 'drinks', 'Refreshments and Cocktails') RETURNING id INTO parent_id;
    
    INSERT INTO categories (name, slug, description, parent_id) VALUES 
    ('Cocktails', 'cocktails', 'Mixology and spirited drinks', parent_id),
    ('Smoothies', 'smoothies', 'Healthy blended drinks', parent_id),
    ('Coffee & Tea', 'coffee-tea', 'Hot and cold brews', parent_id),
    ('Wines', 'wines', 'Wine pairings and guides', parent_id);
END $$;

-- DESSERTS
DO $$
DECLARE
    parent_id UUID;
BEGIN
    INSERT INTO categories (name, slug, description) VALUES ('Desserts', 'desserts', 'Sweet treats and baking') RETURNING id INTO parent_id;
    
    INSERT INTO categories (name, slug, description, parent_id) VALUES 
    ('Cakes', 'cakes', 'Birthday and celebration cakes', parent_id),
    ('Cookies', 'cookies', 'Crispy and chewy delights', parent_id),
    ('Ice Cream', 'ice-cream', 'Frozen treats', parent_id);
END $$;

-- HEALTHY
DO $$
DECLARE
    parent_id UUID;
BEGIN
    INSERT INTO categories (name, slug, description) VALUES ('Healthy', 'healthy', 'Nutritious and delicious') RETURNING id INTO parent_id;
    
    INSERT INTO categories (name, slug, description, parent_id) VALUES 
    ('Vegan', 'vegan', 'Plant-based recipes', parent_id),
    ('Keto', 'keto', 'Low carb, high fat', parent_id),
    ('Gluten-Free', 'gluten-free', 'Wheat-free alternatives', parent_id);
END $$;
```

---

## Environment Configuration

### Step 1: Create .env.local File

1. In your project root directory, create a file named `.env.local`
2. Copy and paste the template below
3. Replace the placeholder values with your actual Supabase credentials

**.env.local Template:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin Credentials (Change these!)
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD=YourSecurePassword123!
NEXT_PUBLIC_ADMIN_EMAIL=your_email@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=YourSecurePassword123!
```

**How to fill in the values:**

1. **NEXT_PUBLIC_SUPABASE_URL**: 
   - Go to Supabase Dashboard → Settings → API
   - Copy the "Project URL"

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: 
   - Same page, copy the "anon public" key

3. **SUPABASE_SERVICE_ROLE_KEY**: 
   - Same page, copy the "service_role" key (keep this secret!)

4. **ADMIN_EMAIL** and **ADMIN_PASSWORD**: 
   - Choose your admin email and a strong password
   - You'll use these to log in to the admin panel

---

## Running the Application

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

Wait for all packages to install (this may take 2-3 minutes).

### Step 2: Start the Development Server

```bash
npm run dev
```

You should see:
```
> tracksatscale@0.1.0 dev
> next dev

  ▲ Next.js 16.0.7
  - Local:        http://localhost:3000
```

### Step 3: Open the Application

Open your browser and go to: **http://localhost:3000**

You should see the FoodPoynt homepage! 🎉

---

## Admin Access Setup

### Step 1: Sign Up as Admin

1. Go to: **http://localhost:3000/admin**
2. You'll be redirected to the login page
3. Click **"Sign Up"** (or look for a registration link)
4. Enter:
   - **Email**: The email you set in `.env.local`
   - **Password**: The password you set in `.env.local`
5. Click **"Sign Up"**

**Important**: The FIRST user to sign up automatically becomes the admin!

### Step 2: Verify Admin Access

1. After signing up, you should be redirected to the admin dashboard
2. You should see menu items like:
   - Dashboard
   - Articles
   - Categories
   - Settings

---

## Adding Categories

### Method 1: Using the Admin Panel

1. Go to: **http://localhost:3000/admin/categories**
2. Click **"New Category"**
3. Fill in the form:
   - **Name**: `Breakfast` (the slug will auto-generate)
   - **Slug**: `breakfast` (auto-filled, but you can edit)
   - **Description**: `Start your day with delicious breakfast recipes`
   - **Parent Category**: Leave as "None" for a top-level category
4. Click **"Create"**

### Method 2: Using SQL (Bulk Import)

If you already ran `SEED_DATA.sql` in Step 5 of the Supabase setup, you already have categories!

To verify:
1. Go to: **http://localhost:3000/admin/categories**
2. You should see categories like Meals, Cuisines, Drinks, etc.

---

## Troubleshooting

### Issue 1: "new row violates row-level security policy"

**Solution**: Run the `PERMISSIVE_POLICIES.sql` script in Supabase SQL Editor (see Step 4 of Supabase setup).

### Issue 2: Can't log in to admin panel

**Solutions**:
1. Make sure you've signed up first (not just trying to log in)
2. Check that your email/password in `.env.local` matches what you used to sign up
3. Clear your browser cache and cookies
4. Try incognito/private browsing mode

### Issue 3: Categories not showing on homepage

**Solutions**:
1. Make sure you've created at least one category
2. Check that the category has articles assigned to it (or the homepage will show "No articles yet")
3. Refresh the page (Ctrl+F5 or Cmd+Shift+R)

### Issue 4: "Failed to fetch categories"

**Solutions**:
1. Check that your `.env.local` file has the correct Supabase URL and keys
2. Verify your Supabase project is running (go to the dashboard)
3. Make sure you ran the `COMPLETE_SUPABASE_SETUP.sql` script
4. Restart the development server (`Ctrl+C` then `npm run dev`)

### Issue 5: Port 3000 already in use

**Solution**: 
```bash
# Kill the process using port 3000 (Windows)
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

---

## Production Deployment

### Before Deploying:

1. **Update `.env.local` for production**:
   ```env
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Test the production build locally**:
   ```bash
   npm start
   ```

### Deploy to Vercel (Recommended):

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"Import Project"**
4. Select your GitHub repository
5. Add your environment variables (from `.env.local`)
6. Click **"Deploy"**

---

## Support

If you encounter any issues not covered in this guide:

1. Check the browser console for errors (F12 → Console tab)
2. Check the terminal where `npm run dev` is running for server errors
3. Verify all environment variables are set correctly
4. Make sure all SQL scripts ran successfully in Supabase

---

## Summary Checklist

- [ ] Created Supabase project
- [ ] Ran `COMPLETE_SUPABASE_SETUP.sql`
- [ ] Ran `PERMISSIVE_POLICIES.sql`
- [ ] (Optional) Ran `SEED_DATA.sql`
- [ ] Created `.env.local` with correct values
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Signed up as admin at `/admin`
- [ ] Created at least one category
- [ ] Verified homepage loads correctly

**Congratulations! Your FoodPoynt website is now ready! 🎉**
