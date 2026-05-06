import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AppHeader from '../../components/AppHeader';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppContext } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

export default function EditProfileScreen({ navigation }) {
  // Get user data and function to update profile from global context
  const { user, updateProfile } = useAppContext();

  // Local state for editable name field (initially from user data)
  const [name, setName] = useState(user?.name || '');

  // Local state for editable email field (initially from user data)
  const [email, setEmail] = useState(user?.email || '');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Top header with back navigation */}
        <AppHeader title="Edit Profile" onBack={() => navigation.goBack()} />

        <View style={styles.form}>
          
          {/* Name input field */}
          <FormField 
            label="Name" 
            value={name} 
            onChangeText={setName} 
            placeholder="Your name" 
          />

          {/* Email input field */}
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your.email@iau.edu.sa"
            keyboardType="email-address"
          />
        </View>

        {/* Save button updates profile and goes back */}
        <PrimaryButton
          label="Save"
          onPress={async () => {
            await updateProfile({ name, email }); // update user data
            Alert.alert('الحساب', 'تم حفظ معلومات الحساب بنجاح'); // success message
            navigation.goBack(); // return to previous screen
          }}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for layout and spacing
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
