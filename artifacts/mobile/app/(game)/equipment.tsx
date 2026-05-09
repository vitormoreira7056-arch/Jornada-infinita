// Tela de Equipamentos - Sistema com Sets e Bônus
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useGame, Item } from "@/context/GameContext";
import { EQUIPMENT_SETS } from "@/constants/equipment/sets";

export default function EquipmentScreen() {
  const { state, equipItem, unequipItem, sellItem, getItemColor, getItemTierName, getEquippedSetBonuses, getTotalStats } = useGame();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<Item | null>(null);
  
  const slots = [
    { id: "head", name: "Cabeça", icon: "⛑️" },
    { id: "chest", name: "Peitoral", icon: "🛡️" },
    { id: "legs", name: "Pernas", icon: "👖" },
    { id: "feet", name: "Pés", icon: "🥾" },
    { id: "mainHand", name: "Mão Principal", icon: "⚔️" },
    { id: "offHand", name: "Mão Secundária", icon: "🛡️" },
  ] as const;
  
  const stats = getTotalStats();
  const setBonuses = getEquippedSetBonuses();
  
  const handleEquip = (item: Item) => {
    equipItem(item, item.slot);
    setSelectedInventoryItem(null);
  };
  
  const handleUnequip = (slot: string) => {
    unequipItem(slot as any);
    setSelectedSlot(null);
  };
  
  const handleSell = (item: Item) => {
    Alert.alert(
      "Vender Item",
      `Deseja vender ${item.name} por ${item.value} cobre?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Vender", onPress: () => { sellItem(item.id); setSelectedInventoryItem(null); } }
      ]
    );
  };
  
  const getSlotItem = (slotId: string): Item | null => {
    const equipment = state.equipment as Record<string, Item | null>;
    return equipment[slotId] || null;
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>⚔️ Equipamentos</Text>
      
      {/* Stats do Personagem */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>📊 Status</Text>
        <View style={styles.statsGrid}>
          <StatBox label="HP" value={Math.floor(stats.hp)} color="#ef4444" />
          <StatBox label="MP" value={Math.floor(stats.mp)} color="#3b82f6" />
          <StatBox label="ATK F" value={Math.floor(stats.atkF)} color="#f97316" />
          <StatBox label="ATK M" value={Math.floor(stats.atkM)} color="#a855f7" />
          <StatBox label="DEF" value={Math.floor(stats.def)} color="#22c55e" />
          <StatBox label="ARM" value={Math.floor(stats.armor)} color="#6b7280" />
        </View>
      </View>
      
      {/* Slots de Equipamento */}
      <View style={styles.equipmentContainer}>
        <Text style={styles.sectionTitle}>🛡️ Equipado</Text>
        <View style={styles.slotsGrid}>
          {slots.map((slot) => {
            const item = getSlotItem(slot.id);
            return (
              <TouchableOpacity
                key={slot.id}
                style={[styles.slotBox, selectedSlot === slot.id && styles.slotBoxSelected]}
                onPress={() => setSelectedSlot(slot.id)}
              >
                <Text style={styles.slotIcon}>{slot.icon}</Text>
                <Text style={styles.slotName}>{slot.name}</Text>
                {item ? (
                  <>
                    <Text style={[styles.itemName, { color: getItemColor(item) }]} numberOfLines={1}>
                      {item.icon} {item.name}
                    </Text>
                    <Text style={styles.itemTier}>{getItemTierName(item)}</Text>
                    {item.setName && (
                      <Text style={styles.setBadge}>⭐ {item.setName}</Text>
                    )}
                  </>
                ) : (
                  <Text style={styles.emptySlot}>Vazio</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      {/* Detalhes do Item Selecionado */}
      {selectedSlot && getSlotItem(selectedSlot) && (
        <View style={styles.itemDetails}>
          <Text style={styles.sectionTitle}>📋 Detalhes do Item</Text>
          {(() => {
            const item = getSlotItem(selectedSlot)!;
            return (
              <>
                <Text style={[styles.detailName, { color: getItemColor(item) }]}>
                  {item.icon} {item.name}
                </Text>
                <Text style={styles.detailTier}>Tier: {getItemTierName(item)} | Nível: {item.level}</Text>
                
                <View style={styles.statsList}>
                  {item.atkF > 0 && <Text style={styles.statLine}>⚔️ ATK Físico: +{item.atkF}</Text>}
                  {item.atkM > 0 && <Text style={styles.statLine}>🔮 ATK Mágico: +{item.atkM}</Text>}
                  {item.def > 0 && <Text style={styles.statLine}>🛡️ Defesa: +{item.def}</Text>}
                  {item.armor > 0 && <Text style={styles.statLine}>🛡️ Armadura: +{item.armor}</Text>}
                  {item.magicRes > 0 && <Text style={styles.statLine}>✨ Res. Mágica: +{item.magicRes}</Text>}
                  {item.hp > 0 && <Text style={styles.statLine}>❤️ HP: +{item.hp}</Text>}
                  {item.mp > 0 && <Text style={styles.statLine}>💧 MP: +{item.mp}</Text>}
                  {item.critRate > 0 && <Text style={styles.statLine}>🎯 Chance Crítico: +{(item.critRate * 100).toFixed(1)}%</Text>}
                  {item.critDmg > 1 && <Text style={styles.statLine}>💥 Dano Crítico: +{((item.critDmg - 1) * 100).toFixed(0)}%</Text>}
                  {item.atkSpeed > 0 && <Text style={styles.statLine}>⚡ Velocidade: +{(item.atkSpeed * 100).toFixed(0)}%</Text>}
                  {item.dodge > 0 && <Text style={styles.statLine}>💨 Esquiva: +{(item.dodge * 100).toFixed(1)}%</Text>}
                </View>
                
                {item.passiveEffect && (
                  <View style={styles.effectBox}>
                    <Text style={styles.effectLabel}>✨ Efeito Passivo:</Text>
                    <Text style={styles.effectText}>{item.passiveEffect}</Text>
                  </View>
                )}
                
                {item.activeSkill && (
                  <View style={styles.effectBox}>
                    <Text style={styles.effectLabel}>⚡ Habilidade Ativa:</Text>
                    <Text style={styles.skillName}>{item.activeSkill.name}</Text>
                    <Text style={styles.effectText}>{item.activeSkill.description}</Text>
                    <Text style={styles.skillCost}>💧 {item.activeSkill.manaCost} MP | ⏱️ {item.activeSkill.cooldown}s</Text>
                  </View>
                )}
                
                {item.setName && (
                  <View style={styles.setBox}>
                    <Text style={styles.setLabel}>⭐ Set: {item.setName}</Text>
                    {(() => {
                      const set = EQUIPMENT_SETS.find(s => s.name === item.setName);
                      const equippedCount = Object.values(state.equipment).filter(i => i?.setName === item.setName).length;
                      return set ? (
                        <>
                          <Text style={styles.setProgress}>Peças equipadas: {equippedCount}/{set.bonuses[set.bonuses.length - 1].requiredPieces}</Text>
                          {set.bonuses.map((bonus, idx) => (
                            <Text key={idx} style={[styles.setBonus, equippedCount >= bonus.requiredPieces && styles.setBonusActive]}>
                              {equippedCount >= bonus.requiredPieces ? "✅" : "⬜"} {bonus.requiredPieces}p: {bonus.description}
                            </Text>
                          ))}
                        </>
                      ) : null;
                    })()}
                  </View>
                )}
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.unequipBtn} onPress={() => handleUnequip(selectedSlot)}>
                    <Text style={styles.btnText}>📤 Desequipar</Text>
                  </TouchableOpacity>
                </View>
              </>
            );
          })()}
        </View>
      )}
      
      {/* Bônus de Sets Ativos */}
      {setBonuses.size > 0 && (
        <View style={styles.activeSetsContainer}>
          <Text style={styles.sectionTitle}>⭐ Bônus de Sets Ativos</Text>
          {Array.from(setBonuses.entries()).map(([setName, bonuses]) => (
            <View key={setName} style={styles.activeSetBox}>
              <Text style={styles.activeSetName}>{setName}</Text>
              {bonuses.map((bonus, idx) => (
                <Text key={idx} style={styles.activeBonus}>✨ {bonus.description}</Text>
              ))}
            </View>
          ))}
        </View>
      )}
      
      {/* Inventário */}
      <View style={styles.inventoryContainer}>
        <Text style={styles.sectionTitle}>🎒 Inventário ({state.inventory.length}/{state.inventorySize})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.inventoryScroll}>
          {state.inventory.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.inventoryItem, selectedInventoryItem?.id === item.id && styles.inventoryItemSelected]}
              onPress={() => setSelectedInventoryItem(item)}
            >
              <Text style={styles.inventoryIcon}>{item.icon}</Text>
              <Text style={[styles.inventoryName, { color: getItemColor(item) }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.inventoryTier}>{getItemTierName(item)}</Text>
              {item.setName && <Text style={styles.setIndicator}>⭐</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Ações do Item do Inventário */}
      {selectedInventoryItem && (
        <View style={styles.inventoryActions}>
          <TouchableOpacity style={styles.equipBtn} onPress={() => handleEquip(selectedInventoryItem)}>
            <Text style={styles.btnText}>📥 Equipar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sellBtn} onPress={() => handleSell(selectedInventoryItem)}>
            <Text style={styles.btnText}>💰 Vender ({selectedInventoryItem.value})</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.statBox, { borderColor: color }]}>
      <Text style={[styles.statLabel, { color }]}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fbbf24", textAlign: "center", marginBottom: 16 },
  
  statsContainer: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#94a3b8", marginBottom: 8 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statBox: { 
    flex: 1, minWidth: 80, backgroundColor: "#1e293b", borderRadius: 8, 
    padding: 8, alignItems: "center", borderWidth: 1 
  },
  statLabel: { fontSize: 10, fontWeight: "bold" },
  statValue: { fontSize: 16, fontWeight: "bold", color: "#f8fafc" },
  
  equipmentContainer: { marginBottom: 16 },
  slotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slotBox: { 
    width: "48%", backgroundColor: "#1e293b", borderRadius: 8, 
    padding: 12, alignItems: "center", borderWidth: 2, borderColor: "transparent" 
  },
  slotBoxSelected: { borderColor: "#3b82f6" },
  slotIcon: { fontSize: 24, marginBottom: 4 },
  slotName: { fontSize: 10, color: "#94a3b8", marginBottom: 4 },
  itemName: { fontSize: 12, fontWeight: "bold", textAlign: "center" },
  itemTier: { fontSize: 10, color: "#64748b" },
  setBadge: { fontSize: 9, color: "#fbbf24", marginTop: 2 },
  emptySlot: { fontSize: 12, color: "#475569", fontStyle: "italic" },
  
  itemDetails: { 
    backgroundColor: "#1e293b", borderRadius: 12, padding: 16, 
    marginBottom: 16, borderWidth: 1, borderColor: "#334155" 
  },
  detailName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  detailTier: { fontSize: 12, color: "#94a3b8", marginBottom: 12 },
  statsList: { marginBottom: 12 },
  statLine: { fontSize: 12, color: "#cbd5e1", marginBottom: 2 },
  
  effectBox: { 
    backgroundColor: "#0f172a", borderRadius: 8, padding: 10, 
    marginBottom: 8, borderLeftWidth: 3, borderLeftColor: "#3b82f6" 
  },
  effectLabel: { fontSize: 11, fontWeight: "bold", color: "#60a5fa", marginBottom: 4 },
  effectText: { fontSize: 12, color: "#cbd5e1" },
  skillName: { fontSize: 13, fontWeight: "bold", color: "#fbbf24", marginBottom: 2 },
  skillCost: { fontSize: 10, color: "#64748b", marginTop: 4 },
  
  setBox: { 
    backgroundColor: "#0f172a", borderRadius: 8, padding: 10, 
    marginBottom: 8, borderLeftWidth: 3, borderLeftColor: "#fbbf24" 
  },
  setLabel: { fontSize: 12, fontWeight: "bold", color: "#fbbf24", marginBottom: 4 },
  setProgress: { fontSize: 10, color: "#94a3b8", marginBottom: 4 },
  setBonus: { fontSize: 10, color: "#64748b", marginBottom: 2 },
  setBonusActive: { color: "#22c55e" },
  
  actionButtons: { flexDirection: "row", gap: 8, marginTop: 12 },
  unequipBtn: { 
    flex: 1, backgroundColor: "#ef4444", borderRadius: 8, 
    padding: 12, alignItems: "center" 
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  
  activeSetsContainer: { marginBottom: 16 },
  activeSetBox: { 
    backgroundColor: "#1e293b", borderRadius: 8, padding: 12, 
    marginBottom: 8, borderLeftWidth: 3, borderLeftColor: "#22c55e" 
  },
  activeSetName: { fontSize: 14, fontWeight: "bold", color: "#fbbf24", marginBottom: 4 },
  activeBonus: { fontSize: 12, color: "#22c55e", marginBottom: 2 },
  
  inventoryContainer: { marginBottom: 16 },
  inventoryScroll: { flexDirection: "row" },
  inventoryItem: { 
    width: 100, backgroundColor: "#1e293b", borderRadius: 8, 
    padding: 8, marginRight: 8, alignItems: "center", borderWidth: 2, borderColor: "transparent" 
  },
  inventoryItemSelected: { borderColor: "#3b82f6" },
  inventoryIcon: { fontSize: 24, marginBottom: 4 },
  inventoryName: { fontSize: 10, fontWeight: "bold", textAlign: "center" },
  inventoryTier: { fontSize: 9, color: "#64748b" },
  setIndicator: { fontSize: 10, position: "absolute", top: 4, right: 4 },
  
  inventoryActions: { flexDirection: "row", gap: 8, marginBottom: 16 },
  equipBtn: { 
    flex: 1, backgroundColor: "#22c55e", borderRadius: 8, 
    padding: 12, alignItems: "center" 
  },
  sellBtn: { 
    flex: 1, backgroundColor: "#f59e0b", borderRadius: 8, 
    padding: 12, alignItems: "center" 
  },
});
