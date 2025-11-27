/**
 * Service de gestion des utilisateurs
 */

import { supabase } from '../supabase/config';

export class UsersService {
  /**
   * Récupérer un utilisateur par ID
   */
  static async getUserById(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur getUserById:', error);
      throw new Error(error.message || 'Erreur lors de la récupération de l\'utilisateur');
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  static async updateProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur updateProfile:', error);
      throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
    }
  }

  /**
   * Uploader une photo de profil
   */
  static async uploadAvatar(userId: string, file: File | Blob) {
    try {
      const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Mettre à jour le profil avec l'URL
      const { data, error } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur uploadAvatar:', error);
      throw new Error(error.message || 'Erreur lors de l\'upload de l\'avatar');
    }
  }

  /**
   * Récupérer les prestataires avec filtres
   */
  static async getProviders(filters?: {
    city?: string;
    activityZone?: string;
    mainSkills?: string[];
    isPremium?: boolean;
    acceptsEmergency?: boolean;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('users')
        .select('*')
        .eq('is_provider', true);

      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.activityZone) {
        query = query.ilike('activity_zone', `%${filters.activityZone}%`);
      }
      if (filters?.mainSkills && filters.mainSkills.length > 0) {
        query = query.overlaps('main_skills', filters.mainSkills);
      }
      if (filters?.isPremium !== undefined) {
        query = query.eq('is_premium', filters.isPremium);
      }
      if (filters?.acceptsEmergency !== undefined) {
        query = query.eq('accepts_emergency', filters.acceptsEmergency);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur getProviders:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des prestataires');
    }
  }
}

