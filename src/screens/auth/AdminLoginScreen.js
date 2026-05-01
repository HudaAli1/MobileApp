import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import AppHeader from '../../components/AppHeader';
import BrandLogo from '../../components/BrandLogo';
import { useAppContext } from '../../context/AppContext';
import { validateLoginForm } from '../../utils/authValidation';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function AdminLoginScreen({ navigation }) {
  const { loginAdmin } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleAdminLogin = async () => {
    const nextErrors = validateLoginForm({ email, password });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    const result = await loginAdmin(email, password);
    if (!result.success) {
      Alert.alert('الدخول الإداري', result.message);
      return;
    }

    navigation.getParent()?.replace('Admin');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <AppHeader title="Admin Login" onBack={() => navigation.goBack()} />
          <View style={styles.topSection}>
            <BrandLogo width={300} height={300} style={styles.logoSpacing} />
            <Text style={styles.subtitle}>Sign in to manage campus events and organizer tasks.</Text>
          </View>

          <View style={styles.form}>
            <FormField
              label="Admin Email *"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (errors.email) setErrors((current) => ({ ...current, email: '' }));
              }}
              placeholder="admin@iau.edu.sa"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <FormField
              label="Password *"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (errors.password) setErrors((current) => ({ ...current, password: '' }));
              }}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              error={errors.password}
            />
            <PrimaryButton label="Login" onPress={handleAdminLogin} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  root: {
    flex: 1,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  container: {
    padding: spacing.xl,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: 0,
  },
  logoSpacing: {
    marginBottom: 10,
  },
  form: {
    gap: spacing.md,
  },
});
