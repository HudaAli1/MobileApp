import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/EmptyState';
import SectionTitle from '../../components/SectionTitle';
import { useAppContext } from '../../context/AppContext';
import { fetchSaudiPublicHolidays } from '../../services/api/holidayApi';
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
  const [holidays, setHolidays] = useState([]);
  const [loadingHolidays, setLoadingHolidays] = useState(true);
  const [holidayError, setHolidayError] = useState('');
  const [fallbackUsed, setFallbackUsed] = useState(false);

  const loadHolidays = async () => {
    setLoadingHolidays(true);
    setHolidayError('');
    const result = await fetchSaudiPublicHolidays(2026);
    setHolidays(result.holidays);
    setFallbackUsed(result.fallbackUsed);
    if (result.fallbackUsed) {
      setHolidayError('تم عرض العطل الرسمية المحفوظة محليًا بسبب تعذر الاتصال بالخدمة.');
    }
    setLoadingHolidays(false);
  };

  useEffect(() => {
    void loadHolidays();
  }, []);

  const selectedEvents = useMemo(() => getEventsForDate(events, selectedDate), [events, selectedDate]);
  const selectedHolidays = useMemo(
    () => holidays.filter((holiday) => holiday.date === selectedDate),
    [holidays, selectedDate],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AppHeader title="Calendar" subtitle="April 2026" />

        <View style={styles.calendarCard}>
          <View style={styles.weekRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={`weekday-${index}-${day}`} style={styles.weekday}>{day}</Text>
            ))}
          </View>
          <View style={styles.grid}>
            {calendarDays.map((date) => {
              const number = date.split('-')[2];
              const hasEvent = events.some((event) => event.fullDate === date);
              const hasHoliday = holidays.some((holiday) => holiday.date === date);
              const selected = selectedDate === date;
              return (
                <TouchableOpacity
                  key={date}
                  onPress={() => setSelectedDate(date)}
                  style={[styles.dayCell, selected && styles.selectedDay]}
                >
                  <Text style={[styles.dayText, selected && styles.selectedDayText]}>{String(Number(number))}</Text>
                  {hasEvent ? <View style={[styles.dot, selected && styles.selectedDot]} /> : null}
                  {hasHoliday ? <View style={[styles.holidayDot, selected && styles.selectedHolidayDot]} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View>
          <SectionTitle title="فعاليات الكلية في اليوم المحدد" />
          <View style={styles.list}>
            {selectedEvents.length ? (
              selectedEvents.map((event, index) => (
                <EventCard
                  key={`calendar-event-${event.id ?? index}`}
                  event={event}
                  onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
                />
              ))
            ) : (
              <EmptyState title="لا توجد فعاليات في هذا اليوم" description="اختاري يومًا آخر لعرض فعاليات الكلية." />
            )}
          </View>
        </View>

        <View>
          <SectionTitle title="العطل الرسمية" />
          {loadingHolidays ? <Text style={styles.statusText}>جاري تحميل العطل الرسمية...</Text> : null}
          {holidayError ? (
            <TouchableOpacity onPress={() => void loadHolidays()}>
              <Text style={styles.errorText}>{holidayError}</Text>
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </TouchableOpacity>
          ) : null}
          <View style={styles.list}>
            {selectedHolidays.length ? (
              selectedHolidays.map((holiday) => (
                <View key={holiday.id} style={styles.holidayCard}>
                  <Text style={styles.holidayLabel}>إجازة رسمية</Text>
                  <Text style={styles.holidayTitle}>{holiday.localName || holiday.name}</Text>
                  <Text style={styles.holidayDate}>{holiday.date}</Text>
                </View>
              ))
            ) : !loadingHolidays && !selectedHolidays.length ? (
              <EmptyState title="لا توجد عطلة رسمية في هذا اليوم" description="ستظهر العطل الرسمية السعودية هنا عند توافق التاريخ." />
            ) : null}
          </View>
          {fallbackUsed ? <Text style={styles.noteText}>يتم الآن عرض نسخة محلية احتياطية من العطل الرسمية.</Text> : null}
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
  holidayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.danger,
    marginTop: 3,
  },
  selectedDot: {
    backgroundColor: colors.surface,
  },
  selectedHolidayDot: {
    backgroundColor: '#FFD8D8',
  },
  list: {
    gap: spacing.md,
  },
  statusText: {
    ...typography.body,
    color: colors.secondary,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
  },
  retryText: {
    ...typography.label,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  noteText: {
    ...typography.caption,
    color: colors.muted,
  },
  holidayCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  holidayLabel: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '700',
  },
  holidayTitle: {
    ...typography.cardTitle,
  },
  holidayDate: {
    ...typography.caption,
    color: colors.muted,
  },
});
