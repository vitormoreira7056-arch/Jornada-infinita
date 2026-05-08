import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useGame } from "@/context/GameContext";

export default function PlayerSetup() {
  const [name, setName] = useState("");
  const { state, setPlayerName, logout } = useGame();

  const handleContinue = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
      router.replace("/race-select");
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo, {state.username}!</Text>
      <Text style={styles.subtitle}>Como devemos chamar seu aventureiro?</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome do Personagem</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite o nome"
          placeholderTextColor="#666"
          maxLength={20}
          autoFocus
        />

        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
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
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
    fontSize: 12,
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
  logoutBtn: {
    marginTop: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "#f44336",
    fontSize: 14,
  },
});
