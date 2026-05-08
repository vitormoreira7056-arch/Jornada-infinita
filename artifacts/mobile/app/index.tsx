import { Redirect } from "expo-router";
import { useGame } from "@/context/GameContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { state, isLoading } = useGame();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0a0a0f", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  // Not logged in -> login
  if (!state.isLoggedIn) {
    return <Redirect href="/login" />;
  }

  // No player name -> player setup
  if (!state.playerName) {
    return <Redirect href="/player-setup" />;
  }

  // No race selected -> race select
  if (!state.raceId) {
    return <Redirect href="/race-select" />;
  }

  // Has everything -> game home
  return <Redirect href="/(game)" />;
}
