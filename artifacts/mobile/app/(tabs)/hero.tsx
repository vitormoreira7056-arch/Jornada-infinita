import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import {
  useGame,
  computePlayerAtk,
  computePlayerAtkM,
  computePlayerDef,
  computePlayerMaxHp,
  computePlayerCritRate,
  computePlayerDodge,
  computePlayerLuck,
  computePlayerLifeSteal,
  computePlayerFortune,
} from "@/context/GameContext";
import { CLASSES, ZONES, formatNumber } from "@/constants/game";
import { getRaceById } from "@/constants/races";
import { ELEMENTS, ElementId } from "@/constants/elements";
import ProgressBar from "@/components/ProgressBar";

function StatRow({
  label, value, valueColor, icon, iconColor, onPress,
}: {
  label: string; value: string; valueColor: string; icon: string; iconColor: string; onPress?: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.6 : 1} style={styles.statRow}>
      <View style={styles.statLeft}>
        <Feather name={icon as any} size={14} color={iconColor} />
        <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
        {onPress && <Feather name="info" size={10} color={colors.mutedForeground} />}
      </View>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
    </TouchableOpacity>
  );
}

function ElementBadge({ elementId }: { elementId: ElementId }) {
  const el = ELEMENTS[elementId];
  if (!el) return null;
  return (
    <View style={[styles.elemBadge, { backgroundColor: el.color + "33", borderColor: el.color + "66" }]}>
      <Text style={{ fontSize: 12 }}>{el.emoji}</Text>
      <Text style={[styles.elemBadgeText, { color: el.color }]}>{el.name}</Text>
    </View>
  );
}

function ResistanceModal({ raceId, visible, onClose }: { raceId: string; visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const race = getRaceById(raceId as any);
  if (!race) return null;
  const entries = Object.entries(race.resistances) as [ElementId, number][];
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.resModalOverlay} onPress={onClose}>
        <View style={[styles.resModalBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.resModalTitle, { color: colors.foreground }]}>Resistências — {race.name}</Text>
          {entries.map(([elemId, val]) => {
            const el = ELEMENTS[elemId];
            return (
              <View key={elemId} style={styles.resRow}>
                <Text style={{ fontSize: 14 }}>{el?.emoji}</Text>
                <Text style={[styles.resName, { color: colors.mutedForeground }]}>{el?.name ?? elemId}</Text>
                <Text style={[styles.resVal, { color: val > 0 ? "#66BB6A" : "#EF5350" }]}>
                  {val > 0 ? "+" : ""}{val}%
                </Text>
              </View>
            );
          })}
          {entries.length === 0 && (
            <Text style={[{ color: colors.mutedForeground, fontSize: 13 }]}>Sem resistências especiais</Text>
          )}
          <TouchableOpacity onPress={onClose} style={[styles.resCloseBtn, { backgroundColor: colors.muted }]}>
            <Text style={[styles.resCloseTxt, { color: colors.foreground }]}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

export default function HeroScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, prestige } = useGame();
  const [resModalVisible, setResModalVisible] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 64;

  if (!state.hero.classId) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={[styles.noHeroText, { color: colors.mutedForeground }]}>Selecione uma classe primeiro</Text>
      </View>
    );
  }

  const classDef = CLASSES.find((c) => c.id === state.hero.classId)!;
  const raceDef = state.hero.raceId ? getRaceById(state.hero.raceId) : undefined;

  const totalAtk = computePlayerAtk(state);
  const totalAtkM = computePlayerAtkM(state);
  const totalDef = computePlayerDef(state);
  const totalMaxHp = computePlayerMaxHp(state);
  const critRate = computePlayerCritRate(state);
  const dodge = computePlayerDodge(state);
  const luck = computePlayerLuck(state);
  const lifeSteal = computePlayerLifeSteal(state);
  const fortune = computePlayerFortune(state);
  const hpRegen = raceDef?.stats.hpRegen ?? 0;
  const speed = (raceDef?.stats.speed ?? 0) + state.hero.speed;
  const magicPower = (raceDef?.stats.magicPower ?? 0) + state.hero.magicPower;
  const critMult = state.hero.critDmg + (raceDef?.stats.critMultBonus ?? 0);

  const canPrestige = state.hero.level >= 20;

  const handlePrestige = () => {
    if (Platform.OS === "web") {
      if (window.confirm(`Prestige? Você voltará ao nível 1 mas ganhará +10% de dano permanente.\n\nPrestige atual: ${state.hero.prestigeCount}`)) {
        prestige();
      }
    } else {
      Alert.alert("Prestige", `Resetar para Nv.1 e ganhar +10% de dano permanente?\n\nPrestige atual: ${state.hero.prestigeCount}`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Prestige", style: "destructive", onPress: prestige },
      ]);
    }
  };

  const currentZone = ZONES[state.battle.zone - 1];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Herói</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]} showsVerticalScrollIndicator={false}>

        {/* Identity Card */}
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: classDef.color + "66" }]}>
          <View style={[styles.heroIconCircle, { backgroundColor: classDef.color + "22" }]}>
            <Feather name={classDef.featherIcon as any} size={44} color={classDef.color} />
          </View>
          <View style={styles.heroIdentity}>
            <View style={styles.heroNames}>
              <Text style={[styles.heroClass, { color: classDef.color }]}>{classDef.name}</Text>
              {raceDef && (
                <Text style={[styles.heroRace, { color: raceDef.color }]}>
                  {raceDef.emoji} {raceDef.name}
                </Text>
              )}
            </View>
            <View style={styles.levelRow}>
              <Text style={[styles.heroLevel, { color: colors.foreground }]}>Nível {state.hero.level}</Text>
              {state.hero.prestigeCount > 0 && (
                <View style={[styles.prestigeBadge, { backgroundColor: colors.gold + "33" }]}>
                  <Feather name="star" size={10} color={colors.gold} />
                  <Text style={[styles.prestigeBadgeText, { color: colors.gold }]}>P{state.hero.prestigeCount}</Text>
                </View>
              )}
            </View>
            <View style={styles.expBarSection}>
              <ProgressBar current={state.hero.exp} max={state.hero.expToNext} color={colors.exp} bgColor={colors.expBg} height={8} />
              <Text style={[styles.expText, { color: colors.mutedForeground }]}>
                {formatNumber(state.hero.exp)} / {formatNumber(state.hero.expToNext)} EXP
              </Text>
            </View>
          </View>
        </View>

        {/* Race Elements */}
        {raceDef && raceDef.primaryElements.length > 0 && (
          <View style={[styles.elemCard, { backgroundColor: colors.card, borderColor: raceDef.color + "44" }]}>
            <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>ELEMENTOS BASE</Text>
            <View style={styles.elemRow}>
              {raceDef.primaryElements.map((e) => <ElementBadge key={e} elementId={e} />)}
            </View>
            {raceDef.learnableElements.length > 0 && (
              <>
                <Text style={[styles.elemSubTitle, { color: colors.mutedForeground }]}>Aprendíveis</Text>
                <View style={styles.elemRow}>
                  {raceDef.learnableElements.slice(0, 5).map((e) => <ElementBadge key={e} elementId={e} />)}
                  {raceDef.learnableElements.length > 5 && (
                    <Text style={[styles.elemMore, { color: colors.mutedForeground }]}>+{raceDef.learnableElements.length - 5}</Text>
                  )}
                </View>
              </>
            )}
          </View>
        )}

        {/* Combat Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>ATRIBUTOS DE COMBATE</Text>
          <StatRow label="ATK Físico" value={formatNumber(totalAtk)} valueColor={colors.gold} icon="zap" iconColor={colors.gold} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow label="ATK Mágico" value={formatNumber(totalAtkM)} valueColor="#CE93D8" icon="feather" iconColor="#CE93D8" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow label="Armadura/DEF" value={formatNumber(totalDef)} valueColor={colors.gem} icon="shield" iconColor={colors.gem} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow label="HP Máximo" value={formatNumber(totalMaxHp)} valueColor={colors.hp} icon="heart" iconColor={colors.hp} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow label="Taxa Crítico" value={`${(critRate * 100).toFixed(1)}%`} valueColor={colors.crit} icon="crosshair" iconColor={colors.crit} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow label="Dano Crítico" value={`${(critMult * 100).toFixed(0)}%`} valueColor={colors.crit} icon="trending-up" iconColor={colors.crit} />
          {magicPower > 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <StatRow label="Poder Mágico" value={`+${magicPower}`} valueColor="#CE93D8" icon="star" iconColor="#CE93D8" />
            </>
          )}
          {speed !== 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <StatRow label="Velocidade" value={speed > 0 ? `+${speed}` : `${speed}`} valueColor="#80CBC4" icon="wind" iconColor="#80CBC4" />
            </>
          )}
          {state.hero.prestigeBonus > 1 && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <StatRow label="Bônus Prestige" value={`+${((state.hero.prestigeBonus - 1) * 100).toFixed(0)}% DMG`} valueColor={colors.gold} icon="star" iconColor={colors.gold} />
            </>
          )}
        </View>

        {/* Special Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>ATRIBUTOS ESPECIAIS</Text>
          <StatRow
            label="Sorte"
            value={`${(luck * 100).toFixed(3)}% / 20%`}
            valueColor="#66BB6A"
            icon="gift"
            iconColor="#66BB6A"
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow
            label="Esquiva"
            value={`${(dodge * 100).toFixed(1)}% / 35%`}
            valueColor="#26C6DA"
            icon="wind"
            iconColor="#26C6DA"
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow
            label="Roubo de Vida"
            value={lifeSteal > 0 ? `${(lifeSteal * 100).toFixed(1)}%` : "0%"}
            valueColor="#EF5350"
            icon="droplet"
            iconColor="#EF5350"
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow
            label="Fortuna (drops)"
            value={`+${fortune.toFixed(0)}%`}
            valueColor="#FFD54F"
            icon="dollar-sign"
            iconColor="#FFD54F"
          />
          {hpRegen > 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <StatRow label="Regen. HP/turno" value={`+${hpRegen}`} valueColor={colors.hp} icon="activity" iconColor={colors.hp} />
            </>
          )}
          {state.hero.raceId && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <StatRow
                label="Resistências"
                value="Ver detalhes ›"
                valueColor={raceDef?.color ?? colors.foreground}
                icon="layers"
                iconColor={raceDef?.color ?? colors.foreground}
                onPress={() => setResModalVisible(true)}
              />
            </>
          )}
        </View>

        {/* Racial Abilities */}
        {raceDef && (
          <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: raceDef.color + "44" }]}>
            <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>HABILIDADES RACIAIS — {raceDef.name.toUpperCase()}</Text>
            {raceDef.abilities.map((ab, i) => {
              const isPassive = ab.type === "passiva";
              return (
                <View key={i}>
                  {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                  <View style={styles.abilityRow}>
                    <View style={[styles.abilityIcon, { backgroundColor: isPassive ? "#FFD70022" : colors.background }]}>
                      <Feather name={(ab.icon as any) ?? "star"} size={14} color={isPassive ? "#FFD700" : raceDef.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.abilityTitleRow}>
                        <Text style={[styles.abilityName, { color: isPassive ? "#FFD700" : colors.foreground }]}>{ab.name}</Text>
                        <View style={[styles.abilityTypeBadge, { backgroundColor: isPassive ? "#FFD70022" : raceDef.color + "22" }]}>
                          <Text style={[styles.abilityTypeTxt, { color: isPassive ? "#FFD700" : raceDef.color }]}>
                            {isPassive ? "PASSIVA" : "ATIVA"}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.abilityDesc, { color: colors.mutedForeground }]}>{ab.description}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Progress */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>PROGRESSO</Text>
          <StatRow label="Zona Atual" value={currentZone.name} valueColor={currentZone.color} icon="map" iconColor={currentZone.color} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow label="Zonas Desbloqueadas" value={`${state.unlockedZones.length} / 5`} valueColor={colors.foreground} icon="unlock" iconColor={colors.foreground} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow label="Monstros Mortos" value={formatNumber(state.resources.totalKills)} valueColor={colors.destructive} icon="target" iconColor={colors.destructive} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow label="Ouro Ganho" value={formatNumber(state.resources.totalGoldEarned)} valueColor={colors.gold} icon="dollar-sign" iconColor={colors.gold} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatRow label="Prestige" value={`${state.hero.prestigeCount}x`} valueColor={colors.gold} icon="star" iconColor={colors.gold} />
        </View>

        {/* Prestige */}
        <View style={[styles.prestigeCard, { backgroundColor: colors.card, borderColor: canPrestige ? colors.gold + "88" : colors.border }]}>
          <View style={styles.prestigeInfo}>
            <Feather name="award" size={28} color={canPrestige ? colors.gold : colors.mutedForeground} />
            <View style={styles.prestigeText}>
              <Text style={[styles.prestigeTitle, { color: canPrestige ? colors.gold : colors.mutedForeground }]}>Prestige</Text>
              <Text style={[styles.prestigeDesc, { color: colors.mutedForeground }]}>
                {canPrestige
                  ? "Resetar para Nv.1 e ganhar +10% de dano permanente"
                  : `Alcance o Nível 20 para desbloquear (${state.hero.level}/20)`}
              </Text>
              {state.hero.prestigeCount > 0 && (
                <Text style={[styles.prestigeBonus, { color: colors.gold }]}>
                  Bônus atual: +{((state.hero.prestigeBonus - 1) * 100).toFixed(0)}% DMG
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.prestigeBtn, { backgroundColor: canPrestige ? colors.gold : colors.muted, opacity: canPrestige ? 1 : 0.5 }]}
            onPress={handlePrestige}
            disabled={!canPrestige}
            activeOpacity={0.8}
          >
            <Text style={[styles.prestigeBtnText, { color: canPrestige ? "#000" : colors.mutedForeground }]}>Prestige</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {state.hero.raceId && (
        <ResistanceModal raceId={state.hero.raceId} visible={resModalVisible} onClose={() => setResModalVisible(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  noHeroText: { fontSize: 16 },
  scrollContent: { padding: 12, gap: 12 },
  heroCard: { borderRadius: 16, borderWidth: 1.5, padding: 16, flexDirection: "row", gap: 16, alignItems: "center" },
  heroIconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  heroIdentity: { flex: 1, gap: 6 },
  heroNames: { gap: 2 },
  heroClass: { fontSize: 20, fontWeight: "800" },
  heroRace: { fontSize: 14, fontWeight: "600" },
  levelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  heroLevel: { fontSize: 15, fontWeight: "600" },
  prestigeBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  prestigeBadgeText: { fontSize: 10, fontWeight: "800" },
  expBarSection: { gap: 4 },
  expText: { fontSize: 11 },
  elemCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  cardTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 2 },
  elemRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  elemSubTitle: { fontSize: 11, fontWeight: "600", marginTop: 4 },
  elemMore: { fontSize: 12, alignSelf: "center" },
  elemBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  elemBadgeText: { fontSize: 11, fontWeight: "700" },
  statsCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 10 },
  statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  statLabel: { fontSize: 14 },
  statValue: { fontSize: 15, fontWeight: "700" },
  divider: { height: 1 },
  abilityRow: { flexDirection: "row", gap: 10, alignItems: "flex-start", paddingVertical: 6 },
  abilityIcon: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 },
  abilityTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  abilityName: { fontSize: 13, fontWeight: "700", flex: 1 },
  abilityTypeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  abilityTypeTxt: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  abilityDesc: { fontSize: 12, lineHeight: 17 },
  prestigeCard: { borderRadius: 14, borderWidth: 1.5, padding: 16, gap: 14 },
  prestigeInfo: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  prestigeText: { flex: 1, gap: 4 },
  prestigeTitle: { fontSize: 18, fontWeight: "800" },
  prestigeDesc: { fontSize: 13, lineHeight: 18 },
  prestigeBonus: { fontSize: 13, fontWeight: "700", marginTop: 2 },
  prestigeBtn: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  prestigeBtnText: { fontSize: 16, fontWeight: "800" },
  resModalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)", padding: 24 },
  resModalBox: { borderRadius: 16, borderWidth: 1, padding: 20, width: "100%", gap: 10 },
  resModalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  resRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  resName: { flex: 1, fontSize: 13 },
  resVal: { fontSize: 14, fontWeight: "700" },
  resCloseBtn: { marginTop: 8, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  resCloseTxt: { fontSize: 14, fontWeight: "600" },
});
