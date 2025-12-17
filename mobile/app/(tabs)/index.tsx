import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Typography } from "../../components/common/Typography";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { MoodSelector } from "../../components/mood/MoodSelector";
import { JournalEntryCard } from "../../components/journal/JournalEntryCard";

import { useAuthStore } from "../../stores/authStore";
import { useJournalStore } from "../../stores/journalStore";
import { useMoodStore } from "../../stores/moodStore";
import { geminiClient } from "../../services/geminiClient";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Mood } from "../../types";

/**
 * Home Screen / Dashboard
 * Central hub displaying daily affirmation, quick mood logging, and recent activity.
 */

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    journals,
    fetchJournals,
    isLoading: isJournalLoading,
  } = useJournalStore();
  const { logMood } = useMoodStore();

  const [affirmation, setAffirmation] = useState<string>(
    "Loading your daily thought..."
  );
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const loadAffirmation = useCallback(async () => {
    const text = await geminiClient.getDailyAffirmation();
    setAffirmation(text);
  }, []);

  // Fetch initial data
  const loadData = useCallback(async () => {
    try {
      // Parallel fetch for efficiency
      await Promise.all([fetchJournals(), loadAffirmation()]);
    } catch (error) {
      console.error("[Home] Failed to load data", error);
    }
  }, [fetchJournals, loadAffirmation]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleMoodSelect = async (mood: Mood) => {
    setSelectedMood(mood);
    // Log immediately with default intensity for "Quick Mode"
    try {
      await logMood(mood, 5); // Default intensity 5
      // Optional: Show success toast or feedback
    } catch {
      // Error handled in store
    }
  };

  const handleCreateJournal = () => {
    router.push("/journal/new");
  };

  // Get the most recent journal entry
  const recentEntry = journals.length > 0 ? journals[0] : null;

  return (
    <ScreenContainer
      scrollable
      style={styles.container}
      // Pass RefreshControl to the underlying ScrollView
    >
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />

      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Typography variant="h2" style={styles.greeting}>
            Hi, {user?.name?.split(" ")[0] || "Friend"} 👋
          </Typography>
          <Typography variant="body" color={Colors.light.textSecondary}>
            Welcome back to your safe space.
          </Typography>
        </View>
      </View>

      {/* Daily Affirmation Card */}
      <Card variant="elevated" style={styles.affirmationCard}>
        <Typography
          variant="caption"
          color={Colors.light.primary}
          style={styles.label}
        >
          DAILY AFFIRMATION
        </Typography>
        <Typography variant="h3" style={styles.affirmationText}>
          &ldquo;{affirmation}&rdquo;
        </Typography>
      </Card>

      {/* Quick Mood Logger */}
      <View style={styles.section}>
        <MoodSelector
          selectedMood={selectedMood}
          onSelect={handleMoodSelect}
          showIntensity={false}
        />
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCreateJournal}
          activeOpacity={0.8}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#E0F7FA" }]}>
            <Ionicons name="create" size={24} color={Colors.light.primary} />
          </View>
          <Typography variant="bodySmall" style={styles.actionLabel}>
            Journal
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/breathe")}
          activeOpacity={0.8}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#E8F5E9" }]}>
            <Ionicons name="leaf" size={24} color="#2E7D32" />
          </View>
          <Typography variant="bodySmall" style={styles.actionLabel}>
            Breathe
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/chat" as any)}
          activeOpacity={0.8}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#F3E5F5" }]}>
            <Ionicons name="chatbubbles" size={24} color="#7B1FA2" />
          </View>
          <Typography variant="bodySmall" style={styles.actionLabel}>
            Chat
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Typography variant="h3">Recent Entry</Typography>
          <TouchableOpacity onPress={handleCreateJournal}>
            <Typography variant="bodySmall" color={Colors.light.primary}>
              + New Entry
            </Typography>
          </TouchableOpacity>
        </View>

        {isJournalLoading && !recentEntry ? (
          <Typography
            variant="body"
            color={Colors.light.textSecondary}
            style={{ textAlign: "center", marginVertical: 20 }}
          >
            Loading...
          </Typography>
        ) : recentEntry ? (
          <JournalEntryCard entry={recentEntry} />
        ) : (
          <Card variant="outlined" style={styles.emptyState}>
            <Typography
              variant="body"
              style={{ textAlign: "center", marginBottom: 8 }}
            >
              No entries yet.
            </Typography>
            <Typography
              variant="caption"
              color={Colors.light.textSecondary}
              style={{ textAlign: "center" }}
            >
              Your journal is a blank canvas waiting for your thoughts.
            </Typography>
            <Button
              title="Write First Entry"
              onPress={handleCreateJournal}
              variant="secondary"
              size="small"
              style={{ marginTop: 16, alignSelf: "center" }}
            />
          </Card>
        )}
      </View>

      {/* Bottom Spacer for Tab Bar */}
      <View style={{ height: 20 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    marginBottom: 4,
  },
  affirmationCard: {
    backgroundColor: "#F0F4F8", // Very light blue/gray
    marginBottom: Spacing.lg,
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  label: {
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    fontWeight: "700",
  },
  affirmationText: {
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 28,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.xl,
  },
  actionButton: {
    alignItems: "center",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionLabel: {
    fontWeight: "600",
  },
  emptyState: {
    padding: Spacing.lg,
    alignItems: "center",
    borderStyle: "dashed",
  },
});
