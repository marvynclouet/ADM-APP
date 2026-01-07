/**
 * Service de gestion des favoris
 */

import { supabase } from '../supabase/config';

export class FavoritesService {
  /**
   * Ajouter un provider en favoris
   */
  static async addProviderFavorite(userId: string, providerId: string, categoryId?: string) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          provider_id: providerId,
          category_id: categoryId || null,
        })
        .select()
        .single();

      if (error) {
        // Si l'erreur est due à une contrainte unique (déjà en favoris), c'est OK
        if (error.code === '23505') {
          return { success: true, data: null, message: 'Déjà en favoris' };
        }
        throw error;
      }

      return { success: true, data, message: 'Ajouté aux favoris' };
    } catch (error: any) {
      console.error('Erreur addProviderFavorite:', error);
      throw new Error(error.message || 'Erreur lors de l\'ajout aux favoris');
    }
  }

  /**
   * Ajouter un service en favoris (via le provider)
   */
  static async addServiceFavorite(userId: string, serviceId: string, providerId: string, categoryId?: string) {
    try {
      // Pour les services, on ajoute le provider en favoris avec la catégorie du service
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          provider_id: providerId,
          category_id: categoryId || null,
        })
        .select()
        .single();

      if (error) {
        // Si l'erreur est due à une contrainte unique (déjà en favoris), c'est OK
        if (error.code === '23505') {
          return { success: true, data: null, message: 'Déjà en favoris' };
        }
        throw error;
      }

      return { success: true, data, message: 'Service ajouté aux favoris' };
    } catch (error: any) {
      console.error('Erreur addServiceFavorite:', error);
      throw new Error(error.message || 'Erreur lors de l\'ajout du service aux favoris');
    }
  }

  /**
   * Retirer un provider des favoris
   */
  static async removeProviderFavorite(userId: string, providerId: string) {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('provider_id', providerId);

      if (error) throw error;

      return { success: true, message: 'Retiré des favoris' };
    } catch (error: any) {
      console.error('Erreur removeProviderFavorite:', error);
      throw new Error(error.message || 'Erreur lors de la suppression des favoris');
    }
  }

  /**
   * Retirer un service des favoris (via le provider)
   */
  static async removeServiceFavorite(userId: string, providerId: string) {
    try {
      // Pour les services, on retire le provider des favoris
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('provider_id', providerId);

      if (error) throw error;

      return { success: true, message: 'Service retiré des favoris' };
    } catch (error: any) {
      console.error('Erreur removeServiceFavorite:', error);
      throw new Error(error.message || 'Erreur lors de la suppression du service des favoris');
    }
  }

  /**
   * Toggle favoris (ajouter ou retirer)
   */
  static async toggleFavorite(userId: string, providerId: string, categoryId?: string) {
    try {
      // Vérifier si déjà en favoris
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('provider_id', providerId)
        .maybeSingle();

      if (existing) {
        // Retirer des favoris
        return await this.removeProviderFavorite(userId, providerId);
      } else {
        // Ajouter aux favoris
        return await this.addProviderFavorite(userId, providerId, categoryId);
      }
    } catch (error: any) {
      console.error('Erreur toggleFavorite:', error);
      throw new Error(error.message || 'Erreur lors de la modification des favoris');
    }
  }

  /**
   * Récupérer tous les favoris d'un utilisateur
   */
  static async getUserFavorites(userId: string) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          provider:users!favorites_provider_id_fkey(*),
          category:service_categories(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Erreur getUserFavorites:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des favoris');
    }
  }

  /**
   * Vérifier si un provider est en favoris
   */
  static async isProviderFavorite(userId: string, providerId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('provider_id', providerId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      return !!data;
    } catch (error: any) {
      console.error('Erreur isProviderFavorite:', error);
      return false;
    }
  }

  /**
   * Récupérer les IDs des providers favoris d'un utilisateur
   */
  static async getUserFavoriteProviderIds(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('provider_id')
        .eq('user_id', userId);

      if (error) throw error;

      return (data || []).map((fav: any) => fav.provider_id);
    } catch (error: any) {
      console.error('Erreur getUserFavoriteProviderIds:', error);
      return [];
    }
  }
}




