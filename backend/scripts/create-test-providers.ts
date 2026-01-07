/**
 * Script pour créer des prestataires de test avec Supabase Auth
 * 
 * Usage:
 *   npx ts-node backend/scripts/create-test-providers.ts
 * 
 * Note: Vous devez avoir SUPABASE_SERVICE_ROLE_KEY dans votre .env
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erreur: EXPO_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env');
  process.exit(1);
}

// Créer un client Supabase avec les droits admin
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Données des prestataires de test
const testProviders = [
  {
    email: 'sophie.martin@beauty.com',
    password: 'Test1234!',
    userData: {
      first_name: 'Sophie',
      last_name: 'Martin',
      age: 32,
      city: 'Paris',
      neighborhood: '15e arrondissement',
      activity_zone: 'Paris 15e, Paris 14e, Paris 16e',
      latitude: 48.8422,
      longitude: 2.3219,
      main_skills: ['Coupe femme', 'Coloration', 'Mèches', 'Brushing'],
      description: 'Coiffeuse professionnelle avec 8 ans d\'expérience. Spécialisée dans les coupes modernes et les colorations tendance.',
      experience_years: 8,
      experience_level: 'expert',
      instagram: '@sophie_coiffure',
      tiktok: '@sophie_beauty',
      subscription_type: 'premium',
      is_premium: true,
      accepts_emergency: true,
    }
  },
  {
    email: 'marie.dupont@makeup.com',
    password: 'Test1234!',
    userData: {
      first_name: 'Marie',
      last_name: 'Dupont',
      age: 28,
      city: 'Paris',
      neighborhood: '11e arrondissement',
      activity_zone: 'Paris 11e, Paris 10e, Paris 20e',
      latitude: 48.8630,
      longitude: 2.3700,
      main_skills: ['Maquillage jour', 'Maquillage soirée', 'Maquillage mariage'],
      description: 'Maquilleuse professionnelle certifiée. Je propose des services de maquillage pour tous les événements.',
      experience_years: 5,
      experience_level: 'expert',
      instagram: '@marie_makeup',
      tiktok: '@marie_beauty',
      subscription_type: 'premium',
      is_premium: true,
      accepts_emergency: false,
    }
  },
  {
    email: 'laura.bernard@nails.com',
    password: 'Test1234!',
    userData: {
      first_name: 'Laura',
      last_name: 'Bernard',
      age: 26,
      city: 'Paris',
      neighborhood: '17e arrondissement',
      activity_zone: 'Paris 17e, Paris 8e, Paris 9e',
      latitude: 48.8847,
      longitude: 2.3219,
      main_skills: ['Pose ongles', 'Manucure', 'Pédicure', 'Décorations'],
      description: 'Prothésiste ongulaire spécialisée en pose de gel, résine et ongles en acrylique.',
      experience_years: 4,
      experience_level: 'intermediate',
      instagram: '@laura_nails',
      tiktok: '@laura_nailart',
      subscription_type: 'free',
      is_premium: false,
      accepts_emergency: true,
    }
  },
  {
    email: 'claire.leroy@skincare.com',
    password: 'Test1234!',
    userData: {
      first_name: 'Claire',
      last_name: 'Leroy',
      age: 35,
      city: 'Paris',
      neighborhood: '6e arrondissement',
      activity_zone: 'Paris 6e, Paris 5e, Paris 7e',
      latitude: 48.8506,
      longitude: 2.3322,
      main_skills: ['Nettoyage de peau', 'Soin anti-âge', 'Soin hydratant'],
      description: 'Esthéticienne diplômée avec 10 ans d\'expérience. Spécialisée dans les soins du visage et l\'anti-âge.',
      experience_years: 10,
      experience_level: 'expert',
      instagram: '@claire_skincare',
      subscription_type: 'premium',
      is_premium: true,
      accepts_emergency: false,
    }
  },
  {
    email: 'julie.moreau@epilation.com',
    password: 'Test1234!',
    userData: {
      first_name: 'Julie',
      last_name: 'Moreau',
      age: 30,
      city: 'Paris',
      neighborhood: '13e arrondissement',
      activity_zone: 'Paris 13e, Paris 12e, Paris 14e',
      latitude: 48.8322,
      longitude: 2.3561,
      main_skills: ['Épilation jambes', 'Épilation aisselles', 'Épilation maillot'],
      description: 'Épilatrice professionnelle certifiée. J\'utilise la technique de l\'épilation à la cire chaude et froide.',
      experience_years: 6,
      experience_level: 'intermediate',
      instagram: '@julie_epilation',
      subscription_type: 'free',
      is_premium: false,
      accepts_emergency: true,
    }
  },
  {
    email: 'emilie.petit@massage.com',
    password: 'Test1234!',
    userData: {
      first_name: 'Émilie',
      last_name: 'Petit',
      age: 29,
      city: 'Paris',
      neighborhood: '4e arrondissement',
      activity_zone: 'Paris 4e, Paris 3e, Paris 1er',
      latitude: 48.8566,
      longitude: 2.3522,
      main_skills: ['Massage relaxant', 'Massage sportif', 'Massage visage'],
      description: 'Massothérapeute diplômée. Je propose des massages relaxants, sportifs et du visage.',
      experience_years: 5,
      experience_level: 'intermediate',
      instagram: '@emilie_massage',
      tiktok: '@emilie_wellness',
      subscription_type: 'premium',
      is_premium: true,
      accepts_emergency: false,
    }
  },
];

async function createTestProviders() {
  console.log('🚀 Création des prestataires de test...\n');

  for (const provider of testProviders) {
    try {
      console.log(`📝 Création du compte pour ${provider.email}...`);

      // 1. Créer le compte dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: provider.email,
        password: provider.password,
        email_confirm: true, // Confirmer automatiquement l'email
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`⚠️  Le compte ${provider.email} existe déjà, mise à jour du profil...`);
          
          // Récupérer l'utilisateur existant
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', provider.email)
            .single();

          if (existingUser) {
            // Mettre à jour le profil existant
            const { error: updateError } = await supabase
              .from('users')
              .update({
                ...provider.userData,
                is_provider: true,
                verified: true,
              })
              .eq('id', existingUser.id);

            if (updateError) {
              console.error(`❌ Erreur lors de la mise à jour: ${updateError.message}`);
            } else {
              console.log(`✅ Profil mis à jour pour ${provider.email}`);
            }
          }
          continue;
        } else {
          throw authError;
        }
      }

      if (!authData.user) {
        throw new Error('Aucun utilisateur créé');
      }

      const userId = authData.user.id;

      // 2. Mettre à jour le profil dans public.users
      const { error: profileError } = await supabase
        .from('users')
        .update({
          ...provider.userData,
          is_provider: true,
          verified: true,
        })
        .eq('id', userId);

      if (profileError) {
        console.error(`❌ Erreur lors de la mise à jour du profil: ${profileError.message}`);
        continue;
      }

      console.log(`✅ Prestataire créé avec succès: ${provider.email} (ID: ${userId})\n`);

    } catch (error: any) {
      console.error(`❌ Erreur pour ${provider.email}: ${error.message}\n`);
    }
  }

  console.log('✨ Terminé!');
  console.log('\n📋 Résumé:');
  console.log('   - Les prestataires peuvent maintenant se connecter avec leurs emails et le mot de passe: Test1234!');
  console.log('   - Exécutez ensuite insert-test-data.sql pour ajouter les services');
}

// Exécuter le script
createTestProviders()
  .then(() => {
    console.log('\n✅ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  });




