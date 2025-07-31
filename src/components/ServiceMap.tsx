import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service, ServiceProvider } from '../types';
import { COLORS } from '../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ServiceWithProvider {
  service: Service;
  provider: ServiceProvider;
  distance: number;
}

interface ServiceMapProps {
  services: ServiceWithProvider[];
  onServicePress: (serviceId: string) => void;
  onBackToList: () => void;
}

const ServiceMap: React.FC<ServiceMapProps> = ({
  services,
  onServicePress,
  onBackToList,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceWithProvider | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  const handleServicePress = (serviceData: ServiceWithProvider) => {
    setSelectedService(serviceData);
    setShowServiceModal(true);
  };

  const handleServiceSelect = () => {
    if (selectedService) {
      onServicePress(selectedService.service.id);
      setShowServiceModal(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToList}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services autour de vous</Text>
        <View style={styles.headerRight}>
          <Ionicons name="location" size={20} color={COLORS.white} />
        </View>
      </View>

      {/* Carte simulée */}
      <View style={styles.mapContainer}>
        <View style={styles.mapBackground}>
          {/* Grille de rue simulée */}
          <View style={styles.streetGrid}>
            <View style={styles.streetHorizontal} />
            <View style={styles.streetVertical} />
            <View style={styles.streetDiagonal1} />
            <View style={styles.streetDiagonal2} />
          </View>
          
          {/* Zones vertes (parcs) */}
          <View style={[styles.park, { top: 50, left: 50 }]} />
          <View style={[styles.park, { top: 200, right: 80 }]} />
          <View style={[styles.park, { bottom: 100, left: 100 }]} />

          {/* Marqueurs des services */}
          {services.map((serviceData, index) => (
            <TouchableOpacity
              key={serviceData.service.id}
              style={[
                styles.marker,
                {
                  top: 80 + (index * 60) % 300,
                  left: 100 + (index * 80) % 200,
                }
              ]}
              onPress={() => handleServicePress(serviceData)}
            >
              <View style={styles.markerIcon}>
                <Ionicons 
                  name="location" 
                  size={16} 
                  color={COLORS.white} 
                />
              </View>
              <View style={styles.markerBadge}>
                <Text style={styles.markerBadgeText}>{index + 1}</Text>
              </View>
              
              {/* Callout */}
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{serviceData.service.name}</Text>
                <Text style={styles.calloutProvider}>{serviceData.provider.name}</Text>
                <Text style={styles.calloutDistance}>
                  {formatDistance(serviceData.distance)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Position utilisateur */}
          <View style={styles.userLocation}>
            <View style={styles.userLocationDot} />
            <View style={styles.userLocationRing} />
          </View>
        </View>
      </View>

      {/* Bouton liste flottant */}
      <TouchableOpacity style={styles.listButton} onPress={onBackToList}>
        <Ionicons name="list" size={20} color={COLORS.white} />
        <Text style={styles.listButtonText}>Voir liste</Text>
      </TouchableOpacity>

      {/* Modal de détails du service */}
      <Modal
        visible={showServiceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowServiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedService && (
              <>
                <Image
                  source={{ uri: selectedService.service.image }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                <View style={styles.modalInfo}>
                  <Text style={styles.modalTitle}>{selectedService.service.name}</Text>
                  <Text style={styles.modalDescription}>
                    {selectedService.service.description}
                  </Text>
                  
                  <View style={styles.modalProvider}>
                    <Image
                      source={{ uri: selectedService.provider.avatar }}
                      style={styles.modalProviderAvatar}
                    />
                    <View style={styles.modalProviderInfo}>
                      <Text style={styles.modalProviderName}>
                        {selectedService.provider.name}
                      </Text>
                      <View style={styles.modalProviderRating}>
                        <Ionicons name="star" size={14} color={COLORS.warning} />
                        <Text style={styles.modalProviderRatingText}>
                          {selectedService.provider.rating}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.modalMeta}>
                    <View style={styles.modalMetaItem}>
                      <Ionicons name="location" size={16} color={COLORS.primary} />
                      <Text style={styles.modalMetaText}>
                        {formatDistance(selectedService.distance)}
                      </Text>
                    </View>
                    <View style={styles.modalMetaItem}>
                      <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                      <Text style={styles.modalMetaText}>
                        {selectedService.service.duration}min
                      </Text>
                    </View>
                    <View style={styles.modalMetaItem}>
                      <Ionicons name="card-outline" size={16} color={COLORS.primary} />
                      <Text style={styles.modalMetaText}>
                        {selectedService.service.price}€
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowServiceModal(false)}
                  >
                    <Text style={styles.modalCloseText}>Fermer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalSelectButton}
                    onPress={handleServiceSelect}
                  >
                    <Text style={styles.modalSelectText}>Voir prestataire</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    marginTop: 120,
    marginBottom: 100,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  streetGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  streetHorizontal: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#e0e0e0',
  },
  streetVertical: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#e0e0e0',
  },
  streetDiagonal1: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '50%',
    height: 2,
    backgroundColor: '#e0e0e0',
    transform: [{ rotate: '45deg' }],
    pointerEvents: 'none',
  },
  streetDiagonal2: {
    position: 'absolute',
    top: '75%',
    left: '25%',
    width: '50%',
    height: 2,
    backgroundColor: '#e0e0e0',
    transform: [{ rotate: '-45deg' }],
    pointerEvents: 'none',
  },
  park: {
    position: 'absolute',
    width: 60,
    height: 40,
    backgroundColor: '#90EE90',
    borderRadius: 20,
    opacity: 0.7,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  markerBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.warning,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  markerBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  callout: {
    position: 'absolute',
    top: 40,
    left: -50,
    width: 100,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 6,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  calloutProvider: {
    fontSize: 8,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 1,
  },
  calloutDistance: {
    fontSize: 8,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  userLocation: {
    position: 'absolute',
    bottom: 100,
    right: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userLocationRing: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    opacity: 0.3,
  },
  listButton: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.7,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalInfo: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  modalProvider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalProviderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modalProviderInfo: {
    flex: 1,
  },
  modalProviderName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  modalProviderRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalProviderRatingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  modalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalMetaText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 4,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
  },
  modalCloseButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  modalSelectButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  modalSelectText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default ServiceMap; 