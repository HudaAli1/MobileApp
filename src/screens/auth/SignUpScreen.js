import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import FormField from '../../components/FormField';
import InterestChip from '../../components/InterestChip';
import PrimaryButton from '../../components/PrimaryButton';
import AppHeader from '../../components/AppHeader';
import BrandLogo from '../../components/BrandLogo';
import { categories } from '../../utils/eventHelpers';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    setSelectedInterests((current) =>
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AppHeader title="Create Account" onBack={() => navigation.goBack()} />
        <BrandLogo width={260} height={260} style={styles.logoSpacing} />
        <View style={styles.form}>
          <FormField
            label="Full Name"
            value={form.name}
            onChangeText={(name) => setForm((current) => ({ ...current, name }))}
            placeholder="Your full name"
          />
          <FormField
            label="Email"
            value={form.email}
            onChangeText={(email) => setForm((current) => ({ ...current, email }))}
            placeholder="student@iau.edu.sa"
            keyboardType="email-address"
          />
          <FormField
            label="Password"
            value={form.password}
            onChangeText={(password) => setForm((current) => ({ ...current, password }))}
            placeholder="Create a password"
            secureTextEntry
          />
          <FormField
            label="Confirm Password"
            value={form.confirmPassword}
            onChangeText={(confirmPassword) => setForm((current) => ({ ...current, confirmPassword }))}
            placeholder="Confirm your password"
            secureTextEntry
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>Select Your Interests</Text>
          <View style={styles.chipWrap}>
            {categories.map((interest) => (
              <InterestChip
                key={interest}
                label={interest}
                selected={selectedInterests.includes(interest)}
                onPress={() => toggleInterest(interest)}
              />
            ))}
          </View>
        </View>

        <PrimaryButton label="Create Account" onPress={() => navigation.getParent()?.replace('User')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
  logoSpacing: {
    marginTop: -spacing.sm,
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    marginBottom: spacing.md,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
