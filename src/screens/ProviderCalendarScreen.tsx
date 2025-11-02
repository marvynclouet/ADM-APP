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
import { COLORS } from '../constants/colors';

const screenWidth = Dimensions.get('window').width;

interface ProviderCalendarScreenProps {
  navigation?: any;
}

interface Booking {
  id: string;
  clientName: string;
  service: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const ProviderCalendarScreen: React.FC<ProviderCalendarScreenProps> = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const today = new Date();
  const currentWeek = getWeekDates(currentDate);
  const currentMonth = getMonthDates(currentDate);

  // Mock bookings
  const bookings: Booking[] = [
    {
      id: '1',
      clientName: 'Marie Dupont',
      service: 'Coiffure',
      time: '10:00',
      duration: 60,
      status: 'confirmed',
    },
    {
      id: '2',
      clientName: 'Jean Martin',
      service: 'Massage',
      time: '14:00',
      duration: 90,
      status: 'pending',
    },
    {
      id: '3',
      clientName: 'Sophie Bernard',
      service: 'Manucure',
      time: '16:00',
      duration: 45,
      status: 'confirmed',
    },
  ];

  function getWeekDates(date: Date) {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  }

  function getMonthDates(date: Date) {
    const month = [];
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      month.push(day);
    }
    return month;
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getBookingsForDate = (date: Date) => {
    // Mock - en réalité, filtrer par date
    return bookings.filter(() => Math.random() > 0.5);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const renderWeekView = () => {
    return (
      <View style={styles.weekContainer}>
        <View style={styles.weekHeader}>
          {currentWeek.map((day, index) => {
            const dayBookings = getBookingsForDate(day);
            return (
              <View key={index} style={styles.weekDay}>
                <Text style={[styles.weekDayName, isToday(day) && styles.weekDayNameToday]}>
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][day.getDay()]}
                </Text>
                <Text style={[styles.weekDayNumber, isToday(day) && styles.weekDayNumberToday]}>
                  {day.getDate()}
                </Text>
                {dayBookings.length > 0 && (
                  <View style={styles.bookingIndicator}>
                    <Text style={styles.bookingIndicatorText}>{dayBookings.length}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Timeline */}
        <ScrollView style={styles.timelineContainer}>
          {Array.from({ length: 24 }, (_, hour) => (
            <View key={hour} style={styles.timelineRow}>
              <Text style={styles.timelineHour}>{String(hour).padStart(2, '0')}:00</Text>
              <View style={styles.timelineSlots}>
                {currentWeek.map((day, dayIndex) => {
                  const dayBookings = getBookingsForDate(day);
                  const hourBooking = dayBookings.find(
                    b => parseInt(b.time.split(':')[0]) === hour
                  );
                  if (hourBooking) {
                    return (
                      <TouchableOpacity
                        key={dayIndex}
                        style={[
                          styles.bookingSlot,
                          {
                            backgroundColor:
                              hourBooking.status === 'confirmed'
                                ? COLORS.primary
                                : hourBooking.status === 'pending'
                                ? COLORS.warning
                                : COLORS.error,
                          },
                        ]}
                      >
                        <Text style={styles.bookingSlotText} numberOfLines={2}>
                          {hourBooking.service}
                        </Text>
                        <Text style={styles.bookingSlotTime}>{hourBooking.time}</Text>
                      </TouchableOpacity>
                    );
                  }
                  return <View key={dayIndex} style={styles.emptySlot} />;
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderMonthView = () => {
    const monthDates = currentMonth;
    const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    return (
      <View style={styles.monthContainer}>
        <View style={styles.monthHeader}>
          {weekDays.map(day => (
            <Text key={day} style={styles.monthHeaderDay}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.monthGrid}>
          {monthDates.map((date, index) => {
            const dayBookings = getBookingsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.monthDay,
                  !isCurrentMonthDay && styles.monthDayOtherMonth,
                  isTodayDate && styles.monthDayToday,
                ]}
              >
                <Text
                  style={[
                    styles.monthDayNumber,
                    !isCurrentMonthDay && styles.monthDayNumberOtherMonth,
                    isTodayDate && styles.monthDayNumberToday,
                  ]}
                >
                  {date.getDate()}
                </Text>
                {dayBookings.length > 0 && (
                  <View style={styles.monthBookingIndicator}>
                    <Text style={styles.monthBookingIndicatorText}>{dayBookings.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
          <Text style={styles.headerTitle}>Planning</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* View Mode Selector */}
      <View style={styles.viewModeSelector}>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'week' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('week')}
        >
          <Text
            style={[styles.viewModeText, viewMode === 'week' && styles.viewModeTextActive]}
          >
            Semaine
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'month' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('month')}
        >
          <Text
            style={[styles.viewModeText, viewMode === 'month' && styles.viewModeTextActive]}
          >
            Mois
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Navigation */}
      <View style={styles.dateNavigation}>
        <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {viewMode === 'week'
            ? `${currentWeek[0].toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
              })} - ${currentWeek[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
            : currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentDate(new Date())}
          style={styles.todayButton}
        >
          <Text style={styles.todayButtonText}>Aujourd'hui</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar View */}
      <ScrollView style={styles.calendarContent} showsVerticalScrollIndicator={false}>
        {viewMode === 'week' ? renderWeekView() : renderMonthView()}
      </ScrollView>
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
  placeholder: {
    width: 40,
  },
  viewModeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    gap: 16,
  },
  viewModeButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  viewModeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  viewModeTextActive: {
    color: COLORS.white,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  navButton: {
    padding: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  todayButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  calendarContent: {
    flex: 1,
  },
  weekContainer: {
    backgroundColor: COLORS.white,
  },
  weekHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  weekDayNameToday: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  weekDayNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  weekDayNumberToday: {
    color: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
    borderRadius: 20,
    width: 32,
    height: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  bookingIndicator: {
    marginTop: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bookingIndicatorText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timelineContainer: {
    flex: 1,
  },
  timelineRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    minHeight: 80,
  },
  timelineHour: {
    width: 50,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  timelineSlots: {
    flex: 1,
    flexDirection: 'row',
  },
  bookingSlot: {
    flex: 1,
    margin: 2,
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  bookingSlotText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  bookingSlotTime: {
    color: COLORS.white,
    fontSize: 10,
    opacity: 0.9,
  },
  emptySlot: {
    flex: 1,
    margin: 2,
  },
  monthContainer: {
    backgroundColor: COLORS.white,
  },
  monthHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  monthHeaderDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthDay: {
    width: screenWidth / 7,
    aspectRatio: 1,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthDayOtherMonth: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.3,
  },
  monthDayToday: {
    backgroundColor: COLORS.primary + '20',
  },
  monthDayNumber: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  monthDayNumberOtherMonth: {
    color: COLORS.textSecondary,
  },
  monthDayNumberToday: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  monthBookingIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  monthBookingIndicatorText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export default ProviderCalendarScreen;
