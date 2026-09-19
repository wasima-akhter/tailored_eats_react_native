import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useHomeStore } from "../../../features/home/store/home_store";

import { LinearGradient } from "expo-linear-gradient";

const COLORS = {
  primary: "#7C3AED", // Purple
  primaryDark: "#4C1D95", // Deep purple
  primaryDeep: "#2E1065", // Very deep purple

  purpleLight: "#F3E8FF",
  purpleSoft: "#EDE9FE",

  shine: "#C084FC", // Shiny purple
  shineLight: "#E9D5FF",

  background: "#FAF8FF",
  surface: "#FFFFFF",

  text: "#21152F",
  textSecondary: "#756A82",
  textLight: "#A59BAF",

  border: "#EDE7F3",

  error: "#DC2626",
  errorLight: "#FEF2F2",
};

export default function HomeScreen() {
  const user = useHomeStore((state) => state.user);
  const consistency = useHomeStore((state) => state.consistency);
  const isLoading = useHomeStore((state) => state.isLoading);
  const error = useHomeStore((state) => state.error);
  const loadHome = useHomeStore((state) => state.loadHome);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  useEffect(() => {
    if (!isLoading && user) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, user, fadeAnim, translateY]);

  const handleRefresh = useCallback(() => {
    loadHome();
  }, [loadHome]);

  if (isLoading && !user) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.loaderCircle}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>

        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  const consumedCalories = user?.calorie?.consumedCalorie ?? 0;
  const calorieGoal = user?.calorie?.calorieGoal ?? 0;

  const caloriePercentage =
    calorieGoal > 0 ? Math.min((consumedCalories / calorieGoal) * 100, 100) : 0;

  const consistencyPercentage = consistency?.todayCompleted?.percentage ?? 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={handleRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY }],
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>YOUR DAILY OVERVIEW</Text>

            <Text style={styles.greeting}>
              Hello{user?.name ? `, ${user.name}` : ""} 👋
            </Text>

            <Text style={styles.subtitle}>Let's make today a healthy one.</Text>
          </View>

          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={COLORS.primaryDark} />
          </View>
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorCard}>
            <View style={styles.errorIcon}>
              <Ionicons
                name="alert-circle-outline"
                size={22}
                color={COLORS.error}
              />
            </View>

            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>Something went wrong</Text>

              <Text style={styles.errorText}>{error}</Text>

              <TouchableOpacity
                onPress={loadHome}
                activeOpacity={0.7}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Try again</Text>

                <Ionicons name="arrow-forward" size={15} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Calories */}
        <LinearGradient
          colors={["#2E1065", "#4C1D95", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="flame" size={24} color="#C084FC" />
            </View>

            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Daily Calories</Text>
              <Text style={styles.cardSubtitle}>Your calorie intake today</Text>
            </View>

            <Ionicons name="ellipsis-horizontal" size={20} color="#E9D5FF" />
          </View>

          <View style={styles.calorieRow}>
            <View>
              <Text style={styles.calorieValue}>{consumedCalories}</Text>

              <Text style={styles.calorieUnit}>calories consumed</Text>
            </View>

            <View style={styles.goalContainer}>
              <Text style={styles.goalLabel}>GOAL</Text>

              <Text style={styles.goalValue}>{calorieGoal}</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${caloriePercentage}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressFooter}>
            <Text style={styles.progressText}>
              {Math.round(caloriePercentage)}% of daily goal
            </Text>

            <Ionicons name="trending-up" size={16} color="#E9D5FF" />
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>View details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {/* Consistency */}
          <View style={[styles.statCard, styles.consistencyCard]}>
            <View
              style={[
                styles.statIcon,
                { borderRadius: 12, backgroundColor: COLORS.border },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={23}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.statValue}>{consistencyPercentage}%</Text>

            <Text style={styles.statTitle}>Consistency</Text>

            <Text style={styles.statDescription}>Today's progress</Text>
          </View>

          {/* Today */}
          <View style={[styles.statCard, styles.todayCard]}>
            <View
              style={[
                styles.statIcon,
                { borderRadius: 12, backgroundColor: COLORS.border },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={23}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.statValue}>{consistencyPercentage}%</Text>

            <Text style={styles.statTitle}>Today</Text>

            <Text style={styles.statDescription}>Daily completion</Text>
          </View>
        </View>

        {/* Motivation card */}
        <View style={styles.motivationCard}>
          <View style={styles.motivationIcon}>
            <Ionicons name="leaf" size={25} color={COLORS.primary} />
          </View>

          <View style={styles.motivationContent}>
            <Text style={styles.motivationTitle}>Keep going! 🌱</Text>

            <Text style={styles.motivationText}>
              Small consistent choices can make a big difference.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  loaderCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  /* Header */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: COLORS.primary,
    marginBottom: 6,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: "#D4EAD5",
  },

  /* Error */

  errorCard: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: "#F5CACA",
  },

  errorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  errorContent: {
    flex: 1,
    marginLeft: 12,
  },

  errorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  errorText: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 9,
  },

  retryText: {
    marginRight: 4,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.error,
  },

  /* Main calorie card */

  mainCard: {
    padding: 20,
    borderRadius: 26,
    marginBottom: 28,
    overflow: "hidden",

    shadowColor: "#4C1D95",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  cardSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#D8B4FE",
  },

  calorieValue: {
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1,
    color: "#FFFFFF",
  },

  calorieUnit: {
    marginTop: 2,
    fontSize: 12,
    color: "#D8B4FE",
  },

  goalLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#C084FC",
  },

  goalValue: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  progressTrack: {
    height: 9,
    overflow: "hidden",
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  progressFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#E9D5FF",
  },

  progressText: {
    flex: 1,
    fontSize: 12,
    color: "#E9D5FF",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardHeaderText: {
    flex: 1,
    marginLeft: 12,
  },

  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 18,
  },

  goalContainer: {
    alignItems: "flex-end",
  },

  progressFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  /* Section */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
  },

  seeAll: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },

  /* Stats */

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  statCard: {
    flex: 1,
    minHeight: 175,
    padding: 17,
    borderRadius: 20,
    backgroundColor: COLORS.surface,

    shadowColor: "#17351C",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  consistencyCard: {
    borderTopWidth: 3,
    borderTopColor: COLORS.primary,
  },

  todayCard: {
    borderTopWidth: 3,
    borderTopColor: COLORS.border,
  },

  statIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },

  statValue: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.text,
  },

  statTitle: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  statDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.textLight,
  },

  /* Motivation */

  motivationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 17,
    borderRadius: 20,
    backgroundColor: COLORS.background,
  },

  motivationIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },

  motivationContent: {
    flex: 1,
    marginHorizontal: 12,
  },

  motivationTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },

  motivationText: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textSecondary,
  },
});
