// Import React Native components
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import SafeAreaView to avoid overlapping with phone notch/status bar
import { SafeAreaView } from 'react-native-safe-area-context';

// Import reusable custom components
import AppHeader from '../../components/AppHeader';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/EmptyState';
import SectionTitle from '../../components/SectionTitle';

// Import global app context
import { useAppContext } from '../../context/AppContext';

// Import styling constants
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

// Main screen component
export default function MyEventsScreen({ navigation }) {

  // Get events and ratings from context
  const { events, ratings } = useAppContext();

  // Filter upcoming events that user registered for or marked as interested
  const upcomingEvents = events.filter(
    (event) => !event.isPast && (event.registered || event.interested)
  );

  // Filter past events
  const pastEvents = events.filter((event) => event.isPast);

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Main scrollable container */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Screen header */}
        <AppHeader title="My Events" onBack={() => navigation.goBack()} />

        {/* Upcoming events section */}
        <View>
          <SectionTitle title="Upcoming Events" />

          <View style={styles.list}>
            {upcomingEvents.length ? (

              // Display upcoming events
              upcomingEvents.map((event, index) => (
                <EventCard
                  key={`upcoming-event-${event.id ?? index}`}
                  event={event}

                  // Navigate to event details
                  onPress={() =>
                    navigation.navigate('EventDetails', { eventId: event.id })
                  }
                />
              ))
            ) : (

              // Show empty state if no upcoming events exist
              <EmptyState
                title="No upcoming events yet"
                description="Events you mark as interested or register for will appear here."
              />
            )}
          </View>
        </View>

        {/* Past events section */}
        <View>
          <SectionTitle title="Past Events" />

          <View style={styles.list}>
            {pastEvents.map((event, index) => {

              // Check if event already has a rating
              const hasRating = ratings.some(
                (item) => item.eventId === event.id
              );

              return (
                <EventCard
                  key={`past-event-${event.id ?? index}`}
                  event={event}

                  // Navigate to event details screen
                  onPress={() =>
                    navigation.navigate('EventDetails', { eventId: event.id })
                  }

                  // Custom action button for rating
                  action={
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('RatingFeedback', {
                          eventId: event.id,
                        })
                      }
                    >
                      <Text style={styles.rateLink}>
                        {hasRating ? 'Edit Rating' : 'Rate Event'}
                      </Text>
                    </TouchableOpacity>
                  }
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Screen styles
const styles = StyleSheet.create({

  // Safe area styling
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Main container spacing
  container: {
    padding: spacing.lg,
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  // Event list spacing
  list: {
    gap: spacing.md,
  },

  // Rating link text style
  rateLink: {
    ...typography.label,
    color: colors.secondary,
    marginTop: spacing.sm,
  },
});
