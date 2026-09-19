import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuthStore } from "../features/auth/store/auth_store";

export default function Index() {
  const initialize = useAuthStore((state) => state.initialize);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isHydrating) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (accessToken) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
