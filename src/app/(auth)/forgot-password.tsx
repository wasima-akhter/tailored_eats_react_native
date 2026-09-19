import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
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

export default function ForgotPasswordScreen() {
  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Validation", "Please enter your email.");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(email.trim());

      router.push({
        pathname: "/(auth)/verify-forgot-password",
        params: {
          email: email.trim(),
        },
      });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ?? "Could not request password reset.",
      );
    } finally {
      setIsLoading(false);
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
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

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
            <View style={styles.iconWrapper}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.shine]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconContainer}
              >
                <Ionicons name="lock-open-outline" size={29} color="#FFFFFF" />
              </LinearGradient>
            </View>

            <Text style={styles.eyebrow}>ACCOUNT RECOVERY</Text>

            <Text style={styles.title}>Forgot Password?</Text>

            <Text style={styles.subtitle}>
              No worries. Enter your email and we'll send you a verification
              code to reset your password.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Reset your password</Text>

            <Text style={styles.cardSubtitle}>
              We'll send a one-time verification code to your email.
            </Text>

            <View style={styles.field}>
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
                  placeholder="john@example.com"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Send OTP */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
              style={[
                styles.buttonContainer,
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
                    <Text style={styles.buttonText}>
                      Send Verification Code
                    </Text>

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
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Your account is secure</Text>

              <Text style={styles.infoText}>
                We'll use your email only to verify your identity and help you
                regain access.
              </Text>
            </View>
          </View>

          {/* Login */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.loginButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back-outline"
              size={17}
              color={COLORS.primary}
            />

            <Text style={styles.loginText}>Back to Login</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 55 : 35,
    paddingBottom: 30,
  },

  // Back
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingRight: 12,
    marginBottom: 20,
  },

  backText: {
    fontSize: fontScale(15),
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 2,
  },

  content: {
    flex: 1,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  iconWrapper: {
    marginBottom: 17,
  },

  iconContainer: {
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
    fontSize: fontScale(30),
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 9,
    letterSpacing: -0.5,
  },

  subtitle: {
    maxWidth: 340,
    textAlign: "center",
    fontSize: fontScale(14),
    lineHeight: 21,
    color: COLORS.textSecondary,
  },

  // Card
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

  cardTitle: {
    fontSize: fontScale(20),
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 5,
  },

  cardSubtitle: {
    fontSize: fontScale(13),
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginBottom: 22,
  },

  field: {
    marginBottom: 18,
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

  // Button
  buttonContainer: {
    borderRadius: 15,
    overflow: "hidden",
  },

  button: {
    minHeight: 55,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: fontScale(15),
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

  buttonDisabled: {
    opacity: 0.65,
  },

  // Info
  infoCard: {
    marginTop: 16,
    padding: 15,
    borderRadius: 18,
    backgroundColor: COLORS.purpleLight,
    borderWidth: 1,
    borderColor: COLORS.shineLight,
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: fontScale(13),
    fontWeight: "800",
    color: COLORS.deepPurple,
    marginBottom: 3,
  },

  infoText: {
    fontSize: fontScale(12),
    lineHeight: 17,
    color: COLORS.textSecondary,
  },

  // Bottom login
  loginButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 8,
  },

  loginText: {
    fontSize: fontScale(14),
    fontWeight: "700",
    color: COLORS.primary,
    marginLeft: 6,
  },
});
