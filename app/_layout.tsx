import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';

// Wraps every screen in app/. A Stack keeps a history of screens, like browser history.
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Word Hunt Trainer', headerShown: false }} />
        <Stack.Screen name="game" options={{ title: 'Game' }} />
      </Stack>
    </>
  );
}
