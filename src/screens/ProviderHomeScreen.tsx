import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { AuthService } from '../../backend/services/auth.service';
import { BookingsService } from '../../backend/services/bookings.service';
import { supabase } from '../../backend/supabase/config';
import LoadingSpinner from '../components/LoadingSpinner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;

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
  const [provider, setProvider] = useState<any>(null);
  const [todayBookings, setTodayBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingBookings: 0,
    unreadMessages: 0,
    monthlyEarnings: 0,
  });

  // Charger les données du provider
  const loadProviderData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Récupérer l'utilisateur actuel
      const userData = await AuthService.getCurrentUser();
      if (!userData || !userData.is_provider) {
        Alert.alert('Erreur', 'Vous n\'êtes pas un prestataire');
        return;
      }

      // Construire le nom complet
      const fullName = userData.first_name && userData.last_name
        ? `${userData.first_name} ${userData.last_name}`
        : userData.email || 'Prestataire';

      // Avatar
      const avatar = userData.avatar_url || 
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=b6e3f4`;

      setProvider({
        id: userData.id,
        name: fullName,
        avatar: avatar,
        rating: 0, // À calculer depuis les reviews
        email: userData.email,
      });

      // Charger les statistiques
      await loadStats(userData.id);

      // Charger les réservations du jour
      await loadTodayBookings(userData.id);
    } catch (error: any) {
      console.error('Erreur lors du chargement des données du provider:', error);
      Alert.alert('Erreur', error.message || 'Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les statistiques
  const loadStats = async (providerId: string) => {
    try {
      // Compter les réservations en attente
      const { count: pendingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', providerId)
        .eq('status', 'pending');

      // Calculer les revenus du mois en cours
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { data: monthlyBookings } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('provider_id', providerId)
        .eq('status', 'completed')
        .gte('booking_date', startOfMonth.toISOString().split('T')[0])
        .lte('booking_date', endOfMonth.toISOString().split('T')[0]);

      const monthlyEarnings = monthlyBookings?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0;

      // Compter les messages non lus (à implémenter si table messages existe)
      // Pour l'instant, on met 0
      const unreadMessages = 0;

      setStats({
        pendingBookings: pendingCount || 0,
        unreadMessages: unreadMessages,
        monthlyEarnings: Math.round(monthlyEarnings),
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  // Charger les réservations du jour
  const loadTodayBookings = async (providerId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const bookings = await BookingsService.getProviderBookings(providerId, { date: today });

      // Transformer les données pour l'affichage
      const transformedBookings = (bookings || []).map((booking: any) => ({
        id: booking.id,
        clientName: booking.user?.first_name && booking.user?.last_name
          ? `${booking.user.first_name} ${booking.user.last_name}`
          : booking.user?.email || 'Client',
        service: booking.service?.name || 'Service',
        time: booking.booking_time || '',
        status: booking.status === 'confirmed' ? 'confirmé' : booking.status === 'pending' ? 'en attente' : booking.status,
      }));

      setTodayBookings(transformedBookings);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations du jour:', error);
      setTodayBookings([]);
    }
  };

  // Recharger les données quand l'écran est focus
  useFocusEffect(
    useCallback(() => {
      loadProviderData();
    }, [loadProviderData])
  );

  useEffect(() => {
    loadProviderData();
  }, [loadProviderData]);

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement..." />
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Aucun prestataire connecté</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
      scrollEventThrottle={16}
    >
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
              {provider.rating > 0 && (
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color={COLORS.warning} />
                  <Text style={styles.ratingText}>{provider.rating}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.messageHeaderButton}
            onPress={() => handleQuickAction('messages')}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble-outline" size={24} color={COLORS.white} />
            {stats.unreadMessages > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>
                  {stats.unreadMessages > 99 ? '99+' : stats.unreadMessages}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Statistiques rapides */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={isSmallScreen ? 20 : 24} color={COLORS.primary} />
          <Text style={styles.statNumber}>{stats.pendingBookings}</Text>
          <Text style={styles.statLabel}>Réservations en attente</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="chatbubble" size={isSmallScreen ? 20 : 24} color={COLORS.accent} />
          <Text style={styles.statNumber}>{stats.unreadMessages}</Text>
          <Text style={styles.statLabel}>Messages non lus</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={isSmallScreen ? 20 : 24} color={COLORS.success} />
          <Text style={styles.statNumber}>{stats.monthlyEarnings}€</Text>
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
            <Ionicons name="calendar-outline" size={isSmallScreen ? 28 : 32} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Réservations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('services')}
            activeOpacity={0.8}
          >
            <Ionicons name="construct-outline" size={isSmallScreen ? 28 : 32} color={COLORS.secondary} />
            <Text style={styles.quickActionText}>Mes Services</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('schedule')}
            activeOpacity={0.8}
          >
            <Ionicons name="time-outline" size={isSmallScreen ? 28 : 32} color={COLORS.warning} />
            <Text style={styles.quickActionText}>Planning</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('shop')}
            activeOpacity={0.8}
          >
            <Ionicons name="storefront-outline" size={isSmallScreen ? 28 : 32} color={COLORS.accent} />
            <Text style={styles.quickActionText}>Boutique</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('reviews')}
            activeOpacity={0.8}
          >
            <Ionicons name="star-outline" size={isSmallScreen ? 28 : 32} color="#FFD700" />
            <Text style={styles.quickActionText}>Avis</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('emergency')}
            activeOpacity={0.8}
          >
            <Ionicons name="flash-outline" size={isSmallScreen ? 28 : 32} color={COLORS.error} />
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
        
        {todayBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateText}>Aucune réservation aujourd'hui</Text>
          </View>
        ) : (
          todayBookings.map((booking) => (
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
          ))
        )}
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
              <Text style={styles.earningsAmount}>{stats.monthlyEarnings}€</Text>
              <Text style={styles.earningsSubtitle}>Ce mois</Text>
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
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? (isSmallScreen ? 40 : 50) : (isSmallScreen ? 20 : 30),
    paddingBottom: isSmallScreen ? 20 : 24,
    paddingHorizontal: isSmallScreen ? 12 : 16,
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
    width: isSmallScreen ? 44 : 50,
    height: isSmallScreen ? 44 : 50,
    borderRadius: isSmallScreen ? 22 : 25,
    marginRight: isSmallScreen ? 10 : 12,
    backgroundColor: COLORS.white,
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  welcomeText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  providerName: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 2,
    flexShrink: 1,
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
    paddingHorizontal: isSmallScreen ? 12 : 16,
    marginTop: isSmallScreen ? -16 : -20,
    marginBottom: isSmallScreen ? 20 : 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: isSmallScreen ? 10 : 12,
    padding: isSmallScreen ? 12 : 16,
    alignItems: 'center',
    marginHorizontal: isSmallScreen ? 3 : 4,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  statNumber: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: isSmallScreen ? 6 : 8,
  },
  statLabel: {
    fontSize: isSmallScreen ? 10 : 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginBottom: isSmallScreen ? 20 : 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 12 : 16,
    marginBottom: isSmallScreen ? 12 : 16,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    marginBottom: isSmallScreen ? 12 : 16,
  },
  seeAllText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: isSmallScreen ? 12 : 16,
    gap: isSmallScreen ? 10 : 12,
  },
  quickActionCard: {
    width: isSmallScreen ? '48%' : '47%',
    backgroundColor: COLORS.white,
    borderRadius: isSmallScreen ? 10 : 12,
    padding: isSmallScreen ? 16 : 20,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  quickActionText: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: isSmallScreen ? 6 : 8,
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: isSmallScreen ? 12 : 16,
    marginVertical: 4,
    borderRadius: isSmallScreen ? 10 : 12,
    padding: isSmallScreen ? 12 : 16,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  bookingInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: isSmallScreen ? 12 : 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  bookingTime: {
    fontSize: isSmallScreen ? 11 : 12,
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
    marginHorizontal: isSmallScreen ? 12 : 16,
    borderRadius: isSmallScreen ? 12 : 16,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
    }),
  },
  earningsGradient: {
    padding: isSmallScreen ? 16 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  earningsContent: {
    flex: 1,
  },
  earningsTitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: isSmallScreen ? 26 : 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  earningsSubtitle: {
    fontSize: isSmallScreen ? 12 : 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ProviderHomeScreen; 