import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useGame, Item } from "@/context/GameContext";

const RARITY_COLORS = {
  common: "#9E9E9E",
  uncommon: "#4CAF50",
  rare: "#2196F3",
  epic: "#9C27B0",
  legendary: "#FF9800",
};

function ItemCard({
  item,
  equipped,
  onEquip,
  onSell,
}: {
  item: Item;
  equipped?: boolean;
  onEquip?: () => void;
  onSell?: () => void;
}) {
  return (
    <View style={[styles.itemCard, { borderColor: RARITY_COLORS[item.rarity] }]}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={[styles.rarity, { color: RARITY_COLORS[item.rarity] }]}>
          {item.rarity.toUpperCase()}
        </Text>
      </View>

      <View style={styles.itemStats}>
        {item.atk > 0 && (
          <Text style={styles.stat}>
            ⚔️ ATK +{item.atk}
          </Text>
        )}
        {item.hp > 0 && (
          <Text style={styles.stat}>
            ❤️ HP +{item.hp}
          </Text>
        )}
        {item.def > 0 && (
          <Text style={styles.stat}>
            🛡️ DEF +{item.def}
          </Text>
        )}
        {item.crit > 0 && (
          <Text style={styles.stat}>
            💥 CRIT +{Math.round(item.crit * 100)}%
          </Text>
        )}
      </View>

      {!equipped && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.equipBtn} onPress={onEquip}>
            <Text style={styles.equipText}>Equipar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sellBtn} onPress={onSell}>
            <Text style={styles.sellText}>🪙 {item.value}</Text>
          </TouchableOpacity>
        </View>
      )}

      {equipped && (
        <View style={styles.equippedBadge}>
          <Text style={styles.equippedText}>✓ EQUIPADO</Text>
        </View>
      )}
    </View>
  );
}

export default function Inventory() {
  const { state, equipItem, sellItem } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎒 Mochila</Text>
      <Text style={styles.subtitle}>
        {state.inventory.length}/30 itens
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Equipped Items */}
        <Text style={styles.sectionTitle}>Equipado</Text>
        {state.equippedWeapon && (
          <ItemCard item={state.equippedWeapon} equipped />
        )}
        {state.equippedArmor && (
          <ItemCard item={state.equippedArmor} equipped />
        )}
        {state.equippedRing && (
          <ItemCard item={state.equippedRing} equipped />
        )}
        {!state.equippedWeapon && !state.equippedArmor && !state.equippedRing && (
          <Text style={styles.empty}>Nenhum item equipado</Text>
        )}

        {/* Inventory */}
        <Text style={styles.sectionTitle}>Inventário</Text>
        {state.inventory.length === 0 ? (
          <Text style={styles.empty}>Mochila vazia</Text>
        ) : (
          state.inventory.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEquip={() => equipItem(item)}
              onSell={() => sellItem(item.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f0f0f0",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#888",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  empty: {
    color: "#555",
    textAlign: "center",
    padding: 20,
  },
  itemCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemName: {
    color: "#f0f0f0",
    fontSize: 16,
    fontWeight: "bold",
  },
  rarity: {
    fontSize: 10,
    fontWeight: "bold",
  },
  itemStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  stat: {
    color: "#aaa",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  equipBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  equipText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sellBtn: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 80,
  },
  sellText: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  equippedBadge: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  equippedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
