# 🚀 Démarrage du Backend Supabase

## ⚡ Démarrage Rapide (5 minutes)

Supabase est un service cloud - **pas besoin de démarrer un serveur local**. Il suffit de :

1. ✅ **Créer les tables dans Supabase** (une seule fois)
2. ✅ **Vérifier la connexion**

---

## 📋 Étape 1 : Créer les tables dans Supabase

### Option A : Via l'interface Supabase (Recommandé)

1. **Ouvrez votre projet Supabase**
   - Allez sur https://supabase.com
   - Connectez-vous et ouvrez votre projet

2. **Ouvrez l'éditeur SQL**
   - Cliquez sur **"SQL Editor"** dans le menu de gauche
   - Cliquez sur **"New query"**

3. **Copiez et exécutez le schéma**
   - Ouvrez le fichier : `backend/supabase/schema-clean.sql`
   - **Sélectionnez TOUT** (Cmd/Ctrl + A)
   - **Copiez** (Cmd/Ctrl + C)
   - **Collez** dans l'éditeur SQL de Supabase
   - **Cliquez sur "Run"** ou appuyez sur `Cmd/Ctrl + Enter`

4. **Vérifiez que les tables sont créées**
   - Allez dans **"Table Editor"** dans le menu
   - Vous devriez voir les tables : `users`, `services`, `bookings`, etc.

### Option B : Via Supabase CLI (Si installé)

```bash
# Installer Supabase CLI (si pas déjà fait)
npm install -g supabase

# Se connecter à votre projet
supabase link --project-ref votre-project-ref

# Exécuter le schéma
supabase db push
```

---

## ✅ Étape 2 : Vérifier la connexion

Une fois les tables créées, testez la connexion :

```bash
cd BeautyBookingApp
node backend/test-connection.js
```

Vous devriez voir :
```
✅ Connexion réussie!
📊 Test des tables...
   users: ✅ (0 enregistrements)
   services: ✅ (0 enregistrements)
   ...
```

---

## 🔧 Configuration des variables d'environnement

Assurez-vous que votre fichier `.env` contient :

```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anonyme
```

**Où trouver ces valeurs :**
1. Allez sur https://supabase.com
2. Ouvrez votre projet
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## 🧪 Tester l'authentification

Une fois les tables créées, vous pouvez tester :

### 1. Tester la connexion
```bash
node backend/test-connection.js
```

### 2. Tester dans l'app
- Lancez l'app : `npm start` ou `npx expo start`
- Essayez de vous inscrire
- Essayez de vous connecter

---

## 📊 Vérifier les données dans Supabase

1. Allez dans **"Table Editor"** dans Supabase
2. Sélectionnez la table `users`
3. Vous verrez les utilisateurs créés

---

## 🐛 Dépannage

### Erreur "table does not exist"
➡️ Les tables n'ont pas été créées. Exécutez le script SQL dans Supabase.

### Erreur "invalid API key"
➡️ Vérifiez vos variables d'environnement dans `.env`

### Erreur de connexion
➡️ Vérifiez que votre projet Supabase est actif et que l'URL est correcte

---

## ✅ Checklist de démarrage

- [ ] Variables d'environnement configurées (`.env`)
- [ ] Tables créées dans Supabase (via SQL Editor)
- [ ] Test de connexion réussi (`node backend/test-connection.js`)
- [ ] App peut se connecter à Supabase

---

## 🎯 Prochaines étapes

Une fois le backend prêt :
1. ✅ Testez l'inscription d'un utilisateur
2. ✅ Testez la connexion
3. ✅ Vérifiez la redirection automatique (prestataire/client)
4. ✅ Testez la création de services (pour prestataires)

---

**Note :** Supabase est un service cloud, donc il fonctionne 24/7. Pas besoin de le "démarrer" - il suffit de créer les tables une fois et c'est prêt !






