import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuthStore } from "../../../features/auth/store/auth_store";
import { useGoalsStore } from "../../../features/goals/store/goals_store";

const COLORS = {
  primary: "#7C3AED",
  primaryDark: "#4C1D95",
  primaryDeep: "#2E1065",

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
  successLight: "#DCFCE7",

  error: "#DC2626",
  errorLight: "#FEF2F2",
};

export default function GoalsScreen() {
  const user = useAuthStore((state) => state.user);

  const goals = useGoalsStore((state) => state.goals);
  const progress = useGoalsStore((state) => state.progress);
  const isLoading = useGoalsStore((state) => state.isLoading);
  const error = useGoalsStore((state) => state.error);

  const loadGoals = useGoalsStore((state) => state.loadGoals);
  const loadProgress = useGoalsStore((state) => state.loadProgress);
  const createGoal = useGoalsStore((state) => state.createGoal);
  const completeGoal = useGoalsStore((state) => state.completeGoal);
  const deleteGoal = useGoalsStore((state) => state.deleteGoal);

  const [newGoal, setNewGoal] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadGoals();
    loadProgress();
  }, [loadGoals, loadProgress]);

  useEffect(() => {
    if (!isLoading) {
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
  }, [isLoading, fadeAnim, translateY]);

  useEffect(() => {
    const percentage = progress?.percentage ?? 0;

    Animated.timing(progressAnim, {
      toValue: Math.min(Math.max(percentage, 0), 100),
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress?.percentage, progressAnim]);

  const handleCreateGoal = async () => {
    const title = newGoal.trim();

    if (!title) {
      return;
    }

    const userId = user?.id ?? user?._id;

    if (!userId) {
      Alert.alert("Error", "User information is unavailable.");
      return;
    }

    try {
      await createGoal(userId, title);
      setNewGoal("");
    } catch {
      Alert.alert("Error", "Could not create goal.");
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      await completeGoal(goalId);
    } catch {
      Alert.alert("Error", "Could not complete goal.");
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert("Delete goal", "Are you sure you want to delete this goal?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteGoal(goalId);
          } catch {
            Alert.alert("Error", "Could not delete goal.");
          }
        },
      },
    ]);
  };

  if (isLoading && goals.length === 0) {
    return (
      <View style={styles.loader}>
        <View style={styles.loaderCircle}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>

        <Text style={styles.loadingText}>Loading your goals...</Text>
      </View>
    );
  }

  const percentage = progress?.percentage ?? 0;
  const completedGoals = progress?.completedGoals ?? 0;
  const totalGoals = progress?.totalGoals ?? goals.length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={async () => {
            await Promise.all([loadGoals(), loadProgress()]);
          }}
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
            <Text style={styles.eyebrow}>YOUR JOURNEY</Text>

            <Text style={styles.title}>Goals</Text>

            <Text style={styles.subtitle}>Small steps. Big progress.</Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="trophy" size={25} color={COLORS.primary} />
          </View>
        </View>

        {/* Progress Card */}

        <LinearGradient
          colors={[COLORS.primaryDeep, COLORS.primaryDark, COLORS.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <View style={styles.shineCircleOne} />
          <View style={styles.shineCircleTwo} />

          <View style={styles.progressHeader}>
            <View style={styles.progressIcon}>
              <Ionicons
                name="stats-chart"
                size={21}
                color={COLORS.shineLight}
              />
            </View>

            <View style={styles.progressHeaderText}>
              <Text style={styles.progressTitle}>Goal progress</Text>

              <Text style={styles.progressSubtitle}>
                Keep building your consistency
              </Text>
            </View>
          </View>

          <View style={styles.progressMain}>
            <View>
              <Text style={styles.progressValue}>{percentage}%</Text>

              <Text style={styles.progressCompleted}>
                {completedGoals} of {totalGoals} goals completed
              </Text>
            </View>

            <View style={styles.progressCircle}>
              <Ionicons
                name={percentage >= 100 ? "checkmark" : "trending-up"}
                size={25}
                color="#FFFFFF"
              />
            </View>
          </View>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>

          <View style={styles.progressFooter}>
            <Text style={styles.progressFooterText}>
              {percentage >= 100
                ? "All goals completed! 🎉"
                : "You're making progress!"}
            </Text>

            <Ionicons name="sparkles" size={16} color={COLORS.shineLight} />
          </View>
        </LinearGradient>

        {/* Add Goal */}

        <View style={styles.addCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </View>

            <View>
              <Text style={styles.sectionTitle}>Add a goal</Text>

              <Text style={styles.sectionSubtitle}>
                What do you want to achieve today?
              </Text>
            </View>
          </View>

          <TextInput
            value={newGoal}
            onChangeText={setNewGoal}
            placeholder="e.g. Drink 3 liters of water"
            placeholderTextColor={COLORS.textLight}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={handleCreateGoal}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateGoal}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addButtonGradient}
            >
              <Ionicons name="add-circle-outline" size={19} color="#FFFFFF" />

              <Text style={styles.addButtonText}>Add Goal</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Error */}

        {error ? (
          <View style={styles.errorCard}>
            <View style={styles.errorIcon}>
              <Ionicons
                name="alert-circle-outline"
                size={21}
                color={COLORS.error}
              />
            </View>

            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>Something went wrong</Text>

              <Text style={styles.errorText}>{error}</Text>
            </View>
          </View>
        ) : null}

        {/* Goals Header */}

        <View style={styles.goalsHeader}>
          <View>
            <Text style={styles.goalsTitle}>Your goals</Text>

            <Text style={styles.goalsSubtitle}>
              Stay consistent with your daily habits
            </Text>
          </View>

          <View style={styles.goalCount}>
            <Text style={styles.goalCountText}>{goals.length}</Text>
          </View>
        </View>

        {/* Goals */}

        {goals.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="flag-outline" size={32} color={COLORS.primary} />
            </View>

            <Text style={styles.emptyTitle}>No goals yet</Text>

            <Text style={styles.emptyText}>
              Create your first personal goal and start your journey.
            </Text>
          </View>
        ) : (
          goals.map((goal) => (
            <View
              key={goal._id}
              style={[
                styles.goalCard,
                goal.isCompleted && styles.completedGoalCard,
              ]}
            >
              <View
                style={[
                  styles.goalStatusIcon,
                  goal.isCompleted && styles.completedGoalIcon,
                ]}
              >
                <Ionicons
                  name={goal.isCompleted ? "checkmark" : "flag-outline"}
                  size={20}
                  color={goal.isCompleted ? COLORS.success : COLORS.primary}
                />
              </View>

              <View style={styles.goalContent}>
                <Text
                  style={[
                    styles.goalTitle,
                    goal.isCompleted && styles.completedGoalTitle,
                  ]}
                >
                  {goal.title}
                </Text>

                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      goal.isCompleted && styles.completedStatusDot,
                    ]}
                  />

                  <Text
                    style={[
                      styles.goalStatus,
                      goal.isCompleted && styles.completedStatus,
                    ]}
                  >
                    {goal.isCompleted ? "Completed" : "In progress"}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                {!goal.isCompleted ? (
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleCompleteGoal(goal._id)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />

                    <Text style={styles.completeButtonText}>Done</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.completedBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={COLORS.success}
                    />
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => handleDeleteGoal(goal._id)}
                  activeOpacity={0.7}
                  style={styles.deleteButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={17}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Bottom motivation */}

        {goals.length > 0 ? (
          <View style={styles.motivationCard}>
            <View style={styles.motivationIcon}>
              <Ionicons name="sparkles" size={21} color={COLORS.primary} />
            </View>

            <View style={styles.motivationContent}>
              <Text style={styles.motivationTitle}>Keep going ✨</Text>

              <Text style={styles.motivationText}>
                Consistency is built one goal at a time.
              </Text>
            </View>
          </View>
        ) : null}
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
    paddingBottom: 45,
  },

  loader: {
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
    backgroundColor: COLORS.purpleLight,
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
    marginBottom: 25,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    marginBottom: 5,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
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
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purpleLight,
    borderWidth: 1,
    borderColor: COLORS.shineLight,
  },

  /* Progress */

  progressCard: {
    position: "relative",
    overflow: "hidden",
    padding: 21,
    marginBottom: 22,
    borderRadius: 26,

    shadowColor: COLORS.primaryDark,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },

  shineCircleOne: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    right: -70,
    top: -70,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  shineCircleTwo: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    right: 40,
    bottom: -70,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.13)",
  },

  progressHeaderText: {
    marginLeft: 12,
  },

  progressTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  progressSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#D8B4FE",
  },

  progressMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 23,
    marginBottom: 17,
  },

  progressValue: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1,
    color: "#FFFFFF",
  },

  progressCompleted: {
    marginTop: 2,
    fontSize: 12,
    color: "#D8B4FE",
  },

  progressCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  progressTrack: {
    height: 9,
    overflow: "hidden",
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.16)",
  },

  progressFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: COLORS.shineLight,
  },

  progressFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
  },

  progressFooterText: {
    flex: 1,
    fontSize: 12,
    color: "#E9D5FF",
  },

  /* Add */

  addCard: {
    padding: 19,
    marginBottom: 27,
    borderRadius: 22,
    backgroundColor: COLORS.surface,

    shadowColor: COLORS.primaryDark,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purpleLight,
  },

  sectionTitle: {
    marginLeft: 11,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  sectionSubtitle: {
    marginLeft: 11,
    marginTop: 3,
    fontSize: 11,
    color: COLORS.textLight,
  },

  input: {
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
    color: COLORS.text,
  },

  addButton: {
    marginTop: 12,
    overflow: "hidden",
    borderRadius: 13,
  },

  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },

  addButtonText: {
    marginLeft: 7,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* Error */

  errorCard: {
    flexDirection: "row",
    padding: 15,
    marginBottom: 20,
    borderRadius: 17,
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  errorIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  errorContent: {
    flex: 1,
    marginLeft: 11,
  },

  errorTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  errorText: {
    marginTop: 3,
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  /* Goals */

  goalsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  goalsTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  goalsSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: COLORS.textLight,
  },

  goalCount: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 9,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purpleLight,
  },

  goalCountText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },

  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 11,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.primaryDark,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.035,
    shadowRadius: 8,
    elevation: 1,
  },

  completedGoalCard: {
    backgroundColor: "#FCFFFC",
    borderColor: "#DCFCE7",
  },

  goalStatusIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purpleLight,
  },

  completedGoalIcon: {
    backgroundColor: COLORS.successLight,
  },

  goalContent: {
    flex: 1,
    marginHorizontal: 12,
  },

  goalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  completedGoalTitle: {
    color: COLORS.textSecondary,
    textDecorationLine: "line-through",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    backgroundColor: COLORS.primary,
  },

  completedStatusDot: {
    backgroundColor: COLORS.success,
  },

  goalStatus: {
    fontSize: 11,
    color: COLORS.textLight,
  },

  completedStatus: {
    color: COLORS.success,
  },

  actions: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },

  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },

  completeButtonText: {
    marginLeft: 4,
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  completedBadge: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButton: {
    marginTop: 6,
    padding: 4,
  },

  /* Empty */

  empty: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 45,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },

  emptyIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purpleLight,
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },

  emptyText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: COLORS.textSecondary,
  },

  /* Motivation */

  motivationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 9,
    borderRadius: 19,
    backgroundColor: COLORS.purpleLight,
  },

  motivationIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  motivationContent: {
    flex: 1,
    marginLeft: 11,
  },

  motivationTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },

  motivationText: {
    marginTop: 3,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
