import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppHeader from '../../components/AppHeader';
import BrandLogo from '../../components/BrandLogo';
import FormField from '../../components/FormField';
import InterestChip from '../../components/InterestChip';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppContext } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { radii, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { categories } from '../../utils/eventHelpers';
import { getImageKeyForCategory } from '../../utils/eventImages';

/**
 * Format a Date object into a readable date string (e.g. April 30, 2026)
 */
function formatDisplayDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Format a Date object into readable time (e.g. 2:00 PM)
 */
function formatDisplayTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

/**
 * Convert Date object to ISO date string (YYYY-MM-DD)
 */
function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

export default function AddEditEventScreen({ navigation, route }) {
  // Get mode (add/edit) and event ID from route params
  const { mode = 'add', eventId } = route.params || {};

  // Get global event functions and data
  const { events, addEvent, updateEvent } = useAppContext();

  // Find existing event if editing
  const existingEvent = useMemo(
    () => events.find((event) => event.id === eventId),
    [events, eventId]
  );

  // Initial date setup for edit mode
  const initialDate = existingEvent?.fullDate
    ? new Date(`${existingEvent.fullDate}T12:00:00`)
    : null;

  // Initial time setup for edit mode
  const initialTime = existingEvent?.time
    ? new Date(`2026-04-30 ${existingEvent.time}`)
    : null;

  // Form state for event fields
  const [form, setForm] = useState(
    existingEvent || {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      imageKey: '',
      interested: false,
      registered: false,
      isPast: false,
      fullDate: '',
    }
  );

  // Selected date state
  const [eventDate, setEventDate] = useState(initialDate);

  // Selected time state
  const [eventTime, setEventTime] = useState(initialTime);

  // Control visibility of date picker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Control visibility of time picker
  const [showTimePicker, setShowTimePicker] = useState(false);

  /**
   * Handle date selection from picker
   */
  const handleDateChange = (pickerEvent, selectedDate) => {
    // Close picker on Android after selection
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }

    // Ignore if dismissed or no date selected
    if (pickerEvent.type === 'dismissed' || !selectedDate) return;

    setEventDate(selectedDate);

    // Update form with formatted date values
    setForm((current) => ({
      ...current,
      date: formatDisplayDate(selectedDate),
      fullDate: toIsoDate(selectedDate),
    }));
  };

  /**
   * Handle time selection from picker
   */
  const handleTimeChange = (pickerEvent, selectedTime) => {
    // Close picker on Android after selection
    if (Platform.OS !== 'ios') {
      setShowTimePicker(false);
    }

    // Ignore if dismissed or no time selected
    if (pickerEvent.type === 'dismissed' || !selectedTime) return;

    setEventTime(selectedTime);

    // Update form with formatted time
    setForm((current) => ({
      ...current,
      time: formatDisplayTime(selectedTime),
    }));
  };

  /**
   * Save or update event
   */
  const saveEvent = async () => {
    // Validation checks
    if (!form.title.trim()) {
      Alert.alert('الفعالية', 'يرجى إدخال عنوان الفعالية.');
      return;
    }

    if (!form.description.trim()) {
      Alert.alert('الفعالية', 'يرجى إدخال وصف الفعالية.');
      return;
    }

    if (!form.location.trim()) {
      Alert.alert('الفعالية', 'يرجى إدخال موقع الفعالية.');
      return;
    }

    if (!form.category) {
      Alert.alert('الفعالية', 'يرجى اختيار تصنيف الفعالية.');
      return;
    }

    if (!form.fullDate || !eventDate) {
      Alert.alert('الفعالية', 'يرجى اختيار التاريخ.');
      return;
    }

    if (!form.time || !eventTime) {
      Alert.alert('الفعالية', 'يرجى اختيار الوقت.');
      return;
    }

    // Prepare final payload
    const payload = {
      ...form,
      imageKey: getImageKeyForCategory(form.category),
      imageUri: '',
      date: form.date,
      time: form.time,
      fullDate: form.fullDate,
    };

    // Update or add event depending on mode
    if (mode === 'edit' && eventId) {
      await updateEvent(eventId, payload);
      Alert.alert('الفعاليات', 'تم تعديل الفعالية بنجاح');
    } else {
      await addEvent(payload);
      Alert.alert('الفعاليات', 'تمت إضافة الفعالية بنجاح');
    }

    // Go back to previous screen
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Prevent keyboard overlap on inputs */}
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Screen header */}
          <AppHeader
            title={mode === 'edit' ? 'Edit Event' : 'Add New Event'}
            onBack={() => navigation.goBack()}
          />

          {/* Branding section */}
          <View style={styles.topSection}>
            <BrandLogo width={300} height={220} style={styles.logoSpacing} />
          </View>

          {/* Form section */}
          <View style={styles.form}>
            
            {/* Event title input */}
            <FormField
              label="Event Title"
              value={form.title}
              onChangeText={(title) =>
                setForm((current) => ({ ...current, title }))
              }
              placeholder="Enter event title"
            />

            {/* Description input */}
            <FormField
              label="Description"
              value={form.description}
              onChangeText={(description) =>
                setForm((current) => ({ ...current, description }))
              }
              placeholder="Event description..."
              multiline
            />

            {/* Date selector */}
            <Pressable style={styles.selector} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.selectorLabel}>Event Date</Text>
              <Text
                style={[
                  styles.selectorValue,
                  !form.date && styles.placeholderText,
                ]}
              >
                {form.date || 'اختر التاريخ'}
              </Text>
            </Pressable>

            {/* Date picker */}
            {showDatePicker ? (
              <DateTimePicker
                value={eventDate || new Date('2026-04-30T12:00:00')}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            ) : null}

            {/* Time selector */}
            <Pressable style={styles.selector} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.selectorLabel}>Event Time</Text>
              <Text
                style={[
                  styles.selectorValue,
                  !form.time && styles.placeholderText,
                ]}
              >
                {form.time || 'اختر الوقت'}
              </Text>
            </Pressable>

            {/* Time picker */}
            {showTimePicker ? (
              <DateTimePicker
                value={eventTime || new Date('2026-04-30T14:00:00')}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
              />
            ) : null}

            {/* Location input */}
            <FormField
              label="Location"
              value={form.location}
              onChangeText={(location) =>
                setForm((current) => ({ ...current, location }))
              }
              placeholder="Enter location"
            />

            {/* Category selection chips */}
            <View style={styles.categoryWrap}>
              {categories.map((category, index) => (
                <InterestChip
                  key={`event-category-${index}-${category}`}
                  label={category}
                  selected={form.category === category}
                  onPress={() =>
                    setForm((current) => ({
                      ...current,
                      category,
                      imageKey: getImageKeyForCategory(category),
                    }))
                  }
                />
              ))}
            </View>
          </View>

          {/* Save button */}
          <PrimaryButton label="Save" onPress={saveEvent} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * Styles for layout and UI structure
 */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  root: {
    flex: 1,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  container: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  form: {
    gap: spacing.md,
  },
  logoSpacing: {
    marginBottom: 10,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selector: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  selectorLabel: {
    ...typography.label,
  },
  selectorValue: {
    ...typography.body,
    color: colors.text,
  },
  placeholderText: {
    color: colors.muted,
  },
});
