import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import BrandLogo from '../../components/BrandLogo';

export default function SplashScreen({ onFinish }) {
  return (
    <LinearGradient colors={['#F7F8FC', '#E9EEFB', '#F7F8FC']} style={styles.container}>
      <View style={styles.card}>
        <BrandLogo width={300} height={300} style={styles.logoSpacing} />
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={styles.loadingText}>Preparing your event experience...</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoSpacing: {
    marginBottom: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 12,
  },
  loadingText: {
    ...typography.caption,
  },
});
