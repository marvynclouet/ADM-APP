# Scripts de maintenance de la base de données

## Fix Update Policy

Corrige la politique RLS UPDATE pour permettre la mise à jour du profil utilisateur.

### Méthode 1 : Via Supabase SQL Editor (Recommandé)

1. Allez dans [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Copiez-collez le contenu de `fix-update-policy.sql`
5. Cliquez sur **Run**

### Méthode 2 : Via script Node.js

```bash
# Installer les dépendances si nécessaire
npm install dotenv

# Exécuter le script
node backend/scripts/fix-update-policy.js
```

**Note:** Le script affiche le SQL à exécuter. L'exécution directe nécessite des privilèges admin et une fonction SQL personnalisée dans Supabase.

## Fichiers SQL disponibles

- `../supabase/fix-update-policy.sql` - Correction de la politique UPDATE
- `../supabase/fix-rls-policy-v2.sql` - Correction complète des politiques RLS





