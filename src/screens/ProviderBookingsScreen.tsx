import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import NotificationBadge from '../components/NotificationBadge';
import EmptyState from '../components/EmptyState';

interface ProviderBookingsScreenProps {
  navigation?: any;
}

const ProviderBookingsScreen: React.FC<ProviderBookingsScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'pending' | 'completed' | 'cancelled'>('upcoming');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  
  // Animation pour notifications
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [newBookingsCount] = useState(3);

  const bookings = [
    {
      id: '1',
      clientName: 'Marie Dupont',
      clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie&backgroundColor=b6e3f4',
      service: 'Manucure',
      date: '2024-01-15',
      time: '14:00',
      duration: 60,
      price: 35,
      status: 'upcoming',
      address: '123 Rue de la Paix, Paris'
    },
    {
      id: '2',
      clientName: 'Julie Martin',
      clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julie&backgroundColor=b6e3f4',
      service: 'Coiffure',
      date: '2024-01-15',
      time: '16:30',
      duration: 90,
      price: 45,
      status: 'pending',
      address: '456 Avenue des Champs, Paris'
    },
    {
      id: '3',
      clientName: 'Sarah Bernard',
      clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
      service: 'Massage',
      date: '2024-01-14',
      time: '10:00',
      duration: 120,
      price: 80,
      status: 'completed',
      address: '789 Boulevard Saint-Germain, Paris'
    },
    {
      id: '4',
      clientName: 'Emma Wilson',
      clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=b6e3f4',
      service: 'Manucure',
      date: '2024-01-13',
      time: '15:00',
      duration: 60,
      price: 35,
      status: 'cancelled',
      address: '321 Rue du Commerce, Paris'
    }
  ];

  const filteredBookings = bookings.filter(booking => booking.status === selectedTab);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return COLORS.primary;
      case 'pending': return COLORS.warning;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  useEffect(() => {
    if (newBookingsCount > 0 && selectedTab === 'pending') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    }
  }, [newBookingsCount, selectedTab]);

  const handleBookingAction = (booking: any, action: string) => {
    switch (action) {
      case 'accept':
        Alert.alert('Confirmer', `Accepter la réservation de ${booking.clientName} ?`, [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Accepter', onPress: () => Alert.alert('Succès', 'Réservation acceptée') }
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
        Alert.alert('Message', `Envoyer un message à ${booking.clientName}`);
        break;
      case 'call':
        Alert.alert('Appel', `Appeler ${booking.clientName}`);
        break;
      case 'details':
        Alert.alert('Détails', 
          `Client: ${booking.clientName}\nService: ${booking.service}\nDate: ${booking.date}\nHeure: ${booking.time}\nDurée: ${booking.duration}min\nPrix: ${booking.price}€\nAdresse: ${booking.address}`
        );
        break;
    }
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
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
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'upcoming' && styles.tabActive]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.tabTextActive]}>À venir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'pending' && styles.tabActive]}
          onPress={() => setSelectedTab('pending')}
        >
          <View style={styles.tabWithBadge}>
            <Text style={[styles.tabText, selectedTab === 'pending' && styles.tabTextActive]}>En attente</Text>
            {newBookingsCount > 0 && (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <NotificationBadge count={newBookingsCount} size="small" />
              </Animated.View>
            )}
          </View>
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
      </View>

      {/* Liste des réservations */}
      <ScrollView style={styles.bookingsList} showsVerticalScrollIndicator={false}>
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="Aucune réservation"
            description={
              selectedTab === 'upcoming' ? 'Aucune réservation à venir' :
              selectedTab === 'pending' ? 'Aucune réservation en attente' :
              selectedTab === 'completed' ? 'Aucune réservation terminée' :
              'Aucune réservation annulée'
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
                      <Text style={styles.acceptButtonText}>Accepter</Text>
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
                {booking.status === 'upcoming' && (
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
                onPress={() => {
                  Alert.alert('Succès', 'Réservation refusée' + (rejectReason ? `\nRaison: ${rejectReason}` : ''));
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
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
                onPress={() => {
                  Alert.alert('Succès', 'Réservation modifiée avec succès');
                  setShowEditModal(false);
                }}
              >
                <Text style={styles.modalButtonTextConfirm}>Enregistrer</Text>
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
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: COLORS.primary + '20',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  bookingsList: {
    flex: 1,
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
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
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
    gap: 8,
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