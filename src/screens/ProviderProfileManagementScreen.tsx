import React, { useState, useEffect, useCallback } from 'react';
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
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/colors';
import { AuthService } from '../../backend/services/auth.service';
import { UsersService } from '../../backend/services/users.service';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;

interface ProviderProfileManagementScreenProps {
  navigation?: any;
}

const ProviderProfileManagementScreen: React.FC<ProviderProfileManagementScreenProps> = ({
  navigation,
}) => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: undefined as number | undefined,
    city: '',
    activityZone: '',
    address: '',
    bio: '',
    avatar: '',
    radius: 10, // km
    mainSkills: [] as string[],
    experienceLevel: 'beginner' as 'beginner' | 'intermediate' | 'expert',
    experience: 0,
    instagram: '',
    tiktok: '',
    facebook: '',
    subscriptionType: 'free' as 'free' | 'premium',
  });

  const [portfolio, setPortfolio] = useState<string[]>([]);

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

  // Charger les données du prestataire
  const loadProviderData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const userData = await AuthService.getCurrentUser();
      if (!userData || !userData.is_provider) {
        Alert.alert('Erreur', 'Vous n\'êtes pas un prestataire');
        navigation?.goBack();
        return;
      }

      setCurrentUserId(userData.id);

      // Construire l'avatar
      const avatar = userData.avatar_url || 
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.first_name || userData.email || 'User')}&backgroundColor=b6e3f4`;

      setProfileData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        age: userData.age || undefined,
        city: userData.city || '',
        activityZone: userData.activity_zone || userData.city || '',
        address: userData.address || '',
        bio: userData.description || '',
        avatar: avatar,
        radius: 10, // Non stocké dans la BDD pour l'instant
        mainSkills: userData.main_skills || [],
        experienceLevel: (userData.experience_level as 'beginner' | 'intermediate' | 'expert') || 'beginner',
        experience: userData.experience_years || 0,
        instagram: userData.instagram || '',
        tiktok: userData.tiktok || '',
        facebook: userData.facebook || '',
        subscriptionType: (userData.subscription_type as 'free' | 'premium') || 'free',
      });

      // TODO: Charger le portfolio depuis la table portfolio si elle existe
      setPortfolio([]);
    } catch (error: any) {
      console.error('Erreur lors du chargement du profil:', error);
      showError(error.message || 'Erreur lors du chargement du profil');
    } finally {
      setIsLoading(false);
    }
  }, [navigation, showError]);

  // Recharger les données quand l'écran est focus
  useFocusEffect(
    useCallback(() => {
      loadProviderData();
    }, [loadProviderData])
  );

  useEffect(() => {
    loadProviderData();
  }, [loadProviderData]);

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
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: (ImagePicker.MediaTypeOptions && ImagePicker.MediaTypeOptions.Images) || 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        // Mettre à jour l'avatar localement pour l'affichage
        setProfileData({ ...profileData, avatar: imageUri });
        
        // Uploader l'image vers Supabase Storage si on a un userId
        if (currentUserId) {
          try {
            const uploadedUrl = await UsersService.uploadAvatarFromUri(currentUserId, imageUri);
            // Remplacer l'URI locale par l'URL Supabase
            setProfileData({ ...profileData, avatar: uploadedUrl.avatar_url });
            showSuccess('Photo de profil mise à jour');
          } catch (uploadError: any) {
            console.error('Erreur upload avatar:', uploadError);
            showError('Erreur lors de l\'upload de l\'image. L\'image sera sauvegardée lors de l\'enregistrement.');
          }
        }
      }
    } catch (error: any) {
      console.error('Erreur sélection avatar:', error);
      showError('Erreur lors de la sélection de l\'image');
    }
  };

  const handlePickPortfolioImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: (ImagePicker.MediaTypeOptions && ImagePicker.MediaTypeOptions.Images) || 'images',
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

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.signOut();
              if (navigation) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Auth' }],
                });
              }
            } catch (error: any) {
              showError(error.message || 'Erreur lors de la déconnexion');
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!currentUserId) {
      showError('Aucun utilisateur connecté');
      return;
    }

    try {
      setIsSaving(true);

      // Préparer les données pour Supabase
      // Note: email n'est pas mis à jour ici car il est géré par Supabase Auth
      const updates: any = {
        first_name: profileData.firstName || null,
        last_name: profileData.lastName || null,
        phone: profileData.phone || null,
        age: profileData.age || null,
        city: profileData.city || profileData.activityZone?.split(',')[0]?.trim() || null,
        activity_zone: profileData.activityZone || null,
        address: profileData.address || null,
        description: profileData.bio || null,
        avatar_url: profileData.avatar || null,
        main_skills: profileData.mainSkills.length > 0 ? profileData.mainSkills : null,
        experience_level: profileData.experienceLevel || null,
        experience_years: profileData.experience || null,
        instagram: profileData.instagram || null,
        tiktok: profileData.tiktok || null,
        facebook: profileData.facebook || null,
        subscription_type: profileData.subscriptionType || 'free',
        is_premium: profileData.subscriptionType === 'premium',
      };

      // Mettre à jour le profil dans Supabase
      await UsersService.updateProfile(currentUserId, updates);

      setIsEditing(false);
      showSuccess('Profil mis à jour avec succès');
      
      // Recharger les données pour s'assurer qu'elles sont à jour
      await loadProviderData();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      showError(error.message || 'Erreur lors de la sauvegarde du profil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement du profil..." />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
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
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Modifier'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Photo de profil */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photo de profil</Text>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: profileData.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4' }} 
            style={styles.avatar}
            onError={() => {
              // En cas d'erreur de chargement, utiliser un avatar par défaut
              setProfileData({ 
                ...profileData, 
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4' 
              });
            }}
          />
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
            style={[styles.input, styles.inputDisabled]}
            value={profileData.email}
            editable={false}
            placeholder="votre@email.com"
            keyboardType="email-address"
          />
          <Text style={styles.inputHint}>
            L'email ne peut pas être modifié ici. Contactez le support pour changer votre email.
          </Text>
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
              <Image 
                source={{ 
                  uri: image && (image.startsWith('http') || image.startsWith('file://') || image.startsWith('content://'))
                    ? image 
                    : 'https://via.placeholder.com/150' 
                }} 
                style={styles.portfolioImage}
                onError={() => console.warn('Erreur chargement image portfolio:', image)}
              />
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

      {/* Bouton de déconnexion */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    ...(Platform.OS === 'web' ? { height: '100vh' } : {}),
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
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
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' } : {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 8,
  },
});

export default ProviderProfileManagementScreen;




