-- ============================================
-- SCRIPT DE CONFIGURATION DES RLS POLICIES POUR LES AVIS (REVIEWS)
-- Ce script configure les politiques de sécurité pour la table reviews
-- ============================================

-- Activer RLS sur la table reviews si ce n'est pas déjà fait
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Users can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Providers can view their reviews" ON public.reviews;

-- Politique 1: Les utilisateurs peuvent voir tous les avis (pour afficher les avis des prestataires)
CREATE POLICY "Users can view all reviews"
ON public.reviews
FOR SELECT
USING (true);

-- Politique 2: Les utilisateurs peuvent créer leurs propres avis
-- (uniquement pour leurs réservations)
CREATE POLICY "Users can create own reviews"
ON public.reviews
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = reviews.booking_id
    AND bookings.user_id = auth.uid()
  )
);

-- Politique 3: Les utilisateurs peuvent mettre à jour leurs propres avis
CREATE POLICY "Users can update own reviews"
ON public.reviews
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Politique 6: Les prestataires peuvent mettre à jour les réponses aux avis qui leur sont destinés
CREATE POLICY "Providers can update their review responses"
ON public.reviews
FOR UPDATE
USING (auth.uid() = provider_id)
WITH CHECK (
  auth.uid() = provider_id
  AND (
    -- Seulement les colonnes provider_response et provider_response_at peuvent être mises à jour
    (OLD.provider_response IS DISTINCT FROM NEW.provider_response)
    OR (OLD.provider_response_at IS DISTINCT FROM NEW.provider_response_at)
  )
);

-- Politique 4: Les utilisateurs peuvent supprimer leurs propres avis
CREATE POLICY "Users can delete own reviews"
ON public.reviews
FOR DELETE
USING (auth.uid() = user_id);

-- Politique 5: Les prestataires peuvent voir les avis qui leur sont destinés
-- (déjà couvert par la politique SELECT, mais on peut la laisser pour être explicite)
-- Cette politique est redondante mais peut être utile pour des cas spécifiques

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
WHERE tablename = 'reviews'
ORDER BY policyname;

