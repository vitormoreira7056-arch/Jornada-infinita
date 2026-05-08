import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthLayout() {
  let isSignedIn = false;
  let authError = false;
  
  try {
    const auth = useAuth();
    isSignedIn = auth.isSignedIn;
  } catch (e) {
    // Clerk not available (no key), will fall back to dev mode
    authError = true;
  }
  
  const [devMode, setDevMode] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("__dev_mode_user").then((val) => {
      setDevMode(!!val);
    });
  }, []);

  if (devMode === null) return null;

  // If auth error (Clerk not available) or dev mode, allow access
  const allowAccess = isSignedIn || devMode || authError;

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