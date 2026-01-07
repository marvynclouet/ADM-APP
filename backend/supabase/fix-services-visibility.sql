-- ============================================
-- SCRIPT DE VÉRIFICATION ET CORRECTION DES SERVICES
-- Ce script vérifie et corrige les services pour qu'ils soient visibles côté client
-- ============================================

-- 1. Vérifier les services qui ne sont pas visibles côté client
-- Conditions pour être visible : is_active = true ET moderation_status = 'approved' ET subcategory_id IS NOT NULL
SELECT 
  id,
  name,
  provider_id,
  category_id,
  subcategory_id,
  is_active,
  moderation_status,
  is_custom,
  CASE 
    WHEN is_active = FALSE THEN 'Service inactif'
    WHEN moderation_status != 'approved' THEN 'Service non approuvé'
    WHEN subcategory_id IS NULL THEN 'Sous-catégorie manquante'
    ELSE 'Service visible'
  END as status_visibility
FROM public.services
WHERE 
  is_active = FALSE 
  OR moderation_status != 'approved'
  OR subcategory_id IS NULL
ORDER BY created_at DESC;

-- 2. Corriger les services standards (non personnalisés) qui sont actifs mais non approuvés
-- Les services standards doivent être automatiquement approuvés
UPDATE public.services
SET 
  moderation_status = 'approved',
  moderated_at = NOW()
WHERE 
  is_active = TRUE 
  AND is_custom = FALSE 
  AND moderation_status != 'approved';

-- 2b. Approuver les services personnalisés actifs qui ont une sous-catégorie
-- (Optionnel : pour le développement, on peut approuver automatiquement les services personnalisés)
-- Décommentez la section ci-dessous si vous voulez approuver automatiquement les services personnalisés
/*
UPDATE public.services
SET 
  moderation_status = 'approved',
  moderated_at = NOW()
WHERE 
  is_active = TRUE 
  AND is_custom = TRUE 
  AND subcategory_id IS NOT NULL
  AND moderation_status = 'pending';
*/

-- 3. Afficher un avertissement pour les services actifs sans sous-catégorie
-- Ces services ne seront pas visibles côté client
SELECT 
  id,
  name,
  provider_id,
  category_id,
  subcategory_id,
  is_active,
  moderation_status
FROM public.services
WHERE 
  is_active = TRUE 
  AND moderation_status = 'approved'
  AND subcategory_id IS NULL
ORDER BY created_at DESC;

-- 4. Vérifier les services visibles (devraient être visibles côté client)
SELECT 
  COUNT(*) as total_services_visibles,
  COUNT(DISTINCT provider_id) as nombre_prestataires,
  COUNT(DISTINCT category_id) as nombre_categories
FROM public.services
WHERE 
  is_active = TRUE 
  AND moderation_status = 'approved'
  AND subcategory_id IS NOT NULL;

-- 5. Afficher un résumé par catégorie
SELECT 
  c.name as categorie,
  COUNT(s.id) as nombre_services_visibles
FROM public.services s
JOIN public.service_categories c ON s.category_id = c.id
WHERE 
  s.is_active = TRUE 
  AND s.moderation_status = 'approved'
  AND s.subcategory_id IS NOT NULL
GROUP BY c.id, c.name
ORDER BY nombre_services_visibles DESC;

