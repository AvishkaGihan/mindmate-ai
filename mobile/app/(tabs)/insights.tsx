import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Typography } from "../../components/common/Typography";
import { Card } from "../../components/common/Card";
import { MoodChart, ChartPeriod } from "../../components/mood/MoodChart";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useMoodStore } from "../../stores/moodStore";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";

/**
 * Insights Screen
 * Visualization dashboard for emotional trends and patterns.
 * Supports switching between 7-day, 30-day, and 90-day views.
 */

export default function InsightsScreen() {
  const [period, setPeriod] = useState<ChartPeriod>("7d");
  const { stats, fetchStats, isLoading } = useMoodStore();

  useEffect(() => {
    // Fetch insights when the period changes
    // In a real implementation, we might cache this or pass the period to the fetcher
    fetchStats(period);
  }, [period, fetchStats]);

  // Calculate high-level stats based on current data
  const calculatedStats = useMemo(() => {
    if (!stats.daily || stats.daily.length === 0) return null;

    const totalLogs = stats.daily.reduce(
      (acc: number, day: any) => acc + (day.moodCount || 0),
      0
    );
    const avgIntensity =
      stats.daily.reduce(
        (acc: number, day: any) => acc + day.averageIntensity,
        0
      ) / stats.daily.length;

    // Simple frequency map for dominant mood (mock logic if API doesn't return it)
    // Assuming backend might send this, but calculating client-side for MVP robustness
    const dominantMood = "Anxious"; // Placeholder: In real app, calculate from detailed logs

    return {
      totalLogs,
      avgIntensity: avgIntensity.toFixed(1),
      dominantMood,
    };
  }, [stats]);

  const renderSegmentControl = () => (
    <View style={styles.segmentContainer}>
      {(["7d", "30d", "90d"] as ChartPeriod[]).map((p) => {
        const isActive = period === p;
        return (
          <TouchableOpacity
            key={p}
            style={[styles.segmentButton, isActive && styles.segmentActive]}
            onPress={() => setPeriod(p)}
            activeOpacity={0.7}
          >
            <Typography
              variant="caption"
              style={{
                fontWeight: "600",
                color: isActive
                  ? Colors.light.primary
                  : Colors.light.textSecondary,
              }}
            >
              {p.toUpperCase()}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Typography variant="h1">Insights</Typography>
        <Typography variant="body" color={Colors.light.textSecondary}>
          Understanding your emotional patterns.
        </Typography>
      </View>

      {/* Time Period Selector */}
      {renderSegmentControl()}

      {/* Main Chart */}
      <View style={styles.chartSection}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <LoadingSpinner size="small" />
          </View>
        ) : (
          <MoodChart data={stats.daily} period={period} isLoading={isLoading} />
        )}
      </View>

      {/* Statistics Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statsColumn}>
          <Card variant="flat" style={styles.statCard}>
            <Typography variant="caption" color={Colors.light.textSecondary}>
              AVG INTENSITY
            </Typography>
            <Typography variant="h2" color={Colors.light.primary}>
              {calculatedStats?.avgIntensity || "-"}
            </Typography>
            <Typography variant="caption" color={Colors.light.textSecondary}>
              out of 10
            </Typography>
          </Card>
        </View>

        <View style={styles.statsColumn}>
          <Card variant="flat" style={styles.statCard}>
            <Typography variant="caption" color={Colors.light.textSecondary}>
              TOTAL LOGS
            </Typography>
            <Typography variant="h2" color={Colors.light.primary}>
              {calculatedStats?.totalLogs || 0}
            </Typography>
            <Typography variant="caption" color={Colors.light.textSecondary}>
              entries
            </Typography>
          </Card>
        </View>
      </View>

      {/* AI Insight Card (Mocked for MVP) */}
      <Card variant="elevated" style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Typography variant="h3">MindMate Analysis</Typography>
          <Typography variant="caption" style={styles.betaTag}>
            BETA
          </Typography>
        </View>
        <Typography variant="body" style={styles.aiText}>
          &ldquo;I&apos;ve noticed you tend to feel more anxious on Monday
          mornings. Consider scheduling a Box Breathing session before your work
          week starts.&rdquo;
        </Typography>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 4,
    marginBottom: Spacing.md,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartSection: {
    marginBottom: Spacing.lg,
  },
  loadingContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statsColumn: {
    flex: 1,
  },
  statCard: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    marginBottom: 0, // Override default card margin
  },
  aiCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
    backgroundColor: "#F0F7F7", // Very light teal tint
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  betaTag: {
    backgroundColor: Colors.light.primary,
    color: "#FFFFFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    fontSize: 10,
    overflow: "hidden",
  },
  aiText: {
    fontStyle: "italic",
    lineHeight: 22,
  },
});
