import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated, Dimensions } from "react-native";
import { router } from "expo-router";
import { useGame } from "@/context/GameContext";

type Mode = "login" | "register";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useGame();
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(60))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
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
      {/* Background Effects */}
      <View style={styles.bgGradient} />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />
      
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }] 
          }
        ]}
      >
        {/* Logo Area */}
        <View style={styles.logoArea}>
          <View style={styles.iconContainer}>
            <View style={styles.iconGlowOuter} />
            <View style={styles.iconGlowInner} />
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
              {mode === "login" ? "BEM-VINDO DE VOLTA" : "NOVA CONTA"}
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
                placeholderTextColor="#475569"
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
                placeholderTextColor="#475569"
                secureTextEntry
                maxLength={20}
              />
            </View>
          </View>

          {mode === "register" && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CONFIRMAR</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔐</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirme sua senha"
                  placeholderTextColor="#475569"
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
            activeOpacity={0.85}
          >
            <View style={styles.buttonGradient} />
            <Text style={styles.buttonText}>
              {loading ? "CARREGANDO..." : mode === "login" ? "ENTRAR" : "CRIAR CONTA"}
            </Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleBtn} onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
              <Text style={styles.toggleHighlight}>
                {mode === "login" ? "Cadastrar" : "Entrar"}
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
    backgroundColor: "#020204",
    justifyContent: "center",
    alignItems: "center",
  },
  bgGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#020204",
  },
  bgCircle1: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: "#7c3aed",
    opacity: 0.04,
    top: -150,
    right: -150,
  },
  bgCircle2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "#3b82f6",
    opacity: 0.03,
    bottom: -100,
    left: -100,
  },
  bgCircle3: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#8b5cf6",
    opacity: 0.02,
    top: height * 0.3,
    left: -50,
  },
  content: {
    width: "100%",
    alignItems: "center",
    padding: 24,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconContainer: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  iconGlowOuter: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#7c3aed",
    opacity: 0.15,
    transform: [{ scale: 1.4 }],
  },
  iconGlowInner: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#7c3aed",
    opacity: 0.25,
    transform: [{ scale: 1.1 }],
  },
  iconText: {
    fontSize: 52,
    zIndex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 6,
    textShadowColor: "rgba(124, 58, 237, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 20,
  },
  subtitleLine: {
    width: 50,
    height: 1,
    backgroundColor: "#7c3aed",
    opacity: 0.4,
  },
  subtitle: {
    fontSize: 13,
    color: "#7c3aed",
    letterSpacing: 10,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "rgba(16, 16, 24, 0.95)",
    borderRadius: 28,
    padding: 36,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.12)",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 10,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  modeTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 4,
    marginBottom: 14,
  },
  modeIndicator: {
    flexDirection: "row",
    gap: 10,
  },
  modeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(124, 58, 237, 0.2)",
  },
  modeDotActive: {
    backgroundColor: "#7c3aed",
    width: 28,
  },
  inputContainer: {
    marginBottom: 22,
  },
  inputLabel: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 10,
    letterSpacing: 3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(8, 8, 12, 0.8)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.12)",
    paddingHorizontal: 20,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 16,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#7c3aed",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#8b5cf6",
    opacity: 0.25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 3,
    zIndex: 1,
  },
  buttonArrow: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 12,
    zIndex: 1,
    opacity: 0.8,
  },
  toggleBtn: {
    marginTop: 28,
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
    marginTop: 40,
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: "600",
  },
});
