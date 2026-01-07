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
        .maybeSingle();

      if (error) {
        console.error('Erreur getUserById:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Utilisateur non trouvé');
      }
      
      return data;
    } catch (error: any) {
      console.error('Erreur getUserById:', error);
      throw new Error(error.message || 'Erreur lors de la récupération de l\'utilisateur');
    }
  }

  /**
   * Créer un profil utilisateur s'il n'existe pas
   */
  static async createProfileIfMissing(userId: string) {
    try {
      // Vérifier si le profil existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (existingUser) {
        return existingUser;
      }

      // Récupérer les infos de l'utilisateur authentifié
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser || authUser.id !== userId) {
        throw new Error('Utilisateur non authentifié');
      }

      // Créer le profil manquant
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: authUser.email || '',
          password_hash: '',
          is_provider: false,
          verified: authUser.email_confirmed_at ? true : false,
          first_name: null,
          last_name: null,
        })
        .select()
        .single();

      if (createError) {
        console.error('Erreur création profil:', createError);
        // Si erreur de duplicate key, le profil existe peut-être maintenant
        if (createError.code === '23505') {
          return await this.getUserById(userId);
        }
        throw createError;
      }

      return newUser;
    } catch (error: any) {
      console.error('Erreur createProfileIfMissing:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  static async updateProfile(userId: string, updates: any) {
    try {
      // D'abord, s'assurer que le profil existe
      try {
        await this.createProfileIfMissing(userId);
      } catch (createError: any) {
        console.warn('Impossible de créer le profil manquant:', createError);
        // Continuer quand même, peut-être que le profil existe déjà
      }

      // Filtrer les valeurs null/undefined pour éviter de mettre à jour avec null inutilement
      const cleanUpdates: any = {};
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined && updates[key] !== '') {
          cleanUpdates[key] = updates[key];
        } else if (updates[key] === null) {
          // Permettre explicitement null pour réinitialiser des champs
          cleanUpdates[key] = null;
        }
      });

      // Si aucun champ à mettre à jour, retourner les données actuelles
      if (Object.keys(cleanUpdates).length === 0) {
        return await this.getUserById(userId);
      }

      const { data, error } = await supabase
        .from('users')
        .update(cleanUpdates)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Erreur Supabase updateProfile:', error);
        
        // Si erreur 406 ou PGRST116, le profil n'existe peut-être pas
        if (error.code === 'PGRST116' || error.code === '406') {
          // Essayer de créer le profil et réessayer
          try {
            await this.createProfileIfMissing(userId);
            // Réessayer la mise à jour
            const { data: retryData, error: retryError } = await supabase
              .from('users')
              .update(cleanUpdates)
              .eq('id', userId)
              .select()
              .maybeSingle();
            
            if (retryError) {
              throw retryError;
            }
            return retryData;
          } catch (retryErr: any) {
            throw new Error('Erreur de permissions. Exécutez le script SQL fix-missing-user-profiles.sql dans Supabase SQL Editor pour créer les profils manquants.');
          }
        }
        throw error;
      }

      // Si aucune donnée retournée, essayer de récupérer l'utilisateur pour vérifier
      if (!data) {
        console.warn('Aucune donnée retournée après mise à jour, tentative de récupération...');
        try {
          const userData = await this.getUserById(userId);
          if (userData) {
            return userData;
          }
        } catch (getError: any) {
          console.error('Erreur lors de la récupération après mise à jour:', getError);
        }
        throw new Error('Impossible de mettre à jour le profil. Le profil n\'existe peut-être pas. Exécutez le script fix-missing-user-profiles.sql dans Supabase.');
      }

      return data;
    } catch (error: any) {
      console.error('Erreur updateProfile:', error);
      
      // Messages d'erreur plus explicites
      if (error.code === 'PGRST116' || error.code === '406') {
        throw new Error('Profil utilisateur introuvable. Exécutez le script SQL fix-missing-user-profiles.sql dans Supabase SQL Editor pour créer les profils manquants.');
      } else if (error.code === '42501') {
        throw new Error('Vous n\'avez pas les permissions pour modifier ce profil. Vérifiez les politiques RLS dans Supabase.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Erreur lors de la mise à jour du profil');
      }
    }
  }

  /**
   * Uploader une photo de profil depuis une URI (React Native)
   */
  static async uploadAvatarFromUri(userId: string, uri: string) {
    try {
      // S'assurer que le profil existe
      await this.createProfileIfMissing(userId);

      // Extraire l'extension du fichier depuis l'URI
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Supprimer l'ancien avatar s'il existe
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', userId)
          .maybeSingle();
        
        if (userData?.avatar_url && userData.avatar_url.includes('/avatars/')) {
          const oldFileName = userData.avatar_url.split('/avatars/')[1]?.split('?')[0];
          if (oldFileName) {
            await supabase.storage
              .from('avatars')
              .remove([oldFileName]);
          }
        }
      }

      // Lire le fichier depuis l'URI
      // Dans React Native, on doit utiliser FormData ou lire le fichier différemment
      // Supabase Storage accepte FormData dans React Native
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: `image/${fileExt === 'png' ? 'png' : fileExt === 'webp' ? 'webp' : 'jpeg'}`,
        name: fileName,
      } as any);

      // Uploader le nouveau fichier
      // Pour React Native, on utilise l'URI directement avec FormData
      const fileBody = {
        uri: uri,
        type: `image/${fileExt === 'png' ? 'png' : fileExt === 'webp' ? 'webp' : 'jpeg'}`,
        name: fileName,
      } as any;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, fileBody, {
          cacheControl: '3600',
          upsert: false,
          contentType: `image/${fileExt === 'png' ? 'png' : fileExt === 'webp' ? 'webp' : 'jpeg'}`,
        });

      if (uploadError) {
        if (uploadError.message?.includes('already exists')) {
          const newFileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const newFilePath = newFileName;
          const retryFileBody = {
            uri: uri,
            type: `image/${fileExt === 'png' ? 'png' : fileExt === 'webp' ? 'webp' : 'jpeg'}`,
            name: newFileName,
          } as any;

          const { error: retryError } = await supabase.storage
            .from('avatars')
            .upload(newFilePath, retryFileBody, {
              cacheControl: '3600',
              upsert: false,
              contentType: `image/${fileExt === 'png' ? 'png' : fileExt === 'webp' ? 'webp' : 'jpeg'}`,
            });
          if (retryError) throw retryError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(newFilePath);

          const { data, error } = await supabase
            .from('users')
            .update({ avatar_url: publicUrl })
            .eq('id', userId)
            .select()
            .maybeSingle();

          if (error) throw error;
          return data || { avatar_url: publicUrl };
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { data, error } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data || { avatar_url: publicUrl };
    } catch (error: any) {
      console.error('Erreur uploadAvatarFromUri:', error);
      throw new Error(error.message || 'Erreur lors de l\'upload de l\'avatar');
    }
  }

  /**
   * Uploader une photo de profil (Web - File/Blob)
   */
  static async uploadAvatar(userId: string, file: File | Blob) {
    try {
      // S'assurer que le profil existe
      await this.createProfileIfMissing(userId);

      const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      // Le bucket est déjà "avatars", donc on ne met pas le préfixe dans le chemin
      const filePath = fileName;

      // Supprimer l'ancien avatar s'il existe
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', userId)
          .maybeSingle();
        
        if (userData?.avatar_url && userData.avatar_url.includes('/avatars/')) {
          // Extraire le nom du fichier de l'URL
          const oldFileName = userData.avatar_url.split('/avatars/')[1]?.split('?')[0];
          if (oldFileName) {
            await supabase.storage
              .from('avatars')
              .remove([oldFileName]);
          }
        }
      }

      // Uploader le nouveau fichier
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        // Si le fichier existe déjà, essayer avec un nom différent
        if (uploadError.message?.includes('already exists')) {
          const newFileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const newFilePath = newFileName;
          const { error: retryError } = await supabase.storage
            .from('avatars')
            .upload(newFilePath, file, {
              cacheControl: '3600',
              upsert: false
            });
          if (retryError) throw retryError;
          
          // Récupérer l'URL publique avec le nouveau chemin
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(newFilePath);

          // Mettre à jour le profil avec l'URL
          const { data, error } = await supabase
            .from('users')
            .update({ avatar_url: publicUrl })
            .eq('id', userId)
            .select()
            .maybeSingle();

          if (error) throw error;
          return data || { avatar_url: publicUrl };
        }
        throw uploadError;
      }

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
        .maybeSingle();

      if (error) throw error;
      return data || { avatar_url: publicUrl };
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



