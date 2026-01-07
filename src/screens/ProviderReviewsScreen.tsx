import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { ReviewsService } from '../../backend/services/reviews.service';
import { AuthService } from '../../backend/services/auth.service';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';

interface ProviderReviewsScreenProps {
  navigation?: any;
}

const ProviderReviewsScreen: React.FC<ProviderReviewsScreenProps> = ({ navigation }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [ratingStats, setRatingStats] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [currentProviderId, setCurrentProviderId] = useState<string | null>(null);
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [responseText, setResponseText] = useState('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const { showSuccess, showError } = useToast();

  // Charger les données
  useFocusEffect(
    useCallback(() => {
      loadReviews();
    }, [])
  );

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const user = await AuthService.getCurrentUser();
      if (!user || !user.is_provider || !user.id) {
        Alert.alert('Erreur', 'Vous n\'êtes pas un prestataire');
        navigation?.goBack();
        return;
      }

      setCurrentProviderId(user.id);
      const reviewsData = await ReviewsService.getProviderReviews(user.id);
      const avgRating = await ReviewsService.calculateProviderAverageRating(user.id);
      const stats = await ReviewsService.getProviderRatingStats(user.id);

      setReviews(reviewsData || []);
      setAverageRating(avgRating);
      setRatingStats(stats);
    } catch (error: any) {
      console.error('Erreur lors du chargement des avis:', error);
      showError('Erreur lors du chargement des avis');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReviews = reviews.filter((review: any) => {
    const matchesFilter = filter === 'all' || review.rating.toString() === filter;
    const matchesSearch = 
      (review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (review.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (review.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    return matchesFilter && matchesSearch;
  });

  const handleAddResponse = (review: any) => {
    setSelectedReview(review);
    setResponseText(review.provider_response || '');
    setResponseModalVisible(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedReview || !currentProviderId || !responseText.trim()) {
      showError('Veuillez saisir une réponse');
      return;
    }

    try {
      setIsSubmittingResponse(true);
      await ReviewsService.addProviderResponse(
        selectedReview.id,
        currentProviderId,
        responseText.trim()
      );
      showSuccess('Réponse ajoutée avec succès');
      setResponseModalVisible(false);
      setResponseText('');
      await loadReviews();
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
      showError(error.message || 'Erreur lors de l\'ajout de la réponse');
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const handleDeleteResponse = async (review: any) => {
    if (!currentProviderId) return;

    Alert.alert(
      'Supprimer la réponse',
      'Êtes-vous sûr de vouloir supprimer votre réponse ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await ReviewsService.removeProviderResponse(review.id, currentProviderId);
              showSuccess('Réponse supprimée');
              await loadReviews();
            } catch (error: any) {
              console.error('Erreur lors de la suppression:', error);
              showError(error.message || 'Erreur lors de la suppression');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderRatingStats = () => {
    const totalReviews = reviews.length;
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

  const renderReviewCard = (review: any) => {
    const userName = review.user 
      ? `${review.user.first_name || ''} ${review.user.last_name || ''}`.trim() || 'Client'
      : 'Client';
    const userAvatar = review.user?.avatar_url || 
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}&backgroundColor=b6e3f4`;

    return (
      <View key={review.id} style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Image source={{ uri: userAvatar }} style={styles.reviewerAvatar} />
          <View style={styles.reviewerInfo}>
            <Text style={styles.reviewerName}>{userName}</Text>
            <View style={styles.ratingContainer}>
              <StarRating rating={review.rating} size={16} />
              <Text style={styles.reviewDate}>{formatDate(review.created_at)}</Text>
            </View>
          </View>
        </View>
        
        {review.comment && (
          <Text style={styles.reviewComment}>{review.comment}</Text>
        )}

        {review.service && (
          <Text style={styles.serviceName}>Service: {review.service.name}</Text>
        )}

        {/* Réponse du prestataire */}
        {review.provider_response ? (
          <View style={styles.responseContainer}>
            <View style={styles.responseHeader}>
              <Text style={styles.responseLabel}>Votre réponse</Text>
              <TouchableOpacity onPress={() => handleDeleteResponse(review)}>
                <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              </TouchableOpacity>
            </View>
            <Text style={styles.responseText}>{review.provider_response}</Text>
            {review.provider_response_at && (
              <Text style={styles.responseDate}>
                {formatDate(review.provider_response_at)}
              </Text>
            )}
            <TouchableOpacity 
              style={styles.editResponseButton}
              onPress={() => handleAddResponse(review)}
            >
              <Ionicons name="pencil" size={14} color={COLORS.primary} />
              <Text style={styles.editResponseText}>Modifier</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.addResponseButton}
            onPress={() => handleAddResponse(review)}
          >
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.primary} />
            <Text style={styles.addResponseText}>Répondre</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement des avis..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Avis clients</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.ratingSummary}>
          <StarRating 
            rating={averageRating} 
            size={24} 
            showNumber 
            showCount 
            reviewCount={reviews.length}
          />
        </View>
      </LinearGradient>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher dans les avis..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
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
          { key: 'all', label: 'Tous', count: reviews.length },
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
      <ScrollView 
        style={styles.reviewsContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Aucun avis trouvé' : 'Aucun avis pour le moment'}
            </Text>
          </View>
        ) : (
          filteredReviews.map(renderReviewCard)
        )}
      </ScrollView>

      {/* Modal pour répondre */}
      <Modal
        visible={responseModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setResponseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedReview?.provider_response ? 'Modifier votre réponse' : 'Répondre à l\'avis'}
              </Text>
              <TouchableOpacity onPress={() => setResponseModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedReview && (
                <>
                  <View style={styles.originalReview}>
                    <Text style={styles.originalReviewLabel}>Avis du client :</Text>
                    <Text style={styles.originalReviewText}>{selectedReview.comment || 'Aucun commentaire'}</Text>
                  </View>

                  <Text style={styles.inputLabel}>Votre réponse *</Text>
                  <TextInput
                    style={styles.responseInput}
                    placeholder="Tapez votre réponse ici..."
                    value={responseText}
                    onChangeText={setResponseText}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    maxLength={500}
                  />
                  <Text style={styles.characterCount}>
                    {responseText.length}/500 caractères
                  </Text>
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setResponseModalVisible(false);
                  setResponseText('');
                }}
              >
                <Text style={styles.cancelModalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.submitModalButton,
                  (!responseText.trim() || isSubmittingResponse) && styles.submitModalButtonDisabled
                ]}
                onPress={handleSubmitResponse}
                disabled={!responseText.trim() || isSubmittingResponse}
              >
                <Text style={styles.submitModalButtonText}>
                  {isSubmittingResponse ? 'Envoi...' : 'Envoyer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  ratingSummary: {
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 10,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: COLORS.white,
  },
  statsContainer: {
    backgroundColor: COLORS.white,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)' } : {
      elevation: 2,
    }),
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginRight: 10,
  },
  statBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 4,
  },
  statCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    minWidth: 20,
    textAlign: 'right',
  },
  reviewsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 10,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)' } : {
      elevation: 2,
    }),
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  responseContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  responseText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  responseDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  editResponseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  editResponseText: {
    fontSize: 12,
    color: COLORS.primary,
  },
  addResponseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  addResponseText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 15,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  modalBody: {
    padding: 20,
  },
  originalReview: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  originalReviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  originalReviewText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  responseInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelModalButton: {
    backgroundColor: COLORS.lightGray,
  },
  cancelModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  submitModalButton: {
    backgroundColor: COLORS.primary,
  },
  submitModalButtonDisabled: {
    opacity: 0.5,
  },
  submitModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default ProviderReviewsScreen;
