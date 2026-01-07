/**
 * Service de gestion du premium et des réservations urgentes
 */

import { supabase } from '../supabase/config';

export class PremiumService {
  /**
   * Activer le premium pour un prestataire (gratuit en phase test)
   */
  static async activatePremium(providerId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          is_premium: true,
          subscription_type: 'premium',
        })
        .eq('id', providerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur activatePremium:', error);
      throw new Error(error.message || 'Erreur lors de l\'activation du premium');
    }
  }

  /**
   * Désactiver le premium pour un prestataire
   */
  static async deactivatePremium(providerId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          is_premium: false,
          subscription_type: 'free',
          accepts_emergency: false, // Désactiver aussi les urgences
        })
        .eq('id', providerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur deactivatePremium:', error);
      throw new Error(error.message || 'Erreur lors de la désactivation du premium');
    }
  }

  /**
   * Vérifier si un prestataire est premium
   */
  static async isPremium(providerId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_premium')
        .eq('id', providerId)
        .single();

      if (error) throw error;
      return data?.is_premium || false;
    } catch (error: any) {
      console.error('Erreur isPremium:', error);
      return false;
    }
  }

  /**
   * Activer les réservations urgentes (seulement si premium)
   */
  static async activateEmergency(providerId: string) {
    try {
      // Vérifier que le prestataire est premium
      const isPremium = await this.isPremium(providerId);
      if (!isPremium) {
        throw new Error('Vous devez être premium pour accepter les réservations urgentes');
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          accepts_emergency: true,
        })
        .eq('id', providerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur activateEmergency:', error);
      throw new Error(error.message || 'Erreur lors de l\'activation des urgences');
    }
  }

  /**
   * Désactiver les réservations urgentes
   */
  static async deactivateEmergency(providerId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          accepts_emergency: false,
        })
        .eq('id', providerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur deactivateEmergency:', error);
      throw new Error(error.message || 'Erreur lors de la désactivation des urgences');
    }
  }

  /**
   * Récupérer les informations premium et urgence d'un prestataire
   */
  static async getProviderPremiumInfo(providerId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_premium, accepts_emergency, emergency_credits, subscription_type')
        .eq('id', providerId)
        .single();

      if (error) throw error;
      return {
        isPremium: data?.is_premium || false,
        acceptsEmergency: data?.accepts_emergency || false,
        emergencyCredits: data?.emergency_credits || 0,
        subscriptionType: data?.subscription_type || 'free',
      };
    } catch (error: any) {
      console.error('Erreur getProviderPremiumInfo:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des informations');
    }
  }
}

