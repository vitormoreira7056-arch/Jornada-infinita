import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useGame } from "@/context/GameContext";

export default function Skills() {
  const { state } = useGame();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ SKILLS</Text>
        <Text style={styles.headerSubtitle}>Habilidades e talentos</Text>
      </View>

      {/* Skill Points */}
      <View style={styles.pointsCard}>
        <View style={styles.pointsInfo}>
          <Text style={styles.pointsLabel}>PONTOS DISPONÍVEIS</Text>
          <Text style={styles.pointsValue}>0</Text>
        </View>
        <TouchableOpacity style={styles.resetButton}>
          <Text style={styles.resetText}>↺ RESETAR</Text>
        </TouchableOpacity>
      </View>

      {/* Skill Trees */}
      <Text style={styles.sectionTitle}>ÁRVORES DE HABILIDADES</Text>
      
      <View style={styles.skillTreeCard}>
        <View style={styles.treeHeader}>
          <Text style={styles.treeIcon}>⚔️</Text>
          <View>
            <Text style={styles.treeName}>COMBATE</Text>
            <Text style={styles.treeDesc}>Aumente seu poder de ataque</Text>
          </View>
        </View>
        <View style={styles.skillRow}>
          <View style={styles.skillNode}>
            <Text style={styles.skillEmoji}>🗡️</Text>
          </View>
          <View style={styles.skillLine} />
          <View style={styles.skillNode}>
            <Text style={styles.skillEmoji}>⚔️</Text>
          </View>
          <View style={styles.skillLine} />
          <View style={styles.skillNode}>
            <Text style={styles.skillEmoji}>💥</Text>
          </View>
        </View>
      </View>

      <View style={styles.skillTreeCard}>
        <View style={styles.treeHeader}>
          <Text style={styles.treeIcon}>🛡️</Text>
          <View>
            <Text style={styles.treeName}>DEFESA</Text>
            <Text style={styles.treeDesc}>Aumente sua resistência</Text>
          </View>
        </View>
        <View style={styles.skillRow}>
          <View style={styles.skillNode}>
            <Text style={styles.skillEmoji}>🛡️</Text>
          </View>
          <View style={styles.skillLine} />
          <View style={styles.skillNode}>
            <Text style={styles.skillEmoji}>❤️</Text>
          </View>
          <View style={styles.skillLine} />
          <View style={styles.skillNode}>
            <Text style={styles.skillEmoji}>🧱</Text>
          </View>
        </View>
      </View>

      <View style={styles.skillTreeCard}>
        <View style={styles.treeHeader}>
          <Text style={styles.treeIcon}>✨</Text>
          <View>
            <Text style={styles.treeName}>MAGIA</Text>
            <Text style={styles.treeDesc}>Domine os elementos</Text>
          </View>
        </View>
        <View style={styles.skillRow}>
          <View style={styles.skillNode}>
            <Text style={styles.skillEmoji}>🔥</Text>
          </View>
          <View style={styles.skillLine} />
          <View style={styles.skillNode}>
            <Text style={styles.skillEmoji}>❄️</Text>
          </View>
          <View style={styles.skillLine} />
          <View style={styles.skillNode}>
            <Text style={styles.skillEmoji}>⚡</Text>
          </View>
        </View>
      </View>

      {/* Coming Soon */}
      <View style={styles.comingSoon}>
        <Text style={styles.comingSoonEmoji}>🚧</Text>
        <Text style={styles.comingSoonText}>Sistema de skills em desenvolvimento</Text>
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
  pointsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#12121a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  pointsValue: {
    color: "#7c3aed",
    fontSize: 32,
    fontWeight: "700",
  },
  resetButton: {
    backgroundColor: "#1e1e2e",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },
  skillTreeCard: {
    backgroundColor: "#12121a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  treeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  treeIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  treeName: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 2,
  },
  treeDesc: {
    color: "#64748b",
    fontSize: 12,
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  skillNode: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0a0a0f",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1e1e2e",
  },
  skillLine: {
    width: 30,
    height: 2,
    backgroundColor: "#1e1e2e",
  },
  skillEmoji: {
    fontSize: 24,
  },
  comingSoon: {
    alignItems: "center",
    paddingVertical: 40,
  },
  comingSoonEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  comingSoonText: {
    color: "#64748b",
    fontSize: 14,
  },
});
