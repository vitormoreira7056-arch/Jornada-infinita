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

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.backBtn}>
          <Text style={styles.backText}>← SAIR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeEmoji}>👋</Text>
          <Text style={styles.welcomeText}>Bem-vindo,</Text>
          <Text style={styles.username}>{state.username}</Text>
        </View>

        <Text style={styles.question}>Como devemos chamar seu aventureiro?</Text>

        <View style={styles.inputCard}>
          <Text style={styles.label}>NOME DO PERSONAGEM</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Aragorn, Gandalf, Legolas..."
            placeholderTextColor="#475569"
            maxLength={20}
            autoFocus
          />
          <View style={styles.inputLine} />
        </View>

        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>CONTINUAR</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  backBtn: {
    alignSelf: "flex-start",
  },
  backText: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  welcomeBox: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  welcomeText: {
    color: "#94a3b8",
    fontSize: 16,
    letterSpacing: 2,
  },
  username: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  question: {
    color: "#cbd5e1",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 28,
  },
  inputCard: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 30,
  },
  label: {
    color: "#7c3aed",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },
  input: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "600",
    paddingVertical: 12,
    textAlign: "center",
  },
  inputLine: {
    height: 2,
    backgroundColor: "#1e1e2e",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    padding: 18,
    width: "100%",
    maxWidth: 400,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#1e1e2e",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 2,
  },
  buttonArrow: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 8,
  },
});
