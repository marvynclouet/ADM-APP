import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceProvider } from '../types';
import { COLORS } from '../constants/colors';
import FavoriteButton from './FavoriteButton';
import StarRating from './StarRating';
import PremiumBadge from './PremiumBadge';
import EmergencyBadge from './EmergencyBadge';

interface ProviderCardProps {
  provider: ServiceProvider;
  onPress: () => void;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onEmergencyPress?: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ 
  provider, 
  onPress,
  showFavoriteButton = true,
  isFavorite = false,
  onToggleFavorite,
  onEmergencyPress,
}) => {
  const isPremium = provider.isPremium || false;
  const acceptsEmergency = provider.acceptsEmergency || false;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
    >
      <Image 
        source={{ uri: provider.avatar }} 
        style={styles.avatar}
        defaultSource={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
      />
      
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>
            {provider.name}
          </Text>
          {isPremium && <PremiumBadge size="small" />}
          {acceptsEmergency && <EmergencyBadge size="small" />}
        </View>
        
        <View style={styles.ratingContainer}>
          <StarRating 
            rating={provider.rating} 
            size={16} 
            showNumber 
            showCount 
            reviewCount={provider.reviewCount}
            color={COLORS.accent}
          />
        </View>
        
        <Text style={styles.services}>
          {(() => {
            const servicesCount = provider.services && Array.isArray(provider.services) ? provider.services.length : 0;
            return `${servicesCount} service${servicesCount > 1 ? 's' : ''} disponible${servicesCount > 1 ? 's' : ''}`;
          })()}
        </Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={14} color={COLORS.textSecondary} />
          <Text style={styles.location}>{provider.location.address}</Text>
        </View>
        
        <View style={styles.availabilityContainer}>
          <Ionicons name="time" size={14} color={COLORS.textSecondary} />
          <Text style={styles.availability}>Disponible aujourd'hui</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        {showFavoriteButton && onToggleFavorite && (
          <View style={styles.favoriteButton}>
            <FavoriteButton
              isFavorite={isFavorite}
              onPress={(e) => {
                e?.stopPropagation?.();
                onToggleFavorite();
              }}
              size={22}
            />
          </View>
        )}
        <View style={styles.arrow}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 0,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
    flexShrink: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  services: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  availability: {
    fontSize: 12,
    color: COLORS.success,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  arrow: {
    marginLeft: 4,
  },
});

export default ProviderCard; 