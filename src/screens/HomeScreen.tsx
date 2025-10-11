import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CategoryCard from '../components/CategoryCard';
import ProviderCard from '../components/ProviderCard';
import ServiceCarousel from '../components/ServiceCarousel';
import Logo from '../components/Logo';
import { SERVICE_CATEGORIES, SERVICE_PROVIDERS, SERVICES } from '../constants/mockData';
import { COLORS } from '../constants/colors';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { useFavorites } from '../hooks/useFavorites';

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
  const { toast, showSuccess, showInfo, hideToast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const carouselAnim = useRef(new Animated.Value(0)).current;
  const providersAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Données utilisateur avec image d'API
  const user = {
    name: 'Marie',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie&backgroundColor=b6e3f4'
  };

  // Animation d'entrée
  useEffect(() => {
    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(carouselAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(providersAnim, {
        toValue: 1,
        duration: 1000,
        delay: 600,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();

    // Animation de pulsation continue pour le logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
  }, []);

  const handleSearchPress = () => {
    if (onNavigateToSearch) {
      onNavigateToSearch();
    } else {
      Alert.alert('Recherche', 'Navigation vers la recherche');
    }
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
    showSuccess('Promotion appliquée ! -20% sur votre prochaine réservation');
  };

  const handleServiceCarouselPress = (serviceId: string) => {
    handleServicePress(serviceId);
  };

  const handleQuickAccessPress = (type: string) => {
    switch (type) {
      case 'favorites':
        showInfo('Vos favoris seront bientôt disponibles !');
        break;
      case 'recent':
        showInfo('Vos services récents seront bientôt disponibles !');
        break;
      case 'nearby':
        showInfo('Recherche de prestataires à proximité...');
        break;
      case 'promotions':
        showInfo('Promotions et offres spéciales à venir !');
        break;
      default:
        showInfo('Fonctionnalité à venir');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      
      {/* Header avec gradient inspiré du logo ADM */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
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
            
            {/* Logo ADM centré dans un rond - CLIQUABLE avec animation de pulsation */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <TouchableOpacity 
                onPress={() => Alert.alert('ADM', 'Logo ADM - Accueil')}
                activeOpacity={0.8}
              >
                <Logo size="medium" showText={false} />
              </TouchableOpacity>
            </Animated.View>
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
      </Animated.View>

      {/* Carousel des services - CLIQUABLE avec animation */}
      <Animated.View
        style={[
          styles.carouselContainer,
          {
            opacity: carouselAnim,
            transform: [
              {
                translateY: carouselAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <ServiceCarousel 
          onServicePress={handleServiceCarouselPress}
          onSeeAllPress={handleSeeAllProviders}
        />
      </Animated.View>

      {/* Catégories - CLIQUABLES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {SERVICE_CATEGORIES.map((category, index) => (
            <Animated.View
              key={category.id}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateX: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50 * (index + 1), 0],
                    }),
                  },
                ],
              }}
            >
              <CategoryCard
                category={category}
                onPress={() => handleCategoryPress(category.id)}
              />
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Prestataires populaires - CLIQUABLES avec animation */}
      <Animated.View
        style={[
          styles.providersSection,
          {
            opacity: providersAnim,
            transform: [
              {
                translateY: providersAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Prestataires populaires</Text>
          <TouchableOpacity onPress={handleSeeAllProviders} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        
        {SERVICE_PROVIDERS.map((provider, index) => (
          <Animated.View
            key={provider.id}
            style={{
              opacity: providersAnim,
              transform: [
                {
                  translateX: providersAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100 * (index + 1), 0],
                  }),
                },
              ],
            }}
          >
            <ProviderCard
              provider={provider}
              onPress={() => handleProviderPress(provider.id)}
              isFavorite={isFavorite(provider.id)}
              onToggleFavorite={async () => {
                await toggleFavorite(provider.id);
                if (isFavorite(provider.id)) {
                  showInfo('Retiré des favoris');
                } else {
                  showSuccess('Ajouté aux favoris ❤️');
                }
              }}
            />
          </Animated.View>
        ))}
      </Animated.View>

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
  headerContainer: {
    // Styles pour le conteneur du header animé
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
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
    marginRight: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  welcomeArrow: {
    marginLeft: 5,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  searchContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  carouselContainer: {
    marginTop: 20,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  providersSection: {
    marginTop: 20,
  },
  promotionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  promotionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  promotionContent: {
    alignItems: 'center',
  },
  promotionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  promotionSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  promotionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
  },
  promotionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginRight: 8,
  },
  promotionArrow: {
    marginLeft: 5,
  },
  quickAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAccessCard: {
    alignItems: 'center',
    marginHorizontal: 8,
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