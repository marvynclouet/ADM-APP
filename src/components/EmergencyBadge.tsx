import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface EmergencyBadgeProps {
  size?: 'small' | 'medium' | 'large';
}

const EmergencyBadge: React.FC<EmergencyBadgeProps> = ({ size = 'medium' }) => {
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
    <View
      style={[
        styles.badge,
        {
          padding: sizeConfig.padding,
          paddingHorizontal: sizeConfig.paddingHorizontal,
        },
      ]}
    >
      <Ionicons
        name="flash"
        size={sizeConfig.iconSize}
        color={COLORS.error}
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
        Urgence
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.error + '20',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    color: COLORS.error,
    fontWeight: '600',
  },
});

export default EmergencyBadge;
