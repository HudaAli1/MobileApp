import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import FormField from '../../components/FormField';
import InterestChip from '../../components/InterestChip';
import PrimaryButton from '../../components/PrimaryButton';
import AppHeader from '../../components/AppHeader';
import BrandLogo from '../../components/BrandLogo';
import { useAppContext } from '../../context/AppContext';
import { categories } from '../../utils/eventHelpers';
import { validateSignUpForm } from '../../utils/authValidation';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function SignUpScreen({ navigation }) {
  const { users, adminAccount, beginSignUpVerification } = useAppContext();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    universityId: '',
    major: '',
    phone: '',
    bio: '',
  });
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [errors, setErrors] = useState({});

  const existingUser = useMemo(() => {
    const normalizedEmail = form.email.trim().toLowerCase();
    if (!normalizedEmail) return null;
    if (adminAccount.email.toLowerCase() === normalizedEmail) return adminAccount;
    return users.find((item) => item.email.toLowerCase() === normalizedEmail) || null;
  }, [adminAccount, form.email, users]);

  const majorOptions = categories.filter((item) => item !== 'عام');

  const toggleInterest = (interest) => {
    setSelectedInterests((current) =>
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest],
    );
  };

  const handleCreateAccount = async () => {
    const nextErrors = validateSignUpForm(
      {
        ...form,
        major: form.major,
        interests: selectedInterests,
      },
      existingUser,
    );
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      Alert.alert('إنشاء الحساب', 'يرجى تصحيح الحقول المطلوبة ثم المحاولة مرة أخرى.');
      return;
    }

    const verification = await beginSignUpVerification({
      ...form,
      major: form.major,
      interests: selectedInterests.length ? selectedInterests : [form.major],
    });
    Alert.alert('رمز التحقق', `رمز التحقق التجريبي: ${verification.code}`);
    navigation.navigate('EmailVerification');
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
          <AppHeader title="Create Account" onBack={() => navigation.goBack()} />
          <View style={styles.topSection}>
            <BrandLogo width={300} height={220} style={styles.logoSpacing} />
          </View>

          <View style={styles.form}>
            <FormField
              label="Full Name *"
              value={form.name}
              onChangeText={(name) => setForm((current) => ({ ...current, name }))}
              placeholder="Your full name"
              error={errors.name}
            />
            <FormField
              label="University Email *"
              value={form.email}
              onChangeText={(email) => setForm((current) => ({ ...current, email }))}
              placeholder="student@iau.edu.sa"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <FormField
              label="Password *"
              value={form.password}
              onChangeText={(password) => setForm((current) => ({ ...current, password }))}
              placeholder="Create a password"
              secureTextEntry
              autoCapitalize="none"
              error={errors.password}
            />
            <FormField
              label="Confirm Password *"
              value={form.confirmPassword}
              onChangeText={(confirmPassword) => setForm((current) => ({ ...current, confirmPassword }))}
              placeholder="Confirm your password"
              secureTextEntry
              autoCapitalize="none"
              error={errors.confirmPassword}
            />
            <FormField
              label="University ID *"
              value={form.universityId}
              onChangeText={(universityId) => setForm((current) => ({ ...current, universityId }))}
              placeholder="Your university ID"
              keyboardType="number-pad"
              autoCapitalize="none"
              error={errors.universityId}
            />
            <View style={styles.majorSection}>
              <Text style={styles.sectionTitle}>Major *</Text>
              <View style={styles.chipWrap}>
                {majorOptions.map((major, index) => (
                  <InterestChip
                    key={`major-${index}-${major}`}
                    label={major}
                    selected={form.major === major}
                    onPress={() => setForm((current) => ({ ...current, major }))}
                  />
                ))}
              </View>
              {errors.major ? <Text style={styles.errorText}>{errors.major}</Text> : null}
            </View>
            <FormField
              label="Phone Number (Optional)"
              value={form.phone}
              onChangeText={(phone) => setForm((current) => ({ ...current, phone }))}
              placeholder="05XXXXXXXX"
              keyboardType="phone-pad"
              autoCapitalize="none"
              error={errors.phone}
            />
            <FormField
              label="Profile Bio (Optional)"
              value={form.bio}
              onChangeText={(bio) => setForm((current) => ({ ...current, bio }))}
              placeholder="A short bio about you"
              multiline
            />
          </View>

          <View>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.chipWrap}>
              {categories.map((interest, index) => (
                <InterestChip
                  key={`signup-interest-${index}-${interest}`}
                  label={interest}
                  selected={selectedInterests.includes(interest)}
                  onPress={() => toggleInterest(interest)}
                />
              ))}
            </View>
          </View>

          <PrimaryButton label="Create Account" onPress={handleCreateAccount} />
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
    marginBottom: 8,
  },
  container: {
    padding: spacing.xl,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  form: {
    gap: spacing.md,
  },
  logoSpacing: {
    marginBottom: 8,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    marginBottom: 12,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  majorSection: {
    gap: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
  },
});
