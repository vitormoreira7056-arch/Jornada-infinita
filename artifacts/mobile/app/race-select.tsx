import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions, Animated } from "react-native";
import { router } from "expo-router";
import { useGame } from "@/context/GameContext";
import { RACES, RaceId, RaceAbility } from "@/constants/races";
import { ELEMENTS, ElementId } from "@/constants/elements";

const { width, height } = Dimensions.get("window");

interface RaceStats {
  hp: number;
  atkF: number;
  atkM: number;
  def: number;
  armor: number;
  magicRes: number;
  critRate: number;
  critDmg: number;
  atkSpeed: number;
  luck: number;
  dodge: number;
  lifeSteal: number;
  armorPen: number;
  hpRegen: number;
  res: Record<ElementId, number>;
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

  // Get resistances that are not zero
  const activeResistances = Object.entries(stats.res)
    .filter(([_, value]) => value !== 0)
    .slice(0, 6); // Show max 6

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          {/* Header */}
          <View style={[modalStyles.header, { backgroundColor: `${race.color}15` }]}>
            <View style={[modalStyles.emojiCircle, { backgroundColor: `${race.color}30`, borderColor: race.color }]}>
              <Text style={modalStyles.emoji}>{race.emoji}</Text>
            </View>
            <View>
              <Text style={modalStyles.name}>{race.name}</Text>
              <Text style={modalStyles.subtitle}>Atributos & Habilidades</Text>
            </View>
            <TouchableOpacity style={modalStyles.closeBtnTop} onPress={onClose}>
              <Text style={modalStyles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={modalStyles.content} showsVerticalScrollIndicator={false}>
            {/* Primary Stats */}
            <Text style={modalStyles.sectionTitle}>ATRIBUTOS PRIMÁRIOS</Text>
            <View style={modalStyles.statsGrid}>
              <StatBox label="HP" value={formatNumber(stats.hp)} icon="❤️" color="#ef4444" />
              <StatBox label="ATK.F" value={formatNumber(stats.atkF)} icon="⚔️" color="#f59e0b" />
              <StatBox label="ATK.M" value={formatNumber(stats.atkM)} icon="🔮" color="#8b5cf6" />
              <StatBox label="DEF" value={formatNumber(stats.def)} icon="🛡️" color="#3b82f6" />
              <StatBox label="ARMADURA" value={formatNumber(stats.armor)} icon="🧱" color="#64748b" />
              <StatBox label="RES. MÁGICA" value={formatNumber(stats.magicRes)} icon="✨" color="#ec4899" />
            </View>

            {/* Secondary Stats */}
            <Text style={modalStyles.sectionTitle}>ATRIBUTOS SECUNDÁRIOS</Text>
            <View style={modalStyles.statsGrid}>
              <StatBox label="Taxa Crit" value={formatPercent(stats.critRate)} icon="🎯" color="#fbbf24" />
              <StatBox label="Dano Crit" value={formatPercent(stats.critDmg)} icon="💥" color="#f97316" />
              <StatBox label="Vel. Atq" value={formatNumber(stats.atkSpeed)} icon="⚡" color="#06b6d4" />
              <StatBox label="Sorte" value={formatPercent(stats.luck)} icon="🍀" color="#22c55e" />
              <StatBox label="Esquiva" value={formatPercent(stats.dodge)} icon="💨" color="#14b8a6" />
              <StatBox label="Roubo Vida" value={formatPercent(stats.lifeSteal)} icon="🩸" color="#dc2626" />
              <StatBox label="Pen. Arm" value={formatNumber(stats.armorPen)} icon="🔪" color="#71717a" />
              <StatBox label="Regen HP" value={formatNumber(stats.hpRegen)} icon="💚" color="#10b981" />
            </View>

            {/* Elemental Resistances */}
            {activeResistances.length > 0 && (
              <>
                <Text style={modalStyles.sectionTitle}>RESISTÊNCIAS ELEMENTAIS</Text>
                <View style={modalStyles.resGrid}>
                  {activeResistances.map(([element, value]) => (
                    <ResBox 
                      key={element} 
                      element={element as ElementId} 
                      value={value} 
                    />
                  ))}
                </View>
              </>
            )}

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

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function StatBox({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <View style={modalStyles.statBox}>
      <View style={[modalStyles.statIconBox, { backgroundColor: `${color}20` }]}>
        <Text style={modalStyles.statIcon}>{icon}</Text>
      </View>
      <Text style={[modalStyles.statValue, { color }]}>{value}</Text>
      <Text style={modalStyles.statLabel}>{label}</Text>
    </View>
  );
}

function ResBox({ element, value }: { element: ElementId; value: number }) {
  const elemData = ELEMENTS[element];
  const isPositive = value > 0;
  
  return (
    <View style={modalStyles.resBox}>
      <Text style={modalStyles.resEmoji}>{elemData?.emoji}</Text>
      <Text style={modalStyles.resName}>{elemData?.name}</Text>
      <Text style={[modalStyles.resValue, { color: isPositive ? "#22c55e" : "#ef4444" }]}>
        {isPositive ? "+" : ""}{value}%
      </Text>
    </View>
  );
}

function AbilityCard({ ability, index, isPassive }: { ability: RaceAbility; index?: number; isPassive?: boolean }) {
  return (
    <View style={[modalStyles.abilityCard, isPassive && modalStyles.passiveCard]}>
      <View style={modalStyles.abilityHeader}>
        <View style={[modalStyles.abilityTypeBadge, isPassive && modalStyles.passiveBadge]}>
          <Text style={modalStyles.abilityTypeText}>
            {isPassive ? "👑 PASSIVA" : `⚡ ATIVA ${(index || 0) + 1}`}
          </Text>
        </View>
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
    await logout();
    router.replace("/login");
  };

  const race = selectedRace ? RACES.find((r) => r.id === selectedRace) : null;

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.backBtn}>
          <Text style={styles.backText}>← SAIR</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ESCOLHA SUA RAÇA</Text>
        <View style={{ width: 50 }} />
      </View>
      
      <Text style={styles.welcome}>Bem-vindo, <Text style={styles.welcomeHighlight}>{state.playerName}</Text></Text>

      <ScrollView style={styles.raceList} showsVerticalScrollIndicator={false}>
        {RACES.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[styles.raceCard, selectedRace === r.id && styles.raceCardSelected]}
            onPress={() => setSelectedRace(r.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.emojiCircle, { backgroundColor: `${r.color}20`, borderColor: r.color }]}>
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
            <View style={[styles.emojiCircleLarge, { backgroundColor: `${race.color}30`, borderColor: race.color }]}>
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
            style={[styles.viewStatsBtn, { borderColor: race.color }]}
            onPress={() => setStatsModalVisible(true)}
          >
            <Text style={[styles.viewStatsText, { color: race.color }]}>📊 VER ATRIBUTOS COMPLETOS</Text>
          </TouchableOpacity>

          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.genderBtn, gender === "male" && [styles.genderBtnActive, { borderColor: race.color }]]}
              onPress={() => setGender("male")}
            >
              <Text style={styles.genderEmoji}>♂️</Text>
              <Text style={[styles.genderText, gender === "male" && { color: race.color }]}>
                MASCULINO
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBtn, gender === "female" && [styles.genderBtnActive, { borderColor: race.color }]]}
              onPress={() => setGender("female")}
            >
              <Text style={styles.genderEmoji}>♀️</Text>
              <Text style={[styles.genderText, gender === "female" && { color: race.color }]}>
                FEMININO
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.confirmBtn, { backgroundColor: race.color }]}
            onPress={handleConfirm}
          >
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
    backgroundColor: "#050508",
  },
  bgCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#7c3aed",
    opacity: 0.05,
    top: -50,
    right: -50,
  },
  bgCircle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#3b82f6",
    opacity: 0.04,
    bottom: 100,
    left: -50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124, 58, 237, 0.1)",
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
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
  welcome: {
    color: "#64748b",
    fontSize: 14,
    padding: 16,
    paddingBottom: 8,
  },
  welcomeHighlight: {
    color: "#7c3aed",
    fontWeight: "700",
  },
  raceList: {
    flex: 1,
    padding: 16,
  },
  raceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  raceCardSelected: {
    borderColor: "#7c3aed",
    backgroundColor: "rgba(124, 58, 237, 0.1)",
  },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
  },
  raceEmoji: {
    fontSize: 28,
  },
  raceInfo: {
    flex: 1,
  },
  raceName: {
    color: "#ffffff",
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
    backgroundColor: "rgba(18, 18, 26, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(124, 58, 237, 0.2)",
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
    borderWidth: 2,
  },
  emojiLarge: {
    fontSize: 36,
  },
  detailsInfo: {
    flex: 1,
  },
  detailsName: {
    color: "#ffffff",
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
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  quickStat: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  viewStatsBtn: {
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  viewStatsText: {
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
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
    gap: 8,
  },
  genderBtnActive: {
    backgroundColor: "rgba(124, 58, 237, 0.15)",
  },
  genderEmoji: {
    fontSize: 16,
  },
  genderText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
  },
  confirmBtn: {
    borderRadius: 14,
    padding: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  confirmText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
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
    backgroundColor: "rgba(5, 5, 8, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    backgroundColor: "#12121a",
    borderRadius: 24,
    width: "100%",
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124, 58, 237, 0.1)",
  },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2,
  },
  closeBtnTop: {
    marginLeft: "auto",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "800",
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
    width: "31%",
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  statIcon: {
    fontSize: 18,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: "700",
  },
  resGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  resBox: {
    width: "30%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  resEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  resName: {
    color: "#94a3b8",
    fontSize: 10,
    flex: 1,
  },
  resValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  abilityCard: {
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.15)",
  },
  passiveCard: {
    borderColor: "rgba(245, 158, 11, 0.3)",
    backgroundColor: "rgba(245, 158, 11, 0.05)",
  },
  abilityHeader: {
    marginBottom: 8,
  },
  abilityTypeBadge: {
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  passiveBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.2)",
  },
  abilityTypeText: {
    color: "#7c3aed",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  abilityName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
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
  elementPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  elementText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});
