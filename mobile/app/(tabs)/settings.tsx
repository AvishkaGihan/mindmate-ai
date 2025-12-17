import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Typography } from "../../components/common/Typography";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { useAuthStore } from "../../stores/authStore";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";

/**
 * Settings Screen
 * Manages user profile, app preferences, privacy controls, and account actions.
 * Implements GDPR compliance features (Export/Delete).
 */

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Local state for preferences (Mocked for UI, would sync with a specific store/API)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure? This action is permanent and will wipe all your encrypted journals and mood history.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // In a real app: await api.deleteAccount();
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "We are preparing your data package. You will receive a secure download link via email shortly.",
      [{ text: "OK" }]
    );
  };

  // Reusable Row Component
  const SettingsRow = ({
    icon,
    label,
    value,
    onValueChange,
    type = "switch",
    onPress,
  }: {
    icon: string;
    label: string;
    value?: boolean;
    onValueChange?: (val: boolean) => void;
    type?: "switch" | "link";
    onPress?: () => void;
  }) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={20} color={Colors.light.primary} />
        </View>
        <Typography variant="body" style={styles.rowLabel}>
          {label}
        </Typography>
      </View>

      {type === "switch" ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#E0E0E0", true: Colors.light.primary }}
          thumbColor={"#FFFFFF"}
        />
      ) : (
        <TouchableOpacity onPress={onPress}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.light.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Typography variant="h1">Settings</Typography>
      </View>

      {/* Profile Section */}
      <Card style={styles.profileCard}>
        <View style={styles.avatarPlaceholder}>
          <Typography variant="h2" color="#FFFFFF">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Typography>
        </View>
        <View style={styles.profileInfo}>
          <Typography variant="h3">{user?.name || "User"}</Typography>
          <Typography variant="caption" color={Colors.light.textSecondary}>
            {user?.email || "email@example.com"}
          </Typography>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Typography
            variant="caption"
            color={Colors.light.primary}
            style={{ fontWeight: "600" }}
          >
            Edit
          </Typography>
        </TouchableOpacity>
      </Card>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Typography variant="caption" style={styles.sectionTitle}>
          PREFERENCES
        </Typography>
        <Card variant="flat" style={styles.sectionCard}>
          <SettingsRow
            icon="notifications-outline"
            label="Daily Reminders"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="time-outline"
            label="Reminder Time (08:00 AM)"
            type="link"
            onPress={() => {}}
          />
        </Card>
      </View>

      {/* Privacy & Security Section */}
      <View style={styles.section}>
        <Typography variant="caption" style={styles.sectionTitle}>
          PRIVACY & SECURITY
        </Typography>
        <Card variant="flat" style={styles.sectionCard}>
          <SettingsRow
            icon="finger-print-outline"
            label="Biometric Lock"
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="bulb-outline"
            label="AI Personalization"
            value={personalizationEnabled}
            onValueChange={setPersonalizationEnabled}
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="download-outline"
            label="Export My Data (GDPR)"
            type="link"
            onPress={handleExportData}
          />
        </Card>
        <Typography
          variant="caption"
          color={Colors.light.textSecondary}
          style={styles.helperText}
        >
          Personalization allows AI to tailor prompts based on your mood
          history. Data stays on your device or encrypted.
        </Typography>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="secondary"
          style={styles.logoutButton}
        />

        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={styles.deleteLink}
        >
          <Typography variant="bodySmall" color={Colors.light.error}>
            Delete Account
          </Typography>
        </TouchableOpacity>
      </View>

      <Typography variant="caption" style={styles.versionText}>
        Version 1.0.0 (Build 42)
      </Typography>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.light.textSecondary,
    fontWeight: "600",
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  sectionCard: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: Spacing.sm,
    width: 24,
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 56, // Align with text, skipping icon
  },
  helperText: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
    lineHeight: 18,
  },
  logoutButton: {
    marginBottom: Spacing.md,
  },
  deleteLink: {
    alignItems: "center",
    padding: 8,
  },
  versionText: {
    textAlign: "center",
    color: Colors.light.textPlaceholder,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});
