-- ============================================
-- SCRIPT POUR AJOUTER LA COLONNE provider_response À LA TABLE reviews
-- Ce script ajoute la possibilité pour les prestataires de répondre aux avis
-- ============================================

-- Ajouter la colonne provider_response si elle n'existe pas déjà
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS provider_response TEXT;

-- Ajouter une colonne pour la date de réponse
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS provider_response_at TIMESTAMP WITH TIME ZONE;

-- Ajouter un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reviews_provider_response ON public.reviews(provider_id, provider_response);

-- Vérifier la structure de la table
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'reviews'
AND table_schema = 'public'
ORDER BY ordinal_position;


