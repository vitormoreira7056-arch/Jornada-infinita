import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useColors } from "@/hooks/useColors";
import { RACES, RaceDef, Gender } from "@/constants/races";
import { ELEMENTS, ElementId } from "@/constants/elements";
import { useGame } from "@/context/GameContext";

const { width: SCREEN_W } = Dimensions.get("window");
const ITEM_HEIGHT = 64;
const VISIBLE_ITEMS = 7;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PAD = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

const CATEGORY_COLORS: Record<string, string> = {
  TANQUE: "#78909C",
  GUERREIRO: "#EF5350",
  MAGO: "#AB47BC",
  ASSASSINO: "#7C4DFF",
  LADINO: "#26C6DA",
  SUPORTE: "#F48FB1",
  VERSÁTIL: "#FF9800",
};

// ──────── Sub-components ────────

function Ornament({ color }: { color: string }) {
  return (
    <View style={styles.ornamentRow}>
      <View style={[styles.ornamentLine, { backgroundColor: color + "60" }]} />
      <View style={[styles.ornamentDiamond, { borderColor: color + "90", backgroundColor: color + "20" }]} />
      <View style={[styles.ornamentLine, { backgroundColor: color + "60" }]} />
    </View>
  );
}

function ElementBadge({ elementId }: { elementId: ElementId }) {
  const el = ELEMENTS[elementId];
  if (!el) return null;
  return (
    <View style={[styles.elemBadge, { backgroundColor: el.color + "25", borderColor: el.color + "70" }]}>
      <Text style={{ fontSize: 11 }}>{el.emoji}</Text>
      <Text style={[styles.elemBadgeText, { color: el.color }]}>{el.name}</Text>
    </View>
  );
}

function QuickStat({ icon, value, color }: { icon: string; value: string; color: string }) {
  return (
    <View style={styles.quickStatItem}>
      <Feather name={icon as any} size={11} color={color} />
      <Text style={[styles.quickStatValue, { color }]}>{value}</Text>
    </View>
  );
}

// ──────── Attributes Modal ────────

function AttributesModal({ race, visible, onClose }: { race: RaceDef; visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const s = race.stats;

  const statRows = [
    { label: "HP", value: s.hp >= 0 ? `+${s.hp}` : `${s.hp}`, color: "#EF5350", show: s.hp !== 0 },
    { label: "Armadura", value: s.armor >= 0 ? `+${s.armor}` : `${s.armor}`, color: "#78909C", show: s.armor !== 0 },
    { label: "ATK Físico", value: s.atkF >= 0 ? `+${s.atkF}` : `${s.atkF}`, color: "#FF9800", show: s.atkF !== 0 },
    { label: "ATK Mágico", value: s.atkM >= 0 ? `+${s.atkM}` : `${s.atkM}`, color: "#AB47BC", show: s.atkM !== 0 },
    { label: "Crítico", value: `+${(s.critBonus * 100).toFixed(1)}%`, color: "#FFC107", show: s.critBonus > 0 },
    { label: "Mult. Crítico", value: `+${(s.critMultBonus * 100).toFixed(0)}%`, color: "#FFC107", show: s.critMultBonus > 0 },
    { label: "Sorte", value: `+${(s.luck * 100).toFixed(3)}%`, color: "#66BB6A", show: s.luck > 0 },
    { label: "Esquiva", value: `+${(s.dodge * 100).toFixed(1)}%`, color: "#26C6DA", show: s.dodge > 0 },
    { label: "Roubo de Vida", value: `+${(s.lifeSteal * 100).toFixed(1)}%`, color: "#EF5350", show: s.lifeSteal > 0 },
    { label: "Velocidade", value: `${s.speed > 0 ? "+" : ""}${s.speed}`, color: "#80CBC4", show: s.speed !== 0 },
    { label: "Poder Mágico", value: `+${s.magicPower}`, color: "#CE93D8", show: s.magicPower > 0 },
    { label: "Fortuna (drops)", value: `+${s.fortune}%`, color: "#FFD54F", show: s.fortune > 0 },
    { label: "Penet. Armadura", value: `+${s.armorPen}`, color: "#FF7043", show: s.armorPen > 0 },
    { label: "Regen. HP/turno", value: `+${s.hpRegen}`, color: "#EF5350", show: s.hpRegen > 0 },
  ].filter((r) => r.show);

  const resEntries = Object.entries(race.resistances) as [ElementId, number][];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: "#0E0E1A", paddingBottom: insets.bottom + 20 }]}>
          <View style={[styles.modalHandle, { backgroundColor: "#353560" }]} />

          <LinearGradient
            colors={[race.color + "30", "transparent"]}
            style={styles.modalHeaderGradient}
          >
            <View style={styles.modalHeader}>
              <View style={[styles.modalEmojiBox, { backgroundColor: race.color + "20", borderColor: race.color + "50" }]}>
                <Text style={{ fontSize: 32 }}>{race.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: race.color }]}>{race.name}</Text>
                <View style={[styles.categoryPillSm, { backgroundColor: (CATEGORY_COLORS[race.category] ?? "#888") + "30" }]}>
                  <Text style={[styles.categoryPillSmText, { color: CATEGORY_COLORS[race.category] ?? "#888" }]}>
                    {race.category}
                  </Text>
                </View>
              </View>
              <Pressable onPress={onClose} style={[styles.modalClose, { backgroundColor: "#1A1A30" }]}>
                <Feather name="x" size={18} color="#7070A0" />
              </Pressable>
            </View>
          </LinearGradient>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16 }}>
            <Text style={styles.loreTxt}>{race.lore}</Text>

            <View style={[styles.section, { borderColor: race.color + "40" }]}>
              <Text style={styles.sectionTitle}>ELEMENTOS BASE</Text>
              <View style={styles.elemRowWrap}>
                {race.primaryElements.length > 0
                  ? race.primaryElements.map((e) => <ElementBadge key={e} elementId={e} />)
                  : <Text style={{ color: "#7070A0", fontSize: 13 }}>✦ Versátil — aprende todos os elementos</Text>
                }
              </View>
              {race.learnableElements.length > 0 && (
                <>
                  <Text style={[styles.sectionSubTitle]}>Elementos aprendíveis</Text>
                  <View style={styles.elemRowWrap}>
                    {race.learnableElements.map((e) => <ElementBadge key={e} elementId={e} />)}
                  </View>
                </>
              )}
            </View>

            <View style={[styles.section, { borderColor: "#252540" }]}>
              <Text style={styles.sectionTitle}>ATRIBUTOS RACIAIS</Text>
              {statRows.map((r) => (
                <View key={r.label} style={styles.statLine}>
                  <Text style={styles.statLineLabel}>{r.label}</Text>
                  <Text style={[styles.statLineValue, { color: r.color }]}>{r.value}</Text>
                </View>
              ))}
            </View>

            {resEntries.length > 0 && (
              <View style={[styles.section, { borderColor: "#252540" }]}>
                <Text style={styles.sectionTitle}>RESISTÊNCIAS ELEMENTAIS</Text>
                {resEntries.map(([elemId, val]) => {
                  const el = ELEMENTS[elemId];
                  return (
                    <View key={elemId} style={styles.statLine}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={{ fontSize: 14 }}>{el?.emoji ?? "?"}</Text>
                        <Text style={styles.statLineLabel}>{el?.name ?? elemId}</Text>
                      </View>
                      <Text style={[styles.statLineValue, { color: val > 0 ? "#66BB6A" : "#EF5350" }]}>
                        {val > 0 ? "+" : ""}{val}%
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <View>
              <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>HABILIDADES</Text>
              {race.abilities.map((ab, i) => {
                const isPassive = ab.type === "passiva";
                return (
                  <View key={i} style={[styles.abilityCard, { borderColor: isPassive ? "#FFD70040" : "#25254040", backgroundColor: isPassive ? "#FFD70010" : "#0E0E1A" }]}>
                    <View style={styles.abilityHeader}>
                      <View style={[styles.abilityIconBox, { backgroundColor: isPassive ? "#FFD70025" : "#1A1A30" }]}>
                        <Feather name={(ab.icon as any) ?? "star"} size={13} color={isPassive ? "#FFD700" : race.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.abilityName, { color: isPassive ? "#FFD700" : "#E8E8F0" }]}>{ab.name}</Text>
                        <Text style={[styles.abilityType, { color: isPassive ? "#FFD700" : "#7070A0" }]}>
                          {isPassive ? "✦ PASSIVA" : "ATIVA"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.abilityDesc}>{ab.description}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ──────── Main Screen ────────

export default function RaceSelectScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectRace, selectGender } = useGame();
  const scrollRef = useRef<ScrollView>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [gender, setGender] = useState<Gender | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const selectedRace = RACES[selectedIdx];
  const catColor = CATEGORY_COLORS[selectedRace.category] ?? "#888";
  const topPad = Platform.OS === "web" ? 24 : insets.top;
  const bottomPad = Platform.OS === "web" ? 24 : insets.bottom;

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
    if (confirming || !gender) return;
    setConfirming(true);
    try {
      selectRace(selectedRace.id);
      selectGender(gender);
      router.replace("/(tabs)");
    } catch {
      setConfirming(false);
    }
  }, [selectedRace, gender, confirming, selectRace, selectGender, router]);

  const s = selectedRace.stats;
  const canConfirm = !!gender && !confirming;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#08080F", "#0C0C1A", "#08080F"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Radial glow behind hero card */}
      <View style={[styles.glowBlob, { backgroundColor: selectedRace.color + "18", top: topPad + 60, borderRadius: 200 }]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: topPad + 16, paddingBottom: bottomPad + 20 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>RPG IDLE</Text>
          <Ornament color="#C8A84B" />
          <Text style={styles.headerTitle}>Escolha sua Raça</Text>
          <Text style={styles.headerSub}>Deslize para explorar · A escolha é permanente</Text>
        </View>

        {/* ── Hero Card ── */}
        <View style={[styles.heroCard, { borderColor: selectedRace.color + "55" }]}>
          <LinearGradient
            colors={[selectedRace.color + "20", selectedRace.color + "06", "transparent"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />

          <View style={{ alignItems: "center", gap: 8 }}>
            {/* Glow circle */}
            <View style={styles.emojiCircleOuter}>
              <LinearGradient
                colors={[selectedRace.color + "55", selectedRace.color + "15"]}
                style={styles.emojiCircleInner}
              >
                <Text style={styles.heroEmoji}>{selectedRace.emoji}</Text>
              </LinearGradient>
            </View>

            <Text style={[styles.heroRaceName, { color: selectedRace.color }]}>{selectedRace.name}</Text>

            <View style={[styles.categoryPill, { backgroundColor: catColor + "25", borderColor: catColor + "60" }]}>
              <View style={[styles.categoryDot, { backgroundColor: catColor }]} />
              <Text style={[styles.categoryPillText, { color: catColor }]}>{selectedRace.category}</Text>
            </View>

            <Text style={styles.heroLore} numberOfLines={2}>{selectedRace.lore}</Text>
          </View>

          {/* Quick stats */}
          <View style={[styles.quickStatsRow, { borderTopColor: selectedRace.color + "30" }]}>
            {s.hp !== 0 && <QuickStat icon="heart" value={`${s.hp > 0 ? "+" : ""}${s.hp}`} color="#EF5350" />}
            {s.armor !== 0 && <QuickStat icon="shield" value={`+${s.armor}`} color="#78909C" />}
            {s.atkF !== 0 && <QuickStat icon="zap" value={`+${s.atkF}`} color="#FF9800" />}
            {s.atkM !== 0 && <QuickStat icon="feather" value={`+${s.atkM}`} color="#AB47BC" />}
            {s.dodge > 0 && <QuickStat icon="wind" value={`+${(s.dodge * 100).toFixed(0)}%`} color="#26C6DA" />}
            {s.lifeSteal > 0 && <QuickStat icon="droplet" value={`+${(s.lifeSteal * 100).toFixed(0)}%`} color="#EF5350" />}
            {s.critBonus > 0 && <QuickStat icon="crosshair" value={`+${(s.critBonus * 100).toFixed(0)}%`} color="#FFD700" />}
          </View>
        </View>

        {/* ── Wheel Picker ── */}
        <View style={[styles.pickerSection]}>
          <View style={[styles.pickerWrapper, { height: PICKER_HEIGHT }]}>
            {/* Top fade */}
            <View style={[styles.pickerFade, { top: 0 }]} pointerEvents="none">
              <LinearGradient colors={["#08080F", "#08080F", "transparent"]} style={StyleSheet.absoluteFill} />
            </View>
            {/* Bottom fade */}
            <View style={[styles.pickerFade, { bottom: 0 }]} pointerEvents="none">
              <LinearGradient colors={["transparent", "#08080F", "#08080F"]} style={StyleSheet.absoluteFill} />
            </View>
            {/* Selection lines */}
            <View pointerEvents="none" style={styles.selectionLinesWrapper}>
              <View style={[styles.selectionLine, { backgroundColor: selectedRace.color + "90" }]} />
              <View style={{ height: ITEM_HEIGHT - 2 }} />
              <View style={[styles.selectionLine, { backgroundColor: selectedRace.color + "90" }]} />
            </View>

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
                const isSelected = idx === selectedIdx;
                const opacity = dist === 0 ? 1 : dist === 1 ? 0.45 : dist === 2 ? 0.22 : 0.08;
                const scale = dist === 0 ? 1.05 : dist === 1 ? 0.94 : 0.86;
                return (
                  <TouchableOpacity
                    key={race.id}
                    onPress={() => scrollToIndex(idx)}
                    activeOpacity={0.7}
                    style={[styles.raceItem, { height: ITEM_HEIGHT, opacity }]}
                  >
                    <View style={[styles.raceItemInner, { transform: [{ scale }] }]}>
                      <Text style={{ fontSize: isSelected ? 22 : 18 }}>{race.emoji}</Text>
                      <Text style={[styles.raceName, {
                        color: isSelected ? race.color : "#E8E8F0",
                        fontWeight: isSelected ? "800" : "500",
                        fontSize: isSelected ? 18 : 16,
                      }]}>
                        {race.name}
                      </Text>
                      {isSelected && (
                        <View style={[styles.miniCatPill, { backgroundColor: (CATEGORY_COLORS[race.category] ?? "#888") + "30" }]}>
                          <Text style={[styles.miniCatText, { color: CATEGORY_COLORS[race.category] ?? "#888" }]}>
                            {race.category}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* ── Elements Row ── */}
        <View style={styles.elemSection}>
          {selectedRace.primaryElements.length > 0
            ? (
              <View style={styles.elemRowWrap}>
                {selectedRace.primaryElements.map((e) => <ElementBadge key={e} elementId={e} />)}
                {selectedRace.learnableElements.slice(0, 3).map((e) => (
                  <View key={e} style={[styles.elemBadge, styles.elemBadgeMuted, { borderColor: (ELEMENTS[e]?.color ?? "#888") + "40" }]}>
                    <Text style={{ fontSize: 11, opacity: 0.6 }}>{ELEMENTS[e]?.emoji}</Text>
                    <Text style={[styles.elemBadgeText, { color: (ELEMENTS[e]?.color ?? "#888") + "90" }]}>{ELEMENTS[e]?.name}</Text>
                  </View>
                ))}
              </View>
            )
            : (
              <View style={styles.elemRowWrap}>
                <View style={[styles.elemBadge, { backgroundColor: "#FF980025", borderColor: "#FF980060" }]}>
                  <Text style={{ fontSize: 11 }}>✦</Text>
                  <Text style={[styles.elemBadgeText, { color: "#FF9800" }]}>Versátil — todos os elementos</Text>
                </View>
              </View>
            )
          }
        </View>

        {/* Ornament separator */}
        <View style={{ paddingHorizontal: 24, marginVertical: 8 }}>
          <Ornament color="#252540" />
        </View>

        {/* ── Gender Selection ── */}
        <View style={styles.genderSection}>
          <Text style={styles.genderTitle}>ESCOLHA SEU GÊNERO</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[
                styles.genderCard,
                gender === "masculino"
                  ? { backgroundColor: "#4FC3F730", borderColor: "#4FC3F7" }
                  : { backgroundColor: "#12121E", borderColor: "#252540" },
              ]}
              onPress={() => setGender("masculino")}
              activeOpacity={0.75}
            >
              {gender === "masculino" && (
                <LinearGradient
                  colors={["#4FC3F720", "transparent"]}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={styles.genderSymbol}>♂</Text>
              <Text style={[styles.genderLabel, { color: gender === "masculino" ? "#4FC3F7" : "#7070A0" }]}>
                Masculino
              </Text>
              {gender === "masculino" && (
                <View style={[styles.genderCheck, { backgroundColor: "#4FC3F7" }]}>
                  <Feather name="check" size={10} color="#000" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderCard,
                gender === "feminino"
                  ? { backgroundColor: "#F48FB130", borderColor: "#F48FB1" }
                  : { backgroundColor: "#12121E", borderColor: "#252540" },
              ]}
              onPress={() => setGender("feminino")}
              activeOpacity={0.75}
            >
              {gender === "feminino" && (
                <LinearGradient
                  colors={["#F48FB120", "transparent"]}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={styles.genderSymbol}>♀</Text>
              <Text style={[styles.genderLabel, { color: gender === "feminino" ? "#F48FB1" : "#7070A0" }]}>
                Feminino
              </Text>
              {gender === "feminino" && (
                <View style={[styles.genderCheck, { backgroundColor: "#F48FB1" }]}>
                  <Feather name="check" size={10} color="#000" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Action Buttons ── */}
        <View style={[styles.actionsContainer]}>
          <TouchableOpacity
            style={[styles.atributosBtn, { borderColor: selectedRace.color + "70" }]}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <Feather name="bar-chart-2" size={15} color={selectedRace.color} />
            <Text style={[styles.atributosBtnText, { color: selectedRace.color }]}>Ver Atributos & Habilidades</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.confirmBtn,
              canConfirm
                ? { backgroundColor: selectedRace.color }
                : { backgroundColor: "#1A1A2E", borderWidth: 1, borderColor: "#252540" },
            ]}
            onPress={handleConfirm}
            disabled={!canConfirm}
            activeOpacity={0.85}
          >
            {canConfirm && (
              <LinearGradient
                colors={["#FFFFFF20", "transparent"]}
                style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
            )}
            <Feather
              name={confirming ? "loader" : "check-circle"}
              size={18}
              color={canConfirm ? "#000" : "#404068"}
            />
            <Text style={[styles.confirmBtnText, { color: canConfirm ? "#000" : "#404068" }]}>
              {confirming ? "Firmando Contrato..." : "Firmar Contrato"}
            </Text>
          </TouchableOpacity>

          {!gender && (
            <Text style={styles.genderHint}>Selecione seu gênero para continuar</Text>
          )}

          <Text style={styles.contractNote}>
            Ao firmar, você vincula sua alma a esta raça para sempre
          </Text>
        </View>
      </ScrollView>

      <AttributesModal race={selectedRace} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#08080F" },
  glowBlob: {
    position: "absolute", width: 300, height: 300,
    alignSelf: "center",
  },

  // Header
  header: { alignItems: "center", paddingHorizontal: 24, paddingBottom: 12, gap: 6 },
  headerEyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 3, color: "#C8A84B", textTransform: "uppercase" },
  headerTitle: { fontSize: 28, fontWeight: "900", color: "#E8E8F0", letterSpacing: 0.5 },
  headerSub: { fontSize: 12, color: "#505078", textAlign: "center" },

  // Ornament
  ornamentRow: { flexDirection: "row", alignItems: "center", gap: 10, width: "60%", alignSelf: "center", marginVertical: 4 },
  ornamentLine: { flex: 1, height: 1 },
  ornamentDiamond: { width: 8, height: 8, borderWidth: 1, transform: [{ rotate: "45deg" }] },

  // Hero card
  heroCard: {
    marginHorizontal: 16, marginBottom: 8,
    borderRadius: 20, borderWidth: 1.5,
    padding: 20, overflow: "hidden",
    gap: 16,
  },
  emojiCircleOuter: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "transparent",
  },
  emojiCircleInner: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: "center", justifyContent: "center",
  },
  heroEmoji: { fontSize: 52 },
  heroRaceName: { fontSize: 26, fontWeight: "900", textAlign: "center", letterSpacing: 0.5 },
  categoryPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1,
  },
  categoryDot: { width: 6, height: 6, borderRadius: 3 },
  categoryPillText: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  heroLore: { fontSize: 13, color: "#6060A0", textAlign: "center", lineHeight: 19, paddingHorizontal: 4 },
  quickStatsRow: {
    flexDirection: "row", flexWrap: "wrap", justifyContent: "center",
    gap: 12, paddingTop: 14, borderTopWidth: 1,
  },
  quickStatItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  quickStatValue: { fontSize: 13, fontWeight: "700" },

  // Picker
  pickerSection: { marginBottom: 4 },
  pickerWrapper: { position: "relative", width: "100%", overflow: "hidden" },
  pickerFade: { position: "absolute", left: 0, right: 0, height: ITEM_HEIGHT * 2.5, zIndex: 2 },
  selectionLinesWrapper: {
    position: "absolute",
    top: PAD, left: 20, right: 20, zIndex: 1,
    height: ITEM_HEIGHT,
  },
  selectionLine: { height: 1.5, width: "100%", borderRadius: 1 },
  raceItem: { width: "100%", alignItems: "center", justifyContent: "center" },
  raceItemInner: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 28, width: "100%" },
  raceName: { flex: 1 },
  miniCatPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  miniCatText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },

  // Elements
  elemSection: { alignItems: "center", paddingHorizontal: 20, paddingBottom: 4, minHeight: 40 },
  elemRowWrap: { flexDirection: "row", gap: 6, flexWrap: "wrap", justifyContent: "center" },
  elemBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  elemBadgeMuted: { backgroundColor: "transparent" },
  elemBadgeText: { fontSize: 10, fontWeight: "700" },

  // Gender
  genderSection: { paddingHorizontal: 16, marginBottom: 12, gap: 10 },
  genderTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5, color: "#7070A0", textAlign: "center" },
  genderRow: { flexDirection: "row", gap: 12 },
  genderCard: {
    flex: 1, alignItems: "center", gap: 6,
    paddingVertical: 16, borderRadius: 14, borderWidth: 1.5,
    overflow: "hidden", position: "relative",
  },
  genderSymbol: { fontSize: 28, color: "#E8E8F0" },
  genderLabel: { fontSize: 13, fontWeight: "700" },
  genderCheck: {
    position: "absolute", top: 8, right: 8,
    width: 18, height: 18, borderRadius: 9,
    alignItems: "center", justifyContent: "center",
  },
  genderHint: { fontSize: 11, color: "#505078", textAlign: "center", fontStyle: "italic" },

  // Actions
  actionsContainer: { paddingHorizontal: 16, gap: 10, alignItems: "center" },
  atributosBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 13, paddingHorizontal: 24,
    borderRadius: 12, borderWidth: 1.5, width: "100%", justifyContent: "center",
    backgroundColor: "transparent",
  },
  atributosBtnText: { fontSize: 14, fontWeight: "700" },
  confirmBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 17, paddingHorizontal: 32,
    borderRadius: 14, width: "100%", justifyContent: "center",
    overflow: "hidden", position: "relative",
  },
  confirmBtnText: { fontSize: 17, fontWeight: "900", letterSpacing: 0.3 },
  contractNote: { fontSize: 11, color: "#404060", textAlign: "center", fontStyle: "italic", paddingBottom: 4 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.75)" },
  modalContainer: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "92%", overflow: "hidden" },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 4 },
  modalHeaderGradient: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  modalHeader: { flexDirection: "row", alignItems: "center", gap: 14 },
  modalEmojiBox: { width: 56, height: 56, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
  modalTitle: { fontSize: 22, fontWeight: "900", marginBottom: 4 },
  categoryPillSm: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: "flex-start" },
  categoryPillSmText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },
  modalClose: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  loreTxt: { fontSize: 14, color: "#6060A0", lineHeight: 22, fontStyle: "italic" },
  section: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 8, backgroundColor: "#0A0A14" },
  sectionTitle: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, color: "#505078", textTransform: "uppercase" },
  sectionSubTitle: { fontSize: 10, fontWeight: "700", color: "#505078", marginTop: 6 },
  statLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 3 },
  statLineLabel: { fontSize: 13, color: "#7070A0" },
  statLineValue: { fontSize: 14, fontWeight: "700" },
  abilityCard: { borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8, gap: 8 },
  abilityHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  abilityIconBox: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  abilityName: { fontSize: 13, fontWeight: "700" },
  abilityType: { fontSize: 9, fontWeight: "800", letterSpacing: 0.6 },
  abilityDesc: { fontSize: 12, lineHeight: 18, color: "#7070A0" },
});
