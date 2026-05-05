import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/EmptyState';
import SectionTitle from '../../components/SectionTitle';
import { colors } from '../../constants/colors';
import { radii, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useAppContext } from '../../context/AppContext';
import { fetchSaudiPublicHolidays } from '../../services/api/holidayApi';
import { getEventsForDate } from '../../utils/eventHelpers';

function formatMonthTitle(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatIsoDate(isoDate) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${isoDate}T12:00:00`));
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function buildCalendarDays(displayedMonth) {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const leadingBlankCount = firstDay.getDay();

  const blanks = Array.from({ length: leadingBlankCount }, (_, index) => ({
    key: `blank-${index}`,
    type: 'blank',
  }));

  const days = Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(year, month, index + 1);
    return {
      key: toIsoDate(date),
      type: 'day',
      isoDate: toIsoDate(date),
      dayNumber: index + 1,
    };
  });

  return [...blanks, ...days];
}

export default function CalendarScreen({ navigation }) {
  const { events } = useAppContext();
  const today = useMemo(() => new Date(), []);
  const [displayedMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toIsoDate(today));
  const [holidays, setHolidays] = useState([]);
  const [loadingHolidays, setLoadingHolidays] = useState(true);
  const [holidayError, setHolidayError] = useState('');
  const [fallbackUsed, setFallbackUsed] = useState(false);

  const monthTitle = useMemo(() => formatMonthTitle(displayedMonth), [displayedMonth]);
  const calendarDays = useMemo(() => buildCalendarDays(displayedMonth), [displayedMonth]);

  const loadHolidays = async () => {
    setLoadingHolidays(true);
    setHolidayError('');

    const result = await fetchSaudiPublicHolidays(displayedMonth.getFullYear());
    setHolidays(result.holidays);
    setFallbackUsed(result.fallbackUsed);

    if (result.fallbackUsed) {
      console.warn('Holiday API fallback used:', result.error);
      setHolidayError('تعذر الاتصال بخدمة العطل الرسمية، يتم عرض نسخة محلية احتياطية.');
    }

    setLoadingHolidays(false);
  };

  useEffect(() => {
    void loadHolidays();
  }, [displayedMonth]);

  useEffect(() => {
    const selected = new Date(`${selectedDate}T12:00:00`);
    const sameMonth = selected.getFullYear() === displayedMonth.getFullYear()
      && selected.getMonth() === displayedMonth.getMonth();

    if (!sameMonth) {
      setSelectedDate(toIsoDate(displayedMonth));
    }
  }, [displayedMonth, selectedDate]);

  const selectedEvents = useMemo(() => getEventsForDate(events, selectedDate), [events, selectedDate]);
  const selectedHolidays = useMemo(
    () => holidays.filter((holiday) => holiday.date === selectedDate),
    [holidays, selectedDate],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AppHeader title="Calendar" subtitle={monthTitle} />

        <View style={styles.calendarCard}>
          <View style={styles.weekRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={`weekday-${index}-${day}`} style={styles.weekday}>{day}</Text>
            ))}
          </View>

          <View style={styles.grid}>
            {calendarDays.map((item) => {
              if (item.type === 'blank') {
                return <View key={item.key} style={styles.dayCell} />;
              }

              const hasEvent = events.some((event) => event.fullDate === item.isoDate);
              const hasHoliday = holidays.some((holiday) => holiday.date === item.isoDate);
              const selected = selectedDate === item.isoDate;

              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setSelectedDate(item.isoDate)}
                  style={[styles.dayCell, selected && styles.selectedDay]}
                >
                  <Text style={[styles.dayText, selected && styles.selectedDayText]}>
                    {String(item.dayNumber)}
                  </Text>
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
            <View style={styles.feedbackBlock}>
              <Text style={styles.errorText}>{holidayError}</Text>
              <TouchableOpacity onPress={() => void loadHolidays()}>
                <Text style={styles.retryText}>إعادة المحاولة</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.list}>
            {selectedHolidays.length ? (
              selectedHolidays.map((holiday) => (
                <View key={holiday.id} style={styles.holidayCard}>
                  <Text style={styles.holidayLabel}>
                    {holiday.fallback ? 'إجازة رسمية (نسخة احتياطية)' : 'إجازة رسمية'}
                  </Text>
                  <Text style={styles.holidayTitle}>{holiday.localName || holiday.name}</Text>
                  <Text style={styles.holidayDate}>{formatIsoDate(holiday.date)}</Text>
                </View>
              ))
            ) : !loadingHolidays ? (
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
  feedbackBlock: {
    gap: spacing.xs,
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
