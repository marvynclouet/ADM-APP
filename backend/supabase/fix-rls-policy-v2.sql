-- ============================================
-- SOLUTION COMPLÈTE POUR RLS ET INSCRIPTION
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ============================================

-- SOLUTION 1: Créer une fonction avec SECURITY DEFINER pour insérer le profil
-- Cette fonction contourne RLS car elle s'exécute avec les privilèges du créateur
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_phone TEXT DEFAULT NULL,
  user_first_name TEXT DEFAULT NULL,
  user_last_name TEXT DEFAULT NULL,
  user_is_provider BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  INSERT INTO public.users (
    id,
    email,
    phone,
    first_name,
    last_name,
    is_provider,
    password_hash,
    verified
  )
  VALUES (
    user_id,
    user_email,
    user_phone,
    user_first_name,
    user_last_name,
    user_is_provider,
    '',
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    is_provider = EXCLUDED.is_provider;
  
  SELECT row_to_json(u.*)::JSONB INTO result
  FROM public.users u
  WHERE u.id = user_id;
  
  RETURN result;
END;
$$;

-- SOLUTION 2: Créer le trigger sur auth.users (table système Supabase)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, password_hash, is_provider, verified)
  VALUES (
    NEW.id,
    NEW.email,
    '',
    false,
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger sur auth.users (pas sur public.users!)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- SOLUTION 3: S'assurer que les politiques RLS sont correctes
-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Politique INSERT : permettre l'insertion si auth.uid() = id
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Politique SELECT : permettre de voir son propre profil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT 
  USING (auth.uid() = id);

-- Politique UPDATE : permettre de mettre à jour son propre profil
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Vérification : lister les politiques créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users';

