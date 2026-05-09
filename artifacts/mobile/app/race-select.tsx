import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Animated, Dimensions } from "react-native";
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

  const formatPercent = (val: number) => {
    if (val === undefined || val === null) return "0%";
    return `${(val * 100).toFixed(1)}%`;
  };
  const formatNumber = (val: number) => {
    if (val === undefined || val === null) return "0";
    return val > 0 ? `+${val}` : val.toString();
  };

  const activeResistances = Object.entries(stats.res)
    .filter(([_, value]) => value !== 0)
    .slice(0, 6);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <View style={[modalStyles.header, { borderBottomColor: `${race.color}30` }]}>
            <View style={[modalStyles.emojiCircle, { backgroundColor: `${race.color}20`, borderColor: race.color }]}>
              <Text style={modalStyles.emoji}>{race.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={modalStyles.name}>{race.name}</Text>
              <Text style={modalStyles.subtitle}>Atributos & Habilidades</Text>
            </View>
            <TouchableOpacity style={[modalStyles.closeBtn, { backgroundColor: `${race.color}20` }]} onPress={onClose}>
              <Text style={[modalStyles.closeText, { color: race.color }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={modalStyles.content} showsVerticalScrollIndicator={false}>
            <Text style={modalStyles.sectionTitle}>ATRIBUTOS PRIMÁRIOS</Text>
            <View style={modalStyles.statsGrid}>
              <StatBox label="HP" value={formatNumber(stats.hp)} icon="❤️" color="#ef4444" />
              <StatBox label="ATK.F" value={formatNumber(stats.atkF)} icon="⚔️" color="#f59e0b" />
              <StatBox label="ATK.M" value={formatNumber(stats.atkM)} icon="🔮" color="#8b5cf6" />
              <StatBox label="DEF" value={formatNumber(stats.def)} icon="🛡️" color="#3b82f6" />
              <StatBox label="ARMADURA" value={formatNumber(stats.armor)} icon="🧱" color="#64748b" />
              <StatBox label="RES. MÁGICA" value={formatNumber(stats.magicRes)} icon="✨" color="#ec4899" />
            </View>

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

            {activeResistances.length > 0 && (
              <>
                <Text style={modalStyles.sectionTitle}>RESISTÊNCIAS ELEMENTAIS</Text>
                <View style={modalStyles.resGrid}>
                  {activeResistances.map(([element, value]) => (
                    <ResBox key={element} element={element as ElementId} value={value} />
                  ))}
                </View>
              </>
            )}

            <Text style={modalStyles.sectionTitle}>HABILIDADES ATIVAS</Text>
            {activeAbilities.map((ability, index) => (
              <AbilityCard key={index} ability={ability} index={index} color={race.color} />
            ))}

            {passiveAbility && (
              <>
                <Text style={modalStyles.sectionTitle}>HABILIDADE PASSIVA</Text>
                <AbilityCard ability={passiveAbility} isPassive color={race.color} />
              </>
            )}

            <Text style={modalStyles.sectionTitle}>ELEMENTOS</Text>
            <View style={modalStyles.elementsRow}>
              {race.primaryElements.map((e) => (
                <View key={e} style={[modalStyles.elementPill, { backgroundColor: ELEMENTS[e]?.color }]}>
                  <Text style={modalStyles.elementText}>
                    {ELEMENTS[e]?.emoji} {ELEMENTS[e]?.name}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function StatBox({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <View style={modalStyles.statBox}>
      <View style={[modalStyles.statIconBox, { backgroundColor: `${color}15` }]}>
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

function AbilityCard({ ability, index, isPassive, color }: { ability: RaceAbility; index?: number; isPassive?: boolean; color: string }) {
  return (
    <View style={[modalStyles.abilityCard, isPassive && { borderColor: `${color}50`, backgroundColor: `${color}08` }]}>
      <View style={[modalStyles.abilityTypeBadge, { backgroundColor: isPassive ? `${color}25` : "rgba(124, 58, 237, 0.15)" }]}>
        <Text style={[modalStyles.abilityTypeText, { color: isPassive ? color : "#7c3aed" }]}>
          {isPassive ? "👑 PASSIVA" : `⚡ ATIVA ${(index || 0) + 1}`}
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
    await logout();
    router.replace("/login");
  };

  const race = selectedRace ? RACES.find((r) => r.id === selectedRace) : null;

  return (
    <View style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.backBtn}>
          <Text style={styles.backText}>← SAIR</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ESCOLHA SUA RAÇA</Text>
        <View style={{ width: 50 }} />
      </View>
      
      <Text style={styles.welcome}>
        Bem-vindo, <Text style={styles.welcomeHighlight}>{state.playerName}</Text>
      </Text>

      <ScrollView style={styles.raceList} showsVerticalScrollIndicator={false}>
        {RACES.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[styles.raceCard, selectedRace === r.id && { borderColor: r.color, backgroundColor: `${r.color}10` }]}
            onPress={() => setSelectedRace(r.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.emojiCircle, { backgroundColor: `${r.color}15`, borderColor: r.color }]}>
              <Text style={styles.raceEmoji}>{r.emoji}</Text>
            </View>
            <View style={styles.raceInfo}>
              <Text style={styles.raceName}>{r.name}</Text>
              <View style={styles.elements}>
                {r.primaryElements.slice(0, 3).map((e) => (
                  <View key={e} style={[styles.elementBadge, { backgroundColor: `${ELEMENTS[e]?.color}20` }]}>
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
            <View style={[styles.emojiCircleLarge, { backgroundColor: `${race.color}20`, borderColor: race.color }]}>
              <Text style={styles.emojiLarge}>{race.emoji}</Text>
            </View>
            <View style={styles.detailsInfo}>
              <Text style={styles.detailsName}>{race.name}</Text>
              <View style={styles.elementsRow}>
                {race.primaryElements.slice(0, 2).map((e) => (
                  <View key={e} style={[styles.elementPill, { backgroundColor: ELEMENTS[e]?.color }]}>
                    <Text style={styles.elementPillText}>{ELEMENTS[e]?.emoji}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.lore}>{race.lore}</Text>

          <View style={styles.quickStats}>
            <Text style={styles.quickStat}>❤️ {race.stats.hp}</Text>
            <Text style={styles.quickStat}>⚔️ {race.stats.atkF}</Text>
            <Text style={styles.quickStat}>🔮 {race.stats.atkM}</Text>
            <Text style={styles.quickStat}>🛡️ {race.stats.armor}</Text>
          </View>

          <TouchableOpacity 
            style={[styles.viewStatsBtn, { borderColor: `${race.color}40` }]}
            onPress={() => setStatsModalVisible(true)}
          >
            <Text style={[styles.viewStatsText, { color: race.color }]}>📊 VER ATRIBUTOS</Text>
          </TouchableOpacity>

          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.genderBtn, gender === "male" && { borderColor: race.color, backgroundColor: `${race.color}15` }]}
              onPress={() => setGender("male")}
            >
              <Text style={styles.genderEmoji}>♂️</Text>
              <Text style={[styles.genderText, gender === "male" && { color: race.color }]}>MASCULINO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBtn, gender === "female" && { borderColor: race.color, backgroundColor: `${race.color}15` }]}
              onPress={() => setGender("female")}
            >
              <Text style={styles.genderEmoji}>♀️</Text>
              <Text style={[styles.genderText, gender === "female" && { color: race.color }]}>FEMININO</Text>
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
    backgroundColor: "#020204",
  },
  bgCircle1: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "#7c3aed",
    opacity: 0.03,
    top: -100,
    right: -100,
  },
  bgCircle2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#3b82f6",
    opacity: 0.02,
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
    borderBottomColor: "rgba(124, 58, 237, 0.06)",
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
    letterSpacing: 3,
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
    backgroundColor: "rgba(16, 16, 24, 0.6)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.08)",
  },
  emojiCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1.5,
  },
  raceEmoji: {
    fontSize: 26,
  },
  raceInfo: {
    flex: 1,
  },
  raceName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  elements: {
    flexDirection: "row",
    gap: 5,
  },
  elementBadge: {
    width: 26,
    height: 26,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  elementEmoji: {
    fontSize: 13,
  },
  statsPreview: {
    alignItems: "flex-end",
  },
  statText: {
    color: "#64748b",
    fontSize: 11,
    marginBottom: 3,
  },
  detailsPanel: {
    backgroundColor: "rgba(16, 16, 24, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(124, 58, 237, 0.12)",
    padding: 20,
    paddingBottom: 40,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  emojiCircleLarge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 2,
  },
  emojiLarge: {
    fontSize: 34,
  },
  detailsInfo: {
    flex: 1,
  },
  detailsName: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 6,
  },
  elementsRow: {
    flexDirection: "row",
    gap: 5,
  },
  elementPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  elementPillText: {
    fontSize: 11,
  },
  lore: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(8, 8, 12, 0.6)",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  quickStat: {
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: "600",
  },
  viewStatsBtn: {
    backgroundColor: "rgba(8, 8, 12, 0.6)",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
  },
  viewStatsText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  genderRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  genderBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8, 8, 12, 0.6)",
    borderRadius: 12,
    padding: 13,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.15)",
    gap: 7,
  },
  genderEmoji: {
    fontSize: 15,
  },
  genderText: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  confirmBtn: {
    borderRadius: 14,
    padding: 17,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
  confirmArrow: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    opacity: 0.8,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2, 2, 4, 0.96)",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
  },
  container: {
    backgroundColor: "#101018",
    borderRadius: 24,
    width: "100%",
    maxHeight: "82%",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.15)",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
  },
  emojiCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 2,
  },
  emoji: {
    fontSize: 26,
  },
  name: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    marginLeft: "auto",
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 15,
    fontWeight: "700",
  },
  content: {
    padding: 18,
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 10,
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  statBox: {
    width: "31%",
    backgroundColor: "rgba(8, 8, 12, 0.6)",
    borderRadius: 12,
    padding: 11,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.08)",
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 1,
  },
  statLabel: {
    color: "#64748b",
    fontSize: 8,
    fontWeight: "700",
  },
  resGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  resBox: {
    width: "30%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(8, 8, 12, 0.6)",
    borderRadius: 9,
    padding: 9,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.08)",
  },
  resEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  resName: {
    color: "#94a3b8",
    fontSize: 9,
    flex: 1,
    textTransform: "capitalize",
  },
  resValue: {
    fontSize: 11,
    fontWeight: "700",
  },
  abilityCard: {
    backgroundColor: "rgba(8, 8, 12, 0.6)",
    borderRadius: 12,
    padding: 13,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  abilityTypeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 7,
  },
  abilityTypeText: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },
  abilityName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  abilityDesc: {
    color: "#94a3b8",
    fontSize: 11,
    lineHeight: 16,
  },
  elementsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  elementPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  elementText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
