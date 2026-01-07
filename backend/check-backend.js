/**
 * Script de vérification du backend Supabase
 * Vérifie que tout est prêt pour utiliser l'application
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function checkBackend() {
  console.log('🔍 Vérification du backend Supabase...\n');

  // 1. Vérifier les variables d'environnement
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  console.log('📋 Variables d\'environnement:');
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement manquantes!\n');
    console.log('💡 Créez un fichier .env avec:');
    console.log('   EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co');
    console.log('   EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anonyme\n');
    console.log('📖 Guide: backend/START_BACKEND.md\n');
    return false;
  }

  console.log(`   URL: ✅ ${supabaseUrl.substring(0, 30)}...`);
  console.log(`   Key: ✅ ${supabaseKey.substring(0, 20)}...\n`);

  // 2. Vérifier la connexion
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('🔌 Test de connexion...');
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        console.error('❌ Les tables n\'existent pas encore!\n');
        console.log('📝 Pour créer les tables:');
        console.log('   1. Allez sur https://supabase.com');
        console.log('   2. Ouvrez votre projet');
        console.log('   3. Allez dans "SQL Editor"');
        console.log('   4. Copiez le contenu de: backend/supabase/schema-clean.sql');
        console.log('   5. Collez et exécutez dans l\'éditeur SQL\n');
        console.log('📖 Guide complet: backend/START_BACKEND.md\n');
        return false;
      }
      throw error;
    }

    console.log('✅ Connexion réussie!\n');

    // 3. Vérifier les tables
    console.log('📊 Vérification des tables...\n');
    const requiredTables = [
      'users',
      'services',
      'bookings',
      'reviews',
      'favorites',
      'messages',
      'service_categories',
      'service_subcategories'
    ];

    let allTablesExist = true;
    for (const table of requiredTables) {
      try {
        const { count, error: tableError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (tableError) {
          if (tableError.code === 'PGRST116') {
            console.log(`   ${table}: ❌ N'existe pas`);
            allTablesExist = false;
          } else {
            console.log(`   ${table}: ⚠️  ${tableError.message}`);
          }
        } else {
          console.log(`   ${table}: ✅ (${count || 0} enregistrements)`);
        }
      } catch (err) {
        console.log(`   ${table}: ❌ ${err.message}`);
        allTablesExist = false;
      }
    }

    if (!allTablesExist) {
      console.log('\n⚠️  Certaines tables manquent. Exécutez le script SQL.\n');
      return false;
    }

    // 4. Vérifier l'authentification
    console.log('\n🔐 Test d\'authentification...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log(`   ⚠️  ${authError.message}`);
    } else {
      console.log(`   ✅ Service Auth opérationnel`);
      console.log(`   Session: ${authData.session ? 'Active' : 'Aucune session'}`);
    }

    console.log('\n✅ Backend prêt à l\'emploi!\n');
    console.log('🚀 Vous pouvez maintenant:');
    console.log('   - Lancer l\'app: npm start');
    console.log('   - Tester l\'inscription/connexion');
    console.log('   - Créer des services (prestataires)\n');

    return true;

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n📖 Consultez: backend/START_BACKEND.md pour plus d\'aide\n');
    return false;
  }
}

// Exécuter la vérification
checkBackend()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Erreur inattendue:', error);
    process.exit(1);
  });






