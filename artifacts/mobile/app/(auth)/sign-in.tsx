import { useAuth, useSignIn } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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
} as const;

function BrandHeader() {
  return (
    <View style={styles.brandContainer}>
      <View style={styles.emblemOuter}>
        <View style={styles.emblemInner}>
          <Feather name="shield" size={32} color={C.gold} />
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
      <Feather name="alert-triangle" size={14} color={C.danger} />
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
      <View style={[styles.inputRow, focused && styles.inputRowFocused, !!error && styles.inputRowError]}>
        <Feather name={icon} size={16} color={focused ? C.gold : C.muted} style={styles.inputIcon} />
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? "sentences"}
          autoCorrect={false}
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
  const { signIn } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [needsTrust, setNeedsTrust] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const clearErrors = () => {
    setGlobalError("");
    setFieldErrors({});
  };

  const navigate = () => router.replace("/(tabs)" as never);

  const parseClerkError = (err: unknown): { global: string; fields: Record<string, string> } => {
    const result = { global: "", fields: {} as Record<string, string> };
    if (!err || typeof err !== "object") {
      result.global = "Ocorreu um erro inesperado. Tente novamente.";
      return result;
    }
    const e = err as Record<string, unknown>;

    if (Array.isArray(e.errors)) {
      const clerkErrors = e.errors as Array<{ message: string; meta?: { paramName?: string } }>;
      for (const ce of clerkErrors) {
        const field = ce.meta?.paramName;
        if (field) {
          result.fields[field] = ce.message;
        } else {
          result.global = result.global || ce.message;
        }
      }
      if (!result.global && clerkErrors.length > 0) {
        result.global = clerkErrors[0].message;
      }
    } else if (typeof e.message === "string") {
      result.global = e.message;
    } else {
      result.global = "E-mail ou senha inválidos.";
    }
    return result;
  };

  const handleSignIn = async () => {
    clearErrors();

    if (!email.trim()) {
      setFieldErrors({ identifier: "Por favor insira seu e-mail" });
      return;
    }
    if (!password) {
      setFieldErrors({ password: "Por favor insira sua senha" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn.password({ emailAddress: email.trim(), password });

      if (error) {
        const parsed = parseClerkError(error);
        setGlobalError(parsed.global || "E-mail ou senha incorretos.");
        setFieldErrors(parsed.fields);
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session }) => {
            if (!session?.currentTask) navigate();
          },
        });
      } else if (signIn.status === "needs_client_trust") {
        await signIn.mfa.sendEmailCode();
        setNeedsTrust(true);
      }
    } catch (err: unknown) {
      const parsed = parseClerkError(err);
      setGlobalError(parsed.global || "Erro de conexão. Verifique sua internet.");
      setFieldErrors(parsed.fields);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    clearErrors();
    if (verifyCode.length < 6) return;

    setLoading(true);
    try {
      await signIn.mfa.verifyEmailCode({ code: verifyCode });

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session }) => {
            if (!session?.currentTask) navigate();
          },
        });
      } else {
        setGlobalError("Verificação incompleta. Tente novamente.");
      }
    } catch (err: unknown) {
      setGlobalError("Código inválido ou expirado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (isSignedIn) return null;

  if (needsTrust) {
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <BrandHeader />
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.verifyIconBadge}>
                <Feather name="mail" size={22} color={C.gold} />
              </View>
              <Text style={styles.cardTitle}>Verificar Identidade</Text>
              <Text style={styles.cardSubtitle}>
                Enviamos um código de 6 dígitos para{"\n"}
                <Text style={{ color: C.gold, fontWeight: "600" }}>{email}</Text>
              </Text>
            </View>

            <ErrorBanner message={globalError} />

            <View style={styles.otpWrapper}>
              <TextInput
                style={[styles.otpInput, !!globalError && styles.otpInputError]}
                value={verifyCode}
                onChangeText={(v) => { setVerifyCode(v); clearErrors(); }}
                placeholder="000000"
                placeholderTextColor={C.muted}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
                selectionColor={C.gold}
                editable={!loading}
              />
            </View>

            <Pressable
              style={({ pressed }) => [styles.primaryBtn, (loading || verifyCode.length < 6) && styles.primaryBtnDisabled, pressed && styles.primaryBtnPressed]}
              onPress={handleVerify}
              disabled={loading || verifyCode.length < 6}
            >
              {loading ? (
                <><ActivityIndicator size="small" color={C.bg} /><Text style={styles.primaryBtnText}>Verificando...</Text></>
              ) : (
                <><Feather name="log-in" size={16} color={C.bg} /><Text style={styles.primaryBtnText}>Entrar no Jogo</Text></>
              )}
            </Pressable>

            <Pressable style={styles.secondaryBtn} onPress={() => signIn.mfa.sendEmailCode()} disabled={loading}>
              <Text style={styles.secondaryBtnText}>Não recebeu? <Text style={{ color: C.gold }}>Reenviar código</Text></Text>
            </Pressable>

            <Pressable style={styles.secondaryBtn} onPress={() => { setNeedsTrust(false); clearErrors(); setVerifyCode(""); }} disabled={loading}>
              <Text style={[styles.secondaryBtnText, { color: C.muted }]}>← Voltar ao login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <BrandHeader />
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Bem-vindo de volta, Herói</Text>
            <Text style={styles.cardSubtitle}>Entre para continuar sua aventura</Text>
          </View>

          <ErrorBanner message={globalError} />

          <InputField
            label="E-mail"
            icon="mail"
            value={email}
            onChangeText={(v) => { setEmail(v); clearErrors(); }}
            placeholder="heroi@realm.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={fieldErrors.identifier || fieldErrors.emailAddress || fieldErrors.email_address}
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
            error={fieldErrors.password}
            returnKeyType="go"
            onSubmitEditing={handleSignIn}
            inputRef={passwordRef}
            rightElement={
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={16} color={C.muted} />
              </Pressable>
            }
          />

          <Pressable
            style={({ pressed }) => [styles.primaryBtn, (!email || !password || loading) && styles.primaryBtnDisabled, pressed && styles.primaryBtnPressed]}
            onPress={handleSignIn}
            disabled={!email || !password || loading}
          >
            {loading ? (
              <><ActivityIndicator size="small" color={C.bg} /><Text style={styles.primaryBtnText}>Entrando...</Text></>
            ) : (
              <><Feather name="log-in" size={16} color={C.bg} /><Text style={styles.primaryBtnText}>Entrar no Jogo</Text></>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Novo aventureiro? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable><Text style={styles.footerLink}>Criar Conta</Text></Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  brandContainer: { alignItems: "center", paddingTop: 40, paddingBottom: 32, gap: 8 },
  emblemOuter: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.goldGlow, borderWidth: 1, borderColor: C.goldDim, justifyContent: "center", alignItems: "center", marginBottom: 4 },
  emblemInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.goldDim, justifyContent: "center", alignItems: "center" },
  brandTitle: { fontSize: 30, fontWeight: "800", color: C.gold, letterSpacing: 6, fontFamily: "Inter_700Bold" },
  brandSubtitle: { fontSize: 13, color: C.mutedLight, letterSpacing: 2, fontFamily: "Inter_400Regular" },
  card: { flex: 1, backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 40, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: C.border, gap: 16 },
  cardHeader: { alignItems: "center", marginBottom: 4, gap: 6 },
  verifyIconBadge: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.goldGlow, borderWidth: 1, borderColor: C.goldDim, justifyContent: "center", alignItems: "center", marginBottom: 8 },
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
  secondaryBtn: { alignItems: "center", paddingVertical: 10 },
  secondaryBtnText: { fontSize: 13, color: C.mutedLight, fontFamily: "Inter_400Regular" },
  otpWrapper: { gap: 6, marginVertical: 8 },
  otpInput: { backgroundColor: C.input, borderRadius: 14, borderWidth: 1, borderColor: C.border, height: 80, fontSize: 36, fontWeight: "700", color: C.gold, letterSpacing: 14, textAlign: "center", fontFamily: "Inter_700Bold" },
  otpInputError: { borderColor: C.dangerBorder },
});
