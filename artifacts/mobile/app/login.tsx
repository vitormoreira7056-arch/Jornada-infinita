import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useGame } from "@/context/GameContext";

export default function Login() {
  const [name, setName] = useState("");
  const { setPlayerName } = useGame();

  const handleEnter = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
      router.replace("/race-select");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ Jornada Infinita</Text>
      <Text style={styles.subtitle}>RPG Idle</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Seu Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome"
          placeholderTextColor="#666"
          maxLength={20}
          autoFocus
        />

        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleEnter}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Versão 5.0 - Offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#888",
    marginBottom: 40,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#333",
  },
  label: {
    color: "#888",
    fontSize: 14,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#0f0f0f",
    borderRadius: 8,
    padding: 16,
    color: "#f0f0f0",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#2d5a2f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    color: "#555",
    marginTop: 40,
    fontSize: 12,
  },
});
