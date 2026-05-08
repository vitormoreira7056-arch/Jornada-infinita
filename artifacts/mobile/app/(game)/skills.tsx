import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from "react-native";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { useState, useEffect } from "react";

// Skill Card
function SkillCard({ 
  skill, 
  index,
  totalStats 
}: { 
  skill: { ability: { name: string; description: string; icon: string; type: string }; cooldown: number; maxCooldown: number; unlocked: boolean; levelRequired: number };
  index: number;
  totalStats: { mp: number };
}) {
  const manaCost = 10 + (index * 5);
  
  return (
    <View style={[styles.skillCard, !skill.unlocked && styles.skillLocked]}>
      <View style={styles.skillHeader}>
        <View style={[styles.skillIconBox, skill.unlocked ? { backgroundColor: "rgba(124, 58, 237, 0.2)" } : { backgroundColor: "rgba(100, 100, 100, 0.1)" }]}>
          <Text style={styles.skillIcon}>{skill.unlocked ? "⚡" : "🔒"}</Text>
        </View>
        <View style={styles.skillInfo}>
          <Text style={[styles.skillName, !skill.unlocked && { color: "#64748b" }]}>{skill.ability.name}</Text>
          <Text style={styles.skillType}>{skill.ability.type === "ativa" ? "🎮 Ativa" : "✨ Passiva"}</Text>
        </View>
        {skill.unlocked ? (
          <View style={styles.manaBadge}>
            <Text style={styles.manaText}>💧 {manaCost}</Text>
          </View>
        ) : (
          <View style={styles.lockBadge}>
            <Text style={styles.lockText}>Nv. {skill.levelRequired}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.skillDescription}>{skill.ability.description}</Text>
      
      {skill.unlocked && (
        <View style={styles.skillStats}>
          <Text style={styles.skillStat}>⏱️ Recarga: {skill.maxCooldown}s</Text>
          <Text style={styles.skillStat}>💧 Custo: {manaCost} MP</Text>
        </View>
      )}
      
      {skill.cooldown > 0 && (
        <View style={styles.cooldownBar}>
          <Text style={styles.cooldownText}>Em recarga: {skill.cooldown}s</Text>
        </View>
      )}
    </View>
  );
}

// Passive Skill Card
function PassiveSkillCard({ race }: { race: ReturnType<typeof getRaceById> }) {
  if (!race) return null;
  
  const passive = race.abilities.find(a => a.type === "passiva");
  if (!passive) return null;
  
  return (
    <View style={[styles.skillCard, { borderColor: "rgba(245, 158, 11, 0.3)" }]}>
      <View style={styles.skillHeader}>
        <View style={[styles.skillIconBox, { backgroundColor: "rgba(245, 158, 11, 0.2)" }]}>
          <Text style={styles.skillIcon}>👑</Text>
        </View>
        <View style={styles.skillInfo}>
          <Text style={[styles.skillName, { color: "#f59e0b" }]}>{passive.name}</Text>
          <Text style={styles.skillType}>✨ Passiva Racial</Text>
        </View>
        <View style={[styles.manaBadge, { backgroundColor: "rgba(245, 158, 11, 0.2)" }]}>
          <Text style={[styles.manaText, { color: "#f59e0b" }]}>Sempre Ativa</Text>
        </View>
      </View>
      
      <Text style={styles.skillDescription}>{passive.description}</Text>
    </View>
  );
}

export default function SkillsScreen() {
  const { state, getTotalStats } = useGame();
  const race = state.raceId ? getRaceById(state.raceId) : null;
  const stats = getTotalStats();
  const [fadeAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>✨ HABILIDADES</Text>
          <Text style={styles.headerSubtitle}>{race?.name}</Text>
        </View>
        
        {/* Race Info */}
        <View style={[styles.raceCard, { borderColor: race?.color || "#7c3aed" }]}>
          <Text style={styles.raceEmoji}>{race?.emoji}</Text>
          <Text style={[styles.raceName, { color: race?.color || "#7c3aed" }]}>{race?.name}</Text>
          <Text style={styles.raceDescription}>{race?.lore}</Text>
        </View>
        
        {/* Passive Skill */}
        <Text style={styles.sectionTitle}>👑 HABILIDADE PASSIVA</Text>
        <PassiveSkillCard race={race} />
        
        {/* Active Skills */}
        <Text style={styles.sectionTitle}>🎮 HABILIDADES ATIVAS</Text>
        
        {state.activeSkills.map((skill, index) => (
          <SkillCard 
            key={index} 
            skill={skill} 
            index={index}
            totalStats={stats}
          />
        ))}
        
        {/* Mana Info */}
        <View style={styles.manaCard}>
          <Text style={styles.manaTitle}>💧 SISTEMA DE MANA</Text>
          <Text style={styles.manaDescription}>
            Mana é usada para habilidades ativas. Regenera automaticamente durante o combate. 
            O MP máximo é 50% do seu HP máximo.
          </Text>
          <View style={styles.manaStats}>
            <Text style={styles.manaStat}>MP Máximo: {Math.floor(stats.mp)}</Text>
            <Text style={styles.manaStat}>Regen: {stats.mpRegen.toFixed(1)}/s</Text>
          </View>
        </View>
        
        {/* Combat Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 DICAS DE COMBATE</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Use skills estrategicamente - elas têm cooldown</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Ataque básico não custa mana e não tem cooldown</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Habilidades desbloqueiam em níveis específicos</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>A passiva racial está sempre ativa</Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050508",
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: "#64748b",
    fontSize: 14,
  },
  raceCard: {
    backgroundColor: "rgba(18, 18, 26, 0.6)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
  },
  raceEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  raceName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  raceDescription: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 16,
  },
  skillCard: {
    backgroundColor: "rgba(18, 18, 26, 0.6)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.15)",
  },
  skillLocked: {
    opacity: 0.6,
    borderColor: "rgba(100, 100, 100, 0.2)",
  },
  skillHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  skillIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  skillIcon: {
    fontSize: 24,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  skillType: {
    color: "#64748b",
    fontSize: 11,
  },
  manaBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  manaText: {
    color: "#3b82f6",
    fontSize: 11,
    fontWeight: "700",
  },
  lockBadge: {
    backgroundColor: "rgba(100, 100, 100, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lockText: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
  },
  skillDescription: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  skillStats: {
    flexDirection: "row",
    gap: 16,
  },
  skillStat: {
    color: "#64748b",
    fontSize: 12,
  },
  cooldownBar: {
    backgroundColor: "rgba(100, 100, 100, 0.2)",
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
    alignItems: "center",
  },
  cooldownText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  manaCard: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  manaTitle: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },
  manaDescription: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  manaStats: {
    flexDirection: "row",
    gap: 16,
  },
  manaStat: {
    color: "#3b82f6",
    fontSize: 13,
    fontWeight: "600",
  },
  tipsCard: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  tipsTitle: {
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  tipBullet: {
    color: "#f59e0b",
    fontSize: 14,
    marginRight: 8,
  },
  tipText: {
    color: "#94a3b8",
    fontSize: 13,
    flex: 1,
  },
});
