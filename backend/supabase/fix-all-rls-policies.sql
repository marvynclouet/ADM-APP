-- ============================================
-- SCRIPT COMPLET DE CORRECTION DES POLITIQUES RLS
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- Ce script corrige TOUTES les politiques RLS pour la table users
-- ============================================

-- ÉTAPE 1: Activer RLS sur la table users (si ce n'est pas déjà fait)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 2: Supprimer toutes les anciennes politiques pour repartir de zéro
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.users;

-- ÉTAPE 3: Créer la politique INSERT
-- Permet à un utilisateur de créer son propre profil lors de l'inscription
CREATE POLICY "Users can insert own profile" 
ON public.users
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- ÉTAPE 4: Créer la politique SELECT
-- Permet à un utilisateur de voir son propre profil
CREATE POLICY "Users can view own profile" 
ON public.users
FOR SELECT 
USING (auth.uid() = id);

-- ÉTAPE 5: Créer la politique UPDATE (CRITIQUE pour la mise à jour du profil)
-- USING : vérifie que l'utilisateur peut voir la ligne à mettre à jour
-- WITH CHECK : vérifie que l'utilisateur peut insérer la ligne mise à jour
CREATE POLICY "Users can update own profile" 
ON public.users
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ÉTAPE 6: Vérification - Lister toutes les politiques créées
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

-- ÉTAPE 7: Vérifier que RLS est bien activé
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'users' AND schemaname = 'public';

-- ============================================
-- NOTES IMPORTANTES:
-- ============================================
-- 1. Les politiques RLS s'appliquent uniquement aux utilisateurs authentifiés
-- 2. auth.uid() retourne l'ID de l'utilisateur actuellement connecté
-- 3. La politique UPDATE nécessite BOTH USING et WITH CHECK pour fonctionner correctement
-- 4. Si vous avez des erreurs après avoir exécuté ce script, vérifiez:
--    - Que vous êtes bien connecté en tant qu'utilisateur authentifié
--    - Que l'ID de l'utilisateur correspond bien à auth.uid()
--    - Que la table users existe et a bien la colonne 'id' de type UUID
-- ============================================




