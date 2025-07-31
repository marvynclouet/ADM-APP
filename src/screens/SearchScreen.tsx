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

interface SearchScreenProps {
  navigation?: any;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const { toast, showInfo, hideToast } = useToast();

  // Combiner les services avec leurs prestataires et distances
  const servicesWithProviders = useMemo(() => {
    return SERVICES.map(service => {
      const provider = SERVICE_PROVIDERS.find(p => p.services.includes(service.id));
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

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.provider.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(item =>
        item.service.category.name === selectedCategory
      );
    }

    // Trier par distance (plus proche en premier)
    return filtered.sort((a, b) => a.distance - b.distance);
  }, [servicesWithProviders, searchQuery, selectedCategory]);

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
      setSelectedCategory(selectedCategory === category.name ? null : category.name);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

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

      {/* Header avec gradient */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Rechercher</Text>
        
        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un service ou prestataire..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {(searchQuery || selectedCategory) && (
            <TouchableOpacity onPress={clearFilters}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Bouton carte */}
        <TouchableOpacity style={styles.mapButton} onPress={toggleMapView}>
          <Ionicons name="map" size={20} color={COLORS.white} />
          <Text style={styles.mapButtonText}>Voir carte</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        {/* Filtres par catégorie */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Filtrer par catégorie</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {SERVICE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.name && styles.categoryChipActive
                ]}
                onPress={() => handleCategoryPress(category.id)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={16} 
                  color={selectedCategory === category.name ? COLORS.white : COLORS.primary} 
                />
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category.name && styles.categoryChipTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Résultats */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {searchQuery || selectedCategory ? 'Résultats' : 'Services disponibles'}
            </Text>
            <View style={styles.resultsControls}>
              <Text style={styles.resultsCount}>
                {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''}
              </Text>
              
              {/* Toggle vue liste/carte */}
              <View style={styles.viewToggle}>
                <TouchableOpacity
                  style={[
                    styles.viewButton,
                    viewMode === 'list' && styles.viewButtonActive
                  ]}
                  onPress={() => setViewMode('list')}
                >
                  <Ionicons 
                    name="list" 
                    size={16} 
                    color={viewMode === 'list' ? COLORS.white : COLORS.textSecondary} 
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.viewButton,
                    viewMode === 'grid' && styles.viewButtonActive
                  ]}
                  onPress={() => setViewMode('grid')}
                >
                  <Ionicons 
                    name="grid" 
                    size={16} 
                    color={viewMode === 'grid' ? COLORS.white : COLORS.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {filteredServices.length === 0 ? (
            <View style={styles.noResults}>
              <Ionicons name="search" size={48} color={COLORS.textSecondary} />
              <Text style={styles.noResultsText}>
                Aucun service trouvé
              </Text>
              <Text style={styles.noResultsSubtext}>
                {searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Essayez de modifier vos filtres'}
              </Text>
            </View>
          ) : (
            <FlatList
              key={viewMode} // Clé unique pour forcer le re-render
              data={filteredServices}
              keyExtractor={(item) => item.service.id}
              renderItem={({ item }) => 
                viewMode === 'list' ? (
                  <ServiceListItem
                    service={item.service}
                    provider={item.provider}
                    distance={item.distance}
                    onPress={() => handleServicePress(item.service.id)}
                  />
                ) : (
                  <ServiceCardView
                    service={item.service}
                    provider={item.provider}
                    distance={item.distance}
                    onPress={() => handleServicePress(item.service.id)}
                  />
                )
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.servicesList,
                viewMode === 'grid' && styles.gridContainer
              ]}
              numColumns={viewMode === 'grid' ? 2 : 1}
              columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
            />
          )}
        </View>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 16,
    alignSelf: 'flex-start',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  mapButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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