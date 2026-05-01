import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/colors';
import { radii, spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
  keyboardType,
  error,
  autoCapitalize,
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize || 'sentences'}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.multiline, error && styles.inputError]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text,
  },
  multiline: {
    minHeight: 120,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
});
