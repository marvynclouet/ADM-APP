-- ============================================
-- SCRIPT POUR CORRIGER LES PROFILS AVEC EMAIL EN DOUBLE
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- Ce script gère le cas où un profil existe avec le même email mais un ID différent
-- ============================================

-- ÉTAPE 1: Identifier les conflits (email existe dans auth.users mais profil a un ID différent)
SELECT 
  au.id as auth_user_id,
  au.email as auth_email,
  pu.id as profile_id,
  pu.email as profile_email,
  CASE 
    WHEN pu.id IS NULL THEN 'PROFIL MANQUANT'
    WHEN pu.id != au.id THEN 'ID DIFFÉRENT - CONFLIT'
    ELSE 'OK'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON pu.email = au.email
WHERE pu.id IS NULL OR pu.id != au.id
ORDER BY au.created_at DESC;

-- ÉTAPE 2: Supprimer les profils orphelins (profils avec email qui existe dans auth.users mais ID différent)
-- Ces profils sont probablement des doublons créés par erreur
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

-- ÉTAPE 3: Créer les profils manquants pour tous les utilisateurs authentifiés
-- Maintenant que les doublons sont supprimés, on peut créer les profils manquants
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
ON CONFLICT (id) DO NOTHING;

-- ÉTAPE 4: Vérifier que tous les profils ont été créés correctement
SELECT 
  COUNT(*) as total_auth_users,
  COUNT(pu.id) as total_profiles,
  COUNT(*) - COUNT(pu.id) as missing_profiles
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id;

-- ÉTAPE 5: Vérifier qu'il n'y a plus de conflits d'email
SELECT 
  pu.email,
  COUNT(*) as count_profiles,
  STRING_AGG(pu.id::text, ', ') as profile_ids
FROM public.users pu
GROUP BY pu.email
HAVING COUNT(*) > 1;

-- ÉTAPE 6: S'assurer que RLS est activé et les politiques sont correctes
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

-- ÉTAPE 7: Vérifier les politiques créées
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

-- ============================================
-- RÉSULTAT ATTENDU:
-- ============================================
-- Après l'exécution de ce script:
-- 1. Les profils avec email en double (ID différent) seront supprimés
-- 2. Tous les utilisateurs authentifiés auront un profil dans public.users avec le bon ID
-- 3. Les politiques RLS seront correctement configurées
-- 4. Les utilisateurs pourront mettre à jour leur propre profil
-- ============================================




