import { useEffect, useMemo, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import UserStack from './UserStack';
import AdminStack from './AdminStack';
import SplashScreen from '../screens/auth/SplashScreen';
import { AppProvider, useAppContext } from '../context/AppContext';
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

function RootFlow() {
  const { user, isHydrated } = useAppContext();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!isHydrated) return undefined;
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, [isHydrated]);

  const orderedScreens = useMemo(() => {
    const target = !user ? 'Auth' : user.role === 'admin' ? 'Admin' : 'User';

    if (target === 'Admin') {
      return [
        <Stack.Screen key="admin" name="Admin" component={AdminStack} />,
        <Stack.Screen key="auth" name="Auth" component={AuthNavigator} />,
        <Stack.Screen key="user" name="User" component={UserStack} />,
      ];
    }

    if (target === 'User') {
      return [
        <Stack.Screen key="user" name="User" component={UserStack} />,
        <Stack.Screen key="auth" name="Auth" component={AuthNavigator} />,
        <Stack.Screen key="admin" name="Admin" component={AdminStack} />,
      ];
    }

    return [
      <Stack.Screen key="auth" name="Auth" component={AuthNavigator} />,
      <Stack.Screen key="user" name="User" component={UserStack} />,
      <Stack.Screen key="admin" name="Admin" component={AdminStack} />,
    ];
  }, [user]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showSplash || !isHydrated ? <Stack.Screen name="Splash" component={SplashScreen} /> : null}
        {!showSplash && isHydrated ? orderedScreens : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function RootNavigator() {
  return (
    <AppProvider>
      <RootFlow />
    </AppProvider>
  );
}
