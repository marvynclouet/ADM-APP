import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useReviews } from '../hooks/useReviews';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';

const ProviderReviewsScreen: React.FC = () => {
  const {
    reviews,
    getReviewsByProvider,
    getAverageRating,
    getRatingStats,
    deleteReview,
  } = useReviews();

  const [selectedProvider, setSelectedProvider] = useState('1');
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const providerReviews = getReviewsByProvider(selectedProvider);
  const averageRating = getAverageRating(selectedProvider);
  const ratingStats = getRatingStats(selectedProvider);

  const filteredReviews = providerReviews.filter(review => {
    const matchesFilter = filter === 'all' || review.rating.toString() === filter;
    const matchesSearch = review.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDeleteReview = (reviewId: string) => {
    Alert.alert(
      'Supprimer l\'avis',
      'Êtes-vous sûr de vouloir supprimer cet avis ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteReview(reviewId),
        },
      ]
    );
  };

  const renderRatingStats = () => {
    const totalReviews = providerReviews.length;
    if (totalReviews === 0) return null;

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Répartition des notes</Text>
        {[5, 4, 3, 2, 1].map(rating => {
          const count = ratingStats[rating as keyof typeof ratingStats];
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <View key={rating} style={styles.statRow}>
              <Text style={styles.statLabel}>{rating} étoiles</Text>
              <View style={styles.statBarContainer}>
                <View style={styles.statBar}>
                  <View 
                    style={[
                      styles.statBarFill, 
                      { width: `${percentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.statCount}>{count}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Avis clients</Text>
        <View style={styles.ratingSummary}>
          <StarRating 
            rating={averageRating} 
            size={24} 
            showNumber 
            showCount 
            reviewCount={providerReviews.length}
          />
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher dans les avis..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {[
          { key: 'all', label: 'Tous', count: providerReviews.length },
          { key: '5', label: '5★', count: ratingStats[5] },
          { key: '4', label: '4★', count: ratingStats[4] },
          { key: '3', label: '3★', count: ratingStats[3] },
          { key: '2', label: '2★', count: ratingStats[2] },
          { key: '1', label: '1★', count: ratingStats[1] },
        ].map(({ key, label, count }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterTab,
              filter === key && styles.filterTabActive
            ]}
            onPress={() => setFilter(key as any)}
          >
            <Text style={[
              styles.filterTabText,
              filter === key && styles.filterTabTextActive
            ]}>
              {label} ({count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Rating Stats */}
      {renderRatingStats()}

      {/* Reviews List */}
      <ScrollView style={styles.reviewsContainer}>
        {filteredReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-outline" size={48} color="#E0E0E0" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Aucun avis trouvé' : 'Aucun avis pour le moment'}
            </Text>
          </View>
        ) : (
          filteredReviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              showService={true}
              style={styles.reviewCard}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  ratingSummary: {
    alignItems: 'flex-start',
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingLeft: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  filterTabActive: {
    backgroundColor: '#FF6B6B',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: 'white',
  },
  statsContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  statBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  statBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 10,
  },
  statBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  statCount: {
    fontSize: 12,
    color: '#666',
    minWidth: 20,
    textAlign: 'right',
  },
  reviewsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  reviewCard: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default ProviderReviewsScreen;






