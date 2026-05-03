import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { CLASSES, ClassId } from "@/constants/game";

export default function ClassSelectScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectClass } = useGame();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: Platform.OS === "web" ? 67 : insets.top + 16,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.primary }]}>
          Choose Your Class
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Your destiny begins now
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {CLASSES.map((cls) => (
          <TouchableOpacity
            key={cls.id}
            style={[
              styles.classCard,
              {
                backgroundColor: colors.card,
                borderColor: cls.color,
              },
            ]}
            onPress={() => selectClass(cls.id as ClassId)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: cls.color + "22" },
              ]}
            >
              <Feather
                name={cls.featherIcon as any}
                size={36}
                color={cls.color}
              />
            </View>
            <View style={styles.classInfo}>
              <Text style={[styles.className, { color: cls.color }]}>
                {cls.name}
              </Text>
              <Text
                style={[styles.classDesc, { color: colors.mutedForeground }]}
              >
                {cls.description}
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.statPill}>
                  <Text
                    style={[styles.statLabel, { color: colors.mutedForeground }]}
                  >
                    HP
                  </Text>
                  <Text style={[styles.statVal, { color: colors.hp }]}>
                    {cls.baseHp}
                  </Text>
                </View>
                <View style={styles.statPill}>
                  <Text
                    style={[styles.statLabel, { color: colors.mutedForeground }]}
                  >
                    ATK
                  </Text>
                  <Text style={[styles.statVal, { color: colors.gold }]}>
                    {cls.baseAtk}
                  </Text>
                </View>
                <View style={styles.statPill}>
                  <Text
                    style={[styles.statLabel, { color: colors.mutedForeground }]}
                  >
                    DEF
                  </Text>
                  <Text style={[styles.statVal, { color: colors.gem }]}>
                    {cls.baseDef}
                  </Text>
                </View>
                <View style={styles.statPill}>
                  <Text
                    style={[styles.statLabel, { color: colors.mutedForeground }]}
                  >
                    CRIT
                  </Text>
                  <Text style={[styles.statVal, { color: colors.crit }]}>
                    {(cls.baseCritRate * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: 0.5 },
  subtitle: { fontSize: 14, marginTop: 4 },
  scrollContent: { padding: 16, gap: 14 },
  classCard: {
    borderRadius: 14,
    borderWidth: 2,
    padding: 16,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  classInfo: { flex: 1, gap: 6 },
  className: { fontSize: 20, fontWeight: "800" },
  classDesc: { fontSize: 13, lineHeight: 18 },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 4, flexWrap: "wrap" },
  statPill: { flexDirection: "row", gap: 4, alignItems: "center" },
  statLabel: { fontSize: 11, fontWeight: "600" },
  statVal: { fontSize: 13, fontWeight: "800" },
});
