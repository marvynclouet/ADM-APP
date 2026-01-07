/**
 * Script de test de connexion à Supabase
 * Exécutez avec: npx ts-node backend/test-connection.ts
 */

import { supabase } from './supabase/config';

async function testConnection() {
  console.log('🔍 Test de connexion à Supabase...\n');

  // 1. Vérifier les variables d'environnement
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  console.log('📋 Variables d\'environnement:');
  console.log(`   URL: ${supabaseUrl ? '✅ Définie' : '❌ Manquante'}`);
  console.log(`   Key: ${supabaseKey ? '✅ Définie' : '❌ Manquante'}\n`);

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement manquantes!');
    console.log('💡 Créez un fichier .env avec:');
    console.log('   EXPO_PUBLIC_SUPABASE_URL=votre-url');
    console.log('   EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-clé\n');
    return;
  }

  // 2. Test de connexion basique
  try {
    console.log('🔌 Test de connexion...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      console.error('   Code:', error.code);
      console.error('   Détails:', error.details);
      
      if (error.code === 'PGRST116') {
        console.log('\n💡 La table "users" n\'existe pas encore.');
        console.log('   Exécutez le script SQL dans backend/supabase/schema.sql');
      }
      return;
    }

    console.log('✅ Connexion réussie!\n');

    // 3. Test de lecture des tables
    console.log('📊 Test des tables...\n');

    const tables = ['users', 'services', 'bookings', 'reviews', 'favorites'];
    
    for (const table of tables) {
      try {
        const { count, error: tableError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (tableError) {
          console.log(`   ${table}: ❌ ${tableError.message}`);
        } else {
          console.log(`   ${table}: ✅ (${count || 0} enregistrements)`);
        }
      } catch (err: any) {
        console.log(`   ${table}: ❌ ${err.message}`);
      }
    }

    // 4. Test d'authentification
    console.log('\n🔐 Test d\'authentification...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log(`   ❌ Erreur: ${authError.message}`);
    } else {
      console.log(`   ✅ Service Auth opérationnel`);
      console.log(`   Session: ${authData.session ? 'Active' : 'Aucune session'}`);
    }

    console.log('\n✅ Tous les tests terminés!');

  } catch (error: any) {
    console.error('❌ Erreur inattendue:', error.message);
    console.error(error);
  }
}

// Exécuter le test
testConnection();






