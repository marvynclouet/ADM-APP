import React, { useState, useEffect } from 'react';
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
import EmergencyBadge from '../components/EmergencyBadge';
import { AuthService } from '../../backend/services/auth.service';
import { BookingsService } from '../../backend/services/bookings.service';
import { ServicesService } from '../../backend/services/services.service';
import { supabase } from '../../backend/supabase/config';
import LoadingSpinner from '../components/LoadingSpinner';

interface EmergencyBookingScreenProps {
  route?: {
    params?: {
      provider?: ServiceProvider;
      service?: Service;
    };
  };
  navigation?: any;
}

const EmergencyBookingScreen: React.FC<EmergencyBookingScreenProps> = ({ navigation, route }) => {
  const { provider, service } = route?.params || {};
  const [selectedService, setSelectedService] = useState<Service | null>(service || null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [urgencyReason, setUrgencyReason] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [providerData, setProviderData] = useState<any>(null);
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const user = await AuthService.getCurrentUser();
        if (!user || !user.id) {
          Alert.alert('Erreur', 'Vous devez être connecté');
          navigation?.goBack();
          return;
        }
        setCurrentUserId(user.id);

        // Charger les données du prestataire depuis Supabase
        if (provider?.id) {
          const servicesData = await ServicesService.getServices({
            providerId: provider.id,
            isActive: true,
          });
          
          // Vérifier que le prestataire est premium et accepte les urgences
          const { data: providerInfo } = await supabase
            .from('users')
            .select('is_premium, accepts_emergency')
            .eq('id', provider.id)
            .single();

          if (!providerInfo?.is_premium || !providerInfo?.accepts_emergency) {
            Alert.alert(
              'Réservation urgente non disponible',
              'Ce prestataire n\'accepte pas les réservations urgentes pour le moment.',
              [{ text: 'OK', onPress: () => navigation?.goBack() }]
            );
            return;
          }

          setProviderData({
            ...provider,
            is_premium: providerInfo.is_premium,
            accepts_emergency: providerInfo.accepts_emergency,
            services: servicesData || [],
          });

          // Si un service était sélectionné, le retrouver
          if (service && servicesData) {
            const foundService = servicesData.find((s: any) => s.id === service.id);
            if (foundService) {
              setSelectedService({
                id: foundService.id,
                name: foundService.name,
                price: parseFloat(foundService.price) || 0,
                duration: foundService.duration_minutes || 60,
                category: foundService.category?.name || '',
                description: foundService.description || '',
              });
            }
          }
        }
      } catch (error: any) {
        console.error('Erreur chargement données:', error);
        showError('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [provider, service, navigation, showError]);

  // Vérifier si le prestataire accepte les urgences
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement..." />
      </View>
    );
  }

  if (!providerData || !providerData.accepts_emergency || !providerData.is_premium) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Réservation Urgence</Text>
          <View style={styles.placeholder} />
        </LinearGradient>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Mode urgence non disponible</Text>
          <Text style={styles.errorText}>
            Ce prestataire n'accepte pas les réservations en urgence pour le moment.
          </Text>
          <TouchableOpacity
            style={styles.backToProviderButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.backToProviderText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Services disponibles du prestataire
  const availableServices = providerData?.services || [];

  // Heures disponibles pour les 24h prochaines (réservation urgente)
  const getAvailableTimes = () => {
    const times = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    // Calculer l'heure limite (24h après maintenant)
    const maxDateTime = new Date(now);
    maxDateTime.setHours(maxDateTime.getHours() + 24);
    const maxHour = maxDateTime.getHours();
    const maxDate = maxDateTime.toISOString().split('T')[0];
    
    // Heures d'aujourd'hui (minimum 2h après maintenant, jusqu'à 22h ou limite 24h)
    const minHour = currentHour + 2;
    const todayMaxHour = maxDate === today ? Math.min(22, maxHour) : 22;
    
    for (let hour = minHour; hour <= todayMaxHour; hour++) {
      times.push({
        date: today,
        dateLabel: 'Aujourd\'hui',
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: true,
      });
    }
    
    // Heures de demain si dans les 24h
    if (maxDate === tomorrowStr && maxHour > 0) {
      for (let hour = 8; hour <= Math.min(22, maxHour); hour++) {
        times.push({
          date: tomorrowStr,
          dateLabel: 'Demain',
          time: `${hour.toString().padStart(2, '0')}:00`,
          available: true,
        });
      }
    }
    
    return times;
  };

  const availableTimes = getAvailableTimes();

  const handleConfirmBooking = () => {
    if (!selectedService) {
      showError('Veuillez sélectionner un service');
      return;
    }
    if (!selectedTime) {
      showError('Veuillez sélectionner un horaire');
      return;
    }
    if (!urgencyReason.trim()) {
      showError('Veuillez expliquer la raison de l\'urgence');
      return;
    }
    if (!phoneNumber.trim()) {
      showError('Veuillez indiquer votre numéro de téléphone');
      return;
    }

    setShowConfirmationModal(true);
  };

  const handleFinalConfirm = async () => {
    if (!currentUserId || !selectedService || !providerData || !selectedTime || !selectedDate) {
      showError('Données manquantes');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Calculer le prix avec majoration (25% par défaut, peut être ajusté)
      const basePrice = selectedService.price;
      const markup = 0.25; // 25% de majoration
      const emergencyFee = Math.round(basePrice * markup);
      const totalPrice = basePrice + emergencyFee;

      // Extraire l'heure du format "YYYY-MM-DD HH:MM"
      const timeOnly = selectedTime.split(' ')[1] || selectedTime;

      // Créer la réservation urgente
      const bookingData = await BookingsService.createBooking({
        userId: currentUserId,
        providerId: providerData.id,
        serviceId: selectedService.id,
        bookingDate: selectedDate,
        bookingTime: timeOnly,
        durationMinutes: selectedService.duration || 60,
        totalPrice: totalPrice,
        isEmergency: true,
        emergencyReason: urgencyReason,
        clientNotes: `Téléphone: ${phoneNumber}. Urgence: ${urgencyReason}`,
      });

      setIsProcessing(false);
      setShowConfirmationModal(false);
      showSuccess('Réservation urgente créée avec succès !');
      
      // Naviguer vers la confirmation
      setTimeout(() => {
        navigation?.navigate('BookingConfirmation', {
          booking: {
            id: bookingData.id,
            service: selectedService,
            provider: providerData,
            date: selectedDate,
            time: timeOnly,
            total: totalPrice,
            isEmergency: true,
            status: bookingData.status,
          },
        });
      }, 1500);
    } catch (error: any) {
      console.error('Erreur création réservation urgente:', error);
      setIsProcessing(false);
      showError(error.message || 'Erreur lors de la création de la réservation urgente');
    }
  };

  const calculateEmergencyFee = () => {
    if (!selectedService) return 0;
    // Majoration d'urgence : 25% du prix du service
    const markup = 0.25;
    return Math.round(selectedService.price * markup);
  };

  const totalPrice = selectedService
    ? selectedService.price + calculateEmergencyFee()
    : 0;

  return (
    <View style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      {/* Header */}
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <EmergencyBadge size="medium" />
          <Text style={styles.headerTitle}>Réservation Urgence</Text>
        </View>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color={COLORS.warning} />
          <Text style={styles.infoText}>
            Réservation urgente : réservation pour aujourd'hui avec majoration de 25%
          </Text>
        </View>

        {/* Provider Info */}
        <View style={styles.providerSection}>
          <View style={styles.providerCard}>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{providerData?.name || provider?.name}</Text>
              <View style={styles.providerRating}>
                <Ionicons name="star" size={16} color={COLORS.warning} />
                <Text style={styles.ratingText}>{providerData?.rating || provider?.rating || '0'}</Text>
              </View>
            </View>
            <EmergencyBadge size="small" />
          </View>
        </View>

        {/* Service Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service souhaité *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesScroll}>
            {availableServices.map((s: any) => {
              const serviceObj: Service = {
                id: s.id,
                name: s.name,
                price: parseFloat(s.price) || 0,
                duration: s.duration_minutes || 60,
                category: s.category?.name || '',
                description: s.description || '',
              };
              const isSelected = selectedService?.id === serviceObj.id;
              return (
                <TouchableOpacity
                  key={serviceObj.id}
                  style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
                  onPress={() => setSelectedService(serviceObj)}
                >
                  <Text style={[styles.serviceName, isSelected && styles.serviceNameSelected]}>
                    {serviceObj.name}
                  </Text>
                  <Text style={styles.servicePrice}>{serviceObj.price}€</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horaire souhaité (Aujourd'hui uniquement) *</Text>
          <View style={styles.timeGrid}>
            {availableTimes.map((slot, index) => {
              const timeKey = `${slot.date} ${slot.time}`;
              const isSelected = selectedTime === timeKey;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    isSelected && styles.timeSlotSelected,
                  ]}
                  onPress={() => {
                    setSelectedTime(timeKey);
                    setSelectedDate(slot.date);
                  }}
                >
                  <Text style={styles.timeDate}>{slot.dateLabel}</Text>
                  <Text
                    style={[
                      styles.timeText,
                      isSelected && styles.timeTextSelected,
                    ]}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Urgency Reason */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Raison de l'urgence *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Expliquez pourquoi vous avez besoin d'une réservation urgente..."
            value={urgencyReason}
            onChangeText={setUrgencyReason}
            multiline
            numberOfLines={4}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Votre numéro de téléphone *</Text>
          <TextInput
            style={styles.input}
            placeholder="06 12 34 56 78"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* Price Summary */}
        {selectedService && (
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service</Text>
              <Text style={styles.priceValue}>{selectedService.price}€</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Majoration urgence (25%)</Text>
              <Text style={styles.priceValue}>{calculateEmergencyFee()}€</Text>
            </View>
            <View style={[styles.priceRow, styles.priceTotal]}>
              <Text style={styles.priceTotalLabel}>Total</Text>
              <Text style={styles.priceTotalValue}>{totalPrice}€</Text>
            </View>
          </View>
        )}

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.confirmButton, isProcessing && styles.confirmButtonDisabled]}
          onPress={handleConfirmBooking}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={[COLORS.error, '#C62828']}
            style={styles.confirmButtonGradient}
          >
            <Ionicons name="flash" size={20} color={COLORS.white} />
            <Text style={styles.confirmButtonText}>
              {isProcessing ? 'Envoi en cours...' : 'Demander une réservation urgente'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <EmergencyBadge size="large" />
            <Text style={styles.modalTitle}>Confirmer la réservation urgente</Text>
            <Text style={styles.modalText}>
              Votre demande sera envoyée au prestataire. Il vous contactera dans les plus brefs délais.
            </Text>
            <View style={styles.modalDetails}>
              <Text style={styles.modalDetailText}>
                <Text style={styles.modalDetailLabel}>Service:</Text> {selectedService?.name}
              </Text>
              <Text style={styles.modalDetailText}>
                <Text style={styles.modalDetailLabel}>Horaire:</Text> {selectedTime}
              </Text>
              <Text style={styles.modalDetailText}>
                <Text style={styles.modalDetailLabel}>Total:</Text> {totalPrice}€
              </Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowConfirmationModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleFinalConfirm}
                disabled={isProcessing}
              >
                <Text style={styles.modalButtonConfirmText}>Confirmer</Text>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  providerSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  providerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  servicesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    minWidth: 150,
  },
  serviceCardSelected: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.error + '10',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  serviceNameSelected: {
    color: COLORS.error,
  },
  servicePrice: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 100,
    alignItems: 'center',
  },
  timeSlotSelected: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.error + '10',
  },
  timeDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  timeTextSelected: {
    color: COLORS.error,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priceSection: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  priceTotal: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    marginTop: 8,
  },
  priceTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  priceTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.error,
  },
  confirmButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalDetails: {
    width: '100%',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalDetailText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalDetailLabel: {
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
    backgroundColor: COLORS.error,
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  modalButtonConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backToProviderButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  backToProviderText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default EmergencyBookingScreen;





