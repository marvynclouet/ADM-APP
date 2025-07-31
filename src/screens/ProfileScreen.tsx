import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

interface ProfileScreenProps {
  navigation?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const user = {
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    memberSince: '2023',
    totalBookings: 12,
    favoriteProviders: 5
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            // Naviguer vers la page de connexion
            if (navigation) {
              navigation.navigate('Auth');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Informations personnelles',
      subtitle: 'Modifier vos données',
      onPress: () => {
        Alert.alert(
          'Informations personnelles',
          'Fonctionnalité à venir : Modification du profil utilisateur',
          [{ text: 'OK' }]
        );
      },
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Gérer vos préférences',
      onPress: () => {
        Alert.alert(
          'Notifications',
          'Fonctionnalité à venir : Gestion des notifications',
          [{ text: 'OK' }]
        );
      },
    },
    {
      icon: 'card-outline',
      title: 'Moyens de paiement',
      subtitle: 'Cartes et portefeuilles',
      onPress: () => {
        Alert.alert(
          'Moyens de paiement',
          'Fonctionnalité à venir : Gestion des moyens de paiement',
          [{ text: 'OK' }]
        );
      },
    },
    {
      icon: 'location-outline',
      title: 'Adresses',
      subtitle: 'Adresses de livraison',
      onPress: () => {
        Alert.alert(
          'Adresses',
          'Fonctionnalité à venir : Gestion des adresses',
          [{ text: 'OK' }]
        );
      },
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Confidentialité',
      subtitle: 'Sécurité et données',
      onPress: () => {
        Alert.alert(
          'Confidentialité',
          'Fonctionnalité à venir : Paramètres de confidentialité',
          [{ text: 'OK' }]
        );
      },
    },
    {
      icon: 'help-circle-outline',
      title: 'Aide et support',
      subtitle: 'FAQ et contact',
      onPress: () => {
        Alert.alert(
          'Aide et support',
          'Fonctionnalité à venir : Centre d\'aide et support',
          [{ text: 'OK' }]
        );
      },
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </LinearGradient>

      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profilePhone}>{user.phone}</Text>
          </View>
        </View>

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
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
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

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  profileSection: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  menuSection: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
});

export default ProfileScreen; 