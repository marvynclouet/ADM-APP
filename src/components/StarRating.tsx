import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showNumber?: boolean;
  showCount?: boolean;
  reviewCount?: number;
  color?: string;
  style?: any;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 16,
  showNumber = false,
  showCount = false,
  reviewCount = 0,
  color = '#FFD700',
  style,
}) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons
          key={`full-${i}`}
          name="star"
          size={size}
          color={color}
          style={styles.star}
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <Ionicons
          key="half"
          name="star-half"
          size={size}
          color={color}
          style={styles.star}
        />
      );
    }

    // Empty stars
    const emptyStars = maxRating - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={size}
          color="#E0E0E0"
          style={styles.star}
        />
      );
    }

    return stars;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
      
      {showNumber && (
        <Text style={[styles.ratingNumber, { fontSize: size * 0.8 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
      
      {showCount && reviewCount > 0 && (
        <Text style={[styles.reviewCount, { fontSize: size * 0.7 }]}>
          ({reviewCount})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 1,
  },
  ratingNumber: {
    marginLeft: 6,
    fontWeight: '600',
    color: '#333',
  },
  reviewCount: {
    marginLeft: 4,
    color: '#666',
  },
});

export default StarRating;



