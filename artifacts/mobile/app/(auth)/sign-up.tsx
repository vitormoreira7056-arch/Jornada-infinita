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
  dangerDim: "#E8456022",
  success: "#34D399",
  successDim: "#34D39922",
} as const;

function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.brandContainer, compact && styles.brandContainerCompact]}>
      <View style={[styles.emblemOuter, compact && styles.emblemOuterCompact]}>
        <View style={[styles.emblemInner, compact && styles.emblemInnerCompact]}>
          <Feather name="shield" size={compact ? 22 : 32} color={C.gold} />
        </View>
      </View>
      <Text style={[styles.brandTitle, compact && styles.brandTitleCompact]}>RPG IDLE</Text>
      {!compact && <Text style={styles.brandSubtitle}>Your Legend Begins</Text>}
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
        <View style={styles.messageRow}>
          <Feather name="alert-circle" size={12} color={C.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {!error && !!hint && (
        <View style={styles.messageRow}>
          <Feather name="info" size={12} color={C.muted} />
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      )}
    </View>
  );
}

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const loading = fetchStatus === "fetching";

  const navigate = () => router.replace("/(tabs)" as never);

  const handleRegister = async () => {
    setConfirmError("");
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code: verifyCode });
    if (signUp.status === "complete") {
      await signUp.finalize({ navigate: ({ session }) => { if (!session?.currentTask) navigate(); } });
    }
  };

  if (isSignedIn) return null;

  const isVerifying =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  if (isVerifying) {
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
          <BrandHeader compact />
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.verifyIconBadge}>
                <Feather name="mail" size={22} color={C.gold} />
              </View>
              <Text style={styles.cardTitle}>Verify Your Email</Text>
              <Text style={styles.cardSubtitle}>
                We sent a 6-digit code to{"\n"}
                <Text style={{ color: C.gold }}>{email}</Text>
              </Text>
            </View>

            <View style={styles.otpWrapper}>
              <TextInput
                style={[styles.otpInput, !!errors?.fields?.code && styles.otpInputError]}
                value={verifyCode}
                onChangeText={setVerifyCode}
                placeholder="000000"
                placeholderTextColor={C.muted}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
                selectionColor={C.gold}
              />
              {!!errors?.fields?.code && (
                <View style={styles.messageRow}>
                  <Feather name="alert-circle" size={12} color={C.danger} />
                  <Text style={styles.errorText}>{errors.fields.code.message}</Text>
                </View>
              )}
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
                <ActivityIndicator size="small" color={C.bg} />
              ) : (
                <>
                  <Feather name="check-circle" size={16} color={C.bg} />
                  <Text style={styles.primaryBtnText}>Confirm & Begin Quest</Text>
                </>
              )}
            </Pressable>

            <View style={styles.verifyFooter}>
              <Text style={styles.footerText}>Didn't receive it?</Text>
              <Pressable onPress={() => signUp.verifications.sendEmailCode()}>
                <Text style={styles.footerLink}> Resend Code</Text>
              </Pressable>
            </View>

            <View style={styles.successBadge}>
              <Feather name="shield" size={13} color={C.success} />
              <Text style={styles.successText}>Your account is secured with email verification</Text>
            </View>
          </View>

          <View nativeID="clerk-captcha" />
        </ScrollView>
      </KeyboardAvoidingView>
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
            <Text style={styles.cardTitle}>Create Your Account</Text>
            <Text style={styles.cardSubtitle}>Join thousands of heroes on their quest</Text>
          </View>

          <InputField
            label="Email Address"
            icon="mail"
            value={email}
            onChangeText={setEmail}
            placeholder="hero@realm.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors?.fields?.emailAddress?.message}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <InputField
            label="Password"
            icon="lock"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a strong passphrase"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            error={errors?.fields?.password?.message}
            hint="Minimum 8 characters"
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
            inputRef={passwordRef}
            rightElement={
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={16} color={C.muted} />
              </Pressable>
            }
          />

          <InputField
            label="Confirm Password"
            icon="lock"
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setConfirmError(""); }}
            placeholder="Repeat your passphrase"
            secureTextEntry={!showConfirm}
            autoCapitalize="none"
            error={confirmError}
            returnKeyType="go"
            onSubmitEditing={handleRegister}
            inputRef={confirmRef}
            rightElement={
              <Pressable onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                <Feather name={showConfirm ? "eye-off" : "eye"} size={16} color={C.muted} />
              </Pressable>
            }
          />

          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              (!email || !password || !confirmPassword || loading) && styles.primaryBtnDisabled,
              pressed && styles.primaryBtnPressed,
            ]}
            onPress={handleRegister}
            disabled={!email || !password || !confirmPassword || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={C.bg} />
            ) : (
              <>
                <Feather name="user-plus" size={16} color={C.bg} />
                <Text style={styles.primaryBtnText}>Begin Your Quest</Text>
              </>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already a hero? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable>
                <Text style={styles.footerLink}>Sign In</Text>
              </Pressable>
            </Link>
          </View>

          <View style={styles.securityNote}>
            <Feather name="shield" size={12} color={C.muted} />
            <Text style={styles.securityText}>
              Email verification required · Your data is protected
            </Text>
          </View>
        </View>

        <View nativeID="clerk-captcha" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  brandContainer: {
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 28,
    gap: 8,
  },
  brandContainerCompact: {
    paddingTop: 24,
    paddingBottom: 20,
    gap: 6,
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
  emblemOuterCompact: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  emblemInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.goldDim,
    justifyContent: "center",
    alignItems: "center",
  },
  emblemInnerCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: C.gold,
    letterSpacing: 6,
    fontFamily: "Inter_700Bold",
  },
  brandTitleCompact: {
    fontSize: 22,
    letterSpacing: 5,
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
  messageRow: {
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
  hintText: {
    fontSize: 12,
    color: C.muted,
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
  verifyFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
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
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 4,
  },
  securityText: {
    fontSize: 11,
    color: C.muted,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: C.successDim,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: C.success + "44",
    marginTop: 4,
  },
  successText: {
    fontSize: 12,
    color: C.success,
    fontFamily: "Inter_400Regular",
    flex: 1,
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
    height: 80,
    fontSize: 36,
    fontWeight: "700",
    color: C.gold,
    letterSpacing: 14,
    textAlign: "center",
    fontFamily: "Inter_700Bold",
  },
  otpInputError: {
    borderColor: C.dangerDim,
  },
});
