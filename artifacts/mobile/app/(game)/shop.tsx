import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useGame } from "@/context/GameContext";

export default function Shop() {
  const { state } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏪 Loja</Text>
      <Text style={styles.subtitle}>Em breve...</Text>

      <View style={styles.comingSoon}>
        <Text style={styles.emoji}>🚧</Text>
        <Text style={styles.text}>
          A loja está em construção.
        </Text>
        <Text style={styles.subtext}>
          Em breve você poderá comprar itens especiais com suas moedas!
        </Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsTitle}>Seu Ouro</Text>
        <Text style={styles.gold}>🪙 {state.gold.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f0f0f0",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 40,
  },
  comingSoon: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    marginBottom: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  text: {
    color: "#f0f0f0",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtext: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
  stats: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  statsTitle: {
    color: "#888",
    fontSize: 14,
    marginBottom: 8,
  },
  gold: {
    color: "#FFD700",
    fontSize: 32,
    fontWeight: "bold",
  },
});
