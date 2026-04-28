import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import BrandLogo from '../../components/BrandLogo';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import { useAppContext } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { radii, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function SettingsScreen({ navigation }) {
  const { user } = useAppContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader title="Settings" />
        <View style={styles.topSection}>
          <BrandLogo width={300} height={220} style={styles.logoSpacing} />
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <View style={styles.actions}>
          <SecondaryButton label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
          <SecondaryButton label="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
          <SecondaryButton label="My Events" onPress={() => navigation.navigate('MyEvents')} />
          <SecondaryButton label="Edit Interests" onPress={() => navigation.navigate('EditInterests')} />
          <PrimaryButton
            label="Logout"
            onPress={() => navigation.getParent()?.getParent()?.replace('Auth')}
            style={styles.logout}
          />
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
    padding: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoSpacing: {
    marginBottom: 10,
  },
  name: {
    ...typography.sectionTitle,
    color: colors.primary,
  },
  email: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  actions: {
    gap: spacing.md,
  },
  logout: {
    backgroundColor: colors.danger,
  },
});
