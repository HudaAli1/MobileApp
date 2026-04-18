import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

export default function SectionTitle({ title, action }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action || null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.sectionTitle,
  },
});
