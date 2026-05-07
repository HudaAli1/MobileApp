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

// Function to format the month and year title
function formatMonthTitle(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Function to format ISO date into readable format
function formatIsoDate(isoDate) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${isoDate}T12:00:00`));
}

// Function to convert a date object into ISO format (YYYY-MM-DD)
function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

// Function to generate calendar days and blank spaces
function buildCalendarDays(displayedMonth) {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const leadingBlankCount = firstDay.getDay();

  // Create empty cells before the first day of the month
  const blanks = Array.from({ length: leadingBlankCount }, (_, index) => ({
    key: `blank-${index}`,
    type: 'blank',
  }));

  // Create all days of the month
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

// Main calendar screen component
export default function CalendarScreen({ navigation }) {

  // Get events from app context
  const { events } = useAppContext();

  // Store today's date
  const today = useMemo(() => new Date(), []);

  // State for displayed month
  const [displayedMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // State for selected date
  const [selectedDate, setSelectedDate] = useState(toIsoDate(today));

  // State for holidays data
  const [holidays, setHolidays] = useState([]);

  // Loading state for holidays
  const [loadingHolidays, setLoadingHolidays] = useState(true);

  // Error message state
  const [holidayError, setHolidayError] = useState('');

  // Track if fallback holiday data is used
  const [fallbackUsed, setFallbackUsed] = useState(false);

  // Memoized month title
  const monthTitle = useMemo(() => formatMonthTitle(displayedMonth), [displayedMonth]);

  // Memoized calendar days
  const calendarDays = useMemo(() => buildCalendarDays(displayedMonth), [displayedMonth]);

  // Function to load Saudi public holidays
  const loadHolidays = async () => {
    setLoadingHolidays(true);
    setHolidayError('');

    const result = await fetchSaudiPublicHolidays(displayedMonth.getFullYear());
    setHolidays(result.holidays);
    setFallbackUsed(result.fallbackUsed);

    // Handle fallback error message
    if (result.fallbackUsed) {
      console.warn('Holiday API fallback used:', result.error);
      setHolidayError('تعذر الاتصال بخدمة العطل الرسمية، يتم عرض نسخة محلية احتياطية.');
    }

    setLoadingHolidays(false);
  };

  // Load holidays whenever displayed month changes
  useEffect(() => {
    void loadHolidays();
  }, [displayedMonth]);

  // Ensure selected date stays within displayed month
  useEffect(() => {
    const selected = new Date(`${selectedDate}T12:00:00`);
    const sameMonth = selected.getFullYear() === displayedMonth.getFullYear()
      && selected.getMonth() === displayedMonth.getMonth();

    if (!sameMonth) {
      setSelectedDate(toIsoDate(displayedMonth));
    }
  }, [displayedMonth, selectedDate]);

  // Get events for selected date
  const selectedEvents = useMemo(() => getEventsForDate(events, selectedDate), [events, selectedDate]);

  // Get holidays for selected date
  const selectedHolidays = useMemo(
    () => holidays.filter((holiday) => holiday.date === selectedDate),
    [holidays, selectedDate],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* App screen header */}
        <AppHeader title="Calendar" subtitle={monthTitle} />

        {/* Calendar card container */}
        <View style={styles.calendarCard}>

          {/* Weekday labels */}
          <View style={styles.weekRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={`weekday-${index}-${day}`} style={styles.weekday}>{day}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.grid}>
            {calendarDays.map((item) => {

              // Render empty cells
              if (item.type === 'blank') {
                return <View key={item.key} style={styles.dayCell} />;
              }

              // Check if the selected day has events or holidays
              const hasEvent = events.some((event) => event.fullDate === item.isoDate);
              const hasHoliday = holidays.some((holiday) => holiday.date === item.isoDate);
              const selected = selectedDate === item.isoDate;

              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setSelectedDate(item.isoDate)}
                  style={[styles.dayCell, selected && styles.selectedDay]}
                >

                  {/* Day number */}
                  <Text style={[styles.dayText, selected && styles.selectedDayText]}>
                    {String(item.dayNumber)}
                  </Text>

                  {/* Event indicator dot */}
                  {hasEvent ? <View style={[styles.dot, selected && styles.selectedDot]} /> : null}

                  {/* Holiday indicator dot */}
                  {hasHoliday ? <View style={[styles.holidayDot, selected && styles.selectedHolidayDot]} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected day events section */}
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

              // Empty state when no events exist
              <EmptyState title="لا توجد فعاليات في هذا اليوم" description="اختاري يومًا آخر لعرض فعاليات الكلية." />
            )}
          </View>
        </View>

        {/* Public holidays section */}
        <View>
          <SectionTitle title="العطل الرسمية" />

          {/* Loading message */}
          {loadingHolidays ? <Text style={styles.statusText}>جاري تحميل العطل الرسمية...</Text> : null}

          {/* Error message with retry option */}
          {holidayError ? (
            <View style={styles.feedbackBlock}>
              <Text style={styles.errorText}>{holidayError}</Text>
              <TouchableOpacity onPress={() => void loadHolidays()}>
                <Text style={styles.retryText}>إعادة المحاولة</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Holiday cards */}
          <View style={styles.list}>
            {selectedHolidays.length ? (
              selectedHolidays.map((holiday) => (
                <View key={holiday.id} style={styles.holidayCard}>

                  {/* Holiday type label */}
                  <Text style={styles.holidayLabel}>
                    {holiday.fallback ? 'إجازة رسمية (نسخة احتياطية)' : 'إجازة رسمية'}
                  </Text>

                  {/* Holiday title */}
                  <Text style={styles.holidayTitle}>{holiday.localName || holiday.name}</Text>

                  {/* Holiday date */}
                  <Text style={styles.holidayDate}>{formatIsoDate(holiday.date)}</Text>
                </View>
              ))
            ) : !loadingHolidays ? (

              // Empty state when no holiday exists
              <EmptyState title="لا توجد عطلة رسمية في هذا اليوم" description="ستظهر العطل الرسمية السعودية هنا عند توافق التاريخ." />
            ) : null}
          </View>

          {/* Note when fallback data is used */}
          {fallbackUsed ? <Text style={styles.noteText}>يتم الآن عرض نسخة محلية احتياطية من العطل الرسمية.</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for the calendar screen
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
