-- ============================================
-- Script d'insertion de données de test
-- Prestataires et prestations pour l'application ADM
-- ============================================

-- Note: Les mots de passe sont hashés avec bcrypt
-- Pour les tests, on utilisera un hash simple (en production, utilisez Supabase Auth)

-- ============================================
-- 1. INSERTION DES CATÉGORIES DE SERVICES
-- ============================================

-- Supprimer les catégories existantes si nécessaire (optionnel)
-- DELETE FROM service_categories;

-- Insérer les catégories principales
INSERT INTO service_categories (id, name, icon, color) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Coiffure', 'cut', '#FF6B9D'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Maquillage', 'color-palette', '#C44569'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Onglerie', 'hand-left', '#F8B500'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Soins du visage', 'sparkles', '#4ECDC4'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Épilation', 'remove', '#95E1D3'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Massage', 'fitness', '#A8E6CF')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. INSERTION DES SOUS-CATÉGORIES
-- ============================================

INSERT INTO service_subcategories (id, category_id, name, icon, color) VALUES
  -- Coiffure
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Coupe femme', 'woman', '#FF6B9D'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Coupe homme', 'man', '#FF6B9D'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Coloration', 'color-fill', '#FF6B9D'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Brushing', 'flame', '#FF6B9D'),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Mèches', 'brush', '#FF6B9D'),
  
  -- Maquillage
  ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Maquillage jour', 'sunny', '#C44569'),
  ('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Maquillage soirée', 'moon', '#C44569'),
  ('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Maquillage mariage', 'heart', '#C44569'),
  ('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 'Maquillage permanent', 'time', '#C44569'),
  
  -- Onglerie
  ('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Pose ongles', 'hand-left', '#F8B500'),
  ('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Manucure', 'hand-left-outline', '#F8B500'),
  ('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'Pédicure', 'footsteps', '#F8B500'),
  ('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 'Décorations', 'sparkles', '#F8B500'),
  
  -- Soins du visage
  ('660e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440004', 'Nettoyage de peau', 'water', '#4ECDC4'),
  ('660e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440004', 'Soin anti-âge', 'time', '#4ECDC4'),
  ('660e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440004', 'Soin hydratant', 'rainy', '#4ECDC4'),
  
  -- Épilation
  ('660e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440005', 'Épilation jambes', 'remove-circle', '#95E1D3'),
  ('660e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440005', 'Épilation aisselles', 'remove-circle-outline', '#95E1D3'),
  ('660e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440005', 'Épilation maillot', 'remove-circle', '#95E1D3'),
  
  -- Massage
  ('660e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440006', 'Massage relaxant', 'fitness', '#A8E6CF'),
  ('660e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440006', 'Massage sportif', 'barbell', '#A8E6CF'),
  ('660e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440006', 'Massage visage', 'sparkles', '#A8E6CF')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. INSERTION DES PRESTATAIRES
-- ============================================

-- Note: Les emails doivent être uniques. Les mots de passe sont hashés.
-- Pour les tests, on utilise des emails fictifs mais valides.

INSERT INTO users (
  id, email, phone, password_hash, is_provider, verified,
  first_name, last_name, age, city, neighborhood, activity_zone,
  latitude, longitude, main_skills, description, experience_years,
  experience_level, instagram, tiktok, subscription_type, is_premium,
  accepts_emergency
) VALUES
  -- Prestataire 1: Coiffeuse
  (
    '770e8400-e29b-41d4-a716-446655440001',
    'sophie.martin@beauty.com',
    '+33612345678',
    '$2a$10$dummyhash1', -- Hash bcrypt (en production, utilisez Supabase Auth)
    true,
    true,
    'Sophie',
    'Martin',
    32,
    'Paris',
    '15e arrondissement',
    'Paris 15e, Paris 14e, Paris 16e',
    48.8422,
    2.3219,
    ARRAY['Coupe femme', 'Coloration', 'Mèches', 'Brushing'],
    'Coiffeuse professionnelle avec 8 ans d''expérience. Spécialisée dans les coupes modernes et les colorations tendance. Je me déplace à domicile dans le 15e arrondissement et alentours.',
    8,
    'expert',
    '@sophie_coiffure',
    '@sophie_beauty',
    'premium',
    true,
    true
  ),
  
  -- Prestataire 2: Maquilleuse
  (
    '770e8400-e29b-41d4-a716-446655440002',
    'marie.dupont@makeup.com',
    '+33623456789',
    '$2a$10$dummyhash2',
    true,
    true,
    'Marie',
    'Dupont',
    28,
    'Paris',
    '11e arrondissement',
    'Paris 11e, Paris 10e, Paris 20e',
    48.8630,
    2.3700,
    ARRAY['Maquillage jour', 'Maquillage soirée', 'Maquillage mariage'],
    'Maquilleuse professionnelle certifiée. Je propose des services de maquillage pour tous les événements : mariages, soirées, shootings photo. Expertise en maquillage naturel et glamour.',
    5,
    'expert',
    '@marie_makeup',
    '@marie_beauty',
    'premium',
    true,
    false
  ),
  
  -- Prestataire 3: Prothésiste ongulaire
  (
    '770e8400-e29b-41d4-a716-446655440003',
    'laura.bernard@nails.com',
    '+33634567890',
    '$2a$10$dummyhash3',
    true,
    true,
    'Laura',
    'Bernard',
    26,
    'Paris',
    '17e arrondissement',
    'Paris 17e, Paris 8e, Paris 9e',
    48.8847,
    2.3219,
    ARRAY['Pose ongles', 'Manucure', 'Pédicure', 'Décorations'],
    'Prothésiste ongulaire spécialisée en pose de gel, résine et ongles en acrylique. Je crée des designs uniques et personnalisés. Service à domicile disponible.',
    4,
    'intermediate',
    '@laura_nails',
    '@laura_nailart',
    'free',
    false,
    true
  ),
  
  -- Prestataire 4: Esthéticienne
  (
    '770e8400-e29b-41d4-a716-446655440004',
    'claire.leroy@skincare.com',
    '+33645678901',
    '$2a$10$dummyhash4',
    true,
    true,
    'Claire',
    'Leroy',
    35,
    'Paris',
    '6e arrondissement',
    'Paris 6e, Paris 5e, Paris 7e',
    48.8506,
    2.3322,
    ARRAY['Nettoyage de peau', 'Soin anti-âge', 'Soin hydratant'],
    'Esthéticienne diplômée avec 10 ans d''expérience. Spécialisée dans les soins du visage et l''anti-âge. J''utilise des produits naturels et bio de qualité.',
    10,
    'expert',
    '@claire_skincare',
    NULL,
    'premium',
    true,
    false
  ),
  
  -- Prestataire 5: Épilatrice
  (
    '770e8400-e29b-41d4-a716-446655440005',
    'julie.moreau@epilation.com',
    '+33656789012',
    '$2a$10$dummyhash5',
    true,
    true,
    'Julie',
    'Moreau',
    30,
    'Paris',
    '13e arrondissement',
    'Paris 13e, Paris 12e, Paris 14e',
    48.8322,
    2.3561,
    ARRAY['Épilation jambes', 'Épilation aisselles', 'Épilation maillot'],
    'Épilatrice professionnelle certifiée. J''utilise la technique de l''épilation à la cire chaude et froide. Service rapide et efficace à domicile.',
    6,
    'intermediate',
    '@julie_epilation',
    NULL,
    'free',
    false,
    true
  ),
  
  -- Prestataire 6: Massothérapeute
  (
    '770e8400-e29b-41d4-a716-446655440006',
    'emilie.petit@massage.com',
    '+33667890123',
    '$2a$10$dummyhash6',
    true,
    true,
    'Émilie',
    'Petit',
    29,
    'Paris',
    '4e arrondissement',
    'Paris 4e, Paris 3e, Paris 1er',
    48.8566,
    2.3522,
    ARRAY['Massage relaxant', 'Massage sportif', 'Massage visage'],
    'Massothérapeute diplômée. Je propose des massages relaxants, sportifs et du visage. J''utilise des huiles essentielles bio. Service à domicile avec table de massage.',
    5,
    'intermediate',
    '@emilie_massage',
    '@emilie_wellness',
    'premium',
    true,
    false
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. INSERTION DES SERVICES
-- ============================================

INSERT INTO services (
  id, provider_id, category_id, subcategory_id,
  name, description, price, duration_minutes, level,
  is_custom, moderation_status, is_active
) VALUES
  -- Services de Sophie (Coiffeuse)
  (
    '880e8400-e29b-41d4-a716-446655440001',
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    'Coupe femme',
    'Coupe moderne et tendance adaptée à votre visage et à votre style de vie. Consultation personnalisée incluse.',
    45.00,
    60,
    'intermediate',
    false,
    'approved',
    true
  ),
  (
    '880e8400-e29b-41d4-a716-446655440002',
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440003',
    'Coloration complète',
    'Coloration complète avec produits professionnels. Consultation couleur incluse pour trouver la teinte parfaite.',
    85.00,
    120,
    'advanced',
    false,
    'approved',
    true
  ),
  (
    '880e8400-e29b-41d4-a716-446655440003',
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440004',
    'Brushing',
    'Brushing professionnel pour un résultat lisse et brillant. Idéal pour un événement ou au quotidien.',
    35.00,
    45,
    'beginner',
    false,
    'approved',
    true
  ),
  
  -- Services de Marie (Maquilleuse)
  (
    '880e8400-e29b-41d4-a716-446655440004',
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440006',
    'Maquillage jour naturel',
    'Maquillage naturel et frais pour le quotidien. Mise en beauté discrète et durable toute la journée.',
    50.00,
    60,
    'beginner',
    false,
    'approved',
    true
  ),
  (
    '880e8400-e29b-41d4-a716-446655440005',
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440007',
    'Maquillage soirée glamour',
    'Maquillage sophistiqué pour vos soirées. Smoky eyes, fard à paupières intense, lèvres maquillées. Parfait pour sortir en boîte ou dîner.',
    75.00,
    90,
    'advanced',
    false,
    'approved',
    true
  ),
  (
    '880e8400-e29b-41d4-a716-446655440006',
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440008',
    'Maquillage mariage',
    'Maquillage de mariée professionnel. Essai maquillage inclus. Produits longue tenue et résistants aux larmes. Parfait pour votre grand jour.',
    150.00,
    120,
    'pro',
    false,
    'approved',
    true
  ),
  
  -- Services de Laura (Onglerie)
  (
    '880e8400-e29b-41d4-a716-446655440007',
    '770e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440010',
    'Pose ongles gel',
    'Pose complète d''ongles en gel avec forme naturelle ou américaine. Design personnalisé inclus.',
    55.00,
    90,
    'intermediate',
    false,
    'approved',
    true
  ),
  (
    '880e8400-e29b-41d4-a716-446655440008',
    '770e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440011',
    'Manucure complète',
    'Manucure complète avec soin des cuticules, limage, pose de vernis classique ou semi-permanent.',
    35.00,
    45,
    'beginner',
    false,
    'approved',
    true
  ),
  (
    '880e8400-e29b-41d4-a716-446655440009',
    '770e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440013',
    'Décorations ongles',
    'Décorations artistiques sur ongles : nail art, strass, paillettes, motifs personnalisés.',
    20.00,
    30,
    'advanced',
    false,
    'approved',
    true
  ),
  
  -- Services de Claire (Soins du visage)
  (
    '880e8400-e29b-41d4-a716-446655440010',
    '770e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440004',
    '660e8400-e29b-41d4-a716-446655440014',
    'Nettoyage de peau profond',
    'Nettoyage de peau professionnel avec extraction des points noirs, masque purifiant et soin hydratant final.',
    70.00,
    75,
    'intermediate',
    false,
    'approved',
    true
  ),
  (
    '880e8400-e29b-41d4-a716-446655440011',
    '770e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440004',
    '660e8400-e29b-41d4-a716-446655440015',
    'Soin anti-âge',
    'Soin anti-âge complet avec produits à base de rétinol et peptides. Masque lifting et massage du visage inclus.',
    95.00,
    90,
    'advanced',
    false,
    'approved',
    true
  ),
  
  -- Services de Julie (Épilation)
  (
    '880e8400-e29b-41d4-a716-446655440012',
    '770e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440005',
    '660e8400-e29b-41d4-a716-446655440017',
    'Épilation jambes complètes',
    'Épilation à la cire chaude des deux jambes complètes. Soin apaisant post-épilation inclus.',
    45.00,
    60,
    'beginner',
    false,
    'approved',
    true
  ),
  (
    '880e8400-e29b-41d4-a716-446655440013',
    '770e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440005',
    '660e8400-e29b-41d4-a716-446655440019',
    'Épilation maillot',
    'Épilation maillot classique ou brésilienne à la cire chaude. Soin apaisant inclus.',
    35.00,
    30,
    'beginner',
    false,
    'approved',
    true
  ),
  
  -- Services d'Émilie (Massage)
  (
    '880e8400-e29b-41d4-a716-446655440014',
    '770e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440006',
    '660e8400-e29b-41d4-a716-446655440020',
    'Massage relaxant 1h',
    'Massage relaxant complet du corps avec huiles essentielles bio. Détente garantie pour évacuer le stress.',
    70.00,
    60,
    'intermediate',
    false,
    'approved',
    true
  ),
  (
    '880e8400-e29b-41d4-a716-446655440015',
    '770e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440006',
    '660e8400-e29b-41d4-a716-446655440021',
    'Massage sportif',
    'Massage sportif pour récupération musculaire. Techniques de drainage et décontracturant. Idéal après le sport.',
    80.00,
    60,
    'advanced',
    false,
    'approved',
    true
  ),
  (
    '880e8400-e29b-41d4-a716-446655440016',
    '770e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440006',
    '660e8400-e29b-41d4-a716-446655440022',
    'Massage du visage',
    'Massage du visage relaxant et anti-âge. Stimulation de la circulation sanguine et détente des muscles faciaux.',
    50.00,
    45,
    'beginner',
    false,
    'approved',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VÉRIFICATION DES DONNÉES INSÉRÉES
-- ============================================

-- Afficher le nombre de prestataires
SELECT COUNT(*) as nombre_prestataires FROM users WHERE is_provider = true;

-- Afficher le nombre de services actifs
SELECT COUNT(*) as nombre_services FROM services WHERE is_active = true;

-- Afficher les prestataires avec leurs services
SELECT 
  u.first_name || ' ' || u.last_name as prestataire,
  u.city,
  COUNT(s.id) as nombre_services
FROM users u
LEFT JOIN services s ON s.provider_id = u.id AND s.is_active = true
WHERE u.is_provider = true
GROUP BY u.id, u.first_name, u.last_name, u.city
ORDER BY nombre_services DESC;




