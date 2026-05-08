import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Animated, Alert } from "react-native";
import { useGame } from "@/context/GameContext";
import { BIOMES, BiomeId, DungeonDef, DUNGEON_TIERS, DUNGEON_VARIANTS } from "@/constants/adventure";
import { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";

// Dungeon Card Component
function DungeonCard({ 
  dungeon, 
  onPress,
  isNew = false 
}: { 
  dungeon: DungeonDef; 
  onPress: () => void;
  isNew?: boolean;
}) {
  const variant = DUNGEON_VARIANTS[dungeon.variant];
  const tier = DUNGEON_TIERS[dungeon.tier];
  
  return (
    <TouchableOpacity 
      style={[
        styles.dungeonCard,
        isNew && styles.dungeonCardNew
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.dungeonIconBox, { backgroundColor: `${tier.color}15` }]}>
        <Text style={styles.dungeonEmoji}>{dungeon.icon}</Text>
        {isNew && <View style={styles.newBadge}><Text style={styles.newText}>NOVO</Text></View>}
      </View>
      
      <View style={styles.dungeonInfo}>
        <View style={styles.dungeonHeader}>
          <Text style={[styles.dungeonName, { color: tier.color }]}>{dungeon.name}</Text>
          <View style={[styles.tierBadge, { backgroundColor: `${tier.color}20` }]}>
            <Text style={[styles.tierText, { color: tier.color }]}>{tier.name}</Text>
          </View>
        </View>
        
        <View style={styles.dungeonTags}>
          <View style={[styles.variantTag, { backgroundColor: `${variant.color}15` }]}>
            <Text style={[styles.variantText, { color: variant.color }]}>{variant.emoji} {variant.name}</Text>
          </View>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>
              {dungeon.type === "solo" ? "🎮 Solo" : dungeon.type === "group" ? "👥 Grupo" : "👑 Raid"}
            </Text>
          </View>
        </View>
        
        <Text style={styles.dungeonDesc} numberOfLines={2}>{dungeon.description}</Text>
        
        {dungeon.groupSize && (
          <Text style={styles.groupSize}>👥 {dungeon.groupSize} jogadores necessários</Text>
        )}
        
        {dungeon.timesCompleted > 0 && (
          <Text style={styles.completedText}>✓ Completada {dungeon.timesCompleted}x</Text>
        )}
      </View>
      
      <Text style={styles.enterArrow}>→</Text>
    </TouchableOpacity>
  );
}

// Discovery Modal
function DiscoveryModal({ 
  visible, 
  dungeon, 
  onClose,
  onEnter 
}: { 
  visible: boolean; 
  dungeon: DungeonDef | null;
  onClose: () => void;
  onEnter: () => void;
}) {
  if (!dungeon) return null;
  
  const variant = DUNGEON_VARIANTS[dungeon.variant];
  const tier = DUNGEON_TIERS[dungeon.tier];
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <View style={[modalStyles.header, { backgroundColor: `${tier.color}20` }]}>
            <Text style={modalStyles.headerEmoji}>🎉</Text>
            <Text style={modalStyles.headerTitle}>DUNGEON DESCOBERTA!</Text>
          </View>
          
          <View style={modalStyles.content}>
            <Text style={[modalStyles.dungeonName, { color: tier.color }]}>{dungeon.name}</Text>
            
            <View style={modalStyles.badgeRow}>
              <View style={[modalStyles.tierBadge, { backgroundColor: `${tier.color}20` }]}>
                <Text style={[modalStyles.tierText, { color: tier.color }]}>TIER {tier.name}</Text>
              </View>
              <View style={[modalStyles.variantBadge, { backgroundColor: `${variant.color}20` }]}>
                <Text style={[modalStyles.variantText, { color: variant.color }]}>{variant.emoji} {variant.name}</Text>
              </View>
            </View>
            
            <Text style={modalStyles.description}>{dungeon.description}</Text>
            
            <View style={modalStyles.statsBox}>
              <View style={modalStyles.statRow}>
                <Text style={modalStyles.statLabel}>Tipo:</Text>
                <Text style={modalStyles.statValue}>
                  {dungeon.type === "solo" ? "🎮 Solo" : dungeon.type === "group" ? "👥 Grupo" : "👑 Raid"}
                </Text>
              </View>
              <View style={modalStyles.statRow}>
                <Text style={modalStyles.statLabel}>Nível:</Text>
                <Text style={modalStyles.statValue}>{dungeon.minLevel}+</Text>
              </View>
              {dungeon.groupSize && (
                <View style={modalStyles.statRow}>
                  <Text style={modalStyles.statLabel}>Grupo:</Text>
                  <Text style={modalStyles.statValue}>{dungeon.groupSize} jogadores</Text>
                </View>
              )}
              {dungeon.element && (
                <View style={modalStyles.statRow}>
                  <Text style={modalStyles.statLabel}>Elemento:</Text>
                  <Text style={modalStyles.statValue}>{dungeon.element}</Text>
                </View>
              )}
            </View>
            
            <View style={modalStyles.modifiersBox}>
              <Text style={modalStyles.modifiersTitle}>⚡ MODIFICADORES</Text>
              <View style={modalStyles.modifierRow}>
                <Text style={modalStyles.modifierText}>HP Inimigos: {Math.round(variant.modifiers.enemyHp * 100)}%</Text>
                <Text style={modalStyles.modifierText}>Dano: {Math.round(variant.modifiers.enemyDmg * 100)}%</Text>
              </View>
              <View style={modalStyles.modifierRow}>
                <Text style={modalStyles.modifierText}>Drop: {Math.round(variant.modifiers.dropRate * 100)}%</Text>
                <Text style={modalStyles.modifierText}>XP: {Math.round(variant.modifiers.expBonus * 100)}%</Text>
              </View>
            </View>
            
            <View style={modalStyles.buttons}>
              <TouchableOpacity style={modalStyles.enterBtn} onPress={onEnter}>
                <Text style={modalStyles.enterBtnText}>ENTRAR AGORA</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modalStyles.laterBtn} onPress={onClose}>
                <Text style={modalStyles.laterBtnText}>ENTRAR DEPOIS</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={modalStyles.hint}>💡 A dungeon ficará disponível permanentemente!</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function BiomeScreen() {
  const { id } = useLocalSearchParams<{ id: BiomeId }>();
  const { state, exploreBiome, getDiscoveredDungeons, getBiomeProgress, startCombat, findEncounter } = useGame();
  const [isExploring, setIsExploring] = useState(false);
  const [discoveryModal, setDiscoveryModal] = useState(false);
  const [foundDungeon, setFoundDungeon] = useState<DungeonDef | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [discoveredDungeons, setDiscoveredDungeons] = useState<DungeonDef[]>([]);
  const [progress, setProgress] = useState({ discovered: 0, total: 0, percentage: 0 });
  
  const biome = BIOMES[id];
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Atualizar dungeons descobertas
    const dungeons = getDiscoveredDungeons(id);
    setDiscoveredDungeons(dungeons);
    
    const prog = getBiomeProgress(id);
    setProgress(prog);
  }, [id, state.discoveredDungeons]);
  
  const handleExplore = async () => {
    if (isExploring) return;
    
    setIsExploring(true);
    
    // Simular tempo de exploração
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = exploreBiome(id);
    
    if (result.found && result.dungeon) {
      setFoundDungeon(result.dungeon);
      setDiscoveryModal(true);
      
      // Atualizar lista
      const dungeons = getDiscoveredDungeons(id);
      setDiscoveredDungeons(dungeons);
      
      const prog = getBiomeProgress(id);
      setProgress(prog);
    } else {
      Alert.alert(
        "Exploração Completa",
        `Você explorou ${biome.name} mas não encontrou nenhuma dungeon.\n\nXP Ganhado: ${result.expGained}`,
        [{ text: "Continuar" }]
      );
    }
    
    setIsExploring(false);
  };
  
  const handleEnterDungeon = () => {
    setDiscoveryModal(false);
    // TODO: Navegar para a dungeon
    Alert.alert("Dungeon", "Entrando na dungeon... (em desenvolvimento)");
  };
  
  if (!biome) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Bioma não encontrado</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: biome.bgColor }]} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← VOLTAR</Text>
          </TouchableOpacity>
          
          <View style={[styles.biomeHeader, { backgroundColor: `${biome.color}15` }]}>
            <Text style={styles.biomeEmoji}>{biome.emoji}</Text>
            <Text style={styles.biomeName}>{biome.name}</Text>
            <Text style={styles.biomeDesc}>{biome.description}</Text>
            
            <View style={styles.elementTags}>
              {biome.nativeElements.map(elem => (
                <View key={elem} style={styles.elementTag}>
                  <Text style={styles.elementText}>{elem}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>📊 PROGRESSO DE DESCOBERTA</Text>
            <Text style={styles.progressPercent}>{progress.percentage}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress.percentage}%`, backgroundColor: biome.color }]} />
          </View>
          <Text style={styles.progressText}>{progress.discovered} / {progress.total} dungeons encontradas</Text>
        </View>
        
        {/* Aventurar-se Button - Unified */}
        <TouchableOpacity 
          style={[styles.adventureBtn, isExploring && styles.adventureBtnDisabled]}
          onPress={async () => {
            if (isExploring) return;
            setIsExploring(true);
            
            // Simular tempo de exploração
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Primeiro tenta encontrar mob
            const encounterResult = findEncounter(id);
            
            if (encounterResult.type === "mob" && encounterResult.mob) {
              // Encontrou mob - inicia combate
              startCombat(encounterResult.mob);
              setIsExploring(false);
              router.push("/(game)/combat");
              return;
            }
            
            // Se não encontrou mob, tenta encontrar dungeon
            const dungeonResult = exploreBiome(id);
            
            if (dungeonResult.found && dungeonResult.dungeon) {
              setFoundDungeon(dungeonResult.dungeon);
              setDiscoveryModal(true);
              const dungeons = getDiscoveredDungeons(id);
              setDiscoveredDungeons(dungeons);
              const prog = getBiomeProgress(id);
              setProgress(prog);
            } else if (encounterResult.type === "dungeon") {
              Alert.alert("Exploração", "Você sente uma presença misteriosa... (dungeon próxima)");
            } else if (encounterResult.type === "resource") {
              Alert.alert("Exploração", "Você encontrou alguns recursos! (em desenvolvimento)");
            } else {
              // Nada encontrado - ganha XP
              Alert.alert(
                "Exploração Completa",
                `Você explorou ${biome.name} mas não encontrou nada de interessante.\n\nXP Ganhado: ${dungeonResult.expGained}`,
                [{ text: "Continuar" }]
              );
            }
            
            setIsExploring(false);
          }}
          disabled={isExploring}
        >
          <Text style={styles.adventureEmoji}>{isExploring ? "🔍" : "⚔️"}</Text>
          <Text style={styles.adventureBtnText}>
            {isExploring ? "EXPLORANDO..." : "AVENTURAR-SE"}
          </Text>
          <Text style={styles.adventureHint}>Encontre mobs, dungeons, recursos ou ganhe XP!</Text>
        </TouchableOpacity>
        
        {/* Discovered Dungeons */}
        {discoveredDungeons.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🏛️ DUNGEONS DESCOBERTAS</Text>
            <View style={styles.dungeonsList}>
              {discoveredDungeons
                .sort((a, b) => b.timesCompleted - a.timesCompleted)
                .map((dungeon) => (
                  <DungeonCard 
                    key={dungeon.id} 
                    dungeon={dungeon}
                    onPress={() => {
                      setFoundDungeon(dungeon);
                      setDiscoveryModal(true);
                    }}
                  />
                ))}
            </View>
          </>
        )}
        
        {/* Hazards Info */}
        <View style={styles.hazardsCard}>
          <Text style={styles.hazardsTitle}>⚠️ PERIGOS DO BIOMA</Text>
          {biome.hazards.map((hazard, i) => (
            <View key={i} style={styles.hazardItem}>
              <Text style={styles.hazardBullet}>•</Text>
              <Text style={styles.hazardText}>{hazard}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
      
      <DiscoveryModal 
        visible={discoveryModal} 
        dungeon={foundDungeon}
        onClose={() => setDiscoveryModal(false)}
        onEnter={handleEnterDungeon}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  errorText: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    marginBottom: 16,
  },
  backText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  biomeHeader: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  biomeEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  biomeName: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  biomeDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  elementTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  elementTag: {
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  elementText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  progressCard: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  progressPercent: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    color: "#64748b",
    fontSize: 12,
  },
  exploreBtn: {
    backgroundColor: "rgba(124, 58, 237, 0.8)",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  exploreBtnDisabled: {
    opacity: 0.6,
  },
  exploreEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  exploreBtnText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 4,
  },
  exploreHint: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  adventureBtnDisabled: {
    opacity: 0.6,
  },
  adventureBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.8)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  adventureEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  adventureBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 4,
  },
  adventureHint: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 16,
  },
  dungeonsList: {
    gap: 12,
    marginBottom: 24,
  },
  dungeonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  dungeonCardNew: {
    borderColor: "rgba(34, 197, 94, 0.5)",
    backgroundColor: "rgba(34, 197, 94, 0.1)",
  },
  dungeonIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    position: "relative",
  },
  dungeonEmoji: {
    fontSize: 28,
  },
  newBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#22c55e",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "800",
  },
  dungeonInfo: {
    flex: 1,
  },
  dungeonHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  dungeonName: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tierText: {
    fontSize: 10,
    fontWeight: "800",
  },
  dungeonTags: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },
  variantTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  variantText: {
    fontSize: 10,
    fontWeight: "600",
  },
  typeTag: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "600",
  },
  dungeonDesc: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  groupSize: {
    color: "#f59e0b",
    fontSize: 11,
    fontWeight: "600",
  },
  completedText: {
    color: "#22c55e",
    fontSize: 11,
    fontWeight: "600",
  },
  enterArrow: {
    color: "#ffffff",
    fontSize: 20,
    opacity: 0.5,
    marginLeft: 8,
  },
  hazardsCard: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    marginBottom: 30,
  },
  hazardsTitle: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 12,
  },
  hazardItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  hazardBullet: {
    color: "#ef4444",
    fontSize: 14,
    marginRight: 8,
  },
  hazardText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#12121a",
    borderRadius: 24,
    width: "100%",
    maxHeight: "90%",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.3)",
    overflow: "hidden",
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
  },
  content: {
    padding: 20,
  },
  dungeonName: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tierText: {
    fontSize: 12,
    fontWeight: "800",
  },
  variantBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  variantText: {
    fontSize: 12,
    fontWeight: "700",
  },
  description: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  statsBox: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statLabel: {
    color: "#64748b",
    fontSize: 13,
  },
  statValue: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  modifiersBox: {
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.3)",
  },
  modifiersTitle: {
    color: "#a78bfa",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 12,
  },
  modifierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modifierText: {
    color: "#ffffff",
    fontSize: 13,
  },
  buttons: {
    gap: 10,
  },
  enterBtn: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  enterBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
  laterBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  laterBtnText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  hint: {
    color: "#64748b",
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
  },
});
