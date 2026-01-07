-- ============================================
-- SCRIPT DE CONFIGURATION DES RLS POLICIES POUR PREMIUM ET URGENCES
-- Ce script configure les politiques de sécurité pour permettre aux prestataires
-- de modifier leur statut premium et emergency
-- ============================================

-- Activer RLS sur la table users si ce n'est pas déjà fait
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Providers can update own premium status" ON public.users;
DROP POLICY IF EXISTS "Providers can update own emergency status" ON public.users;
DROP POLICY IF EXISTS "Providers can update own profile" ON public.users;

-- Politique simple: Les prestataires peuvent mettre à jour leur propre profil
-- Cela inclut is_premium, subscription_type, accepts_emergency, emergency_credits
-- La logique métier (ex: accepts_emergency nécessite is_premium) est gérée dans l'application
CREATE POLICY "Providers can update own profile" ON public.users
FOR UPDATE
USING (
  auth.uid() = id 
  AND is_provider = TRUE
)
WITH CHECK (
  auth.uid() = id 
  AND is_provider = TRUE
);

-- Vérification: Afficher les politiques créées
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users'
AND (policyname LIKE '%premium%' OR policyname LIKE '%emergency%' OR policyname LIKE '%profile%')
ORDER BY policyname;

