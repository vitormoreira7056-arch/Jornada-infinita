import { Tabs } from "expo-router";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { router } from "expo-router";

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: focused ? "#7c3aed20" : "transparent",
    }}>
      <Text style={{ 
        fontSize: 22, 
        opacity: focused ? 1 : 0.5,
      }}>
        {emoji}
      </Text>
    </View>
  );
}

function Header() {
  const { state, logout, getTotalStats } = useGame();
  const race = state.raceId ? getRaceById(state.raceId) : null;
  const stats = getTotalStats();

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
      paddingHorizontal: 20,
      paddingVertical: 12,
      paddingTop: 60,
      borderBottomWidth: 1,
      borderBottomColor: "#1e1e2e",
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
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: `${race?.color}20` || "#1e1e2e",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
            borderWidth: 2,
            borderColor: race?.color || "#7c3aed",
          }}>
            <Text style={{ fontSize: 24 }}>{race?.emoji}</Text>
          </View>
          <View>
            <Text style={{ 
              color: "#f8fafc", 
              fontWeight: "700", 
              fontSize: 16,
            }}>
              {state.playerName}
            </Text>
            <Text style={{ 
              color: "#7c3aed", 
              fontSize: 12,
              fontWeight: "600",
            }}>
              Nv.{state.level} {race?.name}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleLogout}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: "#1e1e2e",
          }}
        >
          <Text style={{ fontSize: 18 }}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={{
        flexDirection: "row",
        backgroundColor: "#0a0a0f",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#1e1e2e",
      }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 10, fontWeight: "700", marginBottom: 4 }}>ATK</Text>
          <Text style={{ color: "#f8fafc", fontSize: 14, fontWeight: "700" }}>{stats.atk}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: "#1e1e2e" }} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 10, fontWeight: "700", marginBottom: 4 }}>DEF</Text>
          <Text style={{ color: "#f8fafc", fontSize: 14, fontWeight: "700" }}>{stats.def}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: "#1e1e2e" }} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 10, fontWeight: "700", marginBottom: 4 }}>HP</Text>
          <Text style={{ color: "#f8fafc", fontSize: 14, fontWeight: "700" }}>{stats.hp}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: "#1e1e2e" }} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 10, fontWeight: "700", marginBottom: 4 }}>CRIT</Text>
          <Text style={{ color: "#f8fafc", fontSize: 14, fontWeight: "700" }}>{Math.round(stats.critRate * 100)}%</Text>
        </View>
      </View>

      {/* Gold Row */}
      <View style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 12,
        gap: 16,
      }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 14, marginRight: 4 }}>💎</Text>
          <Text style={{ color: "#3b82f6", fontWeight: "700" }}>{state.diamonds}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 14, marginRight: 4 }}>🪙</Text>
          <Text style={{ color: "#fbbf24", fontWeight: "700" }}>{state.gold.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
}

export default function GameLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0f" }}>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#12121a",
            borderTopWidth: 1,
            borderTopColor: "#1e1e2e",
            height: 80,
            paddingBottom: 20,
            paddingTop: 8,
          },
          tabBarActiveTintColor: "#7c3aed",
          tabBarInactiveTintColor: "#475569",
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
            marginTop: 4,
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
      </Tabs>
    </View>
  );
}
