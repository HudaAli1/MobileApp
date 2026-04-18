import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import BrandLogo from '../../components/BrandLogo';
import FormField from '../../components/FormField';
import InterestChip from '../../components/InterestChip';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppContext } from '../../context/AppContext';
import { categories } from '../../utils/eventHelpers';
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
      date: 'Apr 30, 2026',
      time: '2:00 PM',
      location: '',
      category: 'Computer Science',
      image: null,
      interested: false,
      registered: false,
      isPast: false,
      fullDate: '2026-04-30',
    },
  );

  const saveEvent = () => {
    if (mode === 'edit' && eventId) {
      updateEvent(eventId, form);
    } else {
      addEvent(form);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader title={mode === 'edit' ? 'Edit Event' : 'Add New Event'} onBack={() => navigation.goBack()} />
        <BrandLogo width={180} height={180} style={styles.logoSpacing} />
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
            placeholder="Apr 30, 2026"
          />
          <FormField
            label="Time Picker UI"
            value={form.time}
            onChangeText={(time) => setForm((current) => ({ ...current, time }))}
            placeholder="2:00 PM"
          />
          <FormField
            label="Location"
            value={form.location}
            onChangeText={(location) => setForm((current) => ({ ...current, location }))}
            placeholder="Enter location"
          />
          <View style={styles.categoryWrap}>
            {categories.map((category) => (
              <InterestChip
                key={category}
                label={category}
                selected={form.category === category}
                onPress={() => setForm((current) => ({ ...current, category }))}
              />
            ))}
          </View>
        </View>
        <PrimaryButton label="Save" onPress={saveEvent} />
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
  form: {
    gap: spacing.md,
  },
  logoSpacing: {
    marginTop: -spacing.sm,
    marginBottom: 24,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
