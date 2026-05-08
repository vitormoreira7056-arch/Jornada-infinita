import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useGame } from "@/context/GameContext";
import { ZONES } from "@/constants/game";

export default function Adventure() {
  const { state, addGold } = useGame();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🗺️ AVENTURA</Text>
        <Text style={styles.headerSubtitle}>Escolha onde explorar</Text>
      </View>

      {/* Quick Farm Button */}
      <TouchableOpacity style={styles.farmButton} onPress={() => addGold(10)}>
        <Text style={styles.farmIcon}>⚔️</Text>
        <View style={styles.farmTextContainer}>
          <Text style={styles.farmTitle}>BATALHA RÁPIDA</Text>
          <Text style={styles.farmDesc}>Ganhe ouro e experiência</Text>
        </View>
        <Text style={styles.farmArrow}>→</Text>
      </TouchableOpacity>

      {/* Zones */}
      <Text style={styles.sectionTitle}>ZONAS</Text>
      {ZONES.map((zone, index) => {
        const zoneNum = index + 1;
        const isUnlocked = zoneNum <= state.maxZone;
        const isCurrent = zoneNum === state.maxZone;

        return (
          <TouchableOpacity
            key={zone.id}
            style={[
              styles.zoneCard,
              !isUnlocked && styles.zoneLocked,
              isCurrent && styles.zoneCurrent,
            ]}
            disabled={!isUnlocked}
          >
            <View style={styles.zoneHeader}>
              <View style={[styles.zoneIconBox, { backgroundColor: `${zone.color}20` }]}>
                <Text style={styles.zoneEmoji}>{zone.emoji}</Text>
              </View>
              <View style={styles.zoneInfo}>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <Text style={styles.zoneDesc} numberOfLines={2}>{zone.description}</Text>
              </View>
              <View style={styles.zoneMeta}>
                {!isUnlocked ? (
                  <Text style={styles.lockedIcon}>🔒</Text>
                ) : isCurrent ? (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentText}>ATUAL</Text>
                  </View>
                ) : (
                  <Text style={styles.completedIcon}>✓</Text>
                )}
              </View>
            </View>

            <View style={styles.zoneFooter}>
              <View style={styles.monsterPreview}>
                <Text style={styles.monsterLabel}>MONSTROS:</Text>
                <View style={styles.monsterIcons}>
                  {zone.monsters.slice(0, 4).map((m, i) => (
                    <Text key={i} style={styles.monsterEmoji}>{m.emoji}</Text>
                  ))}
                </View>
              </View>
              <View style={styles.bossPreview}>
                <Text style={styles.bossLabel}>BOSS:</Text>
                <Text style={styles.bossName} numberOfLines={1}>{zone.bossName}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#64748b",
    fontSize: 14,
  },
  farmButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  farmIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  farmTextContainer: {
    flex: 1,
  },
  farmTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  farmDesc: {
    color: "#c4b5fd",
    fontSize: 13,
    marginTop: 2,
  },
  farmArrow: {
    color: "#fff",
    fontSize: 24,
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },
  zoneCard: {
    backgroundColor: "#12121a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  zoneLocked: {
    opacity: 0.5,
  },
  zoneCurrent: {
    borderColor: "#7c3aed",
  },
  zoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  zoneIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  zoneEmoji: {
    fontSize: 28,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  zoneDesc: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 18,
  },
  zoneMeta: {
    alignItems: "flex-end",
  },
  lockedIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  currentBadge: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  currentText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  completedIcon: {
    color: "#22c55e",
    fontSize: 20,
    fontWeight: "700",
  },
  zoneFooter: {
    borderTopWidth: 1,
    borderTopColor: "#1e1e2e",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monsterPreview: {
    flexDirection: "row",
    alignItems: "center",
  },
  monsterLabel: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "700",
    marginRight: 8,
  },
  monsterIcons: {
    flexDirection: "row",
    gap: 4,
  },
  monsterEmoji: {
    fontSize: 16,
  },
  bossPreview: {
    flexDirection: "row",
    alignItems: "center",
  },
  bossLabel: {
    color: "#f59e0b",
    fontSize: 10,
    fontWeight: "700",
    marginRight: 6,
  },
  bossName: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "600",
    maxWidth: 100,
  },
});
