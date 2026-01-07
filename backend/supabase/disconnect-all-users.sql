-- ============================================
-- SCRIPT POUR DÉCONNECTER TOUS LES UTILISATEURS
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ============================================

-- ⚠️ ATTENTION : Ce script va déconnecter TOUS les utilisateurs actuellement connectés
-- Tous les utilisateurs devront se reconnecter après l'exécution de ce script

-- Méthode 1 : Supprimer toutes les sessions actives
-- Cette méthode supprime toutes les sessions de la table auth.sessions
DELETE FROM auth.sessions;

-- Méthode 2 : Invalider tous les refresh tokens
-- Cette méthode invalide tous les refresh tokens pour forcer la déconnexion
UPDATE auth.refresh_tokens
SET revoked = TRUE
WHERE revoked = FALSE;

-- Méthode 3 : Supprimer tous les refresh tokens (plus radical)
-- Décommentez cette ligne si vous voulez supprimer complètement tous les tokens
-- DELETE FROM auth.refresh_tokens;

-- Vérification : Compter les sessions restantes
SELECT 
  COUNT(*) as sessions_actives,
  COUNT(DISTINCT user_id) as utilisateurs_connectes
FROM auth.sessions
WHERE expires_at > NOW();

-- Vérification : Compter les refresh tokens actifs
SELECT 
  COUNT(*) as tokens_actifs
FROM auth.refresh_tokens
WHERE revoked = FALSE AND expires_at > NOW();

-- ============================================
-- NOTES IMPORTANTES:
-- ============================================
-- 1. Ce script déconnecte TOUS les utilisateurs, y compris vous-même
-- 2. Après l'exécution, tous les utilisateurs devront se reconnecter
-- 3. Les mots de passe et les comptes ne sont PAS affectés
-- 4. Seules les sessions actives sont supprimées/invalidées
-- 5. Pour déconnecter un utilisateur spécifique, utilisez :
--    DELETE FROM auth.sessions WHERE user_id = 'user-id-here';
-- ============================================

