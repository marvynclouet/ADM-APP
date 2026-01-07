import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { AuthService } from '../../backend/services/auth.service';
import { supabase } from '../../backend/supabase/config';
import LoadingSpinner from '../components/LoadingSpinner';

interface ProfileScreenProps {
  navigation?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { toast, showSuccess, showInfo, showWarning, hideToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    favoriteProviders: 0,
    loyaltyPoints: 0,
  });
  const [favoriteServiceTypes, setFavoriteServiceTypes] = useState<string[]>([]);

  // Recharger les données quand l'écran est focus (après retour de EditProfile)
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'utilisateur actuel
      const userData = await AuthService.getCurrentUser();
      
      if (userData) {
        setUser(userData);
        
        // Charger les statistiques et préférences
        await Promise.all([
          loadStats(userData.id),
          loadFavoriteServices(userData.id),
        ]);
      } else {
        // Si pas d'utilisateur, rediriger vers l'auth
        if (navigation) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        }
      }
    } catch (error: any) {
      console.error('Erreur chargement profil:', error);
      showWarning('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (userId: string) => {
    try {
      // Compter les réservations
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Compter les favoris
      const { count: favoritesCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      setStats({
        totalBookings: bookingsCount || 0,
        favoriteProviders: favoritesCount || 0,
        loyaltyPoints: 0, // À implémenter dans la BDD si nécessaire
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const loadFavoriteServices = async (userId: string) => {
    try {
      // Récupérer les favoris avec les catégories
      const { data: favorites } = await supabase
        .from('favorites')
        .select(`
          category_id,
          category:service_categories(name)
        `)
        .eq('user_id', userId);

      if (favorites) {
        // Extraire les noms de catégories uniques
        const categories = favorites
          .map((fav: any) => fav.category?.name)
          .filter((name: string) => name)
          .filter((name: string, index: number, self: string[]) => self.indexOf(name) === index);
        
        setFavoriteServiceTypes(categories);
      }
    } catch (error) {
      console.error('Erreur chargement services favoris:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement du profil..." />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Aucun utilisateur connecté</Text>
      </View>
    );
  }

  // Construire le nom complet
  const fullName = user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user.first_name || user.last_name || user.email?.split('@')[0] || 'Utilisateur';
  
  // Construire la localisation
  const location = user.neighborhood 
    ? user.neighborhood 
    : user.city || '';

  // Fourchette de prix (à implémenter dans la BDD si nécessaire)
  const priceRange = { min: 30, max: 100 }; // Valeur par défaut - à récupérer depuis la BDD

  // Réseaux sociaux
  const instagram = user.instagram || '';
  const tiktok = user.tiktok || '';

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la déconnexion');
    }
  };

  const handleMenuPress = (action: string) => {
    switch (action) {
      case 'edit':
        if (navigation) {
          navigation.navigate('EditProfile');
        } else {
          showInfo('Navigation non disponible');
        }
        break;
      case 'notifications':
        showInfo('Paramètres de notifications à venir');
        break;
      case 'security':
        showInfo('Paramètres de sécurité à venir');
        break;
      case 'payment':
        showInfo('Méthodes de paiement à venir');
        break;
      case 'help':
        showInfo('Centre d\'aide à venir');
        break;
      case 'about':
        showInfo('À propos de l\'application à venir');
        break;
      case 'logout':
        showWarning('Déconnexion en cours...');
        handleLogout();
        break;
      default:
        showInfo('Fonctionnalité à venir');
    }
  };

  const menuItems = [
    {
      id: 'edit',
      title: 'Modifier le profil',
      subtitle: 'Informations personnelles',
      icon: 'person-outline',
      action: () => handleMenuPress('edit')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Préférences de notifications',
      icon: 'notifications-outline',
      action: () => handleMenuPress('notifications')
    },
    {
      id: 'security',
      title: 'Sécurité',
      subtitle: 'Mot de passe et authentification',
      icon: 'shield-outline',
      action: () => handleMenuPress('security')
    },
    {
      id: 'payment',
      title: 'Méthodes de paiement',
      subtitle: 'Cartes et portefeuilles',
      icon: 'card-outline',
      action: () => handleMenuPress('payment')
    },
    {
      id: 'help',
      title: 'Aide',
      subtitle: 'FAQ et support client',
      icon: 'help-circle-outline',
      action: () => handleMenuPress('help')
    },
    {
      id: 'about',
      title: 'À propos',
      subtitle: 'Version et informations',
      icon: 'information-circle-outline',
      action: () => handleMenuPress('about')
    }
  ];

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
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
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </LinearGradient>

      {/* Section profil utilisateur */}
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          {user.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.profileAvatar} />
          ) : (
            <View style={styles.profileAvatarPlaceholder}>
              <Ionicons name="person" size={40} color={COLORS.textSecondary} />
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{fullName}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            {user.phone && <Text style={styles.profilePhone}>{user.phone}</Text>}
            {location && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.profileLocation}>{location}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Statistiques utilisateur */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalBookings}</Text>
          <Text style={styles.statLabel}>Réservations</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.favoriteProviders}</Text>
          <Text style={styles.statLabel}>Favoris</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.loyaltyPoints}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      {/* Préférences */}
      <View style={styles.preferencesSection}>
        <Text style={styles.sectionTitle}>Préférences</Text>
        {favoriteServiceTypes.length > 0 && (
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Services favoris</Text>
            <View style={styles.tagsContainer}>
              {favoriteServiceTypes.map((service, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {priceRange && priceRange.min && priceRange.max && (
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Fourchette de prix</Text>
            <Text style={styles.preferenceValue}>
              {priceRange.min}€ - {priceRange.max}€
            </Text>
          </View>
        )}
      </View>

      {/* Réseaux sociaux */}
      {(instagram || tiktok) && (
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Réseaux sociaux</Text>
          {instagram && (
            <View style={styles.socialItem}>
              <Ionicons name="logo-instagram" size={20} color={COLORS.primary} />
              <Text style={styles.socialText}>{instagram}</Text>
            </View>
          )}
          {tiktok && (
            <View style={styles.socialItem}>
              <Ionicons name="musical-notes-outline" size={20} color={COLORS.primary} />
              <Text style={styles.socialText}>{tiktok}</Text>
            </View>
          )}
        </View>
      )}

      {/* Section menu */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Bouton de déconnexion */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => handleMenuPress('logout')}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
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
    height: 150, // Fixed height for the header
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  profileSection: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  preferencesSection: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  preferenceItem: {
    marginBottom: 16,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  preferenceValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  socialSection: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  statsContainer: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.lightGray,
  },
  menuSection: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  menuSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.error,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    margin: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 8,
  },
});

export default ProfileScreen; 