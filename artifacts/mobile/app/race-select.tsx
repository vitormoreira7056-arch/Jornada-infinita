import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useColors } from "@/hooks/useColors";
import { RACES, RaceDef } from "@/constants/races";
import { ELEMENTS, ElementId } from "@/constants/elements";
import { useGame } from "@/context/GameContext";

const ITEM_HEIGHT = 72;
const VISIBLE_ITEMS = 7;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PAD = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

function ElementBadge({ elementId, size = "sm" }: { elementId: ElementId; size?: "sm" | "md" }) {
  const el = ELEMENTS[elementId];
  if (!el) return null;
  const pad = size === "md" ? { paddingHorizontal: 10, paddingVertical: 5 } : { paddingHorizontal: 7, paddingVertical: 3 };
  const fs = size === "md" ? 13 : 11;
  return (
    <View style={[styles.elemBadge, pad, { backgroundColor: el.color + "33", borderColor: el.color + "88" }]}>
      <Text style={{ fontSize: size === "md" ? 14 : 12 }}>{el.emoji}</Text>
      <Text style={[styles.elemBadgeText, { color: el.color, fontSize: fs }]}>{el.name}</Text>
    </View>
  );
}

function StatLine({ label, value, color }: { label: string; value: string; color: string }) {
  const colors = useColors();
  return (
    <View style={styles.statLine}>
      <Text style={[styles.statLineLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.statLineValue, { color }]}>{value}</Text>
    </View>
  );
}

function AbilityCard({ ability, index }: { ability: RaceDef["abilities"][0]; index: number }) {
  const colors = useColors();
  const isPassive = ability.type === "passiva";
  return (
    <View style={[styles.abilityCard, { backgroundColor: colors.background, borderColor: isPassive ? "#FFD700" + "55" : colors.border }]}>
      <View style={styles.abilityHeader}>
        <View style={[styles.abilityIconBox, { backgroundColor: isPassive ? "#FFD70033" : colors.card }]}>
          <Feather name={(ability.icon as any) ?? "star"} size={14} color={isPassive ? "#FFD700" : colors.foreground} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.abilityName, { color: isPassive ? "#FFD700" : colors.foreground }]}>{ability.name}</Text>
          <Text style={[styles.abilityType, { color: isPassive ? "#FFD700" : colors.mutedForeground }]}>
            {isPassive ? "✦ PASSIVA" : `Habilidade ${index + 1}`}
          </Text>
        </View>
      </View>
      <Text style={[styles.abilityDesc, { color: colors.mutedForeground }]}>{ability.description}</Text>
    </View>
  );
}

function AttributesModal({ race, visible, onClose }: { race: RaceDef; visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const s = race.stats;

  const statRows: { label: string; value: string; color: string; show: boolean }[] = [
    { label: "HP", value: s.hp >= 0 ? `+${s.hp}` : `${s.hp}`, color: "#EF5350", show: true },
    { label: "Armadura", value: s.armor >= 0 ? `+${s.armor}` : `${s.armor}`, color: "#78909C", show: true },
    { label: "ATK Físico", value: s.atkF >= 0 ? `+${s.atkF}` : `${s.atkF}`, color: "#FF9800", show: true },
    { label: "ATK Mágico", value: s.atkM >= 0 ? `+${s.atkM}` : `${s.atkM}`, color: "#AB47BC", show: true },
    { label: "Crítico", value: `+${(s.critBonus * 100).toFixed(1)}%`, color: "#FFC107", show: s.critBonus > 0 },
    { label: "Mult. Crítico", value: `+${(s.critMultBonus * 100).toFixed(0)}%`, color: "#FFC107", show: s.critMultBonus > 0 },
    { label: "Sorte", value: `+${(s.luck * 100).toFixed(3)}%`, color: "#66BB6A", show: true },
    { label: "Esquiva", value: `+${(s.dodge * 100).toFixed(1)}%`, color: "#26C6DA", show: true },
    { label: "Roubo de Vida", value: `+${(s.lifeSteal * 100).toFixed(1)}%`, color: "#EF5350", show: s.lifeSteal > 0 },
    { label: "Velocidade", value: `+${s.speed}`, color: "#80CBC4", show: s.speed !== 0 },
    { label: "Poder Mágico", value: `+${s.magicPower}`, color: "#CE93D8", show: s.magicPower > 0 },
    { label: "Fortuna (drop)", value: `+${s.fortune}%`, color: "#FFD54F", show: s.fortune > 0 },
    { label: "Penetração Armadura", value: `+${s.armorPen}`, color: "#FF7043", show: s.armorPen > 0 },
    { label: "Regen. HP/turno", value: `+${s.hpRegen}`, color: "#EF5350", show: s.hpRegen > 0 },
  ].filter((r) => r.show);

  const resEntries = Object.entries(race.resistances) as [ElementId, number][];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}>
          <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={{ fontSize: 26 }}>{race.emoji}</Text>
            <Text style={[styles.modalTitle, { color: race.color, flex: 1 }]}>{race.name}</Text>
            <Pressable onPress={onClose} style={styles.modalClose}>
              <Feather name="x" size={22} color={colors.mutedForeground} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16 }}>
            <Text style={[styles.loreTxt, { color: colors.mutedForeground }]}>{race.lore}</Text>

            <View style={[styles.section, { borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ELEMENTOS BASE</Text>
              <View style={styles.elemRowWrap}>
                {race.primaryElements.length > 0
                  ? race.primaryElements.map((e) => <ElementBadge key={e} elementId={e} size="md" />)
                  : <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Versátil — aprende todos os elementos</Text>
                }
              </View>
              {race.learnableElements.length > 0 && (
                <>
                  <Text style={[styles.sectionSubTitle, { color: colors.mutedForeground }]}>Elementos aprendíveis</Text>
                  <View style={styles.elemRowWrap}>
                    {race.learnableElements.map((e) => <ElementBadge key={e} elementId={e} size="sm" />)}
                  </View>
                </>
              )}
            </View>

            <View style={[styles.section, { borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ATRIBUTOS RACIAIS</Text>
              {statRows.map((r) => (
                <StatLine key={r.label} label={r.label} value={r.value} color={r.color} />
              ))}
            </View>

            {resEntries.length > 0 && (
              <View style={[styles.section, { borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>RESISTÊNCIAS</Text>
                {resEntries.map(([elemId, val]) => {
                  const el = ELEMENTS[elemId];
                  return (
                    <StatLine
                      key={elemId}
                      label={`${el?.emoji ?? "?"} ${el?.name ?? elemId}`}
                      value={`${val > 0 ? "+" : ""}${val}%`}
                      color={val > 0 ? "#66BB6A" : "#EF5350"}
                    />
                  );
                })}
              </View>
            )}

            <View>
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground, marginBottom: 10 }]}>HABILIDADES</Text>
              {race.abilities.map((ab, i) => (
                <AbilityCard key={i} ability={ab} index={i} />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function RaceSelectScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectRace } = useGame();
  const scrollRef = useRef<ScrollView>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.max(0, Math.min(RACES.length - 1, Math.round(y / ITEM_HEIGHT)));
    setSelectedIdx(idx);
  }, []);

  const scrollToIndex = useCallback((idx: number) => {
    scrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
    setSelectedIdx(idx);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (confirming) return;
    setConfirming(true);
    const race = RACES[selectedIdx];
    try {
      selectRace(race.id);
      router.replace("/(tabs)");
    } catch {
      setConfirming(false);
    }
  }, [selectedIdx, confirming, selectRace, router]);

  const selectedRace = RACES[selectedIdx];
  const topPad = Platform.OS === "web" ? 24 : insets.top;
  const bottomPad = Platform.OS === "web" ? 24 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={[styles.headerEmblem, { backgroundColor: selectedRace.color + "22", borderColor: selectedRace.color + "55" }]}>
          <Text style={{ fontSize: 36 }}>{selectedRace.emoji}</Text>
        </View>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Escolha sua Raça</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Deslize para explorar as raças do reino
        </Text>
      </View>

      <View style={[styles.pickerWrapper, { height: PICKER_HEIGHT }]}>
        <View pointerEvents="none" style={[styles.selectionBand, { top: PAD, height: ITEM_HEIGHT, borderColor: selectedRace.color + "88" }]} />
        <ScrollView
          ref={scrollRef}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
          contentContainerStyle={{ paddingVertical: PAD }}
          scrollEventThrottle={16}
        >
          {RACES.map((race, idx) => {
            const dist = Math.abs(idx - selectedIdx);
            const opacity = dist === 0 ? 1 : dist === 1 ? 0.55 : dist === 2 ? 0.3 : 0.12;
            const scale = dist === 0 ? 1.06 : dist === 1 ? 0.92 : 0.82;
            const isSelected = idx === selectedIdx;
            return (
              <TouchableOpacity
                key={race.id}
                onPress={() => scrollToIndex(idx)}
                activeOpacity={0.7}
                style={[styles.raceItem, { height: ITEM_HEIGHT, opacity }]}
              >
                <Animated.View style={[styles.raceItemInner, { transform: [{ scale }] }]}>
                  <Text style={{ fontSize: 22 }}>{race.emoji}</Text>
                  <Text
                    style={[
                      styles.raceName,
                      { color: isSelected ? selectedRace.color : colors.foreground, fontWeight: isSelected ? "800" : "500" },
                    ]}
                  >
                    {race.name}
                  </Text>
                  {isSelected && race.primaryElements.length > 0 && (
                    <View style={styles.raceElemRow}>
                      {race.primaryElements.slice(0, 2).map((e) => (
                        <Text key={e} style={{ fontSize: 14 }}>{ELEMENTS[e]?.emoji}</Text>
                      ))}
                    </View>
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.elemSection}>
        <View style={styles.elemRowWrap}>
          {selectedRace.primaryElements.length > 0
            ? selectedRace.primaryElements.map((e) => <ElementBadge key={e} elementId={e} size="md" />)
            : <Text style={[styles.versatileText, { color: colors.mutedForeground }]}>✦ Versátil — aprende todos os elementos</Text>
          }
        </View>
      </View>

      <View style={[styles.actionsContainer, { paddingBottom: bottomPad + 16 }]}>
        <TouchableOpacity
          style={[styles.atributosBtn, { borderColor: selectedRace.color + "88", backgroundColor: selectedRace.color + "15" }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Feather name="bar-chart-2" size={16} color={selectedRace.color} />
          <Text style={[styles.atributosBtnText, { color: selectedRace.color }]}>Ver Atributos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: confirming ? colors.muted : selectedRace.color }]}
          onPress={handleConfirm}
          disabled={confirming}
          activeOpacity={0.85}
        >
          <Feather name="check-circle" size={18} color={confirming ? colors.mutedForeground : "#000"} />
          <Text style={[styles.confirmBtnText, { color: confirming ? colors.mutedForeground : "#000" }]}>
            {confirming ? "Firmando Contrato..." : "Firmar Contrato"}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.contractNote, { color: colors.mutedForeground }]}>
          Ao firmar, você vincula sua alma a esta raça para sempre
        </Text>
      </View>

      <AttributesModal race={selectedRace} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", paddingHorizontal: 24, paddingBottom: 12, gap: 8 },
  headerEmblem: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, marginBottom: 4,
  },
  headerTitle: { fontSize: 26, fontWeight: "800", letterSpacing: 0.5 },
  headerSub: { fontSize: 14, textAlign: "center" },
  pickerWrapper: { position: "relative", width: "100%", overflow: "hidden" },
  selectionBand: {
    position: "absolute", left: 16, right: 16, zIndex: 1,
    borderTopWidth: 1.5, borderBottomWidth: 1.5, borderRadius: 12,
  },
  raceItem: { width: "100%", alignItems: "center", justifyContent: "center" },
  raceItemInner: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 24 },
  raceName: { fontSize: 20, flex: 1 },
  raceElemRow: { flexDirection: "row", gap: 4 },
  elemSection: { alignItems: "center", paddingHorizontal: 24, paddingVertical: 10, minHeight: 44 },
  elemRowWrap: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  elemBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 20, borderWidth: 1 },
  elemBadgeText: { fontWeight: "700" },
  versatileText: { fontSize: 13, fontStyle: "italic" },
  actionsContainer: { paddingHorizontal: 20, gap: 10, alignItems: "center" },
  atributosBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12, borderWidth: 1.5, width: "100%", justifyContent: "center",
  },
  atributosBtnText: { fontSize: 15, fontWeight: "700" },
  confirmBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 16, paddingHorizontal: 32, borderRadius: 14, width: "100%", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4,
  },
  confirmBtnText: { fontSize: 17, fontWeight: "800" },
  contractNote: { fontSize: 12, textAlign: "center", fontStyle: "italic" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.7)" },
  modalContainer: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "92%", minHeight: "60%" },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 4 },
  modalHeader: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 22, fontWeight: "800" },
  modalClose: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  loreTxt: { fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  section: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 8 },
  sectionTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  sectionSubTitle: { fontSize: 11, fontWeight: "600", marginTop: 8 },
  statLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 3 },
  statLineLabel: { fontSize: 13 },
  statLineValue: { fontSize: 14, fontWeight: "700" },
  abilityCard: { borderRadius: 10, borderWidth: 1, padding: 12, marginBottom: 8, gap: 6 },
  abilityHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  abilityIconBox: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  abilityName: { fontSize: 14, fontWeight: "700" },
  abilityType: { fontSize: 10, fontWeight: "600", letterSpacing: 0.5 },
  abilityDesc: { fontSize: 12, lineHeight: 18 },
});
