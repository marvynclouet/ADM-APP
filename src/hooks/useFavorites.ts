import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceProvider } from '../types';

const FAVORITES_KEY = '@adm_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les favoris au démarrage
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  };

  const addFavorite = useCallback(async (providerId: string) => {
    const newFavorites = [...favorites, providerId];
    await saveFavorites(newFavorites);
  }, [favorites]);

  const removeFavorite = useCallback(async (providerId: string) => {
    const newFavorites = favorites.filter(id => id !== providerId);
    await saveFavorites(newFavorites);
  }, [favorites]);

  const toggleFavorite = useCallback(async (providerId: string) => {
    if (favorites.includes(providerId)) {
      await removeFavorite(providerId);
    } else {
      await addFavorite(providerId);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((providerId: string) => {
    return favorites.includes(providerId);
  }, [favorites]);

  const clearFavorites = async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      setFavorites([]);
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
    }
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
};

