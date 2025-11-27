import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service, ServiceProvider } from '../types';
import { COLORS } from '../constants/colors';
import FavoriteButton from './FavoriteButton';
import PremiumBadge from './PremiumBadge';
import EmergencyBadge from './EmergencyBadge';

interface ServiceListItemProps {
  service: Service;
  provider: ServiceProvider;
  distance: number;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const ServiceListItem: React.FC<ServiceListItemProps> = ({
  service,
  provider,
  distance,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  const formatPrice = (price: number) => {
    return `${price}€`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? mins : ''}`;
    }
    return `${mins}min`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Image du service */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: service.image }}
          style={styles.serviceImage}
          resizeMode="cover"
        />
        {onToggleFavorite && (
          <View style={styles.favoriteButtonOverlay}>
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
      
      {/* Informations du service */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.serviceNameContainer}>
            <Text style={styles.serviceName}>{service.name}</Text>
            {service.isCustom && (
              <View style={styles.customBadge}>
                <Ionicons name="star" size={12} color={COLORS.accent} />
                <Text style={styles.customBadgeText}>Personnalisé</Text>
              </View>
            )}
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(service.price)}</Text>
          </View>
        </View>
        
        <Text style={styles.description}>{service.description}</Text>
        
        {/* Sous-catégorie si disponible */}
        {service.subcategory && (
          <View style={styles.subcategoryContainer}>
            <Text style={styles.subcategoryText}>{service.subcategory.name}</Text>
          </View>
        )}
        
        {/* Informations du prestataire */}
        <View style={styles.providerInfo}>
          <Image
            source={{ uri: provider.avatar }}
            style={styles.providerAvatar}
          />
          <View style={styles.providerDetails}>
            <View style={styles.providerNameRow}>
              <Text style={styles.providerName}>{provider.name}</Text>
              {provider.isPremium && <PremiumBadge size="small" />}
              {provider.acceptsEmergency && <EmergencyBadge size="small" />}
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={COLORS.warning} />
              <Text style={styles.rating}>{provider.rating}</Text>
              <Text style={styles.reviewCount}>({provider.reviewCount})</Text>
              {provider.activityZone && (
                <>
                  <Text style={styles.separator}>•</Text>
                  <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} />
                  <Text style={styles.locationText}>{provider.activityZone}</Text>
                </>
              )}
            </View>
          </View>
        </View>
        
        {/* Métadonnées */}
        <View style={styles.metadata}>
          <View style={styles.metadataItem}>
            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metadataText}>{formatDuration(service.duration)}</Text>
          </View>
          
          <View style={styles.metadataItem}>
            <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metadataText}>{formatDistance(distance)}</Text>
          </View>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{service.category.name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButtonOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceNameContainer: {
    flex: 1,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  customBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  customBadgeText: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: '600',
  },
  subcategoryContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  subcategoryText: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  priceContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  separator: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginHorizontal: 6,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: COLORS.categoryColors.coiffure,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default ServiceListItem; 