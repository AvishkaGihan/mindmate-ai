import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Link } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";

import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Typography } from "../../components/common/Typography";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuthStore } from "../../stores/authStore";
import api from "../../services/api";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";

/**
 * Login Screen
 * Primary entry point for existing users.
 * Supports Email/Password authentication and Biometric shortcuts.
 */

export default function LoginScreen() {
  const { login } = useAuthStore();

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
      // 1. Call API
      // Note: In a real app, you'd handle the response structure strictly.
      // Assuming API returns { data: { user, token, refreshToken } }
      const response = await api.post("/auth/login", { email, password });
      const { user, token, refreshToken } = response.data.data;

      // 2. Update Store (this will trigger navigation in _layout)
      await login(user, token, refreshToken);
    } catch (err: any) {
      console.error("Login failed", err);
      const msg = err.response?.data?.message || "Invalid email or password.";
      setError(msg);
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
        // In a real implementation:
        // 1. Retrieve the encrypted refresh token from SecureStorage
        // 2. Call an API endpoint to exchange refresh token for access token
        // 3. Login the user
        // For MVP without the full secure storage keychain logic connected here yet:
        Alert.alert(
          "Biometric Auth Success",
          "Feature would auto-login here in production."
        );
      }
    } catch (e) {
      console.log("Biometric auth failed", e);
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
