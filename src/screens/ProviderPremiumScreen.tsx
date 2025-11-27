import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import PremiumBadge from '../components/PremiumBadge';

interface ProviderPremiumScreenProps {
  navigation?: any;
}

const ProviderPremiumScreen: React.FC<ProviderPremiumScreenProps> = ({ navigation }) => {
  const [isPremium, setIsPremium] = useState(false);

  const handleSubscribe = () => {
    Alert.alert(
      'Abonnement Premium',
      'Voulez-vous activer l\'abonnement Premium ?\n\nBénéfices:\n• Mise en avant dans les résultats\n• Badge Premium visible\n• Statistiques avancées\n• Support prioritaire',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Activer',
          onPress: () => {
            setIsPremium(true);
            Alert.alert('Succès', 'Abonnement Premium activé !');
          },
        },
      ]
    );
  };

  const handleUnsubscribe = () => {
    Alert.alert(
      'Désabonnement',
      'Voulez-vous désactiver votre abonnement Premium ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Désactiver',
          style: 'destructive',
          onPress: () => {
            setIsPremium(false);
            Alert.alert('Succès', 'Abonnement Premium désactivé');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          <Text style={styles.pricingAmount}>29,90€</Text>
          <Text style={styles.pricingPeriod}>par mois</Text>
          <Text style={styles.pricingNote}>
            Paiement annuel : 299€/an (soit 2 mois gratuits)
          </Text>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.actionSection}>
        {isPremium ? (
          <TouchableOpacity style={styles.unsubscribeButton} onPress={handleUnsubscribe}>
            <Text style={styles.unsubscribeButtonText}>Désactiver Premium</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <LinearGradient
              colors={[COLORS.warning, '#FF8C00']}
              style={styles.subscribeButtonGradient}
            >
              <Ionicons name="star" size={20} color={COLORS.white} />
              <Text style={styles.subscribeButtonText}>Activer Premium</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        <Text style={styles.noteText}>
          Note: Le paiement réel sera intégré dans une prochaine version
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
});

export default ProviderPremiumScreen;




