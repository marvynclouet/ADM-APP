import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import PremiumBadge from '../components/PremiumBadge';
import { AuthService } from '../../backend/services/auth.service';
import { PremiumService } from '../../backend/services/premium.service';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';

interface ProviderPremiumScreenProps {
  navigation?: any;
}

const ProviderPremiumScreen: React.FC<ProviderPremiumScreenProps> = ({ navigation }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showSuccess, showError } = useToast();

  // Charger le statut premium
  const loadPremiumStatus = useCallback(async () => {
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
    } catch (error: any) {
      console.error('Erreur lors du chargement du statut premium:', error);
      showError('Erreur lors du chargement du statut premium');
    } finally {
      setIsLoading(false);
    }
  }, [navigation, showError]);

  useFocusEffect(
    useCallback(() => {
      loadPremiumStatus();
    }, [loadPremiumStatus])
  );

  useEffect(() => {
    loadPremiumStatus();
  }, [loadPremiumStatus]);

  const handleSubscribe = async () => {
    Alert.alert(
      'Abonnement Premium',
      'Voulez-vous activer l\'abonnement Premium ?\n\n⚠️ Phase de test : Gratuit pour le moment\n\nBénéfices:\n• Mise en avant dans les résultats\n• Badge Premium visible\n• Réservations urgentes disponibles\n• Statistiques avancées\n• Support prioritaire',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Activer (Gratuit)',
          onPress: async () => {
            try {
              setIsProcessing(true);
              const user = await AuthService.getCurrentUser();
              if (!user || !user.id) {
                showError('Utilisateur non connecté');
                return;
              }

              await PremiumService.activatePremium(user.id);
              setIsPremium(true);
              showSuccess('Abonnement Premium activé avec succès !');
              await loadPremiumStatus();
            } catch (error: any) {
              console.error('Erreur activation premium:', error);
              showError(error.message || 'Erreur lors de l\'activation du premium');
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleUnsubscribe = async () => {
    Alert.alert(
      'Désabonnement',
      'Voulez-vous désactiver votre abonnement Premium ?\n\nLes réservations urgentes seront également désactivées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Désactiver',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsProcessing(true);
              const user = await AuthService.getCurrentUser();
              if (!user || !user.id) {
                showError('Utilisateur non connecté');
                return;
              }

              await PremiumService.deactivatePremium(user.id);
              setIsPremium(false);
              showSuccess('Abonnement Premium désactivé');
              await loadPremiumStatus();
            } catch (error: any) {
              console.error('Erreur désactivation premium:', error);
              showError(error.message || 'Erreur lors de la désactivation du premium');
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
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
          <Text style={styles.headerTitle}>Premium</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Premium Status */}
      <View style={styles.statusSection}>
        <View style={styles.statusCard}>
          <PremiumBadge size="large" />
          <Text style={styles.statusText}>
            {isPremium ? 'Votre compte est Premium' : 'Passez à Premium'}
          </Text>
          <Text style={styles.statusDescription}>
            {isPremium
              ? 'Profitez de tous les avantages Premium'
              : 'Débloquez des fonctionnalités exclusives'}
          </Text>
        </View>
      </View>

      {/* Benefits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avantages Premium</Text>
        {[
          { icon: 'star', title: 'Mise en avant', desc: 'Votre profil apparaît en premier dans les résultats' },
          { icon: 'trophy', title: 'Badge Premium', desc: 'Badge visible sur votre profil' },
          { icon: 'flash', title: 'Réservations urgentes', desc: 'Acceptez les réservations urgentes avec majoration de 20-30%' },
          { icon: 'stats-chart', title: 'Statistiques avancées', desc: 'Analyses détaillées de vos performances' },
          { icon: 'headset', title: 'Support prioritaire', desc: 'Assistance client en priorité' },
          { icon: 'trending-up', title: 'Plus de visibilité', desc: 'Augmentation de 40% des réservations' },
        ].map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name={benefit.icon as any} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitDesc}>{benefit.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Pricing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tarification</Text>
        <View style={styles.pricingCard}>
          <View style={styles.testBadge}>
            <Text style={styles.testBadgeText}>PHASE DE TEST</Text>
          </View>
          <Text style={styles.pricingAmount}>GRATUIT</Text>
          <Text style={styles.pricingPeriod}>pour le moment</Text>
          <Text style={styles.pricingNote}>
            Le paiement sera intégré dans une prochaine version
          </Text>
          <View style={styles.futurePricing}>
            <Text style={styles.futurePricingTitle}>Tarification future :</Text>
            <Text style={styles.futurePricingText}>29,90€ par mois</Text>
            <Text style={styles.futurePricingText}>299€ par an (2 mois gratuits)</Text>
          </View>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.actionSection}>
        {isPremium ? (
          <TouchableOpacity 
            style={[styles.unsubscribeButton, isProcessing && styles.buttonDisabled]} 
            onPress={handleUnsubscribe}
            disabled={isProcessing}
          >
            <Text style={styles.unsubscribeButtonText}>
              {isProcessing ? 'Désactivation...' : 'Désactiver Premium'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.subscribeButton, isProcessing && styles.buttonDisabled]} 
            onPress={handleSubscribe}
            disabled={isProcessing}
          >
            <LinearGradient
              colors={[COLORS.warning, '#FF8C00']}
              style={styles.subscribeButtonGradient}
            >
              <Ionicons name="star" size={20} color={COLORS.white} />
              <Text style={styles.subscribeButtonText}>
                {isProcessing ? 'Activation...' : 'Activer Premium (Gratuit)'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        <Text style={styles.noteText}>
          ⚠️ Phase de test : Premium gratuit pour tous les prestataires
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
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  pricingCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  pricingAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  pricingPeriod: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  pricingNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  actionSection: {
    padding: 16,
    paddingBottom: 32,
  },
  subscribeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  subscribeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  subscribeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  unsubscribeButton: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  unsubscribeButtonText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  noteText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  testBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  testBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  futurePricing: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    width: '100%',
  },
  futurePricingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  futurePricingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default ProviderPremiumScreen;




