// Tela de Loot - Mostra recompensas completas após combate
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useGame, Item } from "@/context/GameContext";
import { router } from "expo-router";

// Tiers de equipamentos (F, E, D, C, B, A, S, SS, SSS, SSS+)
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

// Qualidades de equipamentos
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

// Componente de Card de Item
function LootItemCard({ item }: { item: Item }) {
  const tier = ITEM_TIERS[item.tier] || ITEM_TIERS["F"];
  const quality = ITEM_QUALITIES[item.quality] || ITEM_QUALITIES["normal"];
  
  return (
    <View style={[styles.itemCard, { borderColor: tier.color }]}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemIcon}>{item.icon}</Text>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: quality.color }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemTier, { color: tier.color }]}>
            {tier.name} • {quality.name}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemStats}>
        {item.atkF > 0 && <Text style={styles.stat}>⚔️ +{item.atkF}</Text>}
        {item.atkM > 0 && <Text style={styles.stat}>🔮 +{item.atkM}</Text>}
        {item.def > 0 && <Text style={styles.stat}>🛡️ +{item.def}</Text>}
        {item.armor > 0 && <Text style={styles.stat}>🧱 +{item.armor}</Text>}
        {item.hp > 0 && <Text style={styles.stat}>❤️ +{item.hp}</Text>}
        {item.mp > 0 && <Text style={styles.stat}>💧 +{item.mp}</Text>}
        {item.critRate > 0 && <Text style={styles.stat}>🎯 +{(item.critRate * 100).toFixed(0)}%</Text>}
        {item.dodge > 0 && <Text style={styles.stat}>💨 +{(item.dodge * 100).toFixed(0)}%</Text>}
      </View>
    </View>
  );
}

export default function LootScreen() {
  const { state, getTotalStats } = useGame();
  
  // Pegar as últimas mensagens do combat log (recompensas da última batalha)
  const combatLog = state.combatLog;
  
  // Encontrar o índice do início do log de vitória mais recente
  const findVictoryStart = () => {
    for (let i = combatLog.length - 1; i >= 0; i--) {
      if (combatLog[i]?.includes("VITÓRIA COMPLETA")) {
        return i;
      }
    }
    return -1;
  };
  
  const victoryStartIndex = findVictoryStart();
  const rewardLog = victoryStartIndex >= 0 
    ? combatLog.slice(victoryStartIndex, victoryStartIndex + 30)
    : [];
  
  // Pegar os últimos itens adicionados ao inventário (máximo 6)
  const recentLoot = state.inventory.slice(-6).reverse();
  
  // Calcular totais do estado atual
  const { currencies, level, exp } = state;
  
  const handleContinue = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 VITÓRIA!</Text>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Painel de Recompensas */}
        <View style={styles.rewardsPanel}>
          <Text style={styles.panelTitle}>📊 Recompensas Obtidas</Text>
          
          {/* XP e Level */}
          <View style={styles.rewardSection}>
            <Text style={styles.sectionTitle}>Experiência</Text>
            <View style={styles.xpRow}>
              <Text style={styles.xpValue}>+{Math.floor(exp).toLocaleString()} XP</Text>
              <Text style={styles.levelText}>Nível {level}</Text>
            </View>
          </View>
          
          {/* Moedas */}
          <View style={styles.rewardSection}>
            <Text style={styles.sectionTitle}>Moedas</Text>
            <View style={styles.currencyGrid}>
              {currencies.gold > 0 && (
                <View style={styles.currencyItem}>
                  <Text style={styles.currencyIcon}>🥇</Text>
                  <Text style={styles.currencyValue}>{currencies.gold.toLocaleString()}</Text>
                  <Text style={styles.currencyLabel}>Ouro</Text>
                </View>
              )}
              {currencies.silver > 0 && (
                <View style={styles.currencyItem}>
                  <Text style={styles.currencyIcon}>🥈</Text>
                  <Text style={styles.currencyValue}>{currencies.silver.toLocaleString()}</Text>
                  <Text style={styles.currencyLabel}>Prata</Text>
                </View>
              )}
              {currencies.copper > 0 && (
                <View style={styles.currencyItem}>
                  <Text style={styles.currencyIcon}>🥉</Text>
                  <Text style={styles.currencyValue}>{currencies.copper.toLocaleString()}</Text>
                  <Text style={styles.currencyLabel}>Cobre</Text>
                </View>
              )}
              {currencies.diamond > 0 && (
                <View style={styles.currencyItem}>
                  <Text style={styles.currencyIcon}>💎</Text>
                  <Text style={styles.currencyValue}>{currencies.diamond.toLocaleString()}</Text>
                  <Text style={styles.currencyLabel}>Diamantes</Text>
                </View>
              )}
              {currencies.mithril > 0 && (
                <View style={styles.currencyItem}>
                  <Text style={styles.currencyIcon}>✨</Text>
                  <Text style={styles.currencyValue}>{currencies.mithril.toLocaleString()}</Text>
                  <Text style={styles.currencyLabel}>Mithril</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Itens Dropados */}
          {recentLoot.length > 0 && (
            <View style={styles.rewardSection}>
              <Text style={styles.sectionTitle}>📦 Itens Obtidos ({recentLoot.length})</Text>
              <View style={styles.itemsContainer}>
                {recentLoot.map((item) => (
                  <LootItemCard key={item.id} item={item} />
                ))}
              </View>
            </View>
          )}
          
          {/* Log de Combate Detalhado */}
          {rewardLog.length > 0 && (
            <View style={styles.rewardSection}>
              <Text style={styles.sectionTitle}>📝 Log de Batalha</Text>
              <View style={styles.logContainer}>
                {rewardLog.map((log, index) => (
                  <Text key={index} style={styles.logText}>{log}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
        <Text style={styles.continueBtnText}>Continuar →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  rewardsPanel: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: "#334155",
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f8fafc",
    textAlign: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  rewardSection: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  xpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 12,
  },
  xpValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22c55e",
  },
  levelText: {
    fontSize: 14,
    color: "#fbbf24",
    fontWeight: "600",
  },
  currencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  currencyItem: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    minWidth: 80,
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
  itemsContainer: {
    gap: 8,
  },
  itemCard: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 12,
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
  logContainer: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 12,
  },
  logText: {
    fontSize: 11,
    color: "#64748b",
    fontFamily: "monospace",
    lineHeight: 16,
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
