import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Typography } from "../../components/common/Typography";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuthStore } from "../../stores/authStore";
import api from "../../services/api";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";

/**
 * Signup Screen
 * Registration for new users.
 * Focuses on trust-building (Privacy Promise) and friction reduction.
 */

export default function SignupScreen() {
  const { login } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
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
      // 1. Register User
      // Expected API payload: { name, email, password }
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const { user, token, refreshToken } = response.data.data;

      // 2. Auto-Login (Update Store)
      // This will trigger the auth protection in _layout to redirect to /(tabs)
      await login(user, token, refreshToken);
    } catch (err: any) {
      console.error("Signup failed", err);

      if (err.response?.status === 409) {
        setError("This email is already registered. Please login instead.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to create account. Please try again."
        );
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
          label="Name"
          placeholder="What should we call you?"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError(null);
          }}
          autoCapitalize="words"
        />

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
