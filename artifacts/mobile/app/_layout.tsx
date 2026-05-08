import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { ClerkLoaded, ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GameProvider } from "@/context/GameContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#08080F" } }}>
      <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
      <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
      <Stack.Screen name="race-select" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [devMode, setDevMode] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("__dev_mode_user").then((val) => {
      if (val) setDevMode(true);
    });
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Safety timeout: hide splash after 8s even if Clerk/fonts hang
  useEffect(() => {
    const t = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  if (!fontsLoaded && !fontError) return null;
  
  // Wait for dev mode check to complete
  if (devMode === null) return null;

  // Dev mode: bypass Clerk entirely (only when explicitly activated by user)
  if (devMode) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <QueryClientProvider client={queryClient}>
              <ErrorBoundary>
                <GameProvider>
                  <RootLayoutNav />
                </GameProvider>
              </ErrorBoundary>
            </QueryClientProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  // Check if Clerk key is available
  const hasClerkKey = publishableKey && publishableKey !== "undefined" && publishableKey !== "null";

  // If no Clerk key, render without ClerkProvider
  // Auth layout will handle showing login with dev mode option
  if (!hasClerkKey) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <QueryClientProvider client={queryClient}>
              <ErrorBoundary>
                <GameProvider>
                  <RootLayoutNav />
                </GameProvider>
              </ErrorBoundary>
            </QueryClientProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <ClerkProvider 
            publishableKey={publishableKey} 
            tokenCache={tokenCache}
          >
            <ClerkLoaded>
              <QueryClientProvider client={queryClient}>
                <ErrorBoundary>
                  <GameProvider>
                    <RootLayoutNav />
                  </GameProvider>
                </ErrorBoundary>
              </QueryClientProvider>
            </ClerkLoaded>
          </ClerkProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}