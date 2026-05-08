import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthLayout() {
  const [devMode, setDevMode] = useState<boolean | null>(null);

  useEffect(() => {
    // Check dev mode from AsyncStorage
    AsyncStorage.getItem("__dev_mode_user").then((val) => {
      setDevMode(!!val);
    });
  }, []);

  // Show loading while checking dev mode
  if (devMode === null) {
    return (
      <View style={{ flex: 1, backgroundColor: "#08080F", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#C8A84B" />
      </View>
    );
  }

  // If dev mode is active, redirect to tabs
  if (devMode) {
    return <Redirect href="/(tabs)" />;
  }

  // Otherwise show auth screens (login/sign-up)
  // The sign-in screen will handle Clerk authentication if available
  // or provide a "Dev Mode" button for offline access
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
