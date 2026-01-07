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
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProviderCard from '../components/ProviderCard';
import ServiceCarousel from '../components/ServiceCarousel';
import Logo from '../components/Logo';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonCard from '../components/SkeletonCard';
import AnimatedCard from '../components/AnimatedCard';
import EmptyState from '../components/EmptyState';
import { SERVICE_PROVIDERS } from '../constants/mockData';
import { COLORS } from '../constants/colors';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { useFavorites } from '../hooks/useFavorites';
import { AuthService } from '../../backend/services/auth.service';
import { UsersService } from '../../backend/services/users.service';
import { ServiceProvider } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;
const isMediumScreen = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;

interface HomeScreenProps {
  onNavigateToSearch?: () => void;
  onNavigateToProvider?: (providerId: string) => void;
  onNavigateToService?: (serviceId: string) => void;
  onNavigateToProfile?: () => void;
  onNavigateToBookings?: () => void;
  onNavigateToEmergency?: (provider: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToSearch,
  onNavigateToProvider,
  onNavigateToService,
  onNavigateToProfile,
  onNavigateToBookings,
  onNavigateToEmergency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [premiumProviders, setPremiumProviders] = useState<ServiceProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const { toast, showSuccess, showInfo, hideToast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [user, setUser] = useState<{
    name: string;
    avatar: string;
  }>({
    name: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User&backgroundColor=b6e3f4'
  });

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const carouselAnim = useRef(new Animated.Value(0)).current;
  const providersAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Charger les données utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AuthService.getCurrentUser();
        if (userData) {
          // Construire le nom à afficher
          let displayName = '';
          if (userData.first_name && userData.last_name) {
            displayName = `${userData.first_name} ${userData.last_name}`;
          } else if (userData.first_name) {
            displayName = userData.first_name;
          } else if (userData.last_name) {
            displayName = userData.last_name;
          } else if (userData.email) {
            // Utiliser la partie avant @ de l'email comme nom
            displayName = userData.email.split('@')[0];
          } else {
            displayName = 'Utilisateur';
          }

          // Générer l'avatar
          let avatarUrl = userData.avatar_url;
          if (!avatarUrl) {
            // Générer un avatar basé sur le nom ou l'email
            const seed = displayName || userData.email || 'User';
            avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4`;
          }

          setUser({
            name: displayName,
            avatar: avatarUrl
          });
        }
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error);
      }
    };

    loadUserData();
    loadPremiumProviders();
    
    // Recharger les données quand l'écran revient au focus (après modification du profil)
    // Note: navigation peut ne pas être disponible dans tous les contextes
    // On utilise un intervalle pour rafraîchir périodiquement
    const refreshInterval = setInterval(() => {
      loadUserData();
      loadPremiumProviders();
    }, 30000); // Rafraîchir toutes les 30 secondes

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  // Charger les prestataires premium
  const loadPremiumProviders = async () => {
    try {
      setIsLoadingProviders(true);
      const providers = await UsersService.getProviders({
        isPremium: true,
        limit: 10,
      });

      // Transformer les données au format ServiceProvider
      const transformedProviders: ServiceProvider[] = providers.map((p: any) => ({
        id: p.id,
        name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.email || 'Prestataire',
        firstName: p.first_name,
        lastName: p.last_name,
        email: p.email,
        phone: p.phone,
        avatar: p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.email || p.id)}&backgroundColor=b6e3f4`,
        isProvider: p.is_provider,
        rating: p.rating || 0,
        reviewCount: p.review_count || 0,
        city: p.city,
        activityZone: p.activity_zone,
        description: p.bio || p.description,
        mainSkills: p.main_skills || [],
        isPremium: p.is_premium || false,
        acceptsEmergency: p.accepts_emergency || false,
        location: {
          latitude: p.latitude || 0,
          longitude: p.longitude || 0,
          address: p.address || p.city || '',
          city: p.city || '',
          postalCode: p.postal_code || '',
        },
        services: [], // Les services seront chargés séparément si nécessaire
        experience: p.experience || 0,
        certifications: [],
        availability: [],
        priceRange: { min: 0, max: 0 },
      }));

      setPremiumProviders(transformedProviders);
    } catch (error: any) {
      console.error('Erreur lors du chargement des prestataires premium:', error);
      // En cas d'erreur, laisser la liste vide (pas de fallback vers données mockées)
      setPremiumProviders([]);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  // Animation d'entrée
  useEffect(() => {
    // Simuler le chargement des données
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
      setIsLoading(false);
    };

    loadData();

    // useNativeDriver n'est pas supporté sur web
    const canUseNativeDriver = Platform.OS !== 'web';

    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: canUseNativeDriver,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: canUseNativeDriver,
      }),
      Animated.timing(carouselAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: canUseNativeDriver,
      }),
      Animated.timing(providersAnim, {
        toValue: 1,
        duration: 1000,
        delay: 600,
        useNativeDriver: canUseNativeDriver,
      }),
    ];

    Animated.parallel(animations).start();

    // Animation de pulsation continue pour le logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: canUseNativeDriver,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: canUseNativeDriver,
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement de votre espace..." />
        <View style={styles.skeletonContainer}>
          <SkeletonCard height={120} style={styles.skeletonCard} />
          <SkeletonCard height={200} style={styles.skeletonCard} />
          <SkeletonCard height={150} style={styles.skeletonCard} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
      scrollEventThrottle={16}
    >
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
              {user.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.userAvatar}
                  onError={() => {
                    // En cas d'erreur de chargement, utiliser un avatar par défaut
                    const seed = user.name || 'User';
                    setUser({
                      ...user,
                      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4`
                    });
                  }}
                />
              ) : (
                <View style={[styles.userAvatar, styles.userAvatarPlaceholder]}>
                  <Ionicons name="person" size={20} color={COLORS.white} />
                </View>
              )}
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

      {/* Prestataires Premium - CLIQUABLES avec animation */}
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
          <Text style={styles.sectionTitle}>Prestataires Premium</Text>
          <TouchableOpacity onPress={handleSeeAllProviders} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        
        {isLoadingProviders ? (
          <View style={styles.loadingProvidersContainer}>
            <LoadingSpinner size="small" text="Chargement des prestataires premium..." />
          </View>
        ) : premiumProviders.length === 0 ? (
          <View style={styles.emptyProvidersContainer}>
            <Ionicons name="star-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyProvidersText}>Aucun prestataire premium pour le moment</Text>
          </View>
        ) : (
          premiumProviders.map((provider, index) => (
          <Animated.View
            key={provider.id}
            style={[
              styles.providerCardWrapper,
              {
                opacity: providersAnim,
                transform: [
                  {
                    translateX: providersAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100 * (index + 1), 0],
                    }),
                  },
                ],
              },
            ]}
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
          ))
        )}
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

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  headerContainer: {
    // Styles pour le conteneur du header animé
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? (isSmallScreen ? 40 : 50) : (isSmallScreen ? 20 : 30),
    paddingBottom: isSmallScreen ? 16 : 20,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    marginBottom: isSmallScreen ? 16 : 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 16 : 20,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: isSmallScreen ? 8 : 10,
    flex: 1,
  },
  userAvatar: {
    width: isSmallScreen ? 36 : 40,
    height: isSmallScreen ? 36 : 40,
    borderRadius: isSmallScreen ? 18 : 20,
    marginRight: isSmallScreen ? 8 : 10,
    backgroundColor: COLORS.lightGray,
  },
  userAvatarPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    flex: 1,
    minWidth: 0, // Permet au texte de se rétrécir si nécessaire
  },
  welcomeTitle: {
    fontSize: isSmallScreen ? 12 : 14,
    color: COLORS.white,
    marginBottom: 2,
  },
  userName: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    color: COLORS.white,
    flexShrink: 1,
  },
  welcomeArrow: {
    marginLeft: isSmallScreen ? 4 : 5,
  },
  logoContainer: {
    width: isSmallScreen ? 44 : 50,
    height: isSmallScreen ? 44 : 50,
    borderRadius: isSmallScreen ? 22 : 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: isSmallScreen ? 8 : 10,
    flexShrink: 0, // Empêche le logo de se rétrécir
  },
  searchContainer: {
    backgroundColor: COLORS.white,
    borderRadius: isSmallScreen ? 10 : 12,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 10 : 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: isSmallScreen ? 6 : 8,
    fontSize: isSmallScreen ? 14 : 16,
    color: COLORS.textSecondary,
  },
  carouselContainer: {
    marginTop: isSmallScreen ? 16 : 20,
  },
  section: {
    marginTop: isSmallScreen ? 20 : 24,
    paddingHorizontal: isSmallScreen ? 12 : 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 12 : 16,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  seeAllText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  providersSection: {
    marginTop: isSmallScreen ? 16 : 20,
    paddingHorizontal: isSmallScreen ? 12 : 16,
  },
  promotionCard: {
    borderRadius: isSmallScreen ? 12 : 16,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
    }),
  },
  promotionGradient: {
    padding: isSmallScreen ? 16 : 20,
    alignItems: 'center',
  },
  promotionContent: {
    alignItems: 'center',
  },
  promotionTitle: {
    fontSize: isSmallScreen ? 18 : 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  promotionSubtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: COLORS.textSecondary,
    marginBottom: isSmallScreen ? 12 : 16,
    textAlign: 'center',
  },
  promotionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: isSmallScreen ? 20 : 24,
    paddingVertical: isSmallScreen ? 8 : 10,
    borderRadius: isSmallScreen ? 20 : 25,
  },
  promotionButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginRight: 8,
  },
  promotionArrow: {
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonCard: {
    marginBottom: 16,
  },
  loadingProvidersContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyProvidersContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyProvidersText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  providerCardWrapper: {
    marginBottom: 8,
  },
});

export default HomeScreen; 