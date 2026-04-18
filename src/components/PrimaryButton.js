import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, shadows } from '../constants/colors';
import { radii, spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

export default function PrimaryButton({ label, onPress, style, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled, style]}
      activeOpacity={0.88}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  label: {
    ...typography.button,
  },
  disabled: {
    opacity: 0.5,
  },
});
