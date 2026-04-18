import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import AppHeader from '../../components/AppHeader';
import BrandLogo from '../../components/BrandLogo';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader title="Admin Login" onBack={() => navigation.goBack()} />
        <BrandLogo width={260} height={260} style={styles.logoSpacing} />
        <Text style={styles.subtitle}>Sign in to manage campus events and organizer tasks.</Text>
        <View style={styles.form}>
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="admin@iau.edu.sa"
            keyboardType="email-address"
          />
          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />
          <PrimaryButton label="Login" onPress={() => navigation.getParent()?.replace('Admin')} />
        </View>
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
  subtitle: {
    ...typography.body,
  },
  logoSpacing: {
    marginTop: -spacing.sm,
    marginBottom: 24,
  },
  form: {
    gap: spacing.md,
  },
});
