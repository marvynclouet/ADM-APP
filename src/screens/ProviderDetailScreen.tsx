import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ServiceProvider, Service } from '../types';
import { SERVICES } from '../constants/mockData';
import { COLORS } from '../constants/colors';
import { useReviews } from '../hooks/useReviews';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';

interface ProviderDetailScreenProps {
  route?: {
    params?: {
      provider?: ServiceProvider;
    };
  };
  navigation?: any;
}

const ProviderDetailScreen: React.FC<ProviderDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const [selectedTab, setSelectedTab] = useState<'services' | 'reviews' | 'info'>('services');
  const { getReviewsByProvider, getAverageRating, getRatingStats } = useReviews();

  // Récupérer le prestataire depuis les paramètres de navigation ou utiliser un fallback
  const provider = route?.params?.provider || {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '06 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    isProvider: true,
    rating: 4.8,
    reviewCount: 127,
    services: [],
    location: { 
      latitude: 48.8566, 
      longitude: 2.3522, 
      address: '15 rue de la Paix, Paris',
      city: 'Paris',
      postalCode: '75001'
    },
    description: 'Coiffeuse professionnelle',
    experience: 10,
    certifications: [],
    availability: [],
    priceRange: { min: 25, max: 80 }
  };

  // Récupérer les services du prestataire (maintenant provider.services est un tableau d'objets Service)
  const providerServices = useMemo(() => {
    if (provider.services && provider.services.length > 0) {
      // Si provider.services est un tableau d'objets Service, les utiliser directement
      if (typeof provider.services[0] === 'object' && 'id' in provider.services[0]) {
        return provider.services as Service[];
      }
      // Sinon, si c'est un tableau d'IDs, filtrer depuis SERVICES
      return SERVICES.filter(service => 
        (provider.services as any[]).includes(service.id)
      );
    }
    return [];
  }, [provider.services]);

  // Récupérer les avis du prestataire
  const reviews = useMemo(() => {
    return getReviewsByProvider(provider.id);
  }, [provider.id]);

  // Statistiques des avis
  const reviewStats = useMemo(() => {
    const providerReviews = reviews;
    if (providerReviews.length === 0) {
      return {
        total: 0,
        average: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    const average = getAverageRating(provider.id);
    const breakdown = getRatingStats(provider.id);
    return {
      total: providerReviews.length,
      average,
      breakdown
    };
  }, [reviews, provider.id, getAverageRating, getRatingStats]);

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const handleServicePress = (service: Service) => {
    console.log('Service selected from provider:', service.name);
    // Naviguer vers l'écran de réservation avec le service et le prestataire
    if (navigation) {
      navigation.navigate('Réservation', {
        service: service,
        provider: provider
      });
    }
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <TouchableOpacity 
      style={styles.serviceItem}
      onPress={() => handleServicePress(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.serviceImage}
        resizeMode="cover"
      />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.serviceMeta}>
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.durationText}>{item.duration}min</Text>
          </View>
          <Text style={styles.servicePrice}>{item.price}€</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header avec image de fond */}
      <View style={styles.header}>
        <Image
          source={{ uri: provider.avatar }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.headerOverlay}
        />
        
        {/* Bouton retour */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        {/* Informations du prestataire */}
        <View style={styles.providerInfo}>
          <Image
            source={{ uri: provider.avatar }}
            style={styles.providerAvatar}
          />
          <View style={styles.providerDetails}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={COLORS.warning} />
              <Text style={styles.rating}>{formatRating(provider.rating)}</Text>
              <Text style={styles.reviewCount}>({provider.reviewCount} avis)</Text>
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color={COLORS.white} />
              <Text style={styles.location}>{provider.location.address}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bouton Urgence si disponible */}
      {provider.acceptsEmergency && (
        <View style={styles.emergencyButtonContainer}>
          <TouchableOpacity
            style={styles.emergencyButtonHeader}
            onPress={() => {
              if (navigation) {
                navigation.navigate('EmergencyBooking', {
                  provider: provider,
                });
              }
            }}
          >
            <Ionicons name="flash" size={24} color={COLORS.white} />
            <Text style={styles.emergencyButtonHeaderText}>Réserver en urgence</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'services' && styles.tabActive]}
          onPress={() => setSelectedTab('services')}
        >
          <Text style={[styles.tabText, selectedTab === 'services' && styles.tabTextActive]}>
            Services ({providerServices.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'reviews' && styles.tabActive]}
          onPress={() => setSelectedTab('reviews')}
        >
          <Text style={[styles.tabText, selectedTab === 'reviews' && styles.tabTextActive]}>
            Avis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'info' && styles.tabActive]}
          onPress={() => setSelectedTab('info')}
        >
          <Text style={[styles.tabText, selectedTab === 'info' && styles.tabTextActive]}>
            Infos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenu des tabs */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'services' && (
          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Services proposés</Text>
            <FlatList
              data={providerServices}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {selectedTab === 'reviews' && (
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Avis clients</Text>
            
            {/* Statistiques des avis */}
            {reviewStats.total > 0 && (
              <View style={styles.reviewStatsContainer}>
                <View style={styles.reviewStatsMain}>
                  <Text style={styles.reviewStatsRating}>
                    {reviewStats.average.toFixed(1)}
                  </Text>
                  <StarRating 
                    rating={reviewStats.average} 
                    size={20} 
                    color={COLORS.warning}
                  />
                  <Text style={styles.reviewStatsCount}>
                    {reviewStats.total} avis
                  </Text>
                </View>
                <View style={styles.reviewStatsBreakdown}>
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviewStats.breakdown[stars] || 0;
                    const percentage = reviewStats.total > 0 ? (count / reviewStats.total) * 100 : 0;
                    return (
                      <View key={stars} style={styles.reviewStatsRow}>
                        <Text style={styles.reviewStatsStars}>{stars} ⭐</Text>
                        <View style={styles.reviewStatsBar}>
                          <View 
                            style={[
                              styles.reviewStatsBarFill, 
                              { width: `${percentage}%` }
                            ]} 
                          />
                        </View>
                        <Text style={styles.reviewStatsCount}>{count}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
            
            {/* Liste des avis */}
            {reviews.length === 0 ? (
              <View style={styles.noReviews}>
                <Ionicons name="chatbubble-outline" size={48} color={COLORS.textSecondary} />
                <Text style={styles.noReviewsText}>Aucun avis pour le moment</Text>
              </View>
            ) : (
              <View style={styles.reviewsList}>
                {reviews.map(review => (
                  <ReviewCard
                    key={review.id}
                    review={{
                      id: review.id,
                      userName: review.userName,
                      userAvatar: review.userAvatar,
                      rating: review.rating,
                      review: review.review,
                      date: review.date,
                      serviceName: review.serviceName,
                      isVerified: review.isVerified,
                    }}
                    showService={true}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {selectedTab === 'info' && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informations</Text>
            
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>{provider.phone}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>{provider.email}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>{provider.location.address}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Lun-Ven: 9h-18h, Sam: 9h-16h</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 300,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInfo: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 4,
  },
  emergencyButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  emergencyButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  emergencyButtonHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  servicesSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  serviceItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  reviewsSection: {
    flex: 1,
  },
  reviewStatsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  reviewStatsMain: {
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewStatsRating: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  reviewStatsCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  reviewStatsBreakdown: {
    gap: 8,
  },
  reviewStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewStatsStars: {
    fontSize: 14,
    color: COLORS.textPrimary,
    width: 40,
  },
  reviewStatsBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  reviewStatsBarFill: {
    height: '100%',
    backgroundColor: COLORS.warning,
    borderRadius: 4,
  },
  reviewsList: {
    gap: 12,
  },
  noReviews: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noReviewsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  infoSection: {
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  infoText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
});

export default ProviderDetailScreen; 