import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Typography } from "../common/Typography";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Mood } from "../../types";

/**
 * MoodSelector Component
 * A grid of animated emojis for selecting the user's current emotional state.
 * Supports an optional intensity selector (1-10).
 */

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - Spacing.md * 2 - Spacing.sm * 2) / 4; // 4 columns approx

interface MoodOption {
  value: Mood;
  emoji: string;
  color: string;
  label: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    value: "Peaceful",
    emoji: "😌",
    color: Colors.light.moods.peaceful,
    label: "Peaceful",
  },
  {
    value: "Content",
    emoji: "🙂",
    color: Colors.light.moods.content,
    label: "Content",
  },
  {
    value: "Anxious",
    emoji: "😰",
    color: Colors.light.moods.anxious,
    label: "Anxious",
  },
  {
    value: "Stressed",
    emoji: "😫",
    color: Colors.light.moods.stressed,
    label: "Stressed",
  },
  { value: "Sad", emoji: "😢", color: Colors.light.moods.sad, label: "Sad" },
  {
    value: "Angry",
    emoji: "😠",
    color: Colors.light.moods.angry,
    label: "Angry",
  },
  {
    value: "Overwhelmed",
    emoji: "🤯",
    color: Colors.light.moods.overwhelmed,
    label: "Overwhelmed",
  },
];

interface MoodItemProps {
  item: MoodOption;
  isSelected: boolean;
  onSelect: (mood: Mood) => void;
}

// Sub-component for individual animated mood items
const MoodItem: React.FC<MoodItemProps> = ({ item, isSelected, onSelect }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.15, { damping: 12 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(1, { duration: 200 });
      opacity.value = withTiming(0.6, { duration: 200 });
    }
  }, [isSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect(item.value)}
      style={styles.itemContainer}
      accessibilityRole="button"
      accessibilityLabel={`Select ${item.label} mood`}
      accessibilityState={{ selected: isSelected }}
    >
      <Animated.View
        style={[
          styles.circle,
          animatedStyle,
          { backgroundColor: isSelected ? item.color : "#F0F0F0" },
        ]}
      >
        <Typography style={{ fontSize: 32 }}>{item.emoji}</Typography>
      </Animated.View>
      <Typography
        variant="caption"
        style={[
          styles.label,
          {
            color: isSelected ? Colors.light.text : Colors.light.textSecondary,
          },
        ]}
      >
        {item.label}
      </Typography>
    </TouchableOpacity>
  );
};

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelect: (mood: Mood) => void;
  intensity?: number;
  onIntensityChange?: (value: number) => void;
  showIntensity?: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelect,
  intensity = 5,
  onIntensityChange,
  showIntensity = false,
}) => {
  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.title}>
        How are you feeling?
      </Typography>

      <View style={styles.grid}>
        {MOOD_OPTIONS.map((option) => (
          <MoodItem
            key={option.value}
            item={option}
            isSelected={selectedMood === option.value}
            onSelect={onSelect}
          />
        ))}
      </View>

      {/* Optional Intensity Selector */}
      {showIntensity && selectedMood && (
        <View style={styles.intensityContainer}>
          <View style={styles.intensityHeader}>
            <Typography variant="bodySemiBold">Intensity</Typography>
            <Typography variant="h2" color={Colors.light.primary}>
              {intensity}
            </Typography>
          </View>

          <View style={styles.numberRow}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.numberButton,
                  intensity === num && styles.numberButtonSelected,
                ]}
                onPress={() => onIntensityChange?.(num)}
              >
                <Typography
                  variant="caption"
                  color={
                    intensity === num
                      ? Colors.light.neutral
                      : Colors.light.textSecondary
                  }
                  style={{ fontWeight: intensity === num ? "bold" : "normal" }}
                >
                  {num}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.intensityLabels}>
            <Typography variant="caption" color={Colors.light.textSecondary}>
              Mild
            </Typography>
            <Typography variant="caption" color={Colors.light.textSecondary}>
              Intense
            </Typography>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: Spacing.sm,
  },
  title: {
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.md,
  },
  itemContainer: {
    alignItems: "center",
    width: ITEM_WIDTH,
    marginBottom: Spacing.sm,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    textAlign: "center",
  },
  // Intensity Styles
  intensityContainer: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  intensityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  numberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  numberButton: {
    width: 28,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#F5F5F5",
  },
  numberButtonSelected: {
    backgroundColor: Colors.light.primary,
    transform: [{ scale: 1.1 }],
  },
  intensityLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xs,
  },
});
