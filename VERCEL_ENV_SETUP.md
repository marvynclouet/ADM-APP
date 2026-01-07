# 🔐 Configuration des Variables d'Environnement sur Vercel

## ⚠️ Problème : Écran blanc après déploiement

Si vous voyez un écran blanc avec l'erreur :
```
⚠️ Variables Supabase manquantes
Uncaught Error: supabaseUrl is required
```

C'est parce que les variables d'environnement Supabase ne sont pas configurées sur Vercel.

## ✅ Solution : Ajouter les Variables d'Environnement

### Étape 1 : Récupérer vos clés Supabase

1. Allez sur https://supabase.com
2. Ouvrez votre projet
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (la clé longue qui commence par `eyJ...`)

### Étape 2 : Ajouter les Variables dans Vercel

#### Option A : Via l'Interface Web (Recommandé)

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **ADM-APP** (ou le nom de votre projet)
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables suivantes :

**Variable 1 :**
- **Name** : `EXPO_PUBLIC_SUPABASE_URL`
- **Value** : `https://xxxxx.supabase.co` (votre Project URL)
- **Environments** : ✅ Production, ✅ Preview, ✅ Development

**Variable 2 :**
- **Name** : `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Value** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (votre clé anon)
- **Environments** : ✅ Production, ✅ Preview, ✅ Development

**Variable 3 (Optionnel) :**
- **Name** : `EXPO_PUBLIC_APP_URL`
- **Value** : `https://votre-projet.vercel.app` (votre URL Vercel)
- **Environments** : ✅ Production, ✅ Preview, ✅ Development

5. Cliquez sur **Save** pour chaque variable

#### Option B : Via Vercel CLI

```bash
# Se connecter à Vercel
vercel login

# Ajouter les variables d'environnement
vercel env add EXPO_PUBLIC_SUPABASE_URL production
# Collez votre Project URL quand demandé

vercel env add EXPO_PUBLIC_SUPABASE_ANON_KEY production
# Collez votre clé anon quand demandé

vercel env add EXPO_PUBLIC_APP_URL production
# Collez votre URL Vercel quand demandé
```

### Étape 3 : Redéployer

Après avoir ajouté les variables :

1. **Via l'interface Vercel** :
   - Allez dans **Deployments**
   - Cliquez sur les **3 points** (⋯) du dernier déploiement
   - Sélectionnez **Redeploy**
   - ✅ Cochez **Use existing Build Cache** (optionnel)
   - Cliquez sur **Redeploy**

2. **Via Git** :
   ```bash
   # Faire un petit changement et push
   git commit --allow-empty -m "chore: trigger redeploy with env vars"
   git push origin main
   ```

3. **Via CLI** :
   ```bash
   vercel --prod
   ```

### Étape 4 : Vérifier

Après le redéploiement :
1. Attendez 2-3 minutes ⏳
2. Rafraîchissez votre site Vercel
3. L'écran blanc devrait disparaître et l'app devrait fonctionner ! ✅

## 🔍 Vérification des Variables

Pour vérifier que les variables sont bien configurées :

1. Allez dans **Settings** → **Environment Variables**
2. Vous devriez voir :
   - ✅ `EXPO_PUBLIC_SUPABASE_URL`
   - ✅ `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - ✅ `EXPO_PUBLIC_APP_URL` (optionnel)

## ⚠️ Important

- **Ne jamais** mettre la clé `service_role` (secrète) dans les variables d'environnement frontend
- Utilisez uniquement la clé **anon** (publique) pour le frontend
- Les variables doivent commencer par `EXPO_PUBLIC_` pour être accessibles dans Expo/React Native

## 🐛 Dépannage

### Problème : Les variables ne sont pas prises en compte

**Solution** :
1. Vérifiez que les variables sont bien ajoutées dans **Production**
2. Redéployez complètement (sans cache)
3. Vérifiez l'orthographe exacte : `EXPO_PUBLIC_SUPABASE_URL` (avec underscores)

### Problème : Toujours un écran blanc

**Solution** :
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs dans la console
3. Vérifiez que les variables sont bien chargées :
   ```javascript
   console.log(process.env.EXPO_PUBLIC_SUPABASE_URL)
   ```

### Problème : Erreur CORS

**Solution** :
1. Vérifiez que votre URL Vercel est ajoutée dans Supabase :
   - Allez dans **Settings** → **API** → **CORS**
   - Ajoutez votre URL Vercel (ex: `https://adm-app.vercel.app`)

## ✅ C'est tout !

Une fois les variables configurées et le redéploiement effectué, votre application devrait fonctionner correctement sur Vercel ! 🚀

