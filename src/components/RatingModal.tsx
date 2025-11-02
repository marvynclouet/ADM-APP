import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../hooks/useToast';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
  providerName: string;
  serviceName: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  onSubmit,
  providerName,
  serviceName,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const { showSuccess } = useToast();

  const handleStarPress = (star: number) => {
    setRating(star);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner une note');
      return;
    }

    onSubmit(rating, review);
    showSuccess('Avis envoyé avec succès !');
    onClose();
    
    // Reset form
    setRating(0);
    setReview('');
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isActive = starNumber <= rating || starNumber <= hoveredStar;
      
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleStarPress(starNumber)}
          onPressIn={() => setHoveredStar(starNumber)}
          onPressOut={() => setHoveredStar(0)}
          style={styles.starContainer}
        >
          <Ionicons
            name={isActive ? 'star' : 'star-outline'}
            size={40}
            color={isActive ? '#FFD700' : '#E0E0E0'}
          />
        </TouchableOpacity>
      );
    });
  };

  const getRatingText = () => {
    switch (rating) {
      case 1: return 'Très décevant';
      case 2: return 'Décevant';
      case 3: return 'Correct';
      case 4: return 'Bien';
      case 5: return 'Excellent';
      default: return 'Sélectionnez une note';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Noter votre expérience</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Provider Info */}
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{providerName}</Text>
              <Text style={styles.serviceName}>{serviceName}</Text>
            </View>

            {/* Rating Section */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Votre note</Text>
              <View style={styles.starsContainer}>
                {renderStars()}
              </View>
              <Text style={styles.ratingText}>{getRatingText()}</Text>
            </View>

            {/* Review Section */}
            <View style={styles.reviewSection}>
              <Text style={styles.reviewLabel}>Votre avis (optionnel)</Text>
              <TextInput
                style={styles.reviewInput}
                placeholder="Partagez votre expérience..."
                value={review}
                onChangeText={setReview}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {review.length}/500 caractères
              </Text>
            </View>

            {/* Quick Review Options */}
            <View style={styles.quickOptions}>
              <Text style={styles.quickOptionsLabel}>Avis rapide :</Text>
              <View style={styles.quickButtons}>
                {[
                  'Très professionnel',
                  'Service impeccable',
                  'Je recommande',
                  'À améliorer',
                ].map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickButton}
                    onPress={() => setReview(prev => 
                      prev ? `${prev}, ${option}` : option
                    )}
                  >
                    <Text style={styles.quickButtonText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.submitSection}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  rating === 0 && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={rating === 0}
              >
                <Ionicons 
                  name="checkmark-circle" 
                  size={20} 
                  color="white" 
                  style={styles.submitIcon}
                />
                <Text style={styles.submitText}>Envoyer l'avis</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  providerInfo: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: '#666',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  starContainer: {
    padding: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  reviewSection: {
    marginBottom: 20,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  quickOptions: {
    marginBottom: 20,
  },
  quickOptionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickButtonText: {
    fontSize: 12,
    color: '#666',
  },
  submitSection: {
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RatingModal;


