import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { radii, spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import Badge from './Badge';

export default function EventCard({ event, onPress, action, compact = false }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, compact && styles.compact]} activeOpacity={0.9}>
      <View style={styles.image}>
        <Ionicons name="image-outline" size={compact ? 24 : 30} color={colors.secondary} />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{event.title}</Text>
          {event.registered ? (
            <Badge label="Registered" type="registered" />
          ) : event.interested ? (
            <Badge label="Interested" type="interested" />
          ) : null}
        </View>
        <Text style={styles.meta}>{event.date}</Text>
        <Text style={styles.meta}>{event.location}</Text>
        {action || null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
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
  compact: {
    minHeight: 110,
  },
  image: {
    width: 96,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  topRow: {
    gap: spacing.xs,
  },
  title: {
    ...typography.cardTitle,
    fontSize: 17,
  },
  meta: {
    ...typography.caption,
  },
});
