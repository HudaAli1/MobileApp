import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { radii, spacing } from '../constants/spacing';

const palette = {
  registered: { bg: '#E7F6EE', color: colors.success },
  interested: { bg: '#FFF4DD', color: colors.warning },
  category: { bg: '#EAF0FF', color: colors.secondary },
};

export default function Badge({ label, type = 'category' }) {
  const selected = palette[type] || palette.category;
  return (
    <View style={[styles.badge, { backgroundColor: selected.bg }]}>
      <Text style={[styles.label, { color: selected.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.pill,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
