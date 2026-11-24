-- ============================================================================
-- OrderEase Kiosk: PostgreSQL Nutritional Information & Filtering Schema
-- FSSAI & ICMR-NIN Compliant Health & Nutrition Storage per Serving
-- ============================================================================

-- 1. Create table for structured nutritional values (per serving)
CREATE TABLE IF NOT EXISTS menu_item_nutrition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id VARCHAR(64) NOT NULL UNIQUE,
    serving_size_g NUMERIC(6, 2) DEFAULT 100.0,
    calories INTEGER NOT NULL CHECK (calories >= 0),
    protein_g NUMERIC(5, 2) DEFAULT 0.0 CHECK (protein_g >= 0),
    iron_mg NUMERIC(5, 2) DEFAULT 0.0 CHECK (iron_mg >= 0),
    zinc_mg NUMERIC(5, 2) DEFAULT 0.0 CHECK (zinc_mg >= 0),
    fiber_g NUMERIC(5, 2) DEFAULT 0.0 CHECK (fiber_g >= 0),
    carbohydrate_g NUMERIC(5, 2) DEFAULT 0.0 CHECK (carbohydrate_g >= 0),
    total_fat_g NUMERIC(5, 2) DEFAULT 0.0 CHECK (total_fat_g >= 0),
    saturated_fat_g NUMERIC(5, 2) DEFAULT 0.0 CHECK (saturated_fat_g >= 0),
    cholesterol_mg NUMERIC(5, 2) DEFAULT 0.0 CHECK (cholesterol_mg >= 0),
    total_sugar_g NUMERIC(5, 2) DEFAULT 0.0 CHECK (total_sugar_g >= 0),
    added_sugar_g NUMERIC(5, 2) DEFAULT 0.0 CHECK (added_sugar_g >= 0),
    calcium_mg NUMERIC(6, 2) DEFAULT 0.0 CHECK (calcium_mg >= 0),
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for high-performance multi-criteria AND filtering
CREATE INDEX IF NOT EXISTS idx_nutrition_calories ON menu_item_nutrition (calories);
CREATE INDEX IF NOT EXISTS idx_nutrition_protein ON menu_item_nutrition (protein_g);
CREATE INDEX IF NOT EXISTS idx_nutrition_fiber ON menu_item_nutrition (fiber_g);
CREATE INDEX IF NOT EXISTS idx_nutrition_total_fat ON menu_item_nutrition (total_fat_g);
CREATE INDEX IF NOT EXISTS idx_nutrition_iron ON menu_item_nutrition (iron_mg);
CREATE INDEX IF NOT EXISTS idx_nutrition_zinc ON menu_item_nutrition (zinc_mg);
CREATE INDEX IF NOT EXISTS idx_nutrition_calcium ON menu_item_nutrition (calcium_mg);
CREATE INDEX IF NOT EXISTS idx_nutrition_sugar ON menu_item_nutrition (total_sugar_g, added_sugar_g);

-- 3. SQL View for Menu Items with Nutritional Standards
CREATE OR REPLACE VIEW view_menu_items_with_nutrition AS
SELECT 
    n.menu_item_id,
    n.calories,
    n.protein_g,
    n.iron_mg,
    n.zinc_mg,
    n.fiber_g,
    n.carbohydrate_g,
    n.total_fat_g,
    n.saturated_fat_g,
    n.cholesterol_mg,
    n.total_sugar_g,
    n.added_sugar_g,
    n.calcium_mg,
    -- FSSAI Standard Flags
    (n.protein_g >= 12.0) AS is_high_protein,
    (n.iron_mg >= 3.0) AS is_iron_rich,
    (n.zinc_mg >= 2.0) AS is_zinc_rich,
    (n.fiber_g >= 6.0) AS is_high_fiber,
    (n.carbohydrate_g <= 15.0) AS is_low_carb,
    (n.total_fat_g <= 3.0) AS is_low_fat,
    (n.saturated_fat_g <= 1.5) AS is_low_saturated_fat,
    (n.cholesterol_mg <= 20.0) AS is_low_cholesterol,
    (n.total_sugar_g <= 0.5) AS is_sugar_free,
    (n.added_sugar_g = 0.0) AS is_no_added_sugar,
    (n.total_sugar_g <= 5.0) AS is_low_sugar,
    (n.calories > 0 AND n.calories <= 150) AS is_low_calorie,
    (n.calories >= 450) AS is_high_calorie,
    (n.calories > 0 AND n.calories <= 250 AND n.total_fat_g <= 6.0 AND (n.protein_g >= 5.0 OR n.fiber_g >= 3.0)) AS is_diet_friendly,
    (n.calcium_mg >= 150.0) AS is_calcium_rich
FROM menu_item_nutrition n;

-- Example Query: Multi-Select Filter with AND Logic in PostgreSQL
-- e.g. Customer selects: 'High Protein' AND 'Iron Rich' AND 'Low Fat'
-- SELECT * FROM view_menu_items_with_nutrition
-- WHERE is_high_protein = TRUE 
--   AND is_iron_rich = TRUE
--   AND is_low_fat = TRUE;

