-- ============================================
-- SCRIPT DE CORRECTION DES POLITIQUES RLS POUR LES PROVIDERS
-- Ce script permet de voir les providers depuis les services
-- ============================================

-- PROBLÈME IDENTIFIÉ:
-- Les services ont des provider_id valides, mais la jointure Supabase
-- ne retourne pas les providers car les RLS policies bloquent l'accès
-- aux utilisateurs qui ne sont pas l'utilisateur connecté.

-- SOLUTION:
-- Ajouter une politique RLS qui permet de voir les providers (is_provider = true)
-- lors des jointures depuis les services.

-- ÉTAPE 1: Supprimer l'ancienne politique SELECT si elle existe
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;

-- ÉTAPE 2: Créer une nouvelle politique SELECT qui permet de voir:
-- - Son propre profil (auth.uid() = id)
-- - Les providers (is_provider = true) pour les jointures depuis services
CREATE POLICY "Users can view own profile" 
ON public.users
FOR SELECT 
USING (
  -- Permettre de voir son propre profil
  auth.uid() = id
  OR
  -- Permettre de voir les providers (pour les jointures depuis services)
  (is_provider = true)
);

-- ÉTAPE 2: Vérifier que la politique a été créée
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- ============================================
-- NOTES IMPORTANTES:
-- ============================================
-- 1. Cette politique permet à tous les utilisateurs authentifiés de voir
--    les profils des providers (is_provider = true)
-- 2. Les utilisateurs peuvent toujours voir leur propre profil (auth.uid() = id)
-- 3. Cette politique est nécessaire pour que les jointures Supabase fonctionnent
--    lors de la récupération des services avec leurs providers
-- 4. Si vous voulez restreindre davantage, vous pouvez ajouter des conditions
--    supplémentaires (ex: seulement les providers actifs, seulement certains champs, etc.)
-- ============================================

