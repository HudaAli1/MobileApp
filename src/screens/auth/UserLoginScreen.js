import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import BrandLogo from '../../components/BrandLogo';
import { useAppContext } from '../../context/AppContext';
import { validateLoginForm } from '../../utils/authValidation';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function UserLoginScreen({ navigation }) {
  const { loginStudent } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    const nextErrors = validateLoginForm({ email, password });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    const result = await loginStudent(email, password);
    if (!result.success) {
      Alert.alert('تسجيل الدخول', result.message);
      return;
    }

    navigation.getParent()?.replace('User');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brandSection}>
            <BrandLogo width={300} height={300} style={styles.logoSpacing} />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to explore campus events curated for you.</Text>
          </View>

          <View style={styles.form}>
            <FormField
              label="University Email *"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (errors.email) setErrors((current) => ({ ...current, email: '' }));
              }}
              placeholder="student@iau.edu.sa"
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
            <PrimaryButton label="Login" onPress={handleLogin} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.link}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.secondaryLink}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')}>
            <Text style={styles.adminLink}>Admin Login</Text>
          </TouchableOpacity>
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
  brandSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  logoSpacing: {
    marginBottom: 10,
  },
  title: {
    ...typography.screenTitle,
    textAlign: 'center',
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
  },
  link: {
    textAlign: 'center',
    color: colors.secondary,
    fontWeight: '600',
  },
  adminLink: {
    textAlign: 'center',
    color: colors.muted,
  },
  secondaryLink: {
    textAlign: 'center',
    color: colors.primary,
  },
});
