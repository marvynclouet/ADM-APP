-- ============================================
-- SCRIPT POUR CRÉER LES BUCKETS DE STORAGE
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ============================================

-- Note: Les buckets doivent être créés via l'interface Supabase Storage
-- Ce script SQL ne peut pas créer les buckets directement
-- Mais vous pouvez utiliser l'API REST ou l'interface web

-- Pour créer les buckets via l'interface Supabase :
-- 1. Allez dans Storage dans votre projet Supabase
-- 2. Cliquez sur "New bucket"
-- 3. Créez les buckets suivants avec ces paramètres :

-- Bucket: avatars
-- Name: avatars
-- Public: ✅ OUI (pour que les images soient accessibles publiquement)
-- File size limit: 5 MB (ou plus selon vos besoins)
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- Bucket: service-images
-- Name: service-images
-- Public: ✅ OUI
-- File size limit: 10 MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- Bucket: portfolio
-- Name: portfolio
-- Public: ✅ OUI
-- File size limit: 10 MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- Bucket: certificates
-- Name: certificates
-- Public: ✅ OUI (ou NON si vous voulez les garder privés)
-- File size limit: 5 MB
-- Allowed MIME types: image/jpeg, image/png, application/pdf

-- ============================================
-- VÉRIFICATION DES BUCKETS EXISTANTS
-- ============================================

-- Cette requête vérifie si les buckets existent (nécessite les permissions admin)
SELECT 
  name,
  id,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name IN ('avatars', 'service-images', 'portfolio', 'certificates')
ORDER BY name;

-- ============================================
-- CRÉER LES POLITIQUES RLS POUR LE STORAGE
-- ============================================

-- Politique pour permettre l'upload d'avatars (utilisateurs authentifiés uniquement)
INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
SELECT 
  id,
  'Users can upload own avatar',
  '(bucket_id = ''avatars''::text) AND ((auth.uid())::text = (storage.foldername(name))[1])',
  '(bucket_id = ''avatars''::text) AND ((auth.uid())::text = (storage.foldername(name))[1])'
FROM storage.buckets
WHERE name = 'avatars'
ON CONFLICT DO NOTHING;

-- Politique pour permettre la lecture publique des avatars
INSERT INTO storage.policies (bucket_id, name, definition, check_expression)
SELECT 
  id,
  'Public avatar access',
  '(bucket_id = ''avatars''::text)',
  '(bucket_id = ''avatars''::text)'
FROM storage.buckets
WHERE name = 'avatars'
ON CONFLICT DO NOTHING;

-- ============================================
-- ALTERNATIVE : CRÉER LES BUCKETS VIA L'API
-- ============================================
-- Si vous avez accès à l'API Supabase avec les clés admin,
-- vous pouvez créer les buckets programmatiquement.
-- Sinon, utilisez l'interface web Supabase Storage.




