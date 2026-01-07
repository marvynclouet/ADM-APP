# 🏗️ Architecture Backend - ADM App

## 📊 Vue d'ensemble

**Le backend est entièrement géré par Supabase** - Pas besoin de serveur séparé !

```
┌─────────────────────────────────────────────────┐
│           Application React Native               │
│              (Frontend Mobile/Web)                │
└──────────────────┬──────────────────────────────┘
                   │
                   │ API Calls (HTTP/REST)
                   │
┌──────────────────▼──────────────────────────────┐
│              SUPABASE CLOUD                      │
│  ┌──────────────────────────────────────────┐   │
│  │  PostgreSQL Database (Base de données)   │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  PostgREST (API REST automatique)        │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  Supabase Auth (Authentification)        │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  Storage (Fichiers/images)               │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  Realtime (WebSockets - optionnel)       │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## 🔧 Technologies

### Backend = Supabase (Tout-en-un)

**Supabase fournit :**

1. **PostgreSQL** - Base de données relationnelle
   - Tables, relations, contraintes
   - Index pour performances
   - Row Level Security (RLS)

2. **PostgREST** - API REST automatique
   - Génère automatiquement des endpoints REST
   - Basé sur votre schéma SQL
   - Pas besoin de code backend supplémentaire

3. **Supabase Auth** - Authentification
   - Inscription/Connexion
   - JWT tokens
   - OAuth (Google, Facebook, etc.)
   - Gestion des sessions

4. **Storage** - Stockage de fichiers
   - Upload d'images
   - Avatars, portfolios, certificats
   - CDN intégré

5. **Realtime** - WebSockets (optionnel)
   - Messages en temps réel
   - Notifications push

## 📁 Structure du Code

```
backend/
├── supabase/
│   ├── schema.sql          # Schéma SQL (tables, RLS, triggers)
│   └── config.ts           # Client Supabase (frontend)
├── services/
│   ├── auth.service.ts     # Appels à Supabase Auth
│   ├── users.service.ts    # Appels à la table users
│   ├── services.service.ts # Appels à la table services
│   └── bookings.service.ts # Appels à la table bookings
└── README.md
```

## 🔄 Flux de Données

### Exemple : Récupérer les services

```typescript
// 1. Dans votre app React Native
import { ServicesService } from './backend/services/services.service';

// 2. Appel du service
const services = await ServicesService.getServices({
  categoryId: 'xxx',
  limit: 20,
});

// 3. Le service utilise le client Supabase
// (dans services.service.ts)
const { data } = await supabase
  .from('services')
  .select('*')
  .eq('category_id', categoryId)
  .limit(20);

// 4. Supabase PostgREST génère automatiquement :
// GET https://xxx.supabase.co/rest/v1/services?category_id=eq.xxx&limit=20

// 5. PostgreSQL exécute la requête et retourne les données

// 6. Les données reviennent à votre app
```

## 🚀 Pas de Serveur à Gérer !

**Avantages :**
- ✅ Pas de serveur Node.js/Express à maintenir
- ✅ Pas de déploiement de serveur
- ✅ Scaling automatique
- ✅ Sécurité gérée par Supabase
- ✅ API REST générée automatiquement
- ✅ Base de données managée

**Le "backend" est en fait :**
- Le schéma SQL (définit la structure)
- Les services TypeScript (appels à Supabase)
- Supabase (fait tout le reste)

## 💰 Coûts

**Gratuit (Free Tier) :**
- 500 MB base de données
- 1 GB storage
- 2 GB bande passante/mois
- 50 000 utilisateurs actifs/mois

**Payant (Pro - $25/mois) :**
- 8 GB base de données
- 100 GB storage
- 250 GB bande passante/mois
- Illimité utilisateurs

## 🔒 Sécurité

- **Row Level Security (RLS)** : Contrôle d'accès au niveau des lignes
- **Politiques SQL** : Définies dans le schéma
- **JWT Tokens** : Authentification sécurisée
- **HTTPS** : Toutes les communications sont cryptées

## 📝 Résumé

**Question : "La BDD est en Supabase mais le backend est en quoi ?"**

**Réponse : Le backend EST Supabase !**

- Base de données : PostgreSQL (Supabase)
- API : PostgREST (Supabase - automatique)
- Auth : Supabase Auth
- Storage : Supabase Storage
- Code : Services TypeScript qui appellent Supabase

**Pas besoin de serveur séparé** - Supabase fait tout ! 🎉







