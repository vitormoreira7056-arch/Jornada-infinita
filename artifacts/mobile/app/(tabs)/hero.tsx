import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useGame, computePlayerAtk, computePlayerDef, computePlayerMaxHp } from "@/context/GameContext";
import { CLASSES, ZONES, formatNumber } from "@/constants/game";
import ProgressBar from "@/components/ProgressBar";

interface StatRowProps {
  label: string;
  value: string;
  valueColor: string;
  icon: string;
  iconColor: string;
}

function StatRow({ label, value, valueColor, icon, iconColor }: StatRowProps) {
  const colors = useColors();
  return (
    <View style={styles.statRow}>
      <View style={styles.statLeft}>
        <Feather name={icon as any} size={14} color={iconColor} />
        <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

export default function HeroScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, prestige } = useGame();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 64;

  if (!state.hero.classId) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={[styles.noHeroText, { color: colors.mutedForeground }]}>
          Select a class first
        </Text>
      </View>
    );
  }

  const classDef = CLASSES.find((c) => c.id === state.hero.classId)!;
  const totalAtk = computePlayerAtk(state);
  const totalDef = computePlayerDef(state);
  const totalMaxHp = computePlayerMaxHp(state);
  const equipCrit = Object.values(state.equippedItems).reduce(
    (sum, eq) => sum + (eq?.critBonus ?? 0),
    0
  );
  const critRateBonus = (state.skillLevels["precision"] ?? 0) * 2 / 100;
  const totalCrit = state.hero.critRate + equipCrit + critRateBonus;
  const canPrestige = state.hero.level >= 20;

  const handlePrestige = () => {
    if (Platform.OS === "web") {
      if (
        window.confirm(
          `Prestige? You will reset to level 1 but gain +10% permanent damage bonus.\n\nCurrent prestige: ${state.hero.prestigeCount}`
        )
      ) {
        prestige();
      }
    } else {
      Alert.alert(
        "Prestige",
        `Reset to level 1 and gain +10% permanent damage bonus?\n\nCurrent prestige: ${state.hero.prestigeCount}`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Prestige", style: "destructive", onPress: prestige },
        ]
      );
    }
  };

  const currentZone = ZONES[state.battle.zone - 1];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Hero</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero identity card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.card,
              borderColor: classDef.color + "66",
            },
          ]}
        >
          <View
            style={[
              styles.heroIconCircle,
              { backgroundColor: classDef.color + "22" },
            ]}
          >
            <Feather
              name={classDef.featherIcon as any}
              size={44}
              color={classDef.color}
            />
          </View>
          <View style={styles.heroIdentity}>
            <Text style={[styles.heroClass, { color: classDef.color }]}>
              {classDef.name}
            </Text>
            <View style={styles.levelRow}>
              <Text style={[styles.heroLevel, { color: colors.foreground }]}>
                Level {state.hero.level}
              </Text>
              {state.hero.prestigeCount > 0 && (
                <View
                  style={[
                    styles.prestigeBadge,
                    { backgroundColor: colors.gold + "33" },
                  ]}
                >
                  <Feather name="star" size={10} color={colors.gold} />
                  <Text style={[styles.prestigeBadgeText, { color: colors.gold }]}>
                    P{state.hero.prestigeCount}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.expBarSection}>
              <ProgressBar
                current={state.hero.exp}
                max={state.hero.expToNext}
                color={colors.exp}
                bgColor={colors.expBg}
                height={8}
              />
              <Text style={[styles.expText, { color: colors.mutedForeground }]}>
                {formatNumber(state.hero.exp)} / {formatNumber(state.hero.expToNext)} EXP
              </Text>
            </View>
          </View>
        </View>

        {/* Combat Stats */}
        <View
          style={[
            styles.statsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>
            Combat Stats
          </Text>
          <StatRow
            label="Attack"
            value={formatNumber(totalAtk)}
            valueColor={colors.gold}
            icon="zap"
            iconColor={colors.gold}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow
            label="Defense"
            value={formatNumber(totalDef)}
            valueColor={colors.gem}
            icon="shield"
            iconColor={colors.gem}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow
            label="Max HP"
            value={formatNumber(totalMaxHp)}
            valueColor={colors.hp}
            icon="heart"
            iconColor={colors.hp}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow
            label="CRIT Rate"
            value={`${(totalCrit * 100).toFixed(1)}%`}
            valueColor={colors.crit}
            icon="crosshair"
            iconColor={colors.crit}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow
            label="CRIT Damage"
            value={`${(state.hero.critDmg * 100).toFixed(0)}%`}
            valueColor={colors.crit}
            icon="trending-up"
            iconColor={colors.crit}
          />
          {state.hero.prestigeBonus > 1 && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <StatRow
                label="Prestige Bonus"
                value={`+${((state.hero.prestigeBonus - 1) * 100).toFixed(0)}% DMG`}
                valueColor={colors.gold}
                icon="star"
                iconColor={colors.gold}
              />
            </>
          )}
        </View>

        {/* Progress */}
        <View
          style={[
            styles.statsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>
            Progress
          </Text>
          <StatRow
            label="Current Zone"
            value={currentZone.name}
            valueColor={currentZone.color}
            icon="map"
            iconColor={currentZone.color}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow
            label="Zones Unlocked"
            value={`${state.unlockedZones.length} / 5`}
            valueColor={colors.foreground}
            icon="unlock"
            iconColor={colors.foreground}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow
            label="Monsters Killed"
            value={formatNumber(state.resources.totalKills)}
            valueColor={colors.destructive}
            icon="target"
            iconColor={colors.destructive}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow
            label="Gold Earned"
            value={formatNumber(state.resources.totalGoldEarned)}
            valueColor={colors.gold}
            icon="dollar-sign"
            iconColor={colors.gold}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow
            label="Prestige Count"
            value={`${state.hero.prestigeCount}x`}
            valueColor={colors.gold}
            icon="star"
            iconColor={colors.gold}
          />
        </View>

        {/* Prestige */}
        <View
          style={[
            styles.prestigeCard,
            {
              backgroundColor: colors.card,
              borderColor: canPrestige ? colors.gold + "88" : colors.border,
            },
          ]}
        >
          <View style={styles.prestigeInfo}>
            <Feather
              name="award"
              size={28}
              color={canPrestige ? colors.gold : colors.mutedForeground}
            />
            <View style={styles.prestigeText}>
              <Text
                style={[
                  styles.prestigeTitle,
                  { color: canPrestige ? colors.gold : colors.mutedForeground },
                ]}
              >
                Prestige
              </Text>
              <Text
                style={[
                  styles.prestigeDesc,
                  { color: colors.mutedForeground },
                ]}
              >
                {canPrestige
                  ? "Reset to Lv.1 and gain +10% permanent ATK bonus"
                  : `Reach Level 20 to unlock (${state.hero.level}/20)`}
              </Text>
              {state.hero.prestigeCount > 0 && (
                <Text style={[styles.prestigeBonus, { color: colors.gold }]}>
                  Current bonus: +{((state.hero.prestigeBonus - 1) * 100).toFixed(0)}% DMG
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.prestigeBtn,
              {
                backgroundColor: canPrestige ? colors.gold : colors.muted,
                opacity: canPrestige ? 1 : 0.5,
              },
            ]}
            onPress={handlePrestige}
            disabled={!canPrestige}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.prestigeBtnText,
                { color: canPrestige ? "#000" : colors.mutedForeground },
              ]}
            >
              Prestige
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  noHeroText: { fontSize: 16 },
  scrollContent: { padding: 12, gap: 12 },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  heroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  heroIdentity: { flex: 1, gap: 6 },
  heroClass: { fontSize: 22, fontWeight: "800" },
  levelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  heroLevel: { fontSize: 16, fontWeight: "600" },
  prestigeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prestigeBadgeText: { fontSize: 10, fontWeight: "800" },
  expBarSection: { gap: 4 },
  expText: { fontSize: 11 },
  statsCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  statLabel: { fontSize: 14 },
  statValue: { fontSize: 15, fontWeight: "700" },
  divider: { height: 1 },
  prestigeCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    gap: 14,
  },
  prestigeInfo: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  prestigeText: { flex: 1, gap: 4 },
  prestigeTitle: { fontSize: 18, fontWeight: "800" },
  prestigeDesc: { fontSize: 13, lineHeight: 18 },
  prestigeBonus: { fontSize: 13, fontWeight: "700", marginTop: 2 },
  prestigeBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  prestigeBtnText: { fontSize: 16, fontWeight: "800" },
});
