import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { SERVICE_CATEGORIES, SERVICE_PROVIDERS, SERVICES } from '../constants/mockData';
import CategoryCard from '../components/CategoryCard';
import ProviderCard from '../components/ProviderCard';
import ServiceCarousel from '../components/ServiceCarousel';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const { width } = Dimensions.get('window');

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

  // Données utilisateur avec image d'API
  const user = {
    name: 'Marie',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  };

  // Images d'accroche pour les sections
  const heroImages = [
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
  ];

  const handleSearchPress = () => {
    if (onNavigateToSearch) {
      onNavigateToSearch();
    } else {
      Alert.alert('Recherche', 'Navigation vers la recherche');
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    if (onNavigateToCategory) {
      onNavigateToCategory(categoryId);
    } else {
      Alert.alert('Catégorie', `Navigation vers la catégorie ${categoryId}`);
    }
  };

  const handleProviderPress = (providerId: string) => {
    if (onNavigateToProvider) {
      onNavigateToProvider(providerId);
    } else {
      Alert.alert('Prestataire', `Navigation vers le prestataire ${providerId}`);
    }
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

  const handlePromotionPress = () => {
    showSuccess('Promotion appliquée ! -20% sur votre prochaine réservation');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Bonjour,</Text>
            <Text style={styles.userName}>{user.name} ! 👋</Text>
            <Text style={styles.welcomeSubtitle}>Prêt(e) pour votre séance beauté ?</Text>
          </View>
          <TouchableOpacity style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Section Hero avec image d'accroche */}
      <View style={styles.heroSection}>
        <Image 
          source={{ uri: heroImages[0] }} 
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.heroOverlay}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Découvrez l'excellence</Text>
            <Text style={styles.heroSubtitle}>Des prestataires qualifiés près de chez vous</Text>
            <TouchableOpacity style={styles.heroButton} onPress={handleSearchPress}>
              <Text style={styles.heroButtonText}>Commencer</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Barre de recherche améliorée */}
      <View style={styles.searchSection}>
        <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <Text style={styles.searchPlaceholder}>Rechercher un service ou un prestataire...</Text>
          <Ionicons name="location" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Section Services populaires avec image */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Services populaires</Text>
            <Text style={styles.sectionSubtitle}>Les plus demandés cette semaine</Text>
          </View>
          <TouchableOpacity style={styles.seeAllButton} onPress={handleSearchPress}>
            <Text style={styles.seeAllText}>Voir tout</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <ServiceCarousel onSeeAllPress={handleSearchPress} />
      </View>

      {/* Section Catégories avec design amélioré */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Explorez par catégorie</Text>
            <Text style={styles.sectionSubtitle}>Trouvez le service parfait</Text>
          </View>
        </View>
        <View style={styles.categoriesGrid}>
          {SERVICE_CATEGORIES.slice(0, 6).map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </View>
      </View>

      {/* Section Accès rapide avec images */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accès rapide</Text>
        </View>
        <View style={styles.quickAccessGrid}>
          <TouchableOpacity 
            style={styles.quickAccessCard} 
            onPress={() => handleQuickAccessPress('favorites')}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&h=100&fit=crop' }} 
              style={styles.quickAccessImage}
            />
            <View style={styles.quickAccessOverlay}>
              <Ionicons name="heart" size={24} color={COLORS.white} />
              <Text style={styles.quickAccessText}>Favoris</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAccessCard} 
            onPress={() => handleQuickAccessPress('recent')}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=100&fit=crop' }} 
              style={styles.quickAccessImage}
            />
            <View style={styles.quickAccessOverlay}>
              <Ionicons name="time" size={24} color={COLORS.white} />
              <Text style={styles.quickAccessText}>Récents</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAccessCard} 
            onPress={() => handleQuickAccessPress('nearby')}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop' }} 
              style={styles.quickAccessImage}
            />
            <View style={styles.quickAccessOverlay}>
              <Ionicons name="location" size={24} color={COLORS.white} />
              <Text style={styles.quickAccessText}>À proximité</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAccessCard} 
            onPress={() => handleQuickAccessPress('promotions')}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=150&h=100&fit=crop' }} 
              style={styles.quickAccessImage}
            />
            <View style={styles.quickAccessOverlay}>
              <Ionicons name="pricetag" size={24} color={COLORS.white} />
              <Text style={styles.quickAccessText}>Promotions</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section Promotion spéciale */}
      <View style={styles.promotionSection}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=200&fit=crop' }} 
          style={styles.promotionImage}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          style={styles.promotionOverlay}
        >
          <View style={styles.promotionContent}>
            <View style={styles.promotionBadge}>
              <Text style={styles.promotionBadgeText}>-20%</Text>
            </View>
            <Text style={styles.promotionTitle}>Offre spéciale</Text>
            <Text style={styles.promotionSubtitle}>Manucure + pédicure</Text>
            <TouchableOpacity style={styles.promotionButton} onPress={handlePromotionPress}>
              <Text style={styles.promotionButtonText}>En profiter</Text>
              <Ionicons name="sparkles" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Section Prestataires populaires */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Prestataires populaires</Text>
            <Text style={styles.sectionSubtitle}>Les mieux notés par nos clients</Text>
          </View>
          <TouchableOpacity style={styles.seeAllButton} onPress={handleSearchPress}>
            <Text style={styles.seeAllText}>Voir tout</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.providersScroll}>
          {SERVICE_PROVIDERS.slice(0, 5).map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onPress={() => handleProviderPress(provider.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Section Témoignages */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ce que disent nos clients</Text>
        </View>
        <View style={styles.testimonialCard}>
          <View style={styles.testimonialHeader}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face' }} 
              style={styles.testimonialAvatar}
            />
            <View style={styles.testimonialInfo}>
              <Text style={styles.testimonialName}>Sophie Martin</Text>
              <View style={styles.testimonialRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star" size={14} color={COLORS.warning} />
                ))}
              </View>
            </View>
          </View>
          <Text style={styles.testimonialText}>
            "Service exceptionnel ! Ma coiffeuse était professionnelle et le résultat est parfait. Je recommande vivement !"
          </Text>
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
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 4,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  heroSection: {
    width: width,
    height: width * 1.2, // Hero image height
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginRight: 8,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
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
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  quickAccessCard: {
    width: width * 0.35, // Adjust as needed
    height: width * 0.35, // Adjust as needed
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  quickAccessImage: {
    width: '100%',
    height: '100%',
  },
  quickAccessOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    marginTop: 8,
    textAlign: 'center',
  },
  promotionSection: {
    width: width,
    height: width * 1.2, // Promotion image height
    marginBottom: 20,
  },
  promotionImage: {
    width: '100%',
    height: '100%',
  },
  promotionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  promotionContent: {
    alignItems: 'center',
  },
  promotionBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  promotionBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  promotionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
    textAlign: 'center',
  },
  promotionSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 20,
    textAlign: 'center',
  },
  promotionButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promotionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    marginRight: 8,
  },
  providersScroll: {
    paddingHorizontal: 16,
  },
  testimonialCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  testimonialRating: {
    flexDirection: 'row',
    marginTop: 4,
  },
  testimonialText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});

export default HomeScreen; 