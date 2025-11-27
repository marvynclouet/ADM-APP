import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ServiceListItem from '../components/ServiceListItem';
import ServiceCardView from '../components/ServiceCardView';
import ServiceMap from '../components/ServiceMap';
import ProviderDetailScreen from './ProviderDetailScreen';
import { SERVICE_CATEGORIES, SERVICES, SERVICE_PROVIDERS, SERVICE_DISTANCES } from '../constants/mockData';
import { COLORS } from '../constants/colors';
import { Service } from '../types';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { useFavorites } from '../hooks/useFavorites';
import ProviderCard from '../components/ProviderCard';
import ProviderCardPlanity from '../components/ProviderCardPlanity';

interface SearchScreenProps {
  navigation?: any;
  onNavigateToProfile?: () => void;
  onNavigateToEmergency?: (provider: any) => void;
}

type ViewState = 'categories' | 'subcategories' | 'results';

const SearchScreen: React.FC<SearchScreenProps> = ({ 
  navigation,
  onNavigateToProfile,
  onNavigateToEmergency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [viewState, setViewState] = useState<ViewState>('categories');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const { toast, showInfo, showSuccess, hideToast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Combiner les services avec leurs prestataires et distances
  const servicesWithProviders = useMemo(() => {
    return SERVICES.map(service => {
      const provider = SERVICE_PROVIDERS.find(p => p.services.some(s => s.id === service.id));
      const distance = SERVICE_DISTANCES[service.id as keyof typeof SERVICE_DISTANCES] || 0;
      return {
        service,
        provider: provider!,
        distance
      };
    });
  }, []);

  // Filtrer et trier les services
  const filteredServices = useMemo(() => {
    let filtered = servicesWithProviders;

    // Filtre par recherche (amélioré avec les nouveaux champs)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const service = item.service;
        const provider = item.provider;
        
        // Recherche dans le service
        const serviceMatch = 
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          (service.subcategory?.name.toLowerCase().includes(query) || false);
        
        // Recherche dans le prestataire
        const providerMatch = 
          provider.name.toLowerCase().includes(query) ||
          provider.firstName?.toLowerCase().includes(query) ||
          provider.lastName?.toLowerCase().includes(query) ||
          provider.description?.toLowerCase().includes(query) ||
          provider.activityZone?.toLowerCase().includes(query) ||
          provider.city?.toLowerCase().includes(query) ||
          (provider.mainSkills?.some(skill => skill.toLowerCase().includes(query)) || false);
        
        return serviceMatch || providerMatch;
      });
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(item =>
        item.service.category.id === selectedCategory || 
        item.service.category.name === selectedCategory
      );
    }

    // Filtre par sous-catégorie
    if (selectedSubcategory) {
      filtered = filtered.filter(item =>
        item.service.subcategory?.id === selectedSubcategory
      );
    }

    // Trier par distance (plus proche en premier)
    return filtered.sort((a, b) => a.distance - b.distance);
  }, [servicesWithProviders, searchQuery, selectedCategory, selectedSubcategory]);

  // Grouper les prestataires uniques pour la vue Planity
  const uniqueProviders = useMemo(() => {
    const providerMap = new Map();
    filteredServices.forEach(item => {
      if (!providerMap.has(item.provider.id)) {
        providerMap.set(item.provider.id, {
          provider: item.provider,
          services: [item.service],
          distance: item.distance
        });
      } else {
        const existing = providerMap.get(item.provider.id);
        if (!existing.services.find((s: Service) => s.id === item.service.id)) {
          existing.services.push(item.service);
        }
      }
    });
    return Array.from(providerMap.values());
  }, [filteredServices]);

  const handleServicePress = (serviceId: string) => {
    const serviceData = filteredServices.find(item => item.service.id === serviceId);
    if (serviceData) {
      if (navigation) {
        navigation.navigate('Réservation', {
          service: serviceData.service,
          provider: serviceData.provider
        });
      } else {
        setSelectedProvider(serviceData.provider);
      }
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    const category = SERVICE_CATEGORIES.find(c => c.id === categoryId);
    if (category) {
      setSelectedCategory(category.id);
      setSelectedSubcategory(null);
      setViewState('subcategories'); // Passer à la vue sous-catégories
    }
  };

  const handleSubcategoryPress = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    setViewState('results'); // Passer à la vue résultats (prestataires/services)
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setViewState('categories');
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategory(null);
    setViewState('subcategories');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setViewState('categories');
  };

  // Obtenir les sous-catégories de la catégorie sélectionnée
  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const category = SERVICE_CATEGORIES.find(c => c.id === selectedCategory);
    return category?.subcategories || [];
  }, [selectedCategory]);

  const handleBackFromProvider = () => {
    setSelectedProvider(null);
  };

  const handleServicePressFromProvider = (service: Service) => {
    console.log('Service selected from provider:', service.name);
    if (navigation) {
      navigation.navigate('Réservation', {
        service: service,
        provider: selectedProvider
      });
    }
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  // Si un prestataire est sélectionné, afficher sa page de détails
  if (selectedProvider) {
    return (
      <ProviderDetailScreen
        provider={selectedProvider}
        onBack={handleBackFromProvider}
        onServicePress={handleServicePressFromProvider}
      />
    );
  }

  // Si la carte est activée, afficher la vraie carte interactive
  if (showMap) {
    return (
      <ServiceMap
        services={filteredServices}
        onServicePress={handleServicePress}
        onBackToList={toggleMapView}
      />
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

      {/* Header inspiré de Planity - Simple et épuré */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ADM</Text>
          <TouchableOpacity onPress={() => onNavigateToProfile?.()}>
            <View style={styles.profileButton}>
              <Ionicons name="person-outline" size={20} color={COLORS.textPrimary} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Barre de recherche inspirée de Planity */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Nom du salon, prestations (coupe...)"
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text) {
                setViewState('results');
              } else if (!selectedCategory) {
                setViewState('categories');
              }
            }}
          />
          {(searchQuery || selectedCategory || selectedSubcategory) && (
            <TouchableOpacity onPress={clearFilters}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtres en pills (inspiré de Planity) */}
        <View style={styles.filtersPillsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersPills}>
            <TouchableOpacity
              style={[styles.filterPill, viewState === 'results' && styles.filterPillActive]}
              onPress={() => setViewState('results')}
            >
              <Ionicons name="diamond-outline" size={16} color={viewState === 'results' ? COLORS.white : COLORS.textPrimary} />
              <Text style={[styles.filterPillText, viewState === 'results' && styles.filterPillTextActive]}>
                Prestations
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, showMap && styles.filterPillActive]}
              onPress={toggleMapView}
            >
              <Ionicons name="map-outline" size={16} color={showMap ? COLORS.white : COLORS.textPrimary} />
              <Text style={[styles.filterPillText, showMap && styles.filterPillTextActive]}>
                Carte
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterPill}
              onPress={() => showInfo('Filtres avancés à venir')}
            >
              <Ionicons name="filter-outline" size={16} color={COLORS.textPrimary} />
              <Text style={styles.filterPillText}>Filtres</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <View style={styles.content}>
        {/* Breadcrumb navigation */}
        {(viewState !== 'categories' || selectedCategory) && (
          <View style={styles.breadcrumb}>
            <TouchableOpacity 
              style={styles.breadcrumbItem}
              onPress={viewState === 'subcategories' ? handleBackToCategories : handleBackToSubcategories}
            >
              <Ionicons name="arrow-back" size={16} color={COLORS.primary} />
              <Text style={styles.breadcrumbText}>
                {viewState === 'subcategories' ? 'Catégories' : 'Sous-catégories'}
              </Text>
            </TouchableOpacity>
            {selectedCategory && (
              <Text style={styles.breadcrumbSeparator}>›</Text>
            )}
            {selectedCategory && (
              <Text style={styles.breadcrumbCurrent}>
                {SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.name}
              </Text>
            )}
            {selectedSubcategory && (
              <>
                <Text style={styles.breadcrumbSeparator}>›</Text>
                <Text style={styles.breadcrumbCurrent}>
                  {availableSubcategories.find(s => s.id === selectedSubcategory)?.name}
                </Text>
              </>
            )}
          </View>
        )}

        {/* Vue Catégories */}
        {viewState === 'categories' && (
          <View style={styles.listView}>
            <Text style={styles.sectionTitle}>Choisissez une catégorie</Text>
            <FlatList
              data={SERVICE_CATEGORIES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryListItem}
                  onPress={() => handleCategoryPress(item.id)}
                >
                  <View style={[styles.categoryIconContainer, { backgroundColor: item.color + '20' }]}>
                    <Ionicons 
                      name={item.icon as any} 
                      size={32} 
                      color={item.color} 
                    />
                  </View>
                  <View style={styles.categoryListItemContent}>
                    <Text style={styles.categoryListItemTitle}>{item.name}</Text>
                    <Text style={styles.categoryListItemSubtitle}>
                      {item.subcategories?.length || 0} sous-catégories
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Vue Sous-catégories */}
        {viewState === 'subcategories' && selectedCategory && (
          <View style={styles.listView}>
            <Text style={styles.sectionTitle}>
              Sous-catégories - {SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </Text>
            <FlatList
              data={availableSubcategories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.subcategoryListItem}
                  onPress={() => handleSubcategoryPress(item.id)}
                >
                  <View style={[styles.subcategoryIconContainer, { backgroundColor: COLORS.primary + '15' }]}>
                    <Ionicons 
                      name="ellipse" 
                      size={16} 
                      color={COLORS.primary} 
                    />
                  </View>
                  <View style={styles.subcategoryListItemContent}>
                    <Text style={styles.subcategoryListItemTitle}>{item.name}</Text>
                    <Text style={styles.subcategoryListItemSubtitle}>
                      {filteredServices.filter(s => s.service.subcategory?.id === item.id).length} prestataires
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Résultats - Prestataires/Services */}
        {(viewState === 'results' || searchQuery) && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {selectedSubcategory 
                  ? `Sélectionnez un prestataire - ${availableSubcategories.find(s => s.id === selectedSubcategory)?.name}`
                  : searchQuery 
                    ? 'Résultats de recherche'
                    : 'Sélectionnez un prestataire'}
              </Text>
              {selectedSubcategory && (
                <Text style={styles.resultsSubtitle}>
                  Les meilleurs prestataires aux alentours : Réservation en ligne
                </Text>
              )}
              <View style={styles.resultsControls}>
                <Text style={styles.resultsCount}>
                  {uniqueProviders.length} prestataire{uniqueProviders.length > 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {uniqueProviders.length === 0 ? (
              <View style={styles.noResults}>
                <Ionicons name="search" size={48} color={COLORS.textSecondary} />
                <Text style={styles.noResultsText}>
                  Aucun prestataire trouvé
                </Text>
                <Text style={styles.noResultsSubtext}>
                  {searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Essayez de modifier vos filtres'}
                </Text>
              </View>
            ) : (
              <FlatList
                data={uniqueProviders}
                keyExtractor={(item) => item.provider.id}
                renderItem={({ item }) => (
                  <ProviderCardPlanity
                    provider={item.provider}
                    onPress={() => {
                      setSelectedProvider(item.provider);
                    }}
                    isFavorite={isFavorite(item.provider.id)}
                    onToggleFavorite={async () => {
                      await toggleFavorite(item.provider.id);
                      if (isFavorite(item.provider.id)) {
                        showInfo('Retiré des favoris');
                      } else {
                        showSuccess('Ajouté aux favoris ❤️');
                      }
                    }}
                    onEmergencyPress={() => {
                      if (onNavigateToEmergency) {
                        onNavigateToEmergency(item.provider);
                      }
                    }}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.providersList}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  filtersPillsContainer: {
    marginTop: 8,
  },
  filtersPills: {
    gap: 8,
    paddingRight: 16,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  filterPillTextActive: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filtersSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  subcategoryChip: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  subcategoryChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  subcategoryChipText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  subcategoryChipTextActive: {
    color: COLORS.white,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    marginBottom: 8,
    borderRadius: 8,
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  breadcrumbText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginHorizontal: 8,
  },
  breadcrumbCurrent: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  listView: {
    flex: 1,
  },
  categoryListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryListItemContent: {
    flex: 1,
  },
  categoryListItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  categoryListItemSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  subcategoryListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 14,
    marginBottom: 8,
    marginLeft: 16,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  subcategoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subcategoryListItemContent: {
    flex: 1,
  },
  subcategoryListItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  subcategoryListItemSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  resultsSection: {
    marginBottom: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  resultsControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 10,
  },
  viewToggle: {
    flexDirection: 'row',
  },
  viewButton: {
    padding: 6,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: COLORS.primary,
  },
  servicesList: {
    paddingBottom: 20,
  },
  providersList: {
    paddingBottom: 20,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  gridContainer: {
    // This style is for the grid view to ensure proper spacing
    // and to prevent items from wrapping to the next line.
    // It's not directly used in the FlatList's contentContainerStyle
    // but is useful for layout hints.
  },
  gridRow: {
    // This style is for the FlatList's columnWrapperStyle
    // to ensure items are arranged in rows for grid view.
    // It's not directly used in the FlatList's contentContainerStyle
    // but is useful for layout hints.
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SearchScreen; 