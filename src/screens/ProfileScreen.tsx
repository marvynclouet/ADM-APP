import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
  navigation?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { toast, showSuccess, showInfo, showWarning, hideToast } = useToast();
  const user = {
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    memberSince: 'Janvier 2024',
    totalBookings: 12,
    favoriteProviders: 5,
    totalSpent: 450,
  };

  // Images d'illustration pour les sections
  const sectionImages = {
    'edit': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=100&fit=crop',
    'notifications': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=100&fit=crop',
    'security': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&h=100&fit=crop',
    'payment': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&h=100&fit=crop',
    'help': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop',
    'about': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=100&fit=crop',
  };

  const handleMenuPress = (action: string) => {
    switch (action) {
      case 'edit':
        showInfo('Modification du profil à venir');
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
        setTimeout(() => {
          if (navigation) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          }
        }, 1000);
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      
      {/* Header avec gradient et image de fond */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Mon Profil</Text>
            <Text style={styles.headerSubtitle}>Gérez vos préférences</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="person" size={32} color={COLORS.white} />
          </View>
        </View>
      </LinearGradient>

      {/* Section profil utilisateur */}
      <View style={styles.profileSection}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <Text style={styles.profileMemberSince}>Membre depuis {user.memberSince}</Text>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Ionicons name="pencil" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Statistiques utilisateur */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="calendar" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.statNumber}>{user.totalBookings}</Text>
            <Text style={styles.statLabel}>Réservations</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="heart" size={24} color={COLORS.error} />
            </View>
            <Text style={styles.statNumber}>{user.favoriteProviders}</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="wallet" size={24} color={COLORS.success} />
            </View>
            <Text style={styles.statNumber}>{user.totalSpent}€</Text>
            <Text style={styles.statLabel}>Total dépensé</Text>
          </View>
        </View>
      </View>

      {/* Section menu avec images */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => {
            const imageUrl = sectionImages[item.id as keyof typeof sectionImages];
            
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCard}
                onPress={item.action}
                activeOpacity={0.8}
              >
                {imageUrl && (
                  <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.menuCardImage}
                    resizeMode="cover"
                  />
                )}
                <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                  style={styles.menuCardOverlay}
                >
                  <View style={styles.menuCardContent}>
                    <Ionicons name={item.icon as any} size={24} color={COLORS.white} />
                    <Text style={styles.menuCardTitle}>{item.title}</Text>
                    <Text style={styles.menuCardSubtitle}>{item.subtitle}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Section informations de contact */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Informations de contact</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>{user.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="call" size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>{user.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>Paris, France</Text>
          </View>
        </View>
      </View>

      {/* Bouton de déconnexion */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => handleMenuPress('logout')}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      {/* Section version */}
      <View style={styles.versionSection}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.versionSubtext}>ADM Beauty Booking</Text>
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
    height: width * 0.4, // Hauteur du header
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
  },
  headerIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 10,
  },
  profileSection: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
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
  profileMemberSince: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  editProfileButton: {
    padding: 8,
  },
  statsSection: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    width: '30%', // Adjust as needed for 3 columns
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
  menuSection: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: '48%', // Two cards per row
    height: 180, // Fixed height for cards
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  menuCardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 12,
  },
  menuCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 12,
    padding: 15,
  },
  menuCardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  menuCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  menuCardSubtitle: {
    fontSize: 14,
    color: COLORS.white,
  },
  contactSection: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  contactCard: {
    marginTop: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  logoutSection: {
    margin: 16,
    marginBottom: 32,
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
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 8,
  },
  versionSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  versionSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

export default ProfileScreen; 