-- ============================================
-- CORRECTION COMPLÈTE POUR LA MISE À JOUR DU PROFIL
-- Copiez-collez ce script dans l'éditeur SQL de Supabase
-- ============================================

-- 1. Supprimer l'ancienne politique UPDATE si elle existe
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 2. Créer la politique UPDATE avec USING et WITH CHECK
-- USING : vérifie que l'utilisateur peut voir la ligne à mettre à jour
-- WITH CHECK : vérifie que l'utilisateur peut insérer la ligne mise à jour
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Vérification : lister toutes les politiques pour la table users
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
-- RÉSULTAT ATTENDU :
-- Vous devriez voir 3 politiques :
-- 1. "Users can insert own profile" (INSERT)
-- 2. "Users can update own profile" (UPDATE) - avec USING et WITH CHECK
-- 3. "Users can view own profile" (SELECT)
-- ============================================





