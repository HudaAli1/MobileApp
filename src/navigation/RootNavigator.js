import { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import UserStack from './UserStack';
import AdminStack from './AdminStack';
import SplashScreen from '../screens/auth/SplashScreen';
import { AppProvider } from '../context/AppContext';
import { colors } from '../constants/colors';

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

export default function RootNavigator() {
  const [rootScreen, setRootScreen] = useState('Splash');

  useEffect(() => {
    if (rootScreen !== 'Splash') return undefined;
    const timer = setTimeout(() => {
      setRootScreen('Auth');
    }, 2200);
    return () => clearTimeout(timer);
  }, [rootScreen]);

  return (
    <AppProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {rootScreen === 'Splash' ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : null}
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="User" component={UserStack} />
          <Stack.Screen name="Admin" component={AdminStack} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
