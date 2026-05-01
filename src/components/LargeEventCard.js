import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { radii, spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import Badge from './Badge';
import EventImage from './EventImage';

export default function LargeEventCard({ event, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.92}>
      <EventImage event={event} style={styles.image} />
      <View style={styles.content}>
        <Badge label={event.category} />
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.meta}>{event.date}</Text>
        {event.registered ? (
          <Badge label="Registered" type="registered" />
        ) : event.interested ? (
          <Badge label="Interested" type="interested" />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    marginRight: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#17306C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: {
        elevation: 5,
      },
      default: {},
    }),
  },
  image: {
    height: 140,
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    ...typography.cardTitle,
  },
  meta: {
    ...typography.caption,
  },
});
