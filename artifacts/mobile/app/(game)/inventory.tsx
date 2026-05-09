import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useGame, Item, EquipmentSlot } from "@/context/GameContext";
import { TIERS, QUALITIES, TierId, QualityId } from "@/constants/tiers";

const SLOT_CONFIG: { slot: EquipmentSlot; name: string; icon: string }[] = [
  { slot: "head", name: "Cabeça", icon: "⛑️" },
  { slot: "face", name: "Rosto", icon: "🎭" },
  { slot: "necklace", name: "Colar", icon: "📿" },
  { slot: "cape", name: "Capa", icon: "🦸" },
  { slot: "chest", name: "Peitoral", icon: "👕" },
  { slot: "bracelet", name: "Bracelete", icon: "🔗" },
  { slot: "legs", name: "Pernas", icon: "👖" },
  { slot: "feet", name: "Pés", icon: "👢" },
  { slot: "mainHand", name: "Mão Primária", icon: "⚔️" },
  { slot: "offHand", name: "Mão Secundária", icon: "🛡️" },
  { slot: "earrings", name: "Brincos", icon: "💎" },
  { slot: "ring1", name: "Anel 1", icon: "💍" },
  { slot: "ring2", name: "Anel 2", icon: "💍" },
  { slot: "ring3", name: "Anel 3", icon: "💍" },
  { slot: "ring4", name: "Anel 4", icon: "💍" },
];

type Tab = "items" | "equipment";

function ItemCard({
  item,
  onPress,
  onSell,
  showDetails,
}: {
  item: Item;
  onPress?: () => void;
  onSell?: () => void;
  showDetails?: boolean;
}) {
  const tier = TIERS[item.tier as TierId] || TIERS.F;
  const quality = QUALITIES[item.quality as QualityId] || QUALITIES.common;
  
  const hasStats = item.atkF > 0 || item.atkM > 0 || item.def > 0 || item.hp > 0 || 
                   item.armor > 0 || item.magicRes > 0 || item.critRate > 0 || item.dodge > 0;

  return (
    <TouchableOpacity style={styles.itemCard} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.itemIconBox, { borderColor: tier.color }]}>
        <Text style={styles.itemIcon}>{item.icon}</Text>
        <View style={[styles.tierDot, { backgroundColor: tier.color }]} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.tierQualityRow}>
          <Text style={[styles.qualityText, { color: quality.color }]}>{quality.name}</Text>
          <Text style={[styles.tierText, { color: tier.color }]}>{tier.name}</Text>
        </View>
        {showDetails && hasStats && (
          <View style={styles.itemStats}>
            {item.atkF > 0 && <Text style={styles.miniStat}>⚔️{item.atkF}</Text>}
            {item.atkM > 0 && <Text style={styles.miniStat}>🔮{item.atkM}</Text>}
            {item.def > 0 && <Text style={styles.miniStat}>🛡️{item.def}</Text>}
            {item.hp > 0 && <Text style={styles.miniStat}>❤️{item.hp}</Text>}
            {item.armor > 0 && <Text style={styles.miniStat}>🧱{item.armor}</Text>}
            {item.magicRes > 0 && <Text style={styles.miniStat}>✨{item.magicRes}</Text>}
            {item.critRate > 0 && <Text style={styles.miniStat}>🎯{(item.critRate * 100).toFixed(0)}%</Text>}
            {item.dodge > 0 && <Text style={styles.miniStat}>💨{(item.dodge * 100).toFixed(0)}%</Text>}
          </View>
        )}
      </View>
      {onSell && (
        <TouchableOpacity style={styles.sellBtn} onPress={onSell} activeOpacity={0.7}>
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
    <TouchableOpacity style={styles.slotCard} onPress={onPress} activeOpacity={0.8}>
      <View style={[
        styles.slotIconBox,
        item && { borderColor: TIERS[item.tier].color }
      ]}>
        <Text style={styles.slotIcon}>{item ? item.icon : icon}</Text>
        {item && <View style={[styles.equippedDot, { backgroundColor: TIERS[item.tier].color }]} />}
      </View>
      <Text style={styles.slotName}>{name}</Text>
      {item ? (
        <View style={styles.slotItemInfo}>
          <Text style={[styles.slotTierText, { color: TIERS[item.tier].color }]} numberOfLines={1}>
            {TIERS[item.tier].name}
          </Text>
          <Text style={[styles.slotQualityText, { color: QUALITIES[item.quality].color }]} numberOfLines={1}>
            {QUALITIES[item.quality].name}
          </Text>
        </View>
      ) : (
        <Text style={styles.slotEmpty}>Vazio</Text>
      )}
    </TouchableOpacity>
  );
}

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<Tab>("items");
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const { state, equipItem, unequipItem, sellItem, generateItem } = useGame();

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
    ? state.inventory.filter((item) => item.slot === selectedSlot || item.slot === (selectedSlot as any))
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
                showDetails
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
                    showDetails
                  />
                </View>
              )}

              <Text style={styles.sectionTitle}>ITENS DISPONÍVEIS</Text>
              
              {filteredItems.length === 0 ? (
                <Text style={styles.noItemsText}>Nenhum item para este slot</Text>
              ) : (
                filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onPress={() => handleEquip(item)}
                    showDetails
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
    backgroundColor: "#050508",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124, 58, 237, 0.1)",
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
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  itemIconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(124, 58, 237, 0.2)",
    marginRight: 12,
  },
  itemIcon: {
    fontSize: 24,
  },
  tierDot: {
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
  tierQualityRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  qualityText: {
    fontSize: 10,
    fontWeight: "700",
  },
  tierText: {
    fontSize: 10,
    fontWeight: "700",
  },
  itemStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  miniStat: {
    color: "#64748b",
    fontSize: 11,
  },
  sellBtn: {
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
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
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 14,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.1)",
  },
  slotIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(124, 58, 237, 0.2)",
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
  slotItemInfo: {
    alignItems: "center",
  },
  slotTierText: {
    fontSize: 8,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 2,
  },
  slotQualityText: {
    fontSize: 7,
    fontWeight: "600",
    textAlign: "center",
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
