import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useGame } from "@/context/GameContext";
import { RACES, RaceId } from "@/constants/races";
import { ELEMENTS } from "@/constants/elements";

export default function RaceSelect() {
  const [selectedRace, setSelectedRace] = useState<RaceId | null>(null);
  const [gender, setGender] = useState<"male" | "female">("male");
  const { selectRace, logout, state } = useGame();

  const handleConfirm = () => {
    if (selectedRace) {
      selectRace(selectedRace, gender);
      router.replace("/(game)");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const race = selectedRace ? RACES.find((r) => r.id === selectedRace) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.backBtn}>
          <Text style={styles.backText}>← SAIR</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ESCOLHA SUA RAÇA</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.raceList} showsVerticalScrollIndicator={false}>
        {RACES.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[styles.raceCard, selectedRace === r.id && styles.raceCardSelected]}
            onPress={() => setSelectedRace(r.id)}
          >
            <View style={[styles.emojiCircle, { backgroundColor: `${r.color}20` }]}>
              <Text style={styles.raceEmoji}>{r.emoji}</Text>
            </View>
            <View style={styles.raceInfo}>
              <Text style={styles.raceName}>{r.name}</Text>
              <View style={styles.elements}>
                {r.primaryElements.slice(0, 3).map((e) => (
                  <View
                    key={e}
                    style={[styles.elementBadge, { backgroundColor: `${ELEMENTS[e]?.color}20` }]}
                  >
                    <Text style={styles.elementEmoji}>{ELEMENTS[e]?.emoji}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.statsPreview}>
              <Text style={styles.statText}>❤️ {r.stats.hp}</Text>
              <Text style={styles.statText}>⚔️ {r.stats.atkF}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {race && (
        <View style={styles.detailsPanel}>
          <View style={styles.detailsHeader}>
            <View style={[styles.emojiCircleLarge, { backgroundColor: `${race.color}30` }]}>
              <Text style={styles.emojiLarge}>{race.emoji}</Text>
            </View>
            <View>
              <Text style={styles.detailsName}>{race.name}</Text>
              <View style={styles.elementsRow}>
                {race.primaryElements.map((e) => (
                  <View
                    key={e}
                    style={[styles.elementPill, { backgroundColor: ELEMENTS[e]?.color }]}
                  >
                    <Text style={styles.elementPillText}>
                      {ELEMENTS[e]?.emoji} {ELEMENTS[e]?.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.lore}>{race.lore}</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>HP</Text>
              <Text style={styles.statValue}>❤️ {race.stats.hp}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>ATK</Text>
              <Text style={styles.statValue}>⚔️ {race.stats.atkF}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DEF</Text>
              <Text style={styles.statValue}>🛡️ {race.stats.armor}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>CRIT</Text>
              <Text style={styles.statValue}>💥 {race.stats.critBonus}%</Text>
            </View>
          </View>

          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.genderBtn, gender === "male" && styles.genderBtnActive]}
              onPress={() => setGender("male")}
            >
              <Text style={styles.genderEmoji}>♂️</Text>
              <Text style={[styles.genderText, gender === "male" && styles.genderTextActive]}>
                MASCULINO
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBtn, gender === "female" && styles.genderBtnActive]}
              onPress={() => setGender("female")}
            >
              <Text style={styles.genderEmoji}>♀️</Text>
              <Text style={[styles.genderText, gender === "female" && styles.genderTextActive]}>
                FEMININO
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>FIRMAR CONTRATO</Text>
            <Text style={styles.confirmArrow}>→</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e2e",
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  headerTitle: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  raceList: {
    flex: 1,
    padding: 16,
  },
  raceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12121a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  raceCardSelected: {
    borderColor: "#7c3aed",
    backgroundColor: "#1a1625",
  },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  raceEmoji: {
    fontSize: 28,
  },
  raceInfo: {
    flex: 1,
  },
  raceName: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  elements: {
    flexDirection: "row",
    gap: 6,
  },
  elementBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  elementEmoji: {
    fontSize: 14,
  },
  statsPreview: {
    alignItems: "flex-end",
  },
  statText: {
    color: "#64748b",
    fontSize: 12,
    marginBottom: 4,
  },
  detailsPanel: {
    backgroundColor: "#12121a",
    borderTopWidth: 1,
    borderTopColor: "#1e1e2e",
    padding: 20,
    paddingBottom: 40,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  emojiCircleLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  emojiLarge: {
    fontSize: 36,
  },
  detailsName: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  elementsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  elementPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  elementPillText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  lore: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  statLabel: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
  },
  statValue: {
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: "600",
  },
  genderRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  genderBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0f",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1e1e2e",
    gap: 8,
  },
  genderBtnActive: {
    borderColor: "#7c3aed",
    backgroundColor: "#1a1625",
  },
  genderEmoji: {
    fontSize: 16,
  },
  genderText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
  },
  genderTextActive: {
    color: "#7c3aed",
  },
  confirmBtn: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    padding: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 2,
  },
  confirmArrow: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 8,
  },
});
