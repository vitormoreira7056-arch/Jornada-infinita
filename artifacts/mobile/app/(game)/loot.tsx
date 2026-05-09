// Tela de Loot - Mostra itens dropados após combate
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useGame, Item } from "@/context/GameContext";
import { router } from "expo-router";

export default function LootScreen() {
  const { state, getItemColor, getItemTierName, equipItem } = useGame();
  
  // Pegar os últimos itens adicionados ao inventário (máximo 6)
  const recentLoot = state.inventory.slice(-6).reverse();
  
  const handleEquip = (item: Item) => {
    equipItem(item, item.slot as any);
    router.back();
  };
  
  const handleContinue = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Vitória!</Text>
      <Text style={styles.subtitle}>Itens dropados:</Text>
      
      <ScrollView style={styles.lootContainer}>
        {recentLoot.length > 0 ? (
          recentLoot.map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: getItemColor(item) }]}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemTier}>
                    {getItemTierName(item)} • Nível {item.level}
                  </Text>
                  {item.setName && (
                    <Text style={styles.setBadge}>⭐ {item.setName}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.itemStats}>
                {item.atkF > 0 && (
                  <Text style={styles.statText}>⚔️ ATK F: +{item.atkF}</Text>
                )}
                {item.atkM > 0 && (
                  <Text style={styles.statText}>🔮 ATK M: +{item.atkM}</Text>
                )}
                {item.def > 0 && (
                  <Text style={styles.statText}>🛡️ DEF: +{item.def}</Text>
                )}
                {item.armor > 0 && (
                  <Text style={styles.statText}>🛡️ ARM: +{item.armor}</Text>
                )}
                {item.hp > 0 && (
                  <Text style={styles.statText}>❤️ HP: +{item.hp}</Text>
                )}
                {item.mp > 0 && (
                  <Text style={styles.statText}>💧 MP: +{item.mp}</Text>
                )}
              </View>
              
              {item.passiveEffect && (
                <Text style={styles.passiveEffect}>✨ {item.passiveEffect}</Text>
              )}
              
              {item.activeSkill && (
                <View style={styles.activeSkill}>
                  <Text style={styles.skillName}>⚡ {item.activeSkill.name}</Text>
                  <Text style={styles.skillDesc}>{item.activeSkill.description}</Text>
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.equipBtn}
                onPress={() => handleEquip(item)}
              >
                <Text style={styles.equipBtnText}>📥 Equipar Agora</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noLoot}>Nenhum item dropado desta vez.</Text>
        )}
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fbbf24",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 20,
  },
  lootContainer: {
    flex: 1,
  },
  itemCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  itemTier: {
    fontSize: 12,
    color: "#64748b",
  },
  setBadge: {
    fontSize: 11,
    color: "#fbbf24",
    marginTop: 2,
  },
  itemStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  statText: {
    fontSize: 12,
    color: "#cbd5e1",
  },
  passiveEffect: {
    fontSize: 12,
    color: "#22c55e",
    marginBottom: 8,
    fontStyle: "italic",
  },
  activeSkill: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  skillName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fbbf24",
    marginBottom: 2,
  },
  skillDesc: {
    fontSize: 11,
    color: "#94a3b8",
  },
  equipBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  equipBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  noLoot: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginTop: 40,
  },
  continueBtn: {
    backgroundColor: "#3b82f6",
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
