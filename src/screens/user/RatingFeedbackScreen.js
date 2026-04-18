import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AppHeader from '../../components/AppHeader';
import RatingStars from '../../components/RatingStars';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppContext } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function RatingFeedbackScreen({ navigation, route }) {
  const { eventId } = route.params;
  const { events } = useAppContext();
  const event = events.find((item) => item.id === eventId);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader title="Rating & Feedback" onBack={() => navigation.goBack()} />
        <Text style={styles.title}>{event?.title}</Text>
        <RatingStars rating={rating} onChange={setRating} size={34} />
        <FormField
          label="Your Feedback"
          value={feedback}
          onChangeText={setFeedback}
          placeholder="Write your comment here..."
          multiline
        />
        <PrimaryButton label="Submit" onPress={() => navigation.goBack()} />
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
  title: {
    ...typography.screenTitle,
    fontSize: 24,
  },
});
