/**
 * Service de gestion des services
 */

import { supabase } from '../supabase/config';

export class ServicesService {
  /**
   * Récupérer tous les services avec filtres
   */
  static async getServices(filters?: {
    categoryId?: string;
    subcategoryId?: string;
    providerId?: string;
    searchQuery?: string;
    isActive?: boolean;
    isCustom?: boolean;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('services')
        .select(`
          *,
          provider:users!services_provider_id_fkey(*),
          category:service_categories(*),
          subcategory:service_subcategories(*)
        `);

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.subcategoryId) {
        query = query.eq('subcategory_id', filters.subcategoryId);
      }
      if (filters?.providerId) {
        query = query.eq('provider_id', filters.providerId);
      }
      if (filters?.searchQuery) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }
      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }
      if (filters?.isCustom !== undefined) {
        query = query.eq('is_custom', filters.isCustom);
      }
      
      // Pour la recherche publique, ne montrer que les services approuvés
      // (sauf si on filtre spécifiquement par provider, auquel cas on montre tous les services du provider)
      if (!filters?.providerId) {
        query = query.eq('moderation_status', 'approved');
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Log pour déboguer
      console.log('🔍 ServicesService.getServices - Filtres appliqués:', filters);
      console.log('🔍 ServicesService.getServices - Services récupérés:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('🔍 Premier service:', {
          id: data[0].id,
          name: data[0].name,
          provider_id: data[0].provider_id,
          category_id: data[0].category_id,
          subcategory_id: data[0].subcategory_id,
          is_active: data[0].is_active,
          moderation_status: data[0].moderation_status,
          is_custom: data[0].is_custom,
          hasProvider: !!data[0].provider,
        });
      } else {
        console.log('🔍 Aucun service récupéré. Vérifiez les filtres et les conditions.');
      }
      
      return data;
    } catch (error: any) {
      console.error('Erreur getServices:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des services');
    }
  }

  /**
   * Récupérer un service par ID
   */
  static async getServiceById(serviceId: string) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider:users!services_provider_id_fkey(*),
          category:service_categories(*),
          subcategory:service_subcategories(*)
        `)
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur getServiceById:', error);
      throw new Error(error.message || 'Erreur lors de la récupération du service');
    }
  }

  /**
   * Créer un nouveau service (prestataire)
   */
  static async createService(providerId: string, serviceData: any) {
    try {
      console.log('🔍 ServicesService.createService - Données reçues:', {
        providerId,
        serviceData: {
          ...serviceData,
          provider_id: providerId,
        },
      });

      const { data, error } = await supabase
        .from('services')
        .insert({
          ...serviceData,
          provider_id: providerId,
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('🔍 ServicesService.createService - Service créé:', {
        id: data.id,
        name: data.name,
        provider_id: data.provider_id,
        category_id: data.category_id,
        subcategory_id: data.subcategory_id,
        is_active: data.is_active,
        moderation_status: data.moderation_status,
        is_custom: data.is_custom,
      });
      
      return data;
    } catch (error: any) {
      console.error('Erreur createService:', error);
      throw new Error(error.message || 'Erreur lors de la création du service');
    }
  }

  /**
   * Mettre à jour un service
   */
  static async updateService(serviceId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', serviceId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur updateService:', error);
      throw new Error(error.message || 'Erreur lors de la mise à jour du service');
    }
  }

  /**
   * Supprimer un service
   */
  static async deleteService(serviceId: string) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Erreur deleteService:', error);
      throw new Error(error.message || 'Erreur lors de la suppression du service');
    }
  }

  /**
   * Récupérer les catégories
   */
  static async getCategories() {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select(`
          *,
          subcategories:service_subcategories(*)
        `)
        .order('name');

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur getCategories:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des catégories');
    }
  }
}






