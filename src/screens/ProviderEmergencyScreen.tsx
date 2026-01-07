import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import EmergencyBadge from '../components/EmergencyBadge';
import { AuthService } from '../../backend/services/auth.service';
import { PremiumService } from '../../backend/services/premium.service';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';

interface ProviderEmergencyScreenProps {
  navigation?: any;
}

const ProviderEmergencyScreen: React.FC<ProviderEmergencyScreenProps> = ({ navigation }) => {
  const [acceptsEmergency, setAcceptsEmergency] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showSuccess, showError } = useToast();

  // Charger le statut premium et urgence
  const loadEmergencyStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const user = await AuthService.getCurrentUser();
      if (!user || !user.is_provider || !user.id) {
        Alert.alert('Erreur', 'Vous n\'êtes pas un prestataire');
        navigation?.goBack();
        return;
      }

      const premiumInfo = await PremiumService.getProviderPremiumInfo(user.id);
      setIsPremium(premiumInfo.isPremium);
      setAcceptsEmergency(premiumInfo.acceptsEmergency);
    } catch (error: any) {
      console.error('Erreur lors du chargement du statut urgence:', error);
      showError('Erreur lors du chargement du statut urgence');
    } finally {
      setIsLoading(false);
    }
  }, [navigation, showError]);

  useFocusEffect(
    useCallback(() => {
      loadEmergencyStatus();
    }, [loadEmergencyStatus])
  );

  useEffect(() => {
    loadEmergencyStatus();
  }, [loadEmergencyStatus]);

  const handleToggleEmergency = async (value: boolean) => {
    if (!isPremium) {
      Alert.alert(
        'Premium requis',
        'Vous devez être premium pour accepter les réservations urgentes.\n\nVoulez-vous activer le premium maintenant ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Activer Premium',
            onPress: () => {
              navigation?.navigate('ProviderPremium');
            },
          },
        ]
      );
      return;
    }

    try {
      setIsProcessing(true);
      const user = await AuthService.getCurrentUser();
      if (!user || !user.id) {
        showError('Utilisateur non connecté');
        return;
      }

      if (value) {
        await PremiumService.activateEmergency(user.id);
        setAcceptsEmergency(true);
        showSuccess('Réservations urgentes activées !');
      } else {
        await PremiumService.deactivateEmergency(user.id);
        setAcceptsEmergency(false);
        showSuccess('Réservations urgentes désactivées');
      }
      await loadEmergencyStatus();
    } catch (error: any) {
      console.error('Erreur toggle emergency:', error);
      showError(error.message || 'Erreur lors de la modification');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement..." />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mode Urgence</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Status Card */}
      <View style={styles.statusSection}>
        <View style={styles.statusCard}>
          <EmergencyBadge size="large" />
          {!isPremium && (
            <View style={styles.premiumRequiredBanner}>
              <Ionicons name="lock-closed" size={20} color={COLORS.warning} />
              <Text style={styles.premiumRequiredText}>
                Premium requis pour activer les réservations urgentes
              </Text>
            </View>
          )}
          <Text style={styles.statusText}>
            {acceptsEmergency ? 'Vous acceptez les urgences' : 'Mode urgence désactivé'}
          </Text>
          <Text style={styles.statusDescription}>
            {acceptsEmergency
              ? 'Les clients peuvent réserver en urgence avec une majoration de 20-30%'
              : isPremium
              ? 'Activez le mode urgence pour accepter des réservations urgentes'
              : 'Activez Premium pour débloquer les réservations urgentes'}
          </Text>
        </View>
      </View>

      {/* Toggle */}
      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Accepter les réservations urgentes</Text>
            <Text style={styles.toggleDescription}>
              {isPremium 
                ? 'Permet aux clients de réserver en urgence (même jour) avec majoration de 20-30%'
                : 'Premium requis : Activez Premium pour débloquer cette fonctionnalité'}
            </Text>
          </View>
          <Switch
            value={acceptsEmergency}
            onValueChange={handleToggleEmergency}
            disabled={!isPremium || isProcessing}
            trackColor={{ false: COLORS.lightGray, true: COLORS.error }}
            thumbColor={acceptsEmergency ? COLORS.error : COLORS.white}
          />
        </View>
        {!isPremium && (
          <TouchableOpacity
            style={styles.activatePremiumButton}
            onPress={() => navigation?.navigate('ProviderPremium')}
          >
            <Ionicons name="star" size={20} color={COLORS.white} />
            <Text style={styles.activatePremiumText}>Activer Premium</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info Premium */}
      {!isPremium && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pourquoi Premium ?</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Les réservations urgentes sont une fonctionnalité exclusive Premium car elles nécessitent une disponibilité immédiate et une flexibilité accrue.
            </Text>
            <Text style={styles.infoText}>
              En contrepartie, vous bénéficiez d'une majoration de 20-30% sur chaque réservation urgente.
            </Text>
            <TouchableOpacity
              style={styles.activatePremiumButton}
              onPress={() => navigation?.navigate('ProviderPremium')}
            >
              <Ionicons name="star" size={20} color={COLORS.white} />
              <Text style={styles.activatePremiumText}>Activer Premium (Gratuit en phase test)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
        {[
          {
            step: '1',
            title: 'Activation',
            desc: 'Activez le mode urgence pour apparaître dans les résultats urgents',
          },
          {
            step: '2',
            title: 'Réservations',
            desc: 'Recevez des demandes de réservation urgentes de clients',
          },
          {
            step: '3',
            title: 'Acceptation',
            desc: 'Acceptez ou refusez selon votre disponibilité (1 crédit par acceptation)',
          },
          {
            step: '4',
            title: 'Gains',
            desc: 'Tarifs majorés de 20-30% pour les réservations urgentes',
          },
        ].map((item, index) => (
          <View key={index} style={styles.infoItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepText}>{item.step}</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{item.title}</Text>
              <Text style={styles.infoDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Note */}
      <View style={styles.noteSection}>
        <Ionicons name="information-circle" size={20} color={COLORS.textSecondary} />
        <Text style={styles.noteText}>
          Phase de test : Premium gratuit. Les réservations urgentes permettent aux clients de réserver pour le même jour avec une majoration de 20-30%.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
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
  placeholder: {
    width: 40,
  },
  statusSection: {
    padding: 16,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  creditsCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  creditsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  creditsAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.error,
  },
  creditsLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  creditsDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  buyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  noteSection: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
    gap: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  premiumRequiredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  premiumRequiredText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '600',
  },
  activatePremiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warning,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  activatePremiumText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
});

export default ProviderEmergencyScreen;




