/**
 * Service de gestion des avis (reviews)
 */

import { supabase } from '../supabase/config';

export class ReviewsService {
  /**
   * Créer un avis pour une réservation
   */
  static async createReview(data: {
    bookingId: string;
    userId: string;
    providerId: string;
    serviceId?: string;
    rating: number;
    comment?: string;
  }) {
    try {
      // Vérifier si un avis existe déjà pour cette réservation
      const { data: existingReview, error: checkError } = await supabase
        .from('reviews')
        .select('id')
        .eq('booking_id', data.bookingId)
        .single();

      if (existingReview) {
        throw new Error('Un avis existe déjà pour cette réservation');
      }

      // Créer l'avis
      const { data: review, error } = await supabase
        .from('reviews')
        .insert({
          booking_id: data.bookingId,
          user_id: data.userId,
          provider_id: data.providerId,
          service_id: data.serviceId || null,
          rating: data.rating,
          comment: data.comment || null,
        })
        .select(`
          *,
          user:users!reviews_user_id_fkey(id, first_name, last_name, avatar_url),
          provider:users!reviews_provider_id_fkey(id, first_name, last_name, avatar_url),
          service:services(id, name)
        `)
        .single();

      if (error) throw error;
      return review;
    } catch (error: any) {
      console.error('Erreur createReview:', error);
      throw new Error(error.message || 'Erreur lors de la création de l\'avis');
    }
  }

  /**
   * Récupérer les avis d'un prestataire
   */
  static async getProviderReviews(providerId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users!reviews_user_id_fkey(id, first_name, last_name, avatar_url),
          service:services(id, name)
        `)
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur getProviderReviews:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des avis');
    }
  }

  /**
   * Calculer la note moyenne d'un prestataire
   */
  static async calculateProviderAverageRating(providerId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('provider_id', providerId);

      if (error) throw error;

      if (!data || data.length === 0) return 0;

      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      return sum / data.length;
    } catch (error: any) {
      console.error('Erreur calculateProviderAverageRating:', error);
      return 0;
    }
  }

  /**
   * Obtenir les statistiques de notation d'un prestataire
   */
  static async getProviderRatingStats(providerId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('provider_id', providerId);

      if (error) throw error;

      const stats = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      if (data) {
        data.forEach((review: any) => {
          const rating = review.rating as keyof typeof stats;
          if (rating >= 1 && rating <= 5) {
            stats[rating]++;
          }
        });
      }

      return stats;
    } catch (error: any) {
      console.error('Erreur getProviderRatingStats:', error);
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }
  }

  /**
   * Récupérer les avis d'un service
   */
  static async getServiceReviews(serviceId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users!reviews_user_id_fkey(id, first_name, last_name, avatar_url)
        `)
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur getServiceReviews:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des avis');
    }
  }

  /**
   * Vérifier si un avis existe pour une réservation
   */
  static async hasReviewForBooking(bookingId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id')
        .eq('booking_id', bookingId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return !!data;
    } catch (error: any) {
      console.error('Erreur hasReviewForBooking:', error);
      return false;
    }
  }

  /**
   * Récupérer l'avis moyen d'un prestataire
   */
  static async getProviderAverageRating(providerId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('provider_id', providerId);

      if (error) throw error;

      if (!data || data.length === 0) return 0;

      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      return sum / data.length;
    } catch (error: any) {
      console.error('Erreur getProviderAverageRating:', error);
      return 0;
    }
  }

  /**
   * Mettre à jour un avis
   */
  static async updateReview(reviewId: string, updates: {
    rating?: number;
    comment?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur updateReview:', error);
      throw new Error(error.message || 'Erreur lors de la mise à jour de l\'avis');
    }
  }

  /**
   * Ajouter ou mettre à jour une réponse du prestataire à un avis
   */
  static async addProviderResponse(reviewId: string, providerId: string, response: string) {
    try {
      // Vérifier que l'avis appartient bien au prestataire
      const { data: review, error: checkError } = await supabase
        .from('reviews')
        .select('provider_id')
        .eq('id', reviewId)
        .single();

      if (checkError) throw checkError;
      if (review.provider_id !== providerId) {
        throw new Error('Vous n\'êtes pas autorisé à répondre à cet avis');
      }

      // Mettre à jour la réponse
      const { data, error } = await supabase
        .from('reviews')
        .update({
          provider_response: response,
          provider_response_at: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .select(`
          *,
          user:users!reviews_user_id_fkey(id, first_name, last_name, avatar_url),
          service:services(id, name)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur addProviderResponse:', error);
      throw new Error(error.message || 'Erreur lors de l\'ajout de la réponse');
    }
  }

  /**
   * Supprimer la réponse du prestataire
   */
  static async removeProviderResponse(reviewId: string, providerId: string) {
    try {
      // Vérifier que l'avis appartient bien au prestataire
      const { data: review, error: checkError } = await supabase
        .from('reviews')
        .select('provider_id')
        .eq('id', reviewId)
        .single();

      if (checkError) throw checkError;
      if (review.provider_id !== providerId) {
        throw new Error('Vous n\'êtes pas autorisé à modifier cet avis');
      }

      // Supprimer la réponse
      const { data, error } = await supabase
        .from('reviews')
        .update({
          provider_response: null,
          provider_response_at: null,
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur removeProviderResponse:', error);
      throw new Error(error.message || 'Erreur lors de la suppression de la réponse');
    }
  }

  /**
   * Supprimer un avis
   */
  static async deleteReview(reviewId: string) {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Erreur deleteReview:', error);
      throw new Error(error.message || 'Erreur lors de la suppression de l\'avis');
    }
  }
}

