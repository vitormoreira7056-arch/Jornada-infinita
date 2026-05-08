import { Tabs } from "expo-router";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { useGame } from "@/context/GameContext";
import { getRaceById } from "@/constants/races";
import { router } from "expo-router";

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>
      {emoji}
    </Text>
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
    <View
      style={{
        backgroundColor: "#1a1a1a",
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 24, marginRight: 8 }}>{race?.emoji}</Text>
        <View>
          <Text style={{ color: "#f0f0f0", fontWeight: "bold" }}>
            {state.playerName}
          </Text>
          <Text style={{ color: "#888", fontSize: 12 }}>
            Nv.{state.level} {race?.name}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: "#FFD700", fontSize: 16, marginRight: 4 }}>🪙</Text>
        <Text style={{ color: "#f0f0f0", fontWeight: "bold", marginRight: 12 }}>
          {state.gold.toLocaleString()}
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ fontSize: 20 }}>🚪</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function GameLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1a1a1a",
            borderTopWidth: 1,
            borderTopColor: "#333",
            height: 64,
          },
          tabBarActiveTintColor: "#4CAF50",
          tabBarInactiveTintColor: "#666",
        }}
      >
        <Tabs.Screen
          name="battle"
          options={{
            title: "Batalha",
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚔️" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="dungeon"
          options={{
            title: "Dungeon",
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏰" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="inventory"
          options={{
            title: "Mochila",
            tabBarIcon: ({ focused }) => <TabIcon emoji="🎒" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: "Loja",
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏪" focused={focused} />,
          }}
        />
      </Tabs>
    </View>
  );
}
