import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import BrandLogo from '../../components/BrandLogo';
import SearchBar from '../../components/SearchBar';
import SectionTitle from '../../components/SectionTitle';
import LargeEventCard from '../../components/LargeEventCard';
import EventCard from '../../components/EventCard';
import { useAppContext } from '../../context/AppContext';
import { getInterestEvents } from '../../utils/eventHelpers';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function HomeScreen({ navigation }) {
  const { events, user } = useAppContext();
  const [search, setSearch] = useState('');

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const upcoming = events.filter((event) => !event.isPast);
    if (!query) return upcoming;
    return upcoming.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query),
    );
  }, [events, search]);

  const interestEvents = useMemo(
    () => getInterestEvents(filteredEvents, user.interests),
    [filteredEvents, user.interests],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View>
          <BrandLogo width={180} height={180} style={styles.logoSpacing} />
          <Text style={styles.welcome}>Upcoming Events</Text>
          <Text style={styles.subtitle}>Discover what is happening across campus this week.</Text>
        </View>

        <SearchBar value={search} onChangeText={setSearch} />

        <View>
          <SectionTitle title="Based on Your Interests" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {(interestEvents.length ? interestEvents : filteredEvents.slice(0, 3)).map((event) => (
              <LargeEventCard
                key={event.id}
                event={event}
                onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
              />
            ))}
          </ScrollView>
        </View>

        <View>
          <SectionTitle title="Explore All Events" />
          <View style={styles.eventList}>
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
              />
            ))}
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
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  welcome: {
    ...typography.screenTitle,
    color: colors.primary,
  },
  logoSpacing: {
    marginBottom: 24,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  horizontalList: {
    paddingRight: spacing.lg,
  },
  eventList: {
    gap: spacing.md,
  },
});
