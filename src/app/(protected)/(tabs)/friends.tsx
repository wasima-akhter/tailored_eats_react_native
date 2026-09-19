import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useFriendsStore } from "../../../features/friends/store/friends_store";

type Tab = "suggestions" | "friends" | "requests";

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

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("suggestions");
  const [search, setSearch] = useState("");

  const suggestions = useFriendsStore((state) => state.suggestions);
  const friends = useFriendsStore((state) => state.friends);
  const requests = useFriendsStore((state) => state.requests);

  const isLoading = useFriendsStore((state) => state.isLoading);

  const loadSuggestions = useFriendsStore((state) => state.loadSuggestions);
  const loadFriends = useFriendsStore((state) => state.loadFriends);
  const loadRequests = useFriendsStore((state) => state.loadRequests);

  const addFriend = useFriendsStore((state) => state.addFriend);
  const acceptRequest = useFriendsStore((state) => state.acceptRequest);
  const rejectRequest = useFriendsStore((state) => state.rejectRequest);
  const unfriend = useFriendsStore((state) => state.unfriend);
  const searchFriends = useFriendsStore((state) => state.searchFriends);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    loadSuggestions();
    loadFriends();
    loadRequests();

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
    const timer = setTimeout(() => {
      if (search.trim()) {
        searchFriends(search);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleRefresh = async () => {
    if (activeTab === "suggestions") {
      await loadSuggestions();
    }

    if (activeTab === "friends") {
      await loadFriends();
    }

    if (activeTab === "requests") {
      await loadRequests();
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      await addFriend(friendId);

      Alert.alert("Success", "Friend request sent.");
    } catch {
      Alert.alert("Error", "Could not send friend request.");
    }
  };

  const handleAccept = async (friendId: string) => {
    try {
      await acceptRequest(friendId);

      Alert.alert("Success", "Friend request accepted.");
    } catch {
      Alert.alert("Error", "Could not accept request.");
    }
  };

  const handleReject = async (friendId: string) => {
    try {
      await rejectRequest(friendId);
    } catch {
      Alert.alert("Error", "Could not reject request.");
    }
  };

  const handleUnfriend = async (friendId: string) => {
    Alert.alert(
      "Remove Friend",
      "Are you sure you want to remove this friend?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await unfriend(friendId);
            } catch {
              Alert.alert("Error", "Could not remove friend.");
            }
          },
        },
      ],
    );
  };

  const getData = () => {
    if (activeTab === "friends") {
      return friends;
    }

    if (activeTab === "requests") {
      return requests;
    }

    if (search.trim()) {
      return useFriendsStore.getState().searchResults;
    }

    return suggestions;
  };

  const data = getData();

  const getTabCount = (tab: Tab) => {
    if (tab === "suggestions") return suggestions.length;
    if (tab === "friends") return friends.length;
    return requests.length;
  };

  const getEmptyMessage = () => {
    if (search.trim()) {
      return "No people found for your search.";
    }

    if (activeTab === "suggestions") {
      return "No friend suggestions found.";
    }

    if (activeTab === "friends") {
      return "No friends found.";
    }

    return "No friend requests found.";
  };

  const renderPerson = ({ item }: { item: any }) => {
    const id = item._id ?? item.userId ?? item.friendId;

    return (
      <PersonCard
        item={item}
        activeTab={activeTab}
        onAdd={id ? () => handleAddFriend(id) : undefined}
        onRemove={id ? () => handleUnfriend(id) : undefined}
      />
    );
  };

  const renderRequest = ({ item }: { item: any }) => {
    return (
      <PersonCard
        item={item}
        activeTab="requests"
        onAccept={() => handleAccept(item.senderId)}
        onReject={() => handleReject(item.senderId)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim,
              },
            ],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>COMMUNITY</Text>

            <Text style={styles.title}>Friends</Text>

            <Text style={styles.subtitle}>
              Connect, support, and grow together.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="people-outline" size={25} color={COLORS.primary} />
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textLight} />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search people..."
            placeholderTextColor={COLORS.textLight}
            style={styles.searchInput}
            returnKeyType="search"
          />

          {search.length > 0 ? (
            <TouchableOpacity onPress={() => setSearch("")} activeOpacity={0.7}>
              <Ionicons
                name="close-circle"
                size={19}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TabButton
            label="Suggestions"
            icon="sparkles-outline"
            active={activeTab === "suggestions"}
            count={getTabCount("suggestions")}
            onPress={() => setActiveTab("suggestions")}
          />

          <TabButton
            label="Friends"
            icon="people-outline"
            active={activeTab === "friends"}
            count={getTabCount("friends")}
            onPress={() => setActiveTab("friends")}
          />

          <TabButton
            label="Requests"
            icon="person-add-outline"
            active={activeTab === "requests"}
            count={getTabCount("requests")}
            onPress={() => setActiveTab("requests")}
          />
        </View>

        {/* Current section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {search.trim()
                ? "Search results"
                : activeTab === "suggestions"
                  ? "People you may know"
                  : activeTab === "friends"
                    ? "Your friends"
                    : "Friend requests"}
            </Text>

            <Text style={styles.sectionSubtitle}>
              {data.length} {data.length === 1 ? "person" : "people"}
            </Text>
          </View>

          <View style={styles.sectionIcon}>
            <Ionicons
              name={activeTab === "requests" ? "mail-outline" : "heart-outline"}
              size={18}
              color={COLORS.primary}
            />
          </View>
        </View>

        {/* List */}
        {isLoading && data.length === 0 ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />

            <Text style={styles.loadingText}>Loading friends...</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              item._id ?? item.userId ?? item.friendId ?? String(index)
            }
            renderItem={activeTab === "requests" ? renderRequest : renderPerson}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              data.length === 0 ? styles.emptyContainer : styles.list
            }
            refreshControl={
              <RefreshControl
                refreshing={isLoading && data.length > 0}
                onRefresh={handleRefresh}
                tintColor={COLORS.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState
                activeTab={activeTab}
                search={search}
                message={getEmptyMessage()}
              />
            }
          />
        )}
      </Animated.View>
    </View>
  );
}

function TabButton({
  label,
  icon,
  active,
  count,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  count: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.tab, active && styles.activeTab]}
      onPress={onPress}
    >
      {active ? (
        <LinearGradient
          colors={[COLORS.primary, COLORS.purple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.activeTabGradient}
        >
          <Ionicons name={icon} size={15} color="#FFFFFF" />

          <Text style={styles.activeTabText}>{label}</Text>
        </LinearGradient>
      ) : (
        <>
          <Ionicons name={icon} size={15} color={COLORS.textSecondary} />

          <Text style={styles.tabText}>{label}</Text>
        </>
      )}

      {!active && count > 0 ? (
        <View style={styles.tabCount}>
          <Text style={styles.tabCountText}>{count > 99 ? "99+" : count}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

function PersonCard({
  item,
  activeTab,
  onAdd,
  onRemove,
  onAccept,
  onReject,
}: {
  item: any;
  activeTab: Tab;
  onAdd?: () => void;
  onRemove?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}) {
  const name = item.name ?? "Unknown user";
  const initial = name.charAt(0)?.toUpperCase() ?? "?";

  return (
    <View style={styles.card}>
      <View style={styles.avatarWrapper}>
        <LinearGradient
          colors={[COLORS.purpleLight, COLORS.shineLight]}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{initial}</Text>
        </LinearGradient>

        <View style={styles.onlineDot} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>

        {item.mainGoal ? (
          <View style={styles.goalRow}>
            <Ionicons name="flag-outline" size={12} color={COLORS.primary} />

            <Text style={styles.secondary} numberOfLines={1}>
              {item.mainGoal}
            </Text>
          </View>
        ) : (
          <Text style={styles.secondary}>Nutrition community member</Text>
        )}
      </View>

      {activeTab === "suggestions" && onAdd ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onAdd}
          style={styles.actionButton}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.purple]}
            style={styles.actionGradient}
          >
            <Ionicons name="person-add-outline" size={15} color="#FFFFFF" />

            <Text style={styles.actionText}>Add</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}

      {activeTab === "friends" && onRemove ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onRemove}
          style={styles.removeButton}
        >
          <Ionicons
            name="person-remove-outline"
            size={15}
            color={COLORS.error}
          />

          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      ) : null}

      {activeTab === "requests" ? (
        <View style={styles.requestActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onAccept}
            style={styles.acceptButton}
          >
            <Ionicons name="checkmark" size={17} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onReject}
            style={styles.rejectButton}
          >
            <Ionicons name="close" size={17} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

function EmptyState({
  activeTab,
  search,
  message,
}: {
  activeTab: Tab;
  search: string;
  message: string;
}) {
  const icon = search.trim()
    ? "search-outline"
    : activeTab === "suggestions"
      ? "sparkles-outline"
      : activeTab === "friends"
        ? "people-outline"
        : "mail-outline";

  return (
    <View style={styles.empty}>
      <LinearGradient
        colors={[COLORS.purpleLight, COLORS.shineLight]}
        style={styles.emptyIcon}
      >
        <Ionicons name={icon} size={32} color={COLORS.primary} />
      </LinearGradient>

      <Text style={styles.emptyTitle}>
        {search.trim()
          ? "No results"
          : activeTab === "suggestions"
            ? "You're all caught up"
            : activeTab === "friends"
              ? "No friends yet"
              : "No pending requests"}
      </Text>

      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 58,
  },

  /* Header */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
    letterSpacing: -0.6,
    color: COLORS.text,
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

  /* Search */

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    marginHorizontal: 10,
    fontSize: 14,
    color: COLORS.text,
  },

  /* Tabs */

  tabsContainer: {
    flexDirection: "row",
    gap: 7,
    padding: 5,
    marginBottom: 22,
    borderRadius: 17,
    backgroundColor: COLORS.purpleSoft,
  },

  tab: {
    flex: 1,
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 13,
  },

  activeTab: {
    overflow: "hidden",
    elevation: 2,
    shadowColor: COLORS.deepPurple,
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  activeTabGradient: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 13,
  },

  tabText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  activeTabText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  tabCount: {
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: COLORS.surface,
  },

  tabCountText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.primary,
  },

  /* Section */

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

  sectionIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: COLORS.purpleLight,
  },

  /* List */

  list: {
    paddingBottom: 35,
  },

  /* Card */

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    marginBottom: 11,
    borderRadius: 19,
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

  avatarWrapper: {
    position: "relative",
    marginRight: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },

  avatarText: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.primary,
  },

  onlineDot: {
    position: "absolute",
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  name: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },

  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  secondary: {
    flex: 1,
    marginLeft: 5,
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  /* Actions */

  actionButton: {
    overflow: "hidden",
    marginLeft: 8,
    borderRadius: 11,
  },

  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  actionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 8,
    borderRadius: 10,
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  removeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.error,
  },

  requestActions: {
    flexDirection: "row",
    gap: 7,
    marginLeft: 8,
  },

  acceptButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: COLORS.primary,
  },

  rejectButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  /* Loading */

  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  /* Empty */

  emptyContainer: {
    flexGrow: 1,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 100,
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
});
