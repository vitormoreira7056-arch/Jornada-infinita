import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { useState } from "react";

export default function Skills() {
  const { state, useSkill } = useGame();
  const race = state.raceId ? getRaceById(state.raceId) : null;
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);

  const activeAbilities = race?.abilities.filter(a => a.type === "ativa") || [];
  const passiveAbility = race?.abilities.find(a => a.type === "passiva");

  const handleUseSkill = (index: number) => {
    const skill = state.activeSkills[index];
    if (skill.cooldown > 0) {
      Alert.alert("Habilidade em Recarga", `Aguarde ${skill.cooldown} turnos.`);
      return;
    }
    if (!skill.unlocked) {
      Alert.alert("Habilidade Bloqueada", "Desbloqueie em níveis superiores.");
      return;
    }
    useSkill(index);
    Alert.alert("Habilidade Usada!", `${skill.ability.name} foi ativada!`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ HABILIDADES</Text>
        <Text style={styles.headerSubtitle}>{race?.name}</Text>
      </View>

      {/* Passive Skill */}
      {passiveAbility && (
        <View style={styles.passiveSection}>
          <View style={styles.passiveHeader}>
            <Text style={styles.passiveIcon}>👑</Text>
            <Text style={styles.passiveTitle}>PASSIVA EXCLUSIVA</Text>
          </View>
          <View style={styles.passiveCard}>
            <Text style={styles.passiveName}>{passiveAbility.name}</Text>
            <Text style={styles.passiveDesc}>{passiveAbility.description}</Text>
            <View style={styles.passiveBadge}>
              <Text style={styles.passiveBadgeText}>SEMPRE ATIVA</Text>
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
        
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.skillCard,
              !isUnlocked && styles.skillLocked,
              cooldown > 0 && styles.skillCooldown,
              selectedSkill === index && styles.skillSelected,
            ]}
            onPress={() => setSelectedSkill(selectedSkill === index ? null : index)}
            disabled={!isUnlocked}
          >
            <View style={styles.skillHeader}>
              <View style={styles.skillNumber}>
                <Text style={styles.skillNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.skillInfo}>
                <Text style={styles.skillName}>{ability.name}</Text>
                <Text style={styles.skillShortDesc} numberOfLines={1}>
                  {ability.description.substring(0, 50)}...
                </Text>
              </View>
              <View style={styles.skillStatus}>
                {!isUnlocked ? (
                  <Text style={styles.lockedIcon}>🔒</Text>
                ) : cooldown > 0 ? (
                  <View style={styles.cooldownBadge}>
                    <Text style={styles.cooldownText}>{cooldown}</Text>
                  </View>
                ) : (
                  <Text style={styles.readyIcon}>⚡</Text>
                )}
              </View>
            </View>

            {selectedSkill === index && isUnlocked && (
              <View style={styles.skillDetails}>
                <Text style={styles.skillFullDesc}>{ability.description}</Text>
                <View style={styles.skillMeta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>RECARGA</Text>
                    <Text style={styles.metaValue}>{skillState?.maxCooldown || 3} turnos</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>CUSTO</Text>
                    <Text style={styles.metaValue}>MP Médio</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={[
                    styles.useBtn,
                    cooldown > 0 && styles.useBtnDisabled
                  ]}
                  onPress={() => handleUseSkill(index)}
                  disabled={cooldown > 0}
                >
                  <Text style={styles.useBtnText}>
                    {cooldown > 0 ? `RECARGA (${cooldown})` : "USAR HABILIDADE"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Skill Points Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 COMO FUNCIONA</Text>
        <Text style={styles.infoText}>
          • Habilidades passivas são sempre ativas{'\n'}
          • Habilidades ativas têm recarga em turnos{'\n'}
          • Desbloqueie novas habilidades subindo de nível{'\n'}
          • Use estrategicamente durante as batalhas
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#7c3aed",
    fontSize: 14,
    fontWeight: "600",
  },
  passiveSection: {
    marginBottom: 20,
  },
  passiveHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  passiveIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  passiveTitle: {
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },
  passiveCard: {
    backgroundColor: "#12121a",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#f59e0b",
  },
  passiveName: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  passiveDesc: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  passiveBadge: {
    backgroundColor: "#f59e0b20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  passiveBadgeText: {
    color: "#f59e0b",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },
  skillCard: {
    backgroundColor: "#12121a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  skillLocked: {
    opacity: 0.5,
  },
  skillCooldown: {
    borderColor: "#ef4444",
  },
  skillSelected: {
    borderColor: "#7c3aed",
  },
  skillHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  skillNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  skillShortDesc: {
    color: "#64748b",
    fontSize: 12,
  },
  skillStatus: {
    marginLeft: 12,
  },
  lockedIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  cooldownBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ef444420",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ef4444",
  },
  cooldownText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "700",
  },
  readyIcon: {
    fontSize: 24,
  },
  skillDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#1e1e2e",
  },
  skillFullDesc: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  skillMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    backgroundColor: "#0a0a0f",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  metaLabel: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: "700",
    marginBottom: 2,
  },
  metaValue: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "600",
  },
  useBtn: {
    backgroundColor: "#7c3aed",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  useBtnDisabled: {
    backgroundColor: "#1e1e2e",
  },
  useBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: "#12121a",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  infoTitle: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  infoText: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 20,
  },
});
