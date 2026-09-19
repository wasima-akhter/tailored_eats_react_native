import { router, useLocalSearchParams } from "expo-router";
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

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{
    email: string;
  }>();

  const checkEmailOtp = useAuthStore((state) => state.checkEmailOtp);

  const sendEmailOtp = useAuthStore((state) => state.sendEmailOtp);

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

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

  const handleVerify = async () => {
    if (!email || otp.trim().length !== 6) {
      Alert.alert("Validation", "Please enter the 6-digit OTP.");
      return;
    }

    setIsLoading(true);

    try {
      await checkEmailOtp(email, otp.trim());

      Alert.alert(
        "Email verified",
        "Your email has been verified successfully.",
        [
          {
            text: "Login",
            onPress: () => router.replace("/(auth)/login"),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        "Verification failed",
        error?.response?.data?.message ?? "Invalid OTP.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      return;
    }

    setIsResending(true);

    try {
      await sendEmailOtp(email);

      setOtp("");

      Alert.alert("OTP sent", "A new verification code has been sent.");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ?? "Could not resend OTP.",
      );
    } finally {
      setIsResending(false);
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
        {/* Back */}
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
                <Ionicons name="mail-open-outline" size={29} color="#FFFFFF" />
              </LinearGradient>
            </View>

            <Text style={styles.eyebrow}>EMAIL VERIFICATION</Text>

            <Text style={styles.title}>Verify Your Email</Text>

            <Text style={styles.subtitle}>
              Enter the 6-digit verification code we sent to your email address.
            </Text>
          </View>

          {/* Email */}
          <View style={styles.emailCard}>
            <View style={styles.emailIcon}>
              <Ionicons name="mail-outline" size={19} color={COLORS.primary} />
            </View>

            <View style={styles.emailContent}>
              <Text style={styles.emailLabel}>Verification code sent to</Text>

              <Text
                style={styles.email}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {email}
              </Text>
            </View>
          </View>

          {/* OTP Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enter verification code</Text>

            <Text style={styles.cardSubtitle}>
              The code should contain 6 digits.
            </Text>

            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="000000"
              placeholderTextColor={COLORS.textLight}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              style={styles.input}
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
            />

            <TouchableOpacity
              onPress={handleVerify}
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
                    <Text style={styles.buttonText}>Verify Email</Text>

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

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>

            <TouchableOpacity
              onPress={handleResend}
              disabled={isResending}
              activeOpacity={0.7}
            >
              {isResending ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.resendLink}>Resend OTP</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Security */}
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Keep your verification code private
              </Text>

              <Text style={styles.infoText}>
                Never share your verification code with anyone.
              </Text>
            </View>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 55 : 35,
    paddingBottom: 30,
  },

  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingRight: 12,
    marginBottom: 20,
  },

  backText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 2,
  },

  content: {
    flex: 1,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
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
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    color: COLORS.primary,
    marginBottom: 7,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 9,
  },

  subtitle: {
    maxWidth: 340,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },

  emailCard: {
    backgroundColor: COLORS.purpleLight,
    borderWidth: 1,
    borderColor: COLORS.shineLight,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  emailIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  emailContent: {
    flex: 1,
  },

  emailLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 3,
  },

  email: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.deepPurple,
  },

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
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 5,
  },

  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },

  input: {
    height: 64,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FCFAFF",
    borderRadius: 15,
    paddingHorizontal: 16,
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.deepPurple,
    textAlign: "center",
    letterSpacing: 8,
  },

  buttonContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 18,
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

  buttonDisabled: {
    opacity: 0.65,
  },

  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  resendText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginRight: 5,
  },

  resendLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "800",
  },

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
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.deepPurple,
    marginBottom: 3,
  },

  infoText: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textSecondary,
  },
});
