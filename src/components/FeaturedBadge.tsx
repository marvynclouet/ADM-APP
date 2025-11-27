/**
 * Badge "Featured" - Inspiré de Planit/Planity
 * Badge jaune/gold pour mettre en avant les prestataires/services premium
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface FeaturedBadgeProps {
  size?: 'small' | 'medium' | 'large';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const FeaturedBadge: React.FC<FeaturedBadgeProps> = ({
  size = 'medium',
  position = 'top-left',
}) => {
  const sizeStyles = {
    small: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontSize: 9,
      borderRadius: 4,
    },
    medium: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: 11,
      borderRadius: 6,
    },
    large: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 13,
      borderRadius: 8,
    },
  };

  const positionStyles = {
    'top-left': { top: 8, left: 8 },
    'top-right': { top: 8, right: 8 },
    'bottom-left': { bottom: 8, left: 8 },
    'bottom-right': { bottom: 8, right: 8 },
  };

  return (
    <View
      style={[
        styles.badge,
        sizeStyles[size],
        positionStyles[position],
      ]}
    >
      <Text style={[styles.badgeText, { fontSize: sizeStyles[size].fontSize }]}>
        Featured
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    backgroundColor: COLORS.featured,
    zIndex: 10,
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default FeaturedBadge;

