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

import { useAuthStore } from "../../features/auth/store/auth_store";

const COLORS = {
  deepPurple: "#2E1065",
  darkPurple: "#4C1D95",
  primary: "#7C3AED",
  purple: "#8B5CF6",
  shine: "#C084FC",
  shineLight: "#E9D5FF",
  purpleLight: "#F3E8FF",
  background: "#FAF8FF",
  surface: "#FFFFFF",
  text: "#21152F",
  textSecondary: "#756A82",
  textLight: "#A59BAF",
  border: "#EDE7F3",
};

export default function RegisterScreen() {
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Validation", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation", "Passwords do not match.");
      return;
    }

    try {
      await register(name.trim(), email.trim(), password, confirmPassword);

      Alert.alert(
        "Account created",
        "Your account has been created successfully.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.replace("/(protected)/(tabs)");
            },
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        "Registration failed",
        error?.response?.data?.message ?? "Could not create your account.",
      );
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

            <Text style={styles.title}>Create Account</Text>

            <Text style={styles.subtitle}>
              Start your personalized wellness journey with meals tailored to
              you.
            </Text>
          </View>

          {/* Registration Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Let's get started</Text>

              <Text style={styles.cardSubtitle}>
                Create your account to continue
              </Text>
            </View>

            <Field
              label="Full name"
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              icon="person-outline"
            />

            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />

            <PasswordField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              visible={showPassword}
              onToggle={() => setShowPassword((value) => !value)}
            />

            <PasswordField
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((value) => !value)}
            />

            {/* Create Account */}
            <Pressable
              onPress={handleRegister}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.buttonContainer,
                pressed && !isLoading && styles.buttonPressed,
                isLoading && styles.buttonDisabled,
              ]}
            >
              <LinearGradient
                colors={[COLORS.darkPurple, COLORS.primary, COLORS.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Create Account</Text>

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

          {/* Benefits */}
          <View style={styles.benefitsCard}>
            <View style={styles.benefitIcon}>
              <Ionicons
                name="sparkles-outline"
                size={20}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>
                Your personalized journey starts here
              </Text>

              <Text style={styles.benefitText}>
                Track your meals, goals, progress, and wellness journey in one
                place.
              </Text>
            </View>
          </View>

          {/* Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>

            <TouchableOpacity
              onPress={() => router.replace("/(auth)/login")}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}> Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  icon: keyof typeof Ionicons.glyphMap;
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
  icon,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.purple}
          style={styles.inputIcon}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          style={styles.input}
        />
      </View>
    </View>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
}

function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
  visible,
  onToggle,
}: PasswordFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={COLORS.purple}
          style={styles.inputIcon}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.input, styles.passwordInput]}
        />

        <TouchableOpacity
          onPress={onToggle}
          style={styles.eyeButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
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
    paddingTop: Platform.OS === "ios" ? 55 : 38,
    paddingBottom: 30,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  logoWrapper: {
    marginBottom: 16,
  },

  logo: {
    width: 62,
    height: 62,
    borderRadius: 19,
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
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    color: COLORS.primary,
    marginBottom: 6,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  subtitle: {
    maxWidth: 335,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },

  // Main card
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
    marginBottom: 21,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
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
    fontSize: 15,
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

  buttonContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 5,
  },

  button: {
    height: 55,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
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

  // Benefits
  benefitsCard: {
    marginTop: 16,
    padding: 15,
    borderRadius: 18,
    backgroundColor: COLORS.purpleLight,
    borderWidth: 1,
    borderColor: COLORS.shineLight,
    flexDirection: "row",
    alignItems: "center",
  },

  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  benefitContent: {
    flex: 1,
  },

  benefitTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.deepPurple,
    marginBottom: 3,
  },

  benefitText: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textSecondary,
  },

  // Login
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  loginText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  loginLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "800",
  },
});
