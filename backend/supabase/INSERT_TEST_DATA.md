# Guide d'insertion des données de test

Ce script permet d'insérer des prestataires et leurs prestations dans la base de données Supabase pour tester l'application.

## 📋 Contenu du script

Le script `insert-test-data.sql` insère :

### 1. Catégories de services (6 catégories)
- Coiffure
- Maquillage
- Onglerie
- Soins du visage
- Épilation
- Massage

### 2. Sous-catégories (22 sous-catégories)
- Pour chaque catégorie, plusieurs sous-catégories spécifiques

### 3. Prestataires (6 prestataires)
- **Sophie Martin** - Coiffeuse (Paris 15e)
- **Marie Dupont** - Maquilleuse (Paris 11e)
- **Laura Bernard** - Prothésiste ongulaire (Paris 17e)
- **Claire Leroy** - Esthéticienne (Paris 6e)
- **Julie Moreau** - Épilatrice (Paris 13e)
- **Émilie Petit** - Massothérapeute (Paris 4e)

### 4. Services (16 services actifs)
- Chaque prestataire a plusieurs services associés
- Tous les services sont approuvés et actifs

## 🚀 Comment utiliser

### Étape 0 : Confirmer les emails (Développement uniquement)

Si vous rencontrez l'erreur "Email not confirmed" lors de la connexion, exécutez le script SQL suivant dans l'éditeur SQL de Supabase :

1. Ouvrez l'éditeur SQL de Supabase
2. Exécutez le script `confirm-email-dev.sql` pour confirmer l'email de votre compte de test

**Alternative :** Pour confirmer automatiquement tous les emails non confirmés (développement uniquement), décommentez la section dans le script SQL.

### Étape 1 : Créer les comptes prestataires (Recommandé)

**Option A : Script TypeScript (Recommandé)**

1. Assurez-vous d'avoir `SUPABASE_SERVICE_ROLE_KEY` dans votre fichier `.env`
2. Exécutez le script :

```bash
npx ts-node backend/scripts/create-test-providers.ts
```

Ce script crée les comptes dans Supabase Auth avec le mot de passe `Test1234!` pour tous les prestataires.

**Option B : Création manuelle via Supabase Auth**

1. Connectez-vous à votre projet Supabase
2. Allez dans **Authentication > Users**
3. Créez manuellement chaque compte avec les emails du script
4. Utilisez le mot de passe `Test1234!` pour tous

### Étape 2 : Insérer les catégories et sous-catégories (NOUVEAU - Structure complète)

**Important :** Exécutez d'abord ce script pour avoir la structure complète des catégories selon les spécifications.

1. Ouvrez l'éditeur SQL de Supabase
2. Exécutez le script `insert-categories-subcategories.sql`

Ce script insère :
- **8 catégories principales** :
  1. Beauté & Coiffure
  2. Maquillage & Esthétique
  3. Ongles & Cils
  4. Mode & Couture
  5. Accessoires & Chaussures
  6. Bien-être & Corps
  7. Cuisine & Événementiel
  8. Photo & Image

- **Toutes les sous-catégories** associées à chaque catégorie (plus de 50 sous-catégories au total)

**Note :** Ce script utilise `ON CONFLICT` pour éviter les doublons, vous pouvez l'exécuter plusieurs fois sans problème.

### Étape 3 : Insérer les données de test (prestataires, services)

**Option 1 : Via l'interface Supabase (Recommandé)**

1. Connectez-vous à votre projet Supabase : https://supabase.com
2. Allez dans **SQL Editor**
3. Créez une nouvelle requête
4. Copiez-collez le contenu de `insert-test-data.sql`
5. Cliquez sur **Run** pour exécuter le script

**Option 2 : Via la ligne de commande (psql)**

```bash
# Se connecter à Supabase
psql -h db.[votre-projet].supabase.co -U postgres -d postgres

# Exécuter le script
\i backend/supabase/insert-test-data.sql
```

## ⚠️ Notes importantes

### Authentification des prestataires

**Important** : Le script SQL `insert-test-data.sql` crée uniquement les profils dans `public.users`. Pour que les prestataires puissent se connecter, vous devez d'abord créer les comptes dans Supabase Auth.

**Méthode recommandée** : Utilisez le script `create-test-providers.ts` qui :
- Crée les comptes dans Supabase Auth
- Met à jour automatiquement les profils avec `is_provider = true`
- Configure tous les champs nécessaires

**Mot de passe par défaut** : `Test1234!` (pour tous les prestataires de test)

### Ordre d'exécution recommandé

1. **D'abord** : Exécutez `create-test-providers.ts` pour créer les comptes Auth
2. **Ensuite** : Exécutez `insert-test-data.sql` pour ajouter les prestataires et services de test (les catégories doivent déjà être insérées via `insert-categories-subcategories.sql`)
3. **Important** : Exécutez `fix-providers-rls-policy.sql` pour permettre la lecture des providers depuis les services

Si vous exécutez le script SQL en premier, les profils seront créés mais les prestataires ne pourront pas se connecter jusqu'à ce que vous créiez les comptes Auth.

**⚠️ Problème courant** : Si les services s'affichent mais sans informations de provider (nom, avatar, etc.), c'est que les politiques RLS bloquent l'accès. Exécutez `fix-providers-rls-policy.sql` pour corriger cela.

### Vérification des données

Après l'exécution, vous pouvez vérifier les données avec :

```sql
-- Nombre de prestataires
SELECT COUNT(*) FROM users WHERE is_provider = true;

-- Nombre de services actifs
SELECT COUNT(*) FROM services WHERE is_active = true;

-- Liste des prestataires avec leurs services
SELECT 
  u.first_name || ' ' || u.last_name as prestataire,
  u.city,
  COUNT(s.id) as nombre_services
FROM users u
LEFT JOIN services s ON s.provider_id = u.id AND s.is_active = true
WHERE u.is_provider = true
GROUP BY u.id, u.first_name, u.last_name, u.city;
```

## 🔄 Déconnecter tous les utilisateurs

**Fonctionnalité** : Déconnecter tous les utilisateurs actuellement connectés (utile pour les tests ou la maintenance).

**Solution** : Exécutez le script `disconnect-all-users.sql` dans l'éditeur SQL de Supabase.

Ce script :
- ✅ Supprime toutes les sessions actives (`auth.sessions`)
- ✅ Invalide tous les refresh tokens actifs
- ✅ Force tous les utilisateurs à se reconnecter

**⚠️ Important** :
- Ce script déconnecte TOUS les utilisateurs, y compris vous-même
- Les comptes et mots de passe ne sont PAS affectés
- Seules les sessions actives sont supprimées/invalidées
- Après l'exécution, tous les utilisateurs devront se reconnecter

**Utilisation** :
1. Ouvrez l'éditeur SQL de Supabase
2. Exécutez le script `disconnect-all-users.sql`
3. Tous les utilisateurs seront déconnectés immédiatement

## 🔄 Réinitialiser les données

Si vous voulez supprimer et réinsérer les données :

```sql
-- Supprimer les services
DELETE FROM services WHERE provider_id IN (
  SELECT id FROM users WHERE is_provider = true AND email LIKE '%@beauty.com' OR email LIKE '%@makeup.com' OR email LIKE '%@nails.com' OR email LIKE '%@skincare.com' OR email LIKE '%@epilation.com' OR email LIKE '%@massage.com'
);

-- Supprimer les prestataires
DELETE FROM users WHERE is_provider = true AND (email LIKE '%@beauty.com' OR email LIKE '%@makeup.com' OR email LIKE '%@nails.com' OR email LIKE '%@skincare.com' OR email LIKE '%@epilation.com' OR email LIKE '%@massage.com');

-- Supprimer les sous-catégories (optionnel)
DELETE FROM service_subcategories;

-- Supprimer les catégories (optionnel)
DELETE FROM service_categories;

-- Puis réexécutez insert-test-data.sql
```

## 📧 Confirmation des emails (Développement)

**Problème** : Erreur "Email not confirmed" lors de la connexion.

**Solution** : Exécutez le script `confirm-email-dev.sql` dans l'éditeur SQL de Supabase pour confirmer les emails.

Ce script :
- Confirme l'email pour un utilisateur spécifique (par défaut : `presta@gmail.com`)
- Peut être modifié pour confirmer tous les emails non confirmés (développement uniquement)

**⚠️ Important** : Ce script est uniquement pour le développement. En production, les utilisateurs doivent confirmer leur email via le lien reçu par email.

## 🔒 Correction des politiques RLS (IMPORTANT)

**Problème** : Les services sont récupérés mais les providers ne s'affichent pas (`hasProvider: false` dans les logs).

**Solution** : Exécutez le script `fix-providers-rls-policy.sql` dans l'éditeur SQL de Supabase.

Ce script modifie la politique RLS `SELECT` pour la table `users` afin de permettre :
- La lecture de son propre profil (comme avant)
- La lecture des providers (`is_provider = true`) pour les jointures depuis les services

**Sans ce script**, les services s'afficheront mais sans informations de provider (nom, avatar, etc.).

## 🔍 Vérification et correction de la visibilité des services

**Problème** : Les services ajoutés par le prestataire ne sont pas visibles côté client.

**Conditions pour qu'un service soit visible côté client** :
1. ✅ `is_active = true` (service actif)
2. ✅ `moderation_status = 'approved'` (service approuvé)
3. ✅ `subcategory_id IS NOT NULL` (sous-catégorie obligatoire)

**Solution** : Exécutez le script `fix-services-visibility.sql` dans l'éditeur SQL de Supabase.

Ce script :
- ✅ Vérifie les services qui ne sont pas visibles et identifie la cause
- ✅ Corrige automatiquement les services standards (non personnalisés) qui sont actifs mais non approuvés
- ✅ Affiche un avertissement pour les services sans sous-catégorie
- ✅ Affiche un résumé des services visibles par catégorie

**Note** : Les services personnalisés (`is_custom = true`) doivent être approuvés manuellement et restent en statut `pending` par défaut.

## ⭐ Configuration des politiques RLS pour les avis

**Problème** : Les clients ne peuvent pas noter les prestations passées.

**Solution** : Exécutez le script `fix-reviews-rls-policies.sql` dans l'éditeur SQL de Supabase.

Ce script configure les politiques RLS pour la table `reviews` afin de permettre :
- ✅ La lecture de tous les avis (pour afficher les avis des prestataires)
- ✅ La création d'avis par les clients (uniquement pour leurs propres réservations)
- ✅ La mise à jour et suppression de leurs propres avis par les clients

**Sans ce script**, les clients ne pourront pas créer d'avis pour leurs réservations passées.

## 💬 Ajouter la possibilité de répondre aux avis (Prestataires)

**Fonctionnalité** : Permettre aux prestataires de répondre aux avis qu'ils reçoivent.

**Solution** : Exécutez le script `add-provider-response-to-reviews.sql` dans l'éditeur SQL de Supabase.

Ce script :
- ✅ Ajoute la colonne `provider_response` à la table `reviews` pour stocker les réponses
- ✅ Ajoute la colonne `provider_response_at` pour enregistrer la date de réponse
- ✅ Crée un index pour améliorer les performances

**Important** : Après avoir exécuté ce script, vous devez aussi mettre à jour les RLS policies en réexécutant `fix-reviews-rls-policies.sql` pour permettre aux prestataires de répondre aux avis.

## 💎 Système Premium et Réservations Urgentes

**Fonctionnalité** : Permettre aux prestataires de devenir premium (gratuit en phase test) et d'accepter les réservations urgentes avec majoration de 20-30%.

**Solution** : Exécutez le script `fix-premium-emergency-rls-policies.sql` dans l'éditeur SQL de Supabase.

Ce script :
- ✅ Permet aux prestataires de modifier leur statut `is_premium`
- ✅ Permet aux prestataires de modifier leur statut `accepts_emergency`
- ✅ Configure les RLS policies pour ces modifications

**Fonctionnement** :
1. Les prestataires peuvent activer Premium gratuitement (phase test)
2. Seuls les prestataires Premium peuvent accepter les réservations urgentes
3. Les clients peuvent réserver en urgence (même jour) avec majoration de 25%
4. Les réservations urgentes sont créées dans la table `bookings` avec `is_emergency: true`

## 📱 Tester dans l'application

Une fois les données insérées et les RLS corrigées :

1. **Ouvrez l'application** et allez dans l'écran de recherche
2. **Les catégories** devraient apparaître automatiquement
3. **Sélectionnez une catégorie** pour voir les services disponibles
4. **Les services devraient afficher les informations des providers** (nom, avatar, etc.)
5. **Cliquez sur un service** pour voir les détails du prestataire
6. **Réservez un service** en tant que client

## 🎯 Prochaines étapes

Pour que les prestataires puissent se connecter :

1. Créez les comptes dans Supabase Auth avec les emails du script
2. Les profils seront automatiquement créés via le trigger `handle_new_user`
3. Ou mettez à jour manuellement les profils existants avec `is_provider = true`

Pour tester les réservations :

1. Connectez-vous en tant que client
2. Recherchez un service dans l'écran de recherche
3. Cliquez sur "Réserver" pour créer une réservation

