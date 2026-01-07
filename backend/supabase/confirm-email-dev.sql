-- ============================================
-- SCRIPT POUR CONFIRMER LES EMAILS EN DÉVELOPPEMENT
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- Utile pour le développement quand la confirmation d'email est activée
-- ============================================

-- Confirmer l'email pour un utilisateur spécifique (remplacez l'email)
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE email = 'presta@gmail.com';

-- Vérifier que l'email a été confirmé
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at
FROM auth.users
WHERE email = 'presta@gmail.com';

-- ============================================
-- ALTERNATIVE: Confirmer tous les emails non confirmés (pour le développement uniquement)
-- ============================================
-- ATTENTION: Ne pas utiliser en production !
-- Décommentez les lignes ci-dessous pour confirmer automatiquement tous les emails non confirmés
-- UPDATE auth.users
-- SET 
--   email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
--   confirmed_at = COALESCE(confirmed_at, NOW())
-- WHERE email_confirmed_at IS NULL;


