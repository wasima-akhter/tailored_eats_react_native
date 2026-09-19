import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

import { useAuthStore } from "../../features/auth/store/auth_store";

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
};

export default function VerifyForgotPasswordScreen() {
  const { email } = useLocalSearchParams<{
    email: string;
  }>();

  const checkForgotPasswordOtp = useAuthStore(
    (state) => state.checkForgotPasswordOtp,
  );

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 550,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleVerify = async () => {
    if (!email || otp.trim().length !== 6) {
      Alert.alert("Validation", "Please enter the 6-digit OTP.");
      return;
    }

    setIsLoading(true);

    try {
      const activationToken = await checkForgotPasswordOtp(email, otp.trim());

      router.push({
        pathname: "/(auth)/reset-password",
        params: {
          token: activationToken,
        },
      });
    } catch (error: any) {
      Alert.alert(
        "Verification failed",
        error?.response?.data?.message ?? "Invalid OTP.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
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
          {/* Icon */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.darkPurple]}
            style={styles.iconContainer}
          >
            <Ionicons name="shield-checkmark-outline" size={32} color="#fff" />
          </LinearGradient>

          <Text style={styles.eyebrow}>ACCOUNT RECOVERY</Text>

          <Text style={styles.title}>Verify OTP</Text>

          <Text style={styles.subtitle}>
            Enter the 6-digit verification code we sent to your email address.
          </Text>

          {/* Email */}
          <View style={styles.emailCard}>
            <View style={styles.emailIcon}>
              <Ionicons name="mail-outline" size={19} color={COLORS.primary} />
            </View>

            <View style={styles.emailContent}>
              <Text style={styles.emailLabel}>Code sent to</Text>
              <Text
                style={styles.emailText}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {email}
              </Text>
            </View>
          </View>

          {/* OTP Card */}
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Verification Code</Text>

            <TextInput
              value={otp}
              onChangeText={(value) => setOtp(value.replace(/[^0-9]/g, ""))}
              placeholder="000000"
              placeholderTextColor={COLORS.textLight}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              style={styles.otpInput}
            />

            <View style={styles.otpHint}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.otpHintText}>
                Enter the 6-digit code from your email.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleVerify}
              disabled={isLoading}
              activeOpacity={0.85}
              style={styles.buttonWrapper}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.darkPurple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.button, isLoading && styles.buttonDisabled]}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Verify OTP</Text>

                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Security Card */}
          <View style={styles.securityCard}>
            <View style={styles.securityIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.securityContent}>
              <Text style={styles.securityTitle}>Secure verification</Text>

              <Text style={styles.securityText}>
                Your verification code helps us securely confirm your account
                before changing your password.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 58 : 35,
    paddingBottom: 35,
  },

  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    paddingVertical: 6,
    paddingRight: 10,
  },

  backText: {
    marginLeft: 2,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },

  content: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },

  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: COLORS.primary,
    marginBottom: 7,
  },

  title: {
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: COLORS.textSecondary,
    marginBottom: 22,
  },

  emailCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.purpleSoft,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.shineLight,
  },

  emailIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },

  emailContent: {
    flex: 1,
    marginLeft: 12,
  },

  emailLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 2,
  },

  emailText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },

  otpInput: {
    height: 64,
    borderWidth: 1.5,
    borderColor: COLORS.shineLight,
    borderRadius: 16,
    backgroundColor: COLORS.purpleLight,
    paddingHorizontal: 16,
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    letterSpacing: 9,
  },

  otpHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  otpHintText: {
    marginLeft: 6,
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  buttonWrapper: {
    marginTop: 20,
    borderRadius: 15,
    overflow: "hidden",
  },

  button: {
    height: 54,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  buttonDisabled: {
    opacity: 0.75,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginRight: 9,
  },

  securityCard: {
    flexDirection: "row",
    marginTop: 18,
    padding: 16,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  securityIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.purpleLight,
    alignItems: "center",
    justifyContent: "center",
  },

  securityContent: {
    flex: 1,
    marginLeft: 11,
  },

  securityTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 3,
  },

  securityText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
});
