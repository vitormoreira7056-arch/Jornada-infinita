import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { CLASSES, ZONES, formatNumber } from "@/constants/game";
import ProgressBar from "@/components/ProgressBar";
import ClassSelectScreen from "@/components/ClassSelectScreen";

export default function BattleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    state,
    toggleBattle,
    usePowerStrike,
    useBattleCry,
    revive,
    getPlayerMaxHp,
  } = useGame();
  const logRef = useRef<ScrollView>(null);

  if (state.isFirstLaunch || !state.hero.classId) {
    return <ClassSelectScreen />;
  }

  const monster = state.battle.currentMonster;
  const zone = ZONES[state.battle.zone - 1];
  const maxHp = getPlayerMaxHp();
  const isDead = state.hero.currentHp <= 0;
  const classDef = CLASSES.find((c) => c.id === state.hero.classId)!;
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 64;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top bar: zone + resources */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: topPad,
            backgroundColor: zone.color + "18",
            borderBottomColor: zone.color + "44",
          },
        ]}
      >
        <View>
          <Text style={[styles.zoneName, { color: zone.color }]}>
            {zone.name}
          </Text>
          <Text style={[styles.stageLabel, { color: colors.mutedForeground }]}>
            Stage {state.battle.stage}/10
            {state.battle.stage === 10 ? "  — BOSS" : ""}
          </Text>
        </View>
        <View style={styles.resourcesRow}>
          <View style={styles.resourceChip}>
            <Feather name="dollar-sign" size={12} color={colors.gold} />
            <Text style={[styles.resourceText, { color: colors.gold }]}>
              {formatNumber(state.resources.gold)}
            </Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: classDef.color + "33", borderColor: classDef.color + "88" }]}>
            <Text style={[styles.levelText, { color: classDef.color }]}>
              Lv.{state.hero.level}
            </Text>
          </View>
        </View>
      </View>

      {/* Monster card */}
      {monster ? (
        <View
          style={[
            styles.monsterCard,
            {
              backgroundColor: colors.card,
              borderColor: monster.isBoss ? colors.boss : colors.border,
              borderWidth: monster.isBoss ? 2 : 1,
            },
          ]}
        >
          {monster.isBoss && (
            <View style={[styles.bossBadge, { backgroundColor: colors.boss }]}>
              <Text style={styles.bossBadgeText}>BOSS</Text>
            </View>
          )}
          <View style={styles.monsterHeader}>
            <Text
              style={[
                styles.monsterName,
                { color: monster.isBoss ? colors.boss : colors.foreground },
              ]}
            >
              {monster.name}
            </Text>
            <Text style={[styles.monsterLvl, { color: colors.mutedForeground }]}>
              Lv.{monster.level}
            </Text>
          </View>
          <View style={styles.monsterHpSection}>
            <ProgressBar
              current={monster.currentHp}
              max={monster.maxHp}
              color={monster.isBoss ? colors.boss : colors.hp}
              bgColor={colors.hpBg}
              height={14}
            />
            <Text style={[styles.hpNumbers, { color: colors.mutedForeground }]}>
              {formatNumber(monster.currentHp)} / {formatNumber(monster.maxHp)}
            </Text>
          </View>
          {state.battle.battleCryActive > 0 && (
            <View style={[styles.shieldBanner, { backgroundColor: "#1565C0" + "44" }]}>
              <Feather name="shield" size={12} color="#44AAFF" />
              <Text style={[styles.shieldText, { color: "#44AAFF" }]}>
                Shield Active: {state.battle.battleCryActive}s
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View
          style={[styles.monsterCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.noMonsterText, { color: colors.mutedForeground }]}>
            Start battle to face an enemy
          </Text>
        </View>
      )}

      {/* Battle log */}
      <ScrollView
        ref={logRef}
        style={[
          styles.battleLog,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {state.battle.log.length === 0 ? (
          <Text style={[styles.logEmpty, { color: colors.mutedForeground }]}>
            Combat log will appear here...
          </Text>
        ) : (
          state.battle.log.map((entry, i) => {
            const isCritEntry = entry.includes("[CRIT]") || entry.includes("[POWER");
            const isSpecial =
              entry.includes("Level Up") ||
              entry.includes("Defeated") ||
              entry.includes("Drop") ||
              entry.includes("ZONE");
            const isRevive = entry.includes("Revived") || entry.includes("defeated!");
            return (
              <Text
                key={i}
                style={[
                  styles.logEntry,
                  {
                    color: isCritEntry
                      ? colors.crit
                      : isSpecial
                      ? colors.exp
                      : isRevive
                      ? colors.destructive
                      : colors.mutedForeground,
                    fontWeight: isSpecial || isCritEntry ? ("600" as const) : ("400" as const),
                  },
                ]}
              >
                {entry}
              </Text>
            );
          })
        )}
      </ScrollView>

      {/* Player stats */}
      <View
        style={[
          styles.playerStats,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.statBarRow}>
          <Text style={[styles.statBarLabel, { color: colors.hp }]}>HP</Text>
          <View style={styles.barFlex}>
            <ProgressBar
              current={state.hero.currentHp}
              max={maxHp}
              color={colors.hp}
              bgColor={colors.hpBg}
              height={10}
            />
          </View>
          <Text style={[styles.statBarValue, { color: colors.hp }]}>
            {formatNumber(state.hero.currentHp)}/{formatNumber(maxHp)}
          </Text>
        </View>
        <View style={styles.statBarRow}>
          <Text style={[styles.statBarLabel, { color: colors.exp }]}>EXP</Text>
          <View style={styles.barFlex}>
            <ProgressBar
              current={state.hero.exp}
              max={state.hero.expToNext}
              color={colors.exp}
              bgColor={colors.expBg}
              height={10}
            />
          </View>
          <Text style={[styles.statBarValue, { color: colors.mutedForeground }]}>
            {formatNumber(state.hero.exp)}/{formatNumber(state.hero.expToNext)}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: bottomPad }]}>
        {isDead ? (
          <TouchableOpacity
            style={[styles.reviveBtn, { backgroundColor: colors.exp }]}
            onPress={revive}
            activeOpacity={0.8}
          >
            <Feather name="refresh-cw" size={18} color="#000" />
            <Text style={[styles.reviveBtnText, { color: "#000" }]}>Revive</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.skillBtn,
                {
                  backgroundColor:
                    state.battle.powerStrikeCooldown > 0
                      ? colors.muted
                      : colors.accent + "CC",
                  borderColor:
                    state.battle.powerStrikeReady ? colors.crit : colors.accent,
                },
              ]}
              onPress={usePowerStrike}
              disabled={state.battle.powerStrikeCooldown > 0}
              activeOpacity={0.75}
            >
              <Feather
                name="zap"
                size={16}
                color={state.battle.powerStrikeCooldown > 0 ? colors.mutedForeground : "#fff"}
              />
              <Text
                style={[
                  styles.skillBtnLabel,
                  {
                    color:
                      state.battle.powerStrikeCooldown > 0
                        ? colors.mutedForeground
                        : "#fff",
                  },
                ]}
              >
                Power
              </Text>
              {state.battle.powerStrikeCooldown > 0 ? (
                <Text style={[styles.cdText, { color: colors.mutedForeground }]}>
                  {state.battle.powerStrikeCooldown}s
                </Text>
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.battleToggle,
                {
                  backgroundColor: state.battle.isActive
                    ? colors.destructive
                    : colors.primary,
                },
              ]}
              onPress={toggleBattle}
              activeOpacity={0.85}
            >
              <Feather
                name={state.battle.isActive ? "pause-circle" : "play-circle"}
                size={22}
                color={state.battle.isActive ? "#fff" : colors.primaryForeground}
              />
              <Text
                style={[
                  styles.battleToggleText,
                  {
                    color: state.battle.isActive
                      ? "#fff"
                      : colors.primaryForeground,
                  },
                ]}
              >
                {state.battle.isActive ? "FIGHTING" : "START"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.skillBtn,
                {
                  backgroundColor:
                    state.battle.battleCryCooldown > 0 ? colors.muted : "#1565C0CC",
                  borderColor:
                    state.battle.battleCryActive > 0 ? "#44AAFF" : "#1565C0",
                },
              ]}
              onPress={useBattleCry}
              disabled={state.battle.battleCryCooldown > 0}
              activeOpacity={0.75}
            >
              <Feather
                name="shield"
                size={16}
                color={
                  state.battle.battleCryCooldown > 0
                    ? colors.mutedForeground
                    : "#44AAFF"
                }
              />
              <Text
                style={[
                  styles.skillBtnLabel,
                  {
                    color:
                      state.battle.battleCryCooldown > 0
                        ? colors.mutedForeground
                        : "#44AAFF",
                  },
                ]}
              >
                Barrier
              </Text>
              {state.battle.battleCryCooldown > 0 ? (
                <Text style={[styles.cdText, { color: colors.mutedForeground }]}>
                  {state.battle.battleCryCooldown}s
                </Text>
              ) : state.battle.battleCryActive > 0 ? (
                <Text style={[styles.cdText, { color: "#44AAFF" }]}>
                  {state.battle.battleCryActive}s
                </Text>
              ) : null}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  zoneName: { fontSize: 17, fontWeight: "700" },
  stageLabel: { fontSize: 12, marginTop: 2 },
  resourcesRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  resourceChip: { flexDirection: "row", gap: 4, alignItems: "center" },
  resourceText: { fontSize: 14, fontWeight: "700" },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  levelText: { fontSize: 12, fontWeight: "700" },
  monsterCard: {
    margin: 12,
    padding: 14,
    borderRadius: 14,
  },
  bossBadge: {
    position: "absolute",
    top: -1,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  bossBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  monsterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  monsterName: { fontSize: 20, fontWeight: "800" },
  monsterLvl: { fontSize: 12 },
  monsterHpSection: { gap: 4 },
  hpNumbers: { fontSize: 11, textAlign: "right" },
  noMonsterText: { textAlign: "center", padding: 20 },
  shieldBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    padding: 6,
    borderRadius: 6,
  },
  shieldText: { fontSize: 12, fontWeight: "600" },
  battleLog: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  logEmpty: { fontSize: 13, textAlign: "center", paddingVertical: 12 },
  logEntry: { fontSize: 12, lineHeight: 20 },
  playerStats: {
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  statBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statBarLabel: { fontSize: 11, fontWeight: "700", width: 28 },
  barFlex: { flex: 1 },
  statBarValue: { fontSize: 10, width: 80, textAlign: "right" },
  controls: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  skillBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    gap: 3,
  },
  skillBtnLabel: { fontSize: 11, fontWeight: "700" },
  cdText: { fontSize: 10 },
  battleToggle: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  battleToggleText: { fontSize: 15, fontWeight: "800", letterSpacing: 0.5 },
  reviveBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  reviveBtnText: { fontSize: 16, fontWeight: "800" },
});
