import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { ZONES } from "@/constants/game";

export default function Battle() {
  const { state, startBattle, stopBattle, getTotalStats } = useGame();
  const race = state.raceId ? getRaceById(state.raceId) : null;
  const stats = getTotalStats();
  const zone = ZONES[state.zone - 1];

  const hpPercent = (state.monsterHp / state.monsterMaxHp) * 100;
  const playerHpPercent = (state.hp / state.maxHp) * 100;

  return (
    <View style={styles.container}>
      {/* Zone Info */}
      <View style={styles.zoneInfo}>
        <Text style={styles.zoneName}>{zone?.name || "Zona 1"}</Text>
        <Text style={styles.stage}>Estágio {state.stage}/10</Text>
      </View>

      {/* Battle Area */}
      <View style={styles.battleArea}>
        {/* Player */}
        <View style={styles.combatant}>
          <Text style={styles.emoji}>{race?.emoji}</Text>
          <View style={styles.hpBar}>
            <View style={[styles.hpFill, { width: `${playerHpPercent}%`, backgroundColor: "#4CAF50" }]} />
          </View>
          <Text style={styles.hpText}>
            {state.hp}/{state.maxHp}
          </Text>
          <Text style={styles.name}>{state.playerName}</Text>
        </View>

        {/* VS */}
        <Text style={styles.vs}>VS</Text>

        {/* Monster */}
        <View style={styles.combatant}>
          <Text style={styles.emoji}>👹</Text>
          <View style={styles.hpBar}>
            <View style={[styles.hpFill, { width: `${hpPercent}%`, backgroundColor: "#f44336" }]} />
          </View>
          <Text style={styles.hpText}>
            {state.monsterHp}/{state.monsterMaxHp}
          </Text>
          <Text style={styles.name}>{state.monsterName || "???"}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statEmoji}>⚔️</Text>
          <Text style={styles.statValue}>{stats.atk}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statEmoji}>🛡️</Text>
          <Text style={styles.statValue}>{stats.def}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statEmoji}>💥</Text>
          <Text style={styles.statValue}>{Math.round(stats.critRate * 100)}%</Text>
        </View>
      </View>

      {/* XP Bar */}
      <View style={styles.xpSection}>
        <Text style={styles.xpText}>
          XP: {state.exp}/{state.level * 100}
        </Text>
        <View style={styles.xpBar}>
          <View
            style={[styles.xpFill, { width: `${(state.exp / (state.level * 100)) * 100}%` }]}
          />
        </View>
      </View>

      {/* Battle Button */}
      <TouchableOpacity
        style={[styles.battleBtn, state.battleActive && styles.battleBtnActive]}
        onPress={state.battleActive ? stopBattle : startBattle}
      >
        <Text style={styles.battleBtnText}>
          {state.battleActive ? "⏸️ Pausar" : "▶️ Batalhar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    padding: 16,
  },
  zoneInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  zoneName: {
    color: "#f0f0f0",
    fontSize: 20,
    fontWeight: "bold",
  },
  stage: {
    color: "#888",
    fontSize: 14,
    marginTop: 4,
  },
  battleArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  combatant: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  hpBar: {
    width: 100,
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: "hidden",
  },
  hpFill: {
    height: "100%",
  },
  hpText: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  name: {
    color: "#f0f0f0",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  vs: {
    color: "#666",
    fontSize: 24,
    fontWeight: "bold",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  stat: {
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    color: "#f0f0f0",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  xpSection: {
    marginBottom: 20,
  },
  xpText: {
    color: "#888",
    fontSize: 12,
    marginBottom: 8,
  },
  xpBar: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: "hidden",
  },
  xpFill: {
    height: "100%",
    backgroundColor: "#2196F3",
  },
  battleBtn: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  battleBtnActive: {
    backgroundColor: "#f44336",
  },
  battleBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
