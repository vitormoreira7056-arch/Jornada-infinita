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
  dangerDim: "#E8456022",
  accent: "#252545",
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
      <View
        style={[
          styles.inputRow,
          focused && styles.inputRowFocused,
          !!error && styles.inputRowError,
        ]}
      >
        <Feather
          name={icon}
          size={16}
          color={focused ? C.gold : C.muted}
          style={styles.inputIcon}
        />
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
        <View style={styles.errorRow}>
          <Feather name="alert-circle" size={12} color={C.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

function VerifyStep({
  code,
  setCode,
  onVerify,
  onResend,
  loading,
  error,
}: {
  code: string;
  setCode: (v: string) => void;
  onVerify: () => void;
  onResend: () => void;
  loading: boolean;
  error?: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <BrandHeader />
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.verifyIconBadge}>
            <Feather name="mail" size={22} color={C.gold} />
          </View>
          <Text style={styles.cardTitle}>Check your inbox</Text>
          <Text style={styles.cardSubtitle}>
            We sent a 6-digit verification code to your email
          </Text>
        </View>

        <View style={styles.otpWrapper}>
          <TextInput
            style={[styles.otpInput, !!error && styles.otpInputError]}
            value={code}
            onChangeText={setCode}
            placeholder="000000"
            placeholderTextColor={C.muted}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
            selectionColor={C.gold}
          />
          {!!error && (
            <View style={styles.errorRow}>
              <Feather name="alert-circle" size={12} color={C.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            (loading || code.length < 6) && styles.primaryBtnDisabled,
            pressed && styles.primaryBtnPressed,
          ]}
          onPress={onVerify}
          disabled={loading || code.length < 6}
        >
          {loading ? (
            <ActivityIndicator size="small" color={C.bg} />
          ) : (
            <>
              <Feather name="check-circle" size={16} color={C.bg} />
              <Text style={styles.primaryBtnText}>Verify Code</Text>
            </>
          )}
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={onResend}>
          <Text style={styles.secondaryBtnText}>Didn't receive it? Resend</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  const passwordRef = useRef<TextInput>(null);
  const loading = fetchStatus === "fetching";

  const navigate = () => router.replace("/(tabs)" as never);

  const handleSignIn = async () => {
    const { error } = await signIn.password({ emailAddress: email, password });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: ({ session }) => { if (!session?.currentTask) navigate(); } });
    } else if (signIn.status === "needs_client_trust") {
      await signIn.mfa.sendEmailCode();
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code: verifyCode });
    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: ({ session }) => { if (!session?.currentTask) navigate(); } });
    }
  };

  if (isSignedIn) return null;

  if (signIn.status === "needs_client_trust") {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <VerifyStep
          code={verifyCode}
          setCode={setVerifyCode}
          onVerify={handleVerify}
          onResend={() => signIn.mfa.sendEmailCode()}
          loading={loading}
          error={errors?.fields?.code?.message}
        />
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BrandHeader />

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Welcome Back, Hero</Text>
            <Text style={styles.cardSubtitle}>Sign in to continue your adventure</Text>
          </View>

          <InputField
            label="Email Address"
            icon="mail"
            value={email}
            onChangeText={setEmail}
            placeholder="hero@realm.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors?.fields?.identifier?.message ?? errors?.fields?.emailAddress?.message}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <InputField
            label="Password"
            icon="lock"
            value={password}
            onChangeText={setPassword}
            placeholder="Your secret passphrase"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            error={errors?.fields?.password?.message}
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
            style={({ pressed }) => [
              styles.primaryBtn,
              (!email || !password || loading) && styles.primaryBtnDisabled,
              pressed && styles.primaryBtnPressed,
            ]}
            onPress={handleSignIn}
            disabled={!email || !password || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={C.bg} />
            ) : (
              <>
                <Feather name="log-in" size={16} color={C.bg} />
                <Text style={styles.primaryBtnText}>Enter the Realm</Text>
              </>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New adventurer? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable>
                <Text style={styles.footerLink}>Create Account</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  brandContainer: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 32,
    gap: 8,
  },
  emblemOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.goldGlow,
    borderWidth: 1,
    borderColor: C.goldDim,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  emblemInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.goldDim,
    justifyContent: "center",
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: C.gold,
    letterSpacing: 6,
    fontFamily: "Inter_700Bold",
  },
  brandSubtitle: {
    fontSize: 13,
    color: C.mutedLight,
    letterSpacing: 2,
    fontFamily: "Inter_400Regular",
  },
  card: {
    flex: 1,
    backgroundColor: C.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: C.border,
    gap: 16,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  verifyIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.goldGlow,
    borderWidth: 1,
    borderColor: C.goldDim,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: C.text,
    fontFamily: "Inter_700Bold",
  },
  cardSubtitle: {
    fontSize: 13,
    color: C.muted,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 19,
  },
  fieldWrapper: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: C.mutedLight,
    letterSpacing: 0.5,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.input,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    height: 52,
  },
  inputRowFocused: {
    borderColor: C.borderFocus,
    backgroundColor: "#161626",
  },
  inputRowError: {
    borderColor: C.dangerDim,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: C.text,
    fontFamily: "Inter_400Regular",
  },
  eyeBtn: {
    padding: 6,
    marginLeft: 4,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: C.danger,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  primaryBtn: {
    backgroundColor: C.gold,
    borderRadius: 14,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.bg,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  dividerText: {
    fontSize: 12,
    color: C.muted,
    fontFamily: "Inter_400Regular",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: C.muted,
    fontFamily: "Inter_400Regular",
  },
  footerLink: {
    fontSize: 14,
    color: C.gold,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  secondaryBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  secondaryBtnText: {
    fontSize: 13,
    color: C.mutedLight,
    fontFamily: "Inter_400Regular",
  },
  otpWrapper: {
    gap: 6,
    marginVertical: 8,
  },
  otpInput: {
    backgroundColor: C.input,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    height: 72,
    fontSize: 34,
    fontWeight: "700",
    color: C.gold,
    letterSpacing: 12,
    textAlign: "center",
    fontFamily: "Inter_700Bold",
  },
  otpInputError: {
    borderColor: C.dangerDim,
  },
});
