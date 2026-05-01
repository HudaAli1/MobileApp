import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AppHeader from '../../components/AppHeader';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import { useAppContext } from '../../context/AppContext';
import { isValidEmail, isUniversityEmail, validateLoginForm, validatePasswordChange } from '../../utils/authValidation';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function ForgotPasswordScreen({ navigation }) {
  const { passwordReset, beginPasswordReset, resendPasswordResetCode, completePasswordReset } = useAppContext();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSendCode = async () => {
    const nextErrors = validateLoginForm({ email, password: 'placeholder' });
    delete nextErrors.password;
    if (!nextErrors.email && !isValidEmail(email)) {
      nextErrors.email = 'يرجى إدخال بريد إلكتروني صحيح.';
    } else if (!nextErrors.email && !isUniversityEmail(email)) {
      nextErrors.email = 'يرجى استخدام البريد الجامعي المنتهي بـ @iau.edu.sa.';
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    const result = await beginPasswordReset(email);
    if (!result.success) {
      Alert.alert('نسيت كلمة المرور', result.message);
      return;
    }

    Alert.alert('رمز التحقق', `رمز إعادة التعيين: ${result.payload.code}`);
  };

  const handleResetPassword = async () => {
    const validation = validatePasswordChange({
      currentPassword: 'skip',
      newPassword,
      confirmNewPassword: confirmPassword,
    });
    delete validation.currentPassword;
    if (!code.trim()) {
      validation.code = 'رمز التحقق مطلوب.';
    }
    setErrors(validation);

    if (Object.keys(validation).length) {
      return;
    }

    const result = await completePasswordReset({ code, newPassword });
    if (!result.success) {
      Alert.alert('نسيت كلمة المرور', result.message);
      return;
    }

    Alert.alert('نسيت كلمة المرور', result.message);
    navigation.goBack();
  };

  const handleResend = async () => {
    const payload = await resendPasswordResetCode();
    if (!payload) {
      Alert.alert('نسيت كلمة المرور', 'لا يوجد طلب إعادة تعيين نشط.');
      return;
    }
    Alert.alert('رمز التحقق', `رمز إعادة التعيين الجديد: ${payload.code}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader title="Forgot Password" onBack={() => navigation.goBack()} />
        <View style={styles.form}>
          <Text style={styles.info}>أدخلي بريدك الجامعي ثم استخدمي رمز التحقق لإعادة تعيين كلمة المرور.</Text>
          <FormField
            label="University Email *"
            value={email}
            onChangeText={setEmail}
            placeholder="student@iau.edu.sa"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <PrimaryButton label="Send Code" onPress={handleSendCode} />
          {passwordReset ? (
            <>
              <Text style={styles.demoCode}>رمز العرض التجريبي: {passwordReset.code}</Text>
              <FormField
                label="Verification Code *"
                value={code}
                onChangeText={setCode}
                placeholder="Enter 6-digit code"
                keyboardType="number-pad"
                autoCapitalize="none"
                error={errors.code}
              />
              <FormField
                label="New Password *"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
                autoCapitalize="none"
                error={errors.newPassword}
              />
              <FormField
                label="Confirm Password *"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
                autoCapitalize="none"
                error={errors.confirmNewPassword}
              />
              <PrimaryButton label="Reset Password" onPress={handleResetPassword} />
              <SecondaryButton label="Resend Code" onPress={handleResend} />
            </>
          ) : null}
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
  form: {
    gap: spacing.md,
  },
  info: {
    ...typography.body,
  },
  demoCode: {
    ...typography.sectionTitle,
    color: colors.primary,
    textAlign: 'center',
  },
});
