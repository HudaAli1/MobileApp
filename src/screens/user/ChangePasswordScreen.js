import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AppHeader from '../../components/AppHeader';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppContext } from '../../context/AppContext';
import { validatePasswordChange } from '../../utils/authValidation';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

export default function ChangePasswordScreen({ navigation }) {
  const { changePassword } = useAppContext();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    const nextErrors = validatePasswordChange({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    const result = await changePassword({ currentPassword, newPassword });
    Alert.alert('كلمة المرور', result.message);
    if (result.success) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader title="Change Password" onBack={() => navigation.goBack()} />
        <View style={styles.form}>
          <FormField
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            secureTextEntry
            autoCapitalize="none"
            error={errors.currentPassword}
          />
          <FormField
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry
            autoCapitalize="none"
            error={errors.newPassword}
          />
          <FormField
            label="Confirm New Password"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            placeholder="Confirm new password"
            secureTextEntry
            autoCapitalize="none"
            error={errors.confirmNewPassword}
          />
        </View>
        <PrimaryButton label="Save" onPress={handleSave} />
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
});
