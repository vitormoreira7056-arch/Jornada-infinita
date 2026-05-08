import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { useState } from "react";

export default function Skills() {
  const { state, useSkill } = useGame();
  const race = state.raceId ? getRaceById(state.raceId) : null;
  const [expandedSkill, setExpandedSkill] = useState<number | null>(null);

  const activeAbilities = race?.abilities.filter(a => a.type === "ativa") || [];
  const passiveAbility = race?.abilities.find(a => a.type === "passiva");

  const handleUseSkill = (index: number) => {
    const skill = state.activeSkills[index];
    if (skill.cooldown > 0) {
      Alert.alert("Habilidade em Recarga", `Aguarde ${skill.cooldown} turnos.`);
      return;
    }
    if (!skill.unlocked) {
      const levelReq = skill.levelRequired;
      Alert.alert("Habilidade Bloqueada", `Desbloqueie no nível ${levelReq}.`);
      return;
    }
    useSkill(index);
    Alert.alert("Habilidade Usada!", `${skill.ability.name} foi ativada!`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ HABILIDADES</Text>
        <Text style={[styles.headerSubtitle, { color: race?.color || "#7c3aed" }]}>{race?.name}</Text>
      </View>

      {/* Passive Skill */}
      {passiveAbility && (
        <View style={styles.passiveSection}>
          <View style={styles.passiveHeader}>
            <View style={styles.passiveIconBox}>
              <Text style={styles.passiveIcon}>👑</Text>
            </View>
            <View>
              <Text style={styles.passiveLabel}>PASSIVA EXCLUSIVA</Text>
              <Text style={styles.passiveTitle}>Sempre Ativa</Text>
            </View>
          </View>
          <View style={styles.passiveCard}>
            <Text style={styles.passiveName}>{passiveAbility.name}</Text>
            <Text style={styles.passiveDesc}>{passiveAbility.description}</Text>
            <View style={styles.passiveBadge}>
              <Text style={styles.passiveBadgeText}>SEM CUSTO</Text>
            </View>
          </View>
        </View>
      )}

      {/* Active Skills */}
      <Text style={styles.sectionTitle}>HABILIDADES ATIVAS</Text>
      
      {activeAbilities.map((ability, index) => {
        const skillState = state.activeSkills[index];
        const isUnlocked = skillState?.unlocked ?? false;
        const cooldown = skillState?.cooldown ?? 0;
        const levelReq = skillState?.levelRequired ?? 1;
        
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.skillCard,
              !isUnlocked && styles.skillLocked,
              cooldown > 0 && styles.skillCooldown,
              expandedSkill === index && styles.skillExpanded,
            ]}
            onPress={() => setExpandedSkill(expandedSkill === index ? null : index)}
            activeOpacity={0.8}
          >
            <View style={styles.skillHeader}>
              <View style={[
                styles.skillNumber,
                isUnlocked ? { backgroundColor: race?.color || "#7c3aed" } : { backgroundColor: "#1e1e2e" }
              ]}>
                <Text style={styles.skillNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.skillInfo}>
                <Text style={styles.skillName}>{ability.name}</Text>
                {!isUnlocked ? (
                  <Text style={styles.skillStatus}>🔒 Desbloqueia no Nv. {levelReq}</Text>
                ) : cooldown > 0 ? (
                  <Text style={styles.skillStatusCooldown}>⏱️ Recarga: {cooldown} turnos</Text>
                ) : (
                  <Text style={styles.skillStatusReady}>⚡ Pronta para usar</Text>
                )}
              </View>
              <View style={styles.skillArrow}>
                <Text style={{ color: "#64748b", fontSize: 12 }}>
                  {expandedSkill === index ? "▼" : "▶"}
                </Text>
              </View>
            </View>

            {expandedSkill === index && (
              <View style={styles.skillDetails}>
                <Text style={styles.skillDesc}>{ability.description}</Text>
                <View style={styles.skillMeta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>RECARGA</Text>
                    <Text style={styles.metaValue}>{skillState?.maxCooldown || 5} turnos</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>CUSTO</Text>
                    <Text style={styles.metaValue}>MP</Text>
                  </View>
                </View>
                {isUnlocked && (
                  <TouchableOpacity 
                    style={[
                      styles.useBtn,
                      cooldown > 0 && styles.useBtnDisabled,
                      { backgroundColor: cooldown > 0 ? "#1e1e2e" : race?.color || "#7c3aed" }
                    ]}
                    onPress={() => handleUseSkill(index)}
                    disabled={cooldown > 0}
                  >
                    <Text style={styles.useBtnText}>
                      {cooldown > 0 ? `RECARGA (${cooldown})` : "USAR HABILIDADE"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 COMO FUNCIONA</Text>
        <View style={styles.infoList}>
          <InfoItem icon="👑" text="Passivas são sempre ativas" />
          <InfoItem icon="⚡" text="Ativas têm recarga em turnos" />
          <InfoItem icon="🔒" text="Desbloqueie no nível indicado" />
          <InfoItem icon="🎯" text="Use estrategicamente nas batalhas" />
        </View>
      </View>
    </ScrollView>
  );
}

function InfoItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050508",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  passiveSection: {
    marginBottom: 24,
  },
  passiveHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  passiveIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  passiveIcon: {
    fontSize: 22,
  },
  passiveLabel: {
    color: "#f59e0b",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  passiveTitle: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2,
  },
  passiveCard: {
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  passiveName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  passiveDesc: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  passiveBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  passiveBadgeText: {
    color: "#f59e0b",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },
  skillCard: {
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  skillLocked: {
    opacity: 0.6,
  },
  skillCooldown: {
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  skillExpanded: {
    borderColor: "rgba(124, 58, 237, 0.3)",
  },
  skillHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  skillNumber: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  skillNumberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 3,
  },
  skillStatus: {
    color: "#64748b",
    fontSize: 11,
  },
  skillStatusCooldown: {
    color: "#ef4444",
    fontSize: 11,
    fontWeight: "600",
  },
  skillStatusReady: {
    color: "#22c55e",
    fontSize: 11,
    fontWeight: "600",
  },
  skillArrow: {
    marginLeft: 10,
  },
  skillDetails: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(124, 58, 237, 0.1)",
  },
  skillDesc: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  skillMeta: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  metaItem: {
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  metaLabel: {
    color: "#64748b",
    fontSize: 8,
    fontWeight: "700",
    marginBottom: 2,
  },
  metaValue: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  useBtn: {
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  useBtnDisabled: {
    backgroundColor: "#1e1e2e",
  },
  useBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  infoTitle: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 10,
    width: 24,
  },
  infoText: {
    color: "#94a3b8",
    fontSize: 12,
  },
});
