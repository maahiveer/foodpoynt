-- ################################################################################
-- FOODPOYNT DEFAULT CATEGORIES
-- Run this script to populate your database with initial food and drink categories.
-- ################################################################################

-- 1. CLEAR EXISTING CATEGORIES (Optional - Uncomment if you want to wipe old decor categories)
-- DELETE FROM categories;

-- 2. INSERT MAIN CATEGORIES AND SUBCATEGORIES

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
