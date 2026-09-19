import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { fontScale } from "@/shared/utils/responsive";
import { useAuthStore } from "../../features/auth/store/auth_store";

console.log("🚀 LOGIN SCREEN LOADED");

const COLORS = {
  deepPurple: "#2E1065",
  darkPurple: "#4C1D95",
  primary: "#7C3AED",
  purple: "#8B5CF6",
  shine: "#C084FC",
  shineLight: "#E9D5FF",
  purpleLight: "#F3E8FF",
  purpleSoft: "#EDE9FE",
  background: "#FAF8FF",
  surface: "#FFFFFF",
  text: "#21152F",
  textSecondary: "#756A82",
  textLight: "#A59BAF",
  border: "#EDE7F3",
  error: "#DC2626",
};

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Validation", "Please enter your email.");
      return;
    }

    if (!password) {
      Alert.alert("Validation", "Please enter your password.");
      return;
    }

    try {
      await login(email.trim(), password);

      console.log("🚀 [LoginScreen] Navigating to main app");

      router.replace("/(protected)/(tabs)");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Something went wrong.";

      Alert.alert("Login failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.shine]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logo}
              >
                <Ionicons name="leaf" size={28} color="#FFFFFF" />
              </LinearGradient>
            </View>

            <Text style={styles.eyebrow}>TAILORED EATS</Text>

            <Text style={styles.title}>Welcome Back</Text>

            <Text style={styles.subtitle}>
              Continue your wellness journey with meals tailored to you.
            </Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Sign in</Text>
              <Text style={styles.cardSubtitle}>
                Enter your details to continue
              </Text>
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.purple}
                  style={styles.inputIcon}
                />

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Password</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.purple}
                  style={styles.inputIcon}
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.textLight}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={[styles.input, styles.passwordInput]}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword((value) => !value)}
                  style={styles.eyeButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              style={styles.forgotButton}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login */}
            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.loginButtonContainer,
                pressed && !isLoading && styles.buttonPressed,
                isLoading && styles.buttonDisabled,
              ]}
            >
              <LinearGradient
                colors={[COLORS.darkPurple, COLORS.primary, COLORS.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Sign In</Text>

                    <View style={styles.arrowCircle}>
                      <Ionicons
                        name="arrow-forward"
                        size={18}
                        color={COLORS.primary}
                      />
                    </View>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          {/* Wellness highlight */}
          <View style={styles.highlightCard}>
            <View style={styles.highlightIcon}>
              <Ionicons
                name="sparkles-outline"
                size={20}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.highlightContent}>
              <Text style={styles.highlightTitle}>Your plan, your way</Text>

              <Text style={styles.highlightText}>
                Personalized meals and progress tracking in one place.
              </Text>
            </View>
          </View>

          {/* Register */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              activeOpacity={0.7}
            >
              <Text style={styles.registerLink}> Create one</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 65 : 45,
    paddingBottom: 30,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoWrapper: {
    marginBottom: 18,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },

  eyebrow: {
    fontSize: fontScale(11),
    fontWeight: "800",
    letterSpacing: 2,
    color: COLORS.primary,
    marginBottom: 7,
  },

  title: {
    fontSize: fontScale(31),
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.6,
  },

  subtitle: {
    maxWidth: 330,
    textAlign: "center",
    fontSize: fontScale(14),
    lineHeight: 21,
    color: COLORS.textSecondary,
  },

  // Login card
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.deepPurple,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },

  cardHeader: {
    marginBottom: 22,
  },

  cardTitle: {
    fontSize: fontScale(21),
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: fontScale(13),
    color: COLORS.textSecondary,
  },

  fieldContainer: {
    marginBottom: 17,
  },

  label: {
    fontSize: fontScale(13),
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },

  inputWrapper: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FCFAFF",
    borderRadius: 14,
    paddingHorizontal: 14,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: fontScale(15),
    color: COLORS.text,
    paddingVertical: 0,
  },

  passwordInput: {
    paddingRight: 4,
  },

  eyeButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -3,
    marginBottom: 20,
  },

  forgotText: {
    color: COLORS.primary,
    fontSize: fontScale(13),
    fontWeight: "700",
  },

  loginButtonContainer: {
    borderRadius: 15,
    overflow: "hidden",
  },

  loginButton: {
    height: 55,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: fontScale(16),
    fontWeight: "800",
    marginRight: 12,
  },

  arrowCircle: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  // Highlight
  highlightCard: {
    marginTop: 16,
    padding: 15,
    borderRadius: 18,
    backgroundColor: COLORS.purpleLight,
    borderWidth: 1,
    borderColor: COLORS.shineLight,
    flexDirection: "row",
    alignItems: "center",
  },

  highlightIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  highlightContent: {
    flex: 1,
  },

  highlightTitle: {
    fontSize: fontScale(13),
    fontWeight: "800",
    color: COLORS.deepPurple,
    marginBottom: 3,
  },

  highlightText: {
    fontSize: fontScale(12),
    lineHeight: 17,
    color: COLORS.textSecondary,
  },

  // Register
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  registerText: {
    fontSize: fontScale(13),
    color: COLORS.textSecondary,
  },

  registerLink: {
    fontSize: fontScale(13),
    color: COLORS.primary,
    fontWeight: "800",
  },

  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
});
