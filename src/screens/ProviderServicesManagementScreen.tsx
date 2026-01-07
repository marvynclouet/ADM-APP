import React, { useState, useEffect, useCallback } from 'react';
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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/colors';
import EmptyState from '../components/EmptyState';
import { ServiceLevel } from '../types';
import LevelBadge from '../components/LevelBadge';
import { AuthService } from '../../backend/services/auth.service';
import { ServicesService } from '../../backend/services/services.service';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  categoryId?: string;
  subcategoryId?: string; // Sous-catégorie obligatoire
  image?: string;
  isActive: boolean;
  level?: ServiceLevel;
  isCustom?: boolean; // Prestation personnalisée
}

interface ProviderServicesManagementScreenProps {
  navigation?: any;
}

// Mapper les niveaux de la BDD vers ServiceLevel
const mapLevelToServiceLevel = (level: string): ServiceLevel => {
  switch (level) {
    case 'beginner': return ServiceLevel.BEGINNER;
    case 'intermediate': return ServiceLevel.INTERMEDIATE;
    case 'advanced': return ServiceLevel.ADVANCED;
    case 'pro': return ServiceLevel.PRO;
    default: return ServiceLevel.INTERMEDIATE;
  }
};

// Mapper ServiceLevel vers les niveaux de la BDD
const mapServiceLevelToDB = (level: ServiceLevel): string => {
  switch (level) {
    case ServiceLevel.BEGINNER: return 'beginner';
    case ServiceLevel.INTERMEDIATE: return 'intermediate';
    case ServiceLevel.ADVANCED: return 'advanced';
    case ServiceLevel.PRO: return 'pro';
    default: return 'intermediate';
  }
};

const ProviderServicesManagementScreen: React.FC<ProviderServicesManagementScreenProps> = ({
  navigation,
}) => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    categoryId: '',
    subcategoryId: '', // Sous-catégorie obligatoire
    image: '',
    isActive: true,
    level: ServiceLevel.INTERMEDIATE,
    isCustom: false, // Prestation personnalisée
  });

  // Charger les données
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Récupérer l'utilisateur actuel
      const userData = await AuthService.getCurrentUser();
      if (!userData || !userData.is_provider) {
        Alert.alert('Erreur', 'Vous n\'êtes pas un prestataire');
        navigation?.goBack();
        return;
      }

      setCurrentUserId(userData.id);

      // Charger les services du prestataire
      const servicesData = await ServicesService.getServices({
        providerId: userData.id,
      });

      // Transformer les données pour l'affichage
      const transformedServices = (servicesData || []).map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description || '',
        price: parseFloat(service.price) || 0,
        duration: service.duration_minutes || 0,
        category: service.category?.name || 'Autre',
        categoryId: service.category_id,
        subcategoryId: service.subcategory_id || '',
        image: service.image_url || undefined,
        isActive: service.is_active || false,
        level: service.level ? mapLevelToServiceLevel(service.level) : ServiceLevel.INTERMEDIATE,
        isCustom: service.is_custom || false,
      }));

      setServices(transformedServices);

      // Charger les catégories
      const categoriesData = await ServicesService.getCategories();
      setCategories(categoriesData || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des données:', error);
      showError(error.message || 'Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, [navigation, showError]);

  // Recharger les données quand l'écran est focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    loadData();
  }, [loadData]);
  const levels = [
    { value: ServiceLevel.BEGINNER, label: 'Débutant' },
    { value: ServiceLevel.INTERMEDIATE, label: 'Intermédiaire' },
    { value: ServiceLevel.ADVANCED, label: 'Avancé' },
    { value: ServiceLevel.PRO, label: 'Pro' },
  ];

  const handleAddService = () => {
    console.log('🔍 handleAddService appelé, categories:', categories.length);
    setEditingService(null);
    const firstCategory = categories.length > 0 ? categories[0] : null;
    console.log('🔍 firstCategory:', firstCategory);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: firstCategory?.name || '',
      categoryId: firstCategory?.id || '',
      subcategoryId: '', // Réinitialiser la sous-catégorie
      image: '',
      isActive: true,
      level: ServiceLevel.INTERMEDIATE,
      isCustom: false,
    });
    console.log('🔍 Ouverture du modal, isModalVisible sera:', true);
    setIsModalVisible(true);
  };

  const handleAddCustomService = () => {
    setEditingService(null);
    const otherCategory = categories.find(c => c.name.toLowerCase().includes('autre')) || categories[0];
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: otherCategory?.name || '',
      categoryId: otherCategory?.id || '',
      subcategoryId: '', // Réinitialiser la sous-catégorie
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
      categoryId: service.categoryId || '',
      subcategoryId: service.subcategoryId || '',
      image: service.image || '',
      isActive: service.isActive,
      level: service.level || ServiceLevel.INTERMEDIATE,
      isCustom: service.isCustom || false,
    });
    setIsModalVisible(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    Alert.alert(
      'Supprimer le service',
      'Êtes-vous sûr de vouloir supprimer ce service ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await ServicesService.deleteService(serviceId);
              showSuccess('Service supprimé avec succès');
              await loadData();
            } catch (error: any) {
              console.error('Erreur lors de la suppression:', error);
              showError(error.message || 'Erreur lors de la suppression du service');
            }
          },
        },
      ]
    );
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: (ImagePicker.MediaTypeOptions && ImagePicker.MediaTypeOptions.Images) || 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleSaveService = async () => {
    if (!formData.name || !formData.price || !formData.duration || !formData.categoryId || !formData.subcategoryId) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires (nom, prix, durée, catégorie et sous-catégorie)');
      return;
    }

    if (!currentUserId) {
      showError('Aucun utilisateur connecté');
      return;
    }

    try {
      setIsSaving(true);

      const serviceData: any = {
        category_id: formData.categoryId,
        subcategory_id: formData.subcategoryId, // Sous-catégorie obligatoire
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration),
        image_url: formData.image || null,
        level: mapServiceLevelToDB(formData.level),
        is_custom: formData.isCustom,
        is_active: formData.isActive,
        moderation_status: formData.isCustom ? 'pending' : 'approved',
      };

      console.log('🔍 ProviderServicesManagement - Données du service à créer:', {
        ...serviceData,
        formData,
      });

      if (editingService) {
        // Mettre à jour le service existant
        await ServicesService.updateService(editingService.id, serviceData);
        showSuccess('Service modifié avec succès');
      } else {
        // Créer un nouveau service
        await ServicesService.createService(currentUserId, serviceData);
        showSuccess('Service ajouté avec succès');
      }

      setIsModalVisible(false);
      await loadData();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      showError(error.message || 'Erreur lors de la sauvegarde du service');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleServiceStatus = async (serviceId: string) => {
    try {
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      const newStatus = !service.isActive;
      await ServicesService.updateService(serviceId, { is_active: newStatus });
      
      // Mettre à jour l'état local
      setServices(
        services.map(s =>
          s.id === serviceId ? { ...s, isActive: newStatus } : s
        )
      );
      
      showSuccess(newStatus ? 'Service activé' : 'Service désactivé');
    } catch (error: any) {
      console.error('Erreur lors du changement de statut:', error);
      showError(error.message || 'Erreur lors du changement de statut');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement des services..." />
      </View>
    );
  }

  console.log('🔍 Render - isModalVisible:', isModalVisible, 'categories:', categories.length);

  return (
    <>
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
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
        statusBarTranslucent={true}
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
              {categories.length === 0 ? (
                <Text style={styles.inputHint}>Chargement des catégories...</Text>
              ) : (
                <View style={styles.categorySelector}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        formData.categoryId === category.id && styles.categoryButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, category: category.name, categoryId: category.id, subcategoryId: '' })}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          formData.categoryId === category.id && styles.categoryButtonTextActive,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Sous-catégorie (obligatoire) */}
              {formData.categoryId && (
                <>
                  <Text style={styles.inputLabel}>Sous-catégorie *</Text>
                  {(() => {
                    const selectedCategory = categories.find(c => c.id === formData.categoryId);
                    const subcategories = selectedCategory?.subcategories || [];
                    
                    if (subcategories.length === 0) {
                      return (
                        <Text style={styles.inputHint}>
                          Aucune sous-catégorie disponible pour cette catégorie
                        </Text>
                      );
                    }
                    
                    return (
                      <View style={styles.categorySelector}>
                        {subcategories.map(subcategory => (
                          <TouchableOpacity
                            key={subcategory.id}
                            style={[
                              styles.categoryButton,
                              formData.subcategoryId === subcategory.id && styles.categoryButtonActive,
                            ]}
                            onPress={() => setFormData({ ...formData, subcategoryId: subcategory.id })}
                          >
                            <Text
                              style={[
                                styles.categoryButtonText,
                                formData.subcategoryId === subcategory.id && styles.categoryButtonTextActive,
                              ]}
                            >
                              {subcategory.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    );
                  })()}
                </>
              )}

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
                  style={[styles.saveButton, styles.modalButton, isSaving && styles.saveButtonDisabled]}
                  onPress={handleSaveService}
                  disabled={isSaving}
                >
                  <Text style={styles.saveButtonText}>
                    {isSaving ? 'Enregistrement...' : editingService ? 'Modifier' : 'Ajouter'}
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
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </>
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
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
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
    ...(Platform.OS === 'web' ? { 
      zIndex: 1000,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } : {}),
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
    ...(Platform.OS === 'web' ? { zIndex: 1001 } : {}),
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  inputHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
});

export default ProviderServicesManagementScreen;
