import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { useFavorites } from '../hooks/useFavorites';
import { SERVICE_PROVIDERS, SERVICE_CATEGORIES } from '../constants/mockData';
import ProviderCard from '../components/ProviderCard';
import FavoriteButton from '../components/FavoriteButton';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

interface FavoritesScreenProps {
  navigation?: any;
  onNavigateToProvider?: (providerId: string) => void;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation, onNavigateToProvider }) => {
  const { favorites, isLoading, toggleFavorite, isFavorite } = useFavorites();
  const { toast, showSuccess, showInfo, hideToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtrer les prestataires favoris
  const favoriteProviders = useMemo(() => {
    try {
      if (!favorites || !Array.isArray(favorites)) {
        return [];
      }
      return SERVICE_PROVIDERS.filter(provider => {
        try {
          return provider && provider.id && favorites.includes(provider.id);
        } catch (e) {
          console.error('Erreur lors du filtrage d\'un prestataire:', e);
          return false;
        }
      });
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      return [];
    }
  }, [favorites]);

  // Filtrer par catégorie
  const filteredProviders = useMemo(() => {
    try {
      if (selectedCategory === 'all') {
        return favoriteProviders;
      }
      return favoriteProviders.filter(provider => {
        try {
          if (!provider || !provider.services || provider.services.length === 0) {
            return false;
          }
          // provider.services est maintenant un tableau d'objets Service
          return provider.services.some(service => {
            try {
              if (typeof service === 'object' && service !== null && 'category' in service) {
                return service.category && service.category.id === selectedCategory;
              }
              // Fallback pour les anciennes données
              return false;
            } catch (e) {
              console.error('Erreur lors du filtrage d\'un service:', e);
              return false;
            }
          });
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
      const provider = SERVICE_PROVIDERS.find(p => p.id === providerId);
      navigation.navigate('Search', {
        screen: 'ProviderDetail',
        params: { provider },
      });
    }
  };

  const handleToggleFavorite = async (providerId: string) => {
    await toggleFavorite(providerId);
    const isNowFavorite = isFavorite(providerId);
    if (isNowFavorite) {
      showSuccess('Ajouté aux favoris ❤️');
    } else {
      showInfo('Retiré des favoris');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement de vos favoris...</Text>
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
          {favorites.length} prestataire{favorites.length > 1 ? 's' : ''}
        </Text>
      </LinearGradient>

      {favorites.length === 0 ? (
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

            {SERVICE_CATEGORIES.map(category => {
              try {
                const count = favoriteProviders.filter(provider => {
                  try {
                    if (!provider || !provider.services || provider.services.length === 0) {
                      return false;
                    }
                    return provider.services.some(service => {
                      try {
                        if (typeof service === 'object' && service !== null && 'category' in service) {
                          return service.category && service.category.id === category.id;
                        }
                        return false;
                      } catch (e) {
                        return false;
                      }
                    });
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
            contentContainerStyle={styles.listContent}
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
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
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
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
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




