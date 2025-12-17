import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "../common/Card";
import { Typography } from "../common/Typography";
import { JournalEntry } from "../../types";
import { formatDate, formatTime } from "../../utils/dateTime";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";

/**
 * JournalEntryCard Component
 * Displays a summary of a single journal entry in a list.
 * Includes date, mood badge, and truncated content preview.
 */

// Simple mapping for visual consistency
const MOOD_EMOJIS: Record<string, string> = {
  Peaceful: "😌",
  Content: "🙂",
  Anxious: "😰",
  Stressed: "😫",
  Sad: "😢",
  Angry: "😠",
  Overwhelmed: "🤯",
};

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entry,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/journal/${entry._id}`);
  };

  // Determine mood color safely
  const moodColor =
    (Colors.light.moods as any)[entry.mood.toLowerCase()] ||
    Colors.light.primary;

  return (
    <Card onPress={handlePress} style={styles.card}>
      {/* Header: Date and Time */}
      <View style={styles.header}>
        <Typography variant="bodySemiBold" color={Colors.light.textSecondary}>
          {formatDate(entry.date)}
        </Typography>
        <Typography variant="caption" color={Colors.light.textSecondary}>
          {formatTime(entry.date)}
        </Typography>
      </View>

      {/* Mood Badge */}
      <View style={styles.moodContainer}>
        <View style={[styles.moodBadge, { backgroundColor: `${moodColor}20` }]}>
          <Typography variant="body" style={{ marginRight: 4 }}>
            {MOOD_EMOJIS[entry.mood] || "😐"}
          </Typography>
          <Typography
            variant="caption"
            color={Colors.light.text}
            style={{ fontWeight: "600" }}
          >
            {entry.mood}
          </Typography>
        </View>
        {/* Sync Status Indicator (dot) */}
        {!entry.isSynced && <View style={styles.unsyncedDot} />}
      </View>

      {/* Content Preview */}
      <View style={styles.contentContainer}>
        <Typography
          variant="body"
          numberOfLines={3}
          style={styles.previewText}
          ellipsizeMode="tail"
        >
          {entry.content}
        </Typography>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  moodContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  moodBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  unsyncedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.warning,
    marginLeft: Spacing.xs,
  },
  contentContainer: {
    minHeight: 24,
  },
  previewText: {
    lineHeight: 22,
  },
});
