import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Typography } from "../../components/common/Typography";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuthStore } from "../../stores/authStore";
import { auth } from "../../services/firebase";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";

/**
 * Signup Screen
 * Registration for new users via Firebase Authentication.
 * Creates Firebase user account, then exchanges ID token for backend JWT.
 */

export default function SignupScreen() {
  const { loginWithFirebaseToken } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return false;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 1. Create Firebase User Account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2. Get Firebase ID Token
      const idToken = await userCredential.user.getIdToken();

      // 3. Exchange ID Token for Backend JWT
      // This endpoint also performs JIT user provisioning with the user's name and email
      await loginWithFirebaseToken(idToken);

      // Navigation happens automatically when authStore.isAuthenticated is set to true
    } catch (err: any) {
      console.error("Signup failed", err);

      // Map Firebase-specific errors to user-friendly messages
      if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters long.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError(
          "Account creation is currently disabled. Please try again later."
        );
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h1" style={styles.title}>
          Start Your Journey
        </Typography>
        <Typography variant="body" color={Colors.light.textSecondary}>
          Create a safe space for your mind.
        </Typography>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(null);
          }}
        />

        <Input
          label="Password"
          placeholder="Min 8 characters"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(null);
          }}
        />

        <Input
          label="Confirm Password"
          placeholder="Re-enter password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setError(null);
          }}
        />

        {error && (
          <Typography
            variant="caption"
            color={Colors.light.error}
            style={styles.error}
          >
            {error}
          </Typography>
        )}

        {/* Privacy Promise */}
        <View style={styles.privacyContainer}>
          <Typography
            variant="caption"
            color={Colors.light.textSecondary}
            style={styles.privacyText}
          >
            🔒 Your privacy is our priority. Your journal entries are encrypted
            on your device and never sold to advertisers.
          </Typography>
        </View>

        <View style={styles.actions}>
          <Button
            title="Create Account"
            onPress={handleSignup}
            isLoading={isLoading}
            variant="primary"
          />
        </View>

        <View style={styles.footer}>
          <Typography variant="bodySmall" color={Colors.light.textSecondary}>
            Already have an account?{" "}
          </Typography>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Typography variant="bodySemiBold" color={Colors.light.primary}>
                Login
              </Typography>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingBottom: Spacing.xl,
  },
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  form: {
    width: "100%",
  },
  error: {
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  privacyContainer: {
    backgroundColor: "#F5F5F5",
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.primary,
  },
  privacyText: {
    lineHeight: 18,
  },
  actions: {
    marginTop: Spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
});
