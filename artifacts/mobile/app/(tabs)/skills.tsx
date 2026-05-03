import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { PASSIVE_SKILLS, ACTIVE_SKILLS, getSkillCost, formatNumber } from "@/constants/game";
import ProgressBar from "@/components/ProgressBar";

export default function SkillsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, upgradeSkill } = useGame();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 64;

  const statColor = (stat: string) => {
    switch (stat) {
      case "atk": return colors.gold;
      case "hp": return colors.hp;
      case "def": return colors.gem;
      case "crit": return colors.crit;
      case "gold": return colors.gold;
      default: return colors.foreground;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Skills
        </Text>
        <View style={styles.goldRow}>
          <Feather name="dollar-sign" size={14} color={colors.gold} />
          <Text style={[styles.goldAmount, { color: colors.gold }]}>
            {formatNumber(state.resources.gold)}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Passive Skills */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          Passive Skills
        </Text>

        {PASSIVE_SKILLS.map((skill) => {
          const currentLevel = state.skillLevels[skill.id] ?? 0;
          const isMaxed = currentLevel >= skill.maxLevel;
          const cost = isMaxed ? 0 : getSkillCost(skill, currentLevel);
          const canAfford = state.resources.gold >= cost;
          const totalBonus = currentLevel * skill.bonusPerLevel;
          const sc = statColor(skill.stat);

          return (
            <View
              key={skill.id}
              style={[
                styles.skillCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isMaxed ? colors.gold + "88" : colors.border,
                },
              ]}
            >
              <View style={styles.skillTop}>
                <View
                  style={[
                    styles.skillIcon,
                    { backgroundColor: sc + "22" },
                  ]}
                >
                  <Feather
                    name={skill.featherIcon as any}
                    size={22}
                    color={sc}
                  />
                </View>
                <View style={styles.skillInfo}>
                  <View style={styles.skillNameRow}>
                    <Text style={[styles.skillName, { color: colors.foreground }]}>
                      {skill.name}
                    </Text>
                    {isMaxed && (
                      <View
                        style={[
                          styles.maxBadge,
                          { backgroundColor: colors.gold + "33" },
                        ]}
                      >
                        <Text style={[styles.maxBadgeText, { color: colors.gold }]}>
                          MAX
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.skillEffect, { color: sc }]}>
                    {skill.description.replace("{val}", `${skill.bonusPerLevel}`)}
                  </Text>
                  <Text style={[styles.currentBonus, { color: colors.mutedForeground }]}>
                    Current: +{totalBonus}%{" "}
                    {currentLevel > 0 && (
                      <Text style={{ color: sc }}>
                        ({currentLevel}/{skill.maxLevel})
                      </Text>
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.skillBottom}>
                <View style={styles.progressSection}>
                  <ProgressBar
                    current={currentLevel}
                    max={skill.maxLevel}
                    color={sc}
                    bgColor={sc + "22"}
                    height={6}
                  />
                </View>
                {!isMaxed ? (
                  <TouchableOpacity
                    style={[
                      styles.upgradeBtn,
                      {
                        backgroundColor: canAfford ? sc : colors.muted,
                        opacity: canAfford ? 1 : 0.5,
                      },
                    ]}
                    onPress={() => upgradeSkill(skill.id)}
                    disabled={!canAfford}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name="arrow-up"
                      size={12}
                      color={canAfford ? "#000" : colors.mutedForeground}
                    />
                    <Text
                      style={[
                        styles.upgradeCost,
                        {
                          color: canAfford ? "#000" : colors.mutedForeground,
                        },
                      ]}
                    >
                      {formatNumber(cost)}g
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={[
                      styles.upgradeBtnDisabled,
                      { backgroundColor: colors.gold + "33" },
                    ]}
                  >
                    <Feather name="check" size={12} color={colors.gold} />
                    <Text style={[styles.upgradeCost, { color: colors.gold }]}>
                      Maxed
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {/* Active Skills */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.mutedForeground, marginTop: 8 },
          ]}
        >
          Active Skills
        </Text>
        <Text style={[styles.activeSectionNote, { color: colors.mutedForeground }]}>
          Use these during battle from the Battle tab
        </Text>

        {ACTIVE_SKILLS.map((skill) => {
          const isPs = skill.effect === "power_strike";
          const acColor = isPs ? colors.accent : colors.gem;
          const cooldownRemaining = isPs
            ? state.battle.powerStrikeCooldown
            : state.battle.battleCryCooldown;
          const isActive = isPs
            ? state.battle.powerStrikeReady
            : state.battle.battleCryActive > 0;

          return (
            <View
              key={skill.id}
              style={[
                styles.activeSkillCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isActive ? acColor : colors.border,
                },
              ]}
            >
              <View
                style={[styles.skillIcon, { backgroundColor: acColor + "22" }]}
              >
                <Feather
                  name={skill.featherIcon as any}
                  size={22}
                  color={acColor}
                />
              </View>
              <View style={styles.activeSkillInfo}>
                <Text style={[styles.skillName, { color: colors.foreground }]}>
                  {skill.name}
                </Text>
                <Text style={[styles.skillEffect, { color: acColor }]}>
                  {skill.description}
                </Text>
                <Text style={[styles.cdInfo, { color: colors.mutedForeground }]}>
                  Cooldown: {skill.cooldown}s
                </Text>
              </View>
              <View style={styles.skillStatus}>
                {cooldownRemaining > 0 ? (
                  <View
                    style={[
                      styles.cdBadge,
                      { backgroundColor: colors.muted, borderColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.cdBadgeText, { color: colors.mutedForeground }]}>
                      {cooldownRemaining}s
                    </Text>
                  </View>
                ) : isActive ? (
                  <View
                    style={[
                      styles.cdBadge,
                      { backgroundColor: acColor + "33", borderColor: acColor },
                    ]}
                  >
                    <Text style={[styles.cdBadgeText, { color: acColor }]}>
                      ACTIVE
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.cdBadge,
                      { backgroundColor: acColor + "22", borderColor: acColor + "88" },
                    ]}
                  >
                    <Text style={[styles.cdBadgeText, { color: acColor }]}>
                      READY
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  goldRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  goldAmount: { fontSize: 16, fontWeight: "700" },
  scrollContent: { padding: 12, gap: 10 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    paddingLeft: 4,
  },
  activeSectionNote: { fontSize: 12, paddingLeft: 4, marginTop: -6 },
  skillCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
  },
  skillTop: { flexDirection: "row", gap: 12 },
  skillIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  skillInfo: { flex: 1, gap: 3 },
  skillNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  skillName: { fontSize: 16, fontWeight: "700" },
  maxBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  maxBadgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  skillEffect: { fontSize: 13, fontWeight: "500" },
  currentBonus: { fontSize: 12 },
  skillBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressSection: { flex: 1 },
  upgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeBtnDisabled: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeCost: { fontSize: 12, fontWeight: "800" },
  activeSkillCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  activeSkillInfo: { flex: 1, gap: 3 },
  cdInfo: { fontSize: 11 },
  skillStatus: { alignItems: "center" },
  cdBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  cdBadgeText: { fontSize: 11, fontWeight: "800" },
});
