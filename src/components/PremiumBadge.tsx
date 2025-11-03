import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

interface PremiumBadgeProps {
  size?: 'small' | 'medium' | 'large';
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ size = 'medium' }) => {
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { fontSize: 10, iconSize: 12, padding: 4, paddingHorizontal: 6 };
      case 'large':
        return { fontSize: 14, iconSize: 18, padding: 8, paddingHorizontal: 12 };
      default:
        return { fontSize: 12, iconSize: 14, padding: 6, paddingHorizontal: 8 };
    }
  };

  const sizeConfig = getSizeConfig();

  return (
    <LinearGradient
      colors={[COLORS.warning, '#FF8C00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.badge,
        {
          padding: sizeConfig.padding,
          paddingHorizontal: sizeConfig.paddingHorizontal,
        },
      ]}
    >
      <Ionicons
        name="star"
        size={sizeConfig.iconSize}
        color={COLORS.white}
        style={styles.icon}
      />
      <Text
        style={[
          styles.label,
          {
            fontSize: sizeConfig.fontSize,
          },
        ]}
      >
        Premium
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default PremiumBadge;

