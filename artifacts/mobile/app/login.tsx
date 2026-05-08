import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useGame } from "@/context/GameContext";

type Mode = "login" | "register";

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useGame();

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (mode === "register") {
      if (password !== confirmPassword) {
        Alert.alert("Erro", "As senhas não coincidem");
        return;
      }
      if (password.length < 4) {
        Alert.alert("Erro", "A senha deve ter pelo menos 4 caracteres");
        return;
      }
    }

    setLoading(true);

    try {
      let success: boolean;

      if (mode === "login") {
        success = await login(username.trim(), password);
        if (success) {
          router.replace("/");
        } else {
          Alert.alert("Erro", "Usuário ou senha incorretos");
        }
      } else {
        success = await register(username.trim(), password);
        if (success) {
          Alert.alert("Sucesso", "Conta criada! Agora escolha seu nome de aventureiro.");
          router.replace("/");
        } else {
          Alert.alert("Erro", "Este nome de usuário já existe");
        }
      }
    } catch (e) {
      Alert.alert("Erro", "Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ Jornada Infinita</Text>
      <Text style={styles.subtitle}>RPG Idle</Text>

      <View style={styles.card}>
        <Text style={styles.modeTitle}>
          {mode === "login" ? "Entrar" : "Criar Conta"}
        </Text>

        <Text style={styles.label}>Usuário</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Digite seu usuário"
          placeholderTextColor="#666"
          autoCapitalize="none"
          maxLength={20}
          autoFocus
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Digite sua senha"
          placeholderTextColor="#666"
          secureTextEntry
          maxLength={20}
        />

        {mode === "register" && (
          <>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirme sua senha"
              placeholderTextColor="#666"
              secureTextEntry
              maxLength={20}
            />
          </>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar Conta"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleBtn} onPress={toggleMode}>
          <Text style={styles.toggleText}>
            {mode === "login"
              ? "Não tem conta? Cadastre-se"
              : "Já tem conta? Entre"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Versão 6.0 - Offline</Text>
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
  modeTitle: {
    color: "#f0f0f0",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#2d5a2f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleBtn: {
    marginTop: 16,
    alignItems: "center",
  },
  toggleText: {
    color: "#4CAF50",
    fontSize: 14,
  },
  footer: {
    color: "#555",
    marginTop: 40,
    fontSize: 12,
  },
});
