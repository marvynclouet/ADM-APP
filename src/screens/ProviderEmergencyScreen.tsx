import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import EmergencyBadge from '../components/EmergencyBadge';

interface ProviderEmergencyScreenProps {
  navigation?: any;
}

const ProviderEmergencyScreen: React.FC<ProviderEmergencyScreenProps> = ({ navigation }) => {
  const [acceptsEmergency, setAcceptsEmergency] = useState(false);
  const [emergencyCredits, setEmergencyCredits] = useState(5);

  const handleToggleEmergency = (value: boolean) => {
    if (value && emergencyCredits === 0) {
      Alert.alert(
        'Crédits insuffisants',
        'Vous n\'avez plus de crédits urgence. Voulez-vous en acheter ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Acheter',
            onPress: () => {
              Alert.alert('Achat', 'Achat de crédits (simulation)');
              setEmergencyCredits(10);
              setAcceptsEmergency(true);
            },
          },
        ]
      );
    } else {
      setAcceptsEmergency(value);
    }
  };

  const handleBuyCredits = () => {
    Alert.alert(
      'Acheter des crédits urgence',
      'Pack de 10 crédits urgence : 15€\nPack de 25 crédits : 30€\nPack de 50 crédits : 50€',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Acheter 10 crédits',
          onPress: () => {
            setEmergencyCredits(emergencyCredits + 10);
            Alert.alert('Succès', '10 crédits ajoutés (simulation)');
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
          <Text style={styles.headerTitle}>Mode Urgence</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Status Card */}
      <View style={styles.statusSection}>
        <View style={styles.statusCard}>
          <EmergencyBadge size="large" />
          <Text style={styles.statusText}>
            {acceptsEmergency ? 'Vous acceptez les urgences' : 'Mode urgence désactivé'}
          </Text>
          <Text style={styles.statusDescription}>
            {acceptsEmergency
              ? 'Les clients peuvent vous contacter pour des réservations urgentes'
              : 'Activez le mode urgence pour accepter des réservations en urgence'}
          </Text>
        </View>
      </View>

      {/* Toggle */}
      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Accepter les réservations urgentes</Text>
            <Text style={styles.toggleDescription}>
              Permet aux clients de réserver en urgence (sous 24h)
            </Text>
          </View>
          <Switch
            value={acceptsEmergency}
            onValueChange={handleToggleEmergency}
            trackColor={{ false: COLORS.lightGray, true: COLORS.error }}
            thumbColor={acceptsEmergency ? COLORS.error : COLORS.white}
          />
        </View>
      </View>

      {/* Credits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Crédits Urgence</Text>
        <View style={styles.creditsCard}>
          <View style={styles.creditsHeader}>
            <Ionicons name="flash" size={32} color={COLORS.error} />
            <Text style={styles.creditsAmount}>{emergencyCredits}</Text>
            <Text style={styles.creditsLabel}>crédits disponibles</Text>
          </View>
          <Text style={styles.creditsDescription}>
            Chaque réservation urgente acceptée consomme 1 crédit
          </Text>
          <TouchableOpacity style={styles.buyButton} onPress={handleBuyCredits}>
            <Ionicons name="add-circle" size={20} color={COLORS.primary} />
            <Text style={styles.buyButtonText}>Acheter des crédits</Text>
          </TouchableOpacity>
        </View>
      </View>

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
            desc: 'Tarifs majorés de 20% pour les réservations urgentes',
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
          Le système de paiement réel sera intégré dans une prochaine version
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
});

export default ProviderEmergencyScreen;




