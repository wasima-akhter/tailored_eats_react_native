import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ENV } from "@/core/config/env";
import { router } from "expo-router";
import { useAuthStore } from "../../../features/auth/store/auth_store";
import { useProfileStore } from "../../../features/profile/store/profile_store";

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
  success: "#16A34A",
  error: "#DC2626",
  errorLight: "#FEF2F2",
};

export default function ProfileScreen() {
  console.log("🔥 ProfileScreen rendered");
  const logout = useAuthStore((state) => state.logout);

  const profile = useProfileStore((state) => state.profile);
  const isLoading = useProfileStore((state) => state.isLoading);
  const isUpdating = useProfileStore((state) => state.isUpdating);

  const loadProfile = useProfileStore((state) => state.loadProfile);

  const updateProfile = useProfileStore((state) => state.updateProfile);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [foodVibe, setFoodVibe] = useState("");
  const [mainGoal, setMainGoal] = useState("");
  const [result, setResult] = useState("");
  const [training, setTraining] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    loadProfile();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setAge(profile.age !== undefined ? String(profile.age) : "");
    setGender(profile.gender ?? "");
    setHeight(profile.height !== undefined ? String(profile.height) : "");
    setActivityLevel(profile.activityLevel ?? "");
    setFoodVibe(profile.foodVibe ?? "");
    setMainGoal(profile.mainGoal ?? "");
    setResult(profile.result ?? "");
    setTraining(profile.training ?? "");

    // Set fetched profile image
    setImageUri(profile.profile_image ?? profile.image ?? undefined);
  }, [profile]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateProfile(
        {
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          age: age.trim() ? Number(age) : undefined,
          gender: gender.trim() || undefined,
          height: height.trim() ? Number(height) : undefined,
          activityLevel: activityLevel.trim() || undefined,
          foodVibe: foodVibe.trim() || undefined,
          mainGoal: mainGoal.trim() || undefined,
          result: result.trim() || undefined,
          training: training.trim() || undefined,
        },
        imageUri,
      );

      setImageUri(undefined);

      Alert.alert("Success", "Profile updated successfully.");
    } catch {
      Alert.alert("Error", "Could not update profile.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();

          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const profileImage = profile?.profile_image
    ? `${ENV.API_BASE_URL.replace("/api/v1", "")}${profile.profile_image}`
    : undefined;

  const displayName =
    [firstName, lastName].filter(Boolean).join(" ") || "Your Profile";

  if (isLoading && !profile) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />

        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && !!profile}
            onRefresh={loadProfile}
            tintColor={COLORS.primary}
          />
        }
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim,
              },
            ],
          }}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>ACCOUNT</Text>

              <Text style={styles.title}>Profile</Text>

              <Text style={styles.subtitle}>
                Manage your personal information.
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <Ionicons
                name="person-outline"
                size={24}
                color={COLORS.primary}
              />
            </View>
          </View>

          {/* Profile Hero */}
          <LinearGradient
            colors={[COLORS.deepPurple, COLORS.darkPurple, COLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileHero}
          >
            <View style={styles.heroGlowOne} />
            <View style={styles.heroGlowTwo} />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={pickImage}
              style={styles.avatarWrapper}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {firstName?.charAt(0)?.toUpperCase() || "?"}
                  </Text>
                </View>
              )}

              <View style={styles.cameraButton}>
                <Ionicons name="camera-outline" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <Text style={styles.profileName} numberOfLines={1}>
              {displayName}
            </Text>

            <Text style={styles.profileEmail} numberOfLines={1}>
              {profile?.email ?? "Update your profile"}
            </Text>

            <View style={styles.profileBadge}>
              <Ionicons
                name="sparkles-outline"
                size={13}
                color={COLORS.shineLight}
              />

              <Text style={styles.profileBadgeText}>Wellness journey</Text>
            </View>
          </LinearGradient>

          <Text style={styles.changePhoto}>Tap your photo to change it</Text>

          {/* Personal Information */}
          <SectionHeader
            icon="person-outline"
            title="Personal information"
            subtitle="Your basic profile details"
          />

          <View style={styles.formCard}>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Field
                  label="First name"
                  value={firstName}
                  onChangeText={setFirstName}
                  icon="person-outline"
                />
              </View>

              <View style={styles.halfField}>
                <Field
                  label="Last name"
                  value={lastName}
                  onChangeText={setLastName}
                  icon="person-outline"
                />
              </View>
            </View>

            <Field
              label="Email"
              value={profile?.email ?? ""}
              editable={false}
              icon="mail-outline"
            />

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Field
                  label="Age"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  icon="calendar-outline"
                />
              </View>

              <View style={styles.halfField}>
                <Field
                  label="Gender"
                  value={gender}
                  onChangeText={setGender}
                  icon="people-outline"
                />
              </View>
            </View>

            <Field
              label="Height"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              icon="resize-outline"
            />
          </View>

          {/* Nutrition Preferences */}
          <SectionHeader
            icon="nutrition-outline"
            title="Nutrition & goals"
            subtitle="Personalize your wellness journey"
          />

          <View style={styles.formCard}>
            <Field
              label="Activity level"
              value={activityLevel}
              onChangeText={setActivityLevel}
              icon="fitness-outline"
            />

            <Field
              label="Food vibe"
              value={foodVibe}
              onChangeText={setFoodVibe}
              icon="restaurant-outline"
            />

            <Field
              label="Main goal"
              value={mainGoal}
              onChangeText={setMainGoal}
              icon="flag-outline"
            />

            <Field
              label="Result"
              value={result}
              onChangeText={setResult}
              icon="trophy-outline"
            />

            <Field
              label="Training"
              value={training}
              onChangeText={setTraining}
              icon="barbell-outline"
              last
            />
          </View>

          {/* Save */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleUpdate}
            disabled={isUpdating}
            style={[styles.saveButton, isUpdating && styles.disabledButton]}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveGradient}
            >
              {isUpdating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#FFFFFF"
                  />

                  <Text style={styles.saveText}>Save Changes</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Logout */}
          <View style={styles.accountSection}>
            <Text style={styles.accountTitle}>Account</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <View style={styles.logoutIcon}>
                <Ionicons
                  name="log-out-outline"
                  size={19}
                  color={COLORS.error}
                />
              </View>

              <View style={styles.logoutContent}>
                <Text style={styles.logoutText}>Logout</Text>

                <Text style={styles.logoutSubtext}>
                  Sign out of your account
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
      </View>

      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>

        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  editable?: boolean;
  keyboardType?: "default" | "numeric";
  icon?: keyof typeof Ionicons.glyphMap;
  last?: boolean;
}

function Field({
  label,
  value,
  onChangeText,
  editable = true,
  keyboardType = "default",
  icon,
  last = false,
}: FieldProps) {
  return (
    <View style={[styles.field, last && styles.lastField]}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputContainer,
          !editable && styles.disabledInputContainer,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={17}
            color={editable ? COLORS.primary : COLORS.textLight}
          />
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor={COLORS.textLight}
          style={[styles.input, !editable && styles.disabledInput]}
        />

        {!editable ? (
          <Ionicons
            name="lock-closed-outline"
            size={15}
            color={COLORS.textLight}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 45,
  },

  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  /* Header */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  eyebrow: {
    marginBottom: 5,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: COLORS.primary,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  headerIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: COLORS.purpleLight,
    borderWidth: 1,
    borderColor: COLORS.shineLight,
  },

  /* Profile hero */

  profileHero: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
    shadowColor: COLORS.deepPurple,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  heroGlowOne: {
    position: "absolute",
    width: 170,
    height: 170,
    top: -100,
    right: -50,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  heroGlowTwo: {
    position: "absolute",
    width: 130,
    height: 130,
    bottom: -90,
    left: -50,
    borderRadius: 100,
    backgroundColor: "rgba(192,132,252,0.12)",
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },

  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.8)",
  },

  avatarPlaceholder: {
    width: 94,
    height: 94,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 47,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.8)",
  },

  avatarText: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  cameraButton: {
    position: "absolute",
    right: -2,
    bottom: 0,
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  profileName: {
    maxWidth: "85%",
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  profileEmail: {
    maxWidth: "90%",
    marginTop: 3,
    fontSize: 12,
    color: COLORS.shineLight,
  },

  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  profileBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.shineLight,
  },

  changePhoto: {
    marginTop: 8,
    marginBottom: 27,
    fontSize: 11,
    textAlign: "center",
    color: COLORS.textLight,
  },

  /* Section */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: COLORS.purpleLight,
  },

  sectionHeaderText: {
    marginLeft: 10,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
  },

  sectionSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  /* Form */

  formCard: {
    padding: 16,
    marginBottom: 25,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.deepPurple,
    shadowOpacity: 0.04,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  halfField: {
    flex: 1,
  },

  field: {
    marginBottom: 15,
  },

  lastField: {
    marginBottom: 0,
  },

  label: {
    marginBottom: 7,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    paddingHorizontal: 13,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  disabledInputContainer: {
    backgroundColor: "#F5F2F8",
  },

  input: {
    flex: 1,
    minHeight: 46,
    marginLeft: 9,
    paddingVertical: 0,
    fontSize: 14,
    color: COLORS.text,
  },

  disabledInput: {
    color: COLORS.textLight,
  },

  /* Save */

  saveButton: {
    overflow: "hidden",
    height: 53,
    borderRadius: 16,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  disabledButton: {
    opacity: 0.7,
  },

  saveGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  saveText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  /* Account */

  accountSection: {
    marginTop: 30,
  },

  accountTitle: {
    marginBottom: 11,
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textSecondary,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  logoutIcon: {
    width: 39,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: COLORS.errorLight,
  },

  logoutContent: {
    flex: 1,
    marginLeft: 11,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.error,
  },

  logoutSubtext: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
