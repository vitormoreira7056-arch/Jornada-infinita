import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { router } from "expo-router";

export default function Home() {
  const { state, getTotalStats } = useGame();
  const race = state.raceId ? getRaceById(state.raceId) : null;
  const stats = getTotalStats();

  // Calculate progress to next level
  const expNeeded = state.level * 100;
  const expProgress = (state.exp / expNeeded) * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Character Card */}
      <View style={styles.characterCard}>
        <View style={styles.characterHeader}>
          <View style={[styles.avatarCircle, { borderColor: race?.color || "#7c3aed" }]}>
            <Text style={styles.avatarEmoji}>{race?.emoji}</Text>
          </View>
          <View style={styles.characterInfo}>
            <Text style={styles.characterName}>{state.playerName}</Text>
            <Text style={styles.characterRace}>{race?.name}</Text>
            <View style={styles.genderBadge}>
              <Text style={styles.genderText}>
                {state.gender === "male" ? "♂️ Masculino" : "♀️ Feminino"}
              </Text>
            </View>
          </View>
        </View>

        {/* Level & XP */}
        <View style={styles.levelSection}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelText}>NÍVEL {state.level}</Text>
            <Text style={styles.expText}>{state.exp} / {expNeeded} XP</Text>
          </View>
          <View style={styles.expBar}>
            <View style={[styles.expFill, { width: `${expProgress}%` }]} />
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <Text style={styles.sectionTitle}>ATRIBUTOS</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⚔️</Text>
          <Text style={styles.statValue}>{stats.atk}</Text>
          <Text style={styles.statLabel}>ATAQUE</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🛡️</Text>
          <Text style={styles.statValue}>{stats.def}</Text>
          <Text style={styles.statLabel}>DEFESA</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={styles.statValue}>{stats.hp}</Text>
          <Text style={styles.statLabel}>VIDA</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💥</Text>
          <Text style={styles.statValue}>{Math.round(stats.critRate * 100)}%</Text>
          <Text style={styles.statLabel}>CRÍTICO</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⚡</Text>
          <Text style={styles.statValue}>{stats.atkSpeed.toFixed(1)}</Text>
          <Text style={styles.statLabel}>VELOCIDADE</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>👟</Text>
          <Text style={styles.statValue}>{stats.moveSpeed.toFixed(1)}</Text>
          <Text style={styles.statLabel}>MOVIMENTO</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>AÇÕES RÁPIDAS</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push("/(game)/adventure")}
        >
          <Text style={styles.actionIcon}>🗺️</Text>
          <Text style={styles.actionTitle}>AVENTURA</Text>
          <Text style={styles.actionDesc}>Explore e batalhe</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push("/(game)/inventory")}
        >
          <Text style={styles.actionIcon}>🎒</Text>
          <Text style={styles.actionTitle}>MOCHILA</Text>
          <Text style={styles.actionDesc}>Gerencie itens</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push("/(game)/skills")}
        >
          <Text style={styles.actionIcon}>✨</Text>
          <Text style={styles.actionTitle}>SKILLS</Text>
          <Text style={styles.actionDesc}>Habilidades</Text>
        </TouchableOpacity>
      </View>

      {/* Race Info */}
      <Text style={styles.sectionTitle}>RAÇA</Text>
      <View style={styles.raceCard}>
        <Text style={styles.raceLore}>{race?.lore}</Text>
        <View style={styles.elementsRow}>
          {race?.primaryElements.map((e) => (
            <View key={e} style={styles.elementTag}>
              <Text style={styles.elementText}>{e}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    padding: 16,
  },
  characterCard: {
    backgroundColor: "#12121a",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  characterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0a0a0f",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    marginRight: 16,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  characterRace: {
    color: "#7c3aed",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  genderBadge: {
    backgroundColor: "#1e1e2e",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  genderText: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
  },
  levelSection: {
    marginTop: 8,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  levelText: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "700",
  },
  expText: {
    color: "#64748b",
    fontSize: 12,
  },
  expBar: {
    height: 8,
    backgroundColor: "#0a0a0f",
    borderRadius: 4,
    overflow: "hidden",
  },
  expFill: {
    height: "100%",
    backgroundColor: "#7c3aed",
    borderRadius: 4,
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  statCard: {
    width: "31%",
    backgroundColor: "#12121a",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#12121a",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionTitle: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  actionDesc: {
    color: "#64748b",
    fontSize: 10,
    textAlign: "center",
  },
  raceCard: {
    backgroundColor: "#12121a",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e1e2e",
    marginBottom: 20,
  },
  raceLore: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  elementsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  elementTag: {
    backgroundColor: "#1e1e2e",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  elementText: {
    color: "#7c3aed",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
