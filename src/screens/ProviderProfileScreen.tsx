import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ServiceCard from '../components/ServiceCard';
import { ServiceProvider, Service } from '../types';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

interface ProviderProfileScreenProps {
  provider: ServiceProvider;
}

const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({ provider }) => {
  const [selectedTab, setSelectedTab] = useState<'services' | 'reviews' | 'info'>('services');

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < Math.floor(rating) ? 'star' : 'star-outline'}
        size={16}
        color={COLORS.accent}
      />
    ));
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'services':
        return (
          <View style={styles.tabContent}>
            {provider.services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => console.log('Service selected:', service.id)}
              />
            ))}
          </View>
        );
      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.noContentText}>Aucun avis pour le moment</Text>
          </View>
        );
      case 'info':
        return (
          <View style={styles.tabContent}>
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>À propos</Text>
              <Text style={styles.infoText}>{provider.description}</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Expérience</Text>
              <Text style={styles.infoText}>{provider.experience} ans d'expérience</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Certifications</Text>
              {provider.certifications.map((cert, index) => (
                <Text key={index} style={styles.infoText}>• {cert}</Text>
              ))}
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Adresse</Text>
              <Text style={styles.infoText}>{provider.location.address}</Text>
              <Text style={styles.infoText}>{provider.location.postalCode} {provider.location.city}</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          
          {/* Bouton favori */}
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Informations du prestataire */}
        <View style={styles.providerInfo}>
          <View style={styles.providerHeader}>
            <Image source={{ uri: provider.avatar }} style={styles.avatar} />
            <View style={styles.providerDetails}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <View style={styles.ratingContainer}>
                {renderStars(provider.rating || 0)}
                <Text style={styles.ratingText}>
                  {provider.rating} ({provider.reviewCount} avis)
                </Text>
              </View>
              <Text style={styles.providerLocation}>
                <Ionicons name="location" size={14} color={COLORS.textSecondary} />
                {' '}{provider.location.city}
              </Text>
            </View>
          </View>

          {/* Boutons d'action */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="call" size={20} color={COLORS.white} />
              <Text style={styles.contactButtonText}>Appeler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.messageButton}>
              <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Onglets */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'services' && styles.activeTab]}
            onPress={() => setSelectedTab('services')}
          >
            <Text style={[styles.tabText, selectedTab === 'services' && styles.activeTabText]}>
              Services
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'reviews' && styles.activeTab]}
            onPress={() => setSelectedTab('reviews')}
          >
            <Text style={[styles.tabText, selectedTab === 'reviews' && styles.activeTabText]}>
              Avis
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'info' && styles.activeTab]}
            onPress={() => setSelectedTab('info')}
          >
            <Text style={[styles.tabText, selectedTab === 'info' && styles.activeTabText]}>
              Infos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenu des onglets */}
        {renderTabContent()}
      </ScrollView>

      {/* Bouton de réservation flottant */}
      <View style={styles.floatingButton}>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Réserver maintenant</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 250,
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
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  providerInfo: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  providerLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  messageButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  messageButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  noContentText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 40,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
});

export default ProviderProfileScreen; 