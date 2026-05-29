// Import React Native components
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';

// Import SafeAreaView for handling safe screen areas
import { SafeAreaView } from 'react-native-safe-area-context';

// Import React hook
import { useState } from 'react';

// Import reusable custom components
import AppHeader from '../../components/AppHeader';
import RatingStars from '../../components/RatingStars';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';

// Import app context
import { useAppContext } from '../../context/AppContext';

// Import styling constants
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

// Main screen component
export default function RatingFeedbackScreen({ navigation, route }) {

  // Get event ID from navigation route
  const { eventId } = route.params;

  // Get events, ratings, and submit function from context
  const { events, submitRating, ratings } = useAppContext();

  // Find selected event
  const event = events.find((item) => item.id === eventId);

  // Check if user already submitted a rating
  const existingRating = ratings.find(
    (item) => item.eventId === eventId
  );

  // Store rating state
  const [rating, setRating] = useState(
    existingRating?.value ?? 0
  );

  // Store feedback/comment state
  const [feedback, setFeedback] = useState(
    existingRating?.comment ?? ''
  );

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Main scroll container */}
      <ScrollView contentContainerStyle={styles.container}>

        {/* Screen header */}
        <AppHeader
          title="Rating & Feedback"
          onBack={() => navigation.goBack()}
        />

        {/* Event title */}
        <Text style={styles.title}>{event?.title}</Text>

        {/* Star rating component */}
        <RatingStars
          rating={rating}
          onChange={setRating}
          size={34}
        />

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

          // Submit rating and feedback
          onPress={async () => {

            // Save rating data
            await submitRating({
              eventId,
              value: rating,
              comment: feedback,
            });

            // Show success message
            Alert.alert(
              'التقييم',
              'تم إرسال التقييم بنجاح'
            );

            // Navigate back after submission
            navigation.goBack();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Screen styles
const styles = StyleSheet.create({

  // Main safe area styling
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Main container spacing
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },

  // Event title styling
  title: {
    ...typography.screenTitle,
    fontSize: 24,
  },
});
