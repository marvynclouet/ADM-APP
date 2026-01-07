/**
 * Service de gestion des réservations
 */

import { supabase } from '../supabase/config';

export class BookingsService {
  /**
   * Créer une réservation
   */
  static async createBooking(bookingData: {
    userId: string;
    providerId: string;
    serviceId: string;
    bookingDate: string;
    bookingTime: string;
    durationMinutes: number;
    totalPrice: number;
    isEmergency?: boolean;
    emergencyReason?: string;
    clientNotes?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: bookingData.userId,
          provider_id: bookingData.providerId,
          service_id: bookingData.serviceId,
          booking_date: bookingData.bookingDate,
          booking_time: bookingData.bookingTime,
          duration_minutes: bookingData.durationMinutes,
          total_price: bookingData.totalPrice,
          is_emergency: bookingData.isEmergency || false,
          emergency_reason: bookingData.emergencyReason,
          client_notes: bookingData.clientNotes,
          status: 'pending',
        })
        .select(`
          *,
          service:services(*),
          provider:users!bookings_provider_id_fkey(*),
          user:users!bookings_user_id_fkey(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur createBooking:', error);
      throw new Error(error.message || 'Erreur lors de la création de la réservation');
    }
  }

  /**
   * Récupérer les réservations d'un utilisateur
   */
  static async getUserBookings(userId: string, filters?: {
    status?: string;
    upcoming?: boolean;
  }) {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          service:services(*),
          provider:users!bookings_provider_id_fkey(*)
        `)
        .eq('user_id', userId);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.upcoming) {
        query = query.gte('booking_date', new Date().toISOString().split('T')[0]);
      }

      query = query.order('booking_date', { ascending: true })
                   .order('booking_time', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur getUserBookings:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des réservations');
    }
  }

  /**
   * Récupérer les réservations d'un prestataire
   */
  static async getProviderBookings(providerId: string, filters?: {
    status?: string;
    date?: string;
  }) {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          service:services(*),
          user:users!bookings_user_id_fkey(*)
        `)
        .eq('provider_id', providerId);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.date) {
        query = query.eq('booking_date', filters.date);
      }

      query = query.order('booking_date', { ascending: true })
                   .order('booking_time', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur getProviderBookings:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des réservations');
    }
  }

  /**
   * Mettre à jour le statut d'une réservation
   */
  static async updateBookingStatus(
    bookingId: string,
    status: 'confirmed' | 'cancelled' | 'completed' | 'no_show' | 'pending',
    notes?: string
  ) {
    try {
      const updateData: any = { status };
      if (notes) {
        updateData.provider_notes = notes;
      }
      if (status === 'cancelled' && notes) {
        updateData.cancellation_reason = notes;
      }

      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur updateBookingStatus:', error);
      throw new Error(error.message || 'Erreur lors de la mise à jour de la réservation');
    }
  }

  /**
   * Modifier la date et l'heure d'une réservation
   */
  static async updateBookingDateTime(
    bookingId: string,
    bookingDate: string,
    bookingTime: string
  ) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          booking_date: bookingDate,
          booking_time: bookingTime,
        })
        .eq('id', bookingId)
        .select(`
          *,
          service:services(*),
          user:users!bookings_user_id_fkey(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erreur updateBookingDateTime:', error);
      throw new Error(error.message || 'Erreur lors de la modification de la réservation');
    }
  }
}






