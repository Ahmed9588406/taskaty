import { Stack, useRouter, useSegments } from "expo-router";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";
import {ClerkProvider, SignedIn, useAuth} from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { SupabaseProvider } from "@/context/SupabaseContext";

import { View,ActivityIndicator } from "react-native";
import { Colors } from "@/constants/Colors";
import { useEffect } from "react";

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
  


const IntialLayout = () =>{
  const router = useRouter();
  const {isLoaded, isSignedIn} = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(authenticated)';
    if (isSignedIn && !inAuthGroup){
      router.replace('/(authenticated)/(tabs)/boards');
    } else if(!isSignedIn){
      router.replace('/')
    }

  },[isSignedIn])

  if (!isLoaded){
    return (
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size='large' color={Colors.primary}/>
      </View>
    )
  }
  return (
    <SupabaseProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="(authenticated)" options={{headerShown:false}} />
      </Stack>
    </SupabaseProvider>
  );
};

const RootLayoutNav =() => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
    <ActionSheetProvider>
      <GestureHandlerRootView style={{flex:1}}>
      <StatusBar style="light" />
        <IntialLayout />
      </GestureHandlerRootView>
    </ActionSheetProvider>
    </ClerkProvider>
  )
}
export default RootLayoutNav