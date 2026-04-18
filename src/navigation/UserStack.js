import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserTabs from './UserTabs';
import EventDetailsScreen from '../screens/user/EventDetailsScreen';
import MyEventsScreen from '../screens/user/MyEventsScreen';
import RatingFeedbackScreen from '../screens/user/RatingFeedbackScreen';
import EditInterestsScreen from '../screens/user/EditInterestsScreen';
import EditProfileScreen from '../screens/user/EditProfileScreen';
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserTabs" component={UserTabs} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="MyEvents" component={MyEventsScreen} />
      <Stack.Screen name="RatingFeedback" component={RatingFeedbackScreen} />
      <Stack.Screen name="EditInterests" component={EditInterestsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}
