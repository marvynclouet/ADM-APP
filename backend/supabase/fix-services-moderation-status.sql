-- ============================================
-- SCRIPT DE CORRECTION DU STATUT DE MODÉRATION DES SERVICES
-- Ce script met à jour les services standards pour qu'ils soient approuvés
-- ============================================

-- PROBLÈME IDENTIFIÉ:
-- Les services créés par les prestataires peuvent avoir un mauvais statut de modération,
-- ce qui les empêche d'être visibles dans la recherche publique.

-- SOLUTION:
-- Mettre à jour tous les services standards (is_custom = false) qui sont actifs
-- pour qu'ils aient moderation_status = 'approved'

-- ÉTAPE 1: Voir les services qui ont un problème
SELECT 
  id,
  name,
  provider_id,
  is_custom,
  is_active,
  moderation_status,
  created_at
FROM services
WHERE is_custom = false 
  AND is_active = true
  AND moderation_status != 'approved'
ORDER BY created_at DESC;

-- ÉTAPE 2: Mettre à jour les services standards actifs pour qu'ils soient approuvés
UPDATE services
SET 
  moderation_status = 'approved',
  moderated_at = NOW()
WHERE is_custom = false 
  AND is_active = true
  AND moderation_status != 'approved';

-- ÉTAPE 3: Vérifier que la mise à jour a fonctionné
SELECT 
  COUNT(*) as total_services,
  COUNT(*) FILTER (WHERE is_custom = false AND is_active = true AND moderation_status = 'approved') as services_standards_approuves,
  COUNT(*) FILTER (WHERE is_custom = true AND moderation_status = 'pending') as services_personnalises_en_attente,
  COUNT(*) FILTER (WHERE is_active = false) as services_inactifs
FROM services;

-- ============================================
-- NOTES IMPORTANTES:
-- ============================================
-- 1. Ce script met à jour uniquement les services standards (is_custom = false)
--    qui sont actifs (is_active = true) pour qu'ils soient approuvés
-- 2. Les services personnalisés (is_custom = true) restent en attente de modération
-- 3. Les services inactifs ne sont pas modifiés
-- 4. Après l'exécution de ce script, les services standards devraient être
--    visibles dans la recherche publique


