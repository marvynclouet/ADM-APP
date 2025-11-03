import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  style?: any;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, style }) => {
  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          {index > 0 && (
            <Ionicons 
              name="chevron-forward" 
              size={16} 
              color={COLORS.textSecondary} 
              style={styles.separator}
            />
          )}
          <TouchableOpacity
            onPress={item.onPress}
            disabled={!item.onPress}
            style={styles.item}
          >
            <Text
              style={[
                styles.label,
                !item.onPress && styles.labelDisabled,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  labelDisabled: {
    color: COLORS.textSecondary,
  },
  separator: {
    marginHorizontal: 4,
  },
});

export default Breadcrumb;



