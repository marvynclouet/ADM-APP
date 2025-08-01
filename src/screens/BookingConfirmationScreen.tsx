import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface BookingConfirmationScreenProps {
  navigation?: any;
  route?: any;
}

const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({ navigation, route }) => {
  const { booking } = route?.params || {};
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);

  // Données de fallback si pas de paramètres
  const defaultBooking = {
    id: 'booking123',
    service: {
      name: 'Coupe + Brushing',
      price: 45,
      duration: 60,
    },
    provider: {
      name: 'Marie Dubois',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
      phone: '06 12 34 56 78',
      address: '15 rue de la Paix, Paris',
    },
    date: '2024-01-15',
    time: '14:30',
    paymentMethod: 'card',
    notes: 'Cheveux longs, brushing volumineux',
    status: 'confirmed',
    total: 45,
    createdAt: new Date().toISOString(),
  };

  const currentBooking = booking || defaultBooking;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const handleAddToCalendar = async () => {
    setIsAddingToCalendar(true);
    
    try {
      const eventTitle = `Réservation - ${currentBooking.service.name}`;
      const eventDescription = `Réservation chez ${currentBooking.provider.name}\nService: ${currentBooking.service.name}\nPrix: ${currentBooking.service.price}€\nNotes: ${currentBooking.notes}`;
      const eventLocation = currentBooking.provider.address;
      
      // Date et heure de début
      const startDate = new Date(`${currentBooking.date}T${currentBooking.time}`);
      const endDate = new Date(startDate.getTime() + currentBooking.service.duration * 60000);
      
      const startDateISO = startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const endDateISO = endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      
      let calendarUrl = '';
      
      if (Platform.OS === 'ios') {
        // Apple Calendar
        calendarUrl = `calshow://?event=${encodeURIComponent(eventTitle)}&location=${encodeURIComponent(eventLocation)}&start=${startDateISO}&end=${endDateISO}&description=${encodeURIComponent(eventDescription)}`;
      } else {
        // Google Calendar
        calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}&dates=${startDateISO}/${endDateISO}`;
      }
      
      const canOpen = await Linking.canOpenURL(calendarUrl);
      
      if (canOpen) {
        await Linking.openURL(calendarUrl);
        showSuccess('Événement ajouté à votre calendrier !');
      } else {
        // Fallback pour Google Calendar
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}&dates=${startDateISO}/${endDateISO}`;
        await Linking.openURL(googleCalendarUrl);
        showSuccess('Événement ajouté à Google Calendar !');
      }
    } catch (error) {
      showError('Impossible d\'ajouter à votre calendrier');
      console.error('Erreur lors de l\'ajout au calendrier:', error);
    } finally {
      setIsAddingToCalendar(false);
    }
  };

  const handleViewBookings = () => {
    if (navigation) {
      navigation.navigate('Bookings');
    }
  };

  const handleCallProvider = () => {
    const phoneNumber = currentBooking.provider.phone;
    const phoneUrl = `tel:${phoneNumber}`;
    
    Linking.canOpenURL(phoneUrl).then(supported => {
      if (supported) {
        Linking.openURL(phoneUrl);
      } else {
        showError('Impossible d\'ouvrir l\'application téléphone');
      }
    });
  };

  const handleMessageProvider = () => {
    if (navigation) {
      navigation.navigate('Messages');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirmation</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      {/* Carte de confirmation */}
      <View style={styles.confirmationCard}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
        </View>
        <Text style={styles.confirmationTitle}>Réservation confirmée !</Text>
        <Text style={styles.confirmationSubtitle}>
          Votre réservation a été confirmée et vous recevrez un email de confirmation.
        </Text>
      </View>

      {/* Détails de la réservation */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Détails de la réservation</Text>
        
        {/* Informations du service */}
        <View style={styles.detailRow}>
          <Ionicons name="cut" size={20} color={COLORS.primary} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{currentBooking.service.name}</Text>
          </View>
        </View>

        {/* Informations du prestataire */}
        <View style={styles.detailRow}>
          <Ionicons name="person" size={20} color={COLORS.primary} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Prestataire</Text>
            <Text style={styles.detailValue}>{currentBooking.provider.name}</Text>
          </View>
        </View>

        {/* Date et heure */}
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={20} color={COLORS.primary} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Date et heure</Text>
            <Text style={styles.detailValue}>
              {formatDate(currentBooking.date)} à {formatTime(currentBooking.time)}
            </Text>
          </View>
        </View>

        {/* Durée */}
        <View style={styles.detailRow}>
          <Ionicons name="time" size={20} color={COLORS.primary} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Durée</Text>
            <Text style={styles.detailValue}>{currentBooking.service.duration} minutes</Text>
          </View>
        </View>

        {/* Adresse */}
        <View style={styles.detailRow}>
          <Ionicons name="location" size={20} color={COLORS.primary} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Adresse</Text>
            <Text style={styles.detailValue}>{currentBooking.provider.address}</Text>
          </View>
        </View>

        {/* Prix */}
        <View style={styles.detailRow}>
          <Ionicons name="card" size={20} color={COLORS.primary} />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Prix</Text>
            <Text style={styles.detailValue}>{currentBooking.service.price}€</Text>
          </View>
        </View>

        {/* Notes */}
        {currentBooking.notes && (
          <View style={styles.detailRow}>
            <Ionicons name="document-text" size={20} color={COLORS.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.detailValue}>{currentBooking.notes}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Actions rapides */}
      <View style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddToCalendar}
            disabled={isAddingToCalendar}
          >
            <Ionicons 
              name={Platform.OS === 'ios' ? 'calendar' : 'calendar-outline'} 
              size={24} 
              color={COLORS.primary} 
            />
            <Text style={styles.actionText}>
              {isAddingToCalendar ? 'Ajout...' : 'Ajouter au calendrier'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCallProvider}
          >
            <Ionicons name="call" size={24} color={COLORS.primary} />
            <Text style={styles.actionText}>Appeler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleMessageProvider}
          >
            <Ionicons name="chatbubble" size={24} color={COLORS.primary} />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewBookings}
          >
            <Ionicons name="list" size={24} color={COLORS.primary} />
            <Text style={styles.actionText}>Mes réservations</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bouton retour à l'accueil */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation?.navigate('Accueil')}
      >
        <Text style={styles.homeButtonText}>Retour à l'accueil</Text>
        <Ionicons name="home" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  confirmationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIcon: {
    marginBottom: 15,
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  confirmationSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailContent: {
    marginLeft: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  actionButton: {
    width: '45%', // Adjust as needed for 2 columns
    height: 100,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 5,
  },
  homeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  homeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default BookingConfirmationScreen; 