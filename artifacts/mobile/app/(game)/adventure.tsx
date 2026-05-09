import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Animated, Alert } from "react-native";
import { useGame } from "@/context/GameContext";
import { BIOMES, BiomeId, TOWER_FLOORS_DATA, TOWER_NAME } from "@/constants/adventure";
import { generateTowerMobs } from "@/constants/mobs";
import { useState, useEffect } from "react";
import { router } from "expo-router";

// Tower Modal
function TowerModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { state, startCombat, hasTowerKey, getTowerQuest } = useGame();
  const [selectedFloor, setSelectedFloor] = useState(1);
  
  const floorData = TOWER_FLOORS_DATA[selectedFloor - 1];
  const isUnlocked = state.unlockedFloors.includes(selectedFloor);
  const isCompleted = state.towerProgress >= selectedFloor;
  const quest = getTowerQuest(selectedFloor);
  
  // Verificar se pode entrar no andar
  const canEnter = () => {
    if (!isUnlocked || isCompleted) return false;
    
    // Andares 1-9: precisa da chave do andar anterior (exceto andar 1)
    if (selectedFloor > 1 && selectedFloor < 10) {
      const hasPreviousKey = hasTowerKey(selectedFloor - 1);
      if (!hasPreviousKey) {
        Alert.alert("🔒 Chave Necessária", `Você precisa da chave do andar ${selectedFloor - 1} para entrar aqui. Derrote mobs até dropar a chave!`);
        return false;
      }
    }
    
    // Andares 10+: precisa completar a quest
    if (selectedFloor >= 10) {
      if (quest && !quest.completed) {
        Alert.alert("📜 Quest Pendente", `${quest.description}\nProgresso: ${quest.current}/${quest.target}`);
        return false;
      }
    }
    
    return true;
  };
  
  const enterTowerFloor = () => {
    if (!canEnter()) return;
    
    // Gerar mobs para o andar selecionado
    const mobs = generateTowerMobs(selectedFloor);
    
    // Selecionar o primeiro mob (ou o boss se for andar de boss)
    const targetMob = floorData.type === "boss" || floorData.type === "miniboss" 
      ? mobs.find(m => m.type === "boss") || mobs[0]
      : mobs[0];
    
    if (!targetMob) {
      Alert.alert("Erro", "Não foi possível gerar o combate");
      return;
    }
    
    // Iniciar combate (passando o andar da torre)
    startCombat(targetMob, selectedFloor);
    
    // Fechar modal e navegar para tela de combate
    onClose();
    router.push("/(game)/combat");
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={towerStyles.overlay}>
        <View style={towerStyles.container}>
          <View style={towerStyles.header}>
            <Text style={towerStyles.title}>🏰 {TOWER_NAME}</Text>
            <TouchableOpacity style={towerStyles.closeBtn} onPress={onClose}>
              <Text style={towerStyles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={towerStyles.progressSection}>
            <Text style={towerStyles.progressText}>Progresso: {state.towerProgress} / 20 (Beta)</Text>
            <View style={towerStyles.progressBar}>
              <View style={[towerStyles.progressFill, { width: `${(state.towerProgress / 20) * 100}%` }]} />
            </View>
          </View>
          
          <ScrollView style={towerStyles.floorList} showsVerticalScrollIndicator={false}>
            {/* Floor selector - Mostrando andares 1-20 */}
            <View style={towerStyles.floorGrid}>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((floor) => {
                const floorInfo = TOWER_FLOORS_DATA[floor - 1];
                const unlocked = state.unlockedFloors.includes(floor);
                const completed = state.towerProgress >= floor;
                
                let bgColor = "rgba(100, 100, 100, 0.2)";
                let borderColor = "rgba(100, 100, 100, 0.3)";
                
                if (completed) {
                  bgColor = "rgba(34, 197, 94, 0.2)";
                  borderColor = "rgba(34, 197, 94, 0.5)";
                } else if (unlocked) {
                  bgColor = "rgba(124, 58, 237, 0.2)";
                  borderColor = "rgba(124, 58, 237, 0.5)";
                }
                
                if (floorInfo.type === "boss") {
                  borderColor = completed ? "rgba(245, 158, 11, 0.8)" : unlocked ? "rgba(245, 158, 11, 0.6)" : "rgba(100, 100, 100, 0.3)";
                }
                
                return (
                  <TouchableOpacity
                    key={floor}
                    style={[
                      towerStyles.floorBtn,
                      { backgroundColor: bgColor, borderColor },
                      selectedFloor === floor && towerStyles.floorBtnSelected
                    ]}
                    onPress={() => setSelectedFloor(floor)}
                  >
                    <Text style={[towerStyles.floorBtnText, { opacity: unlocked ? 1 : 0.3 }]}>
                      {floor}
                    </Text>
                    {floorInfo.type === "boss" && <Text style={towerStyles.bossIcon}>👑</Text>}
                    {floorInfo.type === "miniboss" && <Text style={towerStyles.minibossIcon}>⚔️</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          
          {/* Selected floor info */}
          <View style={towerStyles.floorInfo}>
            <Text style={towerStyles.floorName}>{floorData.name}</Text>
            <Text style={towerStyles.floorDesc}>{floorData.description}</Text>
            
            {/* Info de chave */}
            {selectedFloor > 1 && selectedFloor < 10 && (
              <View style={towerStyles.keyInfo}>
                <Text style={towerStyles.keyText}>
                  {hasTowerKey(selectedFloor - 1) ? "✅" : "🔒"} Chave do Andar {selectedFloor - 1} {hasTowerKey(selectedFloor - 1) ? "(Obtida)" : "(Necessária)"}
                </Text>
              </View>
            )}
            
            {/* Info de quest para andares 10+ */}
            {selectedFloor >= 10 && (
              <View style={towerStyles.questInfo}>
                {quest ? (
                  <>
                    <Text style={towerStyles.questTitle}>📜 Quest Ativa:</Text>
                    <Text style={towerStyles.questDesc}>{quest.description}</Text>
                    <Text style={[towerStyles.questProgress, quest.completed && towerStyles.questCompleted]}>
                      Progresso: {quest.current}/{quest.target} {quest.completed ? "✅" : ""}
                    </Text>
                  </>
                ) : (
                  <Text style={towerStyles.questDesc}>📜 Quest será gerada ao derrotar o primeiro mob</Text>
                )}
              </View>
            )}
            
            {floorData.type === "boss" && (
              <Text style={towerStyles.groupReq}>Mínimo: {floorData.minGroupSize} jogadores</Text>
            )}
            <TouchableOpacity 
              style={[towerStyles.enterBtn, (!isUnlocked || isCompleted) && towerStyles.enterBtnDisabled]}
              disabled={!isUnlocked || isCompleted}
              onPress={enterTowerFloor}
            >
              <Text style={towerStyles.enterBtnText}>
                {isCompleted ? "✓ COMPLETADO" : isUnlocked ? "ENTRAR" : "🔒 BLOQUEADO"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Biome Card
function BiomeCard({ 
  biomeId, 
  onPress, 
  locked 
}: { 
  biomeId: BiomeId; 
  onPress: () => void; 
  locked: boolean;
}) {
  const biome = BIOMES[biomeId];
  
  return (
    <TouchableOpacity 
      style={[
        styles.biomeCard,
        locked && styles.biomeCardLocked,
        { borderColor: locked ? "rgba(100,100,100,0.2)" : `${biome.color}40` }
      ]}
      onPress={onPress}
      disabled={locked}
      activeOpacity={0.8}
    >
      <View style={[styles.biomeIconBox, { backgroundColor: locked ? "rgba(100,100,100,0.1)" : `${biome.color}15` }]}>
        <Text style={[styles.biomeEmoji, { opacity: locked ? 0.4 : 1 }]}>{biome.emoji}</Text>
      </View>
      <View style={styles.biomeInfo}>
        <Text style={[styles.biomeName, { color: locked ? "#64748b" : "#ffffff" }]}>{biome.name}</Text>
        <Text style={styles.biomeLevel}>Nv. {biome.minLevel}-{biome.maxLevel}</Text>
        <Text style={styles.biomeDesc} numberOfLines={2}>{biome.description}</Text>
      </View>
      {locked ? (
        <View style={styles.lockedBadge}>
          <Text style={styles.lockedText}>🔒</Text>
        </View>
      ) : (
        <View style={[styles.exploreBtn, { backgroundColor: `${biome.color}20` }]}>
          <Text style={[styles.exploreText, { color: biome.color }]}>EXPLORAR →</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function Adventure() {
  const { state } = useGame();
  const [towerVisible, setTowerVisible] = useState(false);
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
          <Text style={styles.headerTitle}>🗺️ AVENTURA</Text>
          <Text style={styles.headerSubtitle}>Explore biomas e descubra dungeons</Text>
        </View>

        {/* Tower Card */}
        <TouchableOpacity 
          style={styles.towerCard}
          onPress={() => setTowerVisible(true)}
          activeOpacity={0.85}
        >
          <View style={styles.towerGradient} />
          <View style={styles.towerContent}>
            <Text style={styles.towerIcon}>🏰</Text>
            <View style={styles.towerInfo}>
              <Text style={styles.towerName}>{TOWER_NAME}</Text>
              <Text style={styles.towerDesc}>1000 andares de desafios épicos</Text>
              <View style={styles.towerProgress}>
                <Text style={styles.towerProgressText}>Andar {state.towerProgress + 1}</Text>
                <View style={styles.towerProgressBar}>
                  <View style={[styles.towerProgressFill, { width: `${(state.towerProgress / 1000) * 100}%` }]} />
                </View>
              </View>
            </View>
            <Text style={styles.towerArrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Biomes Section */}
        <Text style={styles.sectionTitle}>BIOMES</Text>
        
        {(Object.keys(BIOMES) as BiomeId[]).map((biomeId) => (
          <BiomeCard
            key={biomeId}
            biomeId={biomeId}
            onPress={() => router.push(`/biome/${biomeId}`)}
            locked={state.level < BIOMES[biomeId].minLevel}
          />
        ))}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 COMO FUNCIONA</Text>
          <View style={styles.infoList}>
            <InfoItem icon="🗺️" text="Explore biomas para ganhar XP" />
            <InfoItem icon="🏛️" text="Descubra dungeons secretas" />
            <InfoItem icon="🎲" text="Dungeons são encontradas por sorte" />
            <InfoItem icon="🏰" text="A Torre é a história principal" />
            <InfoItem icon="👥" text="Dungeons em grupo precisam de amigos" />
          </View>
        </View>
      </Animated.View>

      <TowerModal visible={towerVisible} onClose={() => setTowerVisible(false)} />
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
  towerCard: {
    backgroundColor: "#7c3aed",
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    position: "relative",
    overflow: "hidden",
  },
  towerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#8b5cf6",
    opacity: 0.3,
  },
  towerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  towerIcon: {
    fontSize: 48,
    marginRight: 18,
    zIndex: 1,
  },
  towerInfo: {
    flex: 1,
    zIndex: 1,
  },
  towerName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  towerDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginBottom: 12,
  },
  towerProgress: {
    marginTop: 4,
  },
  towerProgressText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  towerProgressBar: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  towerProgressFill: {
    height: "100%",
    backgroundColor: "#fbbf24",
    borderRadius: 3,
  },
  towerArrow: {
    color: "#ffffff",
    fontSize: 24,
    zIndex: 1,
    opacity: 0.8,
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 16,
  },
  biomeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(18, 18, 26, 0.6)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.15)",
  },
  biomeCardLocked: {
    opacity: 0.6,
  },
  biomeIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  biomeEmoji: {
    fontSize: 32,
  },
  biomeInfo: {
    flex: 1,
  },
  biomeName: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 3,
  },
  biomeLevel: {
    color: "#7c3aed",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  biomeDesc: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 18,
  },
  lockedBadge: {
    padding: 10,
  },
  lockedText: {
    fontSize: 20,
  },
  exploreBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  exploreText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: "rgba(18, 18, 26, 0.4)",
    borderRadius: 20,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
    marginBottom: 30,
  },
  infoTitle: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 14,
  },
  infoList: {
    gap: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 26,
  },
  infoText: {
    color: "#94a3b8",
    fontSize: 13,
  },
});

const towerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2, 2, 4, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    backgroundColor: "#12121a",
    borderRadius: 24,
    width: "100%",
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124, 58, 237, 0.1)",
  },
  title: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  progressSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124, 58, 237, 0.1)",
  },
  progressText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7c3aed",
    borderRadius: 4,
  },
  floorList: {
    maxHeight: 300,
    padding: 16,
  },
  floorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  floorBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    position: "relative",
  },
  floorBtnSelected: {
    borderColor: "#7c3aed",
    borderWidth: 2,
  },
  floorBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  bossIcon: {
    position: "absolute",
    top: 2,
    right: 2,
    fontSize: 10,
  },
  minibossIcon: {
    position: "absolute",
    top: 2,
    right: 2,
    fontSize: 8,
    opacity: 0.7,
  },
  floorInfo: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(124, 58, 237, 0.1)",
  },
  floorName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  floorDesc: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  groupReq: {
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 16,
  },
  keyInfo: {
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  keyText: {
    color: "#fbbf24",
    fontSize: 12,
    fontWeight: "600",
  },
  questInfo: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  questTitle: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  questDesc: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 6,
  },
  questProgress: {
    color: "#fbbf24",
    fontSize: 11,
    fontWeight: "600",
  },
  questCompleted: {
    color: "#22c55e",
  },
  enterBtn: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  enterBtnDisabled: {
    backgroundColor: "rgba(100, 100, 100, 0.3)",
  },
  enterBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
});
