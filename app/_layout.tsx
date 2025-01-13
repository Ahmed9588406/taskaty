import 'react-native-reanimated';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SupabaseProvider } from '@/context/SupabaseContext';
import Toast, { BaseToastProps } from 'react-native-toast-message';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

// Cache the Clerk JWT
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const toastConfig = {
  success: (props: BaseToastProps) => (
    <View style={{ 
      height: 60,
      width: '90%',
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 8,
      marginBottom: 40
    }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{props.text1}</Text>
      <Text style={{ color: 'white', fontSize: 14 }}>{props.text2}</Text>
    </View>
  ),
  error: (props: BaseToastProps) => (
    <View style={{ 
      height: 60,
      width: '90%',
      backgroundColor: '#F44336',
      padding: 10,
      borderRadius: 8,
      marginBottom: 40
    }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{props.text1}</Text>
      <Text style={{ color: 'white', fontSize: 14 }}>{props.text2}</Text>
    </View>
  ),
  info: (props: BaseToastProps) => (
    <View style={{ 
      height: 60,
      width: '90%',
      backgroundColor: Colors.primary,
      padding: 10,
      borderRadius: 8,
      marginBottom: 40
    }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{props.text1}</Text>
      <Text style={{ color: 'white', fontSize: 14 }}>{props.text2}</Text>
    </View>
  ),
};

const InitialLayout = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(authenticated)';

    if (isSignedIn && !inAuthGroup) {
      router.replace('/(authenticated)/(tabs)/boards');
    } else if (!isSignedIn) {
      router.replace('/');
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SupabaseProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
      </Stack>
    </SupabaseProvider>
  );
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <StatusBar style="light" />
      <ActionSheetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <InitialLayout />
          <Toast config={toastConfig} />
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </ClerkProvider>
  );
};
export default RootLayoutNav;