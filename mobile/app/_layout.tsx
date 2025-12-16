import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../src/stores/authStore";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const { token, isLoading, hydrate } = useAuthStore();
  const router = useRouter();

  // Hydrate state on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Protection Logic
  useEffect(() => {
    if (isLoading) return;

    if (!token) {
      // If not logged in, redirect to login
      router.replace("(auth)/login" as any);
    } else if (token) {
      // If logged in, go to app
      router.replace("(app)" as any);
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1BA098" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
