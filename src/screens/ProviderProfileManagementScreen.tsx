import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/colors';

interface ProviderProfileManagementScreenProps {
  navigation?: any;
}

const ProviderProfileManagementScreen: React.FC<ProviderProfileManagementScreenProps> = ({
  navigation,
}) => {
  const [profileData, setProfileData] = useState({
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@email.com',
    phone: '+33 6 12 34 56 78',
    age: 28,
    city: 'Paris',
    activityZone: 'Paris 8e',
    address: '15 rue de la Paix, 75001 Paris',
    bio: 'Coiffeuse professionnelle avec 10 ans d\'expérience',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=b6e3f4',
    radius: 10, // km
    mainSkills: ['manucure', 'pédicure', 'nail art'],
    experienceLevel: 'intermediate' as 'beginner' | 'intermediate' | 'expert',
    experience: 5,
    instagram: '@sophie_nails',
    tiktok: '',
    facebook: '',
    subscriptionType: 'premium' as 'free' | 'premium',
  });

  const [portfolio, setPortfolio] = useState<string[]>([
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400',
    'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400',
  ]);

  const [openingHours, setOpeningHours] = useState({
    monday: { start: '09:00', end: '18:00', closed: false },
    tuesday: { start: '09:00', end: '18:00', closed: false },
    wednesday: { start: '09:00', end: '18:00', closed: false },
    thursday: { start: '09:00', end: '18:00', closed: false },
    friday: { start: '09:00', end: '18:00', closed: false },
    saturday: { start: '10:00', end: '16:00', closed: false },
    sunday: { start: '', end: '', closed: true },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPortfolioPicker, setShowPortfolioPicker] = useState(false);

  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' },
  ];

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileData({ ...profileData, avatar: result.assets[0].uri });
    }
  };

  const handlePickPortfolioImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setPortfolio([...portfolio, ...newImages]);
      setShowPortfolioPicker(false);
    }
  };

  const handleRemovePortfolioImage = (index: number) => {
    Alert.alert(
      'Supprimer la photo',
      'Êtes-vous sûr de vouloir supprimer cette photo du portfolio ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setPortfolio(portfolio.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Succès', 'Profil mis à jour avec succès');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <TouchableOpacity
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>{isEditing ? 'Enregistrer' : 'Modifier'}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Photo de profil */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photo de profil</Text>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
          {isEditing && (
            <TouchableOpacity style={styles.avatarEditButton} onPress={handlePickAvatar}>
              <Ionicons name="camera" size={20} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Informations personnelles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Prénom</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.firstName}
              onChangeText={text => setProfileData({ ...profileData, firstName: text })}
              editable={isEditing}
              placeholder="Prénom"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.lastName}
              onChangeText={text => setProfileData({ ...profileData, lastName: text })}
              editable={isEditing}
              placeholder="Nom"
            />
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Âge (optionnel)</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profileData.age?.toString() || ''}
            onChangeText={text =>
              setProfileData({ ...profileData, age: text ? parseInt(text) : undefined })
            }
            editable={isEditing}
            placeholder="28"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profileData.email}
            onChangeText={text => setProfileData({ ...profileData, email: text })}
            editable={isEditing}
            placeholder="votre@email.com"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Téléphone (optionnel)</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profileData.phone}
            onChangeText={text => setProfileData({ ...profileData, phone: text })}
            editable={isEditing}
            placeholder="+33 6 12 34 56 78"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Coordonnées */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Coordonnées</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ville / Zone d'activité</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profileData.activityZone}
            onChangeText={text => setProfileData({ ...profileData, activityZone: text })}
            editable={isEditing}
            placeholder="Paris 8e, Île-de-France..."
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Adresse complète (privée)</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profileData.address}
            onChangeText={text => setProfileData({ ...profileData, address: text })}
            editable={isEditing}
            placeholder="15 rue de la Paix, 75001 Paris"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Zone de déplacement (km)</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profileData.radius.toString()}
            onChangeText={text =>
              setProfileData({ ...profileData, radius: parseFloat(text) || 0 })
            }
            editable={isEditing}
            placeholder="10"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Informations professionnelles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations professionnelles</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Compétences principales</Text>
          <Text style={styles.inputHint}>
            Séparez par des virgules (ex: coiffure, maquillage, ongles)
          </Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profileData.mainSkills.join(', ')}
            onChangeText={text =>
              setProfileData({
                ...profileData,
                mainSkills: text.split(',').map(s => s.trim()).filter(s => s),
              })
            }
            editable={isEditing}
            placeholder="coiffure, maquillage, ongles"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bio / Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
            value={profileData.bio}
            onChangeText={text => setProfileData({ ...profileData, bio: text })}
            editable={isEditing}
            placeholder="Parlez de vous, de votre expérience..."
            multiline
            numberOfLines={4}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Années d'expérience</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profileData.experience.toString()}
            onChangeText={text =>
              setProfileData({ ...profileData, experience: parseInt(text) || 0 })
            }
            editable={isEditing}
            placeholder="5"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Niveau d'expérience</Text>
          {isEditing ? (
            <View style={styles.levelSelector}>
              {(['beginner', 'intermediate', 'expert'] as const).map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelButton,
                    profileData.experienceLevel === level && styles.levelButtonActive,
                  ]}
                  onPress={() => setProfileData({ ...profileData, experienceLevel: level })}
                >
                  <Text
                    style={[
                      styles.levelButtonText,
                      profileData.experienceLevel === level && styles.levelButtonTextActive,
                    ]}
                  >
                    {level === 'beginner'
                      ? 'Débutant'
                      : level === 'intermediate'
                      ? 'Confirmé'
                      : 'Expert'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.input}>
              {profileData.experienceLevel === 'beginner'
                ? 'Débutant'
                : profileData.experienceLevel === 'intermediate'
                ? 'Confirmé'
                : 'Expert'}
            </Text>
          )}
        </View>
      </View>

      {/* Réseaux sociaux */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Réseaux sociaux (optionnel)</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Instagram</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profileData.instagram}
            onChangeText={text => setProfileData({ ...profileData, instagram: text })}
            editable={isEditing}
            placeholder="@username"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>TikTok</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profileData.tiktok}
            onChangeText={text => setProfileData({ ...profileData, tiktok: text })}
            editable={isEditing}
            placeholder="@username"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Facebook</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profileData.facebook}
            onChangeText={text => setProfileData({ ...profileData, facebook: text })}
            editable={isEditing}
            placeholder="Page ou profil Facebook"
          />
        </View>
      </View>

      {/* Statut / Abonnement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statut / Abonnement</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Type de compte</Text>
          {isEditing ? (
            <View style={styles.levelSelector}>
              {(['free', 'premium'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.levelButton,
                    profileData.subscriptionType === type && styles.levelButtonActive,
                  ]}
                  onPress={() => setProfileData({ ...profileData, subscriptionType: type })}
                >
                  <Text
                    style={[
                      styles.levelButtonText,
                      profileData.subscriptionType === type && styles.levelButtonTextActive,
                    ]}
                  >
                    {type === 'free' ? 'Gratuit' : 'Premium'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.input}>
              {profileData.subscriptionType === 'free' ? 'Gratuit' : 'Premium'}
            </Text>
          )}
        </View>
      </View>

      {/* Horaires d'ouverture */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horaires d'ouverture</Text>
        {days.map(day => {
          const dayHours = openingHours[day.key as keyof typeof openingHours];
          return (
            <View key={day.key} style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>{day.label}</Text>
              {dayHours.closed ? (
                <Text style={styles.scheduleClosed}>Fermé</Text>
              ) : (
                <View style={styles.scheduleTime}>
                  {isEditing ? (
                    <>
                      <TextInput
                        style={styles.timeInput}
                        value={dayHours.start}
                        onChangeText={text =>
                          setOpeningHours({
                            ...openingHours,
                            [day.key]: { ...dayHours, start: text },
                          })
                        }
                        placeholder="09:00"
                      />
                      <Text style={styles.scheduleSeparator}>-</Text>
                      <TextInput
                        style={styles.timeInput}
                        value={dayHours.end}
                        onChangeText={text =>
                          setOpeningHours({
                            ...openingHours,
                            [day.key]: { ...dayHours, end: text },
                          })
                        }
                        placeholder="18:00"
                      />
                    </>
                  ) : (
                    <Text style={styles.scheduleText}>
                      {dayHours.start} - {dayHours.end}
                    </Text>
                  )}
                </View>
              )}
              {isEditing && (
                <TouchableOpacity
                  onPress={() =>
                    setOpeningHours({
                      ...openingHours,
                      [day.key]: { ...dayHours, closed: !dayHours.closed },
                    })
                  }
                >
                  <Ionicons
                    name={dayHours.closed ? 'checkbox-outline' : 'checkbox'}
                    size={24}
                    color={dayHours.closed ? COLORS.textSecondary : COLORS.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      {/* Portfolio / Galerie */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Galerie de réalisations</Text>
          {isEditing && (
            <TouchableOpacity
              style={styles.addPortfolioButton}
              onPress={() => setShowPortfolioPicker(true)}
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
              <Text style={styles.addPortfolioText}>Ajouter</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.portfolioGrid}>
          {portfolio.map((image, index) => (
            <View key={index} style={styles.portfolioItem}>
              <Image source={{ uri: image }} style={styles.portfolioImage} />
              {isEditing && (
                <TouchableOpacity
                  style={styles.removePortfolioButton}
                  onPress={() => handleRemovePortfolioImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color={COLORS.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        {portfolio.length === 0 && (
          <Text style={styles.emptyPortfolio}>Aucune photo dans votre portfolio</Text>
        )}
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.lightGray,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  inputRow: {
    flexDirection: 'row',
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
  inputHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  levelSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  levelButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  levelButtonText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  levelButtonTextActive: {
    color: COLORS.white,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  inputDisabled: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.7,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  scheduleDay: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  scheduleClosed: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  scheduleTime: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  timeInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
    width: 80,
    textAlign: 'center',
  },
  scheduleSeparator: {
    marginHorizontal: 8,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  scheduleText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  portfolioItem: {
    width: '31%',
    marginRight: '2%',
    marginBottom: '2%',
    position: 'relative',
  },
  portfolioImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  removePortfolioButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
  },
  addPortfolioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addPortfolioText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  emptyPortfolio: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ProviderProfileManagementScreen;




