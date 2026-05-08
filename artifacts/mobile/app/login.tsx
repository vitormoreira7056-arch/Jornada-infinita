import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated, Dimensions } from "react-native";
import { router } from "expo-router";
import { useGame } from "@/context/GameContext";

type Mode = "login" | "register";

const { width } = Dimensions.get("window");

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useGame();
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
      {/* Animated Background */}
      <View style={styles.bgGradient} />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        {/* Logo Area */}
        <View style={styles.logoArea}>
          <View style={styles.iconContainer}>
            <View style={styles.iconGlow} />
            <Text style={styles.iconText}>⚔️</Text>
          </View>
          <Text style={styles.title}>JORNADA INFINITA</Text>
          <View style={styles.subtitleContainer}>
            <View style={styles.subtitleLine} />
            <Text style={styles.subtitle}>RPG IDLE</Text>
            <View style={styles.subtitleLine} />
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.modeTitle}>
              {mode === "login" ? "BEM-VINDO DE VOLTA" : "CRIAR CONTA"}
            </Text>
            <View style={styles.modeIndicator}>
              <View style={[styles.modeDot, mode === "login" && styles.modeDotActive]} />
              <View style={[styles.modeDot, mode === "register" && styles.modeDotActive]} />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>USUÁRIO</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Digite seu usuário"
                placeholderTextColor="#64748b"
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
                placeholderTextColor="#64748b"
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
                  placeholderTextColor="#64748b"
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
            activeOpacity={0.8}
          >
            <View style={styles.buttonGlow} />
            <Text style={styles.buttonText}>
              {loading ? "AGUARDE..." : mode === "login" ? "ENTRAR" : "CRIAR CONTA"}
            </Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleBtn} onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
              <Text style={styles.toggleHighlight}>
                {mode === "login" ? "Cadastre-se" : "Entre"}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>v2.0 • Offline RPG</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050508",
    justifyContent: "center",
    alignItems: "center",
  },
  bgGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#050508",
  },
  bgCircle1: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "#7c3aed",
    opacity: 0.08,
    top: -100,
    right: -100,
  },
  bgCircle2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#3b82f6",
    opacity: 0.06,
    bottom: -50,
    left: -50,
  },
  content: {
    width: "100%",
    alignItems: "center",
    padding: 24,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#7c3aed",
    opacity: 0.3,
    transform: [{ scale: 1.2 }],
  },
  iconText: {
    fontSize: 48,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 4,
    textShadowColor: "#7c3aed",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 16,
  },
  subtitleLine: {
    width: 40,
    height: 1,
    backgroundColor: "#7c3aed",
    opacity: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#7c3aed",
    letterSpacing: 8,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "rgba(18, 18, 26, 0.95)",
    borderRadius: 24,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 28,
  },
  modeTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 12,
  },
  modeIndicator: {
    flexDirection: "row",
    gap: 8,
  },
  modeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1e1e2e",
  },
  modeDotActive: {
    backgroundColor: "#7c3aed",
    width: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 10,
    letterSpacing: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.15)",
    paddingHorizontal: 18,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 14,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#8b5cf6",
    opacity: 0.3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
    zIndex: 1,
  },
  buttonArrow: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 10,
    zIndex: 1,
  },
  toggleBtn: {
    marginTop: 24,
    alignItems: "center",
  },
  toggleText: {
    color: "#64748b",
    fontSize: 14,
  },
  toggleHighlight: {
    color: "#7c3aed",
    fontWeight: "800",
  },
  footer: {
    color: "#334155",
    marginTop: 32,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "600",
  },
});
