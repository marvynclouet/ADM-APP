# 🔑 Correction de l'erreur "Forbidden use of secret API key"

## ❌ Erreur actuelle

```
AuthApiError: Forbidden use of secret API key in browser
```

**Cause :** Vous utilisez la **clé secrète (service_role)** au lieu de la **clé anonyme (anon)** dans votre fichier `.env`.

## ✅ Solution

### Étape 1 : Trouver la bonne clé dans Supabase

1. **Allez sur https://supabase.com**
2. **Ouvrez votre projet**
3. **Allez dans Settings → API**
4. **Trouvez la section "Project API keys"**

Vous verrez deux clés :

- **`anon` `public`** ← ✅ **C'EST CELLE-CI QU'IL FAUT UTILISER**
- **`service_role` `secret`** ← ❌ **NE JAMAIS UTILISER DANS LE FRONTEND**

### Étape 2 : Mettre à jour votre fichier .env

Ouvrez votre fichier `.env` à la racine de `BeautyBookingApp` et vérifiez :

```env
# ✅ CORRECT - Clé anonyme (commence souvent par "eyJ...")
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ❌ INCORRECT - Clé secrète (commence souvent par "sb_secret_...")
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_secret_7nsjvCmjpJ...
```

### Étape 3 : Vérifier votre clé

**La clé anonyme :**
- ✅ Commence généralement par `eyJ` (JWT)
- ✅ Est marquée comme `anon` `public` dans Supabase
- ✅ Peut être utilisée dans le navigateur/app mobile

**La clé secrète :**
- ❌ Commence souvent par `sb_secret_`
- ❌ Est marquée comme `service_role` `secret`
- ❌ **NE DOIT JAMAIS** être utilisée dans le frontend
- ❌ Est réservée aux serveurs backend uniquement

### Étape 4 : Redémarrer l'application

Après avoir corrigé le fichier `.env` :

1. **Arrêtez le serveur** (Ctrl+C)
2. **Redémarrez** :
   ```bash
   npx expo start --clear
   ```

## 🔒 Sécurité

**IMPORTANT :**
- La clé **anon** est publique et peut être exposée dans le code frontend
- La clé **service_role** est secrète et ne doit JAMAIS être dans le frontend
- Si vous avez accidentellement exposé la clé secrète, **régénérez-la** dans Supabase :
  - Settings → API → Regenerate service_role key

## ✅ Vérification

Après correction, vous devriez pouvoir :
- ✅ Vous inscrire
- ✅ Vous connecter
- ✅ Utiliser toutes les fonctionnalités Supabase

Si l'erreur persiste, vérifiez que :
1. Le fichier `.env` est bien à la racine de `BeautyBookingApp`
2. La variable s'appelle bien `EXPO_PUBLIC_SUPABASE_ANON_KEY` (avec `EXPO_PUBLIC_` au début)
3. Vous avez redémarré le serveur après modification






