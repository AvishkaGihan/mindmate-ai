import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import Colors from "../constants/Colors";

/**
 * Root Layout
 * The entry point for the application.
 * Responsibilities:
 * 1. Load global assets (Fonts).
 * 2. Initialize Auth State (Hydration).
 * 3. Enforce Auth Protection (Redirects).
 */

// Prevent the splash screen from auto-hiding until we are ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  // 1. Load Fonts
  const [fontsLoaded] = useFonts({
    // Primary Fonts (Inter)
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),

    // Display Fonts (Playfair Display)
    "PlayfairDisplay-Regular": require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
    "PlayfairDisplay-Bold": require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
  });

  // 2. Auth State
  const { isAuthenticated, isLoading, hydrate, initializeAuthFromFirebase } =
    useAuthStore();

  // Initialize Auth on mount
  useEffect(() => {
    hydrate();
    initializeAuthFromFirebase();
  }, [hydrate, initializeAuthFromFirebase]);

  // 3. Navigation Protection Logic
  useEffect(() => {
    if (isLoading || !fontsLoaded) return;

    // Hide splash screen once we know the auth state and fonts are ready
    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && inAuthGroup) {
      // If user is logged in and trying to access login/signup, send to home
      router.replace("/");
    } else if (!isAuthenticated && !inAuthGroup) {
      // If user is not logged in and not in the auth group, send to login
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, segments, isLoading, fontsLoaded, router]);

  // Show a loading indicator while we hydrate state or load fonts
  if (isLoading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  // Wrap the entire app in SafeAreaProvider
  // Slot renders the current child route (either (auth) stack or (tabs))
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
