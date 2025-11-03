import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/colors';
import { Certificate } from '../types';
import EmptyState from '../components/EmptyState';

interface ProviderCertificatesScreenProps {
  navigation?: any;
}

const ProviderCertificatesScreen: React.FC<ProviderCertificatesScreenProps> = ({
  navigation,
}) => {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: '1',
      name: 'Certificat de Coiffure Professionnelle',
      issuingOrganization: 'Académie de Beauté',
      issueDate: '2023-06-15',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      verificationStatus: 'verified',
      verifiedAt: '2023-06-20',
    },
    {
      id: '2',
      name: 'Diplôme de Massothérapie',
      issuingOrganization: 'Institut de Formation',
      issueDate: '2022-03-10',
      image: 'https://images.unsplash.com/photo-1544161512-4ab8f4f2a52a?w=400',
      verificationStatus: 'pending',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    image: '',
  });

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleAddCertificate = () => {
    if (!formData.name || !formData.issuingOrganization || !formData.image) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newCertificate: Certificate = {
      id: Date.now().toString(),
      name: formData.name,
      issuingOrganization: formData.issuingOrganization,
      issueDate: formData.issueDate || new Date().toISOString().split('T')[0],
      image: formData.image,
      verificationStatus: 'pending',
    };

    setCertificates([...certificates, newCertificate]);
    setIsModalVisible(false);
    setFormData({ name: '', issuingOrganization: '', issueDate: '', image: '' });
    Alert.alert('Succès', 'Certificat ajouté. En attente de vérification.');
  };

  const handleDeleteCertificate = (id: string) => {
    Alert.alert('Supprimer', 'Voulez-vous supprimer ce certificat ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => setCertificates(certificates.filter(c => c.id !== id)),
      },
    ]);
  };

  const getVerificationBadge = (status: Certificate['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
            <Text style={styles.verifiedText}>Vérifié</Text>
          </View>
        );
      case 'pending':
        return (
          <View style={styles.pendingBadge}>
            <Ionicons name="time-outline" size={16} color={COLORS.warning} />
            <Text style={styles.pendingText}>En attente</Text>
          </View>
        );
      case 'rejected':
        return (
          <View style={styles.rejectedBadge}>
            <Ionicons name="close-circle" size={16} color={COLORS.error} />
            <Text style={styles.rejectedText}>Refusé</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes Diplômes</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addButton}>
            <Ionicons name="add" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {certificates.length === 0 ? (
          <EmptyState
            icon="school-outline"
            title="Aucun diplôme"
            description="Ajoutez vos diplômes et certificats pour renforcer votre crédibilité"
            actionText="Ajouter un diplôme"
            onAction={() => setIsModalVisible(true)}
          />
        ) : (
          certificates.map(certificate => (
            <View key={certificate.id} style={styles.certificateCard}>
              <Image
                source={{ uri: certificate.image }}
                style={styles.certificateImage}
              />
              <View style={styles.certificateInfo}>
                <Text style={styles.certificateName}>{certificate.name}</Text>
                <Text style={styles.certificateOrg}>{certificate.issuingOrganization}</Text>
                <Text style={styles.certificateDate}>
                  Émis le : {new Date(certificate.issueDate).toLocaleDateString('fr-FR')}
                </Text>
                {getVerificationBadge(certificate.verificationStatus)}
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCertificate(certificate.id)}
              >
                <Ionicons name="trash" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal d'ajout */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter un diplôme</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                {formData.image ? (
                  <Image source={{ uri: formData.image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera" size={32} color={COLORS.textSecondary} />
                    <Text style={styles.imagePlaceholderText}>Ajouter une photo du diplôme</Text>
                  </View>
                )}
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Nom du diplôme *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={text => setFormData({ ...formData, name: text })}
                placeholder="Ex: Certificat de Coiffure Professionnelle"
              />

              <Text style={styles.inputLabel}>Organisme émetteur *</Text>
              <TextInput
                style={styles.input}
                value={formData.issuingOrganization}
                onChangeText={text => setFormData({ ...formData, issuingOrganization: text })}
                placeholder="Ex: Académie de Beauté"
              />

              <Text style={styles.inputLabel}>Date d'obtention</Text>
              <TextInput
                style={styles.input}
                value={formData.issueDate}
                onChangeText={text => setFormData({ ...formData, issueDate: text })}
                placeholder="YYYY-MM-DD"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleAddCertificate}
                >
                  <Text style={styles.saveButtonText}>Ajouter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
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
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  certificateCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  certificateImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.lightGray,
  },
  certificateInfo: {
    padding: 16,
  },
  certificateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  certificateOrg: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  certificateDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
    marginLeft: 4,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pendingText: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '600',
    marginLeft: 4,
  },
  rejectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  rejectedText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  imagePicker: {
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  modalActions: {
    marginTop: 24,
  },
  modalButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  cancelButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProviderCertificatesScreen;

