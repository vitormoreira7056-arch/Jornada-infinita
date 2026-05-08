import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthLayout() {
  let isSignedIn = false;
  
  try {
    const auth = useAuth();
    isSignedIn = auth.isSignedIn;
  } catch (e) {
    // Clerk not available (no key) - ignore error, user can use dev mode
  }
  
  const [devMode, setDevMode] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("__dev_mode_user").then((val) => {
      setDevMode(!!val);
    });
  }, []);

  if (devMode === null) return null;

  // Only redirect if user is actually signed in OR dev mode was explicitly activated
  // Don't redirect just because Clerk is not available - show login screen instead
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