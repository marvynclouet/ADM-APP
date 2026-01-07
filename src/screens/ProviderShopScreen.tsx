import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { AuthService } from '../../backend/services/auth.service';
import { ServicesService } from '../../backend/services/services.service';
import { supabase } from '../../backend/supabase/config';
import LoadingSpinner from '../components/LoadingSpinner';

interface ProviderShopScreenProps {
  navigation?: any;
}

const ProviderShopScreen: React.FC<ProviderShopScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Charger les données
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Récupérer l'utilisateur actuel
      const userData = await AuthService.getCurrentUser();
      if (!userData || !userData.is_provider) {
        Alert.alert('Erreur', 'Vous n\'êtes pas un prestataire');
        navigation?.goBack();
        return;
      }

      // Charger les données du prestataire
      setProvider({
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email,
        avatar: userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}&backgroundColor=b6e3f4`,
        description: userData.description || 'Aucune description',
        address: userData.address || 'Adresse non renseignée',
        phone: userData.phone || 'Téléphone non renseigné',
        email: userData.email,
        isOnline: true // TODO: Implémenter le statut en ligne
      });

      // Charger les services du prestataire
      const servicesData = await ServicesService.getServices({
        providerId: userData.id,
        isActive: true,
      });

      const transformedServices = (servicesData || []).map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description || '',
        price: parseFloat(service.price) || 0,
        duration: service.duration_minutes || 0,
        category: service.category?.name?.toLowerCase() || 'autre',
        categoryId: service.category_id,
        image: service.image_url || 'https://via.placeholder.com/300x200',
      }));

      setServices(transformedServices);

      // Charger les catégories
      const categoriesData = await ServicesService.getCategories();
      const allCategories = [
        { id: 'all', name: 'Tous', icon: 'grid-outline' },
        ...(categoriesData || []).map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          icon: getCategoryIcon(cat.name),
        })),
      ];
      setCategories(allCategories);

      // Charger les avis
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users!reviews_user_id_fkey(id, first_name, last_name, avatar_url)
        `)
        .eq('provider_id', userData.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (reviewsError) {
        console.error('Erreur lors du chargement des avis:', reviewsError);
      } else {
        const transformedReviews = (reviewsData || []).map((review: any) => {
          const userName = review.user 
            ? `${review.user.first_name || ''} ${review.user.last_name || ''}`.trim() || 'Client'
            : 'Client';
          const userAvatar = review.user?.avatar_url || 
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}&backgroundColor=b6e3f4`;
          
          const date = new Date(review.created_at);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          let dateText = '';
          if (diffDays === 0) dateText = "Aujourd'hui";
          else if (diffDays === 1) dateText = 'Il y a 1 jour';
          else if (diffDays < 7) dateText = `Il y a ${diffDays} jours`;
          else if (diffDays < 30) dateText = `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
          else dateText = `Il y a ${Math.floor(diffDays / 30)} mois`;

          return {
            id: review.id,
            clientName: userName,
            clientAvatar: userAvatar,
            rating: review.rating,
            comment: review.comment || '',
            date: dateText,
          };
        });

        setReviews(transformedReviews);

        // Calculer la moyenne et le total
        if (reviewsData && reviewsData.length > 0) {
          const total = reviewsData.reduce((sum: number, r: any) => sum + r.rating, 0);
          setAverageRating(total / reviewsData.length);
          setTotalReviews(reviewsData.length);
        } else {
          setAverageRating(0);
          setTotalReviews(0);
        }
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des données:', error);
      Alert.alert('Erreur', error.message || 'Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, [navigation]);

  // Obtenir l'icône pour une catégorie
  const getCategoryIcon = (categoryName: string): string => {
    const name = categoryName.toLowerCase();
    if (name.includes('coiffure')) return 'cut-outline';
    if (name.includes('manucure')) return 'hand-left-outline';
    if (name.includes('pédicure') || name.includes('pedicure')) return 'foot-outline';
    if (name.includes('massage')) return 'body-outline';
    if (name.includes('soin') || name.includes('beauté')) return 'sparkles-outline';
    return 'grid-outline';
  };

  // Recharger les données quand l'écran est focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || 
                           service.categoryId === selectedCategory || 
                           service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleServicePress = (service: any) => {
    navigation?.navigate('ProviderServicesManagement');
  };

  const handleAddService = () => {
    navigation?.navigate('ProviderServicesManagement');
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const handleEditProfile = () => {
    navigation?.navigate('ProviderProfileManagement');
  };

  const handleViewAllReviews = () => {
    navigation?.navigate('ProviderReviews');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? "star" : "star-outline"}
        size={16}
        color={i < rating ? COLORS.warning : COLORS.textSecondary}
      />
    ));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement de votre boutique..." />
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Erreur lors du chargement des données</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ma Boutique</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="pencil" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Informations du prestataire */}
      <View style={styles.providerInfo}>
        <View style={styles.providerHeader}>
          <Image source={{ uri: provider.avatar }} style={styles.providerAvatar} />
          <View style={styles.providerDetails}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <View style={styles.ratingContainer}>
              {renderStars(averageRating)}
              <Text style={styles.ratingText}>
                {averageRating > 0 ? averageRating.toFixed(1) : '0.0'} ({totalReviews} avis)
              </Text>
            </View>
            <View style={styles.onlineStatus}>
              <View style={[styles.statusDot, { backgroundColor: provider.isOnline ? COLORS.success : COLORS.error }]} />
              <Text style={styles.statusText}>{provider.isOnline ? 'En ligne' : 'Hors ligne'}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.providerDescription}>{provider.description}</Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un service..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Catégories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={20} 
                color={selectedCategory === category.id ? COLORS.white : COLORS.primary} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes Services</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={styles.addButtonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>

        {filteredServices.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="construct-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>Aucun service</Text>
            <Text style={styles.emptyStateText}>Ajoutez votre premier service pour commencer</Text>
          </View>
        ) : (
          filteredServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => handleServicePress(service)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: service.image }} style={styles.serviceImage} />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <View style={styles.serviceMeta}>
                  <View style={styles.serviceDetail}>
                    <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.serviceDetailText}>{service.duration}min</Text>
                  </View>
                  <Text style={styles.servicePrice}>{service.price}€</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editServiceButton}>
                <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Avis clients */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Avis clients</Text>
          <TouchableOpacity onPress={handleViewAllReviews}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {reviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>Aucun avis</Text>
            <Text style={styles.emptyStateText}>Vous n'avez pas encore reçu d'avis</Text>
          </View>
        ) : (
          reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: review.clientAvatar }} style={styles.reviewerAvatar} />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>{review.clientName}</Text>
                <View style={styles.reviewRating}>
                  {renderStars(review.rating)}
                </View>
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
          ))
        )}
      </View>

      {/* Informations de contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations de contact</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactItem}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>{provider.address}</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>{provider.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>{provider.email}</Text>
          </View>
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
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInfo: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' } : {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  providerDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' } : {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 8,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' } : {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  section: {
    marginBottom: 24,
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
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' } : {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  serviceInfo: {
    padding: 16,
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
    marginBottom: 12,
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDetailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  editServiceButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' } : {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' } : {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
  },
});

export default ProviderShopScreen; 