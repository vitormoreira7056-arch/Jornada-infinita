import { Redirect } from "expo-router";
import { useGame } from "@/context/GameContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { state, isLoading } = useGame();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0f0f0f", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#f0f0f0" />
      </View>
    );
  }

  // No player name -> login
  if (!state.playerName) {
    return <Redirect href="/login" />;
  }

  // No race selected -> race select
  if (!state.raceId) {
    return <Redirect href="/race-select" />;
  }

  // Has everything -> game
  return <Redirect href="/(game)/battle" />;
}
