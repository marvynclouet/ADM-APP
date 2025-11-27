# 🚀 Guide de Démarrage Rapide - Backend Supabase

## ⚡ Configuration en 5 minutes

### Étape 1 : Créer un projet Supabase (2 min)

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"** (gratuit)
3. Connectez-vous avec GitHub
4. Créez un nouveau projet :
   - **Nom** : `adm-app` (ou autre)
   - **Mot de passe** : Choisissez un mot de passe fort
   - **Région** : Choisissez la plus proche (ex: `West EU` pour l'Europe)
5. Attendez 2 minutes que le projet soit créé ✅

### Étape 2 : Récupérer les clés (1 min)

1. Dans votre projet Supabase, allez dans **Settings** → **API**
2. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (la clé longue)

### Étape 3 : Configurer l'application (1 min)

1. Dans `BeautyBookingApp`, créez un fichier `.env` :
```bash
cd BeautyBookingApp
cp env.example .env
```

2. Ouvrez `.env` et remplissez :
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anonyme
EXPO_PUBLIC_APP_URL=http://localhost:8081
```

### Étape 4 : Créer la base de données (1 min)

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur **"New query"**
3. Copiez-collez tout le contenu de `backend/supabase/schema.sql`
4. Cliquez sur **"Run"** (ou `Cmd/Ctrl + Enter`)
5. ✅ Votre base de données est créée !

### Étape 5 : Configurer le Storage (optionnel, 1 min)

Pour les images (avatars, services, portfolio) :

1. Dans Supabase, allez dans **Storage**
2. Créez ces buckets (cliquez sur **"New bucket"**) :
   - `avatars` → **Public** ✅
   - `service-images` → **Public** ✅
   - `portfolio` → **Public** ✅
   - `certificates` → **Public** ✅

## ✅ C'est prêt !

Votre backend est maintenant configuré. Vous pouvez utiliser les services :

```typescript
import { AuthService } from './backend/services/auth.service';
import { ServicesService } from './backend/services/services.service';

// Exemple : Inscription
const { user } = await AuthService.signUp({
  email: 'test@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
});
```

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. Dans Supabase → **Table Editor**, vous devriez voir toutes vos tables
2. Dans votre app, testez une connexion :
```typescript
const user = await AuthService.getCurrentUser();
console.log('User:', user);
```

## 📚 Documentation

- [Documentation Supabase](https://supabase.com/docs)
- [Guide complet](./README.md)
- [Schéma SQL](./supabase/schema.sql)

## 💡 Astuces

- **Gratuit jusqu'à 500 MB** de base de données
- **Pas de serveur à gérer** - tout est dans le cloud
- **Évolutif** - passez au plan payant si besoin
- **Sécurisé** - Row Level Security activé par défaut

## 🆘 Problèmes courants

**Erreur "Invalid API key"**
→ Vérifiez que vos variables `.env` sont correctes

**Erreur "Table doesn't exist"**
→ Vérifiez que vous avez bien exécuté le `schema.sql`

**Erreur "Permission denied"**
→ Vérifiez les politiques RLS dans Supabase → Authentication → Policies

