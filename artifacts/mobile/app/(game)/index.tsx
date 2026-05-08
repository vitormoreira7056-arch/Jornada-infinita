import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { router } from "expo-router";
import { ElementId } from "@/constants/elements";

export default function Home() {
  const { state, getTotalStats } = useGame();
  const race = state.raceId ? getRaceById(state.raceId) : null;
  const stats = getTotalStats();

  // Calculate progress to next level
  const expNeeded = state.level * 100;
  const expProgress = (state.exp / expNeeded) * 100;

  // Get active resistances
  const activeResistances = Object.entries(stats.res)
    .filter(([_, value]) => value !== 0)
    .slice(0, 6);

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
            <Text style={[styles.characterRace, { color: race?.color || "#7c3aed" }]}>{race?.name}</Text>
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

      {/* Primary Stats */}
      <Text style={styles.sectionTitle}>ATRIBUTOS PRIMÁRIOS</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: "rgba(245, 158, 11, 0.15)" }]}>
            <Text style={styles.statIcon}>⚔️</Text>
          </View>
          <Text style={[styles.statValue, { color: "#f59e0b" }]}>{stats.atkF}</Text>
          <Text style={styles.statLabel}>ATK.F</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: "rgba(139, 92, 246, 0.15)" }]}>
            <Text style={styles.statIcon}>🔮</Text>
          </View>
          <Text style={[styles.statValue, { color: "#8b5cf6" }]}>{stats.atkM}</Text>
          <Text style={styles.statLabel}>ATK.M</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: "rgba(59, 130, 246, 0.15)" }]}>
            <Text style={styles.statIcon}>🛡️</Text>
          </View>
          <Text style={[styles.statValue, { color: "#3b82f6" }]}>{stats.def}</Text>
          <Text style={styles.statLabel}>DEFESA</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
            <Text style={styles.statIcon}>❤️</Text>
          </View>
          <Text style={[styles.statValue, { color: "#ef4444" }]}>{stats.hp}</Text>
          <Text style={styles.statLabel}>VIDA</Text>
        </View>
      </View>

      {/* Defense Stats */}
      <Text style={styles.sectionTitle}>DEFESA</Text>
      <View style={styles.defenseGrid}>
        <View style={styles.defenseCard}>
          <Text style={styles.defenseIcon}>🧱</Text>
          <Text style={styles.defenseValue}>{stats.armor}</Text>
          <Text style={styles.defenseLabel}>ARMADURA</Text>
        </View>
        <View style={styles.defenseCard}>
          <Text style={styles.defenseIcon}>✨</Text>
          <Text style={styles.defenseValue}>{stats.magicRes}</Text>
          <Text style={styles.defenseLabel}>RES. MÁGICA</Text>
        </View>
      </View>

      {/* Secondary Stats */}
      <Text style={styles.sectionTitle}>ATRIBUTOS SECUNDÁRIOS</Text>
      <View style={styles.secondaryStatsGrid}>
        <SecondaryStat icon="🎯" label="Taxa Crit" value={`${(stats.critRate * 100).toFixed(1)}%`} color="#fbbf24" />
        <SecondaryStat icon="💥" label="Dano Crit" value={`${(stats.critDmg * 100).toFixed(0)}%`} color="#f97316" />
        <SecondaryStat icon="⚡" label="Vel. Atq" value={stats.atkSpeed.toFixed(2)} color="#06b6d4" />
        <SecondaryStat icon="🍀" label="Sorte" value={`${(stats.luck * 100).toFixed(2)}%`} color="#22c55e" />
        <SecondaryStat icon="💨" label="Esquiva" value={`${(stats.dodge * 100).toFixed(1)}%`} color="#14b8a6" />
        <SecondaryStat icon="🩸" label="Roubo Vida" value={`${(stats.lifeSteal * 100).toFixed(1)}%`} color="#dc2626" />
        <SecondaryStat icon="🔪" label="Pen. Arm" value={stats.armorPen.toString()} color="#71717a" />
        <SecondaryStat icon="💚" label="Regen HP" value={stats.hpRegen.toString()} color="#10b981" />
      </View>

      {/* Elemental Resistances */}
      {activeResistances.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>RESISTÊNCIAS ELEMENTAIS</Text>
          <View style={styles.resGrid}>
            {activeResistances.map(([element, value]) => (
              <ResCard key={element} element={element as ElementId} value={value} />
            ))}
          </View>
        </>
      )}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>AÇÕES RÁPIDAS</Text>
      <View style={styles.actionsGrid}>
        <ActionCard 
          icon="🗺️" 
          title="AVENTURA" 
          desc="Explore e batalhe"
          onPress={() => router.push("/(game)/adventure")}
          color="#f59e0b"
        />
        <ActionCard 
          icon="🎒" 
          title="MOCHILA" 
          desc="Gerencie itens"
          onPress={() => router.push("/(game)/inventory")}
          color="#7c3aed"
        />
        <ActionCard 
          icon="✨" 
          title="SKILLS" 
          desc="Habilidades"
          onPress={() => router.push("/(game)/skills")}
          color="#ec4899"
        />
      </View>

      {/* Race Info */}
      <Text style={styles.sectionTitle}>SOBRE SUA RAÇA</Text>
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

function SecondaryStat({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={styles.secondaryStat}>
      <Text style={styles.secondaryIcon}>{icon}</Text>
      <View>
        <Text style={[styles.secondaryValue, { color }]}>{value}</Text>
        <Text style={styles.secondaryLabel}>{label}</Text>
      </View>
    </View>
  );
}

function ResCard({ element, value }: { element: ElementId; value: number }) {
  const isPositive = value > 0;
  return (
    <View style={styles.resCard}>
      <Text style={styles.resName}>{element}</Text>
      <Text style={[styles.resValue, { color: isPositive ? "#22c55e" : "#ef4444" }]}>
        {isPositive ? "+" : ""}{value}%
      </Text>
    </View>
  );
}

function ActionCard({ icon, title, desc, onPress, color }: { icon: string; title: string; desc: string; onPress: () => void; color: string }) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.actionIconBox, { backgroundColor: `${color}15` }]}>
        <Text style={styles.actionIcon}>{icon}</Text>
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050508",
    padding: 16,
  },
  characterCard: {
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.15)",
  },
  characterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(10, 10, 15, 0.8)",
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
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  characterRace: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  genderBadge: {
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
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
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  expText: {
    color: "#64748b",
    fontSize: 12,
  },
  expBar: {
    height: 8,
    backgroundColor: "rgba(10, 10, 15, 0.8)",
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
    marginBottom: 20,
  },
  statCard: {
    width: "23%",
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  defenseGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  defenseCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  defenseIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  defenseValue: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  defenseLabel: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: "700",
  },
  secondaryStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  secondaryStat: {
    width: "23%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  secondaryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  secondaryValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  secondaryLabel: {
    color: "#64748b",
    fontSize: 8,
    fontWeight: "600",
  },
  resGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  resCard: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  resName: {
    color: "#94a3b8",
    fontSize: 10,
    textTransform: "capitalize",
  },
  resValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionTitle: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  actionDesc: {
    color: "#64748b",
    fontSize: 9,
    textAlign: "center",
  },
  raceCard: {
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
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
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
  },
  elementText: {
    color: "#7c3aed",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
