# 📦 Guide : Créer le bucket Storage "avatars" dans Supabase

## ⚠️ IMPORTANT : Le bucket "avatars" n'existe pas encore

L'erreur `Bucket not found` indique que le bucket `avatars` n'a pas été créé dans votre projet Supabase.

## 🚀 Solution : Créer le bucket via l'interface Supabase

### Étape 1 : Accéder à Storage
1. Ouvrez votre projet Supabase
2. Dans le menu de gauche, cliquez sur **"Storage"**

### Étape 2 : Créer le bucket "avatars"
1. Cliquez sur le bouton **"New bucket"** (ou "Créer un bucket")
2. Remplissez les informations :
   - **Name** : `avatars`
   - **Public bucket** : ✅ **OUI** (cochez cette case pour que les images soient accessibles publiquement)
   - **File size limit** : `5242880` (5 MB) ou laissez vide pour aucune limite
   - **Allowed MIME types** : `image/jpeg,image/png,image/webp` (optionnel, pour limiter les types de fichiers)

3. Cliquez sur **"Create bucket"** (ou "Créer")

### Étape 3 : Vérifier que le bucket est créé
Vous devriez voir le bucket `avatars` dans la liste des buckets.

## ✅ Après la création

Une fois le bucket créé, l'upload d'images de profil fonctionnera automatiquement !

## 📝 Note

Si vous voulez créer d'autres buckets pour les services, portfolio, etc., répétez l'opération avec :
- `service-images` (Public)
- `portfolio` (Public)
- `certificates` (Public ou Privé selon vos besoins)




