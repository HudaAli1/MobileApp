import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserLoginScreen from '../screens/auth/UserLoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import AdminLoginScreen from '../screens/auth/AdminLoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserLogin" component={UserLoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
    </Stack.Navigator>
  );
}
