-- ============================================
-- SCRIPT DE DIAGNOSTIC ET CORRECTION DES PROFILS MANQUANTS
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ============================================

-- ÉTAPE 1: Vérifier les utilisateurs authentifiés sans profil dans public.users
SELECT 
  au.id as auth_user_id,
  au.email as auth_email,
  au.created_at as auth_created_at,
  CASE 
    WHEN pu.id IS NULL THEN 'PROFIL MANQUANT'
    ELSE 'Profil existe'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC;

-- ÉTAPE 2: Créer les profils manquants pour tous les utilisateurs authentifiés
-- Cette fonction crée automatiquement un profil pour chaque utilisateur auth sans profil
-- Gère les cas où l'email existe déjà mais avec un ID différent
INSERT INTO public.users (
  id,
  email,
  password_hash,
  is_provider,
  verified,
  first_name,
  last_name,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  '', -- password_hash vide car géré par Supabase Auth
  false, -- Par défaut, pas un prestataire
  COALESCE(au.email_confirmed_at IS NOT NULL, false), -- Vérifié si email confirmé
  NULL, -- first_name à remplir par l'utilisateur
  NULL, -- last_name à remplir par l'utilisateur
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
  -- Vérifier aussi qu'il n'y a pas déjà un profil avec cet email mais un ID différent
  AND NOT EXISTS (
    SELECT 1 FROM public.users pu2 
    WHERE pu2.email = au.email AND pu2.id != au.id
  )
ON CONFLICT (id) DO NOTHING;

-- ÉTAPE 2B: Gérer les cas où l'email existe déjà avec un ID différent
-- Mettre à jour l'ID du profil existant pour correspondre à l'ID auth
-- ATTENTION: Cette opération peut être risquée si plusieurs profils partagent le même email
-- On ne fait cela que si le profil existant n'a pas d'ID correspondant dans auth.users
UPDATE public.users pu
SET 
  id = au.id,
  email = au.email,
  verified = COALESCE(au.email_confirmed_at IS NOT NULL, false),
  updated_at = NOW()
FROM auth.users au
WHERE pu.email = au.email
  AND pu.id != au.id
  -- Vérifier que l'ancien ID n'existe pas dans auth.users (profil orphelin)
  AND NOT EXISTS (
    SELECT 1 FROM auth.users au2 WHERE au2.id = pu.id
  )
  -- Vérifier que le nouvel ID n'a pas déjà de profil
  AND NOT EXISTS (
    SELECT 1 FROM public.users pu2 WHERE pu2.id = au.id
  );

-- ÉTAPE 2C: Si la mise à jour a échoué à cause d'un conflit, supprimer les profils orphelins
-- (profils avec un email qui existe dans auth.users mais avec un ID différent)
DELETE FROM public.users pu
WHERE EXISTS (
  SELECT 1 FROM auth.users au 
  WHERE au.email = pu.email 
    AND au.id != pu.id
)
AND NOT EXISTS (
  SELECT 1 FROM auth.users au2 
  WHERE au2.id = pu.id
);

-- ÉTAPE 2D: Réessayer la création après nettoyage
INSERT INTO public.users (
  id,
  email,
  password_hash,
  is_provider,
  verified,
  first_name,
  last_name,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  '',
  false,
  COALESCE(au.email_confirmed_at IS NOT NULL, false),
  NULL,
  NULL,
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ÉTAPE 3: Vérifier que tous les profils ont été créés
SELECT 
  COUNT(*) as total_auth_users,
  COUNT(pu.id) as total_profiles,
  COUNT(*) - COUNT(pu.id) as missing_profiles
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id;

-- ÉTAPE 4: S'assurer que RLS est activé et les politiques sont correctes
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Créer les politiques RLS
CREATE POLICY "Users can insert own profile" 
ON public.users
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile" 
ON public.users
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.users
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ÉTAPE 5: Vérifier les politiques créées
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd, 
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- ÉTAPE 6: Vérifier que le trigger existe et fonctionne
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- RÉSULTAT ATTENDU:
-- ============================================
-- Après l'exécution de ce script:
-- 1. Tous les utilisateurs authentifiés auront un profil dans public.users
-- 2. Les politiques RLS seront correctement configurées
-- 3. Les utilisateurs pourront mettre à jour leur propre profil
-- ============================================

