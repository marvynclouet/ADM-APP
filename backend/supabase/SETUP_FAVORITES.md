# Configuration des Favoris

Ce guide explique comment configurer la fonctionnalité de favoris dans l'application.

## Étape 1: Exécuter le script SQL pour les RLS Policies

1. Ouvrez le dashboard Supabase
2. Allez dans **SQL Editor**
3. Exécutez le script `fix-favorites-rls-policies.sql`

Ce script configure les politiques RLS (Row Level Security) pour permettre aux utilisateurs de :
- Voir leurs propres favoris
- Ajouter leurs propres favoris
- Supprimer leurs propres favoris

## Étape 2: Vérifier que la table `favorites` existe

La table `favorites` doit avoir la structure suivante :
- `id` (UUID, PRIMARY KEY)
- `user_id` (UUID, référence vers `users.id`)
- `provider_id` (UUID, référence vers `users.id`)
- `category_id` (UUID, optionnel, référence vers `service_categories.id`)
- `created_at` (TIMESTAMP)

Si la table n'existe pas, exécutez le script `schema.sql` qui contient la définition complète.

## Fonctionnalités

### Pour les Providers
Les utilisateurs peuvent ajouter des providers en favoris. Cela permet de :
- Retrouver facilement leurs providers préférés
- Filtrer les services par providers favoris

### Pour les Services
Les utilisateurs peuvent ajouter des services en favoris. Techniquement, cela ajoute le provider du service en favoris avec la catégorie du service. Cela permet de :
- Retrouver facilement des services spécifiques
- Filtrer par catégorie de service favorie

## Utilisation dans le code

### Hook `useFavorites`

```typescript
import { useFavorites } from '../hooks/useFavorites';

const { 
  favorites,           // Liste des IDs des providers favoris
  isLoading,          // État de chargement
  toggleFavorite,     // Toggle favoris pour un provider
  toggleServiceFavorite, // Toggle favoris pour un service
  isFavorite,         // Vérifier si un provider est en favoris
  refreshFavorites    // Recharger les favoris
} = useFavorites();
```

### Exemple d'utilisation

```typescript
// Ajouter un provider en favoris
await toggleFavorite(providerId, categoryId);

// Ajouter un service en favoris
await toggleServiceFavorite(serviceId, providerId, categoryId);

// Vérifier si un provider est en favoris
const isFav = isFavorite(providerId);
```

## Notes importantes

1. **Synchronisation** : Les favoris sont maintenant stockés dans Supabase, pas dans AsyncStorage. Ils sont synchronisés entre tous les appareils de l'utilisateur.

2. **Contrainte unique** : La table `favorites` a une contrainte `UNIQUE(user_id, provider_id)` qui empêche les doublons.

3. **RLS** : Les politiques RLS garantissent que les utilisateurs ne peuvent voir et modifier que leurs propres favoris.

4. **Services vs Providers** : Techniquement, les favoris sont liés aux providers. Quand on ajoute un service en favoris, on ajoute en réalité le provider du service. La catégorie du service est stockée dans `category_id` pour permettre un filtrage ultérieur.




