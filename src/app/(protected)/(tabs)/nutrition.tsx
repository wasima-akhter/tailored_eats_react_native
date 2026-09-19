import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNutritionStore } from "../../../features/nutrition/store/nutrition_store";

const MEAL_TYPES = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];

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
  successLight: "#DCFCE7",
  error: "#DC2626",
  errorLight: "#FEF2F2",
};

const MEAL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Breakfast: "sunny-outline",
  Lunch: "restaurant-outline",
  Dinner: "moon-outline",
  Snack: "nutrition-outline",
  All: "grid-outline",
};

export default function NutritionScreen() {
  console.log("🔥 NutritionScreen rendered");
  const meals = useNutritionStore((state) => state.meals);
  const isLoading = useNutritionStore((state) => state.isLoading);
  const error = useNutritionStore((state) => state.error);
  const loadMeals = useNutritionStore((state) => state.loadMeals);

  const [selectedType, setSelectedType] = useState("All");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  useEffect(() => {
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
  }, [fadeAnim, slideAnim]);

  const handleMealType = (type: string) => {
    setSelectedType(type);
    loadMeals(type === "All" ? undefined : type);
  };

  const refreshMeals = () => {
    loadMeals(selectedType === "All" ? undefined : selectedType);
  };

  if (isLoading && meals.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />

        <Text style={styles.loadingText}>Loading your meals...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshMeals}
          tintColor={COLORS.primary}
        />
      }
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>NUTRITION</Text>

            <Text style={styles.title}>Your Meals</Text>

            <Text style={styles.subtitle}>
              Discover meals that fit your daily goals.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="restaurant-outline"
              size={25}
              color={COLORS.primary}
            />
          </View>
        </View>

        {/* Nutrition Summary */}
        <LinearGradient
          colors={[COLORS.deepPurple, COLORS.darkPurple, COLORS.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <View style={styles.summaryGlow} />

          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>MEAL PLAN</Text>

              <Text style={styles.summaryTitle}>Fuel your day</Text>
            </View>

            <View style={styles.summaryIcon}>
              <Ionicons
                name="nutrition-outline"
                size={24}
                color={COLORS.shineLight}
              />
            </View>
          </View>

          <View style={styles.summaryStats}>
            <SummaryStat
              icon="restaurant-outline"
              value={String(meals.length)}
              label="Meals"
            />

            <View style={styles.summaryDivider} />

            <SummaryStat
              icon="flash-outline"
              value="Balanced"
              label="Nutrition"
            />

            <View style={styles.summaryDivider} />

            <SummaryStat
              icon="checkmark-circle-outline"
              value="Daily"
              label="Planning"
            />
          </View>
        </LinearGradient>

        {/* Meal Filters */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Meal categories</Text>
            <Text style={styles.sectionSubtitle}>
              Choose what you want to explore
            </Text>
          </View>

          <Ionicons
            name="options-outline"
            size={20}
            color={COLORS.textSecondary}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {MEAL_TYPES.map((type) => {
            const selected = selectedType === type;

            return (
              <TouchableOpacity
                key={type}
                activeOpacity={0.8}
                style={[styles.filter, selected && styles.selectedFilter]}
                onPress={() => handleMealType(type)}
              >
                {selected ? (
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.purple]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.selectedFilterGradient}
                  >
                    <Ionicons
                      name={MEAL_ICONS[type]}
                      size={16}
                      color="#FFFFFF"
                    />

                    <Text style={styles.selectedFilterText}>{type}</Text>
                  </LinearGradient>
                ) : (
                  <>
                    <Ionicons
                      name={MEAL_ICONS[type]}
                      size={16}
                      color={COLORS.textSecondary}
                    />

                    <Text style={styles.filterText}>{type}</Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

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
              <Text style={styles.errorTitle}>Couldn't load meals</Text>

              <Text style={styles.errorText}>{error}</Text>

              <TouchableOpacity activeOpacity={0.7} onPress={refreshMeals}>
                <Text style={styles.retry}>Try again</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Section */}
        {meals.length > 0 ? (
          <View style={styles.mealsHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {selectedType === "All" ? "All meals" : selectedType}
              </Text>

              <Text style={styles.sectionSubtitle}>
                {meals.length} {meals.length === 1 ? "meal" : "meals"} available
              </Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{meals.length}</Text>
            </View>
          </View>
        ) : null}

        {/* Empty */}
        {meals.length === 0 && !error ? (
          <View style={styles.emptyCard}>
            <LinearGradient
              colors={[COLORS.purpleLight, COLORS.shineLight]}
              style={styles.emptyIcon}
            >
              <Ionicons
                name="restaurant-outline"
                size={34}
                color={COLORS.primary}
              />
            </LinearGradient>

            <Text style={styles.emptyTitle}>No meals found</Text>

            <Text style={styles.emptyText}>
              There aren't any meals available for this category yet.
            </Text>
          </View>
        ) : null}

        {/* Meals */}
        {meals.map((meal) => (
          <MealCard key={meal._id ?? meal.id ?? meal.name} meal={meal} />
        ))}

        {/* Bottom motivation */}
        {meals.length > 0 && !error ? (
          <LinearGradient
            colors={[COLORS.purpleLight, "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tipCard}
          >
            <View style={styles.tipIcon}>
              <Ionicons name="bulb-outline" size={21} color={COLORS.primary} />
            </View>

            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Nutrition tip</Text>

              <Text style={styles.tipText}>
                Keep your meals balanced with protein, carbohydrates, and
                healthy fats.
              </Text>
            </View>
          </LinearGradient>
        ) : null}
      </Animated.View>
    </ScrollView>
  );
}

function SummaryStat({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.summaryStat}>
      <Ionicons name={icon} size={17} color={COLORS.shineLight} />

      <Text style={styles.summaryValue}>{value}</Text>

      <Text style={styles.summaryStatLabel}>{label}</Text>
    </View>
  );
}

function MealCard({ meal }: { meal: any }) {
  const mealType = meal.mealType || "Meal";

  return (
    <View style={styles.mealCard}>
      <View style={styles.mealTopRow}>
        <View style={styles.mealIcon}>
          <Ionicons
            name={MEAL_ICONS[mealType] ?? "restaurant-outline"}
            size={22}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.mealTitleContainer}>
          <Text style={styles.mealName} numberOfLines={2}>
            {meal.name}
          </Text>

          <View style={styles.mealTypeRow}>
            <View style={styles.mealTypeDot} />

            <Text style={styles.mealType}>{mealType}</Text>
          </View>
        </View>

        <View style={styles.calorieContainer}>
          <Text style={styles.calorie}>{meal.calorie ?? 0}</Text>

          <Text style={styles.calorieUnit}>kcal</Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.macroRow}>
        <Macro icon="barbell-outline" label="Protein" value={meal.protein} />

        <Macro icon="leaf-outline" label="Carbs" value={meal.carb} />

        <Macro icon="water-outline" label="Fat" value={meal.fat} />
      </View>

      {meal.prepTime ? (
        <View style={styles.prepTimeContainer}>
          <Ionicons
            name="time-outline"
            size={15}
            color={COLORS.textSecondary}
          />

          <Text style={styles.prepTime}>Prep time: {meal.prepTime}</Text>
        </View>
      ) : null}
    </View>
  );
}

function Macro({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.macro}>
      <View style={styles.macroIcon}>
        <Ionicons name={icon} size={15} color={COLORS.primary} />
      </View>

      <View>
        <Text style={styles.macroValue}>{value ?? 0}g</Text>

        <Text style={styles.macroLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 40,
  },

  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  /* Header */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  headerText: {
    flex: 1,
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
    color: COLORS.text,
    letterSpacing: -0.6,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },

  headerIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    borderRadius: 16,
    backgroundColor: COLORS.purpleLight,
    borderWidth: 1,
    borderColor: COLORS.shineLight,
  },

  /* Summary */

  summaryCard: {
    position: "relative",
    overflow: "hidden",
    minHeight: 174,
    padding: 20,
    marginBottom: 28,
    borderRadius: 24,
    elevation: 5,
    shadowColor: COLORS.deepPurple,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  summaryGlow: {
    position: "absolute",
    width: 150,
    height: 150,
    top: -80,
    right: -20,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  summaryTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  summaryLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: COLORS.shineLight,
  },

  summaryTitle: {
    marginTop: 5,
    fontSize: 23,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  summaryIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  summaryStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },

  summaryStat: {
    flex: 1,
    alignItems: "center",
  },

  summaryValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  summaryStatLabel: {
    marginTop: 2,
    fontSize: 10,
    color: COLORS.shineLight,
  },

  summaryDivider: {
    width: 1,
    height: 35,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  /* Sections */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  /* Filters */

  filters: {
    gap: 9,
    paddingBottom: 25,
  },

  filter: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 15,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  selectedFilter: {
    paddingHorizontal: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
  },

  selectedFilterGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 15,
    borderRadius: 14,
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  selectedFilterText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
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
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },

  errorContent: {
    flex: 1,
    marginLeft: 11,
  },

  errorTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },

  errorText: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },

  retry: {
    marginTop: 7,
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.error,
  },

  /* Meals header */

  mealsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  countBadge: {
    minWidth: 34,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 9,
    borderRadius: 10,
    backgroundColor: COLORS.purpleLight,
  },

  countBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
  },

  /* Meal card */

  mealCard: {
    padding: 17,
    marginBottom: 13,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.deepPurple,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  mealTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  mealIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: COLORS.purpleLight,
  },

  mealTitleContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  mealName: {
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 21,
    color: COLORS.text,
  },

  mealTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  mealTypeDot: {
    width: 5,
    height: 5,
    marginRight: 6,
    borderRadius: 3,
    backgroundColor: COLORS.shine,
  },

  mealType: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  calorieContainer: {
    alignItems: "flex-end",
  },

  calorie: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.primary,
  },

  calorieUnit: {
    marginTop: 1,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textLight,
  },

  cardDivider: {
    height: 1,
    marginVertical: 16,
    backgroundColor: COLORS.border,
  },

  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  macro: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 82,
  },

  macroIcon: {
    width: 29,
    height: 29,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
    borderRadius: 9,
    backgroundColor: COLORS.purpleSoft,
  },

  macroValue: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },

  macroLabel: {
    marginTop: 1,
    fontSize: 10,
    color: COLORS.textLight,
  },

  prepTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  prepTime: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  /* Empty */

  emptyCard: {
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 45,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyIcon: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
    borderRadius: 23,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },

  emptyText: {
    maxWidth: 280,
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: COLORS.textSecondary,
  },

  /* Tip */

  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.shineLight,
  },

  tipIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: COLORS.surface,
  },

  tipContent: {
    flex: 1,
    marginLeft: 11,
  },

  tipTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
  },

  tipText: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.textSecondary,
  },
});
