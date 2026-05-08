import { Tabs } from "expo-router";
import { Text, View, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { router } from "expo-router";

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

// Currency icon component
function CurrencyIcon({ icon, value, color }: { icon: string; value: number; color: string }) {
  if (value === 0) return null;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
      <Text style={{ fontSize: 12, marginRight: 2 }}>{icon}</Text>
      <Text style={{ color, fontSize: 11, fontWeight: "700" }}>
        {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
      </Text>
    </View>
  );
}

function Header() {
  const { state, logout } = useGame();
  const race = state.raceId ? getRaceById(state.raceId) : null;

  const handleLogout = async () => {
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
    <View style={{
      backgroundColor: "#12121a",
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingTop: 60,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(124, 58, 237, 0.08)",
    }}>
      {/* Top Row - Player Info */}
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{
            width: 46,
            height: 46,
            borderRadius: 16,
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
          onPress={handleLogout}
          style={{
            padding: 10,
            borderRadius: 12,
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(239, 68, 68, 0.2)",
          }}
        >
          <Text style={{ fontSize: 16 }}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* Currencies Row - Scrollable */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 4,
        }}
      >
        <CurrencyIcon icon="🥉" value={state.currencies.copper} color="#b45309" />
        <CurrencyIcon icon="🏅" value={state.currencies.bronze} color="#92400e" />
        <CurrencyIcon icon="🥈" value={state.currencies.silver} color="#94a3b8" />
        <CurrencyIcon icon="🥇" value={state.currencies.gold} color="#fbbf24" />
        <CurrencyIcon icon="💎" value={state.currencies.diamond} color="#3b82f6" />
        <CurrencyIcon icon="⚜️" value={state.currencies.mithril} color="#22d3ee" />
      </ScrollView>
    </View>
  );
}

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
          name="index"
          options={{
            title: "INÍCIO",
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="adventure"
          options={{
            title: "AVENTURA",
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚔️" focused={focused} />,
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
      </Tabs>
    </View>
  );
}
