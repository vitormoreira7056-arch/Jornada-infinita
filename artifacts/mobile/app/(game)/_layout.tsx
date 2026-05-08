import { Tabs } from "expo-router";
import { Text, View, TouchableOpacity, Alert, Dimensions } from "react-native";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

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
      borderColor: focused ? "rgba(124, 58, 237, 0.5)" : "transparent",
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
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingTop: 60,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(124, 58, 237, 0.1)",
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
            width: 50,
            height: 50,
            borderRadius: 16,
            backgroundColor: `${race?.color}15` || "rgba(124, 58, 237, 0.1)",
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
              color: "#ffffff", 
              fontWeight: "700", 
              fontSize: 16,
            }}>
              {state.playerName}
            </Text>
            <Text style={{ 
              color: race?.color || "#7c3aed", 
              fontSize: 12,
              fontWeight: "600",
            }}>
              Nv.{state.level} {race?.name}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(251, 191, 36, 0.1)",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "rgba(251, 191, 36, 0.2)",
          }}>
            <Text style={{ fontSize: 14, marginRight: 4 }}>🪙</Text>
            <Text style={{ color: "#fbbf24", fontWeight: "700", fontSize: 13 }}>
              {state.gold.toLocaleString()}
            </Text>
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
      </View>

      {/* Primary Stats Row */}
      <View style={{
        flexDirection: "row",
        backgroundColor: "rgba(10, 10, 15, 0.8)",
        borderRadius: 14,
        padding: 10,
        borderWidth: 1,
        borderColor: "rgba(124, 58, 237, 0.1)",
      }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 8, fontWeight: "700", marginBottom: 3 }}>ATK.F</Text>
          <Text style={{ color: "#f59e0b", fontSize: 14, fontWeight: "700" }}>{stats.atkF}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: "rgba(124, 58, 237, 0.1)" }} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 8, fontWeight: "700", marginBottom: 3 }}>ATK.M</Text>
          <Text style={{ color: "#8b5cf6", fontSize: 14, fontWeight: "700" }}>{stats.atkM}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: "rgba(124, 58, 237, 0.1)" }} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 8, fontWeight: "700", marginBottom: 3 }}>DEF</Text>
          <Text style={{ color: "#3b82f6", fontSize: 14, fontWeight: "700" }}>{stats.def}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: "rgba(124, 58, 237, 0.1)" }} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 8, fontWeight: "700", marginBottom: 3 }}>ARM</Text>
          <Text style={{ color: "#64748b", fontSize: 14, fontWeight: "700" }}>{stats.armor}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: "rgba(124, 58, 237, 0.1)" }} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 8, fontWeight: "700", marginBottom: 3 }}>RES.M</Text>
          <Text style={{ color: "#ec4899", fontSize: 14, fontWeight: "700" }}>{stats.magicRes}</Text>
        </View>
      </View>

      {/* Secondary Stats Row */}
      <View style={{
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
        paddingHorizontal: 4,
      }}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 7, fontWeight: "700" }}>CRIT</Text>
          <Text style={{ color: "#fbbf24", fontSize: 11, fontWeight: "700" }}>{(stats.critRate * 100).toFixed(0)}%</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 7, fontWeight: "700" }}>ESQ</Text>
          <Text style={{ color: "#06b6d4", fontSize: 11, fontWeight: "700" }}>{(stats.dodge * 100).toFixed(0)}%</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 7, fontWeight: "700" }}>SORTE</Text>
          <Text style={{ color: "#22c55e", fontSize: 11, fontWeight: "700" }}>{(stats.luck * 100).toFixed(1)}%</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 7, fontWeight: "700" }}>VEL</Text>
          <Text style={{ color: "#a855f7", fontSize: 11, fontWeight: "700" }}>{stats.atkSpeed.toFixed(1)}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#64748b", fontSize: 7, fontWeight: "700" }}>VIDA</Text>
          <Text style={{ color: "#ef4444", fontSize: 11, fontWeight: "700" }}>{stats.hp}</Text>
        </View>
      </View>
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
            borderTopColor: "rgba(124, 58, 237, 0.1)",
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
