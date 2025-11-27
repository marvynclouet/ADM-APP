/**
 * Configuration Supabase Client
 * Simple et efficace pour l'application ADM
 */

import { createClient } from '@supabase/supabase-js';

// Variables d'environnement Supabase
// À définir dans votre projet Supabase
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ Variables Supabase manquantes. ' +
    'Créez un fichier .env avec EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Client Supabase pour le frontend (React Native)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types pour TypeScript (générés automatiquement par Supabase CLI)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          password_hash: string;
          is_provider: boolean;
          verified: boolean;
          first_name: string | null;
          last_name: string | null;
          age: number | null;
          avatar_url: string | null;
          city: string | null;
          neighborhood: string | null;
          activity_zone: string | null;
          latitude: number | null;
          longitude: number | null;
          address: string | null;
          main_skills: string[] | null;
          description: string | null;
          experience_years: number | null;
          experience_level: 'beginner' | 'intermediate' | 'expert' | null;
          instagram: string | null;
          tiktok: string | null;
          facebook: string | null;
          subscription_type: 'free' | 'premium';
          subscription_start_date: string | null;
          subscription_expiry_date: string | null;
          is_premium: boolean;
          accepts_emergency: boolean;
          emergency_credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      services: {
        Row: {
          id: string;
          provider_id: string;
          category_id: string;
          subcategory_id: string | null;
          name: string;
          description: string | null;
          price: number;
          duration_minutes: number;
          image_url: string | null;
          level: 'beginner' | 'intermediate' | 'advanced' | 'pro' | null;
          is_custom: boolean;
          moderation_status: 'pending' | 'approved' | 'rejected';
          moderated_at: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          provider_id: string;
          service_id: string;
          booking_date: string;
          booking_time: string;
          duration_minutes: number;
          total_price: number;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
          is_emergency: boolean;
          emergency_reason: string | null;
          emergency_markup: number;
          client_notes: string | null;
          provider_notes: string | null;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          user_id: string;
          provider_id: string;
          service_id: string | null;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          provider_id: string;
          category_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
      };
    };
  };
};

