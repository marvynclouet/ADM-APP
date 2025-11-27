import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/colors';
import EmptyState from '../components/EmptyState';
import { ServiceLevel } from '../types';
import LevelBadge from '../components/LevelBadge';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image?: string;
  isActive: boolean;
  level?: ServiceLevel;
  isCustom?: boolean; // Prestation personnalisée
}

interface ProviderServicesManagementScreenProps {
  navigation?: any;
}

const ProviderServicesManagementScreen: React.FC<ProviderServicesManagementScreenProps> = ({
  navigation,
}) => {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Coiffure & Brushing',
      description: 'Coupe moderne et brushing professionnel',
      price: 45,
      duration: 60,
      category: 'Coiffure',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400',
      isActive: true,
    },
    {
      id: '2',
      name: 'Manucure',
      description: 'Soin des ongles et pose de vernis',
      price: 25,
      duration: 45,
      category: 'Beauté',
      image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
      isActive: true,
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: 'Coiffure',
    image: '',
    isActive: true,
    level: ServiceLevel.INTERMEDIATE,
    isCustom: false, // Prestation personnalisée
  });

  const categories = ['Coiffure', 'Beauté', 'Massage', 'Soins', 'Autre'];
  const levels = [
    { value: ServiceLevel.BEGINNER, label: 'Débutant' },
    { value: ServiceLevel.INTERMEDIATE, label: 'Intermédiaire' },
    { value: ServiceLevel.ADVANCED, label: 'Avancé' },
    { value: ServiceLevel.PRO, label: 'Pro' },
  ];

  const handleAddService = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: 'Coiffure',
      image: '',
      isActive: true,
      level: ServiceLevel.INTERMEDIATE,
      isCustom: false,
    });
    setIsModalVisible(true);
  };

  const handleAddCustomService = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: 'Autre',
      image: '',
      isActive: true,
      level: ServiceLevel.INTERMEDIATE,
      isCustom: true, // Marquer comme prestation personnalisée
    });
    setIsModalVisible(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
      image: service.image || '',
      isActive: service.isActive,
      level: service.level || ServiceLevel.INTERMEDIATE,
      isCustom: service.isCustom || false,
    });
    setIsModalVisible(true);
  };

  const handleDeleteService = (serviceId: string) => {
    Alert.alert(
      'Supprimer le service',
      'Êtes-vous sûr de vouloir supprimer ce service ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setServices(services.filter(s => s.id !== serviceId));
          },
        },
      ]
    );
  };

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

  const handleSaveService = () => {
    if (!formData.name || !formData.price || !formData.duration) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newService: Service = {
      id: editingService?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      category: formData.category,
      image: formData.image,
      isActive: formData.isActive,
      level: formData.level,
      isCustom: formData.isCustom,
    };

    if (editingService) {
      setServices(services.map(s => (s.id === editingService.id ? newService : s)));
    } else {
      setServices([...services, newService]);
    }

    setIsModalVisible(false);
    Alert.alert('Succès', editingService ? 'Service modifié' : 'Service ajouté');
  };

  const toggleServiceStatus = (serviceId: string) => {
    setServices(
      services.map(s =>
        s.id === serviceId ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes Services</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleAddCustomService} style={styles.customServiceButton}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
              <Text style={styles.customServiceText}>Personnalisé</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddService} style={styles.addButton}>
              <Ionicons name="add" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Services List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {services.length === 0 ? (
          <EmptyState
            icon="business-outline"
            title="Aucun service"
            description="Commencez par ajouter votre premier service"
            actionText="Ajouter un service"
            onAction={handleAddService}
          />
        ) : (
          services.map(service => (
            <View key={service.id} style={styles.serviceCard}>
              <Image
                source={{ uri: service.image || 'https://via.placeholder.com/150' }}
                style={styles.serviceImage}
              />
              <View style={styles.serviceInfo}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Switch
                    value={service.isActive}
                    onValueChange={() => toggleServiceStatus(service.id)}
                    trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                  />
                </View>
                <View style={styles.serviceMeta}>
                  <View style={styles.serviceCategoryRow}>
                    <Text style={styles.serviceCategory}>{service.category}</Text>
                    {service.isCustom && (
                      <View style={styles.customBadge}>
                        <Ionicons name="star" size={12} color={COLORS.accent} />
                        <Text style={styles.customBadgeText}>Personnalisé</Text>
                      </View>
                    )}
                  </View>
                  {service.level && <LevelBadge level={service.level} size="small" />}
                </View>
                <Text style={styles.serviceDescription} numberOfLines={2}>
                  {service.description}
                </Text>
                <View style={styles.serviceDetails}>
                  <View style={styles.serviceDetailItem}>
                    <Ionicons name="cash" size={16} color={COLORS.primary} />
                    <Text style={styles.serviceDetailText}>€{service.price}</Text>
                  </View>
                  <View style={styles.serviceDetailItem}>
                    <Ionicons name="time" size={16} color={COLORS.accent} />
                    <Text style={styles.serviceDetailText}>{service.duration}min</Text>
                  </View>
                </View>
                <View style={styles.serviceActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditService(service)}
                  >
                    <Ionicons name="pencil" size={16} color={COLORS.primary} />
                    <Text style={styles.actionButtonText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteService(service.id)}
                  >
                    <Ionicons name="trash" size={16} color={COLORS.error} />
                    <Text style={[styles.actionButtonText, { color: COLORS.error }]}>
                      Supprimer
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal d'ajout/modification */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingService ? 'Modifier le service' : 'Nouveau service'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Image */}
              <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                {formData.image ? (
                  <Image source={{ uri: formData.image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera" size={32} color={COLORS.textSecondary} />
                    <Text style={styles.imagePlaceholderText}>Ajouter une photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Nom */}
              <Text style={styles.inputLabel}>Nom du service *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={text => setFormData({ ...formData, name: text })}
                placeholder="Ex: Coiffure & Brushing"
              />

              {/* Catégorie */}
              <Text style={styles.inputLabel}>Catégorie *</Text>
              <View style={styles.categorySelector}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      formData.category === category && styles.categoryButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, category })}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        formData.category === category && styles.categoryButtonTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Description */}
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={text => setFormData({ ...formData, description: text })}
                placeholder="Description du service"
                multiline
                numberOfLines={4}
              />

              {/* Prix */}
              <Text style={styles.inputLabel}>Prix (€) *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={text => setFormData({ ...formData, price: text })}
                placeholder="45"
                keyboardType="numeric"
              />

              {/* Durée */}
              <Text style={styles.inputLabel}>Durée (minutes) *</Text>
              <TextInput
                style={styles.input}
                value={formData.duration}
                onChangeText={text => setFormData({ ...formData, duration: text })}
                placeholder="60"
                keyboardType="numeric"
              />

              {/* Niveau */}
              <Text style={styles.inputLabel}>Niveau de service *</Text>
              <View style={styles.levelSelector}>
                {levels.map(level => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.levelButton,
                      formData.level === level.value && styles.levelButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, level: level.value })}
                  >
                    <LevelBadge level={level.value} size="small" />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Prestation personnalisée */}
              {formData.isCustom && (
                <View style={styles.customServiceInfo}>
                  <Ionicons name="information-circle" size={20} color={COLORS.accent} />
                  <Text style={styles.customServiceInfoText}>
                    Cette prestation personnalisée sera soumise à validation par ADM si nécessaire.
                  </Text>
                </View>
              )}

              {/* Statut */}
              <View style={styles.switchContainer}>
                <Text style={styles.inputLabel}>Service actif</Text>
                <Switch
                  value={formData.isActive}
                  onValueChange={value => setFormData({ ...formData, isActive: value })}
                  trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                />
              </View>

              {/* Boutons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.saveButton, styles.modalButton]}
                  onPress={handleSaveService}
                >
                  <Text style={styles.saveButtonText}>
                    {editingService ? 'Modifier' : 'Ajouter'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cancelButton, styles.modalButton]}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    gap: 4,
  },
  customServiceText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  serviceCard: {
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
  serviceImage: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.lightGray,
  },
  serviceInfo: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceCategory: {
    fontSize: 14,
    color: COLORS.primary,
  },
  customBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  customBadgeText: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: '600',
  },
  customServiceInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.accent + '15',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  customServiceInfoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  serviceDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  serviceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceDetailText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  serviceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: COLORS.lightGray,
  },
  deleteButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  categoryButtonTextActive: {
    color: COLORS.white,
  },
  levelSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  levelButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  levelButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
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

export default ProviderServicesManagementScreen;
