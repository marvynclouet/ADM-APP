import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: {
    id: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    review: string;
    date: string;
    serviceName?: string;
    isVerified?: boolean;
  };
  showService?: boolean;
  style?: any;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  showService = false,
  style,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {review.userAvatar ? (
            <Image source={{ uri: review.userAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={20} color="#666" />
            </View>
          )}
          <View style={styles.userDetails}>
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{review.userName}</Text>
              {review.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              )}
            </View>
            <View style={styles.ratingContainer}>
              <StarRating rating={review.rating} size={14} showNumber />
              <Text style={styles.date}>{formatDate(review.date)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Service Name */}
      {showService && review.serviceName && (
        <View style={styles.serviceContainer}>
          <Ionicons name="cut" size={14} color="#666" />
          <Text style={styles.serviceName}>{review.serviceName}</Text>
        </View>
      )}

      {/* Review Text */}
      <Text style={styles.reviewText}>{review.review}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.actionButtons}>
          <View style={styles.actionButton}>
            <Ionicons name="thumbs-up-outline" size={16} color="#666" />
            <Text style={styles.actionText}>Utile</Text>
          </View>
          <View style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={16} color="#666" />
            <Text style={styles.actionText}>Répondre</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 12,
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default ReviewCard;



