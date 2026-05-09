import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GameProvider } from "@/context/GameContext";

// @ts-ignore
export default function RootLayout() {
  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="player-setup" />
        <Stack.Screen name="race-select" />
        <Stack.Screen name="(game)" />
      </Stack>
      <StatusBar style="light" />
    </GameProvider>
  );
}
