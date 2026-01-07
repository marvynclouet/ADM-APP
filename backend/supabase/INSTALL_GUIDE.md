# 📋 Guide d'Installation du Schéma Supabase

## ⚠️ Problème rencontré

Si vous avez eu l'erreur :
```
ERROR: 42601: syntax error at or near "ADM"
```

Cela signifie que Supabase n'a pas correctement interprété le fichier SQL.

## ✅ Solution : Utiliser le fichier nettoyé

J'ai créé un fichier `schema-clean.sql` qui est optimisé pour Supabase.

## 📝 Instructions étape par étape

### Option 1 : Exécuter le fichier complet (Recommandé)

1. **Ouvrez votre projet Supabase**
   - Allez sur https://supabase.com
   - Connectez-vous et ouvrez votre projet

2. **Ouvrez l'éditeur SQL**
   - Cliquez sur "SQL Editor" dans le menu de gauche
   - Cliquez sur "New query"

3. **Copiez le contenu du fichier**
   - Ouvrez le fichier `backend/supabase/schema-clean.sql`
   - Sélectionnez TOUT le contenu (Cmd/Ctrl + A)
   - Copiez (Cmd/Ctrl + C)

4. **Collez dans l'éditeur SQL**
   - Collez dans l'éditeur Supabase (Cmd/Ctrl + V)
   - **IMPORTANT** : Assurez-vous qu'il n'y a pas de texte avant la première ligne `CREATE EXTENSION...`

5. **Exécutez le script**
   - Cliquez sur "Run" ou appuyez sur `Cmd/Ctrl + Enter`
   - Attendez la confirmation "Success"

### Option 2 : Exécuter par sections (Si l'option 1 échoue)

Si vous avez encore des erreurs, exécutez le script en plusieurs parties :

#### Partie 1 : Extension et table users
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash TEXT NOT NULL,
  is_provider BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  age INTEGER,
  avatar_url TEXT,
  city VARCHAR(100),
  neighborhood VARCHAR(100),
  activity_zone VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  main_skills TEXT[],
  description TEXT,
  experience_years INTEGER,
  experience_level VARCHAR(20) CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
  instagram VARCHAR(100),
  tiktok VARCHAR(100),
  facebook VARCHAR(200),
  subscription_type VARCHAR(20) DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium')),
  subscription_start_date DATE,
  subscription_expiry_date DATE,
  is_premium BOOLEAN DEFAULT FALSE,
  accepts_emergency BOOLEAN DEFAULT FALSE,
  emergency_credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_provider ON users(is_provider);
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);
CREATE INDEX IF NOT EXISTS idx_users_activity_zone ON users(activity_zone);
```

#### Partie 2 : Catégories et services
Copiez les sections suivantes du fichier `schema-clean.sql` :
- `service_categories`
- `service_subcategories`
- `services`

#### Partie 3 : Autres tables
Copiez les sections suivantes :
- `certificates`
- `portfolio_items`
- `bookings`
- `reviews`
- `favorites`
- `messages`
- `availability`
- `notifications`

#### Partie 4 : Triggers et RLS
Copiez les sections finales :
- Les triggers `update_updated_at_column`
- Les politiques RLS

## ✅ Vérification

Après l'exécution, vérifiez que tout fonctionne :

```bash
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

## 🔧 Dépannage

### Erreur "extension already exists"
C'est normal, l'extension existe déjà. Continuez.

### Erreur "table already exists"
Si une table existe déjà, vous pouvez :
1. La supprimer : `DROP TABLE IF EXISTS nom_table CASCADE;`
2. Ou utiliser `CREATE TABLE IF NOT EXISTS` (déjà dans le script)

### Erreur de permissions
Assurez-vous d'être connecté avec un compte administrateur sur Supabase.

## 📞 Besoin d'aide ?

Si vous rencontrez toujours des problèmes :
1. Vérifiez que vous copiez bien TOUT le contenu du fichier
2. Assurez-vous qu'il n'y a pas de texte avant `CREATE EXTENSION`
3. Vérifiez que vous êtes dans l'éditeur SQL de Supabase (pas dans un autre outil)






