import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Alert } from "react-native";
import { useGame } from "@/context/GameContext";
import { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import { MOB_RANK_MULTIPLIERS } from "@/constants/mobs";

// HP/MP Bar
function ResourceBar({ current, max, color, icon }: { current: number; max: number; color: string; icon: string }) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  return (
    <View style={styles.barContainer}>
      <Text style={styles.barIcon}>{icon}</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barText}>{Math.floor(current)}/{max}</Text>
    </View>
  );
}

// Skill Button
function SkillButton({ 
  skill, 
  index, 
  onPress, 
  disabled 
}: { 
  skill: { ability: { name: string; description: string; icon: string }; cooldown: number; unlocked: boolean };
  index: number;
  onPress: () => void;
  disabled: boolean;
}) {
  const manaCost = 10 + (index * 5);
  
  return (
    <TouchableOpacity 
      style={[
        styles.skillButton,
        !skill.unlocked && styles.skillLocked,
        skill.cooldown > 0 && styles.skillCooldown,
        disabled && styles.skillDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || !skill.unlocked || skill.cooldown > 0}
    >
      <Text style={styles.skillIcon}>{skill.unlocked ? "⚡" : "🔒"}</Text>
      <Text style={styles.skillName}>{skill.ability.name}</Text>
      <Text style={styles.skillCost}>💧 {manaCost}</Text>
      {skill.cooldown > 0 && (
        <View style={styles.cooldownOverlay}>
          <Text style={styles.cooldownText}>{skill.cooldown}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function CombatScreen() {
  const { state, getTotalStats, playerAttack, playerUseSkill, enemyAttack, endCombat, regenHpMp, tickSkillCooldowns } = useGame();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [combatTick, setCombatTick] = useState(0);
  
  const stats = getTotalStats();
  const enemy = state.currentEnemy;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Regeneração passiva
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.inCombat && enemy && enemy.currentHp > 0) {
        regenHpMp();
        setCombatTick(t => t + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.inCombat, enemy]);
  
  // Verificar fim de combate (vitória) - separado para evitar loops
  useEffect(() => {
    if (!state.inCombat && !state.currentEnemy && state.combatLog.length > 0) {
      // Verificar se há mensagem de vitória no log (procurar em todas as mensagens recentes)
      const recentLogs = state.combatLog.slice(-10);
      const hasVictory = recentLogs.some(log => 
        log && (log.includes("VITÓRIA") || log.includes("Vitória") || log.includes("🎉"))
      );
      
      if (hasVictory) {
        // Redirecionar para tela de loot após um pequeno delay
        const timeout = setTimeout(() => {
          router.push("/(game)/loot");
        }, 800);
        return () => clearTimeout(timeout);
      }
    }
  }, [state.inCombat, state.currentEnemy, state.combatLog]);
  
  // Reduzir cooldowns das skills a cada segundo durante combate
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.inCombat) {
        tickSkillCooldowns();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state.inCombat, tickSkillCooldowns]);
  
  const handleAttack = useCallback(() => {
    if (!enemy || enemy.currentHp <= 0) return;
    
    // Jogador ataca
    playerAttack();
    
    // Inimigo contra-ataca após delay
    setTimeout(() => {
      if (enemy.currentHp > 0) {
        enemyAttack();
      }
    }, 800);
  }, [enemy]);
  
  const handleSkill = useCallback((index: number) => {
    if (!enemy || enemy.currentHp <= 0) return;
    
    const result = playerUseSkill(index);
    if (!result.success) {
      Alert.alert("Skill", result.message || "Não foi possível usar a skill");
      return;
    }
    
    // Inimigo contra-ataca após delay
    setTimeout(() => {
      if (enemy.currentHp > 0) {
        enemyAttack();
      }
    }, 800);
  }, [enemy]);
  
  const handleFlee = useCallback(() => {
    Alert.alert(
      "Fugir",
      "Deseja fugir do combate?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Fugir", 
          style: "destructive",
          onPress: () => {
            endCombat(false);
            router.back();
          }
        },
      ]
    );
  }, []);
  
  if (!state.inCombat || !enemy) {
    return (
      <View style={styles.container}>
        <Text style={styles.noCombatText}>Nenhum combate ativo</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const mob = enemy.mob;
  const rankMult = MOB_RANK_MULTIPLIERS[mob.rank];
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⚔️ COMBATE</Text>
          <TouchableOpacity style={styles.fleeButton} onPress={handleFlee}>
            <Text style={styles.fleeText}>🏃 FUGIR</Text>
          </TouchableOpacity>
        </View>
        
        {/* Combat Queue Progress */}
        {state.combatQueue.length > 1 && (
          <View style={queueStyles.container}>
            <Text style={queueStyles.text}>
              👹 {state.currentEnemyIndex + 1} / {state.combatQueue.length} INIMIGOS
            </Text>
            <View style={queueStyles.bar}>
              <View 
                style={[
                  queueStyles.fill, 
                  { width: `${((state.currentEnemyIndex + 1) / state.combatQueue.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
        )}
        
        {/* Enemy Card */}
        <View style={[styles.enemyCard, { borderColor: rankMult.color }]}>
          <View style={[styles.enemyRankBadge, { backgroundColor: `${rankMult.color}20` }]}>
            <Text style={[styles.enemyRankText, { color: rankMult.color }]}>{mob.rank}</Text>
          </View>
          
          <Text style={styles.enemyEmoji}>👹</Text>
          <Text style={styles.enemyName}>{mob.name}</Text>
          <Text style={styles.enemyType}>
            {mob.type === "boss" ? "👑 BOSS" : mob.type === "elite" ? "⭐ ELITE" : mob.type === "unique" ? "💎 ÚNICO" : "👤 NORMAL"}
          </Text>
          
          <View style={styles.enemyStats}>
            <Text style={styles.enemyStat}>Nv. {mob.level}</Text>
            <Text style={styles.enemyStat}>Elemento: {mob.element}</Text>
          </View>
          
          {/* Enemy HP */}
          <ResourceBar 
            current={enemy.currentHp} 
            max={enemy.maxHp} 
            color="#ef4444" 
            icon="❤️" 
          />
        </View>
        
        {/* VS */}
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        
        {/* Player Card */}
        <View style={styles.playerCard}>
          <Text style={styles.playerEmoji}>🧙</Text>
          <Text style={styles.playerName}>{state.playerName}</Text>
          <Text style={styles.playerLevel}>Nível {state.level}</Text>
          
          {/* Player HP/MP */}
          <ResourceBar 
            current={state.currentHp} 
            max={stats.hp} 
            color="#22c55e" 
            icon="❤️" 
          />
          <View style={{ height: 8 }} />
          <ResourceBar 
            current={state.currentMp} 
            max={stats.mp} 
            color="#3b82f6" 
            icon="💧" 
          />
        </View>
        
        {/* Combat Log */}
        <View style={styles.logCard}>
          <Text style={styles.logTitle}>📜 LOG DE COMBATE</Text>
          <ScrollView style={styles.logContent} showsVerticalScrollIndicator={false}>
            {state.combatLog.slice(-10).map((log, i) => (
              <Text key={i} style={styles.logEntry}>{log}</Text>
            ))}
          </ScrollView>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.attackButton} onPress={handleAttack}>
            <Text style={styles.attackButtonIcon}>⚔️</Text>
            <Text style={styles.attackButtonText}>ATACAR</Text>
          </TouchableOpacity>
          
          {/* Skills */}
          <Text style={styles.skillsTitle}>✨ SKILLS</Text>
          <View style={styles.skillsGrid}>
            {state.activeSkills.map((skill, index) => (
              <SkillButton
                key={index}
                skill={skill}
                index={index}
                onPress={() => handleSkill(index)}
                disabled={state.currentMp < (10 + index * 5)}
              />
            ))}
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
  noCombatText: {
    color: "#64748b",
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  backButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    padding: 16,
    margin: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
  },
  fleeButton: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  fleeText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "700",
  },
  enemyCard: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ef4444",
  },
  enemyRankBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  enemyRankText: {
    fontSize: 14,
    fontWeight: "800",
  },
  enemyEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  enemyName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  enemyType: {
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  enemyStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  enemyStat: {
    color: "#94a3b8",
    fontSize: 13,
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  barIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  barBackground: {
    flex: 1,
    height: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 6,
  },
  barText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 8,
    width: 60,
    textAlign: "right",
  },
  vsContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  vsText: {
    color: "#7c3aed",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 4,
  },
  playerCard: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  playerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  playerName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  playerLevel: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 16,
  },
  logCard: {
    backgroundColor: "rgba(18, 18, 26, 0.6)",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  logTitle: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },
  logContent: {
    maxHeight: 100,
  },
  logEntry: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 4,
  },
  actionsContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  attackButton: {
    backgroundColor: "#ef4444",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  attackButtonIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  attackButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
  },
  skillsTitle: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillButton: {
    width: "23%",
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.3)",
    position: "relative",
  },
  skillLocked: {
    backgroundColor: "rgba(100, 100, 100, 0.1)",
    borderColor: "rgba(100, 100, 100, 0.2)",
  },
  skillCooldown: {
    backgroundColor: "rgba(100, 100, 100, 0.3)",
  },
  skillDisabled: {
    opacity: 0.5,
  },
  skillIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  skillName: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  skillCost: {
    color: "#3b82f6",
    fontSize: 9,
    marginTop: 2,
  },
  cooldownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cooldownText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
});

const queueStyles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  text: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 1,
  },
  bar: {
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#ef4444",
    borderRadius: 4,
  },
});
