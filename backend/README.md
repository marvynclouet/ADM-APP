# 🚀 Backend ADM App - Supabase

Backend simple, efficace et peu cher utilisant Supabase (PostgreSQL + Auth + Storage).

## 📋 Structure

```
backend/
├── supabase/
│   ├── schema.sql          # Schéma de base de données
│   └── config.ts           # Configuration Supabase client
├── services/
│   ├── auth.service.ts     # Authentification
│   ├── users.service.ts    # Gestion utilisateurs
│   ├── services.service.ts # Gestion services
│   └── bookings.service.ts # Gestion réservations
└── README.md
```

## 🛠️ Installation

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Notez votre URL et votre clé anonyme (anon key)

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine de `BeautyBookingApp` :

```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anonyme
```

### 3. Installer les dépendances

```bash
cd BeautyBookingApp
npm install @supabase/supabase-js
```

### 4. Exécuter le schéma SQL

1. Allez dans votre projet Supabase
2. Ouvrez l'éditeur SQL
3. Copiez-collez le contenu de `backend/supabase/schema.sql`
4. Exécutez le script

### 5. Configurer le Storage (optionnel)

Pour les avatars et images :

1. Dans Supabase Dashboard → Storage
2. Créez un bucket `avatars` (public)
3. Créez un bucket `service-images` (public)
4. Créez un bucket `portfolio` (public)
5. Créez un bucket `certificates` (public)

## 📚 Utilisation

### Authentification

```typescript
import { AuthService } from './backend/services/auth.service';

// Inscription
const { user, session } = await AuthService.signUp({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  isProvider: false,
});

// Connexion
const { user, session } = await AuthService.signIn({
  email: 'user@example.com',
  password: 'password123',
});

// Déconnexion
await AuthService.signOut();
```

### Services

```typescript
import { ServicesService } from './backend/services/services.service';

// Récupérer les services
const services = await ServicesService.getServices({
  categoryId: 'xxx',
  searchQuery: 'coiffure',
  limit: 20,
});

// Créer un service
const service = await ServicesService.createService(providerId, {
  name: 'Coupe + Brushing',
  description: '...',
  price: 45,
  duration_minutes: 60,
  category_id: 'xxx',
});
```

### Réservations

```typescript
import { BookingsService } from './backend/services/bookings.service';

// Créer une réservation
const booking = await BookingsService.createBooking({
  userId: 'xxx',
  providerId: 'yyy',
  serviceId: 'zzz',
  bookingDate: '2024-01-15',
  bookingTime: '14:00',
  durationMinutes: 60,
  totalPrice: 45,
});

// Récupérer les réservations
const bookings = await BookingsService.getUserBookings(userId, {
  status: 'pending',
  upcoming: true,
});
```

## 🔒 Sécurité

- **Row Level Security (RLS)** : Activé sur toutes les tables
- **Politiques de sécurité** : Définies dans le schéma SQL
- **Authentification** : Gérée par Supabase Auth
- **Validation** : À ajouter côté client et serveur

## 💰 Coûts

**Gratuit jusqu'à :**
- 500 MB base de données
- 1 GB storage
- 2 GB bande passante/mois
- 50 000 utilisateurs actifs/mois

**Payant ensuite :**
- À partir de 25$/mois (Pro Plan)
- Évolutif selon les besoins

## 🚀 Déploiement

Le backend est déjà déployé avec Supabase (cloud). Aucun serveur à gérer !

Pour la production :
1. Créez un projet Supabase dédié
2. Configurez les variables d'environnement
3. Exécutez le schéma SQL
4. Testez les API

## 📝 Notes

- Les services sont simples et réutilisables
- Facile à maintenir et à étendre
- TypeScript pour la sécurité des types
- Documentation claire et concise

## 🔄 Prochaines étapes

- [ ] Ajouter les services pour reviews, favorites, messages
- [ ] Implémenter les notifications
- [ ] Ajouter la gestion des paiements (Stripe)
- [ ] Créer des fonctions Supabase pour la logique métier complexe

