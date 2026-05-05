import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

function formatDisplayDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatDisplayTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

export default function AddEditEventScreen({ navigation, route }) {
  const { mode = 'add', eventId } = route.params || {};
  const { events, addEvent, updateEvent } = useAppContext();
  const existingEvent = useMemo(() => events.find((event) => event.id === eventId), [events, eventId]);

  const initialDate = existingEvent?.fullDate ? new Date(`${existingEvent.fullDate}T12:00:00`) : null;
  const initialTime = existingEvent?.time ? new Date(`2026-04-30 ${existingEvent.time}`) : null;

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
    },
  );
  const [eventDate, setEventDate] = useState(initialDate);
  const [eventTime, setEventTime] = useState(initialTime);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (pickerEvent, selectedDate) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }

    if (pickerEvent.type === 'dismissed' || !selectedDate) return;

    setEventDate(selectedDate);
    setForm((current) => ({
      ...current,
      date: formatDisplayDate(selectedDate),
      fullDate: toIsoDate(selectedDate),
    }));
  };

  const handleTimeChange = (pickerEvent, selectedTime) => {
    if (Platform.OS !== 'ios') {
      setShowTimePicker(false);
    }

    if (pickerEvent.type === 'dismissed' || !selectedTime) return;

    setEventTime(selectedTime);
    setForm((current) => ({
      ...current,
      time: formatDisplayTime(selectedTime),
    }));
  };

  const saveEvent = async () => {
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

    const payload = {
      ...form,
      imageKey: getImageKeyForCategory(form.category),
      imageUri: '',
      date: form.date,
      time: form.time,
      fullDate: form.fullDate,
    };

    if (mode === 'edit' && eventId) {
      await updateEvent(eventId, payload);
      Alert.alert('الفعاليات', 'تم تعديل الفعالية بنجاح');
    } else {
      await addEvent(payload);
      Alert.alert('الفعاليات', 'تمت إضافة الفعالية بنجاح');
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <AppHeader title={mode === 'edit' ? 'Edit Event' : 'Add New Event'} onBack={() => navigation.goBack()} />
          <View style={styles.topSection}>
            <BrandLogo width={300} height={220} style={styles.logoSpacing} />
          </View>

          <View style={styles.form}>
            <FormField
              label="Event Title"
              value={form.title}
              onChangeText={(title) => setForm((current) => ({ ...current, title }))}
              placeholder="Enter event title"
            />

            <FormField
              label="Description"
              value={form.description}
              onChangeText={(description) => setForm((current) => ({ ...current, description }))}
              placeholder="Event description..."
              multiline
            />

            <Pressable style={styles.selector} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.selectorLabel}>Event Date</Text>
              <Text style={[styles.selectorValue, !form.date && styles.placeholderText]}>
                {form.date || 'اختر التاريخ'}
              </Text>
            </Pressable>

            {showDatePicker ? (
              <DateTimePicker
                value={eventDate || new Date('2026-04-30T12:00:00')}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            ) : null}

            <Pressable style={styles.selector} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.selectorLabel}>Event Time</Text>
              <Text style={[styles.selectorValue, !form.time && styles.placeholderText]}>
                {form.time || 'اختر الوقت'}
              </Text>
            </Pressable>

            {showTimePicker ? (
              <DateTimePicker
                value={eventTime || new Date('2026-04-30T14:00:00')}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
              />
            ) : null}

            <FormField
              label="Location"
              value={form.location}
              onChangeText={(location) => setForm((current) => ({ ...current, location }))}
              placeholder="Enter location"
            />

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

          <PrimaryButton label="Save" onPress={saveEvent} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
