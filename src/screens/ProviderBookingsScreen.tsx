import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import NotificationBadge from '../components/NotificationBadge';
import EmptyState from '../components/EmptyState';
import { AuthService } from '../../backend/services/auth.service';
import { BookingsService } from '../../backend/services/bookings.service';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface ProviderBookingsScreenProps {
  navigation?: any;
}

const ProviderBookingsScreen: React.FC<ProviderBookingsScreenProps> = ({ navigation }) => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'>('pending');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [newBookingsCount, setNewBookingsCount] = useState(0);
  
  // Animation pour notifications
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Charger les réservations
  const loadBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const userData = await AuthService.getCurrentUser();
      if (!userData || !userData.is_provider) {
        Alert.alert('Erreur', 'Vous n\'êtes pas un prestataire');
        navigation?.goBack();
        return;
      }

      const bookingsData = await BookingsService.getProviderBookings(userData.id);
      
      // Transformer les données
      const transformedBookings = (bookingsData || []).map((booking: any) => {
        const clientName = booking.user 
          ? `${booking.user.first_name || ''} ${booking.user.last_name || ''}`.trim() || booking.user.email || 'Client'
          : 'Client';
        const clientAvatar = booking.user?.avatar_url || 
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${clientName}&backgroundColor=b6e3f4`;
        
        // Utiliser les statuts directement depuis la base de données
        const status = booking.status || 'pending';

        return {
          id: booking.id,
          clientName,
          clientAvatar,
          service: booking.service?.name || 'Service',
          date: booking.booking_date,
          time: booking.booking_time,
          duration: booking.duration_minutes || 0,
          price: parseFloat(booking.total_price) || 0,
          status: status as 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show',
          address: booking.user?.address || 'Adresse non renseignée',
        };
      });

      setBookings(transformedBookings);
      
      // Compter les réservations en attente
      const pendingCount = transformedBookings.filter(b => b.status === 'pending').length;
      setNewBookingsCount(pendingCount);
    } catch (error: any) {
      console.error('Erreur lors du chargement des réservations:', error);
      showError(error.message || 'Erreur lors du chargement des réservations');
    } finally {
      setIsLoading(false);
    }
  }, [navigation, showError]);

  // Recharger les données quand l'écran est focus
  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [loadBookings])
  );

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = bookings.filter(booking => booking.status === selectedTab);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return COLORS.warning;
      case 'confirmed': return COLORS.primary; // En cours
      case 'completed': return COLORS.success; // Terminé
      case 'cancelled': return COLORS.error;
      case 'no_show': return COLORS.textSecondary; // Absent
      default: return COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      case 'no_show': return 'Absent';
      default: return status;
    }
  };

  useEffect(() => {
    // useNativeDriver n'est pas supporté sur web
    const canUseNativeDriver = Platform.OS !== 'web';
    
    if (newBookingsCount > 0 && selectedTab === 'pending') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: canUseNativeDriver,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: canUseNativeDriver,
          }),
        ])
      );
      pulseAnimation.start();
    }
  }, [newBookingsCount, selectedTab]);

  const handleBookingAction = async (booking: any, action: string) => {
    switch (action) {
      case 'accept':
        Alert.alert('Confirmer', `Confirmer la réservation de ${booking.clientName} ? Elle passera en "En cours".`, [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Confirmer', 
            onPress: async () => {
              try {
                await BookingsService.updateBookingStatus(booking.id, 'confirmed');
                showSuccess('Réservation confirmée - Statut: En cours');
                await loadBookings();
              } catch (error: any) {
                showError(error.message || 'Erreur lors de la confirmation de la réservation');
              }
            }
          }
        ]);
        break;
      case 'complete':
        Alert.alert('Terminer', `Marquer la réservation de ${booking.clientName} comme terminée ?`, [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Terminer', 
            onPress: async () => {
              try {
                await BookingsService.updateBookingStatus(booking.id, 'completed');
                showSuccess('Réservation marquée comme terminée');
                await loadBookings();
              } catch (error: any) {
                showError(error.message || 'Erreur lors de la mise à jour');
              }
            }
          }
        ]);
        break;
      case 'no_show':
        Alert.alert('Client absent', `Le client ${booking.clientName} ne s'est pas présenté ?`, [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Confirmer', 
            onPress: async () => {
              try {
                await BookingsService.updateBookingStatus(booking.id, 'no_show');
                showSuccess('Réservation marquée comme "Client absent"');
                await loadBookings();
              } catch (error: any) {
                showError(error.message || 'Erreur lors de la mise à jour');
              }
            }
          }
        ]);
        break;
      case 'reject':
        setSelectedBooking(booking);
        setShowRejectModal(true);
        break;
      case 'edit':
        setSelectedBooking(booking);
        setNewDate(booking.date);
        setNewTime(booking.time);
        setShowEditModal(true);
        break;
      case 'message':
        // TODO: Naviguer vers l'écran de messagerie
        Alert.alert('Message', `Envoyer un message à ${booking.clientName}`);
        break;
      case 'call':
        // TODO: Implémenter l'appel
        Alert.alert('Appel', `Appeler ${booking.clientName}`);
        break;
      case 'details':
        Alert.alert('Détails', 
          `Client: ${booking.clientName}\nService: ${booking.service}\nDate: ${booking.date}\nHeure: ${booking.time}\nDurée: ${booking.duration}min\nPrix: ${booking.price}€\nAdresse: ${booking.address}`
        );
        break;
    }
  };

  const handleRejectBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      await BookingsService.updateBookingStatus(selectedBooking.id, 'cancelled', rejectReason);
      showSuccess('Réservation refusée avec succès');
      setShowRejectModal(false);
      setRejectReason('');
      await loadBookings();
    } catch (error: any) {
      showError(error.message || 'Erreur lors du refus de la réservation');
    }
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking || !newDate || !newTime) {
      Alert.alert('Erreur', 'Veuillez remplir la date et l\'heure');
      return;
    }

    // Valider le format de la date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newDate)) {
      Alert.alert('Erreur', 'Format de date invalide. Utilisez YYYY-MM-DD');
      return;
    }

    // Valider le format de l'heure
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(newTime)) {
      Alert.alert('Erreur', 'Format d\'heure invalide. Utilisez HH:MM');
      return;
    }

    try {
      await BookingsService.updateBookingDateTime(selectedBooking.id, newDate, newTime);
      showSuccess('Réservation modifiée avec succès');
      setShowEditModal(false);
      await loadBookings();
    } catch (error: any) {
      showError(error.message || 'Erreur lors de la modification de la réservation');
    }
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement des réservations..." />
      </View>
    );
  }

  return (
    <>
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes Réservations</Text>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => Alert.alert('Export', 'Export PDF des réservations à venir')}
          >
            <Ionicons name="download-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Onglets */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'pending' && styles.tabActive]}
          onPress={() => setSelectedTab('pending')}
        >
          <View style={styles.tabWithBadge}>
            <Text style={[styles.tabText, selectedTab === 'pending' && styles.tabTextActive]}>En attente</Text>
            {newBookingsCount > 0 && selectedTab === 'pending' && (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <NotificationBadge count={newBookingsCount} size="small" />
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'confirmed' && styles.tabActive]}
          onPress={() => setSelectedTab('confirmed')}
        >
          <Text style={[styles.tabText, selectedTab === 'confirmed' && styles.tabTextActive]}>En cours</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'completed' && styles.tabActive]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[styles.tabText, selectedTab === 'completed' && styles.tabTextActive]}>Terminées</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'cancelled' && styles.tabActive]}
          onPress={() => setSelectedTab('cancelled')}
        >
          <Text style={[styles.tabText, selectedTab === 'cancelled' && styles.tabTextActive]}>Annulées</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'no_show' && styles.tabActive]}
          onPress={() => setSelectedTab('no_show')}
        >
          <Text style={[styles.tabText, selectedTab === 'no_show' && styles.tabTextActive]}>Absents</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Liste des réservations */}
      <ScrollView 
        style={styles.bookingsList} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="Aucune réservation"
            description={
              selectedTab === 'pending' ? 'Aucune réservation en attente' :
              selectedTab === 'confirmed' ? 'Aucune réservation en cours' :
              selectedTab === 'completed' ? 'Aucune réservation terminée' :
              selectedTab === 'cancelled' ? 'Aucune réservation annulée' :
              'Aucun client absent'
            }
          />
        ) : (
          filteredBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <View style={styles.clientInfo}>
                  <Image source={{ uri: booking.clientAvatar }} style={styles.clientAvatar} />
                  <View style={styles.clientDetails}>
                    <Text style={styles.clientName}>{booking.clientName}</Text>
                    <Text style={styles.serviceName}>{booking.service}</Text>
                  </View>
                </View>
                <View style={styles.bookingStatus}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                      {getStatusText(booking.status)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{booking.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{booking.time} ({booking.duration}min)</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText} numberOfLines={1}>{booking.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="cash-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{booking.price}€</Text>
                </View>
              </View>

              <View style={styles.bookingActions}>
                {booking.status === 'pending' && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.acceptButton]}
                      onPress={() => handleBookingAction(booking, 'accept')}
                    >
                      <Ionicons name="checkmark" size={16} color={COLORS.white} />
                      <Text style={styles.acceptButtonText}>Confirmer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleBookingAction(booking, 'reject')}
                    >
                      <Ionicons name="close" size={16} color={COLORS.error} />
                      <Text style={styles.rejectButtonText}>Refuser</Text>
                    </TouchableOpacity>
                  </>
                )}
                
                {booking.status === 'confirmed' && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: COLORS.success }]}
                      onPress={() => handleBookingAction(booking, 'complete')}
                    >
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
                      <Text style={styles.acceptButtonText}>Terminer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: COLORS.textSecondary }]}
                      onPress={() => handleBookingAction(booking, 'no_show')}
                    >
                      <Ionicons name="person-remove" size={16} color={COLORS.white} />
                      <Text style={styles.acceptButtonText}>Absent</Text>
                    </TouchableOpacity>
                  </>
                )}
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleBookingAction(booking, 'message')}
                >
                  <Ionicons name="chatbubble-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleBookingAction(booking, 'call')}
                >
                  <Ionicons name="call-outline" size={16} color={COLORS.success} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleBookingAction(booking, 'details')}
                >
                  <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
                
                {(booking.status === 'confirmed' || booking.status === 'pending') && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleBookingAction(booking, 'edit')}
                  >
                    <Ionicons name="pencil" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal de refus avec raison */}
      <Modal
        visible={showRejectModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Refuser la réservation</Text>
            <Text style={styles.modalSubtitle}>
              Pourquoi refusez-vous cette réservation ? (optionnel)
            </Text>
            <TextInput
              style={styles.modalInput}
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholder="Raison du refus..."
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleRejectBooking}
              >
                <Text style={styles.modalButtonTextConfirm}>Refuser</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal d'édition */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier la réservation</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nouvelle date</Text>
              <TextInput
                style={styles.modalInput}
                value={newDate}
                onChangeText={setNewDate}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nouvelle heure</Text>
              <TextInput
                style={styles.modalInput}
                value={newTime}
                onChangeText={setNewTime}
                placeholder="HH:MM"
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowEditModal(false);
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleUpdateBooking}
              >
                <Text style={styles.modalButtonTextConfirm}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    <Toast
      visible={toast.visible}
      message={toast.message}
      type={toast.type}
      onHide={hideToast}
    />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    borderRadius: 12,
    marginRight: 4,
    minHeight: 28,
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  bookingsList: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' } : {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  serviceName: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  bookingStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
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
    flex: 1,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 2,
  },
  acceptButton: {
    backgroundColor: COLORS.success,
  },
  rejectButton: {
    backgroundColor: COLORS.error + '20',
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 4,
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 4,
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: COLORS.lightGray,
  },
  modalButtonConfirm: {
    backgroundColor: COLORS.primary,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default ProviderBookingsScreen; 