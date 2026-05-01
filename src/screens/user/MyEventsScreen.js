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
  const { events, ratings } = useAppContext();
  const upcomingEvents = events.filter((event) => !event.isPast && (event.registered || event.interested));
  const pastEvents = events.filter((event) => event.isPast);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AppHeader title="My Events" onBack={() => navigation.goBack()} />

        <View>
          <SectionTitle title="Upcoming Events" />
          <View style={styles.list}>
            {upcomingEvents.length ? (
              upcomingEvents.map((event, index) => (
                <EventCard
                  key={`upcoming-event-${event.id ?? index}`}
                  event={event}
                  onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
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

        <View>
          <SectionTitle title="Past Events" />
          <View style={styles.list}>
            {pastEvents.map((event, index) => {
              const hasRating = ratings.some((item) => item.eventId === event.id);
              return (
              <EventCard
                key={`past-event-${event.id ?? index}`}
                event={event}
                onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
                action={
                  <TouchableOpacity onPress={() => navigation.navigate('RatingFeedback', { eventId: event.id })}>
                    <Text style={styles.rateLink}>{hasRating ? 'Edit Rating' : 'Rate Event'}</Text>
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
