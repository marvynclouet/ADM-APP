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

interface ServiceListItemProps {
  service: Service;
  provider: ServiceProvider;
  distance: number;
  onPress: () => void;
}

const ServiceListItem: React.FC<ServiceListItemProps> = ({
  service,
  provider,
  distance,
  onPress,
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
      <Image
        source={{ uri: service.image }}
        style={styles.serviceImage}
        resizeMode="cover"
      />
      
      {/* Informations du service */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(service.price)}</Text>
          </View>
        </View>
        
        <Text style={styles.description}>{service.description}</Text>
        
        {/* Informations du prestataire */}
        <View style={styles.providerInfo}>
          <Image
            source={{ uri: provider.avatar }}
            style={styles.providerAvatar}
          />
          <View style={styles.providerDetails}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={COLORS.warning} />
              <Text style={styles.rating}>{provider.rating}</Text>
              <Text style={styles.reviewCount}>({provider.reviewCount})</Text>
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
  serviceImage: {
    width: '100%',
    height: 160,
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
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 12,
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
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
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