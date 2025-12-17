import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Colors from "../../constants/Colors";
import { Typography } from "../common/Typography";

/**
 * BreathingCircle Component
 * Core visualization for mindfulness exercises.
 * Orchestrates animation, haptics, and instruction text based on a provided breathing pattern.
 */

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.6; // 60% of screen width
const MIN_SCALE = 1;
const MAX_SCALE = 1.6;

interface BreathingCircleProps {
  /** * Array of durations in milliseconds.
   * Standard mapping: [Inhale, Hold, Exhale, Hold(optional)]
   */
  pattern: number[];
  isActive: boolean;
  onComplete?: () => void; // Called if we wanted to enforce a set number of cycles
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  pattern,
  isActive,
}) => {
  const [instruction, setInstruction] = useState("Ready?");

  // Animation Values
  const scale = useSharedValue(MIN_SCALE);
  const opacity = useSharedValue(0.8);

  // Refs to manage the animation loop timer
  const timerRef = useRef<number | null>(null);

  // Derived phase mapping based on pattern length
  // 4 steps: Inhale -> Hold -> Exhale -> Hold (Box Breathing)
  // 3 steps: Inhale -> Hold -> Exhale (4-7-8)
  const getPhaseInstruction = useCallback(
    (index: number) => {
      const i = index % pattern.length;
      if (pattern.length === 4) {
        switch (i) {
          case 0:
            return "Breathe In";
          case 1:
            return "Hold";
          case 2:
            return "Breathe Out";
          case 3:
            return "Hold";
          default:
            return "";
        }
      } else {
        // Assuming 3 steps (4-7-8)
        switch (i) {
          case 0:
            return "Breathe In";
          case 1:
            return "Hold";
          case 2:
            return "Breathe Out";
          default:
            return "";
        }
      }
    },
    [pattern]
  );

  const getTargetScale = useCallback(
    (index: number) => {
      const i = index % pattern.length;
      // Inhale (0) -> Max Scale
      // Exhale (2) -> Min Scale
      // Holds (1, 3) -> Keep previous scale
      if (i === 0) return MAX_SCALE;
      if (i === 2) return MIN_SCALE;
      return null; // No change
    },
    [pattern]
  );

  const stopAnimation = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    cancelAnimation(scale);
    scale.value = withTiming(MIN_SCALE, { duration: 500 });
    setInstruction(isActive ? "Paused" : "Ready?");
  }, [isActive, scale]);

  const runPhase = useCallback(
    (index: number) => {
      if (!isActive) return;

      const currentPatternIndex = index % pattern.length;
      const duration = pattern[currentPatternIndex];
      const text = getPhaseInstruction(index);
      const targetScale = getTargetScale(index);

      // 1. Update UI Text
      setInstruction(text);

      // 2. Trigger Haptics
      // Heavy impact on Inhale start, Light on others
      if (currentPatternIndex === 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // 3. Trigger Animation
      if (targetScale !== null) {
        scale.value = withTiming(targetScale, {
          duration: duration,
          easing: Easing.inOut(Easing.ease),
        });
      }

      // 4. Schedule Next Phase
      timerRef.current = setTimeout(() => {
        runPhase(index + 1);
      }, duration);
    },
    [isActive, pattern, scale, getPhaseInstruction, getTargetScale]
  );

  // Effect: Start/Stop Logic
  useEffect(() => {
    if (isActive) {
      runPhase(0);
    } else {
      stopAnimation();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, pattern, runPhase, stopAnimation]);

  // Animated Styles
  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Outer Glow / Reference Circle */}
      <View style={styles.referenceCircle} />

      {/* Animated Breathing Circle */}
      <Animated.View style={[styles.circle, circleStyle]}>
        {/* Inner gradient simulated with solid color for MVP */}
      </Animated.View>

      {/* Instruction Text (Overlay) */}
      <View style={styles.textContainer}>
        <Typography
          variant="h2"
          color={Colors.light.primary}
          style={styles.text}
        >
          {instruction}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: CIRCLE_SIZE * MAX_SCALE + 40, // Ensure space for expansion
    width: "100%",
  },
  referenceCircle: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: `${Colors.light.primary}30`, // 30% opacity teal
    borderWidth: 1,
    borderColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontWeight: "600",
  },
});
