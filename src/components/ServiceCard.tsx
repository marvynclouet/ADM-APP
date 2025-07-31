import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../types';
import { COLORS } from '../constants/colors';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={{ uri: service.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.overlay}>
        <View style={[styles.categoryBadge, { backgroundColor: service.category.color }]}>
          <Text style={styles.categoryText}>{service.category.name}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>{service.duration} min</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="pricetag-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>{service.price}€</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '100%',
    height: 120,
  },
  overlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
});

export default ServiceCard; 