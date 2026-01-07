-- ============================================
-- SCRIPT D'INSERTION DES CATÉGORIES ET SOUS-CATÉGORIES
-- Structure complète selon les spécifications
-- ============================================

-- Supprimer les anciennes données (optionnel - à commenter si vous voulez garder les données existantes)
-- DELETE FROM service_subcategories;
-- DELETE FROM service_categories;

-- ============================================
-- 1️⃣ BEAUTÉ & COIFFURE
-- ============================================
INSERT INTO service_categories (id, name, icon, color) 
VALUES ('550e8400-e29b-41d4-a716-446655440001', 'Beauté & Coiffure', 'cut-outline', '#FF6B9D')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- Sous-catégories Beauté & Coiffure
INSERT INTO service_subcategories (id, category_id, name, icon, color) VALUES
-- Coiffure Femme
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Coiffure Femme', 'woman-outline', '#FF6B9D'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Brushing / coupe / lissage', 'brush-outline', '#FF6B9D'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Pose de perruque / lace / baby hair', 'sparkles-outline', '#FF6B9D'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Pose de tissage / extensions', 'layers-outline', '#FF6B9D'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Coloration / mèches / soins capillaires', 'color-palette-outline', '#FF6B9D'),
-- Coiffure Homme
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Coiffure Homme', 'man-outline', '#FF6B9D'),
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'Coupe / dégradé / contour', 'cut-outline', '#FF6B9D'),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', 'Barbe / soin barbe', 'barbell-outline', '#FF6B9D'),
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440001', 'Coloration homme', 'color-fill-outline', '#FF6B9D'),
-- Tresses & Locks
('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Tresses simples / vanilles / box braids', 'grid-outline', '#FF6B9D'),
('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'Cornrows / nattes collées', 'git-branch-outline', '#FF6B9D'),
('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'Pose de locks / retwist / nettoyage / coiffure finition', 'lock-closed-outline', '#FF6B9D'),
('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', 'Crochet braids / bantu knots', 'construct-outline', '#FF6B9D'),
-- Coiffure Enfant
('660e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440001', 'Coiffure Enfant', 'happy-outline', '#FF6B9D'),
('660e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', 'Tresses fille / garçon', 'people-outline', '#FF6B9D'),
('660e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440001', 'Vanilles / chignons', 'ribbon-outline', '#FF6B9D')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- ============================================
-- 2️⃣ MAQUILLAGE & ESTHÉTIQUE
-- ============================================
INSERT INTO service_categories (id, name, icon, color) 
VALUES ('550e8400-e29b-41d4-a716-446655440002', 'Maquillage & Esthétique', 'color-palette-outline', '#9B59B6')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- Sous-catégories Maquillage & Esthétique
INSERT INTO service_subcategories (id, category_id, name, icon, color) VALUES
('660e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440002', 'Maquillage Jour / soirée / mariage', 'sparkles-outline', '#9B59B6'),
('660e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440002', 'Professionnel / shooting / artistique', 'camera-outline', '#9B59B6'),
('660e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440002', 'Semi-permanent (sourcils, lèvres)', 'eye-outline', '#9B59B6'),
('660e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440002', 'Nettoyage / gommage / masque', 'water-outline', '#9B59B6'),
('660e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 'Hydratant / anti-acné / purifiant', 'leaf-outline', '#9B59B6'),
('660e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440002', 'Sourcils / lèvres / jambes / aisselles', 'body-outline', '#9B59B6'),
('660e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440002', 'Cire / fil / pince', 'construct-outline', '#9B59B6'),
('660e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440002', 'Henné mains / bras / jambes / visage', 'flower-outline', '#9B59B6'),
('660e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440002', 'Tatouage éphémère artistique', 'brush-outline', '#9B59B6')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- ============================================
-- 3️⃣ ONGLES & CILS
-- ============================================
INSERT INTO service_categories (id, name, icon, color) 
VALUES ('550e8400-e29b-41d4-a716-446655440003', 'Ongles & Cils', 'hand-left-outline', '#E74C3C')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- Sous-catégories Ongles & Cils
INSERT INTO service_subcategories (id, category_id, name, icon, color) VALUES
('660e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440003', 'Pose capsules / gel / acrygel', 'layers-outline', '#E74C3C'),
('660e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440003', 'Remplissage / dépose', 'refresh-outline', '#E74C3C'),
('660e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440003', 'Nail art / french / baby boomer', 'color-palette-outline', '#E74C3C'),
('660e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440003', 'Beauté mains et pieds', 'hand-right-outline', '#E74C3C'),
('660e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440003', 'Extensions (classique, volume russe, mixte)', 'eye-outline', '#E74C3C'),
('660e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440003', 'Rehaussement / teinture / dépose', 'arrow-up-outline', '#E74C3C')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- ============================================
-- 4️⃣ MODE & COUTURE
-- ============================================
INSERT INTO service_categories (id, name, icon, color) 
VALUES ('550e8400-e29b-41d4-a716-446655440004', 'Mode & Couture', 'shirt-outline', '#3498DB')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- Sous-catégories Mode & Couture
INSERT INTO service_subcategories (id, category_id, name, icon, color) VALUES
('660e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440004', 'Reprise couture / ourlet / fermeture / bouton', 'construct-outline', '#3498DB'),
('660e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440004', 'Ajustement taille / coupe / manches', 'resize-outline', '#3498DB'),
('660e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440004', 'Tenues africaines / robes / costumes', 'shirt-outline', '#3498DB'),
('660e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440004', 'Tricot / crochet / création laine', 'git-branch-outline', '#3498DB'),
('660e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440004', 'Peinture sur vêtements', 'brush-outline', '#3498DB'),
('660e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440004', 'Strass / broderie / flocage / perles', 'sparkles-outline', '#3498DB')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- ============================================
-- 5️⃣ ACCESSOIRES & CHAUSSURES
-- ============================================
INSERT INTO service_categories (id, name, icon, color) 
VALUES ('550e8400-e29b-41d4-a716-446655440005', 'Accessoires & Chaussures', 'footsteps-outline', '#F39C12')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- Sous-catégories Accessoires & Chaussures
INSERT INTO service_subcategories (id, category_id, name, icon, color) VALUES
('660e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440005', 'Nettoyage baskets, talons, mocassins', 'water-outline', '#F39C12'),
('660e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440005', 'Détachage, désodorisation, cirage', 'brush-outline', '#F39C12'),
('660e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440005', 'Peinture personnalisée sur chaussures', 'color-palette-outline', '#F39C12'),
('660e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440005', 'Custom sacs / ceintures / bijoux', 'bag-outline', '#F39C12')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- ============================================
-- 6️⃣ BIEN-ÊTRE & CORPS
-- ============================================
INSERT INTO service_categories (id, name, icon, color) 
VALUES ('550e8400-e29b-41d4-a716-446655440006', 'Bien-être & Corps', 'fitness-outline', '#1ABC9C')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- Sous-catégories Bien-être & Corps
INSERT INTO service_subcategories (id, category_id, name, icon, color) VALUES
('660e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440006', 'Massage relaxant / sportif / tonifiant', 'body-outline', '#1ABC9C'),
('660e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440006', 'Gommage / soins minceur', 'leaf-outline', '#1ABC9C'),
('660e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440006', 'Coaching sportif (fitness, musculation, perte de poids)', 'barbell-outline', '#1ABC9C'),
('660e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440006', 'Coaching nutritionnel / santé', 'restaurant-outline', '#1ABC9C')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- ============================================
-- 7️⃣ CUISINE & ÉVÉNEMENTIEL
-- ============================================
INSERT INTO service_categories (id, name, icon, color) 
VALUES ('550e8400-e29b-41d4-a716-446655440007', 'Cuisine & Événementiel', 'restaurant-outline', '#E67E22')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- Sous-catégories Cuisine & Événementiel
INSERT INTO service_subcategories (id, category_id, name, icon, color) VALUES
('660e8400-e29b-41d4-a716-446655440046', '550e8400-e29b-41d4-a716-446655440007', 'Plats africains / orientaux / européens', 'fast-food-outline', '#E67E22'),
('660e8400-e29b-41d4-a716-446655440047', '550e8400-e29b-41d4-a716-446655440007', 'Pâtisseries maison / desserts', 'ice-cream-outline', '#E67E22'),
('660e8400-e29b-41d4-a716-446655440048', '550e8400-e29b-41d4-a716-446655440007', 'Buffets pour petits événements', 'wine-outline', '#E67E22'),
('660e8400-e29b-41d4-a716-446655440049', '550e8400-e29b-41d4-a716-446655440007', 'Décoration baby shower / anniversaire / mariage', 'balloon-outline', '#E67E22'),
('660e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440007', 'Location de déco / création personnalisée', 'sparkles-outline', '#E67E22')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- ============================================
-- 8️⃣ PHOTO & IMAGE
-- ============================================
INSERT INTO service_categories (id, name, icon, color) 
VALUES ('550e8400-e29b-41d4-a716-446655440008', 'Photo & Image', 'camera-outline', '#34495E')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- Sous-catégories Photo & Image
INSERT INTO service_subcategories (id, category_id, name, icon, color) VALUES
('660e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440008', 'Shooting studio / extérieur', 'camera-outline', '#34495E'),
('660e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440008', 'Mariage / anniversaire / événement', 'calendar-outline', '#34495E'),
('660e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440008', 'Portraits / produits / mode', 'person-outline', '#34495E'),
('660e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440008', 'Retouche photo', 'brush-outline', '#34495E'),
('660e8400-e29b-41d4-a716-446655440055', '550e8400-e29b-41d4-a716-446655440008', 'Création visuelle / montage', 'color-palette-outline', '#34495E')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color;

-- ============================================
-- VÉRIFICATION
-- ============================================
SELECT 
  c.name as categorie,
  COUNT(s.id) as nombre_sous_categories
FROM service_categories c
LEFT JOIN service_subcategories s ON s.category_id = c.id
GROUP BY c.id, c.name
ORDER BY c.name;

-- Afficher toutes les catégories et sous-catégories
SELECT 
  c.name as categorie,
  s.name as sous_categorie
FROM service_categories c
LEFT JOIN service_subcategories s ON s.category_id = c.id
ORDER BY c.name, s.name;


