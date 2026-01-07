import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { AuthService } from '../../backend/services/auth.service';
import { UsersService } from '../../backend/services/users.service';
import * as ImagePicker from 'expo-image-picker';

interface EditProfileScreenProps {
  navigation?: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Champs du formulaire
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await AuthService.getCurrentUser();
      
      if (userData) {
        setUser(userData);
        setFirstName(userData.first_name || '');
        setLastName(userData.last_name || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
        setCity(userData.city || '');
        setNeighborhood(userData.neighborhood || '');
        setAvatarUrl(userData.avatar_url || null);
      } else {
        Alert.alert('Erreur', 'Impossible de charger les données utilisateur');
        navigation?.goBack();
      }
    } catch (error: any) {
      console.error('Erreur chargement profil:', error);
      showError('Erreur lors du chargement du profil');
      navigation?.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Veuillez autoriser l\'accès à la galerie');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: (ImagePicker.MediaTypeOptions && ImagePicker.MediaTypeOptions.Images) || 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setAvatarUrl(imageUri);
        
        // Uploader l'image vers Supabase Storage
        if (user) {
          try {
            // Uploader directement l'URI vers Supabase Storage
            const uploadedUrl = await UsersService.uploadAvatarFromUri(user.id, imageUri);
            setAvatarUrl(uploadedUrl.avatar_url);
            showSuccess('Photo de profil mise à jour');
          } catch (uploadError: any) {
            console.error('Erreur upload image:', uploadError);
            showError('Erreur lors de l\'upload de l\'image. L\'image sera sauvegardée lors de l\'enregistrement du profil.');
          }
        }
      }
    } catch (error: any) {
      console.error('Erreur sélection image:', error);
      showError('Erreur lors de la sélection de l\'image');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Validation
    if (!firstName.trim() && !lastName.trim()) {
      showError('Veuillez renseigner au moins un prénom ou un nom');
      return;
    }

    try {
      setSaving(true);

      const updates: any = {
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        phone: phone.trim() || null,
        city: city.trim() || null,
        neighborhood: neighborhood.trim() || null,
      };

      // Si l'avatar a changé et que c'est une URI locale, l'uploader
      if (avatarUrl && !avatarUrl.startsWith('http')) {
        try {
          const uploadedData = await UsersService.uploadAvatarFromUri(user.id, avatarUrl);
          updates.avatar_url = uploadedData.avatar_url;
        } catch (uploadError: any) {
          console.error('Erreur upload avatar lors de la sauvegarde:', uploadError);
          showError('Erreur lors de l\'upload de la photo. Les autres informations ont été sauvegardées.');
        }
      } else if (avatarUrl && avatarUrl.startsWith('http')) {
        // Si c'est déjà une URL, juste la mettre à jour
        updates.avatar_url = avatarUrl;
      }

      await UsersService.updateProfile(user.id, updates);
      
      showSuccess('Profil mis à jour avec succès');
      
      // Attendre un peu pour que le toast s'affiche
      setTimeout(() => {
        navigation?.goBack();
      }, 1000);
    } catch (error: any) {
      console.error('Erreur sauvegarde profil:', error);
      showError(error.message || 'Erreur lors de la sauvegarde du profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifier le profil</Text>
          <TouchableOpacity
            onPress={handleSave}
            style={styles.saveButton}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo de profil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo de profil</Text>
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={50} color={COLORS.textSecondary} />
              </View>
            )}
            <TouchableOpacity
              style={styles.avatarEditButton}
              onPress={handlePickImage}
            >
              <Ionicons name="camera" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Informations personnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prénom *</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Votre prénom"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom *</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Votre nom"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={email}
              editable={false}
              placeholderTextColor={COLORS.textSecondary}
            />
            <Text style={styles.helperText}>L'email ne peut pas être modifié</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+33 6 12 34 56 78"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ville</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Paris"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quartier</Text>
            <TextInput
              style={styles.input}
              value={neighborhood}
              onChangeText={setNeighborhood}
              placeholder="Paris 15e"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.noteText}>
            * Les champs marqués d'un astérisque sont obligatoires
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
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
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: 8,
    minWidth: 80,
    alignItems: 'flex-end',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 5,
    right: '35%',
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  noteText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
});

export default EditProfileScreen;

