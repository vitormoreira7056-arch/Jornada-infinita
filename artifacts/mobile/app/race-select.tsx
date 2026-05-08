import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from "react-native";
import { router } from "expo-router";
import { useGame } from "@/context/GameContext";
import { RACES, RaceId, RaceAbility } from "@/constants/races";
import { ELEMENTS } from "@/constants/elements";

interface RaceStats {
  hp: number;
  atkF: number;
  atkM: number;
  def: number;
  critRate: number;
  critDmg: number;
  atkSpeed: number;
  moveSpeed: number;
  luck: number;
  dodge: number;
  lifeSteal: number;
  armorPen: number;
  hpRegen: number;
}

function StatsModal({
  visible,
  raceId,
  onClose,
}: {
  visible: boolean;
  raceId: RaceId | null;
  onClose: () => void;
}) {
  const { getAllRaceStats } = useGame();
  
  if (!raceId) return null;
  
  const race = RACES.find((r) => r.id === raceId);
  const stats = getAllRaceStats(raceId);
  
  if (!race || !stats) return null;

  const activeAbilities = race.abilities.filter(a => a.type === "ativa");
  const passiveAbility = race.abilities.find(a => a.type === "passiva");

  const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`;
  const formatNumber = (val: number) => val > 0 ? `+${val}` : val;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <View style={[modalStyles.emojiCircle, { backgroundColor: `${race.color}30` }]}>
              <Text style={modalStyles.emoji}>{race.emoji}</Text>
            </View>
            <View>
              <Text style={modalStyles.name}>{race.name}</Text>
              <Text style={modalStyles.subtitle}>Atributos Base</Text>
            </View>
          </View>

          <ScrollView style={modalStyles.content} showsVerticalScrollIndicator={false}>
            {/* Stats Grid */}
            <Text style={modalStyles.sectionTitle}>ATRIBUTOS</Text>
            <View style={modalStyles.statsGrid}>
              <StatBox label="HP" value={formatNumber(stats.hp)} icon="❤️" />
              <StatBox label="ATK.F" value={formatNumber(stats.atkF)} icon="⚔️" />
              <StatBox label="ATK.M" value={formatNumber(stats.atkM)} icon="🔮" />
              <StatBox label="DEF" value={formatNumber(stats.def)} icon="🛡️" />
              <StatBox label="Taxa Crit" value={formatPercent(stats.critRate)} icon="🎯" />
              <StatBox label="Dano Crit" value={formatPercent(stats.critDmg)} icon="💥" />
              <StatBox label="Vel. Atq" value={formatNumber(stats.atkSpeed)} icon="⚡" />
              <StatBox label="Vel. Mov" value={formatNumber(stats.moveSpeed)} icon="👟" />
              <StatBox label="Sorte" value={formatPercent(stats.luck)} icon="🍀" />
              <StatBox label="Esquiva" value={formatPercent(stats.dodge)} icon="💨" />
              <StatBox label="Roubo Vida" value={formatPercent(stats.lifeSteal)} icon="🩸" />
              <StatBox label="Pen. Arm" value={formatNumber(stats.armorPen)} icon="🔪" />
              <StatBox label="Regen HP" value={formatNumber(stats.hpRegen)} icon="💚" />
            </View>

            {/* Active Skills */}
            <Text style={modalStyles.sectionTitle}>HABILIDADES ATIVAS</Text>
            {activeAbilities.map((ability, index) => (
              <AbilityCard key={index} ability={ability} index={index} />
            ))}

            {/* Passive Skill */}
            {passiveAbility && (
              <>
                <Text style={modalStyles.sectionTitle}>HABILIDADE PASSIVA</Text>
                <AbilityCard ability={passiveAbility} isPassive />
              </>
            )}

            {/* Elements */}
            <Text style={modalStyles.sectionTitle}>ELEMENTOS</Text>
            <View style={modalStyles.elementsRow}>
              {race.primaryElements.map((e) => (
                <View
                  key={e}
                  style={[modalStyles.elementPill, { backgroundColor: ELEMENTS[e]?.color }]}
                >
                  <Text style={modalStyles.elementText}>
                    {ELEMENTS[e]?.emoji} {ELEMENTS[e]?.name}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
            <Text style={modalStyles.closeText}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={modalStyles.statBox}>
      <Text style={modalStyles.statIcon}>{icon}</Text>
      <Text style={modalStyles.statValue}>{value}</Text>
      <Text style={modalStyles.statLabel}>{label}</Text>
    </View>
  );
}

function AbilityCard({ ability, index, isPassive }: { ability: RaceAbility; index?: number; isPassive?: boolean }) {
  return (
    <View style={[modalStyles.abilityCard, isPassive && modalStyles.passiveCard]}>
      <View style={modalStyles.abilityHeader}>
        <Text style={modalStyles.abilityType}>
          {isPassive ? "PASSIVA" : `ATIVA ${(index || 0) + 1}`}
        </Text>
      </View>
      <Text style={modalStyles.abilityName}>{ability.name}</Text>
      <Text style={modalStyles.abilityDesc}>{ability.description}</Text>
    </View>
  );
}

export default function RaceSelect() {
  const [selectedRace, setSelectedRace] = useState<RaceId | null>(null);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const { selectRace, logout, state } = useGame();

  const handleConfirm = () => {
    if (selectedRace) {
      selectRace(selectedRace, gender);
      router.replace("/(game)");
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Sair",
      "Deseja sair da conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          }
        },
      ]
    );
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
      
      <Text style={styles.welcome}>Bem-vindo, {state.playerName}!</Text>

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
            <View style={styles.detailsInfo}>
              <Text style={styles.detailsName}>{race.name}</Text>
              <View style={styles.elementsRow}>
                {race.primaryElements.slice(0, 2).map((e) => (
                  <View
                    key={e}
                    style={[styles.elementPill, { backgroundColor: ELEMENTS[e]?.color }]}
                  >
                    <Text style={styles.elementPillText}>
                      {ELEMENTS[e]?.emoji}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.lore}>{race.lore}</Text>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <Text style={styles.quickStat}>❤️ {race.stats.hp}</Text>
            <Text style={styles.quickStat}>⚔️ {race.stats.atkF}</Text>
            <Text style={styles.quickStat}>🔮 {race.stats.atkM}</Text>
            <Text style={styles.quickStat}>🛡️ {race.stats.armor}</Text>
          </View>

          {/* View Stats Button */}
          <TouchableOpacity 
            style={styles.viewStatsBtn}
            onPress={() => setStatsModalVisible(true)}
          >
            <Text style={styles.viewStatsText}>📊 VER ATRIBUTOS COMPLETOS</Text>
          </TouchableOpacity>

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

      <StatsModal
        visible={statsModalVisible}
        raceId={selectedRace}
        onClose={() => setStatsModalVisible(false)}
      />
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
    justifyContent: "space-between",
    alignItems: "center",
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
  welcome: {
    color: "#64748b",
    fontSize: 14,
    padding: 16,
    paddingBottom: 8,
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
  detailsInfo: {
    flex: 1,
  },
  detailsName: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  elementsRow: {
    flexDirection: "row",
    gap: 6,
  },
  elementPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  elementPillText: {
    fontSize: 12,
  },
  lore: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0a0a0f",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  quickStat: {
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: "600",
  },
  viewStatsBtn: {
    backgroundColor: "#1e1e2e",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  viewStatsText: {
    color: "#7c3aed",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
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

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#12121a",
    borderRadius: 20,
    width: "100%",
    maxHeight: "90%",
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e2e",
  },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    padding: 20,
    maxHeight: 400,
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statBox: {
    width: "23%",
    backgroundColor: "#0a0a0f",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "700",
  },
  statLabel: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: "600",
    marginTop: 2,
  },
  abilityCard: {
    backgroundColor: "#0a0a0f",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  passiveCard: {
    borderColor: "#f59e0b",
  },
  abilityHeader: {
    marginBottom: 6,
  },
  abilityType: {
    color: "#7c3aed",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  abilityName: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  abilityDesc: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 18,
  },
  elementsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  elementText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  closeBtn: {
    backgroundColor: "#1e1e2e",
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  closeText: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
