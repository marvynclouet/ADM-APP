import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { useFavorites } from '../hooks/useFavorites';
import { FavoritesService } from '../../backend/services/favorites.service';
import { ServicesService } from '../../backend/services/services.service';
import { AuthService } from '../../backend/services/auth.service';
import ProviderCard from '../components/ProviderCard';
import FavoriteButton from '../components/FavoriteButton';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { useFocusEffect } from '@react-navigation/native';
import LoadingSpinner from '../components/LoadingSpinner';

interface FavoritesScreenProps {
  navigation?: any;
  onNavigateToProvider?: (providerId: string) => void;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation, onNavigateToProvider }) => {
  const { favorites, isLoading: favoritesLoading, toggleFavorite, isFavorite, refreshFavorites } = useFavorites();
  const { toast, showSuccess, showInfo, hideToast, showError } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favoriteProviders, setFavoriteProviders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Charger l'utilisateur actuel
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user && user.id) {
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
      }
    };
    loadUser();
  }, []);

  // Charger les favoris avec les providers depuis Supabase
  const loadFavorites = useCallback(async () => {
    if (!currentUserId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Récupérer les favoris avec les providers
      const favoritesData = await FavoritesService.getUserFavorites(currentUserId);
      
      // Transformer les données pour correspondre au format attendu
      const providers = favoritesData.map((fav: any) => {
        const provider = fav.provider;
        if (!provider) return null;
        
        // Construire l'adresse complète
        const addressParts = [];
        if (provider.address) addressParts.push(provider.address);
        if (provider.neighborhood) addressParts.push(provider.neighborhood);
        if (provider.city) addressParts.push(provider.city);
        const fullAddress = addressParts.length > 0 
          ? addressParts.join(', ') 
          : provider.activity_zone || provider.city || 'Adresse non spécifiée';
        
        return {
          id: provider.id,
          name: `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || provider.email,
          firstName: provider.first_name || '',
          lastName: provider.last_name || '',
          email: provider.email,
          phone: provider.phone,
          avatar: provider.avatar_url,
          city: provider.city,
          neighborhood: provider.neighborhood,
          activityZone: provider.activity_zone,
          description: provider.description || 'Aucune description',
          mainSkills: provider.main_skills || [],
          experience: provider.experience_years || 0,
          experienceYears: provider.experience_years || 0,
          experienceLevel: provider.experience_level || 'beginner',
          isPremium: provider.is_premium || false,
          acceptsEmergency: provider.accepts_emergency || false,
          rating: 0, // À calculer depuis les reviews si nécessaire
          reviewCount: 0, // À calculer depuis les reviews si nécessaire
          services: [], // Sera chargé séparément
          categoryId: fav.category_id,
          category: fav.category,
          // Location object requis par ProviderCard
          location: {
            latitude: provider.latitude ? parseFloat(provider.latitude) : 0,
            longitude: provider.longitude ? parseFloat(provider.longitude) : 0,
            address: fullAddress,
            city: provider.city || '',
            postalCode: '', // Non disponible dans le schéma actuel
          },
          // Autres propriétés requises par ServiceProvider
          priceRange: {
            min: 0, // À calculer depuis les services
            max: 0, // À calculer depuis les services
          },
          availability: [], // À charger depuis la table availability si nécessaire
          certifications: [], // À charger depuis la table certificates si nécessaire
          isProvider: true,
          verified: provider.verified || false,
          socialMedia: {
            instagram: provider.instagram,
            tiktok: provider.tiktok,
            facebook: provider.facebook,
          },
        };
      }).filter((p: any) => p !== null);

      // Charger les services pour chaque provider et calculer le priceRange
      const providersWithServices = await Promise.all(
        providers.map(async (provider: any) => {
          try {
            const services = await ServicesService.getServices({
              providerId: provider.id,
              isActive: true,
            });
            
            // Calculer le priceRange depuis les services
            let minPrice = 0;
            let maxPrice = 0;
            if (services && services.length > 0) {
              const prices = services.map((s: any) => s.price || 0).filter((p: number) => p > 0);
              if (prices.length > 0) {
                minPrice = Math.min(...prices);
                maxPrice = Math.max(...prices);
              }
            }
            
            return {
              ...provider,
              services: services || [],
              priceRange: {
                min: minPrice,
                max: maxPrice,
              },
            };
          } catch (error) {
            console.error(`Erreur lors du chargement des services pour ${provider.id}:`, error);
            return {
              ...provider,
              services: [],
            };
          }
        })
      );

      // Charger les catégories pour les filtres
      try {
        const categoriesData = await ServicesService.getCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }

      setFavoriteProviders(providersWithServices);
    } catch (error: any) {
      console.error('Erreur lors du chargement des favoris:', error);
      showError(error.message || 'Erreur lors du chargement des favoris');
      setFavoriteProviders([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  // Recharger les favoris quand l'écran est focus
  useFocusEffect(
    useCallback(() => {
      if (currentUserId) {
        loadFavorites();
      }
    }, [currentUserId, loadFavorites])
  );

  // Filtrer par catégorie
  const filteredProviders = useMemo(() => {
    try {
      if (selectedCategory === 'all') {
        return favoriteProviders;
      }
      return favoriteProviders.filter(provider => {
        try {
          // Vérifier si le provider a la catégorie dans ses favoris
          if (provider.categoryId === selectedCategory) {
            return true;
          }
          // Vérifier si le provider a des services dans cette catégorie
          if (provider.services && provider.services.length > 0) {
            return provider.services.some((service: any) => {
              try {
                if (service.category_id === selectedCategory || 
                    (service.category && service.category.id === selectedCategory)) {
                  return true;
                }
                return false;
              } catch (e) {
                console.error('Erreur lors du filtrage d\'un service:', e);
                return false;
              }
            });
          }
          return false;
        } catch (e) {
          console.error('Erreur lors du filtrage d\'un prestataire par catégorie:', e);
          return false;
        }
      });
    } catch (error) {
      console.error('Erreur lors du filtrage par catégorie:', error);
      return favoriteProviders; // Retourner tous les favoris en cas d'erreur
    }
  }, [favoriteProviders, selectedCategory]);

  const handleProviderPress = (providerId: string) => {
    if (onNavigateToProvider) {
      onNavigateToProvider(providerId);
    } else if (navigation) {
      const provider = favoriteProviders.find(p => p.id === providerId);
      if (provider) {
        navigation.navigate('Search', {
          screen: 'ProviderDetail',
          params: { provider },
        });
      }
    }
  };

  const handleToggleFavorite = async (providerId: string) => {
    try {
      await toggleFavorite(providerId);
      // Recharger les favoris après modification
      await loadFavorites();
      const isNowFavorite = isFavorite(providerId);
      if (isNowFavorite) {
        showSuccess('Ajouté aux favoris ❤️');
      } else {
        showInfo('Retiré des favoris');
      }
    } catch (error: any) {
      console.error('Erreur lors de la modification des favoris:', error);
      showError(error.message || 'Erreur lors de la modification des favoris');
    }
  };

  if (isLoading || favoritesLoading || !currentUserId) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner text="Chargement de vos favoris..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        <Text style={styles.headerSubtitle}>
          {favoriteProviders.length} prestataire{favoriteProviders.length > 1 ? 's' : ''}
        </Text>
      </LinearGradient>

      {favoriteProviders.length === 0 ? (
        // État vide
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptyText}>
            Ajoutez vos prestataires préférés à vos favoris pour les retrouver facilement
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation?.navigate('Search')}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.exploreButtonGradient}
            >
              <Ionicons name="search" size={20} color={COLORS.white} />
              <Text style={styles.exploreButtonText}>Explorer les prestataires</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          {/* Filtres par catégorie */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedCategory === 'all' && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === 'all' && styles.filterChipTextActive,
                ]}
              >
                Tous ({favoriteProviders.length})
              </Text>
            </TouchableOpacity>

            {categories.map(category => {
              try {
                const count = favoriteProviders.filter(provider => {
                  try {
                    // Vérifier si le provider a la catégorie dans ses favoris
                    if (provider.categoryId === category.id) {
                      return true;
                    }
                    // Vérifier si le provider a des services dans cette catégorie
                    if (provider.services && provider.services.length > 0) {
                      return provider.services.some((service: any) => {
                        try {
                          return service.category_id === category.id || 
                                 (service.category && service.category.id === category.id);
                        } catch (e) {
                          return false;
                        }
                      });
                    }
                    return false;
                  } catch (e) {
                    return false;
                  }
                }).length;

                if (count === 0) return null;

                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.filterChip,
                      selectedCategory === category.id && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedCategory === category.id && styles.filterChipTextActive,
                      ]}
                    >
                      {category.name} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              } catch (error) {
                console.error(`Erreur lors de l'affichage de la catégorie ${category.id}:`, error);
                return null;
              }
            })}
          </ScrollView>

          {/* Liste des favoris */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, { paddingBottom: 40 }]}
          >
            {filteredProviders.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={48} color={COLORS.textSecondary} />
                <Text style={styles.noResultsText}>
                  Aucun prestataire dans cette catégorie
                </Text>
              </View>
            ) : (
              filteredProviders.map(provider => (
                <View key={provider.id} style={styles.providerCardContainer}>
                  <ProviderCard
                    provider={provider}
                    onPress={() => handleProviderPress(provider.id)}
                  />
                  <View style={styles.favoriteButtonOverlay}>
                    <FavoriteButton
                      isFavorite={isFavorite(provider.id)}
                      onPress={() => handleToggleFavorite(provider.id)}
                      size={28}
                    />
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' } : { elevation: 4 }),
  },
  exploreButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  filtersContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  providerCardContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  favoriteButtonOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)' } : { elevation: 3 }),
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default FavoritesScreen;




