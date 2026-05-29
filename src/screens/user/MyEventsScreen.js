import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/EmptyState';
import SectionTitle from '../../components/SectionTitle';
import { useAppContext } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function MyEventsScreen({ navigation }) {
  // Get global events and user ratings from context
  const { events, ratings } = useAppContext();

  // Filter events that are upcoming and user is involved in (registered/interested)
  const upcomingEvents = events.filter(
    (event) => !event.isPast && (event.registered || event.interested)
  );

  // Filter events that are already finished
  const pastEvents = events.filter((event) => event.isPast);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Screen header with back navigation */}
        <AppHeader title="My Events" onBack={() => navigation.goBack()} />

        {/* Upcoming events section */}
        <View>
          <SectionTitle title="Upcoming Events" />
          <View style={styles.list}>

            {/* Show upcoming events or empty state if none */}
            {upcomingEvents.length ? (
              upcomingEvents.map((event, index) => (
                <EventCard
                  key={`upcoming-event-${event.id ?? index}`}
                  event={event}
                  onPress={() =>
                    navigation.navigate('EventDetails', { eventId: event.id })
                  }
                />
              ))
            ) : (
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

            {/* Loop through past events */}
            {pastEvents.map((event, index) => {
              // Check if user has already rated this event
              const hasRating = ratings.some(
                (item) => item.eventId === event.id
              );

              return (
                <EventCard
                  key={`past-event-${event.id ?? index}`}
                  event={event}
                  onPress={() =>
                    navigation.navigate('EventDetails', { eventId: event.id })
                  }

                  // Action button for rating/editing feedback
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

// Styles for layout and UI spacing
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  list: {
    gap: spacing.md,
  },
  rateLink: {
    ...typography.label,
    color: colors.secondary,
    marginTop: spacing.sm,
  },
});
