-- Supabase Migration Script for Luxury Salon
-- Final Production Security & Business Data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. admin_users (Mapping for secure admin authorization)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- MANUAL ADMIN SETUP (Run this after user signs up)
-- INSERT INTO public.admin_users (id, email) VALUES ('USER_UUID_HERE', 'admin@example.com');

-- 2. staff
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    photo_url TEXT,
    speciality TEXT,
    phone TEXT,
    email TEXT,
    shift_start TEXT,
    shift_end TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. customers
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    gender TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. service_categories
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. services
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    duration_minutes INTEGER NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. appointments
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    booking_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rescheduled', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. enquiries
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service_interest TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. offers
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    original_price NUMERIC,
    offer_price NUMERIC NOT NULL,
    valid_from DATE,
    valid_to DATE,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. gallery_items
CREATE TABLE IF NOT EXISTS gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    category TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    service_tag TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. hero_slides
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    subtitle TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    button_text TEXT,
    button_link TEXT,
    sort_order INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. settings
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_name TEXT,
    logo_url TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    map_url TEXT,
    social_links JSONB DEFAULT '{"instagram": "", "facebook": "", "whatsapp": ""}',
    opening_hours JSONB DEFAULT '{"monday": "10:00 AM - 8:00 PM", "tuesday": "10:00 AM - 8:00 PM", "wednesday": "10:00 AM - 8:00 PM", "thursday": "10:00 AM - 8:00 PM", "friday": "10:00 AM - 8:00 PM", "saturday": "9:00 AM - 9:00 PM", "sunday": "10:00 AM - 6:00 PM"}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_booking_date ON appointments(booking_date);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Seed Data (Real Glow Up Salon Details)
INSERT INTO settings (salon_name, phone, email, address, opening_hours, social_links)
VALUES (
    'Glow Up Unisex Salon', 
    '+91 93245 56123', 
    'info@glowupsalon.in', 
    'Shop No. 4, Ground Floor, Plot No. 12, Sector 20, Kamothe, Navi Mumbai, Maharashtra 410209', 
    '{"monday": "10:00 AM - 9:00 PM", "tuesday": "10:00 AM - 9:00 PM", "wednesday": "10:00 AM - 9:00 PM", "thursday": "10:00 AM - 9:00 PM", "friday": "10:00 AM - 9:00 PM", "saturday": "10:00 AM - 10:00 PM", "sunday": "10:00 AM - 10:00 PM"}',
    '{"instagram": "https://instagram.com/glowup_kamothe", "facebook": "https://facebook.com/glowupsalonkamothe", "whatsapp": "https://wa.me/919324556123"}'
)
ON CONFLICT DO NOTHING;

-- Service Categories
INSERT INTO service_categories (name, slug, sort_order) VALUES
('Hair Care', 'hair-care', 1),
('Skin Care', 'skin-care', 2),
('Bridal & Makeup', 'bridal-makeup', 3),
('Nails & Spa', 'nails-spa', 4)
ON CONFLICT (slug) DO NOTHING;

-- Services
INSERT INTO services (name, description, price, duration_minutes, is_featured, category_id)
SELECT 'Luxury Haircut', 'Professional styling and haircut with hair wash.', 500, 45, true, id FROM service_categories WHERE slug = 'hair-care'
UNION ALL
SELECT 'Global Hair Color', 'Premium hair coloring service with ammonia-free products.', 2500, 120, true, id FROM service_categories WHERE slug = 'hair-care'
UNION ALL
SELECT 'Hydra Facial', 'Deep cleansing and hydration for glowing skin.', 3500, 60, true, id FROM service_categories WHERE slug = 'skin-care'
UNION ALL
SELECT 'Bridal Makeup Package', 'Complete bridal look with hair styling and draping.', 15000, 240, true, id FROM service_categories WHERE slug = 'bridal-makeup'
ON CONFLICT DO NOTHING;

-- RLS Configuration
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- 1. admin_users policies
DROP POLICY IF EXISTS "Allow users to read their own admin status" ON admin_users;
CREATE POLICY "Allow users to read their own admin status" ON admin_users 
FOR SELECT USING (auth.uid() = id);

-- 2. Public Read Access
DROP POLICY IF EXISTS "Allow public read" ON staff;
CREATE POLICY "Allow public read" ON staff FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read" ON service_categories;
CREATE POLICY "Allow public read" ON service_categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read" ON services;
CREATE POLICY "Allow public read" ON services FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read" ON offers;
CREATE POLICY "Allow public read" ON offers FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read" ON gallery_items;
CREATE POLICY "Allow public read" ON gallery_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON reviews;
CREATE POLICY "Allow public read" ON reviews FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "Allow public read" ON hero_slides;
CREATE POLICY "Allow public read" ON hero_slides FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read" ON settings;
CREATE POLICY "Allow public read" ON settings FOR SELECT USING (true);

-- 3. Public Write Access (Strictly limited)
DROP POLICY IF EXISTS "Allow public insert" ON enquiries;
CREATE POLICY "Allow public insert" ON enquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert" ON appointments;
CREATE POLICY "Allow public insert" ON appointments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert" ON customers;
CREATE POLICY "Allow public insert" ON customers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert" ON reviews;
CREATE POLICY "Allow public insert" ON reviews FOR INSERT WITH CHECK (true);

-- 4. Admin Full Access (Secured via is_admin() function)
DROP POLICY IF EXISTS "Allow admin all" ON staff;
CREATE POLICY "Allow admin all" ON staff FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Allow admin all" ON service_categories;
CREATE POLICY "Allow admin all" ON service_categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Allow admin all" ON services;
CREATE POLICY "Allow admin all" ON services FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Allow admin all" ON appointments;
CREATE POLICY "Allow admin all" ON appointments FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Allow admin all" ON enquiries;
CREATE POLICY "Allow admin all" ON enquiries FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Allow admin all" ON offers;
CREATE POLICY "Allow admin all" ON offers FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Allow admin all" ON gallery_items;
CREATE POLICY "Allow admin all" ON gallery_items FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Allow admin all" ON reviews;
CREATE POLICY "Allow admin all" ON reviews FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Allow admin all" ON hero_slides;
CREATE POLICY "Allow admin all" ON hero_slides FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Allow admin all" ON settings;
CREATE POLICY "Allow admin all" ON settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Allow admin all" ON customers;
CREATE POLICY "Allow admin all" ON customers FOR ALL USING (is_admin()) WITH CHECK (is_admin());
