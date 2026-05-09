import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Alert, Modal } from "react-native";
import { useGame, Item } from "@/context/GameContext";
import { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import { MOB_RANK_MULTIPLIERS } from "@/constants/mobs";

// Tiers e Qualidades para o painel de recompensas
const ITEM_TIERS: Record<string, { name: string; color: string; icon: string }> = {
  "F": { name: "Rank F", color: "#9ca3af", icon: "⚪" },
  "E": { name: "Rank E", color: "#22c55e", icon: "🟢" },
  "D": { name: "Rank D", color: "#3b82f6", icon: "🔵" },
  "C": { name: "Rank C", color: "#a855f7", icon: "🟣" },
  "B": { name: "Rank B", color: "#f59e0b", icon: "🟠" },
  "A": { name: "Rank A", color: "#ef4444", icon: "🔴" },
  "S": { name: "Rank S", color: "#ec4899", icon: "🌟" },
  "SS": { name: "Rank SS", color: "#22d3ee", icon: "💫" },
  "SSS": { name: "Rank SSS", color: "#fbbf24", icon: "👑" },
  "SSS+": { name: "Rank SSS+", color: "#ffffff", icon: "🔱" },
};

const ITEM_QUALITIES: Record<string, { name: string; color: string }> = {
  "normal": { name: "Normal", color: "#9ca3af" },
  "good": { name: "Bom", color: "#22c55e" },
  "exceptional": { name: "Excepcional", color: "#3b82f6" },
  "excellent": { name: "Excelente", color: "#a855f7" },
  "masterpiece": { name: "Obra-prima", color: "#fbbf24" },
  "common": { name: "Comum", color: "#9ca3af" },
  "uncommon": { name: "Incomum", color: "#22c55e" },
  "rare": { name: "Raro", color: "#3b82f6" },
  "epic": { name: "Épico", color: "#a855f7" },
  "legendary": { name: "Lendário", color: "#f59e0b" },
  "mythic": { name: "Mítico", color: "#ef4444" },
  "divine": { name: "Divino", color: "#ec4899" },
};

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
  const [showRewards, setShowRewards] = useState(false);
  
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
  
  // Verificar fim de combate (vitória) - mostrar painel de recompensas
  useEffect(() => {
    if (!state.inCombat && !state.currentEnemy && state.combatLog.length > 0) {
      // Verificar se há mensagem de vitória no log
      const recentLogs = state.combatLog.slice(-15);
      const hasVictory = recentLogs.some(log => 
        log && (log.includes("VITÓRIA") || log.includes("Vitória") || log.includes("🎉") || log.includes("VITÓRIA COMPLETA"))
      );
      
      if (hasVictory) {
        // Mostrar painel de recompensas após um pequeno delay
        const timeout = setTimeout(() => {
          setShowRewards(true);
        }, 500);
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
  
  // Painel de Recompensas Pós-Combate
  if (showRewards) {
    // Pegar os últimos itens adicionados ao inventário
    const recentLoot = state.inventory.slice(-6).reverse();
    
    // Encontrar mensagens de recompensa no log
    const rewardMessages = state.combatLog.slice(-20).filter(log => 
      log && (log.includes("+") || log.includes("💰") || log.includes("💎") || log.includes("📦") || log.includes("🆙"))
    );
    
    return (
      <View style={rewardStyles.container}>
        <Text style={rewardStyles.title}>🎉 VITÓRIA!</Text>
        
        <ScrollView style={rewardStyles.scrollView} showsVerticalScrollIndicator={false}>
          {/* XP e Level */}
          <View style={rewardStyles.section}>
            <Text style={rewardStyles.sectionTitle}>📊 Experiência</Text>
            <View style={rewardStyles.xpBox}>
              <Text style={rewardStyles.xpText}>Nível {state.level}</Text>
              <Text style={rewardStyles.xpValue}>{Math.floor(state.exp).toLocaleString()} XP</Text>
            </View>
          </View>
          
          {/* Moedas */}
          <View style={rewardStyles.section}>
            <Text style={rewardStyles.sectionTitle}>💰 Moedas</Text>
            <View style={rewardStyles.currencyGrid}>
              {state.currencies.gold > 0 && (
                <View style={rewardStyles.currencyBox}>
                  <Text style={rewardStyles.currencyIcon}>🥇</Text>
                  <Text style={rewardStyles.currencyValue}>{state.currencies.gold.toLocaleString()}</Text>
                  <Text style={rewardStyles.currencyLabel}>Ouro</Text>
                </View>
              )}
              {state.currencies.silver > 0 && (
                <View style={rewardStyles.currencyBox}>
                  <Text style={rewardStyles.currencyIcon}>🥈</Text>
                  <Text style={rewardStyles.currencyValue}>{state.currencies.silver.toLocaleString()}</Text>
                  <Text style={rewardStyles.currencyLabel}>Prata</Text>
                </View>
              )}
              {state.currencies.copper > 0 && (
                <View style={rewardStyles.currencyBox}>
                  <Text style={rewardStyles.currencyIcon}>🥉</Text>
                  <Text style={rewardStyles.currencyValue}>{state.currencies.copper.toLocaleString()}</Text>
                  <Text style={rewardStyles.currencyLabel}>Cobre</Text>
                </View>
              )}
              {state.currencies.diamond > 0 && (
                <View style={rewardStyles.currencyBox}>
                  <Text style={rewardStyles.currencyIcon}>💎</Text>
                  <Text style={rewardStyles.currencyValue}>{state.currencies.diamond.toLocaleString()}</Text>
                  <Text style={rewardStyles.currencyLabel}>Diamantes</Text>
                </View>
              )}
              {state.currencies.mithril > 0 && (
                <View style={rewardStyles.currencyBox}>
                  <Text style={rewardStyles.currencyIcon}>✨</Text>
                  <Text style={rewardStyles.currencyValue}>{state.currencies.mithril.toLocaleString()}</Text>
                  <Text style={rewardStyles.currencyLabel}>Mithril</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Itens Dropados */}
          {recentLoot.length > 0 && (
            <View style={rewardStyles.section}>
              <Text style={rewardStyles.sectionTitle}>📦 Itens Obtidos ({recentLoot.length})</Text>
              {recentLoot.map((item, index) => {
                const tier = ITEM_TIERS[item.tier] || ITEM_TIERS["F"];
                const quality = ITEM_QUALITIES[item.quality] || ITEM_QUALITIES["normal"];
                return (
                  <View key={item.id || index} style={[rewardStyles.itemCard, { borderColor: tier.color }]}>
                    <View style={rewardStyles.itemHeader}>
                      <Text style={rewardStyles.itemIcon}>{item.icon}</Text>
                      <View style={rewardStyles.itemInfo}>
                        <Text style={[rewardStyles.itemName, { color: quality.color }]}>{item.name}</Text>
                        <Text style={[rewardStyles.itemTier, { color: tier.color }]}>
                          {tier.name} • {quality.name}
                        </Text>
                      </View>
                    </View>
                    <View style={rewardStyles.itemStats}>
                      {item.atkF > 0 && <Text style={rewardStyles.stat}>⚔️ +{item.atkF}</Text>}
                      {item.atkM > 0 && <Text style={rewardStyles.stat}>🔮 +{item.atkM}</Text>}
                      {item.def > 0 && <Text style={rewardStyles.stat}>🛡️ +{item.def}</Text>}
                      {item.hp > 0 && <Text style={rewardStyles.stat}>❤️ +{item.hp}</Text>}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
          
          {/* Log de Recompensas */}
          {rewardMessages.length > 0 && (
            <View style={rewardStyles.section}>
              <Text style={rewardStyles.sectionTitle}>📝 Resumo</Text>
              <View style={rewardStyles.logBox}>
                {rewardMessages.map((msg, idx) => (
                  <Text key={idx} style={rewardStyles.logText}>{msg}</Text>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
        
        <TouchableOpacity 
          style={rewardStyles.continueBtn} 
          onPress={() => {
            setShowRewards(false);
            router.back();
          }}
        >
          <Text style={rewardStyles.continueBtnText}>Continuar →</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
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

// Estilos para o painel de recompensas
const rewardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fbbf24",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  xpBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 16,
    color: "#fbbf24",
    fontWeight: "600",
  },
  xpValue: {
    fontSize: 16,
    color: "#22c55e",
    fontWeight: "bold",
  },
  currencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  currencyBox: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    minWidth: 70,
    flex: 1,
  },
  currencyIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  currencyValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  currencyLabel: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 2,
  },
  itemCard: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemTier: {
    fontSize: 11,
  },
  itemStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  stat: {
    fontSize: 11,
    color: "#94a3b8",
    backgroundColor: "#1e293b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logBox: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 12,
  },
  logText: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 2,
  },
  continueBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 12,
  },
  continueBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
