-- ============================================
-- SCRIPT POUR CONFIGURER LES RLS POLICIES POUR LES FAVORIS
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ============================================

-- ÉTAPE 1: S'assurer que RLS est activé
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 2: Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can add own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can remove own favorites" ON public.favorites;

-- ÉTAPE 3: Créer la politique RLS pour SELECT (lecture)
-- Les utilisateurs peuvent voir leurs propres favoris
CREATE POLICY "Users can view own favorites" 
ON public.favorites
FOR SELECT 
USING (auth.uid() = user_id);

-- ÉTAPE 4: Créer la politique RLS pour INSERT (création)
-- Les utilisateurs peuvent ajouter leurs propres favoris
CREATE POLICY "Users can add own favorites" 
ON public.favorites
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- ÉTAPE 5: Créer la politique RLS pour DELETE (suppression)
-- Les utilisateurs peuvent supprimer leurs propres favoris
CREATE POLICY "Users can remove own favorites" 
ON public.favorites
FOR DELETE 
USING (auth.uid() = user_id);

-- ÉTAPE 6: Vérifier les politiques créées
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd, 
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'favorites'
ORDER BY policyname;

-- ============================================
-- NOTES IMPORTANTES:
-- ============================================
-- 1. Les utilisateurs peuvent uniquement voir, ajouter et supprimer leurs propres favoris
-- 2. La contrainte UNIQUE(user_id, provider_id) empêche les doublons
-- 3. Les favoris sont liés aux providers, pas directement aux services
--    (mais on peut utiliser category_id pour filtrer par catégorie de service)
-- ============================================




