import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import Badge from '../../components/Badge';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import { useAppContext } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { radii, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function EventDetailsScreen({ navigation, route }) {
  const { eventId } = route.params;
  const { events, toggleInterested, toggleRegistration } = useAppContext();
  const event = events.find((item) => item.id === eventId);

  if (!event) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AppHeader title="Event Details" onBack={() => navigation.goBack()} />
        <View style={styles.hero}>
          <Ionicons name="image-outline" size={54} color={colors.secondary} />
          {event.registered ? <Badge label="Registered" type="registered" /> : null}
        </View>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.infoBlock}>
          <Text style={styles.info}>Date: {event.date}</Text>
          <Text style={styles.info}>Time: {event.time}</Text>
          <Text style={styles.info}>Location: {event.location}</Text>
          <Text style={styles.info}>Category: {event.category}</Text>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        <SecondaryButton
          label={event.interested ? 'Marked as Interested' : 'Mark as Interested'}
          onPress={() => toggleInterested(event.id)}
        />
        <PrimaryButton
          label={event.registered ? 'Cancel Registration' : 'Register'}
          onPress={() => toggleRegistration(event.id)}
          style={event.registered ? styles.cancelButton : null}
        />
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
  hero: {
    height: 220,
    borderRadius: radii.xl,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  title: {
    ...typography.screenTitle,
  },
  infoBlock: {
    gap: spacing.sm,
  },
  info: {
    ...typography.body,
    color: colors.text,
  },
  descriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.sectionTitle,
  },
  description: {
    ...typography.body,
  },
  cancelButton: {
    backgroundColor: colors.danger,
  },
});
