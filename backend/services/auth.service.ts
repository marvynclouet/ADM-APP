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

      // 2. Créer le profil dans la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          phone: data.phone,
          first_name: data.firstName,
          last_name: data.lastName,
          is_provider: data.isProvider || false,
          password_hash: '', // Supabase Auth gère le mot de passe
        })
        .select()
        .single();

      if (userError) throw userError;

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

      if (error) throw error;
      if (!authData.user) throw new Error('Erreur lors de la connexion');

      // Récupérer le profil utilisateur
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;

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

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;
      return userData;
    } catch (error: any) {
      console.error('Erreur getCurrentUser:', error);
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

