import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CategoryCard from '../components/CategoryCard';
import ProviderCard from '../components/ProviderCard';
import ServiceCarousel from '../components/ServiceCarousel';
import Logo from '../components/Logo';
import { SERVICE_CATEGORIES, SERVICE_PROVIDERS, SERVICES } from '../constants/mockData';
import { COLORS } from '../constants/colors';

interface HomeScreenProps {
  onNavigateToSearch?: () => void;
  onNavigateToProvider?: (providerId: string) => void;
  onNavigateToCategory?: (categoryId: string) => void;
  onNavigateToService?: (serviceId: string) => void;
  onNavigateToProfile?: () => void;
  onNavigateToBookings?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToSearch,
  onNavigateToProvider,
  onNavigateToCategory,
  onNavigateToService,
  onNavigateToProfile,
  onNavigateToBookings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Données utilisateur avec image d'API
  const user = {
    name: 'Marie',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie&backgroundColor=b6e3f4'
  };

  const handleCategoryPress = (categoryId: string) => {
    console.log('Category pressed:', categoryId);
    if (onNavigateToCategory) {
      onNavigateToCategory(categoryId);
    } else {
      Alert.alert('Catégorie', `Navigation vers la catégorie ${categoryId}`);
    }
  };

  const handleProviderPress = (providerId: string) => {
    console.log('Provider pressed:', providerId);
    if (onNavigateToProvider) {
      onNavigateToProvider(providerId);
    } else {
      Alert.alert('Prestataire', `Navigation vers le prestataire ${providerId}`);
    }
  };

  const handleServicePress = (serviceId: string) => {
    console.log('Service pressed:', serviceId);
    if (onNavigateToService) {
      onNavigateToService(serviceId);
    } else {
      Alert.alert('Service', `Navigation vers le service ${serviceId}`);
    }
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    if (onNavigateToSearch) {
      onNavigateToSearch();
    } else {
      Alert.alert('Recherche', `Recherche pour: ${searchQuery}`);
    }
  };

  const handleSearchPress = () => {
    if (onNavigateToSearch) {
      onNavigateToSearch();
    } else {
      Alert.alert('Recherche', 'Navigation vers la page de recherche');
    }
  };

  const handleUserProfilePress = () => {
    if (onNavigateToProfile) {
      onNavigateToProfile();
    } else {
      Alert.alert('Profil', 'Navigation vers le profil utilisateur');
    }
  };

  const handleSeeAllProviders = () => {
    if (onNavigateToSearch) {
      onNavigateToSearch();
    } else {
      Alert.alert('Prestataires', 'Voir tous les prestataires');
    }
  };

  const handlePromotionPress = () => {
    // Trouver les services de manucure
    const manucureServices = SERVICES.filter(service => 
      service.category.name.toLowerCase().includes('manucure')
    );
    
    if (manucureServices.length > 0) {
      if (onNavigateToService) {
        onNavigateToService(manucureServices[0].id);
      } else {
        Alert.alert('Promotion', 'Navigation vers les services de manucure en promotion');
      }
    } else {
      Alert.alert('Promotion', 'Découvrir les offres spéciales');
    }
  };

  const handleServiceCarouselPress = (serviceId: string) => {
    handleServicePress(serviceId);
  };

  const handleQuickAccessPress = (type: string) => {
    switch (type) {
      case 'bookings':
        if (onNavigateToBookings) {
          onNavigateToBookings();
        } else {
          Alert.alert('Réservations', 'Voir mes réservations');
        }
        break;
      case 'map':
        if (onNavigateToSearch) {
          onNavigateToSearch();
        } else {
          Alert.alert('Carte', 'Voir la carte des services');
        }
        break;
      case 'favorites':
        Alert.alert('Favoris', 'Voir mes prestataires favoris');
        break;
      default:
        Alert.alert('Accès rapide', 'Fonctionnalité à venir');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header avec gradient inspiré du logo ADM */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {/* Message de bienvenue avec avatar - CLIQUABLE */}
          <TouchableOpacity 
            style={styles.welcomeContainer}
            onPress={handleUserProfilePress}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: user.avatar }}
              style={styles.userAvatar}
            />
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>Bienvenue !</Text>
              <Text style={styles.userName}>{user.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.white} style={styles.welcomeArrow} />
          </TouchableOpacity>
          
          {/* Logo ADM centré dans un rond - CLIQUABLE */}
          <TouchableOpacity 
            style={styles.logoContainer}
            onPress={() => Alert.alert('ADM', 'Logo ADM - Accueil')}
            activeOpacity={0.8}
          >
            <Logo size="medium" showText={false} />
          </TouchableOpacity>
        </View>

        {/* Barre de recherche - CLIQUABLE */}
        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={handleSearchPress}
          activeOpacity={0.9}
        >
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <Text style={styles.searchPlaceholder}>
              Rechercher une prestation...
            </Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.textSecondary} />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Carousel des services - CLIQUABLE */}
      <ServiceCarousel 
        onServicePress={handleServiceCarouselPress}
        onSeeAllPress={handleSeeAllProviders}
      />

      {/* Catégories - CLIQUABLES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {SERVICE_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Prestataires populaires - CLIQUABLES */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Prestataires populaires</Text>
          <TouchableOpacity onPress={handleSeeAllProviders} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        
        {SERVICE_PROVIDERS.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            onPress={() => handleProviderPress(provider.id)}
          />
        ))}
      </View>

      {/* Services en promotion - CLIQUABLE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offres spéciales</Text>
        <TouchableOpacity 
          style={styles.promotionCard}
          onPress={handlePromotionPress}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[COLORS.accent, COLORS.accentLight]}
            style={styles.promotionGradient}
          >
            <View style={styles.promotionContent}>
              <Text style={styles.promotionTitle}>-20% sur les manucures</Text>
              <Text style={styles.promotionSubtitle}>
                Cette semaine seulement
              </Text>
              <View style={styles.promotionButton}>
                <Text style={styles.promotionButtonText}>Découvrir</Text>
                <Ionicons name="arrow-forward" size={14} color={COLORS.accent} style={styles.promotionArrow} />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Section rapide - CLIQUABLE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accès rapide</Text>
        <View style={styles.quickAccessContainer}>
          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => handleQuickAccessPress('bookings')}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar" size={24} color={COLORS.primary} />
            <Text style={styles.quickAccessText}>Mes réservations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => handleQuickAccessPress('map')}
            activeOpacity={0.8}
          >
            <Ionicons name="map" size={24} color={COLORS.primary} />
            <Text style={styles.quickAccessText}>Carte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => handleQuickAccessPress('favorites')}
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={24} color={COLORS.primary} />
            <Text style={styles.quickAccessText}>Favoris</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: COLORS.white,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  welcomeArrow: {
    marginLeft: 8,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 8,
  },
  promotionCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  promotionGradient: {
    padding: 20,
  },
  promotionContent: {
    alignItems: 'center',
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  promotionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  promotionButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promotionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
  },
  promotionArrow: {
    marginLeft: 4,
  },
  quickAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  quickAccessCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeScreen; 