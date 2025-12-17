import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Typography } from "../../components/common/Typography";
import { RichTextEditor } from "../../components/journal/RichTextEditor";
import { useJournalStore } from "../../stores/journalStore";
import { formatDate, formatTime } from "../../utils/dateTime";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";

/**
 * Journal Detail Screen
 * View and edit existing journal entries.
 * Handles reading (decrypted view) and editing modes.
 */

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { journals, updateJournal, deleteJournal } = useJournalStore();

  // Find the entry
  // Note: In a real app with pagination, we might need to fetchById if not in the current list
  const entry = journals.find((j) => j._id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize content when entry is loaded
  useEffect(() => {
    if (entry) {
      setEditedContent(entry.content);
    } else {
      // Handle case where entry isn't found (deleted or invalid ID)
      Alert.alert("Error", "Entry not found.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [entry, id, router]);

  const handleSave = async () => {
    if (!entry) return;

    setIsSaving(true);
    try {
      await updateJournal(entry._id, {
        ...entry,
        content: editedContent,
        updatedAt: new Date().toISOString(),
      });
      setIsEditing(false);
    } catch {
      Alert.alert("Error", "Failed to update entry.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!entry) return;

    Alert.alert("Delete Entry", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteJournal(entry._id);
            router.back();
          } catch {
            Alert.alert("Error", "Failed to delete entry.");
          }
        },
      },
    ]);
  };

  const handleCancelEdit = () => {
    if (entry) {
      setEditedContent(entry.content); // Reset changes
      setIsEditing(false);
    }
  };

  if (!entry) {
    return (
      <ScreenContainer style={styles.center}>
        <ActivityIndicator size="small" color={Colors.light.primary} />
      </ScreenContainer>
    );
  }

  // Visual Mood Badge
  const moodColor =
    (Colors.light.moods as any)[entry.mood.toLowerCase()] ||
    Colors.light.primary;

  return (
    <ScreenContainer scrollable style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {isEditing ? (
            <>
              <TouchableOpacity
                onPress={handleCancelEdit}
                style={styles.actionButton}
              >
                <Typography variant="body" color={Colors.light.textSecondary}>
                  Cancel
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={styles.actionButton}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.light.primary}
                  />
                ) : (
                  <Typography
                    variant="bodySemiBold"
                    color={Colors.light.primary}
                  >
                    Done
                  </Typography>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={styles.actionButton}
              >
                <Ionicons
                  name="pencil"
                  size={22}
                  color={Colors.light.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.actionButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color={Colors.light.error}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Metadata Section */}
      <View style={styles.metaContainer}>
        <View>
          <Typography variant="h2">{formatDate(entry.date)}</Typography>
          <Typography variant="bodySmall" color={Colors.light.textSecondary}>
            {formatTime(entry.date)}
          </Typography>
        </View>

        <View style={[styles.moodBadge, { backgroundColor: `${moodColor}20` }]}>
          <Typography variant="bodySemiBold" color={Colors.light.text}>
            {entry.mood}
          </Typography>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {isEditing ? (
          <RichTextEditor
            value={editedContent}
            onChangeText={setEditedContent}
            style={{ minHeight: 300 }}
          />
        ) : (
          <Typography variant="body" style={styles.textContent}>
            {entry.content}
          </Typography>
        )}
      </View>

      {/* Footer Info */}
      {!isEditing && (
        <View style={styles.footer}>
          <Typography variant="caption" color={Colors.light.textPlaceholder}>
            {entry.isSynced
              ? "Synced to cloud"
              : "Stored locally (Waiting for sync)"}
          </Typography>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: Spacing.xs,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  moodBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  contentContainer: {
    minHeight: 200,
  },
  textContent: {
    lineHeight: 26,
    fontSize: 16,
  },
  footer: {
    marginTop: Spacing.xl,
    alignItems: "center",
  },
});
