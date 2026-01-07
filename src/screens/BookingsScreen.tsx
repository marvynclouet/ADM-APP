import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import RatingModal from '../components/RatingModal';
import { useReviews } from '../hooks/useReviews';
import { useToast } from '../hooks/useToast';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { ReviewsService } from '../../backend/services/reviews.service';
import { BookingsService } from '../../backend/services/bookings.service';
import { AuthService } from '../../backend/services/auth.service';
import { supabase } from '../../backend/supabase/config';

interface BookingsScreenProps {
  navigation?: any;
}

const BookingsScreen: React.FC<BookingsScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [bookingsWithReviews, setBookingsWithReviews] = useState<Set<string>>(new Set());
  const { addReview } = useReviews();
  const { showSuccess, showError } = useToast();

  // Charger les réservations depuis Supabase
  useFocusEffect(
    React.useCallback(() => {
      loadBookings();
    }, [])
  );

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const user = await AuthService.getCurrentUser();
      if (!user || !user.id) {
        console.warn('Utilisateur non connecté');
        setBookings([]);
        return;
      }

      setCurrentUserId(user.id);
      const userBookings = await BookingsService.getUserBookings(user.id);
      
      // Transformer les données Supabase en format attendu
      const transformedBookings = userBookings.map((booking: any) => ({
        id: booking.id,
        service: {
          id: booking.service?.id || booking.service_id,
          name: booking.service?.name || 'Service',
          price: booking.service?.price || booking.total_price || 0,
          duration: booking.service?.duration_minutes || booking.duration_minutes || 60,
        },
        provider: {
          id: booking.provider?.id || booking.provider_id,
          name: booking.provider 
            ? `${booking.provider.first_name || ''} ${booking.provider.last_name || ''}`.trim() || booking.provider.email || 'Prestataire'
            : 'Prestataire',
          avatar: booking.provider?.avatar_url,
          phone: booking.provider?.phone,
          address: booking.provider?.address || booking.provider?.city || '',
        },
        date: booking.booking_date,
        time: booking.booking_time,
        status: booking.status || 'pending',
        totalPrice: booking.total_price || 0,
        notes: booking.client_notes,
        createdAt: booking.created_at,
      }));

      setBookings(transformedBookings);

      // Vérifier quelles réservations ont déjà un avis (optimisé : une seule requête)
      const reviewsSet = new Set<string>();
      const completedBookings = transformedBookings.filter(b => {
        const bookingDate = new Date(`${b.date}T${b.time}`);
        const isPast = bookingDate < new Date();
        return b.status === 'completed' || (isPast && b.status !== 'cancelled');
      });
      
      if (completedBookings.length > 0) {
        // Récupérer tous les avis pour ces réservations en une seule requête
        const bookingIds = completedBookings.map(b => b.id);
        try {
          const { data: reviews, error } = await supabase
            .from('reviews')
            .select('booking_id')
            .in('booking_id', bookingIds);
          
          if (!error && reviews) {
            reviews.forEach((review: any) => {
              reviewsSet.add(review.booking_id);
            });
          }
        } catch (error) {
          console.error('Erreur lors de la vérification des avis:', error);
        }
      }
      
      setBookingsWithReviews(reviewsSet);
    } catch (error: any) {
      console.error('Erreur lors du chargement des réservations:', error);
      showError('Erreur lors du chargement des réservations');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les réservations selon l'onglet sélectionné
  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    const now = new Date();
    return bookingDate >= now && (booking.status === 'confirmed' || booking.status === 'pending');
  });

  const pastBookings = bookings.filter(booking => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    const now = new Date();
    // Inclure les réservations passées (date < maintenant) ou avec statut completed/cancelled
    return bookingDate < now || booking.status === 'completed' || booking.status === 'cancelled';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'cancelled':
        return COLORS.error;
      case 'completed':
        return COLORS.info;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  const handleViewDetails = (booking: any) => {
    if (navigation) {
      navigation.navigate('BookingConfirmation', { booking });
    }
  };

  const handleCancelBooking = async (booking: any) => {
    try {
      // TODO: Implémenter l'annulation via BookingsService.updateBookingStatus
      console.log('Annulation de la réservation:', booking.id);
      showSuccess('Réservation annulée');
      await loadBookings(); // Recharger les réservations
    } catch (error: any) {
      console.error('Erreur lors de l\'annulation:', error);
      showError('Erreur lors de l\'annulation de la réservation');
    }
  };

  const handleReserveService = () => {
    if (navigation) {
      navigation.navigate('Search');
    }
  };

  const handleRateService = (booking: any) => {
    setSelectedBooking(booking);
    setRatingModalVisible(true);
  };

  const handleSubmitRating = async (rating: number, review: string) => {
    if (!selectedBooking || !currentUserId) {
      showError('Impossible de soumettre l\'avis. Données manquantes.');
      return;
    }

    try {
      // Créer l'avis dans Supabase
      await ReviewsService.createReview({
        bookingId: selectedBooking.id,
        userId: currentUserId,
        providerId: selectedBooking.provider.id,
        serviceId: selectedBooking.service.id,
        rating,
        comment: review || undefined,
      });

      // Mettre à jour la liste des réservations avec avis
      setBookingsWithReviews(prev => new Set(prev).add(selectedBooking.id));

      showSuccess('Merci pour votre avis !');
      setRatingModalVisible(false);
      
      // Recharger les réservations pour mettre à jour l'affichage
      await loadBookings();
    } catch (error: any) {
      console.error('Erreur lors de la soumission de l\'avis:', error);
      showError(error.message || 'Erreur lors de la soumission de l\'avis');
    }
  };

  const renderBookingCard = (booking: any) => (
    <View key={booking.id} style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.serviceName}>{booking.service.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
        </View>
      </View>
      
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="person" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>{booking.provider.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>
            {new Date(booking.date).toLocaleDateString('fr-FR')} à {booking.time}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="pricetag" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>{booking.totalPrice}€</Text>
        </View>
      </View>
      
      <View style={styles.bookingActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleViewDetails(booking)}
        >
          <Text style={styles.actionButtonText}>Voir détails</Text>
        </TouchableOpacity>
        {booking.status === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelBooking(booking)}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        )}
        {(() => {
          // Afficher le bouton "Noter" pour les réservations passées (complétées ou date passée) qui n'ont pas encore été notées
          const bookingDate = new Date(`${booking.date}T${booking.time}`);
          const isPast = bookingDate < new Date();
          const canRate = (booking.status === 'completed' || isPast) && booking.status !== 'cancelled';
          const hasReview = bookingsWithReviews.has(booking.id);
          
          if (canRate && !hasReview) {
            return (
              <TouchableOpacity 
                style={[styles.actionButton, styles.rateButton]}
                onPress={() => handleRateService(booking)}
              >
                <Ionicons name="star" size={16} color="white" style={{ marginRight: 4 }} />
                <Text style={styles.rateButtonText}>Noter</Text>
              </TouchableOpacity>
            );
          }
          
          if (canRate && hasReview) {
            return (
              <View style={[styles.actionButton, styles.ratedButton]}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} style={{ marginRight: 4 }} />
                <Text style={styles.ratedButtonText}>Noté</Text>
              </View>
            );
          }
          
          return null;
        })()}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Réservations</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'upcoming' && styles.activeTab]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.activeTabText]}>
            À venir ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'past' && styles.activeTab]}
          onPress={() => setSelectedTab('past')}
        >
          <Text style={[styles.tabText, selectedTab === 'past' && styles.activeTabText]}>
            Passées ({pastBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner text="Chargement de vos réservations..." />
      ) : (
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {selectedTab === 'upcoming' ? (
            upcomingBookings.length > 0 ? (
              upcomingBookings.map(renderBookingCard)
            ) : (
              <EmptyState
                icon="calendar-outline"
                title="Aucune réservation à venir"
                description="Vous n'avez pas encore de réservations programmées"
                actionText="Réserver un service"
                onAction={handleReserveService}
              />
            )
          ) : (
            pastBookings.length > 0 ? (
              pastBookings.map(renderBookingCard)
            ) : (
              <EmptyState
                icon="time-outline"
                title="Aucune réservation passée"
                description="Vos réservations terminées apparaîtront ici"
              />
            )
          )}
        </ScrollView>
      )}

      {/* Rating Modal */}
      <RatingModal
        visible={ratingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        onSubmit={handleSubmitRating}
        providerName={selectedBooking?.provider?.name || 'Prestataire'}
        serviceName={selectedBooking?.service?.name || 'Service'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  cancelButtonText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
  },
  rateButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  ratedButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratedButtonText: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
});

export default BookingsScreen;
