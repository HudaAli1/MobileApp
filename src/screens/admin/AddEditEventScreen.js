import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import BrandLogo from '../../components/BrandLogo';
import FormField from '../../components/FormField';
import InterestChip from '../../components/InterestChip';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppContext } from '../../context/AppContext';
import { categories } from '../../utils/eventHelpers';
import { getImageKeyForCategory } from '../../utils/eventImages';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

export default function AddEditEventScreen({ navigation, route }) {
  const { mode = 'add', eventId } = route.params || {};
  const { events, addEvent, updateEvent } = useAppContext();
  const existingEvent = useMemo(() => events.find((event) => event.id === eventId), [events, eventId]);
  const [form, setForm] = useState(
    existingEvent || {
      title: '',
      description: '',
      date: '30 أبريل 2026',
      time: '2:00 م',
      location: '',
      category: 'علوم الحاسب',
      imageKey: 'computer-science',
      interested: false,
      registered: false,
      isPast: false,
      fullDate: '2026-04-30',
    },
  );

  const saveEvent = async () => {
    const payload = {
      ...form,
      imageKey: form.imageKey || getImageKeyForCategory(form.category),
      fullDate: form.fullDate || '2026-04-30',
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
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
            <FormField
              label="Date Picker UI"
              value={form.date}
              onChangeText={(date) => setForm((current) => ({ ...current, date }))}
              placeholder="30 أبريل 2026"
            />
            <FormField
              label="Time Picker UI"
              value={form.time}
              onChangeText={(time) => setForm((current) => ({ ...current, time }))}
              placeholder="2:00 م"
            />
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
});
