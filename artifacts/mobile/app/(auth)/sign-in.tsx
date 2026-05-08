import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const C = {
  bg: "#08080F",
  card: "#0E0E1C",
  input: "#13131F",
  border: "#1E1E35",
  borderFocus: "#C8A84B66",
  gold: "#C8A84B",
  goldDim: "#C8A84B55",
  goldGlow: "#C8A84B22",
  text: "#E8E8F0",
  muted: "#6060A0",
  mutedLight: "#9090C0",
  danger: "#E84560",
  dangerBg: "#E8456018",
  dangerBorder: "#E8456044",
  dev: "#34D399",
  devBg: "#34D39918",
  devBorder: "#34D39944",
} as const;

function BrandHeader() {
  return (
    <View style={styles.brandContainer}>
      <View style={styles.emblemOuter}>
        <View style={styles.emblemInner}>
          <Feather name="shield" size={28} color={C.gold} />
        </View>
      </View>
      <Text style={styles.brandTitle}>RPG IDLE</Text>
      <Text style={styles.brandSubtitle}>Enter the Realm</Text>
    </View>
  );
}

function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <View style={styles.errorBanner}>
      <Feather name="alert-circle" size={16} color={C.danger} />
      <Text style={styles.errorBannerText}>{message}</Text>
    </View>
  );
}

function InputField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  rightElement,
  error,
  onSubmitEditing,
  returnKeyType,
  inputRef,
}: {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "email-address" | "default" | "numeric";
  autoCapitalize?: "none" | "sentences";
  rightElement?: React.ReactNode;
  error?: string;
  onSubmitEditing?: () => void;
  returnKeyType?: "done" | "next" | "go";
  inputRef?: React.RefObject<TextInput>;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputRow,
        focused && styles.inputRowFocused,
        !!error && styles.inputRowError,
      ]}>
        <Feather name={icon} size={16} color={C.mutedLight} style={styles.inputIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={styles.textInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          selectionColor={C.gold}
        />
        {rightElement}
      </View>
      {!!error && (
        <View style={styles.fieldError}>
          <Feather name="alert-circle" size={12} color={C.danger} />
          <Text style={styles.fieldErrorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const passwordRef = React.useRef<TextInput>(null);

  const clearErrors = () => {
    setGlobalError("");
  };

  const goToTabs = () => router.replace("/(tabs)");

  const handleDevMode = async () => {
    clearErrors();
    setLoading(true);
    try {
      await AsyncStorage.setItem("__dev_mode_user", JSON.stringify({
        username: "DevHero",
        devMode: true,
        timestamp: Date.now(),
      }));
      goToTabs();
    } catch {
      setGlobalError("Erro ao ativar modo desenvolvedor.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    clearErrors();

    if (!username.trim()) {
      setGlobalError("Por favor insira seu nick-name");
      return;
    }
    if (!password) {
      setGlobalError("Por favor insira sua senha");
      return;
    }

    // For now, just show error - Clerk not configured
    setGlobalError("Serviço de autenticação indisponível. Use o Modo Desenvolvedor.");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: C.bg }]}>
      <BrandHeader />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Bem-vindo de volta, Herói</Text>
              <Text style={styles.cardSubtitle}>Entre para continuar sua aventura</Text>
            </View>

            <ErrorBanner message={globalError} />

            <InputField
              label="Nick-Name"
              icon="user"
              value={username}
              onChangeText={(v) => { setUsername(v); clearErrors(); }}
              placeholder="Seu nick no jogo"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <InputField
              label="Senha"
              icon="lock"
              value={password}
              onChangeText={(v) => { setPassword(v); clearErrors(); }}
              placeholder="Sua senha secreta"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={handleSignIn}
              inputRef={passwordRef}
              rightElement={
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={C.mutedLight} />
                </Pressable>
              }
            />

            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                (!username || !password || loading) && styles.primaryBtnDisabled,
                pressed && styles.primaryBtnPressed,
              ]}
              onPress={handleSignIn}
              disabled={!username || !password || loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color={C.bg} />
                  <Text style={styles.primaryBtnText}>Entrando...</Text>
                </>
              ) : (
                <>
                  <Feather name="log-in" size={18} color={C.bg} />
                  <Text style={styles.primaryBtnText}>Entrar no Jogo</Text>
                </>
              )}
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Modo Desenvolvedor — apenas para testes internos */}
            <Pressable
              style={({ pressed }) => [
                styles.devBtn,
                pressed && styles.devBtnPressed,
              ]}
              onPress={handleDevMode}
              disabled={loading}
            >
              <Feather name="code" size={16} color={C.dev} />
              <Text style={styles.devBtnText}>Modo Desenvolvedor (Offline)</Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Novo aventureiro? </Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text style={styles.footerLink}>Criar Conta</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  brandContainer: { alignItems: "center", paddingTop: 40, paddingBottom: 32, gap: 8 },
  emblemOuter: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.goldGlow, borderWidth: 1, borderColor: C.goldDim, justifyContent: "center", alignItems: "center", marginBottom: 4 },
  emblemInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.goldDim, justifyContent: "center", alignItems: "center" },
  brandTitle: { fontSize: 30, fontWeight: "800", color: C.gold, letterSpacing: 6, fontFamily: "Inter_700Bold" },
  brandSubtitle: { fontSize: 13, color: C.mutedLight, letterSpacing: 2, fontFamily: "Inter_400Regular" },
  card: { flex: 1, backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 40, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: C.border, gap: 16 },
  cardHeader: { alignItems: "center", marginBottom: 4, gap: 6 },
  cardTitle: { fontSize: 22, fontWeight: "700", color: C.text, fontFamily: "Inter_700Bold" },
  cardSubtitle: { fontSize: 13, color: C.muted, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 19 },
  errorBanner: { flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: C.dangerBg, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.dangerBorder },
  errorBannerText: { flex: 1, fontSize: 13, color: C.danger, fontFamily: "Inter_400Regular", lineHeight: 18 },
  fieldWrapper: { gap: 6 },
  label: { fontSize: 12, fontWeight: "600", color: C.mutedLight, letterSpacing: 0.5, fontFamily: "Inter_600SemiBold", textTransform: "uppercase" },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: C.input, borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, height: 52 },
  inputRowFocused: { borderColor: C.borderFocus, backgroundColor: "#161626" },
  inputRowError: { borderColor: C.dangerBorder },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 15, color: C.text, fontFamily: "Inter_400Regular" },
  eyeBtn: { padding: 6, marginLeft: 4 },
  fieldError: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  fieldErrorText: { fontSize: 12, color: C.danger, fontFamily: "Inter_400Regular", flex: 1 },
  primaryBtn: { backgroundColor: C.gold, borderRadius: 14, height: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 },
  primaryBtnDisabled: { opacity: 0.45 },
  primaryBtnPressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
  primaryBtnText: { fontSize: 16, fontWeight: "700", color: C.bg, fontFamily: "Inter_700Bold", letterSpacing: 0.3 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 12, color: C.muted, fontFamily: "Inter_400Regular" },
  footerRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  footerText: { fontSize: 14, color: C.muted, fontFamily: "Inter_400Regular" },
  footerLink: { fontSize: 14, color: C.gold, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  devBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.devBorder,
    backgroundColor: C.devBg,
  },
  devBtnPressed: { opacity: 0.8, transform: [{ scale: 0.985 }] },
  devBtnText: { fontSize: 14, fontWeight: "700", color: C.dev, fontFamily: "Inter_700Bold" },
});
