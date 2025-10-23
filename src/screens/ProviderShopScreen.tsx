import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

interface ProviderShopScreenProps {
  navigation?: any;
}

const ProviderShopScreen: React.FC<ProviderShopScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const provider = {
    name: 'Sophie Martin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=b6e3f4',
    rating: 4.8,
    totalReviews: 156,
    description: 'Coiffeuse professionnelle avec 8 ans d\'expérience. Spécialisée dans les coupes modernes et les colorations.',
    address: '123 Rue de la Paix, Paris',
    phone: '+33 6 12 34 56 78',
    email: 'sophie.martin@email.com',
    isOnline: true
  };

  const services = [
    {
      id: '1',
      name: 'Coupe + Brushing',
      description: 'Coupe personnalisée avec brushing professionnel',
      price: 45,
      duration: 90,
      category: 'coiffure',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Coloration',
      description: 'Coloration complète avec produits professionnels',
      price: 65,
      duration: 120,
      category: 'coiffure',
      image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Manucure',
      description: 'Manucure complète avec vernis semi-permanent',
      price: 35,
      duration: 60,
      category: 'manucure',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop'
    },
    {
      id: '4',
      name: 'Pédicure',
      description: 'Pédicure relaxante avec soin des pieds',
      price: 40,
      duration: 75,
      category: 'pedicure',
      image: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716e?w=300&h=200&fit=crop'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous', icon: 'grid-outline' },
    { id: 'coiffure', name: 'Coiffure', icon: 'cut-outline' },
    { id: 'manucure', name: 'Manucure', icon: 'hand-left-outline' },
    { id: 'pedicure', name: 'Pédicure', icon: 'foot-outline' }
  ];

  const reviews = [
    {
      id: '1',
      clientName: 'Marie Dupont',
      clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie&backgroundColor=b6e3f4',
      rating: 5,
      comment: 'Excellente coiffeuse ! Très professionnelle et à l\'écoute.',
      date: 'Il y a 2 jours'
    },
    {
      id: '2',
      clientName: 'Julie Martin',
      clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julie&backgroundColor=b6e3f4',
      rating: 4,
      comment: 'Très satisfaite de ma coupe, je recommande !',
      date: 'Il y a 1 semaine'
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleServicePress = (service: any) => {
    Alert.alert(
      'Service',
      `${service.name}\nPrix: ${service.price}€\nDurée: ${service.duration}min`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Modifier', onPress: () => Alert.alert('Modifier', 'Modifier ce service') },
        { text: 'Supprimer', style: 'destructive', onPress: () => Alert.alert('Supprimer', 'Supprimer ce service') }
      ]
    );
  };

  const handleAddService = () => {
    Alert.alert('Ajouter un service', 'Fonctionnalité à venir');
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Modifier le profil', 'Fonctionnalité à venir');
  };

  const handleViewAllReviews = () => {
    Alert.alert('Tous les avis', 'Voir tous les avis clients');
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
              {renderStars(provider.rating)}
              <Text style={styles.ratingText}>{provider.rating} ({provider.totalReviews} avis)</Text>
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

        {reviews.map((review) => (
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
        ))}
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
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
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
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
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
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
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
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
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
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
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
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
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
});

export default ProviderShopScreen; 