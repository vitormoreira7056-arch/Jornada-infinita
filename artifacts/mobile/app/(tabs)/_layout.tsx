import { useAuth } from "@clerk/expo";
import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

// Try to import optional dependencies
let isLiquidGlassAvailable = () => false;
try {
  const glassEffect = require("expo-glass-effect");
  isLiquidGlassAvailable = glassEffect.isLiquidGlassAvailable || (() => false);
} catch (e) {
  // Module not available
}

let NativeTabs: any = null;
let Icon: any = null;
try {
  const nativeTabs = require("expo-router/unstable-native-tabs");
  NativeTabs = nativeTabs.NativeTabs;
  Icon = nativeTabs.Icon;
} catch (e) {
  // Module not available
}

function NativeTabLayout() {
  if (!NativeTabs || !Icon) {
    return <ClassicTabLayout />;
  }
  
  return (
    <NativeTabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Battle",
          tabBarIcon: ({ color, size, focused }: any) => (
            <Icon name={focused ? "sword.fill" : "sword"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="dungeon"
        options={{
          title: "Dungeon",
          tabBarIcon: ({ color, size, focused }: any) => (
            <Icon name={focused ? "flame.fill" : "flame"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="equipment"
        options={{
          title: "Gear",
          tabBarIcon: ({ color, size, focused }: any) => (
            <Icon name={focused ? "backpack.fill" : "backpack"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="skills"
        options={{
          title: "Skills",
          tabBarIcon: ({ color, size, focused }: any) => (
            <Icon name={focused ? "bolt.fill" : "bolt"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="hero"
        options={{
          title: "Hero",
          tabBarIcon: ({ color, size, focused }: any) => (
            <Icon name={focused ? "person.fill" : "person"} color={color} size={size} />
          ),
        }}
      />
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isWeb ? "#0E0E1C" : "transparent",
          borderTopWidth: 0,
          position: isIOS ? "absolute" : "relative",
        },
        tabBarBackground: isIOS
          ? () => (
              <BlurView
                tint={isDark ? "dark" : "light"}
                intensity={80}
                style={StyleSheet.absoluteFill}
              />
            )
          : isWeb
          ? () => (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "#0E0E1C", opacity: 0.95 },
                ]}
              />
            )
          : undefined,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" as const },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Batalha",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="sword" size={size} tintColor={color} />
            ) : (
              <Feather name="crosshair" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="dungeon"
        options={{
          title: "Dungeon",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="flame" size={size} tintColor={color} />
            ) : (
              <Feather name="globe" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="equipment"
        options={{
          title: "Equip",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="backpack" size={size} tintColor={color} />
            ) : (
              <Feather name="box" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="skills"
        options={{
          title: "Skills",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="bolt" size={size} tintColor={color} />
            ) : (
              <Feather name="zap" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="hero"
        options={{
          title: "Herói",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="person" size={size} tintColor={color} />
            ) : (
              <Feather name="user" size={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  let isSignedIn = false;
  let authLoaded = true;
  let authError = false;
  
  try {
    const auth = useAuth();
    isSignedIn = auth.isSignedIn;
    authLoaded = auth.isLoaded;
  } catch (e) {
    // Clerk not available (no key), will fall back to dev mode
    authError = true;
    authLoaded = true;
  }
  
  const { state, isLoading: gameLoading } = useGame();
  const [devMode, setDevMode] = useState(false);
  const [useNativeTabs, setUseNativeTabs] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("__dev_mode_user").then((val) => {
      if (val) setDevMode(true);
    });
  }, []);

  // Check for liquid glass availability safely
  useEffect(() => {
    try {
      setUseNativeTabs(isLiquidGlassAvailable());
    } catch (e) {
      console.warn("Error checking liquid glass availability:", e);
      setUseNativeTabs(false);
    }
  }, []);

  if ((!authLoaded || gameLoading) && !authError) {
    return (
      <View style={{ flex: 1, backgroundColor: "#08080F", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#C8A84B" />
      </View>
    );
  }

  // If auth error (Clerk not available) or dev mode, allow access
  const allowAccess = isSignedIn || devMode || authError;

  if (!allowAccess) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!state.hero.raceId) {
    return <Redirect href="/race-select" />;
  }

  if (useNativeTabs) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}