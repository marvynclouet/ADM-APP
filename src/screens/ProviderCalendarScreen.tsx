import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { AuthService } from '../../backend/services/auth.service';
import { BookingsService } from '../../backend/services/bookings.service';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../hooks/useToast';

const screenWidth = Dimensions.get('window').width;

interface ProviderCalendarScreenProps {
  navigation?: any;
}

interface Booking {
  id: string;
  clientName: string;
  service: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  bookingDate: string;
  bookingTime: string;
  serviceId?: string;
  userId?: string;
}

const ProviderCalendarScreen: React.FC<ProviderCalendarScreenProps> = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { showSuccess, showError } = useToast();

  const today = new Date();
  const currentWeek = getWeekDates(currentDate);
  const currentMonth = getMonthDates(currentDate);

  // Charger les réservations
  const loadBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const user = await AuthService.getCurrentUser();
      if (!user || !user.is_provider || !user.id) {
        Alert.alert('Erreur', 'Vous n\'êtes pas un prestataire');
        return;
      }

      // Charger toutes les réservations du prestataire
      const providerBookings = await BookingsService.getProviderBookings(user.id);

      // Transformer les données
      const transformedBookings: Booking[] = (providerBookings || []).map((booking: any) => ({
        id: booking.id,
        clientName: booking.user?.first_name && booking.user?.last_name
          ? `${booking.user.first_name} ${booking.user.last_name}`
          : booking.user?.email || 'Client',
        service: booking.service?.name || 'Service',
        time: booking.booking_time || '',
        duration: booking.duration_minutes || 60,
        status: booking.status || 'pending',
        bookingDate: booking.booking_date || '',
        bookingTime: booking.booking_time || '',
        serviceId: booking.service_id,
        userId: booking.user_id,
      }));

      setBookings(transformedBookings);
    } catch (error: any) {
      console.error('Erreur lors du chargement des réservations:', error);
      showError('Erreur lors du chargement des réservations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [loadBookings])
  );

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  function getWeekDates(date: Date) {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  }

  function getMonthDates(date: Date) {
    const month = [];
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      month.push(day);
    }
    return month;
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => booking.bookingDate === dateStr);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return COLORS.warning;
      case 'confirmed':
        return COLORS.primary; // En cours
      case 'completed':
        return COLORS.success; // Terminé
      case 'cancelled':
        return COLORS.error;
      case 'no_show':
        return COLORS.textSecondary;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      case 'no_show':
        return 'Absent';
      default:
        return status;
    }
  };

  const handleBookingPress = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalVisible(true);
  };

  const handleStatusChange = async (newStatus: 'confirmed' | 'completed' | 'cancelled' | 'no_show') => {
    if (!selectedBooking) return;

    try {
      await BookingsService.updateBookingStatus(selectedBooking.id, newStatus);
      showSuccess(`Réservation marquée comme "${getStatusLabel(newStatus)}"`);
      setModalVisible(false);
      await loadBookings();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      showError(error.message || 'Erreur lors de la mise à jour');
    }
  };

  const renderWeekView = () => {
    return (
      <View style={styles.weekContainer}>
        <View style={styles.weekHeader}>
          {currentWeek.map((day, index) => {
            const dayBookings = getBookingsForDate(day);
            return (
              <View key={index} style={styles.weekDay}>
                <Text style={[styles.weekDayName, isToday(day) && styles.weekDayNameToday]}>
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][day.getDay()]}
                </Text>
                <Text style={[styles.weekDayNumber, isToday(day) && styles.weekDayNumberToday]}>
                  {day.getDate()}
                </Text>
                {dayBookings.length > 0 && (
                  <View style={styles.bookingIndicator}>
                    <Text style={styles.bookingIndicatorText}>{dayBookings.length}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Timeline */}
        <ScrollView style={styles.timelineContainer}>
          {Array.from({ length: 24 }, (_, hour) => (
            <View key={hour} style={styles.timelineRow}>
              <Text style={styles.timelineHour}>{String(hour).padStart(2, '0')}:00</Text>
              <View style={styles.timelineSlots}>
                {currentWeek.map((day, dayIndex) => {
                  const dayBookings = getBookingsForDate(day);
                  const hourBookings = dayBookings.filter(booking => {
                    const bookingHour = parseInt(booking.time.split(':')[0]);
                    return bookingHour === hour;
                  });

                  if (hourBookings.length > 0) {
                    return (
                      <View key={dayIndex} style={styles.bookingSlotContainer}>
                        {hourBookings.map((booking, bookingIndex) => (
                          <TouchableOpacity
                            key={booking.id}
                            style={[
                              styles.bookingSlot,
                              {
                                backgroundColor: getStatusColor(booking.status),
                                height: Math.max(60, booking.duration / 60 * 60),
                                marginBottom: bookingIndex < hourBookings.length - 1 ? 2 : 0,
                              },
                            ]}
                            onPress={() => handleBookingPress(booking)}
                          >
                            <Text style={styles.bookingSlotText} numberOfLines={1}>
                              {booking.service}
                            </Text>
                            <Text style={styles.bookingSlotClient} numberOfLines={1}>
                              {booking.clientName}
                            </Text>
                            <Text style={styles.bookingSlotTime}>{booking.time}</Text>
                            <View style={styles.bookingSlotStatus}>
                              <Text style={styles.bookingSlotStatusText}>
                                {getStatusLabel(booking.status)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    );
                  }
                  return <View key={dayIndex} style={styles.emptySlot} />;
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderMonthView = () => {
    const monthDates = currentMonth;
    const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    return (
      <View style={styles.monthContainer}>
        <View style={styles.monthHeader}>
          {weekDays.map(day => (
            <Text key={day} style={styles.monthHeaderDay}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.monthGrid}>
          {monthDates.map((date, index) => {
            const dayBookings = getBookingsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.monthDay,
                  !isCurrentMonthDay && styles.monthDayOtherMonth,
                  isTodayDate && styles.monthDayToday,
                ]}
                onPress={() => {
                  if (dayBookings.length > 0) {
                    // Afficher les réservations du jour
                    const bookingsList = dayBookings.map(b => 
                      `${b.time} - ${b.service} (${getStatusLabel(b.status)})`
                    ).join('\n');
                    Alert.alert(
                      `Réservations du ${date.toLocaleDateString('fr-FR')}`,
                      bookingsList
                    );
                  }
                }}
              >
                <Text
                  style={[
                    styles.monthDayNumber,
                    !isCurrentMonthDay && styles.monthDayNumberOtherMonth,
                    isTodayDate && styles.monthDayNumberToday,
                  ]}
                >
                  {date.getDate()}
                </Text>
                {dayBookings.length > 0 && (
                  <View style={styles.monthBookingIndicator}>
                    <Text style={styles.monthBookingIndicatorText}>{dayBookings.length}</Text>
                  </View>
                )}
                {/* Afficher les différents statuts avec des couleurs */}
                {dayBookings.length > 0 && (
                  <View style={styles.monthStatusIndicators}>
                    {dayBookings.map((booking, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.monthStatusDot,
                          { backgroundColor: getStatusColor(booking.status) },
                        ]}
                      />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement du calendrier..." />
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
          <Text style={styles.headerTitle}>Planning</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Légende des statuts */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
          <Text style={styles.legendText}>En attente</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.legendText}>En cours</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
          <Text style={styles.legendText}>Terminé</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
          <Text style={styles.legendText}>Annulé</Text>
        </View>
      </View>

      {/* View Mode Selector */}
      <View style={styles.viewModeSelector}>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'week' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('week')}
        >
          <Text
            style={[styles.viewModeText, viewMode === 'week' && styles.viewModeTextActive]}
          >
            Semaine
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'month' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('month')}
        >
          <Text
            style={[styles.viewModeText, viewMode === 'month' && styles.viewModeTextActive]}
          >
            Mois
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Navigation */}
      <View style={styles.dateNavigation}>
        <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {viewMode === 'week'
            ? `${currentWeek[0].toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
              })} - ${currentWeek[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
            : currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentDate(new Date())}
          style={styles.todayButton}
        >
          <Text style={styles.todayButtonText}>Aujourd'hui</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar View */}
      <ScrollView 
        style={styles.calendarContent} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === 'week' ? renderWeekView() : renderMonthView()}
      </ScrollView>

      {/* Modal de détails de réservation */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Détails de la réservation</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {selectedBooking && (
              <View style={styles.modalBody}>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Client:</Text>
                  <Text style={styles.modalValue}>{selectedBooking.clientName}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Service:</Text>
                  <Text style={styles.modalValue}>{selectedBooking.service}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Date:</Text>
                  <Text style={styles.modalValue}>
                    {new Date(selectedBooking.bookingDate).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Heure:</Text>
                  <Text style={styles.modalValue}>{selectedBooking.time}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Durée:</Text>
                  <Text style={styles.modalValue}>{selectedBooking.duration} min</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Statut:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedBooking.status) }]}>
                    <Text style={styles.statusBadgeText}>
                      {getStatusLabel(selectedBooking.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  {selectedBooking.status === 'pending' && (
                    <TouchableOpacity
                      style={[styles.modalActionButton, { backgroundColor: COLORS.primary }]}
                      onPress={() => handleStatusChange('confirmed')}
                    >
                      <Ionicons name="checkmark" size={20} color={COLORS.white} />
                      <Text style={styles.modalActionButtonText}>Confirmer (En cours)</Text>
                    </TouchableOpacity>
                  )}
                  {selectedBooking.status === 'confirmed' && (
                    <TouchableOpacity
                      style={[styles.modalActionButton, { backgroundColor: COLORS.success }]}
                      onPress={() => handleStatusChange('completed')}
                    >
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                      <Text style={styles.modalActionButtonText}>Marquer comme terminé</Text>
                    </TouchableOpacity>
                  )}
                  {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                    <TouchableOpacity
                      style={[styles.modalActionButton, { backgroundColor: COLORS.error }]}
                      onPress={() => {
                        Alert.alert(
                          'Annuler la réservation',
                          'Êtes-vous sûr de vouloir annuler cette réservation ?',
                          [
                            { text: 'Non', style: 'cancel' },
                            { text: 'Oui', onPress: () => handleStatusChange('cancelled') },
                          ]
                        );
                      }}
                    >
                      <Ionicons name="close-circle" size={20} color={COLORS.white} />
                      <Text style={styles.modalActionButtonText}>Annuler</Text>
                    </TouchableOpacity>
                  )}
                  {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending') && (
                    <TouchableOpacity
                      style={[styles.modalActionButton, { backgroundColor: COLORS.textSecondary }]}
                      onPress={() => {
                        Alert.alert(
                          'Client absent',
                          'Le client ne s\'est pas présenté ?',
                          [
                            { text: 'Non', style: 'cancel' },
                            { text: 'Oui', onPress: () => handleStatusChange('no_show') },
                          ]
                        );
                      }}
                    >
                      <Ionicons name="person-remove" size={20} color={COLORS.white} />
                      <Text style={styles.modalActionButtonText}>Client absent</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
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
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  viewModeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    gap: 16,
  },
  viewModeButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  viewModeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  viewModeTextActive: {
    color: COLORS.white,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  navButton: {
    padding: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  todayButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  calendarContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  weekContainer: {
    backgroundColor: COLORS.white,
  },
  weekHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  weekDayNameToday: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  weekDayNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  weekDayNumberToday: {
    color: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
    borderRadius: 20,
    width: 32,
    height: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  bookingIndicator: {
    marginTop: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bookingIndicatorText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timelineContainer: {
    flex: 1,
  },
  timelineRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    minHeight: 80,
  },
  timelineHour: {
    width: 50,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  timelineSlots: {
    flex: 1,
    flexDirection: 'row',
  },
  bookingSlotContainer: {
    flex: 1,
    margin: 2,
  },
  bookingSlot: {
    flex: 1,
    marginBottom: 2,
    padding: 8,
    borderRadius: 8,
    justifyContent: 'flex-start',
    minHeight: 60,
  },
  bookingSlotText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  bookingSlotClient: {
    color: COLORS.white,
    fontSize: 10,
    opacity: 0.9,
    marginBottom: 2,
  },
  bookingSlotTime: {
    color: COLORS.white,
    fontSize: 10,
    opacity: 0.8,
    marginBottom: 4,
  },
  bookingSlotStatus: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bookingSlotStatusText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '600',
  },
  emptySlot: {
    flex: 1,
    margin: 2,
  },
  monthContainer: {
    backgroundColor: COLORS.white,
  },
  monthHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  monthHeaderDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthDay: {
    width: screenWidth / 7,
    aspectRatio: 1,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthDayOtherMonth: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.3,
  },
  monthDayToday: {
    backgroundColor: COLORS.primary + '20',
  },
  monthDayNumber: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  monthDayNumberOtherMonth: {
    color: COLORS.textSecondary,
  },
  monthDayNumberToday: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  monthBookingIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  monthBookingIndicatorText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
  monthStatusIndicators: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  monthStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  modalBody: {
    padding: 20,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  modalValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  modalActions: {
    marginTop: 20,
    gap: 12,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  modalActionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProviderCalendarScreen;
