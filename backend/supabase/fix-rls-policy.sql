-- ============================================
-- CORRECTION COMPLÈTE RLS POUR INSCRIPTION
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ============================================

-- 1. Créer un trigger pour créer automatiquement le profil
-- Cette approche est la plus robuste car elle contourne RLS avec SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, password_hash, is_provider, verified)
  VALUES (
    NEW.id,
    NEW.email,
    '', -- Supabase Auth gère le mot de passe
    false,
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger qui se déclenche après la création d'un utilisateur dans auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. Ajouter la politique INSERT (au cas où le trigger ne fonctionne pas)
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 3. S'assurer que la politique SELECT permet de voir son propre profil
DROP POLICY IF EXISTS "Users can view own profile" ON users;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT 
  USING (auth.uid() = id);

-- 4. S'assurer que la politique UPDATE permet de mettre à jour son propre profil
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE 
  USING (auth.uid() = id);

