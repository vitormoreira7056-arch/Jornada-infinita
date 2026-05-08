import { useAuth, useSignUp } from "@clerk/expo";
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
  success: "#34D399",
  successBg: "#34D39918",
  successBorder: "#34D39944",
} as const;

function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.brandContainer, compact && styles.brandContainerCompact]}>
      <View style={[styles.emblemOuter, compact && styles.emblemOuterCompact]}>
        <View style={[styles.emblemInner, compact && styles.emblemInnerCompact]}>
          <Feather name="shield" size={compact ? 20 : 28} color={C.gold} />
        </View>
      </View>
      <Text style={[styles.brandTitle, compact && styles.brandTitleCompact]}>RPG IDLE</Text>
      {!compact && <Text style={styles.brandSubtitle}>Your Legend Begins</Text>}
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
  hint,
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
  hint?: string;
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
      {!error && !!hint && (
        <View style={styles.fieldHint}>
          <Feather name="info" size={12} color={C.muted} />
          <Text style={styles.fieldHintText}>{hint}</Text>
        </View>
      )}
    </View>
  );
}

export default function SignUpScreen() {
  let signUp: ReturnType<typeof useSignUp>['signUp'] | null = null;
  let isSignedIn = false;
  let clerkError = false;
  
  try {
    const signUpResult = useSignUp();
    const authResult = useAuth();
    signUp = signUpResult.signUp;
    isSignedIn = authResult.isSignedIn;
  } catch (e) {
    // Clerk not available (no key or not initialized)
    clerkError = true;
  }
  
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const [step, setStep] = useState<"form" | "verify">("form");

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
      result.global = "Erro ao criar conta. Verifique seus dados.";
    }
    return result;
  };

  const handleRegister = async () => {
    clearErrors();

    if (!username.trim()) {
      setFieldErrors({ username: "Por favor insira seu nick-name" });
      return;
    }
    if (username.trim().length < 3) {
      setFieldErrors({ username: "Nick-name deve ter pelo menos 3 caracteres" });
      return;
    }
    if (!email.trim()) {
      setFieldErrors({ email_address: "Por favor insira seu e-mail" });
      return;
    }
    if (password.length < 8) {
      setFieldErrors({ password: "A senha deve ter pelo menos 8 caracteres" });
      return;
    }
    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "As senhas não coincidem" });
      return;
    }
    
    if (clerkError || !signUp) {
      setGlobalError("Serviço de autenticação indisponível. Use o Modo Desenvolvedor.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp.create({
        username: username.trim(),
        emailAddress: email.trim(),
        password,
      });

      if (error) {
        const parsed = parseClerkError(error);
        setGlobalError(parsed.global);
        setFieldErrors(parsed.fields);
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
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
    
    if (clerkError || !signUp) {
      setGlobalError("Serviço de autenticação indisponível.");
      return;
    }

    setLoading(true);
    try {
      await signUp.attemptEmailAddressVerification({ code: verifyCode });

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session }) => {
            if (!session?.currentTask) navigate();
          },
        });
      } else {
        setGlobalError("Verificação incompleta. Tente novamente.");
      }
    } catch (err: unknown) {
      const parsed = parseClerkError(err);
      setGlobalError(parsed.global || "Código inválido ou expirado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    clearErrors();
    
    if (clerkError || !signUp) {
      setGlobalError("Serviço de autenticação indisponível.");
      return;
    }
    
    setLoading(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err: unknown) {
      setGlobalError("Não foi possível reenviar o código.");
    } finally {
      setLoading(false);
    }
  };

  if (isSignedIn) return null;

  if (step === "verify") {
    return (
      <View style={[styles.root, { paddingTop: insets.top, backgroundColor: C.bg }]}>
        <BrandHeader compact />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.verifyIconBadge}>
                  <Feather name="mail" size={24} color={C.gold} />
                </View>
                <Text style={styles.cardTitle}>Verifique seu E-mail</Text>
                <Text style={styles.cardSubtitle}>
                  Enviamos um código de 6 dígitos para{"\n"}
                  {email}
                </Text>
              </View>

              <ErrorBanner message={globalError} />

              <View style={styles.otpWrapper}>
                <TextInput
                  value={verifyCode}
                  onChangeText={(v) => { setVerifyCode(v); clearErrors(); }}
                  placeholder="000000"
                  placeholderTextColor={C.muted}
                  keyboardType="number-pad"
                  maxLength={6}
                  textAlign="center"
                  selectionColor={C.gold}
                  editable={!loading}
                  style={[styles.otpInput, !!globalError && styles.otpInputError]}
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  (loading || verifyCode.length < 6) && styles.primaryBtnDisabled,
                  pressed && styles.primaryBtnPressed,
                ]}
                onPress={handleVerify}
                disabled={loading || verifyCode.length < 6}
              >
                {loading ? (
                  <>
                    <ActivityIndicator size="small" color={C.bg} />
                    <Text style={styles.primaryBtnText}>Verificando...</Text>
                  </>
                ) : (
                  <>
                    <Feather name="check-circle" size={18} color={C.bg} />
                    <Text style={styles.primaryBtnText}>Confirmar e Entrar no Jogo</Text>
                  </>
                )}
              </Pressable>

              <Pressable onPress={handleResend} disabled={loading} style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>
                  Não recebeu? Reenviar código
                </Text>
              </Pressable>

              <View style={styles.successBadge}>
                <Feather name="shield" size={14} color={C.success} />
                <Text style={styles.successText}>
                  Sua conta está protegida com verificação de e-mail
                </Text>
              </View>

              <Pressable
                onPress={() => { setStep("form"); clearErrors(); setVerifyCode(""); }}
                disabled={loading}
                style={{ marginTop: 12 }}
              >
                <Text style={[styles.footerLink, { fontSize: 13 }]}>← Voltar ao cadastro</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: C.bg }]}>
      <BrandHeader />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Criar Conta</Text>
              <Text style={styles.cardSubtitle}>
                Junte-se a milhares de heróis na sua jornada
              </Text>
            </View>

            <ErrorBanner message={globalError} />

            <InputField
              label="Nick-Name"
              icon="user"
              value={username}
              onChangeText={(v) => { setUsername(v); clearErrors(); }}
              placeholder="Seu nick no jogo"
              autoCapitalize="none"
              error={fieldErrors.username}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <InputField
              label="E-mail"
              icon="mail"
              value={email}
              onChangeText={(v) => { setEmail(v); clearErrors(); }}
              placeholder="heroi@realm.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={fieldErrors.email_address || fieldErrors.emailAddress}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              inputRef={emailRef}
            />

            <InputField
              label="Senha"
              icon="lock"
              value={password}
              onChangeText={(v) => { setPassword(v); clearErrors(); }}
              placeholder="Mínimo 8 caracteres"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              error={fieldErrors.password}
              hint={password.length > 0 && password.length < 8 ? `${password.length}/8 caracteres` : "Mínimo de 8 caracteres"}
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
              inputRef={passwordRef}
              rightElement={
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={C.mutedLight} />
                </Pressable>
              }
            />

            <InputField
              label="Confirmar Senha"
              icon="lock"
              value={confirmPassword}
              onChangeText={(v) => { setConfirmPassword(v); clearErrors(); }}
              placeholder="Repita sua senha"
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
              error={fieldErrors.confirmPassword}
              returnKeyType="go"
              onSubmitEditing={handleRegister}
              inputRef={confirmRef}
              rightElement={
                <Pressable onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                  <Feather name={showConfirm ? "eye-off" : "eye"} size={18} color={C.mutedLight} />
                </Pressable>
              }
            />

            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                (!username || !email || !password || !confirmPassword || loading) && styles.primaryBtnDisabled,
                pressed && styles.primaryBtnPressed,
              ]}
              onPress={handleRegister}
              disabled={!username || !email || !password || !confirmPassword || loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color={C.bg} />
                  <Text style={styles.primaryBtnText}>Criando conta...</Text>
                </>
              ) : (
                <>
                  <Feather name="user-plus" size={18} color={C.bg} />
                  <Text style={styles.primaryBtnText}>Começar Aventura</Text>
                </>
              )}
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text style={styles.footerLink}>Entrar</Text>
                </Pressable>
              </Link>
            </View>

            <View style={styles.securityNote}>
              <Feather name="shield" size={12} color={C.muted} />
              <Text style={styles.securityText}>
                Verificação de e-mail obrigatória · Dados protegidos
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  brandContainer: { alignItems: "center", paddingTop: 36, paddingBottom: 28, gap: 8 },
  brandContainerCompact: { paddingTop: 24, paddingBottom: 20, gap: 6 },
  emblemOuter: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.goldGlow, borderWidth: 1, borderColor: C.goldDim, justifyContent: "center", alignItems: "center", marginBottom: 4 },
  emblemOuterCompact: { width: 56, height: 56, borderRadius: 28 },
  emblemInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.goldDim, justifyContent: "center", alignItems: "center" },
  emblemInnerCompact: { width: 40, height: 40, borderRadius: 20 },
  brandTitle: { fontSize: 30, fontWeight: "800", color: C.gold, letterSpacing: 6, fontFamily: "Inter_700Bold" },
  brandTitleCompact: { fontSize: 22, letterSpacing: 5 },
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
  fieldHint: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  fieldHintText: { fontSize: 12, color: C.muted, fontFamily: "Inter_400Regular", flex: 1 },
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
  securityNote: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingTop: 4 },
  securityText: { fontSize: 11, color: C.muted, fontFamily: "Inter_400Regular", textAlign: "center" },
  successBadge: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: C.successBg, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: C.successBorder, marginTop: 4 },
  successText: { fontSize: 12, color: C.success, fontFamily: "Inter_400Regular", flex: 1 },
  secondaryBtn: { alignItems: "center", paddingVertical: 10 },
  secondaryBtnText: { fontSize: 13, color: C.mutedLight, fontFamily: "Inter_400Regular" },
  otpWrapper: { gap: 6, marginVertical: 8 },
  otpInput: { backgroundColor: C.input, borderRadius: 14, borderWidth: 1, borderColor: C.border, height: 80, fontSize: 36, fontWeight: "700", color: C.gold, letterSpacing: 14, textAlign: "center", fontFamily: "Inter_700Bold" },
  otpInputError: { borderColor: C.dangerBorder },
});