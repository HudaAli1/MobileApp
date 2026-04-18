import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AppHeader from '../../components/AppHeader';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppContext } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAppContext();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader title="Edit Profile" onBack={() => navigation.goBack()} />
        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} placeholder="Your name" />
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your.email@iau.edu.sa"
            keyboardType="email-address"
          />
        </View>
        <PrimaryButton
          label="Save"
          onPress={() => {
            updateProfile({ name, email });
            navigation.goBack();
          }}
        />
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
