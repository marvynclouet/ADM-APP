/**
 * Service d'authentification
 * Utilise Supabase Auth pour la gestion des utilisateurs
 */

import { supabase } from '../supabase/config';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isProvider?: boolean;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  static async signUp(data: SignUpData) {
    try {
      // 1. Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erreur lors de la création du compte');

      // 2. Attendre que le trigger crée le profil (le trigger s'exécute automatiquement)
      // On attend un peu pour que le trigger ait le temps de s'exécuter
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Récupérer le profil créé par le trigger
      let userData;
      let retries = 0;
      const maxRetries = 5;

      while (retries < maxRetries) {
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle(); // Utiliser maybeSingle() au lieu de single() pour éviter l'erreur 406

        if (existingUser && !fetchError) {
          // Le profil existe, on le met à jour avec les informations complètes
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({
              email: data.email,
              phone: data.phone,
              first_name: data.firstName,
              last_name: data.lastName,
              is_provider: data.isProvider || false,
            })
            .eq('id', authData.user.id)
            .select()
            .single();

          if (updateError) {
            console.warn('Erreur lors de la mise à jour du profil:', updateError);
            // Si la mise à jour échoue, on retourne quand même le profil existant
            userData = existingUser;
          } else {
            userData = updatedUser;
          }
          break;
        }

        // Si le profil n'existe pas encore, attendre un peu plus
        retries++;
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Si après tous les essais le profil n'existe toujours pas, utiliser la fonction SECURITY DEFINER
      if (!userData) {
        // Utiliser la fonction create_user_profile qui contourne RLS
        const { data: newUser, error: functionError } = await supabase.rpc('create_user_profile', {
          user_id: authData.user.id,
          user_email: data.email,
          user_phone: data.phone || null,
          user_first_name: data.firstName || null,
          user_last_name: data.lastName || null,
          user_is_provider: data.isProvider || false,
        });

        if (functionError) {
          console.error('Erreur create_user_profile:', functionError);
          // Si la fonction n'existe pas, essayer l'insertion directe
          const { data: newUserDirect, error: insertError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: data.email,
              phone: data.phone,
              first_name: data.firstName,
              last_name: data.lastName,
              is_provider: data.isProvider || false,
              password_hash: '',
            })
            .select()
            .maybeSingle();

          if (insertError) {
            throw new Error(`Impossible de créer le profil utilisateur: ${insertError.message}`);
          }
          userData = newUserDirect;
        } else if (newUser) {
          // La fonction retourne un JSONB, le convertir en objet
          userData = newUser as any;
        }
      }

      if (!userData) {
        throw new Error('Impossible de créer ou récupérer le profil utilisateur');
      }

      return { user: userData, session: authData.session };
    } catch (error: any) {
      console.error('Erreur signUp:', error);
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  static async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      // En développement : gérer l'erreur "Email not confirmed"
      if (error) {
        // Si l'erreur est "Email not confirmed", on affiche un message plus clair
        if (error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed')) {
          console.warn('⚠️ Email non confirmé. En développement, exécutez le script confirm-email.sql dans Supabase pour confirmer l\'email.');
          throw new Error('Email non confirmé. Veuillez vérifier votre boîte mail ou contacter l\'administrateur pour confirmer votre email en développement.');
        }
        throw error;
      }
      if (!authData.user) throw new Error('Erreur lors de la connexion');

      // Récupérer le profil utilisateur avec plusieurs tentatives
      let userData = null;
      let userError = null;
      
      // Essayer de récupérer l'utilisateur avec plusieurs tentatives (au cas où le trigger n'a pas encore créé le profil)
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data: user, error: error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();
        
        if (!error && user) {
          userData = user;
          break;
        }
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          userError = error;
          break;
        }
        
        // Si pas de résultat et pas d'erreur critique, attendre un peu et réessayer
        if (attempt < 4) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      // Si l'utilisateur n'existe pas encore dans la table users, créer un profil basique
      if (!userData && !userError) {
        console.log('Création du profil utilisateur...');
        // Le trigger devrait créer le profil, mais si ce n'est pas le cas, on le crée ici
        const { data: newUserData, error: createError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email || '',
            password_hash: '', // Supabase Auth gère le mot de passe
            is_provider: false,
            verified: authData.user.email_confirmed_at ? true : false,
          })
          .select()
          .single();

        if (createError) {
          // Si l'erreur est une duplicate key (409), l'utilisateur existe déjà, on le récupère
          if (createError.code === '23505' || createError.message?.includes('duplicate key')) {
            console.log('L\'utilisateur existe déjà (duplicate key), nouvelle tentative de récupération...');
            
            // Attendre un peu pour laisser le temps au trigger de créer le profil si nécessaire
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Essayer de récupérer l'utilisateur avec plusieurs tentatives
            for (let attempt = 0; attempt < 5; attempt++) {
              const { data: user, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', authData.user.id)
                .maybeSingle();
              
              if (!fetchError && user) {
                return { user, session: authData.session };
              }
              
              // Si erreur RLS, créer un profil minimal avec les données d'auth
              if (fetchError && (fetchError.code === '42501' || fetchError.message?.includes('row-level security'))) {
                console.warn('Erreur RLS lors de la récupération, création d\'un profil minimal...');
                // Retourner un objet utilisateur minimal basé sur les données d'auth
                return {
                  user: {
                    id: authData.user.id,
                    email: authData.user.email || '',
                    is_provider: false,
                    verified: authData.user.email_confirmed_at ? true : false,
                    first_name: null,
                    last_name: null,
                  },
                  session: authData.session
                };
              }
              
              if (attempt < 4) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            }
            
            console.warn('Impossible de récupérer le profil existant après plusieurs tentatives');
            // Retourner un profil minimal plutôt que de lancer une erreur
            return {
              user: {
                id: authData.user.id,
                email: authData.user.email || '',
                is_provider: false,
                verified: authData.user.email_confirmed_at ? true : false,
                first_name: null,
                last_name: null,
              },
              session: authData.session
            };
          }
          
          console.warn('Erreur lors de la création du profil utilisateur:', createError);
          // Retourner un profil minimal plutôt que de lancer une erreur
          return {
            user: {
              id: authData.user.id,
              email: authData.user.email || '',
              is_provider: false,
              verified: authData.user.email_confirmed_at ? true : false,
              first_name: null,
              last_name: null,
            },
            session: authData.session
          };
        }

        return { user: newUserData, session: authData.session };
      }

      // Si erreur RLS, retourner un profil minimal
      if (userError && (userError.code === '42501' || userError.message?.includes('row-level security'))) {
        console.warn('Erreur RLS, retour d\'un profil minimal');
        return {
          user: {
            id: authData.user.id,
            email: authData.user.email || '',
            is_provider: false,
            verified: authData.user.email_confirmed_at ? true : false,
            first_name: null,
            last_name: null,
          },
          session: authData.session
        };
      }

      if (userError) {
        console.error('Erreur lors de la récupération du profil:', userError);
        throw userError;
      }

      if (!userData) {
        // Si toujours pas de données, retourner un profil minimal
        console.warn('Aucune donnée utilisateur trouvée, retour d\'un profil minimal');
        return {
          user: {
            id: authData.user.id,
            email: authData.user.email || '',
            is_provider: false,
            verified: authData.user.email_confirmed_at ? true : false,
            first_name: null,
            last_name: null,
          },
          session: authData.session
        };
      }

      return { user: userData, session: authData.session };
    } catch (error: any) {
      console.error('Erreur signIn:', error);
      throw new Error(error.message || 'Erreur lors de la connexion');
    }
  }

  /**
   * Déconnexion
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Erreur signOut:', error);
      throw new Error(error.message || 'Erreur lors de la déconnexion');
    }
  }

  /**
   * Récupérer l'utilisateur actuel
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) return null;

      // Essayer de récupérer le profil avec plusieurs tentatives
      let userData = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        const { data: data, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!userError && data) {
          userData = data;
          break;
        }

        // Si le profil n'existe pas (code 406 ou PGRST116), essayer de le créer
        if ((userError?.code === 'PGRST116' || userError?.code === '406' || !data) && attempt === 0) {
          try {
            // Importer UsersService dynamiquement pour éviter les dépendances circulaires
            const { UsersService } = await import('./users.service');
            const createdProfile = await UsersService.createProfileIfMissing(user.id);
            if (createdProfile) {
              userData = createdProfile;
              break;
            }
          } catch (createError: any) {
            console.warn('Impossible de créer le profil automatiquement:', createError);
          }
        }

        // Si erreur RLS ou pas de données, attendre un peu et réessayer
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      // Si on n'a pas réussi à récupérer le profil mais que l'utilisateur est authentifié,
      // retourner un profil minimal pour éviter la déconnexion
      if (!userData) {
        console.warn('Profil utilisateur non trouvé dans la table users, retour d\'un profil minimal');
        return {
          id: user.id,
          email: user.email || '',
          is_provider: false,
          verified: user.email_confirmed_at ? true : false,
          first_name: null,
          last_name: null,
        };
      }
      
      return userData;
    } catch (error: any) {
      console.error('Erreur getCurrentUser:', error);
      // Même en cas d'erreur, si l'utilisateur est authentifié, retourner un profil minimal
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          return {
            id: user.id,
            email: user.email || '',
            is_provider: false,
            verified: user.email_confirmed_at ? true : false,
            first_name: null,
            last_name: null,
          };
        }
      } catch (e) {
        // Ignorer l'erreur
      }
      return null;
    }
  }

  /**
   * Réinitialiser le mot de passe
   */
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.EXPO_PUBLIC_APP_URL}/reset-password`,
      });
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Erreur resetPassword:', error);
      throw new Error(error.message || 'Erreur lors de la réinitialisation');
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  static async isAuthenticated() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      return false;
    }
  }
}


