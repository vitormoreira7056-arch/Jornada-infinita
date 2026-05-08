import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useGame } from "@/context/GameContext";
import { RACES, RaceId, RaceDef } from "@/constants/races";
import { ELEMENTS } from "@/constants/elements";

export default function RaceSelect() {
  const [selectedRace, setSelectedRace] = useState<RaceId | null>(null);
  const [gender, setGender] = useState<"male" | "female">("male");
  const { selectRace } = useGame();

  const handleConfirm = () => {
    if (selectedRace) {
      selectRace(selectedRace, gender);
      router.replace("/(game)/battle");
    }
  };

  const race = selectedRace ? RACES.find((r) => r.id === selectedRace) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha sua Raça</Text>

      <ScrollView style={styles.raceList} showsVerticalScrollIndicator={false}>
        {RACES.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[styles.raceCard, selectedRace === r.id && styles.raceCardSelected]}
            onPress={() => setSelectedRace(r.id)}
          >
            <Text style={styles.raceEmoji}>{r.emoji}</Text>
            <View style={styles.raceInfo}>
              <Text style={styles.raceName}>{r.name}</Text>
              <View style={styles.elements}>
                {r.primaryElements.slice(0, 3).map((e) => (
                  <Text key={e} style={[styles.element, { color: ELEMENTS[e]?.color || "#fff" }]}>
                    {ELEMENTS[e]?.emoji}
                  </Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {race && (
        <View style={styles.details}>
          <Text style={styles.lore}>{race.lore}</Text>
          
          <View style={styles.stats}>
            <Text style={styles.stat}>❤️ HP: {race.stats.hp}</Text>
            <Text style={styles.stat}>⚔️ ATK: {race.stats.atkF}</Text>
            <Text style={styles.stat}>🛡️ DEF: {race.stats.armor}</Text>
          </View>

          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.genderBtn, gender === "male" && styles.genderBtnActive]}
              onPress={() => setGender("male")}
            >
              <Text style={styles.genderText}>♂️ Masculino</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBtn, gender === "female" && styles.genderBtnActive]}
              onPress={() => setGender("female")}
            >
              <Text style={styles.genderText}>♀️ Feminino</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Firmar Contrato</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginVertical: 16,
  },
  raceList: {
    flex: 1,
  },
  raceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#333",
  },
  raceCardSelected: {
    borderColor: "#4CAF50",
    backgroundColor: "#1a2f1a",
  },
  raceEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  raceInfo: {
    flex: 1,
  },
  raceName: {
    color: "#f0f0f0",
    fontSize: 16,
    fontWeight: "bold",
  },
  elements: {
    flexDirection: "row",
    marginTop: 4,
  },
  element: {
    fontSize: 16,
    marginRight: 4,
  },
  details: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  lore: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  stat: {
    color: "#f0f0f0",
    fontSize: 14,
  },
  genderRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  genderBtn: {
    flex: 1,
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  genderBtnActive: {
    backgroundColor: "#4CAF50",
  },
  genderText: {
    color: "#f0f0f0",
    fontSize: 14,
  },
  confirmBtn: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
