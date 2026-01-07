/**
 * Script de test de connexion à Supabase
 * Exécutez avec: node backend/test-connection.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  console.log('🔍 Test de connexion à Supabase...\n');

  // 1. Vérifier les variables d'environnement
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  console.log('📋 Variables d\'environnement:');
  console.log(`   URL: ${supabaseUrl ? '✅ Définie (' + supabaseUrl.substring(0, 30) + '...)' : '❌ Manquante'}`);
  console.log(`   Key: ${supabaseKey ? '✅ Définie (' + supabaseKey.substring(0, 20) + '...)' : '❌ Manquante'}\n`);

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement manquantes!');
    console.log('💡 Vérifiez votre fichier .env\n');
    return;
  }

  // 2. Créer le client Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 3. Test de connexion basique
  try {
    console.log('🔌 Test de connexion...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      console.error('   Code:', error.code);
      console.error('   Détails:', error.details);
      
      if (error.code === 'PGRST116') {
        console.log('\n💡 La table "users" n\'existe pas encore.');
        console.log('   Exécutez le script SQL dans backend/supabase/schema.sql sur votre projet Supabase');
      } else if (error.code === 'PGRST301') {
        console.log('\n💡 Problème d\'authentification.');
        console.log('   Vérifiez que votre clé anon est correcte.');
      }
      return;
    }

    console.log('✅ Connexion réussie!\n');

    // 4. Test de lecture des tables
    console.log('📊 Test des tables...\n');

    const tables = ['users', 'services', 'bookings', 'reviews', 'favorites'];
    
    for (const table of tables) {
      try {
        const { count, error: tableError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (tableError) {
          if (tableError.code === 'PGRST116') {
            console.log(`   ${table}: ⚠️  Table n'existe pas encore`);
          } else {
            console.log(`   ${table}: ❌ ${tableError.message}`);
          }
        } else {
          console.log(`   ${table}: ✅ (${count || 0} enregistrements)`);
        }
      } catch (err) {
        console.log(`   ${table}: ❌ ${err.message}`);
      }
    }

    // 5. Test d'authentification
    console.log('\n🔐 Test d\'authentification...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log(`   ❌ Erreur: ${authError.message}`);
    } else {
      console.log(`   ✅ Service Auth opérationnel`);
      console.log(`   Session: ${authData.session ? 'Active' : 'Aucune session'}`);
    }

    // 6. Test de la structure de la base
    console.log('\n📋 Test de la structure...');
    try {
      const { data: columns, error: schemaError } = await supabase
        .from('users')
        .select('*')
        .limit(0);
      
      if (schemaError && schemaError.code !== 'PGRST116') {
        console.log(`   ⚠️  Impossible de vérifier la structure: ${schemaError.message}`);
      } else {
        console.log('   ✅ Structure accessible');
      }
    } catch (err) {
      console.log(`   ⚠️  ${err.message}`);
    }

    console.log('\n✅ Tous les tests terminés!');
    console.log('\n💡 Si certaines tables n\'existent pas, exécutez le script SQL:');
    console.log('   backend/supabase/schema.sql\n');

  } catch (error) {
    console.error('❌ Erreur inattendue:', error.message);
    console.error(error);
  }
}

// Exécuter le test
testConnection().catch(console.error);






