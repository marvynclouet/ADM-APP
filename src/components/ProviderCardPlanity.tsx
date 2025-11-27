/**
 * ProviderCard inspiré de Planity
 * Grande image avec badge Featured, informations claires en dessous
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceProvider } from '../types';
import { COLORS } from '../constants/colors';
import FavoriteButton from './FavoriteButton';
import FeaturedBadge from './FeaturedBadge';
import PremiumBadge from './PremiumBadge';
import EmergencyBadge from './EmergencyBadge';

interface ProviderCardPlanityProps {
  provider: ServiceProvider;
  onPress: () => void;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onEmergencyPress?: () => void;
}

const ProviderCardPlanity: React.FC<ProviderCardPlanityProps> = ({
  provider,
  onPress,
  showFavoriteButton = true,
  isFavorite = false,
  onToggleFavorite,
  onEmergencyPress,
}) => {
  const isPremium = provider.isPremium || false;
  const acceptsEmergency = provider.acceptsEmergency || false;
  
  // Utiliser une image de service ou avatar comme image principale
  const mainImage = provider.services && provider.services.length > 0 && provider.services[0].image
    ? provider.services[0].image
    : provider.avatar || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400';

  // Générer des créneaux horaires (simulation)
  const timeSlots = ['10:00', '14:00', '16:00'];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Image principale avec badge Featured */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: mainImage }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        {isPremium && (
          <FeaturedBadge size="medium" position="top-left" />
        )}
        {showFavoriteButton && onToggleFavorite && (
          <View style={styles.favoriteButtonContainer}>
            <FavoriteButton
              isFavorite={isFavorite}
              onPress={(e) => {
                e?.stopPropagation?.();
                onToggleFavorite();
              }}
              size={24}
            />
          </View>
        )}
      </View>

      {/* Informations */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {provider.name}
            </Text>
            {isPremium && <PremiumBadge size="small" />}
            {acceptsEmergency && <EmergencyBadge size="small" />}
          </View>
        </View>

        {/* Adresse */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.location} numberOfLines={1}>
            {provider.activityZone || provider.location.address}
          </Text>
        </View>

        {/* Note et prix */}
        <View style={styles.metaRow}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={COLORS.warning} />
            <Text style={styles.rating}>
              {provider.rating?.toFixed(1) || '0.0'}
            </Text>
            <Text style={styles.reviewCount}>
              ({provider.reviewCount || 0} avis)
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {provider.priceRange
                ? `€${provider.priceRange.min}-€${provider.priceRange.max}`
                : '€€€'}
            </Text>
          </View>
        </View>

        {/* Créneaux horaires (inspiré de Planity) */}
        <View style={styles.timeSlotsContainer}>
          <Text style={styles.timeSlotLabel}>Disponible</Text>
          <View style={styles.timeSlotsRow}>
            {timeSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={styles.timeSlotPill}
                onPress={(e) => {
                  e?.stopPropagation?.();
                  // Navigation vers réservation avec ce créneau
                }}
              >
                <Text style={styles.timeSlotText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bouton Urgence si disponible */}
        {acceptsEmergency && onEmergencyPress && (
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={(e) => {
              e?.stopPropagation?.();
              onEmergencyPress();
            }}
          >
            <Ionicons name="flash" size={16} color={COLORS.white} />
            <Text style={styles.emergencyButtonText}>Réserver en urgence</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray,
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  timeSlotsContainer: {
    marginTop: 8,
  },
  timeSlotLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  timeSlotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  emergencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default ProviderCardPlanity;

