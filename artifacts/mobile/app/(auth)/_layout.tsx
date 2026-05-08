import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();
  const [devMode, setDevMode] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("__dev_mode_user").then((val) => {
      setDevMode(!!val);
    });
  }, []);

  if (devMode === null) return null;

  if (isSignedIn || devMode) {
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