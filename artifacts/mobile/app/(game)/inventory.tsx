import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useGame, Item, EquipmentSlot } from "@/context/GameContext";

const RARITY_COLORS = {
  common: "#9ca3af",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#f59e0b",
  mythic: "#ef4444",
};

const RARITY_NAMES = {
  common: "Comum",
  uncommon: "Incomum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
  mythic: "Mítico",
};

const SLOT_CONFIG: { slot: EquipmentSlot; name: string; icon: string }[] = [
  { slot: "helmet", name: "Elmo", icon: "⛑️" },
  { slot: "face", name: "Rosto", icon: "🎭" },
  { slot: "necklace", name: "Colar", icon: "📿" },
  { slot: "earrings", name: "Brincos", icon: "💎" },
  { slot: "shoulders", name: "Ombros", icon: "🛡️" },
  { slot: "cape", name: "Capa", icon: "🦸" },
  { slot: "chest", name: "Peitoral", icon: "👕" },
  { slot: "bracelet", name: "Pulseira", icon: "📿" },
  { slot: "mainHand", name: "Mão Primária", icon: "⚔️" },
  { slot: "offHand", name: "Mão Secundária", icon: "🛡️" },
  { slot: "ring1", name: "Anel 1", icon: "💍" },
  { slot: "ring2", name: "Anel 2", icon: "💍" },
  { slot: "ring3", name: "Anel 3", icon: "💍" },
  { slot: "ring4", name: "Anel 4", icon: "💍" },
  { slot: "legs", name: "Calças", icon: "👖" },
  { slot: "boots", name: "Botas", icon: "👢" },
  { slot: "pet", name: "Mascote", icon: "🐺" },
  { slot: "spirit", name: "Espírito", icon: "👻" },
];

type Tab = "items" | "equipment";

function ItemCard({
  item,
  onPress,
  onSell,
}: {
  item: Item;
  onPress?: () => void;
  onSell?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.itemCard} onPress={onPress}>
      <View style={[styles.itemIconBox, { borderColor: RARITY_COLORS[item.rarity] }]}>
        <Text style={styles.itemIcon}>{item.icon}</Text>
        <View style={[styles.rarityDot, { backgroundColor: RARITY_COLORS[item.rarity] }]} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.itemRarity, { color: RARITY_COLORS[item.rarity] }]}>
          {RARITY_NAMES[item.rarity]}
        </Text>
        <View style={styles.itemStats}>
          {item.atk > 0 && <Text style={styles.miniStat}>⚔️{item.atk}</Text>}
          {item.def > 0 && <Text style={styles.miniStat}>🛡️{item.def}</Text>}
          {item.hp > 0 && <Text style={styles.miniStat}>❤️{item.hp}</Text>}
        </View>
      </View>
      {onSell && (
        <TouchableOpacity style={styles.sellBtn} onPress={onSell}>
          <Text style={styles.sellText}>🪙{item.value}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

function EquipmentSlotCard({
  slot,
  name,
  icon,
  item,
  onPress,
}: {
  slot: EquipmentSlot;
  name: string;
  icon: string;
  item: Item | null;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.slotCard} onPress={onPress}>
      <View style={[
        styles.slotIconBox,
        item && { borderColor: RARITY_COLORS[item.rarity] }
      ]}>
        <Text style={styles.slotIcon}>{item ? item.icon : icon}</Text>
        {item && <View style={[styles.equippedDot, { backgroundColor: RARITY_COLORS[item.rarity] }]} />}
      </View>
      <Text style={styles.slotName}>{name}</Text>
      {item ? (
        <Text style={[styles.slotItemName, { color: RARITY_COLORS[item.rarity] }]} numberOfLines={1}>
          {item.name}
        </Text>
      ) : (
        <Text style={styles.slotEmpty}>Vazio</Text>
      )}
    </TouchableOpacity>
  );
}

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<Tab>("items");
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const { state, equipItem, unequipItem, sellItem } = useGame();

  const handleEquip = (item: Item) => {
    if (selectedSlot) {
      equipItem(item, selectedSlot);
      setSelectedSlot(null);
    }
  };

  const handleUnequip = (slot: EquipmentSlot) => {
    Alert.alert(
      "Desequipar",
      "Deseja remover este item?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", onPress: () => unequipItem(slot) },
      ]
    );
  };

  // Filter items by selected slot type
  const filteredItems = selectedSlot
    ? state.inventory.filter((item) => item.slot === selectedSlot)
    : state.inventory;

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "items" && styles.tabActive]}
          onPress={() => { setActiveTab("items"); setSelectedSlot(null); }}
        >
          <Text style={[styles.tabText, activeTab === "items" && styles.tabTextActive]}>
            📦 ITENS ({state.inventory.length}/{state.inventorySize})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "equipment" && styles.tabActive]}
          onPress={() => { setActiveTab("equipment"); setSelectedSlot(null); }}
        >
          <Text style={[styles.tabText, activeTab === "equipment" && styles.tabTextActive]}>
            ⚔️ EQUIPAMENTOS
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "items" ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {state.inventory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyTitle}>Mochila Vazia</Text>
              <Text style={styles.emptyText}>Derrote monstros para obter itens!</Text>
            </View>
          ) : (
            state.inventory.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onPress={() => {}}
                onSell={() => sellItem(item.id)}
              />
            ))
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {selectedSlot ? (
            // Show items that can be equipped in this slot
            <View>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedSlot(null)}
              >
                <Text style={styles.backText}>← VOLTAR</Text>
              </TouchableOpacity>
              
              <Text style={styles.sectionTitle}>
                {SLOT_CONFIG.find(s => s.slot === selectedSlot)?.name}
              </Text>

              {state.equipment[selectedSlot] && (
                <View style={styles.currentlyEquipped}>
                  <Text style={styles.equippedLabel}>EQUIPADO ATUALMENTE</Text>
                  <ItemCard
                    item={state.equipment[selectedSlot]!}
                    onPress={() => handleUnequip(selectedSlot)}
                  />
                </View>
              )}

              <Text style={styles.sectionTitle}>ITENS DISPÍVEIS</Text>
              
              {filteredItems.length === 0 ? (
                <Text style={styles.noItemsText}>Nenhum item para este slot</Text>
              ) : (
                filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onPress={() => handleEquip(item)}
                  />
                ))
              )}
            </View>
          ) : (
            // Show equipment grid
            <View style={styles.equipmentGrid}>
              {SLOT_CONFIG.map(({ slot, name, icon }) => (
                <EquipmentSlotCard
                  key={slot}
                  slot={slot}
                  name={name}
                  icon={icon}
                  item={state.equipment[slot]}
                  onPress={() => setSelectedSlot(slot)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#12121a",
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e2e",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#7c3aed",
  },
  tabText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#7c3aed",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12121a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  itemIconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#0a0a0f",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1e1e2e",
    marginRight: 12,
  },
  itemIcon: {
    fontSize: 24,
  },
  rarityDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  itemRarity: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  itemStats: {
    flexDirection: "row",
    gap: 8,
  },
  miniStat: {
    color: "#64748b",
    fontSize: 11,
  },
  sellBtn: {
    backgroundColor: "#1e1e2e",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sellText: {
    color: "#fbbf24",
    fontSize: 12,
    fontWeight: "700",
  },
  equipmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  slotCard: {
    width: "23%",
    aspectRatio: 1,
    backgroundColor: "#12121a",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  slotIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#0a0a0f",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1e1e2e",
    marginBottom: 4,
  },
  slotIcon: {
    fontSize: 20,
  },
  equippedDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  slotName: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
  },
  slotItemName: {
    fontSize: 8,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 2,
  },
  slotEmpty: {
    color: "#334155",
    fontSize: 8,
    marginTop: 2,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    color: "#7c3aed",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  currentlyEquipped: {
    marginBottom: 20,
  },
  equippedLabel: {
    color: "#22c55e",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 8,
  },
  noItemsText: {
    color: "#64748b",
    textAlign: "center",
    paddingVertical: 40,
  },
});
