import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GameProvider } from "@/context/GameContext";

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="race-select" />
        <Stack.Screen name="(game)" />
      </Stack>
      <StatusBar style="light" />
    </GameProvider>
  );
}
