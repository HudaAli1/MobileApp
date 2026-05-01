import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AppHeader from '../../components/AppHeader';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import { useAppContext } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function EmailVerificationScreen({ navigation }) {
  const { pendingSignup, resendSignUpCode, verifySignUpCode } = useAppContext();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    const result = await verifySignUpCode(code);
    if (!result.success) {
      setError(result.message);
      return;
    }

    Alert.alert('التحقق', 'تم إنشاء الحساب وتسجيل الدخول بنجاح');
    navigation.getParent()?.replace('User');
  };

  const handleResend = async () => {
    const nextPayload = await resendSignUpCode();
    if (!nextPayload) {
      Alert.alert('التحقق', 'لا يوجد طلب تحقق نشط.');
      return;
    }
    Alert.alert('رمز التحقق', `رمز التحقق الجديد: ${nextPayload.code}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader title="Email Verification" onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          <Text style={styles.title}>تم إرسال رمز التحقق إلى بريدك الجامعي</Text>
          <Text style={styles.subtitle}>رمز العرض التجريبي: {pendingSignup?.code || '------'}</Text>
          <FormField
            label="Verification Code"
            value={code}
            onChangeText={(value) => {
              setCode(value);
              if (error) setError('');
            }}
            placeholder="Enter 6-digit code"
            keyboardType="number-pad"
            autoCapitalize="none"
            error={error}
          />
          <PrimaryButton label="Verify" onPress={handleVerify} />
          <SecondaryButton label="Resend Code" onPress={handleResend} />
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
    gap: spacing.lg,
  },
  content: {
    gap: spacing.md,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
  },
});
