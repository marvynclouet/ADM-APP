-- ============================================
-- SCRIPT POUR APPROUVER LES SERVICES PERSONNALISÉS
-- Ce script approuve les services personnalisés actifs qui ont une sous-catégorie
-- ============================================

-- Approuver tous les services personnalisés actifs avec sous-catégorie
UPDATE public.services
SET 
  moderation_status = 'approved',
  moderated_at = NOW()
WHERE 
  is_active = TRUE 
  AND is_custom = TRUE 
  AND subcategory_id IS NOT NULL
  AND moderation_status = 'pending';

-- Vérifier les services approuvés
SELECT 
  id,
  name,
  provider_id,
  category_id,
  subcategory_id,
  is_active,
  moderation_status,
  is_custom,
  created_at
FROM public.services
WHERE 
  is_active = TRUE 
  AND moderation_status = 'approved'
  AND subcategory_id IS NOT NULL
ORDER BY created_at DESC;


