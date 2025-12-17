import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { Typography } from "../../components/common/Typography";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { BreathingCircle } from "../../components/breathing/BreathingCircle";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";

/**
 * Breathe Screen
 * Selection hub for mindfulness exercises.
 * Manages the transition between the selection grid and the active breathing session.
 */

interface BreathingExercise {
  id: string;
  name: string;
  pattern: number[]; // Array of durations in ms [Inhale, Hold, Exhale, Hold]
  description: string;
  benefits: string;
  color: string;
}

const EXERCISES: BreathingExercise[] = [
  {
    id: "box",
    name: "Box Breathing",
    pattern: [4000, 4000, 4000, 4000],
    description: "4-4-4-4 Pattern",
    benefits: "Heightens performance and concentration while relieving stress.",
    color: "#4DD0E1", // Cyan
  },
  {
    id: "calm",
    name: "4-7-8 Relax",
    pattern: [4000, 7000, 8000],
    description: "Natural Tranquilizer",
    benefits: "Reduces anxiety and helps you get to sleep faster.",
    color: "#81C784", // Green
  },
  {
    id: "balance",
    name: "Coherent",
    pattern: [6000, 0, 6000, 0], // Continuous flow
    description: "6-0-6-0 Pattern",
    benefits: "Balances the nervous system and stabilizes heart rate.",
    color: "#BA68C8", // Purple
  },
  {
    id: "awake",
    name: "Energize",
    pattern: [4000, 0, 2000, 0], // Fast inhale, fast exhale
    description: "4-0-2-0 Pattern",
    benefits: "Wakes up your mind and body. Good for morning grogginess.",
    color: "#FFB74D", // Orange
  },
];

export default function BreatheScreen() {
  const [activeExercise, setActiveExercise] =
    useState<BreathingExercise | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleStart = (exercise: BreathingExercise) => {
    setActiveExercise(exercise);
    setIsSessionActive(true);
  };

  const handleStop = () => {
    setIsSessionActive(false);
    setShowSummary(true);
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setActiveExercise(null);
  };

  // 1. Active Session View
  if (activeExercise && !showSummary) {
    return (
      <ScreenContainer style={styles.activeContainer}>
        <View style={styles.activeHeader}>
          <TouchableOpacity onPress={handleStop} style={styles.closeButton}>
            <Ionicons
              name="close"
              size={28}
              color={Colors.light.textSecondary}
            />
          </TouchableOpacity>
          <Typography variant="h2">{activeExercise.name}</Typography>
          <View style={{ width: 28 }} /> {/* Spacer for centering */}
        </View>

        <View style={styles.circleWrapper}>
          <BreathingCircle
            pattern={activeExercise.pattern}
            isActive={isSessionActive}
          />
        </View>

        <View style={styles.controls}>
          <Typography variant="body" style={styles.instructionText}>
            {activeExercise.description}
          </Typography>

          <Button
            title={isSessionActive ? "Pause" : "Resume"}
            onPress={() => setIsSessionActive(!isSessionActive)}
            variant="secondary"
            style={{ marginBottom: Spacing.sm, width: 200 }}
          />

          <Button
            title="End Session"
            onPress={handleStop}
            variant="ghost"
            style={{ width: 200 }}
          />
        </View>
      </ScreenContainer>
    );
  }

  // 2. Summary View (Simple Modal-like state)
  if (showSummary && activeExercise) {
    return (
      <ScreenContainer style={styles.centerContent}>
        <Ionicons
          name="checkmark-circle"
          size={80}
          color={Colors.light.primary}
        />
        <Typography
          variant="h1"
          style={{ marginTop: Spacing.md, marginBottom: Spacing.sm }}
        >
          Great Job!
        </Typography>
        <Typography
          variant="body"
          style={{ textAlign: "center", marginBottom: Spacing.xl }}
        >
          You&apos;ve just completed a session of {activeExercise.name}. Take a
          moment to notice how you feel.
        </Typography>
        <Button
          title="Back to Exercises"
          onPress={handleCloseSummary}
          style={{ width: "100%" }}
        />
      </ScreenContainer>
    );
  }

  // 3. Selection Grid (Default)
  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Typography variant="h1">Breathe</Typography>
        <Typography variant="body" color={Colors.light.textSecondary}>
          Select a technique to center your mind.
        </Typography>
      </View>

      <View style={styles.grid}>
        {EXERCISES.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.cardWrapper}
            onPress={() => handleStart(exercise)}
            activeOpacity={0.9}
          >
            <Card
              style={{
                ...styles.card,
                borderLeftColor: exercise.color,
                borderLeftWidth: 4,
              }}
            >
              <View style={styles.cardHeader}>
                <Typography variant="h3">{exercise.name}</Typography>
                <Ionicons
                  name="play-circle-outline"
                  size={24}
                  color={Colors.light.primary}
                />
              </View>
              <Typography
                variant="caption"
                color={Colors.light.textSecondary}
                style={{ marginBottom: 4 }}
              >
                {exercise.description}
              </Typography>
              <Typography variant="bodySmall" numberOfLines={3}>
                {exercise.benefits}
              </Typography>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  grid: {
    paddingBottom: Spacing.xl,
  },
  cardWrapper: {
    marginBottom: Spacing.sm,
  },
  card: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  // Active Mode Styles
  activeContainer: {
    justifyContent: "space-between",
    paddingVertical: Spacing.lg,
  },
  activeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
  },
  closeButton: {
    padding: 8,
  },
  circleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    alignItems: "center",
    paddingBottom: Spacing.xl,
  },
  instructionText: {
    marginBottom: Spacing.xl,
    textAlign: "center",
    opacity: 0.8,
  },
  // Center Content (Summary)
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
});
