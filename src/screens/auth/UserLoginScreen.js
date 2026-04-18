import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import BrandLogo from '../../components/BrandLogo';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function UserLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <BrandLogo width={260} height={260} style={styles.logoSpacing} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to explore campus events curated for you.</Text>

        <View style={styles.form}>
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="student@iau.edu.sa"
            keyboardType="email-address"
          />
          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />
          <PrimaryButton label="Login" onPress={() => navigation.getParent()?.replace('User')} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')}>
          <Text style={styles.adminLink}>Admin Login</Text>
        </TouchableOpacity>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  logoSpacing: {
    marginBottom: 24,
  },
  title: {
    ...typography.screenTitle,
    textAlign: 'center',
    color: colors.primary,
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
});
