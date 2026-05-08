import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Animated } from "react-native";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { router } from "expo-router";
import { useState, useEffect } from "react";

// Currency display component
function CurrencyBadge({ icon, value, color }: { icon: string; value: number; color: string }) {
  const formatValue = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
  };

  if (value === 0) return null;
  
  return (
    <View style={[styles.currencyBadge, { backgroundColor: `${color}15`, borderColor: `${color}30` }]}>
      <Text style={styles.currencyIcon}>{icon}</Text>
      <Text style={[styles.currencyValue, { color }]}>{formatValue(value)}</Text>
    </View>
  );
}

// Stats Modal
function StatsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { state, getTotalStats } = useGame();
  const stats = getTotalStats();
  const race = state.raceId ? getRaceById(state.raceId) : null;

  const activeResistances = Object.entries(stats.res)
    .filter(([_, value]) => value !== 0)
    .slice(0, 8);

  const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`;

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
            <Text style={modalStyles.title}>ATRIBUTOS</Text>
            <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
              <Text style={modalStyles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={modalStyles.content}>
            {/* Primary Stats */}
            <Text style={modalStyles.sectionTitle}>PRIMÁRIOS</Text>
            <View style={modalStyles.statsGrid}>
              <StatBox icon="⚔️" label="ATK.F" value={stats.atkF.toString()} color="#f59e0b" />
              <StatBox icon="🔮" label="ATK.M" value={stats.atkM.toString()} color="#8b5cf6" />
              <StatBox icon="🛡️" label="DEF" value={stats.def.toString()} color="#3b82f6" />
              <StatBox icon="❤️" label="HP" value={stats.hp.toString()} color="#ef4444" />
              <StatBox icon="🧱" label="ARM" value={stats.armor.toString()} color="#64748b" />
              <StatBox icon="✨" label="RES.M" value={stats.magicRes.toString()} color="#ec4899" />
            </View>

            {/* Secondary Stats */}
            <Text style={modalStyles.sectionTitle}>SECUNDÁRIOS</Text>
            <View style={modalStyles.statsGrid}>
              <StatBox icon="🎯" label="Crit" value={formatPercent(stats.critRate)} color="#fbbf24" />
              <StatBox icon="💥" label="Crit Dmg" value={formatPercent(stats.critDmg)} color="#f97316" />
              <StatBox icon="⚡" label="Vel.Atk" value={stats.atkSpeed.toFixed(2)} color="#06b6d4" />
              <StatBox icon="🍀" label="Sorte" value={formatPercent(stats.luck)} color="#22c55e" />
              <StatBox icon="💨" label="Esquiva" value={formatPercent(stats.dodge)} color="#14b8a6" />
              <StatBox icon="🩸" label="Vamp" value={formatPercent(stats.lifeSteal)} color="#dc2626" />
              <StatBox icon="🔪" label="Pen" value={stats.armorPen.toString()} color="#71717a" />
              <StatBox icon="💚" label="Regen" value={stats.hpRegen.toString()} color="#10b981" />
            </View>

            {/* Resistances */}
            {activeResistances.length > 0 && (
              <>
                <Text style={modalStyles.sectionTitle}>RESISTÊNCIAS</Text>
                <View style={modalStyles.resGrid}>
                  {activeResistances.map(([element, value]) => (
                    <View key={element} style={modalStyles.resItem}>
                      <Text style={modalStyles.resName}>{element}</Text>
                      <Text style={[modalStyles.resValue, { color: value > 0 ? "#22c55e" : "#ef4444" }]}>
                        {value > 0 ? "+" : ""}{value}%
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function StatBox({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={modalStyles.statBox}>
      <Text style={modalStyles.statIcon}>{icon}</Text>
      <Text style={[modalStyles.statValue, { color }]}>{value}</Text>
      <Text style={modalStyles.statLabel}>{label}</Text>
    </View>
  );
}

export default function Home() {
  const { state, getTotalStats } = useGame();
  const race = state.raceId ? getRaceById(state.raceId) : null;
  const [statsVisible, setStatsVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const expNeeded = state.level * 100;
  const expProgress = (state.exp / expNeeded) * 100;
  const stats = getTotalStats();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Character Card - Minimal */}
        <View style={styles.characterCard}>
          <View style={styles.avatarSection}>
            <View style={[styles.avatarCircle, { borderColor: race?.color || "#7c3aed" }]}>
              <Text style={styles.avatarEmoji}>{race?.emoji}</Text>
            </View>
            <View style={styles.characterInfo}>
              <Text style={styles.characterName}>{state.playerName}</Text>
              <Text style={[styles.characterRace, { color: race?.color || "#7c3aed" }]}>
                {race?.name}
              </Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>NÍVEL {state.level}</Text>
              </View>
            </View>
            {/* Stats Button */}
            <TouchableOpacity 
              style={styles.statsButton}
              onPress={() => setStatsVisible(true)}
            >
              <Text style={styles.statsButtonIcon}>📊</Text>
            </TouchableOpacity>
          </View>

          {/* XP Bar */}
          <View style={styles.xpContainer}>
            <View style={styles.xpBar}>
              <View style={[styles.xpFill, { width: `${expProgress}%` }]} />
            </View>
            <Text style={styles.xpText}>{state.exp} / {expNeeded} XP</Text>
          </View>
          
          {/* HP/MP Mini Bars */}
          <View style={styles.hpMpContainer}>
            <View style={styles.miniBar}>
              <Text style={styles.miniBarIcon}>❤️</Text>
              <View style={styles.miniBarBg}>
                <View style={[styles.miniBarFill, { width: `${(state.currentHp / stats.hp) * 100}%`, backgroundColor: "#22c55e" }]} />
              </View>
              <Text style={styles.miniBarText}>{Math.floor(state.currentHp)}/{stats.hp}</Text>
            </View>
            <View style={styles.miniBar}>
              <Text style={styles.miniBarIcon}>💧</Text>
              <View style={styles.miniBarBg}>
                <View style={[styles.miniBarFill, { width: `${(state.currentMp / stats.mp) * 100}%`, backgroundColor: "#3b82f6" }]} />
              </View>
              <Text style={styles.miniBarText}>{Math.floor(state.currentMp)}/{Math.floor(stats.mp)}</Text>
            </View>
          </View>
        </View>

        {/* Currencies Row */}
        <View style={styles.currenciesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.currenciesScroll}>
            <CurrencyBadge icon="🥉" value={state.currencies.copper} color="#b45309" />
            <CurrencyBadge icon="🏅" value={state.currencies.bronze} color="#92400e" />
            <CurrencyBadge icon="🥈" value={state.currencies.silver} color="#64748b" />
            <CurrencyBadge icon="🥇" value={state.currencies.gold} color="#fbbf24" />
            <CurrencyBadge icon="💎" value={state.currencies.diamond} color="#3b82f6" />
            <CurrencyBadge icon="⚜️" value={state.currencies.mithril} color="#22d3ee" />
          </ScrollView>
        </View>

        {/* City Button - Main Action */}
        <TouchableOpacity 
          style={styles.cityButton}
          onPress={() => router.push("/(game)/city")}
          activeOpacity={0.85}
        >
          <View style={styles.cityButtonGradient} />
          <Text style={styles.cityButtonIcon}>🏰</Text>
          <View style={styles.cityButtonContent}>
            <Text style={styles.cityButtonTitle}>CIDADE</Text>
            <Text style={styles.cityButtonSubtitle}>Loja, Ferreiro, Imbuidor, Artesão</Text>
          </View>
          <Text style={styles.cityButtonArrow}>→</Text>
        </TouchableOpacity>

        {/* Adventure Button */}
        <TouchableOpacity 
          style={styles.adventureButton}
          onPress={() => router.push("/(game)/adventure")}
          activeOpacity={0.85}
        >
          <Text style={styles.adventureButtonIcon}>🗺️</Text>
          <View>
            <Text style={styles.adventureButtonTitle}>AVENTURA</Text>
            <Text style={styles.adventureButtonSubtitle}>Explore biomas e dungeons</Text>
          </View>
          <Text style={styles.adventureButtonArrow}>→</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.actionButtonSmall, { borderColor: "#3b82f640" }]}
            onPress={() => router.push("/(game)/inventory")}
            activeOpacity={0.85}
          >
            <Text style={styles.actionButtonIconSmall}>🎒</Text>
            <Text style={[styles.actionButtonTitleSmall, { color: "#3b82f6" }]}>MOCHILA</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButtonSmall, { borderColor: "#f59e0b40" }]}
            onPress={() => router.push("/(game)/equipment")}
            activeOpacity={0.85}
          >
            <Text style={styles.actionButtonIconSmall}>⚔️</Text>
            <Text style={[styles.actionButtonTitleSmall, { color: "#f59e0b" }]}>EQUIPAR</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButtonSmall, { borderColor: "#ec489940" }]}
            onPress={() => router.push("/(game)/skills")}
            activeOpacity={0.85}
          >
            <Text style={styles.actionButtonIconSmall}>✨</Text>
            <Text style={[styles.actionButtonTitleSmall, { color: "#ec4899" }]}>SKILLS</Text>
          </TouchableOpacity>
        </View>

        {/* Race Lore Card */}
        <View style={styles.loreCard}>
          <Text style={styles.loreTitle}>SUA HISTÓRIA</Text>
          <Text style={styles.loreText}>{race?.lore}</Text>
        </View>
      </Animated.View>

      <StatsModal visible={statsVisible} onClose={() => setStatsVisible(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050508",
  },
  characterCard: {
    margin: 20,
    marginTop: 16,
    backgroundColor: "rgba(18, 18, 26, 0.6)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.15)",
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
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
    marginBottom: 2,
  },
  characterRace: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
  },
  levelText: {
    color: "#7c3aed",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  statsButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.25)",
  },
  statsButtonIcon: {
    fontSize: 20,
  },
  xpContainer: {
    marginTop: 16,
  },
  xpBar: {
    height: 6,
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    borderRadius: 3,
    overflow: "hidden",
  },
  xpFill: {
    height: "100%",
    backgroundColor: "#7c3aed",
    borderRadius: 3,
  },
  xpText: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
    fontWeight: "600",
  },
  hpMpContainer: {
    marginTop: 12,
    gap: 6,
  },
  miniBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniBarIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  miniBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  miniBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  miniBarText: {
    color: "#64748b",
    fontSize: 10,
    marginLeft: 6,
    width: 50,
    textAlign: "right",
  },
  currenciesContainer: {
    marginBottom: 20,
  },
  currenciesScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  currencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  currencyIcon: {
    fontSize: 14,
  },
  currencyValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  cityButton: {
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7c3aed",
    borderRadius: 20,
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },
  cityButtonGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#8b5cf6",
    opacity: 0.3,
  },
  cityButtonIcon: {
    fontSize: 32,
    marginRight: 16,
    zIndex: 1,
  },
  cityButtonContent: {
    flex: 1,
    zIndex: 1,
  },
  cityButtonTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
    zIndex: 1,
  },
  cityButtonSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 2,
    zIndex: 1,
  },
  cityButtonArrow: {
    color: "#ffffff",
    fontSize: 24,
    zIndex: 1,
  },
  adventureButton: {
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  adventureButtonIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  adventureButtonTitle: {
    color: "#22c55e",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  adventureButtonSubtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginTop: 2,
  },
  adventureButtonArrow: {
    color: "#22c55e",
    fontSize: 20,
    marginLeft: "auto",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButtonSmall: {
    flex: 1,
    backgroundColor: "rgba(18, 18, 26, 0.6)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  actionButtonIconSmall: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionButtonTitleSmall: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  loreCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: "rgba(18, 18, 26, 0.4)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
    marginBottom: 30,
  },
  loreTitle: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },
  loreText: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 22,
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
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124, 58, 237, 0.1)",
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 10,
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
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
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
  resItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "47%",
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  resName: {
    color: "#94a3b8",
    fontSize: 11,
    textTransform: "capitalize",
  },
  resValue: {
    fontSize: 13,
    fontWeight: "700",
  },
});
