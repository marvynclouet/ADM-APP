import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { SERVICE_CATEGORIES, SERVICES, SERVICE_PROVIDERS } from '../constants/mockData';
import ServiceListItem from '../components/ServiceListItem';
import ServiceCardView from '../components/ServiceCardView';
import ServiceMap from '../components/ServiceMap';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const { width } = Dimensions.get('window');

interface SearchScreenProps {
  navigation?: any;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const { toast, showInfo, hideToast } = useToast();

  // Images d'illustration pour les catégories
  const categoryImages = {
    'coiffure': 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=120&fit=crop',
    'manucure': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=120&fit=crop',
    'maquillage': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=120&fit=crop',
    'massage': 'https://images.unsplash.com/photo-1544161512-6ad2f9d19ca9?w=200&h=120&fit=crop',
    'epilation': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=120&fit=crop',
    'soins': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=120&fit=crop',
  };

  // Données simulées pour les distances
  const SERVICE_DISTANCES = {
    'service1': 0.5,
    'service2': 1.2,
    'service3': 2.1,
    'service4': 0.8,
    'service5': 1.5,
    'service6': 3.2,
  };

  // Combiner les services avec les prestataires et les distances
  const servicesWithProviders = useMemo(() => {
    return SERVICES.map(service => {
      const provider = SERVICE_PROVIDERS.find(p => p.id === service.providerId);
      const distance = SERVICE_DISTANCES[service.id as keyof typeof SERVICE_DISTANCES] || Math.random() * 5;
      return { service, provider, distance };
    });
  }, []);

  // Filtrer les services selon la recherche et la catégorie
  const filteredServices = useMemo(() => {
    let filtered = servicesWithProviders;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.provider?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item =>
        item.service.category.id === selectedCategory
      );
    }

    // Trier par distance
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

  const handleServicePressFromProvider = (service: any) => {
    console.log('Service selected from provider:', service.name);
    if (navigation) {
      navigation.navigate('Réservation', {
        service: service,
        provider: selectedProvider
      });
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    showInfo(`Filtrage par catégorie: ${SERVICE_CATEGORIES.find(c => c.id === categoryId)?.name}`);
  };

  const handleViewModeChange = (mode: 'list' | 'grid' | 'map') => {
    setViewMode(mode);
    showInfo(`Affichage: ${mode === 'list' ? 'Liste' : mode === 'grid' ? 'Grille' : 'Carte'}`);
  };

  const renderServiceItem = ({ item }: { item: any }) => {
    if (viewMode === 'list') {
      return (
        <ServiceListItem
          service={item.service}
          provider={item.provider}
          distance={item.distance}
          onPress={() => handleServicePress(item.service.id)}
        />
      );
    } else {
      return (
        <ServiceCardView
          service={item.service}
          provider={item.provider}
          distance={item.distance}
          onPress={() => handleServicePress(item.service.id)}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      {/* Header avec gradient et image de fond */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Rechercher</Text>
            <Text style={styles.headerSubtitle}>Trouvez le service parfait</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="search" size={32} color={COLORS.white} />
          </View>
        </View>
      </LinearGradient>

      {/* Barre de recherche améliorée */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un service ou un prestataire..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtres par catégorie avec images */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Filtrer par catégorie</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {SERVICE_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.id;
            const imageUrl = categoryImages[category.name.toLowerCase() as keyof typeof categoryImages];
            
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryFilter, isSelected && styles.categoryFilterSelected]}
                onPress={() => handleCategoryPress(category.id)}
              >
                {imageUrl && (
                  <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.categoryFilterImage}
                    resizeMode="cover"
                  />
                )}
                <View style={[styles.categoryFilterOverlay, isSelected && styles.categoryFilterOverlaySelected]}>
                  <Ionicons 
                    name={category.icon as any} 
                    size={20} 
                    color={isSelected ? COLORS.white : COLORS.primary} 
                  />
                  <Text style={[styles.categoryFilterText, isSelected && styles.categoryFilterTextSelected]}>
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Contrôles de vue */}
      <View style={styles.viewControls}>
        <View style={styles.viewButtons}>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
            onPress={() => handleViewModeChange('list')}
          >
            <Ionicons 
              name="list" 
              size={20} 
              color={viewMode === 'list' ? COLORS.white : COLORS.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
            onPress={() => handleViewModeChange('grid')}
          >
            <Ionicons 
              name="grid" 
              size={20} 
              color={viewMode === 'grid' ? COLORS.white : COLORS.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'map' && styles.viewButtonActive]}
            onPress={() => handleViewModeChange('map')}
          >
            <Ionicons 
              name="map" 
              size={20} 
              color={viewMode === 'map' ? COLORS.white : COLORS.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {filteredServices.length} résultat{filteredServices.length > 1 ? 's' : ''}
          </Text>
          {selectedCategory && (
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={styles.clearFilterText}>Effacer le filtre</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        {viewMode === 'map' ? (
          <ServiceMap 
            services={filteredServices}
            onServicePress={handleServicePress}
          />
        ) : (
          <FlatList
            data={filteredServices}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.service.id}
            key={viewMode}
            numColumns={viewMode === 'grid' ? 2 : 1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.servicesList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color={COLORS.textSecondary} />
                <Text style={styles.emptyStateTitle}>Aucun résultat trouvé</Text>
                <Text style={styles.emptyStateText}>
                  Essayez de modifier vos critères de recherche
                </Text>
              </View>
            }
          />
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
  },
  headerIcon: {
    padding: 10,
  },
  searchSection: {
    paddingHorizontal: 16,
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
  categoriesSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  categoriesScroll: {
    paddingRight: 16,
  },
  categoryFilter: {
    width: 120,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  categoryFilterSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  categoryFilterImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  categoryFilterOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryFilterOverlaySelected: {
    backgroundColor: COLORS.primary,
  },
  categoryFilterText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryFilterTextSelected: {
    color: COLORS.white,
  },
  viewControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  viewButtons: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 2,
  },
  viewButton: {
    padding: 6,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: COLORS.primary,
  },
  resultsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  clearFilterButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
  },
  clearFilterText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  servicesList: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SearchScreen; 