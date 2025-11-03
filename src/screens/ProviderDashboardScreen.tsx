import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { COLORS } from '../constants/colors';

const screenWidth = Dimensions.get('window').width;

interface ProviderDashboardScreenProps {
  navigation?: any;
}

const ProviderDashboardScreen: React.FC<ProviderDashboardScreenProps> = ({
  navigation,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Données de revenus (mock)
  const revenueData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        data: [320, 450, 280, 510, 380, 420, 490],
        color: (opacity = 1) => COLORS.primary,
        strokeWidth: 2,
      },
    ],
  };

  const monthlyRevenueData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        data: [2400, 2800, 3200, 2840, 3100, 3500],
      },
    ],
  };

  const bookingStats = {
    labels: ['Confirmées', 'En attente', 'Annulées'],
    data: [65, 25, 10],
    colors: [COLORS.success, COLORS.warning, COLORS.error],
  };

  // Statistiques détaillées
  const stats = {
    totalBookings: 156,
    completedBookings: 142,
    pendingBookings: 3,
    cancelledBookings: 11,
    acceptanceRate: 87.5,
    averageBookingValue: 65,
    averageServiceTime: 75, // minutes
    monthlyEarnings: 2840,
    weeklyEarnings: 740,
    topService: 'Coiffure & Brushing',
  };

  const chartConfig = {
    backgroundColor: COLORS.white,
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.primary,
    },
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tableau de bord</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Période sélectionnée */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'week' && styles.periodTextActive]}>
            Semaine
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'month' && styles.periodTextActive]}>
            Mois
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'year' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('year')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'year' && styles.periodTextActive]}>
            Année
          </Text>
        </TouchableOpacity>
      </View>

      {/* Statistiques principales */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>{stats.totalBookings}</Text>
          <Text style={styles.statLabel}>Réservations totales</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
          <Text style={styles.statNumber}>{stats.completedBookings}</Text>
          <Text style={styles.statLabel}>Terminées</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color={COLORS.warning} />
          <Text style={styles.statNumber}>{stats.pendingBookings}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="close-circle" size={24} color={COLORS.error} />
          <Text style={styles.statNumber}>{stats.cancelledBookings}</Text>
          <Text style={styles.statLabel}>Annulées</Text>
        </View>
      </View>

      {/* Revenus */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Revenus</Text>
          <Text style={styles.earningsAmount}>
            {selectedPeriod === 'week' ? `€${stats.weeklyEarnings}` : `€${stats.monthlyEarnings}`}
          </Text>
        </View>
        <View style={styles.chartContainer}>
          <LineChart
            data={selectedPeriod === 'week' ? revenueData : monthlyRevenueData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLabels={true}
            withHorizontalLabels={true}
          />
        </View>
      </View>

      {/* Répartition des réservations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Répartition des réservations</Text>
        <View style={styles.chartContainer}>
          <PieChart
            data={bookingStats.labels.map((label, index) => ({
              name: label,
              population: bookingStats.data[index],
              color: bookingStats.colors[index],
              legendFontColor: COLORS.textPrimary,
              legendFontSize: 14,
            }))}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>
      </View>

      {/* Statistiques détaillées */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Indicateurs de performance</Text>
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Ionicons name="trending-up" size={20} color={COLORS.success} />
            <Text style={styles.metricValue}>{stats.acceptanceRate}%</Text>
            <Text style={styles.metricLabel}>Taux d'acceptation</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons name="cash" size={20} color={COLORS.primary} />
            <Text style={styles.metricValue}>€{stats.averageBookingValue}</Text>
            <Text style={styles.metricLabel}>Prix moyen</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons name="time-outline" size={20} color={COLORS.accent} />
            <Text style={styles.metricValue}>{stats.averageServiceTime}min</Text>
            <Text style={styles.metricLabel}>Durée moyenne</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons name="star" size={20} color={COLORS.warning} />
            <Text style={styles.metricValue}>{stats.topService}</Text>
            <Text style={styles.metricLabel}>Service le plus demandé</Text>
          </View>
        </View>
      </View>

      {/* Graphique des revenus par mois */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Évolution mensuelle</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={monthlyRevenueData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            style={styles.chart}
            showValuesOnTopOfBars
            withInnerLines={false}
          />
        </View>
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
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  periodTextActive: {
    color: COLORS.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: '1%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  chart: {
    borderRadius: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: '1%',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ProviderDashboardScreen;

