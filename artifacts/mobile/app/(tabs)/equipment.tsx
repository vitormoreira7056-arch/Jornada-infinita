import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useGame, EquipmentItem } from "@/context/GameContext";
import { EquipSlot, formatNumber } from "@/constants/game";

const SLOT_ICONS: Record<EquipSlot, string> = {
  weapon: "zap",
  armor: "shield",
  ring: "circle",
};

const SLOT_LABELS: Record<EquipSlot, string> = {
  weapon: "Weapon",
  armor: "Armor",
  ring: "Ring",
};

const EQUIP_SLOTS: EquipSlot[] = ["weapon", "armor", "ring"];

export default function EquipmentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, equipItem, unequipSlot, sellItem } = useGame();
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 64;

  const rarityColor = (rarity: string) => {
    return (colors as any)[rarity] ?? colors.mutedForeground;
  };

  const renderEquippedSlot = (slot: EquipSlot) => {
    const item = state.equippedItems[slot];
    return (
      <TouchableOpacity
        key={slot}
        style={[
          styles.equippedSlot,
          {
            backgroundColor: colors.card,
            borderColor: item ? rarityColor(item.rarity) : colors.border,
          },
        ]}
        onPress={() => item && setSelectedItem(item)}
        activeOpacity={item ? 0.8 : 1}
      >
        <View
          style={[
            styles.slotIcon,
            {
              backgroundColor: item
                ? rarityColor(item.rarity) + "22"
                : colors.muted,
            },
          ]}
        >
          <Feather
            name={SLOT_ICONS[slot] as any}
            size={18}
            color={item ? rarityColor(item.rarity) : colors.mutedForeground}
          />
        </View>
        <View style={styles.slotInfo}>
          <Text
            style={[styles.slotLabel, { color: colors.mutedForeground }]}
          >
            {SLOT_LABELS[slot]}
          </Text>
          {item ? (
            <>
              <Text
                style={[styles.itemName, { color: rarityColor(item.rarity) }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <View style={styles.statsMini}>
                {item.atkBonus > 0 && (
                  <Text style={[styles.miniStat, { color: colors.gold }]}>
                    +{item.atkBonus} ATK
                  </Text>
                )}
                {item.hpBonus > 0 && (
                  <Text style={[styles.miniStat, { color: colors.hp }]}>
                    +{item.hpBonus} HP
                  </Text>
                )}
                {item.defBonus > 0 && (
                  <Text style={[styles.miniStat, { color: colors.gem }]}>
                    +{item.defBonus} DEF
                  </Text>
                )}
                {item.critBonus > 0 && (
                  <Text style={[styles.miniStat, { color: colors.crit }]}>
                    +{(item.critBonus * 100).toFixed(1)}% CRIT
                  </Text>
                )}
              </View>
            </>
          ) : (
            <Text style={[styles.emptySlotText, { color: colors.mutedForeground }]}>
              Empty
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderInventoryItem = ({ item }: { item: EquipmentItem }) => {
    const rc = rarityColor(item.rarity);
    return (
      <TouchableOpacity
        style={[
          styles.invItem,
          { backgroundColor: colors.card, borderColor: rc },
        ]}
        onPress={() => setSelectedItem(item)}
        activeOpacity={0.8}
      >
        <View style={[styles.invIcon, { backgroundColor: rc + "22" }]}>
          <Feather
            name={SLOT_ICONS[item.slot] as any}
            size={16}
            color={rc}
          />
        </View>
        <Text style={[styles.invName, { color: rc }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.invRarity, { color: rc + "BB" }]}>
          {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  const isEquippedItem = selectedItem
    ? Object.values(state.equippedItems).some(
        (e) => e?.instanceId === selectedItem.instanceId
      )
    : false;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 12, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Equipment
        </Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          {state.inventory.length}/30 inventory slots
        </Text>
      </View>

      {/* Equipped slots */}
      <View
        style={[
          styles.equippedSection,
          { borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          Equipped
        </Text>
        <View style={styles.equippedList}>
          {EQUIP_SLOTS.map(renderEquippedSlot)}
        </View>
      </View>

      {/* Inventory */}
      <View style={styles.invSection}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.mutedForeground, paddingHorizontal: 16 },
          ]}
        >
          Inventory
        </Text>
        {state.inventory.length === 0 ? (
          <View style={styles.emptyInventory}>
            <Feather name="package" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No items yet — keep fighting!
            </Text>
          </View>
        ) : (
          <FlatList
            data={state.inventory}
            keyExtractor={(item) => item.instanceId}
            renderItem={renderInventoryItem}
            numColumns={3}
            contentContainerStyle={[
              styles.invGrid,
              { paddingBottom: bottomPad },
            ]}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Item detail modal */}
      <Modal
        visible={selectedItem !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          {selectedItem && (
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: colors.card,
                  borderColor: rarityColor(selectedItem.rarity),
                },
              ]}
            >
              <View
                style={[
                  styles.modalIconCircle,
                  {
                    backgroundColor: rarityColor(selectedItem.rarity) + "22",
                  },
                ]}
              >
                <Feather
                  name={SLOT_ICONS[selectedItem.slot] as any}
                  size={32}
                  color={rarityColor(selectedItem.rarity)}
                />
              </View>
              <Text
                style={[
                  styles.modalItemName,
                  { color: rarityColor(selectedItem.rarity) },
                ]}
              >
                {selectedItem.name}
              </Text>
              <Text
                style={[styles.modalSlot, { color: colors.mutedForeground }]}
              >
                {SLOT_LABELS[selectedItem.slot]} •{" "}
                {selectedItem.rarity.charAt(0).toUpperCase() +
                  selectedItem.rarity.slice(1)}
              </Text>

              <View
                style={[
                  styles.modalStats,
                  { backgroundColor: colors.muted, borderColor: colors.border },
                ]}
              >
                {selectedItem.atkBonus > 0 && (
                  <View style={styles.modalStatRow}>
                    <Text style={[styles.modalStatLabel, { color: colors.mutedForeground }]}>
                      ATK Bonus
                    </Text>
                    <Text style={[styles.modalStatVal, { color: colors.gold }]}>
                      +{selectedItem.atkBonus}
                    </Text>
                  </View>
                )}
                {selectedItem.hpBonus > 0 && (
                  <View style={styles.modalStatRow}>
                    <Text style={[styles.modalStatLabel, { color: colors.mutedForeground }]}>
                      HP Bonus
                    </Text>
                    <Text style={[styles.modalStatVal, { color: colors.hp }]}>
                      +{selectedItem.hpBonus}
                    </Text>
                  </View>
                )}
                {selectedItem.defBonus > 0 && (
                  <View style={styles.modalStatRow}>
                    <Text style={[styles.modalStatLabel, { color: colors.mutedForeground }]}>
                      DEF Bonus
                    </Text>
                    <Text style={[styles.modalStatVal, { color: colors.gem }]}>
                      +{selectedItem.defBonus}
                    </Text>
                  </View>
                )}
                {selectedItem.critBonus > 0 && (
                  <View style={styles.modalStatRow}>
                    <Text style={[styles.modalStatLabel, { color: colors.mutedForeground }]}>
                      CRIT Bonus
                    </Text>
                    <Text style={[styles.modalStatVal, { color: colors.crit }]}>
                      +{(selectedItem.critBonus * 100).toFixed(1)}%
                    </Text>
                  </View>
                )}
                <View style={[styles.modalStatRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, marginTop: 4 }]}>
                  <Text style={[styles.modalStatLabel, { color: colors.mutedForeground }]}>
                    Sell Value
                  </Text>
                  <Text style={[styles.modalStatVal, { color: colors.gold }]}>
                    {formatNumber(selectedItem.goldValue)} gold
                  </Text>
                </View>
              </View>

              <View style={styles.modalActions}>
                {isEquippedItem ? (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
                    onPress={() => {
                      unequipSlot(selectedItem.slot);
                      setSelectedItem(null);
                    }}
                  >
                    <Text style={[styles.actionBtnText, { color: colors.foreground }]}>
                      Unequip
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                      onPress={() => {
                        equipItem(selectedItem.instanceId);
                        setSelectedItem(null);
                      }}
                    >
                      <Text style={[styles.actionBtnText, { color: colors.primaryForeground }]}>
                        Equip
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
                      onPress={() => {
                        sellItem(selectedItem.instanceId);
                        setSelectedItem(null);
                      }}
                    >
                      <Text style={[styles.actionBtnText, { color: colors.gold }]}>
                        Sell
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "transparent", borderColor: colors.border }]}
                  onPress={() => setSelectedItem(null)}
                >
                  <Text style={[styles.actionBtnText, { color: colors.mutedForeground }]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  headerSub: { fontSize: 13, marginTop: 2 },
  equippedSection: {
    padding: 12,
    paddingTop: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  sectionTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  equippedList: { gap: 8 },
  equippedSlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  slotIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  slotInfo: { flex: 1, gap: 2 },
  slotLabel: { fontSize: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  itemName: { fontSize: 14, fontWeight: "700" },
  emptySlotText: { fontSize: 13 },
  statsMini: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 2 },
  miniStat: { fontSize: 11, fontWeight: "600" },
  invSection: { flex: 1 },
  invGrid: { padding: 12, gap: 8 },
  invItem: {
    flex: 1,
    margin: 4,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    gap: 5,
    aspectRatio: 0.85,
  },
  invIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  invName: { fontSize: 10, fontWeight: "700", textAlign: "center" },
  invRarity: { fontSize: 9, fontWeight: "600" },
  emptyInventory: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 60,
  },
  emptyText: { fontSize: 14, textAlign: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1.5,
    padding: 24,
    gap: 12,
    alignItems: "center",
  },
  modalIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  modalItemName: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  modalSlot: { fontSize: 13, textAlign: "center" },
  modalStats: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 6,
  },
  modalStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalStatLabel: { fontSize: 13 },
  modalStatVal: { fontSize: 15, fontWeight: "700" },
  modalActions: { flexDirection: "row", gap: 10, width: "100%" },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  actionBtnText: { fontSize: 14, fontWeight: "700" },
});
