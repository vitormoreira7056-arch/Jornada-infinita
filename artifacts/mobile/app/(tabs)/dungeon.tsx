import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { ZONES } from "@/constants/game";

export default function DungeonScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, selectZoneAndStage } = useGame();
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 64;

  const handleSelectZone = (zoneId: number) => {
    if (!state.unlockedZones.includes(zoneId)) return;
    setSelectedZone(zoneId);
  };

  const handleStartStage = (stage: number) => {
    if (selectedZone === null) return;
    selectZoneAndStage(selectedZone, stage);
    setSelectedZone(null);
  };

  const getCurrentStageForZone = (zoneId: number) => {
    if (state.battle.zone === zoneId) return state.battle.stage;
    return 1;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Dungeon
        </Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          {state.unlockedZones.length}/{ZONES.length} zones unlocked
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {ZONES.map((zone) => {
          const isUnlocked = state.unlockedZones.includes(zone.id);
          const isCurrent = state.battle.zone === zone.id;
          const currentStage = getCurrentStageForZone(zone.id);

          return (
            <TouchableOpacity
              key={zone.id}
              style={[
                styles.zoneCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isCurrent
                    ? zone.color
                    : isUnlocked
                    ? colors.border
                    : colors.border + "44",
                  opacity: isUnlocked ? 1 : 0.45,
                },
              ]}
              onPress={() => handleSelectZone(zone.id)}
              disabled={!isUnlocked}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.zoneColorBar,
                  { backgroundColor: zone.color },
                ]}
              />
              <View style={styles.zoneContent}>
                <View style={styles.zoneTop}>
                  <View>
                    <View style={styles.zoneNameRow}>
                      {isCurrent && (
                        <View
                          style={[
                            styles.currentBadge,
                            { backgroundColor: zone.color + "33" },
                          ]}
                        >
                          <Feather
                            name="zap"
                            size={10}
                            color={zone.color}
                          />
                          <Text
                            style={[
                              styles.currentBadgeText,
                              { color: zone.color },
                            ]}
                          >
                            ACTIVE
                          </Text>
                        </View>
                      )}
                      <Text
                        style={[
                          styles.zoneName,
                          {
                            color: isUnlocked
                              ? colors.foreground
                              : colors.mutedForeground,
                          },
                        ]}
                      >
                        {zone.name}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.zoneDesc,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {zone.description}
                    </Text>
                  </View>
                  {isUnlocked ? (
                    <View style={styles.stageInfo}>
                      <Text
                        style={[
                          styles.stageNum,
                          { color: zone.color },
                        ]}
                      >
                        {currentStage}/10
                      </Text>
                      <Text
                        style={[
                          styles.stageLabel,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        stage
                      </Text>
                    </View>
                  ) : (
                    <Feather
                      name="lock"
                      size={20}
                      color={colors.mutedForeground}
                    />
                  )}
                </View>

                {isUnlocked && (
                  <View style={styles.monstersRow}>
                    {zone.monsters.slice(0, 4).map((m) => (
                      <View
                        key={m.id}
                        style={[
                          styles.monsterPill,
                          {
                            backgroundColor: zone.color + "22",
                            borderColor: zone.color + "55",
                          },
                        ]}
                      >
                        <Text
                          style={[styles.monsterPillText, { color: zone.color }]}
                        >
                          {m.name}
                        </Text>
                      </View>
                    ))}
                    <View
                      style={[
                        styles.monsterPill,
                        {
                          backgroundColor: colors.boss + "22",
                          borderColor: colors.boss + "66",
                        },
                      ]}
                    >
                      <Feather name="alert-triangle" size={9} color={colors.boss} />
                      <Text
                        style={[styles.monsterPillText, { color: colors.boss }]}
                      >
                        {zone.bossName}
                      </Text>
                    </View>
                  </View>
                )}

                {!isUnlocked && (
                  <Text
                    style={[styles.unlockHint, { color: colors.mutedForeground }]}
                  >
                    Clear stage 10 of{" "}
                    {ZONES[zone.id - 2]?.name ?? "previous zone"} to unlock
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Stage selector modal */}
      <Modal
        visible={selectedZone !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedZone(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {selectedZone !== null && (
              <>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {ZONES[selectedZone - 1].name}
                </Text>
                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Select starting stage
                </Text>
                <View style={styles.stageGrid}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((stage) => {
                    const isBoss = stage === 10;
                    const zoneColor = ZONES[selectedZone - 1].color;
                    return (
                      <TouchableOpacity
                        key={stage}
                        style={[
                          styles.stageBtn,
                          {
                            backgroundColor: isBoss
                              ? colors.boss + "22"
                              : zoneColor + "22",
                            borderColor: isBoss ? colors.boss : zoneColor,
                          },
                        ]}
                        onPress={() => handleStartStage(stage)}
                        activeOpacity={0.75}
                      >
                        <Text
                          style={[
                            styles.stageBtnText,
                            { color: isBoss ? colors.boss : zoneColor },
                          ]}
                        >
                          {stage}
                        </Text>
                        {isBoss && (
                          <Text
                            style={[
                              styles.stageBossLabel,
                              { color: colors.boss },
                            ]}
                          >
                            BOSS
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <TouchableOpacity
                  style={[
                    styles.cancelBtn,
                    { borderColor: colors.border },
                  ]}
                  onPress={() => setSelectedZone(null)}
                >
                  <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  headerSub: { fontSize: 13, marginTop: 2 },
  scrollContent: { padding: 12, gap: 12 },
  zoneCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: "row",
    overflow: "hidden",
  },
  zoneColorBar: { width: 5 },
  zoneContent: { flex: 1, padding: 14, gap: 10 },
  zoneTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  zoneNameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" },
  currentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  zoneName: { fontSize: 18, fontWeight: "700" },
  zoneDesc: { fontSize: 12, lineHeight: 17 },
  stageInfo: { alignItems: "center" },
  stageNum: { fontSize: 22, fontWeight: "800" },
  stageLabel: { fontSize: 10 },
  monstersRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  monsterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
  },
  monsterPillText: { fontSize: 10, fontWeight: "600" },
  unlockHint: { fontSize: 12, fontStyle: "italic" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    gap: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: "800" },
  modalSubtitle: { fontSize: 13 },
  stageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  stageBtn: {
    width: "18%",
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  stageBtnText: { fontSize: 16, fontWeight: "800" },
  stageBossLabel: { fontSize: 7, fontWeight: "700", letterSpacing: 0.5 },
  cancelBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  cancelBtnText: { fontSize: 15, fontWeight: "600" },
});
