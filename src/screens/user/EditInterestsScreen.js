import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AppHeader from '../../components/AppHeader';
import InterestChip from '../../components/InterestChip';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppContext } from '../../context/AppContext';
import { categories } from '../../utils/eventHelpers';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

export default function EditInterestsScreen({ navigation }) {
  const { user, updateInterests } = useAppContext();
  const [selected, setSelected] = useState(user.interests);

  const toggle = (interest) => {
    setSelected((current) =>
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader title="Edit Your Interests" onBack={() => navigation.goBack()} />
        <View style={styles.wrap}>
          {categories.map((interest, index) => (
            <InterestChip
              key={`edit-interest-${index}-${interest}`}
              label={interest}
              selected={selected.includes(interest)}
              onPress={() => toggle(interest)}
            />
          ))}
        </View>
        <PrimaryButton
          label="Save Changes"
          onPress={async () => {
            await updateInterests(selected);
            Alert.alert('الاهتمامات', 'تم تحديث الاهتمامات بنجاح');
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
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
