/**
 * Script pour corriger la politique RLS UPDATE sur la table users
 * 
 * Usage:
 *   node backend/scripts/fix-update-policy.js
 * 
 * OU avec les variables d'environnement:
 *   SUPABASE_URL=your_url SUPABASE_SERVICE_KEY=your_key node backend/scripts/fix-update-policy.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Clé service_role (secrète)

if (!SUPABASE_URL) {
  console.error('❌ Erreur: SUPABASE_URL non défini');
  console.log('💡 Définissez SUPABASE_URL dans votre fichier .env');
  process.exit(1);
}

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Erreur: SUPABASE_SERVICE_ROLE_KEY non défini');
  console.log('💡 Vous devez utiliser la clé SERVICE_ROLE (secrète) pour exécuter ce script');
  console.log('💡 Trouvez-la dans Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

// Créer le client avec la clé service_role (bypass RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixUpdatePolicy() {
  console.log('🔧 Correction de la politique UPDATE pour la table users...\n');

  try {
    // 1. Supprimer l'ancienne politique
    console.log('1️⃣ Suppression de l\'ancienne politique UPDATE...');
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Users can update own profile" ON users;
      `
    });

    // Si exec_sql n'existe pas, utiliser une requête directe
    if (dropError && dropError.message?.includes('exec_sql')) {
      console.log('⚠️  exec_sql non disponible, utilisation d\'une méthode alternative...');
      // On va utiliser une requête SQL directe via PostgREST
      // Note: Cette méthode nécessite que la fonction soit créée dans Supabase
    }

    // 2. Créer la nouvelle politique avec USING et WITH CHECK
    console.log('2️⃣ Création de la nouvelle politique UPDATE...');
    
    const sql = `
      -- Supprimer l'ancienne politique
      DROP POLICY IF EXISTS "Users can update own profile" ON users;

      -- Créer la nouvelle politique avec USING et WITH CHECK
      CREATE POLICY "Users can update own profile" ON users
        FOR UPDATE 
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
    `;

    // Exécuter via l'API REST (nécessite une fonction SQL dans Supabase)
    // Pour l'instant, on affiche le SQL à exécuter manuellement
    console.log('\n📋 SQL à exécuter dans Supabase SQL Editor:');
    console.log('─'.repeat(60));
    console.log(sql);
    console.log('─'.repeat(60));
    
    console.log('\n✅ Instructions:');
    console.log('1. Allez dans Supabase Dashboard > SQL Editor');
    console.log('2. Copiez-collez le SQL ci-dessus');
    console.log('3. Cliquez sur "Run"');
    console.log('\n💡 Note: Ce script nécessite des privilèges admin.');
    console.log('💡 L\'exécution directe via API nécessite une fonction SQL personnalisée.');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
fixUpdatePolicy();





