-- ============================================
-- CORRECTION DE LA POLITIQUE UPDATE POUR USERS
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ============================================

-- Supprimer l'ancienne politique UPDATE si elle existe
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Créer la politique UPDATE avec USING et WITH CHECK
-- USING : vérifie que l'utilisateur peut voir la ligne à mettre à jour
-- WITH CHECK : vérifie que l'utilisateur peut insérer la ligne mise à jour
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Vérification : lister les politiques pour la table users
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





