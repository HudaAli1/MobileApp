import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
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

// Main screen component for rating and feedback
export default function RatingFeedbackScreen({ navigation, route }) {

  // Get event ID from navigation route parameters
  const { eventId } = route.params;

  // Access events, ratings, and submit function from app context
  const { events, submitRating, ratings } = useAppContext();

  // Find the selected event using the event ID
  const event = events.find((item) => item.id === eventId);

  // Check if the user has already submitted a rating
  const existingRating = ratings.find((item) => item.eventId === eventId);

  // State for rating value
  const [rating, setRating] = useState(existingRating?.value ?? 0);

  // State for feedback comment
  const [feedback, setFeedback] = useState(existingRating?.comment ?? '');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Screen header with back navigation */}
        <AppHeader title="Rating & Feedback" onBack={() => navigation.goBack()} />

        {/* Display event title */}
        <Text style={styles.title}>{event?.title}</Text>

        {/* Star rating component */}
        <RatingStars rating={rating} onChange={setRating} size={34} />

        {/* Feedback input field */}
        <FormField
          label="Your Feedback"
          value={feedback}
          onChangeText={setFeedback}
          placeholder="Write your comment here..."
          multiline
        />

        {/* Submit button */}
        <PrimaryButton
          label="Submit"
          onPress={async () => {

            // Save the user's rating and feedback
            await submitRating({ eventId, value: rating, comment: feedback });

            // Show confirmation alert
            Alert.alert('التقييم', 'تم إرسال التقييم بنجاح');

            // Navigate back to previous screen
            navigation.goBack();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for the screen
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
