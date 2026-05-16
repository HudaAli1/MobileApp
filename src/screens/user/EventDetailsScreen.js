// Import React Native components
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

// Import SafeAreaView to handle safe screen areas
import { SafeAreaView } from 'react-native-safe-area-context';

// Import reusable custom components
import AppHeader from '../../components/AppHeader';
import Badge from '../../components/Badge';
import EventImage from '../../components/EventImage';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';

// Import global app context
import { useAppContext } from '../../context/AppContext';

// Import styling constants
import { colors } from '../../constants/colors';
import { radii, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

// Main screen component
export default function EventDetailsScreen({ navigation, route }) {

  // Get event ID from route parameters
  const { eventId } = route.params;

  // Get events and functions from context
  const { events, toggleInterested, toggleRegistration } = useAppContext();

  // Find selected event by ID
  const event = events.find((item) => item.id === eventId);

  // If event does not exist return nothing
  if (!event) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Main scrollable container */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header with back button */}
        <AppHeader title="Event Details" onBack={() => navigation.goBack()} />

        {/* Event image section */}
        <View style={styles.hero}>

          {/* Event image */}
          <EventImage event={event} style={styles.heroImage} />

          {/* Show badge if user registered for the event */}
          {event.registered ? (
            <Badge label="Registered" type="registered" />
          ) : null}
        </View>

        {/* Event title */}
        <Text style={styles.title}>{event.title}</Text>

        {/* Event information */}
        <View style={styles.infoBlock}>
          <Text style={styles.info}>Date: {event.date}</Text>
          <Text style={styles.info}>Time: {event.time}</Text>
          <Text style={styles.info}>Location: {event.location}</Text>
          <Text style={styles.info}>Category: {event.category}</Text>
        </View>

        {/* Description section */}
        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Description</Text>

          {/* Event description text */}
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Interested button */}
        <SecondaryButton
          label={
            event.interested
              ? 'Marked as Interested'
              : 'Mark as Interested'
          }

          // Toggle interested state
          onPress={async () => {
            const result = await toggleInterested(event.id);

            // Show confirmation alert
            Alert.alert('الاهتمامات', result.message);
          }}
        />

        {/* Register / Cancel button */}
        <PrimaryButton
          label={
            event.registered
              ? 'Cancel Registration'
              : 'Register'
          }

          // Toggle registration state
          onPress={async () => {
            const result = await toggleRegistration(event.id);

            // Show confirmation alert
            Alert.alert('الفعالية', result.message);
          }}

          // Apply red style if registration already exists
          style={event.registered ? styles.cancelButton : null}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Screen styles
const styles = StyleSheet.create({

  // Safe area background
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Main container spacing
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Hero image section spacing
  hero: {
    gap: spacing.md,
  },

  // Event image styling
  heroImage: {
    height: 220,
    borderRadius: radii.xl,
    gap: spacing.md,
  },

  // Event title styling
  title: {
    ...typography.screenTitle,
  },

  // Information block spacing
  infoBlock: {
    gap: spacing.sm,
  },

  // Event information text
  info: {
    ...typography.body,
    color: colors.text,
  },

  // Description card container
  descriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },

  // Section title styling
  sectionTitle: {
    ...typography.sectionTitle,
  },

  // Description text styling
  description: {
    ...typography.body,
  },

  // Cancel registration button style
  cancelButton: {
    backgroundColor: colors.danger,
  },
});
