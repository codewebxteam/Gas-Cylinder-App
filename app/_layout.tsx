import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="delivery/[id]" options={{ headerShown: true, title: 'Delivery Details' }} />
        <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
