import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service, ServiceProvider } from '../types';
import { COLORS } from '../constants/colors';
import FavoriteButton from './FavoriteButton';
import PremiumBadge from './PremiumBadge';
import EmergencyBadge from './EmergencyBadge';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 48) / 2; // 2 colonnes avec marges

interface ServiceCardViewProps {
  service: Service;
  provider: ServiceProvider;
  distance: number;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const ServiceCardView: React.FC<ServiceCardViewProps> = ({
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
              size={20}
            />
          </View>
        )}
      </View>
      
      {/* Badge de distance */}
      <View style={styles.distanceBadge}>
        <Ionicons name="location" size={12} color={COLORS.white} />
        <Text style={styles.distanceText}>{formatDistance(distance)}</Text>
      </View>
      
      {/* Contenu */}
      <View style={styles.content}>
        <Text style={styles.serviceName} numberOfLines={2}>
          {service.name}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>
        
        {/* Prestataire */}
        <View style={styles.providerInfo}>
          <Image
            source={{ uri: provider.avatar }}
            style={styles.providerAvatar}
          />
          <View style={styles.providerDetails}>
            <View style={styles.providerNameRow}>
              <Text style={styles.providerName} numberOfLines={1}>
                {provider.name}
              </Text>
              {provider.isPremium && <PremiumBadge size="small" />}
              {provider.acceptsEmergency && <EmergencyBadge size="small" />}
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color={COLORS.warning} />
              <Text style={styles.rating}>{provider.rating}</Text>
            </View>
          </View>
        </View>
        
        {/* Prix et durée */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(service.price)}</Text>
          </View>
          <Text style={styles.duration}>{service.duration}min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButtonOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 10,
    color: COLORS.white,
    marginLeft: 2,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
    lineHeight: 18,
  },
  description: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 14,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  providerDetails: {
    flex: 1,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 2,
  },
  providerName: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  price: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  duration: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
});

export default ServiceCardView; 