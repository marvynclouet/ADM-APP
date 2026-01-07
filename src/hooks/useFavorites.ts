import { useState, useEffect, useCallback } from 'react';
import { FavoritesService } from '../../backend/services/favorites.service';
import { AuthService } from '../../backend/services/auth.service';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Charger l'utilisateur actuel et les favoris au démarrage
  useEffect(() => {
    const loadUserAndFavorites = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user && user.id) {
          setCurrentUserId(user.id);
          await loadFavorites(user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        setIsLoading(false);
      }
    };
    loadUserAndFavorites();
  }, []);

  const loadFavorites = async (userId: string) => {
    try {
      setIsLoading(true);
      const favoriteIds = await FavoritesService.getUserFavoriteProviderIds(userId);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = useCallback(async (providerId: string, categoryId?: string) => {
    if (!currentUserId) {
      console.warn('Aucun utilisateur connecté, impossible d\'ajouter aux favoris');
      return;
    }

    try {
      await FavoritesService.addProviderFavorite(currentUserId, providerId, categoryId);
      // Recharger les favoris pour avoir la liste à jour
      await loadFavorites(currentUserId);
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      throw error;
    }
  }, [currentUserId]);

  const addServiceFavorite = useCallback(async (serviceId: string, providerId: string, categoryId?: string) => {
    if (!currentUserId) {
      console.warn('Aucun utilisateur connecté, impossible d\'ajouter le service aux favoris');
      return;
    }

    try {
      await FavoritesService.addServiceFavorite(currentUserId, serviceId, providerId, categoryId);
      // Recharger les favoris pour avoir la liste à jour
      await loadFavorites(currentUserId);
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du service aux favoris:', error);
      throw error;
    }
  }, [currentUserId]);

  const removeFavorite = useCallback(async (providerId: string) => {
    if (!currentUserId) {
      console.warn('Aucun utilisateur connecté, impossible de retirer des favoris');
      return;
    }

    try {
      await FavoritesService.removeProviderFavorite(currentUserId, providerId);
      // Recharger les favoris pour avoir la liste à jour
      await loadFavorites(currentUserId);
    } catch (error: any) {
      console.error('Erreur lors de la suppression des favoris:', error);
      throw error;
    }
  }, [currentUserId]);

  const removeServiceFavorite = useCallback(async (providerId: string) => {
    if (!currentUserId) {
      console.warn('Aucun utilisateur connecté, impossible de retirer le service des favoris');
      return;
    }

    try {
      await FavoritesService.removeServiceFavorite(currentUserId, providerId);
      // Recharger les favoris pour avoir la liste à jour
      await loadFavorites(currentUserId);
    } catch (error: any) {
      console.error('Erreur lors de la suppression du service des favoris:', error);
      throw error;
    }
  }, [currentUserId]);

  const toggleFavorite = useCallback(async (providerId: string, categoryId?: string) => {
    if (!currentUserId) {
      console.warn('Aucun utilisateur connecté, impossible de modifier les favoris');
      return;
    }

    try {
      await FavoritesService.toggleFavorite(currentUserId, providerId, categoryId);
      // Recharger les favoris pour avoir la liste à jour
      await loadFavorites(currentUserId);
    } catch (error: any) {
      console.error('Erreur lors de la modification des favoris:', error);
      throw error;
    }
  }, [currentUserId]);

  const toggleServiceFavorite = useCallback(async (serviceId: string, providerId: string, categoryId?: string) => {
    if (!currentUserId) {
      console.warn('Aucun utilisateur connecté, impossible de modifier les favoris');
      return;
    }

    try {
      // Pour les services, on toggle le provider en favoris
      await FavoritesService.toggleFavorite(currentUserId, providerId, categoryId);
      // Recharger les favoris pour avoir la liste à jour
      await loadFavorites(currentUserId);
    } catch (error: any) {
      console.error('Erreur lors de la modification des favoris du service:', error);
      throw error;
    }
  }, [currentUserId]);

  const isFavorite = useCallback((providerId: string) => {
    return favorites.includes(providerId);
  }, [favorites]);

  const clearFavorites = async () => {
    if (!currentUserId) {
      console.warn('Aucun utilisateur connecté, impossible de supprimer les favoris');
      return;
    }

    try {
      // Supprimer tous les favoris un par un
      for (const providerId of favorites) {
        await FavoritesService.removeProviderFavorite(currentUserId, providerId);
      }
      setFavorites([]);
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
    }
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    addServiceFavorite,
    removeFavorite,
    removeServiceFavorite,
    toggleFavorite,
    toggleServiceFavorite,
    isFavorite,
    clearFavorites,
    refreshFavorites: () => currentUserId ? loadFavorites(currentUserId) : Promise.resolve(),
  };
};








