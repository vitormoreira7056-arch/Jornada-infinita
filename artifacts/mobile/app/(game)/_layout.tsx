import { Tabs } from "expo-router";
import { Text, View, TouchableOpacity, Alert, ScrollView, Modal, StyleSheet } from "react-native";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { router } from "expo-router";
import { useState, useMemo } from "react";

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{
      alignItems: "center",
      justifyContent: "center",
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: focused ? "rgba(124, 58, 237, 0.2)" : "transparent",
      borderWidth: focused ? 1 : 0,
      borderColor: focused ? "rgba(124, 58, 237, 0.4)" : "transparent",
    }}>
      <Text style={{ 
        fontSize: 22, 
        opacity: focused ? 1 : 0.4,
      }}>
        {emoji}
      </Text>
    </View>
  );
}

// Currency display component
function CurrencyDisplay({ icon, value, color }: { icon: string; value: number; color: string }) {
  const formatValue = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
  };

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${color}15`,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: `${color}30`,
      marginRight: 6,
    }}>
      <Text style={{ fontSize: 11, marginRight: 3 }}>{icon}</Text>
      <Text style={{ color, fontSize: 10, fontWeight: "700" }}>
        {formatValue(value)}
      </Text>
    </View>
  );
}

// Menu Modal
function MenuModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { logout } = useGame();

  const handleLogout = async () => {
    onClose();
    Alert.alert(
      "Sair",
      "Deseja sair da conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          }
        },
      ]
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={menuStyles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={menuStyles.container}>
          <View style={menuStyles.header}>
            <Text style={menuStyles.title}>MENU</Text>
          </View>
          
          <TouchableOpacity style={menuStyles.menuItem} onPress={() => { onClose(); /* TODO: Settings */ }}>
            <Text style={menuStyles.menuIcon}>⚙️</Text>
            <Text style={menuStyles.menuText}>Configurações</Text>
          </TouchableOpacity>
          
          <View style={menuStyles.divider} />
          
          <TouchableOpacity style={[menuStyles.menuItem, menuStyles.logoutItem]} onPress={handleLogout}>
            <Text style={menuStyles.menuIcon}>🚪</Text>
            <Text style={[menuStyles.menuText, menuStyles.logoutText]}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// XP Bar Component
function XPBar({ level, exp, getExpNeeded }: { level: number; exp: number; getExpNeeded: (level: number) => number }) {
  const expNeeded = getExpNeeded(level);
  const expProgress = expNeeded === Infinity ? 100 : Math.min(100, (exp / expNeeded) * 100);
  
  return (
    <View style={{
      backgroundColor: "rgba(124, 58, 237, 0.1)",
      borderRadius: 8,
      padding: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "rgba(124, 58, 237, 0.2)",
    }}>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
      }}>
        <Text style={{ color: "#a855f7", fontSize: 10, fontWeight: "700" }}>
          ⭐ NÍVEL {level}
        </Text>
        <Text style={{ color: "#94a3b8", fontSize: 9 }}>
          {exp.toLocaleString()} / {expNeeded === Infinity ? "MAX" : expNeeded.toLocaleString()} XP
        </Text>
      </View>
      <View style={{
        height: 6,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: 3,
        overflow: "hidden",
      }}>
        <View style={{
          height: "100%",
          width: `${expProgress}%`,
          backgroundColor: "#a855f7",
          borderRadius: 3,
        }} />
      </View>
    </View>
  );
}

function Header() {
  const { state, getExpNeeded } = useGame();
  const race = useMemo(() => state.raceId ? getRaceById(state.raceId) : null, [state.raceId]);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{
      backgroundColor: "#12121a",
      paddingHorizontal: 16,
      paddingVertical: 10,
      paddingTop: 60,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(124, 58, 237, 0.08)",
    }}>
      {/* XP Progress Bar */}
      <XPBar level={state.level} exp={state.exp} getExpNeeded={getExpNeeded} />
      
      {/* Top Row - Player Info & Menu */}
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: `${race?.color}12` || "rgba(124, 58, 237, 0.1)",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
            borderWidth: 1.5,
            borderColor: race?.color || "#7c3aed",
          }}>
            <Text style={{ fontSize: 22 }}>{race?.emoji}</Text>
          </View>
          <View>
            <Text style={{ 
              color: "#ffffff", 
              fontWeight: "700", 
              fontSize: 15,
            }}>
              {state.playerName}
            </Text>
            <Text style={{ 
              color: race?.color || "#7c3aed", 
              fontSize: 11,
              fontWeight: "600",
            }}>
              Nv.{state.level} {race?.name}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => setMenuVisible(true)}
          style={{
            padding: 10,
            borderRadius: 12,
            backgroundColor: "rgba(124, 58, 237, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(124, 58, 237, 0.2)",
          }}
        >
          <Text style={{ fontSize: 18 }}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Currencies Row */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 2 }}
      >
        <CurrencyDisplay icon="🥉" value={state.currencies.copper} color="#b45309" />
        <CurrencyDisplay icon="🏅" value={state.currencies.bronze} color="#92400e" />
        <CurrencyDisplay icon="🥈" value={state.currencies.silver} color="#94a3b8" />
        <CurrencyDisplay icon="🥇" value={state.currencies.gold} color="#fbbf24" />
        <CurrencyDisplay icon="💎" value={state.currencies.diamond} color="#3b82f6" />
        <CurrencyDisplay icon="⚜️" value={state.currencies.mithril} color="#22d3ee" />
      </ScrollView>

      <MenuModal visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}

const menuStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2, 2, 4, 0.8)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 110,
    paddingRight: 16,
  },
  container: {
    backgroundColor: "#12121a",
    borderRadius: 16,
    padding: 8,
    minWidth: 180,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124, 58, 237, 0.1)",
    marginBottom: 4,
  },
  title: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuText: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    marginVertical: 4,
  },
  logoutItem: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
  },
  logoutText: {
    color: "#ef4444",
  },
});

// @ts-ignore
export default function GameLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#050508" }}>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#12121a",
            borderTopWidth: 1,
            borderTopColor: "rgba(124, 58, 237, 0.08)",
            height: 85,
            paddingBottom: 20,
            paddingTop: 8,
          },
          tabBarActiveTintColor: "#7c3aed",
          tabBarInactiveTintColor: "#475569",
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "700",
            marginTop: 4,
            letterSpacing: 0.5,
          },
        }}
      >
        <Tabs.Screen
          name="city"
          options={{
            title: "CIDADE",
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏰" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="adventure"
          options={{
            title: "AVENTURA",
            tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="inventory"
          options={{
            title: "MOCHILA",
            tabBarIcon: ({ focused }) => <TabIcon emoji="🎒" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="skills"
          options={{
            title: "SKILLS",
            tabBarIcon: ({ focused }) => <TabIcon emoji="✨" focused={focused} />,
          }}
        />
        {/* Telas ocultas da navegação */}
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="combat" options={{ href: null }} />
        <Tabs.Screen name="equipment" options={{ href: null }} />
        <Tabs.Screen name="biome" options={{ href: null }} />
        <Tabs.Screen name="loot" options={{ href: null }} />
      </Tabs>
    </View>
  );
}
