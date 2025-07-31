import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceProvider } from '../types';
import { COLORS } from '../constants/colors';

interface ProviderCardProps {
  provider: ServiceProvider;
  onPress: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={{ uri: provider.avatar }} 
        style={styles.avatar}
        defaultSource={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
      />
      
      <View style={styles.info}>
        <Text style={styles.name}>{provider.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={COLORS.accent} />
          <Text style={styles.rating}>{provider.rating}</Text>
          <Text style={styles.reviewCount}>({provider.reviewCount})</Text>
        </View>
        
        <Text style={styles.services}>
          {provider.services.length} service{provider.services.length > 1 ? 's' : ''} disponible{provider.services.length > 1 ? 's' : ''}
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
      
      <View style={styles.arrow}>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
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
  arrow: {
    marginLeft: 8,
  },
});

export default ProviderCard; 