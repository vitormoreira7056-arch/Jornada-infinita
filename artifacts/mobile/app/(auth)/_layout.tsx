import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthLayout() {
  // Always call hooks unconditionally at the top
  let authResult: ReturnType<typeof useAuth> | null = null;
  
  try {
    authResult = useAuth();
  } catch (e) {
    // Clerk not available (no key) - will be handled below
  }
  
  const isSignedIn = authResult?.isSignedIn || false;
  const authLoaded = authResult?.isLoaded || true;
  
  const [devMode, setDevMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("__dev_mode_user").then((val) => {
      setDevMode(!!val);
      setIsLoading(false);
    });
  }, []);

  // Show loading while checking dev mode
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#08080F", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#C8A84B" />
      </View>
    );
  }

  // Only redirect if user is actually signed in OR dev mode was explicitly activated
  const allowAccess = isSignedIn || devMode;

  if (allowAccess) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="race-select" />
    </Stack>
  );
}