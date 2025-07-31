import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface ProfileScreenProps {
  navigation?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { toast, showSuccess, showInfo, showWarning, hideToast } = useToast();
  const user = {
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    memberSince: '2023',
    totalBookings: 12,
    favoriteProviders: 5
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
          <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profilePhone}>{user.phone}</Text>
          </View>
        </View>
      </View>

      {/* Statistiques utilisateur */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.totalBookings}</Text>
          <Text style={styles.statLabel}>Réservations</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.favoriteProviders}</Text>
          <Text style={styles.statLabel}>Favoris</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.memberSince}</Text>
          <Text style={styles.statLabel}>Membre depuis</Text>
        </View>
      </View>

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