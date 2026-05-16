import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import BrandLogo from '../../components/BrandLogo';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import { useAppContext } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { radii, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

// Main settings screen component
export default function SettingsScreen({ navigation }) {

  // Get user data and functions from app context
  const { user, logout, locationStatus, fetchLocation } = useAppContext();

  // Prevent rendering if user data does not exist
  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Screen header */}
        <AppHeader title="Settings" />

        {/* Top section containing the app logo */}
        <View style={styles.topSection}>
          <BrandLogo width={300} height={220} style={styles.logoSpacing} />
        </View>

        {/* User profile information card */}
        <View style={styles.profileCard}>

          {/* User name */}
          <Text style={styles.name}>{user.name}</Text>

          {/* User email */}
          <Text style={styles.email}>{user.email}</Text>

          {/* User university ID */}
          <Text style={styles.meta}>{user.universityId}</Text>

          {/* User major */}
          <Text style={styles.meta}>{user.major}</Text>

          {/* User location status */}
          <Text style={styles.meta}>{locationStatus}</Text>
        </View>

        {/* Action buttons section */}
        <View style={styles.actions}>

          {/* Navigate to edit profile screen */}
          <SecondaryButton label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />

          {/* Navigate to change password screen */}
          <SecondaryButton label="Change Password" onPress={() => navigation.navigate('ChangePassword')} />

          {/* Navigate to user's registered events */}
          <SecondaryButton label="My Events" onPress={() => navigation.navigate('MyEvents')} />

          {/* Navigate to edit interests screen */}
          <SecondaryButton label="Edit Interests" onPress={() => navigation.navigate('EditInterests')} />

          {/* Check and fetch current location */}
          <SecondaryButton
            label="Check Location"
            onPress={async () => {

              // Fetch current location status
              const result = await fetchLocation();

              // Display location status alert
              Alert.alert('الموقع', result.status);
            }}
          />

          {/* Logout button */}
          <PrimaryButton
            label="Logout"
            onPress={async () => {

              // Logout user from the application
              await logout();

              // Navigate back to authentication screen
              navigation.getParent()?.getParent()?.replace('Auth');
            }}
            style={styles.logout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for the settings screen
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
  meta: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  actions: {
    gap: spacing.md,
  },
  logout: {
    backgroundColor: colors.danger,
  },
});
