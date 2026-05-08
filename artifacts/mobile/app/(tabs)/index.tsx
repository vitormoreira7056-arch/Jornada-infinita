import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { formatNumber } from "@/constants/game";

// Currency display component
function CurrencyDisplay({ 
  type, 
  amount 
}: { 
  type: "bronze" | "silver" | "gold" | "diamond" | "mithril";
  amount: number;
}) {
  const colors = {
    bronze: { bg: "#8D6E63", text: "#D7CCC8", icon: "#5D4037" },
    silver: { bg: "#B0BEC5", text: "#ECEFF1", icon: "#546E7A" },
    gold: { bg: "#FFD700", text: "#FFF8E1", icon: "#F57F17" },
    diamond: { bg: "#00E5FF", text: "#E0F7FA", icon: "#006064" },
    mithril: { bg: "#7C4DFF", text: "#EDE7F6", icon: "#311B92" },
  };

  const config = colors[type];
  const iconName = type === "mithril" ? "hexagon" : 
                   type === "diamond" ? "octagon" : 
                   type === "gold" ? "circle" : 
                   type === "silver" ? "triangle" : "square";

  return (
    <View style={[styles.currencyItem, { backgroundColor: config.bg + "30" }]}>
      <Feather name={iconName as any} size={10} color={config.bg} />
      <Text style={[styles.currencyText, { color: config.text }]}>
        {formatNumber(amount)}
      </Text>
    </View>
  );
}

// Player stats panel modal
function PlayerStatsModal({ 
  visible, 
  onClose 
}: { 
  visible: boolean; 
  onClose: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const race = state.hero.raceId ? getRaceById(state.hero.raceId) : null;

  const stats = [
    { label: "Nível", value: state.hero.level, icon: "star", color: "#C8A84B" },
    { label: "HP Máximo", value: state.hero.maxHp + (state.hero.raceId ? 100 : 0), icon: "heart", color: "#EF5350" },
    { label: "Ataque", value: state.hero.baseAtk, icon: "zap", color: "#FF9800" },
    { label: "Defesa", value: state.hero.baseDef, icon: "shield", color: "#78909C" },
    { label: "Taxa Crítica", value: `${(state.hero.critRate * 100).toFixed(1)}%`, icon: "crosshair", color: "#FFD700" },
    { label: "Dano Crítico", value: `${(state.hero.critDmg * 100).toFixed(0)}%`, icon: "award", color: "#FFC107" },
    { label: "Esquiva", value: `${(state.hero.dodge * 100).toFixed(1)}%`, icon: "wind", color: "#26C6DA" },
    { label: "Sorte", value: `${(state.hero.luck * 100).toFixed(3)}%`, icon: "heart", color: "#66BB6A" },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: "#0E0E1A", paddingBottom: insets.bottom + 20 }]}>
          <View style={[styles.modalHandle, { backgroundColor: "#353560" }]} />
          
          <LinearGradient
            colors={[race?.color ? race.color + "30" : "#C8A84B30", "transparent"]}
            style={styles.modalHeaderGradient}
          >
            <View style={styles.modalHeader}>
              <View style={[styles.avatarLarge, { backgroundColor: race?.color ? race.color + "30" : "#C8A84B30", borderColor: race?.color || "#C8A84B" }]}>
                <Text style={styles.avatarEmoji}>{race?.emoji || "👤"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: race?.color || "#C8A84B" }]}>
                  {state.profile?.name || "Aventureiro"}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {race?.name || "Desconhecido"} • {state.profile?.title || "Novato"}
                </Text>
              </View>
              <Pressable onPress={onClose} style={[styles.modalClose, { backgroundColor: "#1A1A30" }]}>
                <Feather name="x" size={20} color="#7070A0" />
              </Pressable>
            </View>
          </LinearGradient>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
            <Text style={styles.sectionTitle}>ATRIBUTOS DO PERSONAGEM</Text>
            {stats.map((stat) => (
              <View key={stat.label} style={[styles.statRow, { backgroundColor: "#0A0A14" }]}>
                <View style={styles.statLeft}>
                  <Feather name={stat.icon as any} size={14} color={stat.color} />
                  <Text style={[styles.statLabel, { color: "#7070A0" }]}>{stat.label}</Text>
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// Menu modal
function MenuModal({ 
  visible, 
  onClose,
  onLogout,
}: { 
  visible: boolean; 
  onClose: () => void;
  onLogout: () => void;
}) {
  const insets = useSafeAreaInsets();

  const menuItems = [
    { icon: "settings", label: "Configurações", onPress: () => {} },
    { icon: "help-circle", label: "Ajuda", onPress: () => {} },
    { icon: "info", label: "Sobre", onPress: () => {} },
    { icon: "log-out", label: "Sair", onPress: onLogout },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.menuOverlay} onPress={onClose}>
        <View style={[styles.menuContainer, { backgroundColor: "#0E0E1A", marginTop: insets.top + 60 }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: "#1A1A30" }
              ]}
              onPress={() => {
                item.onPress();
                onClose();
              }}
            >
              <Feather name={item.icon as any} size={18} color="#C8A84B" />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

// Main menu button
function MainMenuButton({ 
  icon, 
  label, 
  onPress, 
  color = "#C8A84B" 
}: { 
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[color + "40", color + "10"]}
        style={styles.menuButtonGradient}
      >
        <View style={[styles.menuButtonIcon, { backgroundColor: color + "30" }]}>
          <Feather name={icon} size={28} color={color} />
        </View>
        <Text style={[styles.menuButtonLabel, { color }]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, isLoading } = useGame();
  const [showStats, setShowStats] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const race = state.hero.raceId ? getRaceById(state.hero.raceId) : null;
  const topPad = Platform.OS === "web" ? 24 : insets.top;
  const bottomPad = Platform.OS === "web" ? 24 : insets.bottom;

  const handleLogout = async () => {
    try {
      // Clear dev mode
      await AsyncStorage.removeItem("__dev_mode_user");
      // Reload app to go back to login
      router.replace("/(auth)/sign-in");
    } catch (e) {
      console.error("Error logging out:", e);
    }
  };

  // Show loading while game state is loading
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: "#08080F", justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#C8A84B" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: "#08080F" }]}>
      {/* Background gradient */}
      <LinearGradient
        colors={["#0A0A1A", "#08080F", "#0A0A1A"]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Decorative elements */}
      <View style={[styles.glowOrb, { top: "10%", left: "-10%", backgroundColor: race?.color ? race.color + "15" : "#C8A84B15" }]} />
      <View style={[styles.glowOrb, { top: "40%", right: "-15%", backgroundColor: "#7C4DFF15" }]} />
      <View style={[styles.glowOrb, { bottom: "20%", left: "5%", backgroundColor: "#00E5FF10" }]} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        {/* Player info - Left */}
        <TouchableOpacity 
          style={styles.playerInfo}
          onPress={() => setShowStats(true)}
          activeOpacity={0.8}
        >
          <View style={[styles.avatar, { backgroundColor: race?.color ? race.color + "30" : "#C8A84B30", borderColor: race?.color || "#C8A84B" }]}>
            <Text style={styles.avatarEmoji}>{race?.emoji || "👤"}</Text>
          </View>
          <View>
            <Text style={styles.playerName}>{state.profile?.name || "Aventureiro"}</Text>
            <Text style={styles.playerTitle}>{state.profile?.title || "Novato"}</Text>
          </View>
        </TouchableOpacity>

        {/* Menu button - Right */}
        <TouchableOpacity 
          style={styles.menuBtn}
          onPress={() => setShowMenu(true)}
        >
          <Feather name="menu" size={24} color="#C8A84B" />
        </TouchableOpacity>
      </View>

      {/* Currency bar */}
      <View style={styles.currencyBar}>
        <CurrencyDisplay type="bronze" amount={state.resources?.bronze || 0} />
        <CurrencyDisplay type="silver" amount={state.resources?.silver || 0} />
        <CurrencyDisplay type="gold" amount={state.resources?.goldCoins || 0} />
        <CurrencyDisplay type="diamond" amount={state.resources?.diamond || 0} />
        <CurrencyDisplay type="mithril" amount={state.resources?.mithril || 0} />
      </View>

      {/* Main content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: bottomPad + 100 }}
      >
        {/* Welcome section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bem-vindo, {state.profile?.name || "Aventureiro"}</Text>
          <Text style={styles.welcomeSubtitle}>
            Sua jornada como {race?.name || "Aventureiro"} começou
          </Text>
        </View>

        {/* Character preview card */}
        <View style={styles.characterCard}>
          <LinearGradient
            colors={[race?.color ? race.color + "20" : "#C8A84B20", "transparent"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.characterVisual}>
            <Text style={styles.characterEmoji}>{race?.emoji || "👤"}</Text>
            <View style={[styles.levelBadge, { backgroundColor: race?.color || "#C8A84B" }]}>
              <Text style={styles.levelText}>Nv. {state.hero?.level || 1}</Text>
            </View>
          </View>
          <View style={styles.characterInfo}>
            <Text style={[styles.characterRace, { color: race?.color || "#C8A84B" }]}>
              {race?.name || "Aventureiro"}
            </Text>
            <Text style={styles.characterLore} numberOfLines={2}>
              {race?.lore || "Um herói em busca de glória e poder."}
            </Text>
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Feather name="heart" size={16} color="#EF5350" />
            <Text style={styles.quickStatValue}>{state.hero?.maxHp || 100}</Text>
            <Text style={styles.quickStatLabel}>HP</Text>
          </View>
          <View style={styles.quickStat}>
            <Feather name="zap" size={16} color="#FF9800" />
            <Text style={styles.quickStatValue}>{state.hero?.baseAtk || 20}</Text>
            <Text style={styles.quickStatLabel}>ATK</Text>
          </View>
          <View style={styles.quickStat}>
            <Feather name="shield" size={16} color="#78909C" />
            <Text style={styles.quickStatValue}>{state.hero?.baseDef || 10}</Text>
            <Text style={styles.quickStatLabel}>DEF</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom menu buttons */}
      <View style={[styles.bottomMenu, { paddingBottom: bottomPad + 16 }]}>
        <MainMenuButton 
          icon="map" 
          label="Aventura" 
          onPress={() => router.push("/dungeon")}
          color="#C8A84B"
        />
        <MainMenuButton 
          icon="package" 
          label="Mochila" 
          onPress={() => router.push("/equipment")}
          color="#7C4DFF"
        />
        <MainMenuButton 
          icon="award" 
          label="Talentos" 
          onPress={() => router.push("/skills")}
          color="#00E5FF"
        />
        <MainMenuButton 
          icon="shopping-bag" 
          label="Loja" 
          onPress={() => {}}
          color="#F48FB1"
        />
      </View>

      {/* Modals */}
      <PlayerStatsModal visible={showStats} onClose={() => setShowStats(false)} />
      <MenuModal visible={showMenu} onClose={() => setShowMenu(false)} onLogout={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowOrb: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 24,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E8E8F0",
  },
  playerTitle: {
    fontSize: 12,
    color: "#7070A0",
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1A1A30",
    alignItems: "center",
    justifyContent: "center",
  },
  currencyBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexWrap: "wrap",
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currencyText: {
    fontSize: 11,
    fontWeight: "700",
  },
  welcomeSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#E8E8F0",
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#7070A0",
    marginTop: 4,
    textAlign: "center",
  },
  characterCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#252540",
    padding: 20,
    overflow: "hidden",
    backgroundColor: "#0A0A14",
  },
  characterVisual: {
    alignItems: "center",
    marginBottom: 16,
  },
  characterEmoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0A0A14",
  },
  characterInfo: {
    alignItems: "center",
  },
  characterRace: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  characterLore: {
    fontSize: 13,
    color: "#7070A0",
    textAlign: "center",
    lineHeight: 18,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 20,
  },
  quickStat: {
    alignItems: "center",
    backgroundColor: "#0A0A14",
    borderRadius: 16,
    padding: 16,
    minWidth: 80,
    borderWidth: 1,
    borderColor: "#1A1A30",
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#E8E8F0",
    marginTop: 4,
  },
  quickStatLabel: {
    fontSize: 11,
    color: "#7070A0",
    marginTop: 2,
  },
  bottomMenu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "rgba(8, 8, 15, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "#1A1A30",
  },
  menuButton: {
    alignItems: "center",
  },
  menuButtonGradient: {
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#252540",
    minWidth: 72,
  },
  menuButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  menuButtonLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    overflow: "hidden",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  modalHeaderGradient: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#7070A0",
  },
  modalClose: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#505078",
    marginBottom: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1A1A30",
  },
  statLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  // Menu modal
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    right: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#252540",
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  menuItemText: {
    fontSize: 14,
    color: "#E8E8F0",
    fontWeight: "600",
  },
});
