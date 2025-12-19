import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { signInWithEmailAndPassword } from "firebase/auth";

import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Typography } from "../../components/common/Typography";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuthStore } from "../../stores/authStore";
import { auth } from "../../services/firebase";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";

/**
 * Login Screen
 * Primary entry point for existing users.
 * Supports Email/Password authentication via Firebase and Biometric shortcuts.
 */

export default function LoginScreen() {
  const { loginWithFirebaseToken, loginWithBiometric } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  // Check for biometric hardware on mount
  useEffect(() => {
    (async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsBiometricSupported(compatible && enrolled);

        // Optional: Trigger immediately if supported and desired
        // if (compatible && enrolled) handleBiometricLogin();
      } catch (e) {
        // Fail silently for biometrics
        console.log("Biometric check failed", e);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2. Get Firebase ID Token
      const idToken = await userCredential.user.getIdToken();

      // 3. Exchange ID Token for Backend JWT
      await loginWithFirebaseToken(idToken);

      // Navigation happens automatically when authStore.isAuthenticated is set to true
    } catch (err: any) {
      console.error("Login failed", err);

      // Map Firebase-specific errors to user-friendly messages
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-email"
      ) {
        setError("Invalid email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Check your connection.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login to MindMate",
        fallbackLabel: "Use Password",
      });

      if (result.success) {
        setIsLoading(true);
        try {
          await loginWithBiometric();
          // Navigation happens automatically when authStore.isAuthenticated is set to true
        } catch (err: any) {
          const msg =
            err.message || "Biometric login failed. Please try again.";
          setError(msg);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (e) {
      console.log("Biometric auth failed", e);
      setError("Biometric authentication is not available.");
    }
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h1" style={styles.title}>
          Welcome Back
        </Typography>
        <Typography variant="body" color={Colors.light.textSecondary}>
          Sign in to continue your journey.
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
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
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

        <View style={styles.actions}>
          <Button
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            variant="primary"
          />

          {isBiometricSupported && (
            <Button
              title="Use FaceID / TouchID"
              onPress={handleBiometricLogin}
              variant="secondary"
              style={{ marginTop: Spacing.sm }}
            />
          )}
        </View>

        <View style={styles.footer}>
          <Typography variant="bodySmall" color={Colors.light.textSecondary}>
            Don&apos;t have an account?{" "}
          </Typography>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Typography variant="bodySemiBold" color={Colors.light.primary}>
                Sign Up
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
    marginTop: Spacing.xl,
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
  actions: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
});
