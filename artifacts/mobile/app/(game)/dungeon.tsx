import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useGame } from "@/context/GameContext";
import { ZONES } from "@/constants/game";

export default function Dungeon() {
  const { state, selectZone } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ Dungeons</Text>
      <Text style={styles.subtitle}>Escolha onde batalhar</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {ZONES.map((zone, index) => {
          const zoneNum = index + 1;
          const isUnlocked = zoneNum <= state.maxZone;
          const isCurrent = zoneNum === state.zone;

          return (
            <TouchableOpacity
              key={zone.id}
              style={[
                styles.zoneCard,
                !isUnlocked && styles.zoneLocked,
                isCurrent && styles.zoneCurrent,
              ]}
              onPress={() => isUnlocked && selectZone(zoneNum)}
              disabled={!isUnlocked}
            >
              <View style={styles.zoneHeader}>
                <Text style={styles.zoneEmoji}>{zone.emoji}</Text>
                <View style={styles.zoneInfo}>
                  <Text style={styles.zoneName}>{zone.name}</Text>
                  <Text style={styles.zoneDesc}>{zone.description}</Text>
                </View>
                <View style={styles.zoneBadge}>
                  <Text style={styles.zoneLevel}>Nv.{zoneNum * 5}</Text>
                  {isCurrent && <Text style={styles.currentBadge}>ATUAL</Text>}
                  {!isUnlocked && <Text style={styles.lockedBadge}>🔒</Text>}
                </View>
              </View>

              <View style={styles.monsters}>
                <Text style={styles.monstersTitle}>Monstros:</Text>
                <View style={styles.monsterList}>
                  {zone.monsters.slice(0, 3).map((m) => (
                    <Text key={m.id} style={styles.monsterName}>
                      {m.emoji} {m.name}
                    </Text>
                  ))}
                </View>
              </View>

              <View style={styles.boss}>
                <Text style={styles.bossLabel}>👑 Boss:</Text>
                <Text style={styles.bossName}>{zone.bossName}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    marginBottom: 20,
  },
  zoneCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#333",
  },
  zoneLocked: {
    opacity: 0.5,
  },
  zoneCurrent: {
    borderColor: "#4CAF50",
  },
  zoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  zoneEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    color: "#f0f0f0",
    fontSize: 16,
    fontWeight: "bold",
  },
  zoneDesc: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  zoneBadge: {
    alignItems: "flex-end",
  },
  zoneLevel: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
  },
  currentBadge: {
    color: "#4CAF50",
    fontSize: 10,
    marginTop: 4,
  },
  lockedBadge: {
    fontSize: 16,
    marginTop: 4,
  },
  monsters: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 12,
  },
  monstersTitle: {
    color: "#888",
    fontSize: 12,
    marginBottom: 8,
  },
  monsterList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  monsterName: {
    color: "#aaa",
    fontSize: 12,
    backgroundColor: "#252525",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  boss: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  bossLabel: {
    color: "#FFD700",
    fontSize: 12,
    marginRight: 8,
  },
  bossName: {
    color: "#f0f0f0",
    fontSize: 14,
    fontWeight: "bold",
  },
});
