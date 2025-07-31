import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceCategory } from '../types';
import { COLORS } from '../constants/colors';

interface CategoryCardProps {
  category: ServiceCategory;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const [iconError, setIconError] = useState(false);

  const handleIconError = () => {
    setIconError(true);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
        <Ionicons 
          name={iconError ? 'star-outline' : (category.icon as any)} 
          size={24} 
          color={COLORS.white}
          onError={handleIconError}
        />
      </View>
      <Text style={styles.title}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    marginHorizontal: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});

export default CategoryCard; 