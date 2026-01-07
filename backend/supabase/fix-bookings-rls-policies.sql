-- ============================================
-- SCRIPT POUR CONFIGURER LES RLS POLICIES POUR LES BOOKINGS
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ============================================

-- ÉTAPE 1: S'assurer que RLS est activé
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 2: Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Providers can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Providers can view own bookings" ON public.bookings;

-- ÉTAPE 3: Créer les politiques RLS pour SELECT (lecture)
-- Les utilisateurs peuvent voir leurs propres réservations
CREATE POLICY "Users can view own bookings" 
ON public.bookings
FOR SELECT 
USING (auth.uid() = user_id);

-- Les prestataires peuvent voir les réservations qui leur sont destinées
CREATE POLICY "Providers can view own bookings" 
ON public.bookings
FOR SELECT 
USING (auth.uid() = provider_id);

-- ÉTAPE 4: Créer la politique RLS pour INSERT (création)
-- Les utilisateurs peuvent créer leurs propres réservations
CREATE POLICY "Users can create own bookings" 
ON public.bookings
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- ÉTAPE 5: Créer la politique RLS pour UPDATE (mise à jour)
-- Les prestataires peuvent mettre à jour les réservations qui leur sont destinées
CREATE POLICY "Providers can update own bookings" 
ON public.bookings
FOR UPDATE 
USING (auth.uid() = provider_id)
WITH CHECK (auth.uid() = provider_id);

-- Les utilisateurs peuvent mettre à jour leurs propres réservations (pour annulation)
CREATE POLICY "Users can update own bookings" 
ON public.bookings
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ÉTAPE 6: Vérifier les politiques créées
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd, 
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'bookings'
ORDER BY policyname;

-- ============================================
-- RÉSULTAT ATTENDU:
-- ============================================
-- Après l'exécution de ce script:
-- 1. RLS est activé sur la table bookings
-- 2. Les utilisateurs peuvent voir et créer leurs propres réservations
-- 3. Les prestataires peuvent voir et mettre à jour les réservations qui leur sont destinées
-- 4. Les utilisateurs peuvent mettre à jour leurs propres réservations (pour annulation)
-- ============================================




