import React from "react";
import { View, StyleSheet } from "react-native";

interface ProgressBarProps {
  current: number;
  max: number;
  color: string;
  bgColor: string;
  height?: number;
}

export default function ProgressBar({
  current,
  max,
  color,
  bgColor,
  height = 8,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.max(0, Math.min(1, current / max)) : 0;
  const borderRadius = height / 2;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor, height, borderRadius },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: `${pct * 100}%`,
            borderRadius,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: "hidden", width: "100%" },
  fill: { height: "100%" },
});
