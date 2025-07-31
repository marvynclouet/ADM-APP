import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Service, ServiceProvider } from '../types';
import { COLORS } from '../constants/colors';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface BookingScreenProps {
  route?: {
    params?: {
      service?: Service;
      provider?: ServiceProvider;
    };
  };
  navigation?: any;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ navigation, route }) => {
  const { service, provider } = route?.params || {};
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'cash'>('card');
  const [notes, setNotes] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Données de fallback si pas de paramètres
  const defaultService: Service = {
    id: '1',
    name: 'Coiffure & Brushing',
    description: 'Coupe moderne et brushing professionnel',
    price: 45,
    duration: 60,
    category: { id: '1', name: 'Coiffure', icon: 'cut-outline', color: COLORS.primary },
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400'
  };

  const defaultProvider: ServiceProvider = {
    id: '1',
    name: 'Marie Dubois',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    phone: '+33 1 23 45 67 89',
    email: 'marie.dubois@example.com',
    rating: 4.8,
    reviewCount: 127,
    services: ['1', '2'],
    location: { latitude: 48.8566, longitude: 2.3522, address: '15 rue de la Paix, Paris' },
    availability: { monday: { start: '09:00', end: '18:00' } }
  };

  const currentService = service || defaultService;
  const currentProvider = provider || defaultProvider;

  // Générer les dates disponibles (prochaines 7 jours)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('fr-FR', { month: 'short' })
      });
    }
    return dates;
  };

  // Générer les créneaux horaires disponibles
  const generateAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  const availableDates = generateAvailableDates();
  const availableTimes = generateAvailableTimes();

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handlePaymentMethodSelect = (method: 'card' | 'cash') => {
    setSelectedPaymentMethod(method);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Erreur', 'Veuillez sélectionner une date et un créneau horaire');
      return;
    }

    setShowConfirmationModal(true);
  };

  const confirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      showError('Veuillez sélectionner une date et une heure');
      return;
    }

    setIsProcessing(true);
    
    // Simuler le traitement du paiement
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmationModal(false);
      
      // Créer la réservation
      const booking = {
        id: Date.now().toString(),
        service,
        provider,
        date: selectedDate,
        time: selectedTime,
        paymentMethod: selectedPaymentMethod,
        notes,
        status: 'confirmed',
        total: service.price,
      };

      console.log('Réservation créée:', booking);
      
      // Feedback de succès
      showSuccess('Réservation confirmée ! Vous recevrez une confirmation par email.');
      
      // Naviguer vers les réservations après un délai
      setTimeout(() => {
        if (navigation) {
          navigation.navigate('Réservations');
        }
      }, 2000);
    }, 2000);
  };

  const handleBack = () => {
    navigation?.goBack();
  };

  return (
    <View style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      
      {/* Header avec gradient */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Réserver</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service et Prestataire */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceTitle}>{currentService.name}</Text>
            <Text style={styles.servicePrice}>{currentService.price}€</Text>
          </View>
          <Text style={styles.serviceDescription}>{currentService.description}</Text>
          <View style={styles.serviceMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{currentService.duration} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{currentProvider.name}</Text>
            </View>
          </View>
        </View>

        {/* Sélection de date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choisir une date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {availableDates.map((dateInfo) => (
              <TouchableOpacity
                key={dateInfo.date}
                style={[
                  styles.dateCard,
                  selectedDate === dateInfo.date && styles.selectedDateCard
                ]}
                onPress={() => handleDateSelect(dateInfo.date)}
              >
                <Text style={[
                  styles.dateDay,
                  selectedDate === dateInfo.date && styles.selectedDateText
                ]}>
                  {dateInfo.day}
                </Text>
                <Text style={[
                  styles.dateNumber,
                  selectedDate === dateInfo.date && styles.selectedDateText
                ]}>
                  {dateInfo.dayNumber}
                </Text>
                <Text style={[
                  styles.dateMonth,
                  selectedDate === dateInfo.date && styles.selectedDateText
                ]}>
                  {dateInfo.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sélection d'heure */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choisir un créneau</Text>
            <View style={styles.timeGrid}>
              {availableTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeCard,
                    selectedTime === time && styles.selectedTimeCard
                  ]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text style={[
                    styles.timeText,
                    selectedTime === time && styles.selectedTimeText
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (optionnel)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Ajouter des notes pour votre prestataire..."
            placeholderTextColor={COLORS.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Méthode de paiement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Méthode de paiement</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === 'card' && styles.selectedPaymentMethod
              ]}
              onPress={() => handlePaymentMethodSelect('card')}
            >
              <Ionicons 
                name="card-outline" 
                size={24} 
                color={selectedPaymentMethod === 'card' ? COLORS.white : COLORS.primary} 
              />
              <Text style={[
                styles.paymentMethodText,
                selectedPaymentMethod === 'card' && styles.selectedPaymentMethodText
              ]}>
                Carte bancaire
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === 'cash' && styles.selectedPaymentMethod
              ]}
              onPress={() => handlePaymentMethodSelect('cash')}
            >
              <Ionicons 
                name="cash-outline" 
                size={24} 
                color={selectedPaymentMethod === 'cash' ? COLORS.white : COLORS.primary} 
              />
              <Text style={[
                styles.paymentMethodText,
                selectedPaymentMethod === 'cash' && styles.selectedPaymentMethodText
              ]}>
                Espèces
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Résumé */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Résumé de la réservation</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{currentService.name}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Prestataire</Text>
            <Text style={styles.summaryValue}>{currentProvider.name}</Text>
          </View>
          {selectedDate && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>
                {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
          )}
          {selectedTime && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Heure</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>
            </View>
          )}
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>{currentService.price}€</Text>
          </View>
        </View>

        {/* Bouton de confirmation */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedDate || !selectedTime) && styles.confirmButtonDisabled
          ]}
          onPress={handleConfirmBooking}
          disabled={!selectedDate || !selectedTime}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.confirmButtonGradient}
          >
            <Text style={styles.confirmButtonText}>
              Confirmer la réservation
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de paiement */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModal}>
            <Text style={styles.paymentModalTitle}>
              {isProcessing ? 'Traitement en cours...' : 'Confirmation du paiement'}
            </Text>
            
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <Ionicons name="refresh" size={48} color={COLORS.primary} style={styles.spinningIcon} />
                <Text style={styles.processingText}>Validation de votre réservation...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.paymentModalText}>
                  Montant à payer : {currentService.price}€
                </Text>
                <Text style={styles.paymentModalText}>
                  Méthode : {selectedPaymentMethod === 'card' ? 'Carte bancaire' : 'Espèces'}
                </Text>
                
                <View style={styles.paymentModalActions}>
                  <TouchableOpacity
                    style={styles.paymentModalButton}
                    onPress={() => setShowConfirmationModal(false)}
                  >
                    <Text style={styles.paymentModalButtonText}>Annuler</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.paymentModalButton, styles.paymentModalButtonConfirm]}
                    onPress={confirmBooking}
                  >
                    <Text style={styles.paymentModalButtonTextConfirm}>Payer</Text>
                  </TouchableOpacity>
                </View>
              </>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  serviceDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  serviceMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  dateCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 60,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  selectedDateCard: {
    backgroundColor: COLORS.primary,
  },
  dateDay: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  dateMonth: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  selectedDateText: {
    color: COLORS.white,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  selectedTimeCard: {
    backgroundColor: COLORS.primary,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  selectedTimeText: {
    color: COLORS.white,
  },
  notesInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: COLORS.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethod: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  selectedPaymentMethod: {
    backgroundColor: COLORS.primary,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  selectedPaymentMethodText: {
    color: COLORS.white,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentModal: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
  },
  paymentModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  paymentModalText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  spinningIcon: {
    marginBottom: 16,
  },
  processingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  paymentModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  paymentModalButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  paymentModalButtonConfirm: {
    backgroundColor: COLORS.primary,
  },
  paymentModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  paymentModalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default BookingScreen; 