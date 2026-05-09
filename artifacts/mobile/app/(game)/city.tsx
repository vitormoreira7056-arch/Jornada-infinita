import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Animated, Alert } from "react-native";
import { useGame } from "@/context/GameContext";
import { CITY_BUILDINGS, SHOP_ITEMS, BLACKSMITH_SERVICES, ENCHANT_SERVICES, CityBuilding } from "@/constants/city";
import { useState, useEffect, useRef } from "react";

// Building Card
function BuildingCard({ 
  building, 
  onPress,
  locked 
}: { 
  building: typeof CITY_BUILDINGS.shop;
  onPress: () => void;
  locked: boolean;
}) {
  return (
    <TouchableOpacity 
      style={[
        styles.buildingCard,
        locked && styles.buildingCardLocked,
        { borderColor: locked ? "rgba(100,100,100,0.2)" : `${building.color}40` }
      ]}
      onPress={onPress}
      disabled={locked}
      activeOpacity={0.8}
    >
      <View style={[styles.buildingIconBox, { backgroundColor: locked ? "rgba(100,100,100,0.1)" : `${building.color}15` }]}>
        <Text style={[styles.buildingEmoji, { opacity: locked ? 0.4 : 1 }]}>{building.emoji}</Text>
      </View>
      <View style={styles.buildingInfo}>
        <Text style={[styles.buildingName, { color: locked ? "#64748b" : "#ffffff" }]}>{building.name}</Text>
        <Text style={styles.buildingDesc}>{building.description}</Text>
        {locked && (
          <Text style={styles.unlockText}>🔒 Desbloqueia no nível {building.unlockLevel}</Text>
        )}
      </View>
      {!locked && (
        <View style={[styles.enterBtn, { backgroundColor: `${building.color}20` }]}>
          <Text style={[styles.enterText, { color: building.color }]}>ENTRAR →</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// Shop Modal
function ShopModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { state, addCurrency } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<"potions" | "scrolls" | "materials">("potions");
  
  const filteredItems = SHOP_ITEMS.filter(item => {
    if (selectedCategory === "potions") return item.id.includes("potion");
    if (selectedCategory === "scrolls") return item.id.includes("scroll");
    if (selectedCategory === "materials") return item.id.includes("material");
    return true;
  }).filter(item => item.requiredLevel <= state.level);
  
  const canAfford = (item: typeof SHOP_ITEMS[0]) => {
    const currencyKey = item.price.type === "copper" ? "copper" : 
                       item.price.type === "silver" ? "silver" : 
                       item.price.type === "gold" ? "gold" : "diamond";
    return state.currencies[currencyKey] >= item.price.amount;
  };
  
  const buyItem = (item: typeof SHOP_ITEMS[0]) => {
    if (!canAfford(item)) return;
    
    const currencyKey = item.price.type === "copper" ? "copper" : 
                       item.price.type === "silver" ? "silver" : 
                       item.price.type === "gold" ? "gold" : "diamond";
    addCurrency(currencyKey, -item.price.amount);
    // TODO: Adicionar ao inventário
  };
  
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>🏪 LOJA GERAL</Text>
            <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
              <Text style={modalStyles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* Currency Display */}
          <View style={modalStyles.currencyBar}>
            <Text style={modalStyles.currencyText}>🥉 {state.currencies.copper}</Text>
            <Text style={modalStyles.currencyText}>🥈 {state.currencies.silver}</Text>
            <Text style={modalStyles.currencyText}>🥇 {state.currencies.gold}</Text>
            <Text style={modalStyles.currencyText}>💎 {state.currencies.diamond}</Text>
          </View>
          
          {/* Categories */}
          <View style={modalStyles.categories}>
            {(["potions", "scrolls", "materials"] as const).map(cat => (
              <TouchableOpacity 
                key={cat}
                style={[modalStyles.catBtn, selectedCategory === cat && modalStyles.catBtnActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[modalStyles.catText, selectedCategory === cat && modalStyles.catTextActive]}>
                  {cat === "potions" ? "🧪 Poções" : cat === "scrolls" ? "📜 Scrolls" : "📦 Materiais"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Items */}
          <ScrollView style={modalStyles.itemList} showsVerticalScrollIndicator={false}>
            {filteredItems.map(item => (
              <View key={item.id} style={modalStyles.itemCard}>
                <Text style={modalStyles.itemEmoji}>{item.emoji}</Text>
                <View style={modalStyles.itemInfo}>
                  <Text style={modalStyles.itemName}>{item.name}</Text>
                  <Text style={modalStyles.itemDesc}>{item.description}</Text>
                </View>
                <TouchableOpacity 
                  style={[modalStyles.buyBtn, !canAfford(item) && modalStyles.buyBtnDisabled]}
                  disabled={!canAfford(item)}
                  onPress={() => buyItem(item)}
                >
                  <Text style={modalStyles.buyBtnText}>
                    {item.price.type === "copper" && "🥉"}
                    {item.price.type === "silver" && "🥈"}
                    {item.price.type === "gold" && "🥇"}
                    {item.price.type === "diamond" && "💎"}
                    {" "}{item.price.amount}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function CityScreen() {
  const { state } = useGame();
  const [selectedBuilding, setSelectedBuilding] = useState<CityBuilding | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const buildings = Object.values(CITY_BUILDINGS);
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🏛️ CIDADE</Text>
          <Text style={styles.headerSubtitle}>Bem-vindo ao centro comercial</Text>
        </View>
        
        {/* City Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>🏰</Text>
          <Text style={styles.infoText}>
            Aqui você pode comprar itens, forjar equipamentos, encantar armas 
            e criar itens especiais. Desbloqueie novos edifícios ao subir de nível!
          </Text>
        </View>
        
        {/* Buildings */}
        <Text style={styles.sectionTitle}>EDIFÍCIOS</Text>
        
        {buildings.map(building => (
          <BuildingCard
            key={building.id}
            building={building}
            onPress={() => setSelectedBuilding(building.id)}
            locked={state.level < building.unlockLevel}
          />
        ))}
        
        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 ESTATÍSTICAS</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{state.level}</Text>
              <Text style={styles.statLabel}>Nível</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{state.discoveredDungeons.length}</Text>
              <Text style={styles.statLabel}>Dungeons</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{state.towerProgress}</Text>
              <Text style={styles.statLabel}>Torre</Text>
            </View>
          </View>
        </View>
      </Animated.View>
      
      <ShopModal 
        visible={selectedBuilding === "shop"} 
        onClose={() => setSelectedBuilding(null)} 
      />
      
      <HospitalModal 
        visible={selectedBuilding === "hospital"} 
        onClose={() => setSelectedBuilding(null)} 
      />
    </ScrollView>
  );
}

// Hospital Modal
function HospitalModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { state, getTotalStats, healHp, restoreMp } = useGame();
  const stats = getTotalStats();
  const [timeInside, setTimeInside] = useState(0);
  const [hpRecovered, setHpRecovered] = useState(0);
  const [mpRecovered, setMpRecovered] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Regeneração: 4% por minuto = 0.067% por segundo
  const REGEN_RATE = 0.00067; // 0.067% por segundo
  
  useEffect(() => {
    if (visible) {
      // Iniciar regeneração quando entrar no hospital
      intervalRef.current = setInterval(() => {
        setTimeInside(prev => prev + 1);
        
        // Calcular regeneração (4% por minuto = 0.067% por segundo)
        const hpRegen = Math.max(1, Math.floor(stats.hp * REGEN_RATE));
        const mpRegen = Math.max(1, Math.floor(stats.mp * REGEN_RATE));
        
        // Aplicar regeneração real no jogador
        healHp(hpRegen);
        restoreMp(mpRegen);
        
        setHpRecovered(prev => prev + hpRegen);
        setMpRecovered(prev => prev + mpRegen);
      }, 1000); // A cada segundo
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [visible, stats.hp, stats.mp, healHp, restoreMp]);
  
  // Resetar quando fechar
  useEffect(() => {
    if (!visible) {
      setTimeInside(0);
      setHpRecovered(0);
      setMpRecovered(0);
    }
  }, [visible]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>🏥 HOSPITAL</Text>
            <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
              <Text style={modalStyles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* Status atual */}
          <View style={hospitalStyles.statusCard}>
            <Text style={hospitalStyles.statusTitle}>❤️ STATUS ATUAL</Text>
            <View style={hospitalStyles.barContainer}>
              <Text style={hospitalStyles.barLabel}>HP</Text>
              <View style={hospitalStyles.barBg}>
                <View style={[hospitalStyles.barFill, { width: `${(state.currentHp / stats.hp) * 100}%`, backgroundColor: "#ef4444" }]} />
              </View>
              <Text style={hospitalStyles.barValue}>{Math.floor(state.currentHp)}/{stats.hp}</Text>
            </View>
            <View style={hospitalStyles.barContainer}>
              <Text style={hospitalStyles.barLabel}>MP</Text>
              <View style={hospitalStyles.barBg}>
                <View style={[hospitalStyles.barFill, { width: `${(state.currentMp / stats.mp) * 100}%`, backgroundColor: "#3b82f6" }]} />
              </View>
              <Text style={hospitalStyles.barValue}>{Math.floor(state.currentMp)}/{stats.mp}</Text>
            </View>
          </View>
          
          {/* Bônus do hospital */}
          <View style={hospitalStyles.bonusCard}>
            <Text style={hospitalStyles.bonusTitle}>✨ BÔNUS DO HOSPITAL</Text>
            <Text style={hospitalStyles.bonusText}>+4% HP e MP por minuto</Text>
            <Text style={hospitalStyles.bonusSubtext}>Acumula com outros bônus de regeneração</Text>
          </View>
          
          {/* Tempo dentro */}
          <View style={hospitalStyles.timeCard}>
            <Text style={hospitalStyles.timeLabel}>⏱️ TEMPO NO HOSPITAL</Text>
            <Text style={hospitalStyles.timeValue}>{formatTime(timeInside)}</Text>
          </View>
          
          {/* Recuperação */}
          <View style={hospitalStyles.recoveryCard}>
            <Text style={hospitalStyles.recoveryTitle}>📈 RECUPERAÇÃO TOTAL</Text>
            <View style={hospitalStyles.recoveryRow}>
              <Text style={hospitalStyles.recoveryLabel}>HP Recuperado:</Text>
              <Text style={[hospitalStyles.recoveryValue, { color: "#ef4444" }]}>+{Math.floor(hpRecovered)}</Text>
            </View>
            <View style={hospitalStyles.recoveryRow}>
              <Text style={hospitalStyles.recoveryLabel}>MP Recuperado:</Text>
              <Text style={[hospitalStyles.recoveryValue, { color: "#3b82f6" }]}>+{Math.floor(mpRecovered)}</Text>
            </View>
          </View>
          
          {/* Dica */}
          <View style={hospitalStyles.tipCard}>
            <Text style={hospitalStyles.tipText}>💡 Fique no hospital o quanto quiser! A regeneração continua enquanto você estiver aqui.</Text>
          </View>
          
          {/* Botão sair */}
          <TouchableOpacity style={hospitalStyles.leaveBtn} onPress={onClose}>
            <Text style={hospitalStyles.leaveText}>SAIR DO HOSPITAL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  infoCard: {
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
    flexDirection: "row",
    alignItems: "center",
  },
  infoEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  infoText: {
    color: "#94a3b8",
    fontSize: 13,
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 16,
  },
  buildingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(18, 18, 26, 0.6)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.15)",
  },
  buildingCardLocked: {
    opacity: 0.5,
  },
  buildingIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  buildingEmoji: {
    fontSize: 32,
  },
  buildingInfo: {
    flex: 1,
  },
  buildingName: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 3,
  },
  buildingDesc: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 18,
  },
  unlockText: {
    color: "#f59e0b",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  enterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  enterText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  adventureBtn: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  adventureEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  adventureText: {
    color: "#22c55e",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 4,
  },
  adventureHint: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    textAlign: "center",
  },
  statsCard: {
    backgroundColor: "rgba(18, 18, 26, 0.4)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  statsTitle: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    color: "#64748b",
    fontSize: 12,
  },
});

const modalStyles = StyleSheet.create({
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
  currencyBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124, 58, 237, 0.1)",
  },
  currencyText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  categories: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124, 58, 237, 0.1)",
  },
  catBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  catBtnActive: {
    backgroundColor: "rgba(124, 58, 237, 0.3)",
  },
  catText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  catTextActive: {
    color: "#ffffff",
  },
  itemList: {
    padding: 16,
    maxHeight: 400,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  itemEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  itemDesc: {
    color: "#64748b",
    fontSize: 11,
  },
  buyBtn: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  buyBtnDisabled: {
    backgroundColor: "rgba(100, 100, 100, 0.2)",
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  buyBtnText: {
    color: "#22c55e",
    fontSize: 12,
    fontWeight: "700",
  },
});

// Hospital Styles
const hospitalStyles = StyleSheet.create({
  statusCard: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  statusTitle: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  barLabel: {
    color: "#94a3b8",
    fontSize: 12,
    width: 30,
  },
  barBg: {
    flex: 1,
    height: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 5,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
  },
  barValue: {
    color: "#ffffff",
    fontSize: 11,
    width: 60,
    textAlign: "right",
  },
  bonusCard: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.2)",
    alignItems: "center",
  },
  bonusTitle: {
    color: "#22c55e",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  bonusText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  bonusSubtext: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 4,
  },
  timeCard: {
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
    alignItems: "center",
  },
  timeLabel: {
    color: "#a855f7",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  timeValue: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  recoveryCard: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  recoveryTitle: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },
  recoveryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  recoveryLabel: {
    color: "#94a3b8",
    fontSize: 14,
  },
  recoveryValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  tipCard: {
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.2)",
  },
  tipText: {
    color: "#fbbf24",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  leaveBtn: {
    backgroundColor: "#ef4444",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  leaveText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
  },
});
