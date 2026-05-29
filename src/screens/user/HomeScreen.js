// Import React Native components
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import SafeAreaView to avoid overlap with device notch/status bar
import { SafeAreaView } from 'react-native-safe-area-context';

// Import React hooks
import { useMemo, useState } from 'react';

// Import custom reusable components
import BrandLogo from '../../components/BrandLogo';
import SearchBar from '../../components/SearchBar';
import SectionTitle from '../../components/SectionTitle';
import LargeEventCard from '../../components/LargeEventCard';
import EventCard from '../../components/EventCard';

// Import global app context
import { useAppContext } from '../../context/AppContext';

// Import helper function for filtering events by interests
import { getInterestEvents } from '../../utils/eventHelpers';

// Import app styling constants
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

// Main Home Screen component
export default function HomeScreen({ navigation }) {

  // Get data and functions from context
  const { events, user, loadingEvents, eventsError, refreshEventsFromApi } = useAppContext();

  // State for search input
  const [search, setSearch] = useState('');

  // Filter events based on search text
  const filteredEvents = useMemo(() => {

    // Convert search text to lowercase for easier matching
    const query = search.trim().toLowerCase();

    // Keep only upcoming events
    const upcoming = events.filter((event) => !event.isPast);

    // If search is empty return all upcoming events
    if (!query) return upcoming;

    // Return matching events
    return upcoming.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query),
    );
  }, [events, search]);

  // Get events that match user interests
  const interestEvents = useMemo(
    () => getInterestEvents(filteredEvents, user?.interests || []),
    [filteredEvents, user?.interests],
  );

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Main vertical scroll view */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Top welcome section */}
        <View style={styles.topSection}>
          <BrandLogo width={300} height={220} style={styles.logoSpacing} />

          <Text style={styles.welcome}>Upcoming Events</Text>

          <Text style={styles.subtitle}>
            Discover what is happening across campus this week.
          </Text>
        </View>

        {/* Search bar */}
        <SearchBar value={search} onChangeText={setSearch} />

        {/* Loading text */}
        {loadingEvents ? <Text style={styles.statusText}>Loading events...</Text> : null}

        {/* Error message with refresh option */}
        {eventsError ? (
          <TouchableOpacity onPress={() => refreshEventsFromApi()}>
            <Text style={styles.errorText}>{eventsError}</Text>
          </TouchableOpacity>
        ) : null}

        {/* Interest-based events section */}
        <View>
          <SectionTitle title="Based on Your Interests" />

          {/* Horizontal scroll for featured events */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {(interestEvents.length ? interestEvents : filteredEvents.slice(0, 3)).map((event, index) => (
              <LargeEventCard
                key={`featured-event-${event.id ?? index}`}
                event={event}

                // Navigate to details screen when card is pressed
                onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
              />
            ))}
          </ScrollView>
        </View>

        {/* All events section */}
        <View>
          <SectionTitle title="Explore All Events" />

          <View style={styles.eventList}>
            {filteredEvents.map((event, index) => (
              <EventCard
                key={`home-event-${event.id ?? index}`}
                event={event}

                // Navigate to event details
                onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Screen styles
const styles = StyleSheet.create({

  // Main safe area style
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Main container spacing
  container: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },

  // Top section styling
  topSection: {
    alignItems: 'center',
    marginBottom: 12,
  },

  // Main title text
  welcome: {
    ...typography.screenTitle,
    color: colors.primary,
  },

  // Logo margin spacing
  logoSpacing: {
    marginBottom: 10,
  },

  // Subtitle styling
  subtitle: {
    ...typography.body,
    marginTop: 10,
    textAlign: 'center',
  },

  // Loading status text
  statusText: {
    ...typography.body,
    color: colors.secondary,
  },

  // Error message styling
  errorText: {
    ...typography.caption,
    color: colors.danger,
  },

  // Horizontal event list spacing
  horizontalList: {
    paddingRight: spacing.lg,
  },

  // Vertical event list spacing
  eventList: {
    gap: spacing.md,
  },
});
