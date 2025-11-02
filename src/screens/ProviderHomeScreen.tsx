import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

interface ProviderHomeScreenProps {
  onNavigateToBookings?: () => void;
  onNavigateToMessages?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToEarnings?: () => void;
  onNavigateToSchedule?: () => void;
  onNavigateToShop?: () => void;
  onNavigateToReviews?: () => void;
  onLogout?: () => void;
  navigation?: any;
}

const ProviderHomeScreen: React.FC<ProviderHomeScreenProps> = ({
  onNavigateToBookings,
  onNavigateToMessages,
  onNavigateToServices,
  onNavigateToProfile,
  onNavigateToEarnings,
  onNavigateToSchedule,
  onNavigateToShop,
  onNavigateToReviews,
  onLogout,
  navigation,
}) => {
  const [provider] = useState({
    name: 'Sophie Martin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=b6e3f4',
    rating: 4.8,
    totalBookings: 156,
    monthlyEarnings: 2840,
    pendingBookings: 3,
    unreadMessages: 5
  });

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'bookings':
        if (onNavigateToBookings) {
          onNavigateToBookings();
        } else {
          Alert.alert('Réservations', 'Gérer mes réservations');
        }
        break;
      case 'messages':
        if (onNavigateToMessages) {
          onNavigateToMessages();
        } else {
          Alert.alert('Messages', 'Voir mes messages');
        }
        break;
      case 'services':
        if (onNavigateToServices) {
          onNavigateToServices();
        } else {
          Alert.alert('Services', 'Gérer mes services');
        }
        break;
      case 'earnings':
        if (onNavigateToEarnings) {
          onNavigateToEarnings();
        } else {
          Alert.alert('Revenus', 'Voir mes revenus');
        }
        break;
      case 'schedule':
        if (onNavigateToSchedule) {
          onNavigateToSchedule();
        } else {
          Alert.alert('Planning', 'Gérer mon planning');
        }
        break;
      case 'shop':
        if (onNavigateToShop) {
          onNavigateToShop();
        } else {
          Alert.alert('Boutique', 'Voir ma boutique');
        }
        break;
      case 'reviews':
        if (onNavigateToReviews) {
          onNavigateToReviews();
        } else {
          Alert.alert('Avis', 'Voir mes avis clients');
        }
        break;
      case 'certificates':
        if (navigation) {
          navigation.navigate('ProviderCertificates');
        } else {
          Alert.alert('Diplômes', 'Gérer mes diplômes');
        }
        break;
      case 'premium':
        if (navigation) {
          navigation.navigate('ProviderPremium');
        } else {
          Alert.alert('Premium', 'Gérer mon abonnement Premium');
        }
        break;
      case 'emergency':
        if (navigation) {
          navigation.navigate('ProviderEmergency');
        } else {
          Alert.alert('Urgence', 'Gérer le mode urgence');
        }
        break;
      default:
        Alert.alert('Action', 'Fonctionnalité à venir');
    }
  };

  const todayBookings = [
    { id: '1', clientName: 'Marie Dupont', service: 'Manucure', time: '14:00', status: 'confirmé' },
    { id: '2', clientName: 'Julie Martin', service: 'Coiffure', time: '16:30', status: 'en attente' },
    { id: '3', clientName: 'Sarah Bernard', service: 'Massage', time: '18:00', status: 'confirmé' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.profileContainer}
            onPress={() => onNavigateToProfile ? onNavigateToProfile() : Alert.alert('Profil', 'Modifier mon profil')}
            activeOpacity={0.8}
          >
            <Image source={{ uri: provider.avatar }} style={styles.profileAvatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeText}>Bonjour !</Text>
              <Text style={styles.providerName}>{provider.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color={COLORS.warning} />
                <Text style={styles.ratingText}>{provider.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.messageHeaderButton}
            onPress={() => handleQuickAction('messages')}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble-outline" size={24} color={COLORS.white} />
            {provider.unreadMessages > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>
                  {provider.unreadMessages > 99 ? '99+' : provider.unreadMessages}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Statistiques rapides */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>{provider.pendingBookings}</Text>
          <Text style={styles.statLabel}>Réservations en attente</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="chatbubble" size={24} color={COLORS.accent} />
          <Text style={styles.statNumber}>{provider.unreadMessages}</Text>
          <Text style={styles.statLabel}>Messages non lus</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={24} color={COLORS.success} />
          <Text style={styles.statNumber}>{provider.monthlyEarnings}€</Text>
          <Text style={styles.statLabel}>Revenus du mois</Text>
        </View>
      </View>

      {/* Actions rapides */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('bookings')}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar-outline" size={32} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Réservations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('services')}
            activeOpacity={0.8}
          >
            <Ionicons name="construct-outline" size={32} color={COLORS.secondary} />
            <Text style={styles.quickActionText}>Mes Services</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('schedule')}
            activeOpacity={0.8}
          >
            <Ionicons name="time-outline" size={32} color={COLORS.warning} />
            <Text style={styles.quickActionText}>Planning</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('shop')}
            activeOpacity={0.8}
          >
            <Ionicons name="storefront-outline" size={32} color={COLORS.accent} />
            <Text style={styles.quickActionText}>Boutique</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('reviews')}
            activeOpacity={0.8}
          >
            <Ionicons name="star-outline" size={32} color="#FFD700" />
            <Text style={styles.quickActionText}>Avis</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('certificates')}
            activeOpacity={0.8}
          >
            <Ionicons name="school-outline" size={32} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Diplômes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('premium')}
            activeOpacity={0.8}
          >
            <Ionicons name="diamond-outline" size={32} color="#FFD700" />
            <Text style={styles.quickActionText}>Premium</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('emergency')}
            activeOpacity={0.8}
          >
            <Ionicons name="flash-outline" size={32} color={COLORS.error} />
            <Text style={styles.quickActionText}>Urgence</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Réservations du jour */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Réservations du jour</Text>
          <TouchableOpacity onPress={() => handleQuickAction('bookings')} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        
        {todayBookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingInfo}>
              <Text style={styles.clientName}>{booking.clientName}</Text>
              <Text style={styles.serviceName}>{booking.service}</Text>
              <Text style={styles.bookingTime}>{booking.time}</Text>
            </View>
            <View style={styles.bookingStatus}>
              <View style={[
                styles.statusBadge,
                booking.status === 'confirmé' ? styles.statusConfirmed : styles.statusPending
              ]}>
                <Text style={styles.statusText}>{booking.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Revenus */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes revenus</Text>
        <TouchableOpacity 
          style={styles.earningsCard}
          onPress={() => handleQuickAction('earnings')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={[COLORS.success, COLORS.success]} style={styles.earningsGradient}>
            <View style={styles.earningsContent}>
              <Text style={styles.earningsTitle}>Revenus du mois</Text>
              <Text style={styles.earningsAmount}>{provider.monthlyEarnings}€</Text>
              <Text style={styles.earningsSubtitle}>+12% vs mois dernier</Text>
            </View>
            <Ionicons name="trending-up" size={32} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  providerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.white,
    marginLeft: 4,
  },
  messageHeaderButton: {
    padding: 8,
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  headerBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 8,
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  bookingInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  bookingTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bookingStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: COLORS.success + '20',
  },
  statusPending: {
    backgroundColor: COLORS.warning + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  earningsCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  earningsGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  earningsContent: {
    flex: 1,
  },
  earningsTitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  earningsSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
});

export default ProviderHomeScreen; 