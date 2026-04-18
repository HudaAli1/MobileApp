import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { radii, spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

export default function EmptyState({ title, description }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  title: {
    ...typography.cardTitle,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
  },
});
