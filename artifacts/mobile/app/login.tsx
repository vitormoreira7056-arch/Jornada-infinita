import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from "react-native";
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
      {/* Background gradient effect */}
      <View style={styles.bgGradient} />
      
      {/* Logo Area */}
      <View style={styles.logoArea}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>⚔️</Text>
        </View>
        <Text style={styles.title}>JORNADA INFINITA</Text>
        <Text style={styles.subtitle}>RPG IDLE</Text>
        <View style={styles.divider} />
      </View>

      {/* Form Card */}
      <View style={styles.card}>
        <Text style={styles.modeTitle}>
          {mode === "login" ? "BEM-VINDO DE VOLTA" : "CRIAR CONTA"}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>USUÁRIO</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>👤</Text>
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
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>SENHA</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              placeholderTextColor="#666"
              secureTextEntry
              maxLength={20}
            />
          </View>
        </View>

        {mode === "register" && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>CONFIRMAR SENHA</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔐</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirme sua senha"
                placeholderTextColor="#666"
                secureTextEntry
                maxLength={20}
              />
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "AGUARDE..." : mode === "login" ? "ENTRAR" : "CRIAR CONTA"}
          </Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleBtn} onPress={toggleMode}>
          <Text style={styles.toggleText}>
            {mode === "login"
              ? "Não tem conta? "
              : "Já tem conta? "}
            <Text style={styles.toggleHighlight}>
              {mode === "login" ? "Cadastre-se" : "Entre"}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>v2.0 • Offline RPG</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  bgGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#0a0a0f",
    opacity: 0.9,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#7c3aed",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#f8fafc",
    letterSpacing: 3,
    textShadowColor: "#7c3aed",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#7c3aed",
    letterSpacing: 8,
    marginTop: 4,
    fontWeight: "600",
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "#7c3aed",
    marginTop: 16,
    borderRadius: 2,
  },
  card: {
    backgroundColor: "#12121a",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  modeTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a0a0f",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e1e2e",
    paddingHorizontal: 16,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 12,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: "#f8fafc",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#4c1d95",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
  buttonArrow: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 8,
  },
  toggleBtn: {
    marginTop: 20,
    alignItems: "center",
  },
  toggleText: {
    color: "#64748b",
    fontSize: 13,
  },
  toggleHighlight: {
    color: "#7c3aed",
    fontWeight: "700",
  },
  footer: {
    color: "#334155",
    marginTop: 30,
    fontSize: 11,
    letterSpacing: 1,
  },
});
