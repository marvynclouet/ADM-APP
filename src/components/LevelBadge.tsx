import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { ServiceLevel } from '../types';

interface LevelBadgeProps {
  level: ServiceLevel;
  size?: 'small' | 'medium' | 'large';
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size = 'medium' }) => {
  const getLevelConfig = () => {
    switch (level) {
      case ServiceLevel.BEGINNER:
        return {
          label: 'Débutant',
          color: COLORS.success,
          icon: 'leaf-outline' as const,
        };
      case ServiceLevel.INTERMEDIATE:
        return {
          label: 'Intermédiaire',
          color: COLORS.accent,
          icon: 'star-outline' as const,
        };
      case ServiceLevel.ADVANCED:
        return {
          label: 'Avancé',
          color: COLORS.warning,
          icon: 'star' as const,
        };
      case ServiceLevel.PRO:
        return {
          label: 'Pro',
          color: COLORS.primary,
          icon: 'trophy' as const,
        };
      default:
        return {
          label: 'N/A',
          color: COLORS.textSecondary,
          icon: 'help-outline' as const,
        };
    }
  };

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

  const config = getLevelConfig();
  const sizeConfig = getSizeConfig();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.color + '20',
          borderColor: config.color,
          padding: sizeConfig.padding,
          paddingHorizontal: sizeConfig.paddingHorizontal,
        },
      ]}
    >
      <Ionicons
        name={config.icon}
        size={sizeConfig.iconSize}
        color={config.color}
        style={styles.icon}
      />
      <Text
        style={[
          styles.label,
          {
            color: config.color,
            fontSize: sizeConfig.fontSize,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontWeight: '600',
  },
});

export default LevelBadge;




