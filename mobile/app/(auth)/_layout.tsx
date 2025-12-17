import { Stack } from "expo-router";
import Colors from "../../constants/Colors";

/**
 * Auth Layout
 * Defines the navigation stack for authentication screens.
 * Handles header configuration and transitions between Login and Signup.
 */

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.background,
        },
        headerShadowVisible: false, // Clean look, no divider line
        headerTintColor: Colors.light.primary, // Back button color
        headerTitleStyle: {
          fontWeight: "600",
          color: Colors.light.text,
        },
        contentStyle: {
          backgroundColor: Colors.light.background,
        },
        animation: "slide_from_right", // Standard iOS-like transition
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerShown: false, // Login is the landing, no back button needed
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: true,
          headerTitle: "Create Account",
          headerBackTitle: "Login", // Explicit text for iOS back button
        }}
      />
    </Stack>
  );
}
