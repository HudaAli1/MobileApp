import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/EmptyState';
import SectionTitle from '../../components/SectionTitle';
import { useAppContext } from '../../context/AppContext';
import { getEventsForDate } from '../../utils/eventHelpers';
import { colors } from '../../constants/colors';
import { radii, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const calendarDays = [
  '2026-04-01', '2026-04-02', '2026-04-03', '2026-04-04', '2026-04-05', '2026-04-06', '2026-04-07',
  '2026-04-08', '2026-04-09', '2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13', '2026-04-14',
  '2026-04-15', '2026-04-16', '2026-04-17', '2026-04-18', '2026-04-19', '2026-04-20', '2026-04-21',
  '2026-04-22', '2026-04-23', '2026-04-24', '2026-04-25', '2026-04-26', '2026-04-27', '2026-04-28',
  '2026-04-29', '2026-04-30',
];

export default function CalendarScreen({ navigation }) {
  const { events } = useAppContext();
  const [selectedDate, setSelectedDate] = useState('2026-04-24');

  const selectedEvents = useMemo(() => getEventsForDate(events, selectedDate), [events, selectedDate]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AppHeader title="Calendar" subtitle="April 2026" />

        <View style={styles.calendarCard}>
          <View style={styles.weekRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <Text key={day} style={styles.weekday}>{day}</Text>
            ))}
          </View>
          <View style={styles.grid}>
            {calendarDays.map((date) => {
              const number = date.split('-')[2];
              const hasEvent = events.some((event) => event.fullDate === date);
              const selected = selectedDate === date;
              return (
                <TouchableOpacity
                  key={date}
                  onPress={() => setSelectedDate(date)}
                  style={[styles.dayCell, selected && styles.selectedDay]}
                >
                  <Text style={[styles.dayText, selected && styles.selectedDayText]}>{String(Number(number))}</Text>
                  {hasEvent ? <View style={[styles.dot, selected && styles.selectedDot]} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View>
          <SectionTitle title="Events on Selected Date" />
          <View style={styles.list}>
            {selectedEvents.length ? (
              selectedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
                />
              ))
            ) : (
              <EmptyState title="No events on this date" description="Choose another day to see scheduled campus activities." />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  weekday: {
    width: '14.2%',
    textAlign: 'center',
    color: colors.muted,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.2%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    marginVertical: 4,
  },
  selectedDay: {
    backgroundColor: colors.primary,
  },
  dayText: {
    color: colors.text,
    fontWeight: '600',
  },
  selectedDayText: {
    color: colors.surface,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 4,
  },
  selectedDot: {
    backgroundColor: colors.surface,
  },
  list: {
    gap: spacing.md,
  },
});
